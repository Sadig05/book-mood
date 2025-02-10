from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from recommendation.routes import router as rec_router

app = FastAPI()

# CORS configuration (allow frontend to access API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(rec_router, prefix="/recommend", tags=["Recommendation"])

@app.get("/")
def home():
    return {"message": "Backend is running!"}
