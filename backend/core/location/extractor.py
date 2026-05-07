import spacy
import googlemaps
import httpx
import re
import logging
from typing import Dict, Any

from config import get_settings

logger = logging.getLogger(__name__)

class LocationExtractor:
    KARNATAKA_AREAS = [
        "koramangala", "indiranagar", "jayanagar", "rajajinagar",
        "whitefield", "electronic city", "hebbal", "yelahanka",
        "marathahalli", "jp nagar", "banashankari", "btm layout",
        "hsr layout", "bellandur", "sarjapur", "domlur",
        "richmond town", "shivajinagar", "malleshwaram", "basavanagudi",
        "majestic", "yeshwanthpur", "peenya", "vijayanagar",
        "kengeri", "mysore road", "tumkur road", "hosur road",
        "mysore", "hubli", "dharwad", "mangalore", "belgaum",
        "gulbarga", "bellary", "bidar", "shimoga", "tumkur",
        "hassan", "mandya", "raichur", "koppal", "gadag",
        "udupi", "chikmagalur", "kodagu", "coorg"
    ]
    
    LANDMARK_KEYWORDS = [
        "near", "paas", "paas mein", "samne", "peeche", "opposite",
        "next to", "ke paas", "halli", "gudi", "alli", "bagilu", "munde"
    ]

    def __init__(self):
        settings = get_settings()
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            self.nlp = None
        self.gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY) if settings.GOOGLE_MAPS_API_KEY else None
        self.cache = {}

    def extract_from_text(self, text: str) -> Dict[str, Any]:
        found_locations = []
        raw_mentions = []
        
        if self.nlp:
            doc = self.nlp(text)
            for ent in doc.ents:
                if ent.label_ in ["GPE", "LOC", "FAC"]:
                    raw_mentions.append(ent.text)
                    found_locations.append(ent.text.lower())
        
        patterns = [
            r"(.+?)\s+mein hoon",
            r"(.+?)\s+ke paas",
            r"(.+?)\s+block",
            r"(.+?)\s+road",
            r"(.+?)\s+main road",
            r"(.+?)\s+alli idini",
            r"(.+?)\s+hatra"
        ]
        text_lower = text.lower()
        for p in patterns:
            matches = re.findall(p, text_lower)
            for m in matches:
                cleaned = m.split()[-1] if len(m.split()) > 3 else m
                raw_mentions.append(cleaned)
                found_locations.append(cleaned)

        best_guess = ""
        for area in self.KARNATAKA_AREAS:
            if area in text_lower:
                raw_mentions.append(area)
                found_locations.append(area)
                best_guess = area
                
        if not best_guess and found_locations:
            best_guess = found_locations[0]

        found = len(found_locations) > 0
        return {
            "found": found,
            "raw_mentions": list(set(raw_mentions)),
            "best_guess": best_guess,
            "all_locations": list(set(found_locations)),
            "location_type": "area" if best_guess in self.KARNATAKA_AREAS else "unknown",
            "confidence": 0.8 if best_guess in self.KARNATAKA_AREAS else 0.4 if found else 0.0
        }

    async def geocode_location(self, location_text: str, city: str = "Bangalore") -> Dict[str, Any]:
        if not self.gmaps:
            return {"success": False, "error": "Google Maps not configured"}

        query = f"{location_text}, {city}, Karnataka, India"
        if query in self.cache:
            return self.cache[query]

        try:
            geocode_result = self.gmaps.geocode(query)
            if geocode_result:
                res = geocode_result[0]
                loc = res['geometry']['location']
                result = {
                    "success": True,
                    "lat": loc['lat'],
                    "lng": loc['lng'],
                    "formatted_address": res['formatted_address'],
                    "place_id": res['place_id'],
                    "accuracy": res['geometry']['location_type'],
                    "error": None
                }
                self.cache[query] = result
                return result
            else:
                return {"success": False, "error": "No results found"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def process_location(self, transcript: str) -> Dict[str, Any]:
        extracted = self.extract_from_text(transcript)
        result = {"extracted": extracted, "geocoded": None}
        if extracted["found"] and extracted["best_guess"]:
            geo = await self.geocode_location(extracted["best_guess"])
            result["geocoded"] = geo
        return result
