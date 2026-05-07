import asyncio
import os
import sys
from datetime import datetime, timedelta
import uuid

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database.connection import SessionLocal, init_db
from database.models import Case, Agent, DispatchUnit

async def seed_data():
    print("Initializing database...")
    await init_db()
    
    async with SessionLocal() as db:
        print("Clearing old demo data... (in real app, skip this)")
        
        # 1. Agents
        agents = [
            Agent(name="Priya Sharma", email="priya@raksha.ai", phone="+919876543210", languages=["hindi", "english"], is_available=True),
            Agent(name="Kavitha Gowda", email="kavitha@raksha.ai", phone="+919876543211", languages=["kannada", "english"], is_available=True),
            Agent(name="Sarah Thomas", email="sarah@raksha.ai", phone="+919876543212", languages=["english", "tamil"], is_available=False),
            Agent(name="Amit Patel", email="amit@raksha.ai", phone="+919876543213", languages=["hindi", "gujarati"], is_available=True),
            Agent(name="Radhika M", email="radhika@raksha.ai", phone="+919876543214", languages=["telugu", "english"], is_available=False)
        ]
        db.add_all(agents)
        
        # 2. Dispatch Units
        units = [
            DispatchUnit(unit_name="PCR Van Alpha-1", unit_type="police", base_location="Koramangala PS", current_lat=12.9352, current_lng=77.6245, is_available=True),
            DispatchUnit(unit_name="Women Cell Beta-2", unit_type="women_helpline", base_location="Indiranagar PS", current_lat=12.9784, current_lng=77.6408, is_available=True),
            DispatchUnit(unit_name="PCR Van Gamma-3", unit_type="police", base_location="Whitefield PS", current_lat=12.9698, current_lng=77.7499, is_available=False)
        ]
        db.add_all(units)
        
        # 3. Cases
        cases_data = [
            ("CRITICAL", "panic", "domestic_violence", "hindi", "Bachao bachao, mera pati maar raha hai", "Koramangala", 12.9352, 77.6245, "dispatched"),
            ("HIGH", "distressed", "stalking", "hindi", "Koi mera peecha kar raha hai office se", "Indiranagar", 12.9784, 77.6408, "ai_processing"),
            ("HIGH", "distressed", "sexual_harassment", "kannada", "Pakkada maneyavaru tondare koduttiddare", "Jayanagar", 12.9299, 77.5824, "pending_verification"),
            ("MEDIUM", "concerned", "general_distress", "english", "My ex is sending threatening messages", "Whitefield", 12.9698, 77.7499, "human_escalated"),
            ("CRITICAL", "panic", "child_abuse", "hindi", "Ek aadmi bacche ko le ja raha hai", "Hebbal", 13.0354, 77.5988, "dispatched"),
            ("LOW", "calm", "information_request", "kannada", "Women helpline number beku", "Majestic", 12.9766, 77.5713, "resolved"),
            ("HIGH", "panic", "domestic_violence", "hinglish", "Please help, he locked me in", "HSR Layout", 12.9121, 77.6446, "dispatched"),
            ("MEDIUM", "concerned", "dowry_harassment", "hindi", "Sasural wale dahej mang rahe hain", "Yelahanka", 13.1007, 77.5963, "pending_verification"),
            ("CRITICAL", "panic", "trafficking", "english", "I am locked in a room, please save me", "Electronic City", 12.8399, 77.6770, "dispatched"),
            ("HIGH", "distressed", "stalking", "kannada", "Nanna follow madthidare", "Malleswaram", 13.0031, 77.5643, "ai_processing"),
            ("MEDIUM", "concerned", "sexual_harassment", "hinglish", "Bus mein ek aadmi pareshan kar raha hai", "Shivajinagar", 12.9857, 77.6057, "human_escalated"),
            ("CRITICAL", "panic", "domestic_violence", "hindi", "Vo chaku lekar aaya hai", "BTM Layout", 12.9166, 77.6101, "dispatched"),
            ("LOW", "calm", "prank", "hindi", "Hello pizza order karna hai", "Kengeri", 12.9177, 77.4838, "resolved"),
            ("HIGH", "distressed", "child_abuse", "kannada", "Makkalige hodiyuthidare", "Vijayanagar", 12.9756, 77.5354, "dispatched"),
            ("MEDIUM", "concerned", "stalking", "english", "Someone standing outside my gate", "Banashankari", 12.9255, 77.5468, "pending_verification"),
            ("CRITICAL", "panic", "sexual_harassment", "hindi", "Jaldi aao, koi darwaza tod raha hai", "Bellandur", 12.9304, 77.6784, "dispatched"),
            ("HIGH", "distressed", "domestic_violence", "kannada", "Kudidu bandu hodiyuthidane", "Yeshwanthpur", 13.0285, 77.5409, "human_escalated"),
            ("LOW", "calm", "information_request", "english", "I want to file a police complaint", "Peenya", 13.0285, 77.5197, "resolved"),
            ("CRITICAL", "panic", "domestic_violence", "hindi", "Khoon nikal raha hai help", "Domlur", 12.9609, 77.6387, "dispatched"),
            ("HIGH", "distressed", "stalking", "hinglish", "Bike wala follow kar raha hai half hour se", "Marathahalli", 12.9569, 77.7011, "ai_processing"),
        ]

        now = datetime.utcnow()
        for i, c in enumerate(cases_data):
            seq = str(uuid.uuid4().int)[:4]
            case_id = f"RK20240504{seq}"
            
            case = Case(
                id=case_id,
                caller_phone=f"+919876543{i:03d}",
                language_detected=c[3],
                raw_transcript=c[4],
                emotion_level=c[1],
                emotion_score=0.85,
                intent_type=c[2],
                location_area=c[5],
                location_city="Bangalore",
                location_lat=c[6],
                location_lng=c[7],
                priority=c[0].lower(),
                status=c[8],
                ai_summary=f"Caller reporting {c[2].replace('_', ' ')} in {c[5]}.",
                sms_sent=True if c[8] == "dispatched" else False,
                help_dispatched=True if c[8] == "dispatched" else False,
                caller_confirmed=True if c[8] in ["dispatched", "human_escalated", "resolved"] else False,
                created_at=now - timedelta(minutes=10 * i)
            )
            db.add(case)

        await db.commit()
        print("Successfully seeded 20 Cases, 5 Agents, and 3 Dispatch Units!")

if __name__ == "__main__":
    asyncio.run(seed_data())
