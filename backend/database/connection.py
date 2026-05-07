from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from config import get_settings
import os
import asyncio

settings = get_settings()

# ─── DATABASE CONFIGURATION ──────────────────────────────────────────
POSTGRES_URL = settings.DATABASE_URL
SQLITE_URL = "sqlite+aiosqlite:///./raksha.db"

# Format Postgres URL for asyncpg if needed
if POSTGRES_URL and POSTGRES_URL.startswith("postgresql://"):
    POSTGRES_URL = POSTGRES_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# Global engine and session objects (will be initialized in init_db)
engine = None
SessionLocal = None
Base = declarative_base()

async def init_db():
    global engine, SessionLocal
    
    # Try Postgres first if configured
    success = False
    if POSTGRES_URL and "localhost" not in POSTGRES_URL:
        try:
            print("📡 Attempting cloud database connection...")
            temp_engine = create_async_engine(POSTGRES_URL, echo=False, connect_args={"timeout": 5})
            async with temp_engine.begin() as conn:
                await conn.run_sync(lambda x: None) # Test connection
            engine = temp_engine
            success = True
            print("✅ Cloud Database Connected (PostgreSQL)")
        except Exception as e:
            print(f"⚠️ Cloud Connection Failed: {e}")
            print("🔄 Switching to LOCAL OFFLINE MODE (SQLite)...")

    # Fallback to SQLite if Postgres failed or not configured
    if not success:
        engine = create_async_engine(SQLITE_URL, echo=False)
        print("🏠 Local Database Active (SQLite)")

    SessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False
    )

    # Create tables
    from .models import Case, CallLog, Agent, DispatchUnit
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("🚀 Database Synchronization Complete!")

async def get_db():
    if SessionLocal is None:
        await init_db()
        
    async with SessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            raise e
        finally:
            await session.close()
