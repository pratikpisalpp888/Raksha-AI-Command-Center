import logging
from typing import Dict, Any
from .twilio_service import TwilioService

logger = logging.getLogger(__name__)

class SMSService:
    def __init__(self):
        self.twilio_service = TwilioService()

    def send_case_confirmation(self, phone: str, case_id: str, location: str, language: str) -> bool:
        if language in ["hi", "hindi"]:
            msg = f"[राक्षा AI] Case {case_id} दर्ज हुई। {location} में सहायता भेजी जा रही है। आपातकाल में 100 डायल करें। - 1092 हेल्पलाइन"
        elif language in ["kn", "kannada"]:
            msg = f"[ರಕ್ಷಾ AI] Case {case_id} ದಾಖಲಾಗಿದೆ. {location} ಗೆ ಸಹಾಯ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ. ತುರ್ತಿಗೆ 100 ಡಯಲ್ ಮಾಡಿ. - 1092 Helpline"
        else:
            msg = f"[Raksha AI] Case {case_id} registered. Help dispatched to {location}. Call 100 for police. - 1092 Helpline"
            
        result = self.twilio_service.send_sms(phone, msg)
        return result["success"]

    def send_escalation_notification(self, agent_phone: str, case_id: str, summary: str) -> bool:
        msg = f"URGENT: Case {case_id} escalated. Summary: {summary}. Please review dashboard immediately."
        result = self.twilio_service.send_sms(agent_phone, msg)
        return result["success"]
