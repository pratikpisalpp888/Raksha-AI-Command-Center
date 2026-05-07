from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from .connection import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, index=True)
    caller_phone = Column(String(20), nullable=False)
    caller_name = Column(String(100), nullable=True)
    language_detected = Column(String(20), nullable=False)
    raw_transcript = Column(Text, nullable=False)
    cleaned_transcript = Column(Text, nullable=True)
    emotion_level = Column(String(20), nullable=False)
    emotion_score = Column(Float, default=0.0)
    intent_type = Column(String(50), nullable=False)
    intent_confidence = Column(Float, default=0.0)
    location_raw = Column(Text, nullable=True)
    location_area = Column(String(200), nullable=True)
    location_city = Column(String(100), nullable=True)
    location_state = Column(String(100), default="Karnataka")
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    location_confidence = Column(Float, default=0.0)
    priority = Column(String(20), nullable=False, default="medium")
    status = Column(String(30), nullable=False, default="new")
    ai_summary = Column(Text, nullable=True)
    verification_question = Column(Text, nullable=True)
    caller_confirmed = Column(Boolean, default=False, nullable=True)
    sms_sent = Column(Boolean, default=False)
    sms_sent_at = Column(DateTime, nullable=True)
    escalated_to_human = Column(Boolean, default=False)
    escalated_at = Column(DateTime, nullable=True)
    help_dispatched = Column(Boolean, default=False)
    dispatched_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    agent_id = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    call_logs = relationship("CallLog", back_populates="case")

class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id = Column(String, ForeignKey("cases.id"), nullable=True)
    call_sid = Column(String(100), unique=True, index=True)
    caller_phone = Column(String(20))
    call_direction = Column(String(10), default="inbound")
    call_status = Column(String(30))
    call_duration = Column(Integer, nullable=True)
    audio_url = Column(String(500), nullable=True)
    ai_confidence_overall = Column(Float, default=0.0)
    processing_time_ms = Column(Integer, nullable=True)
    twilio_data = Column(JSON, nullable=True)
    error_log = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="call_logs")

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(200), unique=True, index=True)
    languages = Column(JSON) # Using JSON instead of ARRAY for SQLite compatibility
    is_active = Column(Boolean, default=True)
    is_available = Column(Boolean, default=True)
    current_case_id = Column(String, nullable=True)
    total_cases_handled = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class DispatchUnit(Base):
    __tablename__ = "dispatch_units"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    unit_name = Column(String(100))
    unit_type = Column(String(50))
    district = Column(String(100))
    phone = Column(String(20))
    is_available = Column(Boolean, default=True)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
