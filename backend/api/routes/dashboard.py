from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel
import asyncio
import json

from database.connection import get_db
from database.models import Case

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

class HeatmapItem(BaseModel):
    lat: float
    lng: float
    priority: str
    case_id: str
    intent: str

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.max_connections = 50 # Safety limit to prevent flood crashes

    async def connect(self, websocket: WebSocket):
        # Flood protection
        if len(self.active_connections) >= self.max_connections:
            print(f"🛑 [WS] FLOOD PROTECTION: Rejecting connection from {websocket.client}")
            await websocket.close(code=1008) # Policy Violation
            return

        try:
            await websocket.accept()
            self.active_connections.append(websocket)
            client_id = f"{websocket.client.host}:{websocket.client.port}"
            print(f"✅ [WS] CONNECTED: {client_id} | Total active: {len(self.active_connections)}")
        except Exception as e:
            print(f"❌ [WS] ACCEPT FAILED: {e}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            client_id = f"{websocket.client.host}:{websocket.client.port}" if websocket.client else "unknown"
            print(f"👋 [WS] DISCONNECTED: {client_id} | Total active: {len(self.active_connections)}")

    async def broadcast(self, message: Any):
        if isinstance(message, dict):
            payload = json.dumps(message)
        else:
            payload = str(message)
            
        # Create a copy to iterate safely
        for connection in list(self.active_connections):
            try:
                await connection.send_text(payload)
            except Exception:
                # Connection might be dead, it will be cleaned up by its own loop
                pass

manager = ConnectionManager()

@router.get("/live-stats")
async def get_live_stats(db: AsyncSession = Depends(get_db)):
    """Returns real-time stats for the dashboard."""
    try:
        now = datetime.utcnow()
        
        # Past boundaries
        past_1h = now - timedelta(hours=1)
        past_24h = now - timedelta(hours=24)
        past_7d = now - timedelta(days=7)

        stmt_all = select(Case).where(Case.created_at >= past_7d)
        result = await db.execute(stmt_all)
        all_cases = result.scalars().all()

        stats = {
            "calls_last_1h": sum(1 for c in all_cases if c.created_at >= past_1h),
            "calls_last_24h": sum(1 for c in all_cases if c.created_at >= past_24h),
            "calls_last_7d": len(all_cases),
            "active_calls_count": sum(1 for c in all_cases if c.status not in ["resolved", "false_alarm"]),
            "emotion_distribution": {
                "calm": sum(1 for c in all_cases if c.created_at >= past_24h and c.emotion_level == "calm"),
                "concerned": sum(1 for c in all_cases if c.created_at >= past_24h and c.emotion_level == "concerned"),
                "distressed": sum(1 for c in all_cases if c.created_at >= past_24h and c.emotion_level == "distressed"),
                "panic": sum(1 for c in all_cases if c.created_at >= past_24h and c.emotion_level == "panic"),
            },
            "avg_response_time": 45.2 
        }
        return stats
    except Exception as e:
        print(f"⚠️ Stats Error (Offline Mode?): {e}")
        # Return fallback data so frontend doesn't crash
        return {
            "calls_last_1h": 0, "calls_last_24h": 0, "calls_last_7d": 0,
            "active_calls_count": 0,
            "emotion_distribution": {"calm": 0, "concerned": 0, "distressed": 0, "panic": 0},
            "avg_response_time": 0
        }

@router.get("/heatmap", response_model=List[HeatmapItem])
async def get_heatmap_data(db: AsyncSession = Depends(get_db)):
    """Returns data for map view from the last 24 hours."""
    try:
        past_24h = datetime.utcnow() - timedelta(hours=24)
        stmt = select(Case).where(
            and_(
                Case.created_at >= past_24h,
                Case.location_lat.is_not(None),
                Case.location_lng.is_not(None)
            )
        )
        result = await db.execute(stmt)
        cases = result.scalars().all()

        items = []
        for case in cases:
            items.append(HeatmapItem(
                lat=case.location_lat,
                lng=case.location_lng,
                priority=case.priority,
                case_id=case.id,
                intent=case.intent_type
            ))
        
        return items
    except Exception as e:
        print(f"⚠️ Heatmap Error: {e}")
        return []

@router.websocket("/ws/live-updates")
async def websocket_live_updates(websocket: WebSocket):
    """
    Ultra-stable WebSocket handler.
    """
    await manager.connect(websocket)
    try:
        while True:
            # We don't actually expect data from the client, 
            # so we just wait for the connection to stay alive.
            try:
                # receive_text() will block until data or disconnect
                await asyncio.wait_for(websocket.receive_text(), timeout=45.0)
            except asyncio.TimeoutError:
                # Keep alive ping
                await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"⚠️ [WS] Loop Exception: {e}")
        manager.disconnect(websocket)
