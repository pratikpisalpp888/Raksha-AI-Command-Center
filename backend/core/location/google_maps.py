import googlemaps
import asyncio
import logging
import math
from typing import Dict, Any, List, Optional
from config import get_settings

logger = logging.getLogger(__name__)

class GoogleMapsService:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.GOOGLE_MAPS_API_KEY
        self.client = googlemaps.Client(key=self.api_key) if self.api_key else None
        self._cache = {}

    def calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        R = 6371.0 # km
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    async def geocode(self, address: str, city: str = "Bangalore") -> Dict[str, Any]:
        if not self.client:
            return {"success": False, "error": "Google Maps API key not configured"}
            
        cache_key = f"{address}_{city}".lower()
        if cache_key in self._cache:
            return self._cache[cache_key]

        try:
            query = f"{address}, {city}, Karnataka, India"
            result = self.client.geocode(query)
            
            if result:
                first = result[0]
                loc = first['geometry']['location']
                data = {
                    "success": True,
                    "lat": loc['lat'],
                    "lng": loc['lng'],
                    "formatted_address": first['formatted_address'],
                    "place_id": first['place_id'],
                    "location_type": first['geometry']['location_type'],
                    "error": None
                }
                self._cache[cache_key] = data
                return data
            return {"success": False, "error": "No results found"}
        except Exception as e:
            logger.error(f"Geocoding failed: {e}")
            return {"success": False, "error": str(e)}

    async def reverse_geocode(self, lat: float, lng: float) -> Dict[str, Any]:
        if not self.client:
            return {"success": False, "error": "API key missing"}
        try:
            result = self.client.reverse_geocode((lat, lng))
            if result:
                return {
                    "success": True,
                    "formatted_address": result[0]['formatted_address'],
                    "error": None
                }
            return {"success": False, "error": "No address found"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def search_places(self, query: str, location_bias: tuple = None) -> List[Dict[str, Any]]:
        if not self.client:
            return []
        try:
            params = {"query": query, "region": "IN"}
            if location_bias:
                params["location"] = location_bias
            
            result = self.client.places(**params)
            places = []
            for p in result.get("results", []):
                places.append({
                    "name": p.get("name"),
                    "address": p.get("formatted_address"),
                    "lat": p['geometry']['location']['lat'],
                    "lng": p['geometry']['location']['lng']
                })
            return places
        except Exception as e:
            logger.error(f"Places search failed: {e}")
            return []

    async def find_nearest_police_station(self, lat: float, lng: float) -> Dict[str, Any]:
        places = await self.search_places("police station", location_bias=(lat, lng))
        if not places:
            return {"success": False, "error": "No police station found"}
            
        nearest = None
        min_dist = float('inf')
        
        for p in places:
            dist = self.calculate_distance(lat, lng, p["lat"], p["lng"])
            if dist < min_dist:
                min_dist = dist
                nearest = p
                
        if nearest:
            nearest["distance_km"] = round(min_dist, 2)
            nearest["success"] = True
            return nearest
            
        return {"success": False, "error": "No police station found"}
