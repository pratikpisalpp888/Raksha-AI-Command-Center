import logging
from typing import Dict, Any, Optional
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather, Say, Play, Dial
from twilio.request_validator import RequestValidator

from config import get_settings

logger = logging.getLogger(__name__)

class TwilioService:
    def __init__(self):
        settings = get_settings()
        self.account_sid = settings.TWILIO_ACCOUNT_SID
        self.auth_token = settings.TWILIO_AUTH_TOKEN
        self.phone_number = settings.TWILIO_PHONE_NUMBER
        
        self.client = Client(self.account_sid, self.auth_token)
        self.validator = RequestValidator(self.auth_token)

    def validate_webhook(self, url: str, params: dict, signature: str) -> bool:
        is_valid = self.validator.validate(url, params, signature)
        if not is_valid:
            logger.warning(f"Invalid Twilio webhook attempt on URL: {url}")
        return is_valid

    def create_greeting_response(self, language: str = "hindi") -> str:
        response = VoiceResponse()
        gather = Gather(
            input='speech',
            action='/api/webhook/process-speech',
            speech_timeout="8",
            timeout=15
        )
        
        if language in ["hi", "hindi"]:
            gather.say("नमस्ते, आप राक्षा AI से जुड़े हैं, 1092 महिला हेल्पलाइन। कृपया बताएं, आपको किस प्रकार की सहायता चाहिए?", language="hi-IN")
        elif language in ["kn", "kannada"]:
            gather.say("ನಮಸ್ಕಾರ, ನೀವು ರಕ್ಷಾ AI ಜೊತೆ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದೀರಿ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ.", language="kn-IN")
        else:
            gather.say("Hello, you have reached Raksha AI 1092 Helpline. Please tell me your emergency.", language="en-IN")
            
        response.append(gather)
        response.redirect('/api/webhook/no-input')
        return str(response)

    def create_verification_response(self, verification_text: str, language: str) -> str:
        response = VoiceResponse()
        gather = Gather(
            input='speech',
            action='/api/webhook/confirm',
            timeout=10,
            speech_timeout="auto"
        )
        
        lang_code = "en-IN"
        if language in ["hi", "hindi"]: lang_code = "hi-IN"
        elif language in ["kn", "kannada"]: lang_code = "kn-IN"
            
        gather.say(verification_text, language=lang_code)
        response.append(gather)
        return str(response)

    def create_dispatch_confirmed_response(self, message: str, language: str) -> str:
        response = VoiceResponse()
        lang_code = "en-IN"
        if language in ["hi", "hindi"]: lang_code = "hi-IN"
        elif language in ["kn", "kannada"]: lang_code = "kn-IN"
        
        response.say(message, language=lang_code)
        response.pause(length=2)
        response.say("Goodbye, stay safe.", language="en-IN")
        response.hangup()
        return str(response)

    def create_escalation_response(self, language: str, agent_number: str) -> str:
        response = VoiceResponse()
        lang_code = "en-IN"
        if language in ["hi", "hindi"]: lang_code = "hi-IN"
        elif language in ["kn", "kannada"]: lang_code = "kn-IN"
        
        if lang_code == "hi-IN":
            response.say("कृपया प्रतीक्षा करें, हम आपको अधिकारी से जोड़ रहे हैं।", language=lang_code)
        else:
            response.say("Please wait while we connect you to an officer.", language=lang_code)
            
        dial = Dial(timeout=30)
        dial.number(agent_number)
        response.append(dial)
        response.say("The agent is currently unavailable. Please call back in a few minutes.", language="en-IN")
        return str(response)

    def create_error_response(self, language: str) -> str:
        response = VoiceResponse()
        response.say("We are experiencing technical difficulties. Please dial 100 or 112 immediately for police assistance.", language="en-IN")
        response.hangup()
        return str(response)

    async def make_outbound_call(self, to_number: str, message: str) -> Dict[str, Any]:
        try:
            call = self.client.calls.create(
                twiml=f'<Response><Say>{message}</Say></Response>',
                to=to_number,
                from_=self.phone_number
            )
            return {"success": True, "call_sid": call.sid, "error": None}
        except Exception as e:
            logger.error(f"Failed to make outbound call: {e}")
            return {"success": False, "call_sid": None, "error": str(e)}

    def send_sms(self, to_number: str, message: str, language: str = "hindi") -> Dict[str, Any]:
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_number
            )
            return {"success": True, "message_sid": message.sid, "error": None}
        except Exception as e:
            logger.error(f"Failed to send SMS: {e}")
            return {"success": False, "message_sid": None, "error": str(e)}
