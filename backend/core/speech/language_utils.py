def detect_script(text: str) -> str:
    for char in text:
        code = ord(char)
        if 0x0900 <= code <= 0x097F:
            return "devanagari"
        if 0x0C80 <= code <= 0x0CFF:
            return "kannada"
    return "latin"

def is_hinglish(text: str) -> bool:
    text_lower = text.lower()
    hindi_words = ["mujhe", "karo", "hai", "hoon", "aur", "mein", "mera", "nahi", "kya"]
    has_hindi = any(word in text_lower for word in hindi_words)
    
    script = detect_script(text)
    if script == "latin" and has_hindi:
        return True
    return False

def is_kanglish(text: str) -> bool:
    text_lower = text.lower()
    kannada_words = ["nim", "namma", "illa", "enu", "alli", "ide", "beku", "beda"]
    has_kannada = any(word in text_lower for word in kannada_words)
    
    script = detect_script(text)
    if script == "latin" and has_kannada:
        return True
    return False

def normalize_language_code(detected: str) -> str:
    if not detected:
        return "en"
    code = detected.split("-")[0].lower()
    
    valid_codes = ["hi", "kn", "en", "te", "ta", "mr", "gu", "bn"]
    if code in valid_codes:
        return code
    return "en"
