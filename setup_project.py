import os

base_dir = r"c:\Users\pisal\OneDrive\Desktop\RakshaAI\raksha-ai"

directories = [
    "backend",
    "backend/api",
    "backend/api/routes",
    "backend/core",
    "backend/core/speech",
    "backend/core/emotion",
    "backend/core/intent",
    "backend/core/location",
    "backend/database",
    "backend/services",
    "frontend/public",
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {
    "backend/main.py": '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# राक्षा AI — मुख्य सर्वर
app = FastAPI(title="Raksha AI — 1092 Emergency Helpline")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Raksha AI Backend Running", "status": "active", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Raksha AI", "helpline": "1092"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
''',
    "backend/config.py": '''from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NUMBER: str
    HUME_API_KEY: str
    GOOGLE_CLOUD_API_KEY: str
    GOOGLE_MAPS_API_KEY: str
    DATABASE_URL: str
    REDIS_URL: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "centralindia"
    APP_ENV: str = "development"
    APP_PORT: int = 8000
    SECRET_KEY: str

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
''',
    "backend/requirements.txt": '''fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
openai==1.3.7
twilio==8.10.0
httpx==0.25.2
sqlalchemy==2.0.23
asyncpg==0.29.0
alembic==1.12.1
redis==5.0.1
websockets==12.0
python-multipart==0.0.6
supabase==2.0.3
spacy==3.7.2
googlemaps==4.10.0
speechbrain==0.5.16
torch==2.1.1
torchaudio==2.1.1
librosa==0.10.1
numpy==1.26.2
pandas==2.1.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
aiofiles==23.2.1
pytest==7.4.3
pytest-asyncio==0.21.1
''',
    "backend/.env.example": '''# OpenAI
OPENAI_API_KEY=

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Hume AI
HUME_API_KEY=

# Google Cloud
GOOGLE_CLOUD_API_KEY=
GOOGLE_MAPS_API_KEY=

# Database
DATABASE_URL=
REDIS_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=

# App
APP_ENV=development
APP_PORT=8000
SECRET_KEY=
''',
    "backend/api/__init__.py": "from . import routes\n",
    "backend/api/routes/__init__.py": '''from . import calls
from . import cases
from . import dashboard
from . import webhook
''',
    "backend/api/routes/calls.py": '''from fastapi import APIRouter

router = APIRouter()
# Placeholder for calls routes
''',
    "backend/api/routes/cases.py": '''from fastapi import APIRouter

router = APIRouter()
# Placeholder for cases routes
''',
    "backend/api/routes/dashboard.py": '''from fastapi import APIRouter

router = APIRouter()
# Placeholder for dashboard routes
''',
    "backend/api/routes/webhook.py": '''from fastapi import APIRouter

router = APIRouter()
# Placeholder for webhook routes
''',
    "backend/core/__init__.py": '''from . import speech
from . import emotion
from . import intent
from . import location
''',
    "backend/core/speech/__init__.py": "from . import processor\n",
    "backend/core/speech/processor.py": '''# Placeholder for speech processing logic
def process_speech():
    pass
''',
    "backend/core/emotion/__init__.py": "from . import detector\n",
    "backend/core/emotion/detector.py": '''# Placeholder for emotion detection logic
def detect_emotion():
    pass
''',
    "backend/core/intent/__init__.py": "from . import analyzer\n",
    "backend/core/intent/analyzer.py": '''# Placeholder for intent analysis logic
def analyze_intent():
    pass
''',
    "backend/core/location/__init__.py": "from . import extractor\n",
    "backend/core/location/extractor.py": '''# Placeholder for location extraction logic
def extract_location():
    pass
''',
    "backend/database/__init__.py": '''from . import models
from . import connection
''',
    "backend/database/models.py": '''# Placeholder for database models
''',
    "backend/database/connection.py": '''# Placeholder for database connection logic
''',
    "backend/services/__init__.py": '''from . import twilio_service
from . import sms_service
from . import dispatch_service
''',
    "backend/services/twilio_service.py": '''# Placeholder for Twilio service logic
''',
    "backend/services/sms_service.py": '''# Placeholder for SMS service logic
''',
    "backend/services/dispatch_service.py": '''# Placeholder for dispatch service logic
''',
    "frontend/public/.gitkeep": "",
    "frontend/src/components/.gitkeep": "",
    "frontend/src/pages/.gitkeep": "",
    "frontend/src/services/.gitkeep": ""
}

for filepath, content in files.items():
    with open(os.path.join(base_dir, filepath), 'w', encoding='utf-8') as f:
        f.write(content)

print("Setup completed successfully.")
