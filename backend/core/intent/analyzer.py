import json
import logging
from typing import Dict, Any
from datetime import datetime
from openai import AsyncOpenAI

from config import get_settings

logger = logging.getLogger(__name__)

class IntentAnalyzer:
    SYSTEM_PROMPT = """
You are Raksha AI, the intelligent assistant for India's 1092 Women's 
Emergency Helpline. Your role is to analyze calls and extract critical 
information to help women in distress.

CALLER ANALYSIS TASK:
Analyze the caller's message and return a JSON object with these exact fields:

{
  "intent_type": "one of: domestic_violence | sexual_harassment | stalking | dowry_harassment | child_abuse | trafficking | general_distress | information_request | prank | unknown",
  "intent_confidence": 0.0 to 1.0,
  "urgency": "critical | high | medium | low",
  "needs_immediate_dispatch": true or false,
  "situation_summary": "2-3 sentence summary IN ENGLISH of the situation",
  "location": {
    "mentioned": true or false,
    "raw_text": "exact location words caller used",
    "area": "specific area/locality name if mentioned",
    "city": "city name if mentioned or infer from context",
    "landmarks": ["list", "of", "landmarks", "mentioned"],
    "confidence": 0.0 to 1.0
  },
  "caller_language": "hindi | kannada | english | hinglish | kanglish",
  "verification_message": "A SHORT message in THE CALLER'S LANGUAGE that: 1) acknowledges you heard them 2) restates their situation briefly 3) asks them to confirm with YES or NO",
  "response_after_confirm": "What to say AFTER they confirm, in their language: 1) Acknowledge their bravery in calling 2) Tell them help is being arranged 3) Tell them to stay on the line or stay safe 4) Give case ID placeholder [CASE_ID]",
  "response_if_deny": "What to say if they say NO to verification, asking them to explain again",
  "should_escalate_to_human": true or false,
  "escalation_reason": "why escalate, or null",
  "safety_tip": "One immediate safety tip in caller's language",
  "keywords_detected": ["list", "of", "key", "words", "that", "triggered", "this"]
}

LANGUAGE RULES (VERY IMPORTANT):
- If caller speaks Hindi -> respond in Hindi (Devanagari is fine)
- If caller speaks Kannada -> respond in Kannada  
- If caller speaks Hinglish -> respond in Hinglish (Roman Hindi + English)
- If caller speaks English -> respond in English
- ALWAYS match the caller's language and tone

URGENCY RULES:
- critical: immediate physical danger, weapon mentioned, kidnapping in progress
- high: ongoing violence, immediate threat, very distressed caller
- medium: recent violence, threat received, needs documentation
- low: information request, past incident, calm caller

ESCALATE TO HUMAN when:
- AI confidence < 0.6
- Caller is in immediate physical danger
- Child is involved
- Multiple callers or complex situation
- Caller explicitly asks for human
"""

    DOMESTIC_VIOLENCE_KEYWORDS = [
        "maar", "peet", "dhoka", "hurt", "husband", "pati",
        "ghar mein", "toda", "ghayal", "maar raha", "marpeet",
        "hodeyuttaare", "gothilla", "ganda", "gudisutte"
    ]
    STALKING_KEYWORDS = [
        "peecha", "follow", "stalk", "ghar ke bahar", "dekh raha",
        "road pe", "office ke bahar", "bekaar", "darr"  
    ]
    SEXUAL_HARASSMENT_KEYWORDS = [
        "galat kaam", "chhed", "haath lagaya", "ganda haath",
        "bura touch", "misbehave", "inappropriate"
    ]

    def __init__(self):
        settings = get_settings()
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def analyze(self, transcript: str, language: str, emotion_level: str, emotion_score: float) -> Dict[str, Any]:
        user_message = f"Transcript: {transcript}\nDetected Language: {language}\nEmotion Level: {emotion_level}\nEmotion Score: {emotion_score}\n"
        
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                temperature=0.2,
                response_format={"type": "json_object"},
                max_tokens=1000,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ]
            )
            
            raw_content = response.choices[0].message.content
            result = json.loads(raw_content)

            if emotion_level == "panic":
                result["urgency"] = "critical"
                result["needs_immediate_dispatch"] = True

            result["processing_timestamp"] = datetime.utcnow().isoformat()
            result["model_used"] = "gpt-4o-mini"
            result["emotion_factored"] = True
            
            return result
        except Exception as e:
            logger.error(f"Intent Analysis failed via API: {e}")
            return self.keyword_fallback_intent(transcript, language)

    def keyword_fallback_intent(self, transcript: str, language: str) -> Dict[str, Any]:
        text_lower = transcript.lower()
        dv_count = sum(1 for k in self.DOMESTIC_VIOLENCE_KEYWORDS if k in text_lower)
        st_count = sum(1 for k in self.STALKING_KEYWORDS if k in text_lower)
        sh_count = sum(1 for k in self.SEXUAL_HARASSMENT_KEYWORDS if k in text_lower)

        intent = "unknown"
        urgency = "low"
        needs_dispatch = False
        
        if dv_count > 0:
            intent = "domestic_violence"
            urgency = "high"
            needs_dispatch = True
        elif sh_count > 0:
            intent = "sexual_harassment"
            urgency = "high"
        elif st_count > 0:
            intent = "stalking"
            urgency = "medium"

        return {
            "intent_type": intent,
            "intent_confidence": 0.5,
            "urgency": urgency,
            "needs_immediate_dispatch": needs_dispatch,
            "situation_summary": "Fallback summary due to API failure.",
            "location": {"mentioned": False, "raw_text": "", "area": "", "city": "", "landmarks": [], "confidence": 0.0},
            "caller_language": language,
            "verification_message": "Did I understand correctly that you need help?",
            "response_after_confirm": "Help is on the way. Case ID: [CASE_ID]",
            "response_if_deny": "Please tell me again what happened.",
            "should_escalate_to_human": True,
            "escalation_reason": "API Failure",
            "safety_tip": "Stay safe.",
            "keywords_detected": [],
            "processing_timestamp": datetime.utcnow().isoformat(),
            "model_used": "keyword_fallback",
            "emotion_factored": False
        }

    async def generate_hindi_response(self, template: str, data: dict) -> str:
        return template.format(**data)

    async def generate_kannada_response(self, template: str, data: dict) -> str:
        return template.format(**data)
