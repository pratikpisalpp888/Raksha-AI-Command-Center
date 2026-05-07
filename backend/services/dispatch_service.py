import logging
import math
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.models import Case, DispatchUnit
from database.connection import SessionLocal

logger = logging.getLogger(__name__)

class DispatchService:
    def haversine_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        return distance

    async def find_nearest_unit(self, lat: float, lng: float, unit_type: str = "police") -> Optional[DispatchUnit]:
        async with SessionLocal() as db:
            stmt = select(DispatchUnit).where(
                DispatchUnit.is_available == True,
                DispatchUnit.unit_type == unit_type,
                DispatchUnit.current_lat.is_not(None),
                DispatchUnit.current_lng.is_not(None)
            )
            result = await db.execute(stmt)
            available_units = result.scalars().all()
            
            if not available_units:
                return None
                
            nearest_unit = None
            min_dist = float('inf')
            
            for unit in available_units:
                dist = self.haversine_distance(lat, lng, unit.current_lat, unit.current_lng)
                if dist < min_dist:
                    min_dist = dist
                    nearest_unit = unit
                    
            return nearest_unit

    async def dispatch_help(self, case_id: str) -> Dict[str, Any]:
        async with SessionLocal() as db:
            stmt = select(Case).where(Case.id == case_id)
            result = await db.execute(stmt)
            case = result.scalar_one_or_none()
            
            if not case:
                return {"success": False, "error": "Case not found"}
                
            if not case.location_lat or not case.location_lng:
                logger.warning(f"Dispatching case {case_id} without exact coordinates.")
                case.help_dispatched = True
                case.status = "dispatched"
                await db.commit()
                return {"success": True, "message": "Dispatched without exact coordinates", "unit": None}
                
            unit = await self.find_nearest_unit(case.location_lat, case.location_lng)
            
            if unit:
                unit.is_available = False
                case.help_dispatched = True
                case.status = "dispatched"
                await db.commit()
                logger.info(f"Dispatched unit {unit.unit_name} to case {case_id}")
                return {"success": True, "unit": unit.unit_name}
            else:
                logger.warning(f"No available units for case {case_id}")
                case.help_dispatched = True
                case.status = "human_escalated"
                await db.commit()
                return {"success": False, "error": "No available units"}
