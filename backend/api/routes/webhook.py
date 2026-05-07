from fastapi import APIRouter, Request, Response, BackgroundTasks, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import logging
from datetime import datetime
import json
import uuid

from config import get_settings
from database.connection import get_db
from database.models import Case, CallLog
from core.speech.processor import SpeechProcessor
from core.intent.analyzer import IntentAnalyzer
from core.location.extractor import LocationExtractor
from core.response_builder import ResponseBuilder
from services.twilio_service import TwilioService
from services.dispatch_service import DispatchService
from services.sms_service import SMSService
from services.session_service import SessionService

router = APIRouter(prefix="/api/webhook", tags=["webhook"])
logger = logging.getLogger(__name__)

twilio_service = TwilioService()
speech_processor = SpeechProcessor()
intent_analyzer = IntentAnalyzer()
location_extractor = LocationExtractor()
response_builder = ResponseBuilder()
dispatch_service = DispatchService()
sms_service = SMSService()
session_service = SessionService()
settings = get_settings()

def validate_twilio_request(request: Request):
    if settings.APP_ENV == "development":
        return True
    return True

@router.post("/voice")
async def handle_incoming_call(request: Request, db: AsyncSession = Depends(get_db)):
    validate_twilio_request(request)
    form_data = await request.form()
    
    caller_phone = form_data.get("From", "Unknown")
    call_sid = form_data.get("CallSid", "")
    
    logger.info(f"Incoming call from {caller_phone}, CallSid: {call_sid}")
    
    call_log = CallLog(
        call_sid=call_sid,
        caller_phone=caller_phone,
        call_status="in-progress",
        twilio_data=dict(form_data)
    )
    db.add(call_log)
    await db.commit()
    
    language = "hindi"
    twiml = twilio_service.create_greeting_response(language)
    return Response(content=twiml, media_type="application/xml")

@router.post("/process-speech")
async def process_speech(request: Request, db: AsyncSession = Depends(get_db)):
    validate_twilio_request(request)
    form_data = await request.form()
    
    speech_result = form_data.get("SpeechResult", "").strip()
    call_sid = form_data.get("CallSid", "")
    caller_phone = form_data.get("From", "")
    recording_url = form_data.get("RecordingUrl", "")
    
    logger.info(f"Processing speech from {caller_phone}: {speech_result[:50]}...")
    
    if not speech_result and not recording_url:
        twiml = twilio_service.create_error_response("en")
        return Response(content=twiml, media_type="application/xml")
        
    transcript = speech_result
    
    emotion_data = await speech_processor.detect_emotion_from_text(transcript)
    emotion_level = emotion_data["emotion_level"]
    emotion_score = emotion_data["emotion_score"]
    
    intent_data = await intent_analyzer.analyze(transcript, "hindi", emotion_level, emotion_score)
    location_data = await location_extractor.process_location(transcript)
    
    today_str = datetime.now().strftime("%Y%m%d")
    seq = str(uuid.uuid4().int)[:4]
    new_id = f"RK{today_str}{seq}"
    
    loc_area = location_data.get("extracted", {}).get("best_guess", "")
    loc_lat = location_data.get("geocoded", {}).get("lat") if location_data.get("geocoded") else None
    loc_lng = location_data.get("geocoded", {}).get("lng") if location_data.get("geocoded") else None
    
    new_case = Case(
        id=new_id,
        caller_phone=caller_phone,
        raw_transcript=transcript,
        language_detected=intent_data.get("caller_language", "hindi"),
        emotion_level=emotion_level,
        intent_type=intent_data.get("intent_type", "unknown"),
        location_raw=intent_data.get("location", {}).get("raw_text", ""),
        location_area=loc_area,
        location_lat=loc_lat,
        location_lng=loc_lng,
        priority=intent_data.get("urgency", "medium"),
        status="ai_processing",
        ai_summary=intent_data.get("situation_summary", ""),
        verification_question=intent_data.get("verification_message", "")
    )
    db.add(new_case)
    
    from sqlalchemy import select
    call_log = await db.execute(select(CallLog).where(CallLog.call_sid == call_sid))
    log = call_log.scalar_one_or_none()
    if log:
        log.case_id = new_id
    
    await db.commit()
    
    session_service.store_session(call_sid, {
        "case_id": new_id,
        "transcript": transcript,
        "intent": intent_data,
        "location": location_data
    })
    
    v_msg = intent_data.get("verification_message", "Did I understand correctly? Say Yes or No.")
    twiml = twilio_service.create_verification_response(v_msg, intent_data.get("caller_language", "hi"))
    
    return Response(content=twiml, media_type="application/xml")

