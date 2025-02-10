import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Read database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create async PostgreSQL engine
engine = create_async_engine(DATABASE_URL, future=True, echo=True)

# Create session factory
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base model for ORM
Base = declarative_base()

# Dependency to get database session
async def get_db():
    async with SessionLocal() as session:
        yield session
