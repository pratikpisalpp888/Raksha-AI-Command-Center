class ResponseBuilder:
    GREETING_HINDI = """
नमस्ते, आप राक्षा AI से जुड़े हैं, 1092 महिला हेल्पलाइन।
मैं यहाँ आपकी मदद करने के लिए हूँ।
कृपया बताएं, आपको किस प्रकार की सहायता चाहिए?
"""

    GREETING_KANNADA = """
ನಮಸ್ಕಾರ, ನೀವು ರಕ್ಷಾ AI ಜೊತೆ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದೀರಿ, 1092 ಮಹಿಳಾ ಹೆಲ್ಪ್ಲೈನ್.
ನಾನು ನಿಮ್ಮ ಸಹಾಯಕ್ಕಾಗಿ ಇಲ್ಲಿದ್ದೇನೆ.
ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ.
"""

    GREETING_ENGLISH = """
Hello, you've reached Raksha AI, the 1092 Women's Helpline.
I am here to help you.
Please tell me what kind of assistance you need.
"""

    DISPATCH_CONFIRMED_HINDI = """
आपकी शिकायत दर्ज हो गई है। Case ID: {case_id}।
सहायता {location} की ओर भेजी जा रही है।
आपके फोन पर SMS भेजा गया है।
कृपया सुरक्षित रहें और दरवाज़ा बंद रखें।
अगर खतरा बढ़े तो 100 (पुलिस) डायल करें।
"""

    DISPATCH_CONFIRMED_KANNADA = """
ನಿಮ್ಮ ದೂರು ದಾಖಲಾಗಿದೆ. Case ID: {case_id}.
ಸಹಾಯವನ್ನು {location} ಗೆ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ.
ನಿಮ್ಮ ಫೋನ್‌ಗೆ SMS ಕಳುಹಿಸಲಾಗಿದೆ.
ದಯವಿಟ್ಟು ಸುರಕ್ಷಿತವಾಗಿರಿ ಮತ್ತು ಬಾಗಿಲು ಮುಚ್ಚಿ.
ಅಪಾಯ ಹೆಚ್ಚಾದರೆ 100 (ಪೊಲೀಸ್) ಡಯಲ್ ಮಾಡಿ.
"""

    DISPATCH_CONFIRMED_ENGLISH = """
Your complaint has been registered. Case ID: {case_id}.
Help is being dispatched to {location}.
An SMS has been sent to your phone.
Please stay safe and keep the door locked.
If the danger increases, dial 100 (Police).
"""

    ESCALATION_MESSAGE_HINDI = """
मैं आपको अभी हमारे अधिकारी से जोड़ रही हूँ।
कृपया 30 सेकंड प्रतीक्षा करें।
आपकी सारी जानकारी उन्हें मिल गई है।
आपको दोबारा सब कुछ बताने की ज़रूरत नहीं है।
"""

    ESCALATION_MESSAGE_KANNADA = """
ನಾನು ಈಗ ನಿಮ್ಮನ್ನು ನಮ್ಮ ಅಧಿಕಾರಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದೇನೆ.
ದಯವಿಟ್ಟು 30 ಸೆಕೆಂಡುಗಳ ಕಾಲ ಕಾಯಿರಿ.
ನಿಮ್ಮ ಎಲ್ಲಾ ಮಾಹಿತಿ ಅವರಿಗೆ ಸಿಕ್ಕಿದೆ.
ನೀವು ಎಲ್ಲವನ್ನೂ ಮತ್ತೆ ಹೇಳುವരുവ ಅಗತ್ಯವಿಲ್ಲ.
"""

    ESCALATION_MESSAGE_ENGLISH = """
I am connecting you to our human officer now.
Please wait 30 seconds.
They have received all your information.
You do not need to repeat everything.
"""

    def build_verification_message(self, intent: str, location: str, language: str, case_id: str) -> str:
        return f"I understand you are reporting {intent} near {location}. Please say YES to confirm. Case ID is {case_id}."

    def build_dispatch_message(self, location: str, language: str, case_id: str) -> str:
        if language == "hi" or language == "hindi":
            return self.DISPATCH_CONFIRMED_HINDI.format(case_id=case_id, location=location)
        elif language == "kn" or language == "kannada":
            return self.DISPATCH_CONFIRMED_KANNADA.format(case_id=case_id, location=location)
        else:
            return self.DISPATCH_CONFIRMED_ENGLISH.format(case_id=case_id, location=location)

    def build_sms_message(self, case_id: str, location: str, language: str) -> str:
        return f"Raksha AI 1092 Helpline: Emergency response initiated. Case ID: {case_id}. Police dispatched to {location}. Stay safe."

    def build_escalation_message(self, language: str) -> str:
        if language == "hi" or language == "hindi":
            return self.ESCALATION_MESSAGE_HINDI
        elif language == "kn" or language == "kannada":
            return self.ESCALATION_MESSAGE_KANNADA
        else:
            return self.ESCALATION_MESSAGE_ENGLISH

    def build_greeting(self, language: str) -> str:
        if language == "hi" or language == "hindi":
            return self.GREETING_HINDI
        elif language == "kn" or language == "kannada":
            return self.GREETING_KANNADA
        else:
            return self.GREETING_ENGLISH
