import os
import tempfile
import logging
import asyncio
import httpx
import time
from typing import Dict, Any, Optional
from openai import AsyncOpenAI

from config import get_settings
from .language_utils import normalize_language_code

# Custom Exceptions
class AudioTooShortError(Exception): pass
class AudioTooLargeError(Exception): pass
class TranscriptionFailedError(Exception): pass
class EmotionDetectionFailedError(Exception): pass

logger = logging.getLogger(__name__)

class SpeechProcessor:
    def __init__(self):
        settings = get_settings()
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.hume_api_key = settings.HUME_API_KEY
        
        self.supported_languages = ["hi", "kn", "en", "te", "ta", "mr", "gu", "bn"]
        self.language_mapping = {
            "hi": "hindi", "kn": "kannada", "en": "english", 
            "te": "telugu", "ta": "tamil", "mr": "marathi",
            "gu": "gujarati", "bn": "bengali"
        }

    def validate_audio(self, audio_bytes: bytes) -> Dict[str, Any]:
        size = len(audio_bytes)
        if size < 1000:
            return {"valid": False, "reason": "Audio too short (less than 1KB)"}
        if size > 25 * 1024 * 1024:
            return {"valid": False, "reason": "Audio too large (exceeds 25MB)"}
        return {"valid": True, "reason": "Valid audio"}

    async def transcribe_audio(self, audio_bytes: bytes, hint_language: Optional[str] = None) -> Dict[str, Any]:
        temp_file_path = ""
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
                tmp_file.write(audio_bytes)
                temp_file_path = tmp_file.name

            with open(temp_file_path, "rb") as audio_file:
                kwargs = {
                    "model": "whisper-1",
                    "file": audio_file,
                    "response_format": "verbose_json"
                }
                if hint_language and hint_language in self.supported_languages:
                    kwargs["language"] = hint_language

                response = await self.openai_client.audio.transcriptions.create(**kwargs)
            
            response_dict = response.model_dump() if hasattr(response, "model_dump") else dict(response)

            text = response_dict.get("text", "")
            lang_code = response_dict.get("language", "en")
            
            lang_code = normalize_language_code(lang_code)
            lang_name = self.language_mapping.get(lang_code, "unknown")
            duration = response_dict.get("duration", 0.0)

            logger.info(f"Transcribed {duration}s audio in {lang_name}")

            return {
                "success": True,
                "text": text,
                "language_code": lang_code,
                "language_name": lang_name,
                "confidence": 0.95,
                "duration_seconds": duration,
                "error": None
            }

        except Exception as e:
            logger.error(f"Transcription failed: {str(e)}")
            return {
                "success": False,
                "text": "",
                "language_code": "en",
                "language_name": "english",
                "confidence": 0.0,
                "duration_seconds": 0.0,
                "error": str(e)
            }
        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    async def detect_emotion_from_audio(self, audio_bytes: bytes) -> Dict[str, Any]:
        temp_file_path = ""
        try:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
                tmp_file.write(audio_bytes)
                temp_file_path = tmp_file.name

            url = "https://api.hume.ai/v0/batch/jobs"
            headers = {"X-Hume-Api-Key": self.hume_api_key}
            
            async with httpx.AsyncClient() as client:
                with open(temp_file_path, "rb") as f:
                    files = {"file": f}
                    data = {"models": '{"prosody": {}}'}
                    response = await client.post(url, headers=headers, data=data, files=files)
                
                if response.status_code != 200:
                    raise EmotionDetectionFailedError(f"Hume API Error: {response.text}")
                
                job_id = response.json().get("job_id")
                
                poll_url = f"https://api.hume.ai/v0/batch/jobs/{job_id}"
                max_retries = 15
                for _ in range(max_retries):
                    await asyncio.sleep(2)
                    status_resp = await client.get(poll_url, headers=headers)
                    if status_resp.status_code == 200:
                        status_data = status_resp.json()
                        state = status_data.get("state", {}).get("status")
                        if state == "COMPLETED":
                            pred_url = f"{poll_url}/predictions"
                            pred_resp = await client.get(pred_url, headers=headers)
                            predictions = pred_resp.json()
                            break
                        elif state == "FAILED":
                            raise EmotionDetectionFailedError("Hume AI job failed")
                else:
                    raise EmotionDetectionFailedError("Hume AI job timed out")
            
            emotions = {}
            try:
                raw_emotions = predictions[0]['results']['predictions'][0]['models']['prosody']['grouped_predictions'][0]['predictions'][0]['emotions']
                for e in raw_emotions:
                    emotions[e['name']] = e['score']
            except (KeyError, IndexError, TypeError):
                emotions = {}

            if not emotions:
                raise EmotionDetectionFailedError("No emotions parsed")

            fear = emotions.get("Fear", 0.0)
            terror = emotions.get("Terror", 0.0)
            horror = emotions.get("Horror", 0.0)
            distress = emotions.get("Distress", 0.0)
            sadness = emotions.get("Sadness", 0.0)

            if fear > 0.6 or terror > 0.6 or horror > 0.6:
                emotion_level = "panic"
                urgency = 4
            elif fear > 0.35 or distress > 0.6:
                emotion_level = "distressed"
                urgency = 3
            elif distress > 0.3 or sadness > 0.5:
                emotion_level = "concerned"
                urgency = 2
            else:
                emotion_level = "calm"
                urgency = 1

            dominant_emotion = max(emotions.items(), key=lambda x: x[1])[0] if emotions else "Unknown"

            return {
                "success": True,
                "emotion_level": emotion_level,
                "emotion_score": max(fear, terror, horror, distress, sadness, 0.1),
                "urgency_level": urgency,
                "raw_emotions": emotions,
                "dominant_emotion": dominant_emotion,
                "error": None
            }
                
        except Exception as e:
            logger.error(f"Emotion detection failed: {e}")
            return {
                "success": False,
                "emotion_level": "calm",
                "emotion_score": 0.0,
                "urgency_level": 1,
                "raw_emotions": {},
                "dominant_emotion": "Unknown",
                "error": str(e)
            }
        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    async def detect_emotion_from_text(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        
        panic_keywords = [
            "bachao", "help me", "maar dega", "jan le ga", "please help",
            "bachao bachao", "death", "marne wala", "nahi bachungi",
            "hodeyuttare", "uttara", "please please"
        ]
        
        distressed_keywords = [
            "maar raha", "peet raha", "dara raha", "threat", "rona",
            "ro rahi", "dara", "bhay", "takleef", "dard", "beedubahudhu"
        ]
        
        concerned_keywords = [
            "problem", "samasya", "musibat", "pareshani", "need help",
            "madad", "help", "sahaaya", "complaint", "daraavna"
        ]

        panic_count = sum(1 for k in panic_keywords if k in text_lower)
        distress_count = sum(1 for k in distressed_keywords if k in text_lower)
        concerned_count = sum(1 for k in concerned_keywords if k in text_lower)

        if panic_count >= 2:
            emotion_level = "panic"
            urgency = 4
        elif panic_count >= 1 or distress_count >= 1:
            emotion_level = "distressed"
            urgency = 3
        elif concerned_count >= 1:
            emotion_level = "concerned"
            urgency = 2
        else:
            emotion_level = "calm"
            urgency = 1

        return {
            "success": True,
            "emotion_level": emotion_level,
            "emotion_score": 0.8 if urgency > 1 else 0.5,
            "urgency_level": urgency,
            "raw_emotions": {},
            "dominant_emotion": "TextBased",
            "error": None
        }

    async def process_call_audio(self, audio_bytes: bytes) -> Dict[str, Any]:
        start_time = time.time()
        
        val_res = self.validate_audio(audio_bytes)
        if not val_res["valid"]:
            return {"success": False, "errors": [val_res["reason"]]}

        transcribe_task = self.transcribe_audio(audio_bytes)
        emotion_task = self.detect_emotion_from_audio(audio_bytes)

        transcribe_res, emotion_res = await asyncio.gather(transcribe_task, emotion_task)

        emotion_source = "hume_ai"
        errors = []

        if not transcribe_res["success"]:
            errors.append(f"Transcription Error: {transcribe_res['error']}")
            
        if not emotion_res["success"]:
            errors.append(f"Hume AI Error: {emotion_res['error']}")
            emotion_res = await self.detect_emotion_from_text(transcribe_res["text"])
            emotion_source = "text_analysis"

        emotion = emotion_res["emotion_level"]
        if emotion == "panic":
            priority = "critical"
        elif emotion == "distressed":
            priority = "high"
        elif emotion == "concerned":
            priority = "medium"
        else:
            priority = "low"

        processing_time_ms = int((time.time() - start_time) * 1000)

        return {
            "success": transcribe_res["success"],
            "transcript": transcribe_res["text"],
            "language_code": transcribe_res["language_code"],
            "language_name": transcribe_res["language_name"],
            "transcription_confidence": transcribe_res["confidence"],
            "emotion_level": emotion_res["emotion_level"],
            "emotion_score": emotion_res["emotion_score"],
            "urgency_level": emotion_res["urgency_level"],
            "priority": priority,
            "processing_time_ms": processing_time_ms,
            "emotion_source": emotion_source,
            "errors": errors
        }
