"""
RAKSHA AI — Simulation Endpoint
Provides /api/simulate/emergency for demo/fallback mode.
Uses the 20-case bank with randomization (no repeats per session).
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime
from typing import Optional
import json

from database.connection import get_db
from database.models import Case
from core.case_bank import get_random_case, reset_session, get_case_count, CASE_BANK

router = APIRouter(prefix="/api/simulate", tags=["simulation"])


async def process_emergency_call(case_data: dict, db: AsyncSession) -> dict:
    """
    ─── SHARED CORE PROCESSOR ───
    Both real Twilio calls AND simulations use this function.
    Creates the DB case, broadcasts via WebSocket, returns the case dict.
    """
    from api.routes.dashboard import manager  # import here to avoid circular

    today_str = datetime.now().strftime("%Y%m%d")
    stmt = select(func.count(Case.id)).where(Case.id.startswith(f"RK{today_str}"))
    result = await db.execute(stmt)
    count_today = result.scalar() or 0
    seq = str(count_today + 1).zfill(4)
    new_id = f"RK{today_str}{seq}"

    new_case = Case(
        id=new_id,
        caller_phone=case_data.get("caller_phone", "+91XXXXX00000"),
        raw_transcript=case_data.get("raw_transcript", ""),
        language_detected=case_data.get("language_detected", "Hindi"),
        emotion_level=case_data.get("emotion_level", "distressed"),
        intent_type=case_data.get("intent_type", "harassment"),
        location_raw=case_data.get("location_raw"),
        location_area=case_data.get("location_area"),
        location_city=case_data.get("location_city"),
        location_state=case_data.get("location_state", "Maharashtra"),
        location_lat=case_data.get("location_lat"),
        location_lng=case_data.get("location_lng"),
        location_confidence=case_data.get("location_confidence", 0.95),
        priority=case_data.get("priority", "high"),
        ai_summary=case_data.get("ai_summary"),
        notes=json.dumps(case_data.get("nearby_station")) if case_data.get("nearby_station") else None,
        status="new",
    )
    db.add(new_case)
    await db.commit()
    await db.refresh(new_case)

    # ── Broadcast to all connected dashboard WebSocket clients ──
    alert_payload = {
        "type": "new_case",
        "case": {
            "id": new_case.id,
            "caller_phone": f"+91XXXXX{new_case.caller_phone[-4:]}",
            "intent_type": new_case.intent_type,
            "emotion_level": new_case.emotion_level,
            "priority": new_case.priority,
            "location_area": new_case.location_area,
            "location_city": new_case.location_city,
            "location_lat": new_case.location_lat,
            "location_lng": new_case.location_lng,
            "raw_transcript": new_case.raw_transcript,
            "ai_summary": new_case.ai_summary,
            "status": new_case.status,
            "created_at": new_case.created_at.isoformat(),
        }
    }
    await manager.broadcast(json.dumps(alert_payload))

    return alert_payload["case"]


# ─── ENDPOINTS ────────────────────────────────────────────────────────────────

@router.post("/emergency")
async def simulate_emergency(
    priority: Optional[str] = Query(None, description="Filter by priority: low, medium, high, critical"),
    db: AsyncSession = Depends(get_db)
):
    """
    Triggers a random emergency case from the 20-case bank.
    Never repeats the same case twice in a session.
    Falls back to full reset when all cases are exhausted.
    """
    case_data = get_random_case(priority_filter=priority)
    processed = await process_emergency_call(case_data, db)
    
    return {
        "success": True,
        "message": f"🚨 Emergency simulated: {case_data['intent_type']} in {case_data['location_area']}",
        "case": processed,
        "mode": "simulation",
        "cases_in_bank": get_case_count()
    }


@router.post("/reset-session")
async def reset_demo_session():
    """Resets the session so all 20 cases become available again."""
    reset_session()
    return {
        "success": True,
        "message": "Demo session reset. All 20 cases are available again.",
        "cases_available": get_case_count()
    }


@router.get("/case-bank")
async def list_case_bank():
    """Returns the full case bank metadata (for admin/debug)."""
    return {
        "total": get_case_count(),
        "cases": [
            {
                "index": i,
                "intent_type": c["intent_type"],
                "location_area": c["location_area"],
                "priority": c["priority"],
                "language": c["language_detected"],
                "emotion": c["emotion_level"]
            }
            for i, c in enumerate(CASE_BANK)
        ]
    }


@router.post("/high-priority")
async def simulate_high_priority_emergency(db: AsyncSession = Depends(get_db)):
    """Immediately triggers a CRITICAL case for dramatic demo effect."""
    case_data = get_random_case(priority_filter="critical")
    processed = await process_emergency_call(case_data, db)
    
    return {
        "success": True,
        "message": f"🔴 CRITICAL ALERT simulated: {case_data['intent_type']} in {case_data['location_area']}",
        "case": processed,
        "mode": "simulation_critical"
    }
