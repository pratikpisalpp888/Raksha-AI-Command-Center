from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from database.connection import init_db
from api.routes import cases, dashboard, webhook, simulate

# Lifespan manager to run DB init on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

# राक्षा AI — मुख्य सर्वर
app = FastAPI(
    title="Raksha AI — 1092 Emergency Helpline",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cases.router)
app.include_router(dashboard.router)
app.include_router(webhook.router)
app.include_router(simulate.router)

@app.get("/")
async def root():
    return {"message": "Raksha AI Backend Running", "status": "active", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "Raksha AI", "helpline": "1092"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
