from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

from database.connection import get_db
from database.models import Case

router = APIRouter(prefix="/api/cases", tags=["cases"])

# --- SCHEMAS ---

class CaseCreate(BaseModel):
    caller_phone: str
    raw_transcript: str
    language_detected: str
    emotion_level: str
    intent_type: str
    location_raw: Optional[str] = None
    location_area: Optional[str] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = "Karnataka"
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    location_confidence: Optional[float] = 0.0
    priority: str = "medium"
    ai_summary: Optional[str] = None
    caller_confirmed: Optional[bool] = None
    sms_sent: Optional[bool] = None

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    ai_summary: Optional[str] = None
    priority: Optional[str] = None
    caller_confirmed: Optional[bool] = None
    sms_sent: Optional[bool] = None
    help_dispatched: Optional[bool] = None
    escalated_to_human: Optional[bool] = None

class CaseResponse(BaseModel):
    id: str
    caller_phone: str
    caller_name: Optional[str] = None
    language_detected: str
    raw_transcript: str
    emotion_level: str
    intent_type: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime
    location_raw: Optional[str] = None
    location_area: Optional[str] = None
    location_city: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    ai_summary: Optional[str] = None
    notes: Optional[str] = None
    caller_confirmed: Optional[bool] = None
    sms_sent: Optional[bool] = None
    help_dispatched: Optional[bool] = None
    escalated_to_human: Optional[bool] = None

    class Config:
        from_attributes = True

    def model_dump(self, *args, **kwargs):
        d = super().model_dump(*args, **kwargs)
        if d.get("caller_phone") and len(d["caller_phone"]) >= 4:
            d["caller_phone"] = f"+91XXXXX{d['caller_phone'][-4:]}"
        return d

class CaseListResponse(BaseModel):
    items: List[CaseResponse]
    total: int
    limit: int
    offset: int

class CaseStats(BaseModel):
    total_calls: int
    by_emotion: Dict[str, int]
    by_intent: Dict[str, int]
    by_status: Dict[str, int]
    by_priority: Dict[str, int]
    avg_response_time_seconds: float
    escalated_to_human: int
    sms_sent: int

# --- ENDPOINTS ---

@router.post("", response_model=CaseResponse, status_code=201)
async def create_case(case_data: CaseCreate, db: AsyncSession = Depends(get_db)):
    """Create a new emergency case."""
    today_str = datetime.now().strftime("%Y%m%d")
    
    # Get count for today to generate sequence 
    stmt = select(func.count(Case.id)).where(Case.id.startswith(f"RK{today_str}"))
    result = await db.execute(stmt)
    count_today = result.scalar() or 0
    
    seq = str(count_today + 1).zfill(4)
    new_id = f"RK{today_str}{seq}"

    new_case = Case(
        id=new_id,
        caller_phone=case_data.caller_phone,
        raw_transcript=case_data.raw_transcript,
        language_detected=case_data.language_detected,
        emotion_level=case_data.emotion_level,
        intent_type=case_data.intent_type,
        location_raw=case_data.location_raw,
        location_area=case_data.location_area,
        location_city=case_data.location_city,
        location_state=case_data.location_state,
        location_lat=case_data.location_lat,
        location_lng=case_data.location_lng,
        location_confidence=case_data.location_confidence,
        priority=case_data.priority,
        ai_summary=case_data.ai_summary,
        caller_confirmed=case_data.caller_confirmed,
        sms_sent=case_data.sms_sent,
        status="new"
    )
    db.add(new_case)
    await db.commit()
    await db.refresh(new_case)
    return new_case

@router.patch("/{case_id}", response_model=CaseResponse)
async def update_case_generic(case_id: str, updates: CaseUpdate, db: AsyncSession = Depends(get_db)):
    """Update generic case fields."""
    stmt = select(Case).where(Case.id == case_id)
    result = await db.execute(stmt)
    db_case = result.scalar_one_or_none()
    
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    update_data = updates.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_case, key, value)
        
    await db.commit()
    await db.refresh(db_case)
    return db_case

@router.get("", response_model=CaseListResponse)
async def list_cases(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    emotion_level: Optional[str] = None,
    intent_type: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """List all cases with filters."""
    try:
        conditions = []
        if status: conditions.append(Case.status == status)
        if priority: conditions.append(Case.priority == priority)
        if emotion_level: conditions.append(Case.emotion_level == emotion_level)
        if intent_type: conditions.append(Case.intent_type == intent_type)
        if date_from: conditions.append(Case.created_at >= date_from)
        if date_to: conditions.append(Case.created_at <= date_to)

        count_stmt = select(func.count(Case.id))
        if conditions: count_stmt = count_stmt.where(and_(*conditions))
        total = await db.scalar(count_stmt)

        stmt = select(Case).order_by(Case.created_at.desc()).limit(limit).offset(offset)
        if conditions: stmt = stmt.where(and_(*conditions))
        
        result = await db.execute(stmt)
        items = result.scalars().all()
        
        return CaseListResponse(
            items=items,
            total=total,
            limit=limit,
            offset=offset
        )
    except Exception as e:
        print(f"⚠️ List Cases Error: {e}")
        return CaseListResponse(items=[], total=0, limit=limit, offset=offset)

@router.get("/stats/today", response_model=CaseStats)
async def get_today_stats(db: AsyncSession = Depends(get_db)):
    """Get statistics for today's cases."""
    today = datetime.utcnow().date()
    stmt = select(Case).where(func.date(Case.created_at) == today)
    result = await db.execute(stmt)
    cases = result.scalars().all()

    stats = CaseStats(
        total_calls=len(cases),
        by_emotion={"calm": 0, "concerned": 0, "distressed": 0, "panic": 0},
        by_intent={},
        by_status={"new": 0, "dispatched": 0, "resolved": 0},
        by_priority={"low": 0, "medium": 0, "high": 0, "critical": 0},
        avg_response_time_seconds=0.0,
        escalated_to_human=0,
        sms_sent=0
    )

    for case in cases:
        if case.emotion_level in stats.by_emotion:
            stats.by_emotion[case.emotion_level] += 1
        stats.by_intent[case.intent_type] = stats.by_intent.get(case.intent_type, 0) + 1
        if case.status in stats.by_status:
            stats.by_status[case.status] += 1
        if case.priority in stats.by_priority:
            stats.by_priority[case.priority] += 1
        if case.escalated_to_human: stats.escalated_to_human += 1
        if case.sms_sent: stats.sms_sent += 1

    return stats

@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: str, db: AsyncSession = Depends(get_db)):
    """Get single case by ID."""
    stmt = select(Case).where(Case.id == case_id)
    result = await db.execute(stmt)
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.patch("/{case_id}/status", response_model=CaseResponse)
async def update_case_status(case_id: str, update_data: CaseUpdate, db: AsyncSession = Depends(get_db)):
    """Update case status."""
    stmt = select(Case).where(Case.id == case_id)
    result = await db.execute(stmt)
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if update_data.status:
        case.status = update_data.status
        if update_data.status == "dispatched":
            case.help_dispatched = True
            case.dispatched_at = datetime.utcnow()
    if update_data.notes:
        case.notes = update_data.notes
        
    await db.commit()
    await db.refresh(case)
    return case

@router.patch("/{case_id}/resolve", response_model=CaseResponse)
async def resolve_case(case_id: str, db: AsyncSession = Depends(get_db)):
    """Mark case as resolved."""
    stmt = select(Case).where(Case.id == case_id)
    result = await db.execute(stmt)
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    case.status = "resolved"
    case.resolved_at = datetime.utcnow()
    await db.commit()
    await db.refresh(case)
    return case
