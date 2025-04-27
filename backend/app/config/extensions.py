from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from contextlib import asynccontextmanager
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

@asynccontextmanager
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            pass

# Initialize the DB by creating tables
async def init_db(app, config):
    from app import models  # replace with actual model import
    async with engine.begin() as conn:
        # Create all tables by reflecting metadata from the models
        await conn.run_sync(Base.metadata.create_all)
        print("Database tables created successfully.")
                                                                                                                                                                