@router.post("/confirm")
async def confirm_case(request: Request, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    validate_twilio_request(request)
    form_data = await request.form()
    
    speech_result = form_data.get("SpeechResult", "").lower()
    call_sid = form_data.get("CallSid", "")
    caller_phone = form_data.get("From", "")
    
    session_data = session_service.get_session(call_sid)
    if not session_data:
        twiml = twilio_service.create_error_response("hi")
        return Response(content=twiml, media_type="application/xml")
        
    case_id = session_data["case_id"]
    intent_data = session_data["intent"]
    
    affirmative_words = ["haan", "ha", "yes", "sahi", "correct", "theek", "ji", "bilkul", "confirmed", "haa", "ho", "true", "right", "aur", "please", "hullu"]
    
    is_confirmed = any(word in speech_result for word in affirmative_words)
    
    case = await db.get(Case, case_id)
    if not case:
        twiml = twilio_service.create_error_response("hi")
        return Response(content=twiml, media_type="application/xml")
        
    language = intent_data.get("caller_language", "hi")
    
    if is_confirmed:
        case.status = "pending_verification"
        case.caller_confirmed = True
        await db.commit()
        
        if intent_data.get("needs_immediate_dispatch", False):
            await dispatch_service.dispatch_help(case_id)
            
        location_area = case.location_area or "your location"
        sms_service.send_case_confirmation(caller_phone, case_id, location_area, language)
        case.sms_sent = True
        
        await db.commit()
        
        twiml = twilio_service.create_dispatch_confirmed_response(intent_data.get("response_after_confirm", "Help is on the way."), language)
    else:
        if intent_data.get("should_escalate_to_human", False):
            case.status = "human_escalated"
            case.escalated_to_human = True
            await db.commit()
            twiml = twilio_service.create_escalation_response(language, "+919876543210")
        else:
            twiml = twilio_service.create_greeting_response(language)
            
    session_service.delete_session(call_sid)
    return Response(content=twiml, media_type="application/xml")

@router.post("/no-input")
async def no_input(request: Request):
    validate_twilio_request(request)
    form_data = await request.form()
    call_sid = form_data.get("CallSid", "")
    
    attempts = session_service.redis_client.incr(f"attempts:{call_sid}")
    if attempts == 1:
        session_service.redis_client.expire(f"attempts:{call_sid}", 3600)
        
    if attempts < 3:
        response = twilio_service.create_greeting_response("hi")
    else:
        response = twilio_service.create_escalation_response("hi", "+919876543210")
        
    return Response(content=response, media_type="application/xml")

@router.post("/recording")
async def process_recording(request: Request, db: AsyncSession = Depends(get_db)):
    form_data = await request.form()
    call_sid = form_data.get("CallSid", "")
    recording_url = form_data.get("RecordingUrl", "")
    
    from sqlalchemy import select
    call_log = await db.execute(select(CallLog).where(CallLog.call_sid == call_sid))
    log = call_log.scalar_one_or_none()
    if log:
        log.audio_url = recording_url
        await db.commit()
        
    return Response(status_code=200)

@router.post("/call-status")
async def call_status(request: Request, db: AsyncSession = Depends(get_db)):
    form_data = await request.form()
    call_sid = form_data.get("CallSid", "")
    status = form_data.get("CallStatus", "")
    duration = form_data.get("CallDuration", None)
    
    from sqlalchemy import select
    call_log = await db.execute(select(CallLog).where(CallLog.call_sid == call_sid))
    log = call_log.scalar_one_or_none()
    if log:
        log.call_status = status
        if duration:
            log.call_duration = int(duration)
        await db.commit()
        
    return Response(status_code=200)
