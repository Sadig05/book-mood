from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models import User
from backend.database import get_db
from backend.authentication.hashing import hash_password, verify_password
from backend.authentication.jwt_utils import create_jwt_token
from pydantic import BaseModel

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if username already exists
    result = await db.execute(select(User).where(User.username == request.username))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password
    hashed_password = hash_password(request.password)

    # Create a new user
    new_user = User(username=request.username, password_hash=hashed_password)
    db.add(new_user)
    await db.commit()
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Fetch user by username
    result = await db.execute(select(User).where(User.username == request.username))
    user = result.scalars().first()

    # Validate user credentials
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Generate JWT token
    token = create_jwt_token({"sub": user.username, "id": user.id})

    return {"access_token": token, "token_type": "bearer"}
