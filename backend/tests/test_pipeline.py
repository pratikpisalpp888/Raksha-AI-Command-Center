import pytest
import asyncio
from unittest.mock import AsyncMock, patch

from core.speech.processor import SpeechProcessor
from core.intent.analyzer import IntentAnalyzer
from core.location.extractor import LocationExtractor

@pytest.mark.asyncio
async def test_speech_processor():
    processor = SpeechProcessor()
    mock_audio = b'\x00' * 5000
    
    val = processor.validate_audio(mock_audio)
    assert val["valid"] == True
    
    emotion = await processor.detect_emotion_from_text("mera pati mujhe maar raha hai")
    assert emotion["emotion_level"] in ["distressed", "panic"]

@pytest.mark.asyncio
async def test_intent_analyzer():
    analyzer = IntentAnalyzer()
    
    hindi_res = analyzer.keyword_fallback_intent("Mera pati mujhe maar raha hai, main Koramangala mein hoon", "hindi")
    assert hindi_res["intent_type"] == "domestic_violence"
    assert hindi_res["urgency"] == "high"
    
    kan_res = analyzer.keyword_fallback_intent("Nanna ganda nanu hodeyuttaare", "kannada")
    assert kan_res["intent_type"] == "domestic_violence"

@pytest.mark.asyncio
async def test_location_extractor():
    extractor = LocationExtractor()
    
    r1 = extractor.extract_from_text("Main Koramangala 5th block mein hoon")
    assert "koramangala" in r1["all_locations"] or r1["best_guess"] == "koramangala"
    
    r2 = extractor.extract_from_text("HSR Layout mein mera ghar hai")
    assert "hsr layout" in r2["all_locations"] or r2["best_guess"] == "hsr layout"
    
    r3 = extractor.extract_from_text("BTM Layout 2nd stage")
    assert "btm layout" in r3["all_locations"] or r3["best_guess"] == "btm layout"

@pytest.mark.asyncio
async def test_full_pipeline():
    transcript = "Bachao mujhe koi follow kar raha hai Indiranagar mein"
    
    analyzer = IntentAnalyzer()
    extractor = LocationExtractor()
    
    intent = analyzer.keyword_fallback_intent(transcript, "hindi")
    location = extractor.extract_from_text(transcript)
    
    assert intent["intent_type"] == "stalking"
    assert "indiranagar" in location["all_locations"] or location["best_guess"] == "indiranagar"
