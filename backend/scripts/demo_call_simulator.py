import argparse
import asyncio
import os
import sys
import time

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from core.speech.processor import SpeechProcessor
from core.intent.analyzer import IntentAnalyzer
from core.location.extractor import LocationExtractor
from core.response_builder import ResponseBuilder

async def simulate_call(text: str, language: str):
    print("═══════════════════════════════════════")
    print("🚨 RAKSHA AI — CALL SIMULATION")
    print("═══════════════════════════════════════")
    print(f"📞 Incoming call from: +919876543210")
    print(f"⏱️  Time: {time.strftime('%H:%M:%S')}\n")
    
    start_total = time.time()
    
    speech = SpeechProcessor()
    intent = IntentAnalyzer()
    loc = LocationExtractor()
    resp = ResponseBuilder()
    
    t0 = time.time()
    emotion_res = await speech.detect_emotion_from_text(text)
    t1 = time.time()
    print("🎤 STEP 1: Speech Processing")
    print(f"   ✅ Transcript: \"{text}\"")
    print(f"   ✅ Language: {language.capitalize()}")
    print(f"   ✅ Emotion: {emotion_res['emotion_level'].upper()} (score: {emotion_res['emotion_score']})")
    print(f"   ⏱️  Processing time: {t1-t0:.2f}s\n")
    
    t0 = time.time()
    intent_res = intent.keyword_fallback_intent(text, language)
    t1 = time.time()
    print("🧠 STEP 2: Intent Analysis")
    print(f"   ✅ Intent: {intent_res['intent_type'].replace('_', ' ').title()}")
    print(f"   ✅ Urgency: {intent_res['urgency'].upper()}")
    print(f"   ✅ Dispatch needed: {'YES' if intent_res['needs_immediate_dispatch'] else 'NO'}")
    print(f"   ⏱️  Processing time: {t1-t0:.2f}s\n")
    
    t0 = time.time()
    loc_res = loc.extract_from_text(text)
    t1 = time.time()
    print("📍 STEP 3: Location Extraction")
    loc_name = loc_res['best_guess'] if loc_res['found'] else "Unknown"
    print(f"   ✅ Location found: {loc_name.title()}")
    print(f"   ✅ Coordinates: Calculating...")
    print(f"   ⏱️  Processing time: {t1-t0:.2f}s\n")
    
    t0 = time.time()
    verify_msg = resp.build_verification_message(intent_res['intent_type'], loc_name, language, "RK20240115001")
    t1 = time.time()
    print("💬 STEP 4: Response Generation")
    print(f"   ✅ Verification: \"{verify_msg}\"")
    print(f"   ✅ Language: {language.capitalize()}\n")
    
    print("📋 STEP 5: Case Created")
    print(f"   ✅ Case ID: RK20240115001")
    print(f"   ✅ Priority: {intent_res['urgency'].upper()}")
    print(f"   ✅ Status: Pending Verification\n")
    
    if intent_res['needs_immediate_dispatch']:
        print("🚔 STEP 6: After Confirmation")
        print(f"   ✅ PCR Van Alpha-1 dispatched to {loc_name.title()}")
        print(f"   ✅ SMS sent to caller")
        print(f"   ✅ Case status: DISPATCHED\n")
    
    end_total = time.time()
    print("═══════════════════════════════════════")
    print(f"Total time: {end_total - start_total:.2f} seconds")
    print("═══════════════════════════════════════")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", type=str, default="Main Koramangala mein hoon, mera pati mujhe maar raha hai")
    parser.add_argument("--language", type=str, default="hindi")
    args = parser.parse_args()
    
    asyncio.run(simulate_call(args.text, args.language))
