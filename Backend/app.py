# =========================
# Imports
# =========================

from fastapi import FastAPI, HTTPException, Depends
from database import engine
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

import secrets

from routes.questions import router as question_router
from routes.aptitude import router as aptitude_router
from routes.coding import router as coding_router
from routes.hr import router as hr_router
from routes.mail import router as mail_router
from database import engine, SessionLocal
from Backend.routes import (
    Base,
    User,
    JobAnalysis,
    AptitudeResult,
    CodingResult,
    HRResult
)




# =========================
# Create Tables
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# FastAPI App
# =========================

app = FastAPI()

app.include_router(question_router)
app.include_router(hr_router)
app.include_router(aptitude_router)
app.include_router(coding_router)
app.include_router(mail_router)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DB Dependency
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# Request Models
# =========================

class GoogleLoginRequest(BaseModel):
    token: str

class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

class AptitudeData(BaseModel):
    user_id: int
    total_questions: int
    correct_answers: int

# =========================
# Auth Routes
# =========================

GOOGLE_CLIENT_ID = "876274825565-uom73e2emgtlh7jhgjafte1shjed0g0p.apps.googleusercontent.com"

@app.post("/auth/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=data.email,
        name=data.name,
        password=data.password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


@app.post("/auth/login")
def login(data: RegisterRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == data.email,
        User.password == data.password
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "access_token": "login_success"
    }


@app.post("/auth/google-login")
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):

    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        name = idinfo.get("name")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            user = User(
                email=email,
                name=name,
                password=secrets.token_hex(8)
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "access_token": "google_success"
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

# =========================
# Dashboard Summary
# =========================

@app.get("/dashboard-summary/{user_id}")
def dashboard_summary(user_id: int, db: Session = Depends(get_db)):

    total_jobs = db.query(JobAnalysis).filter(JobAnalysis.user_id == user_id).count()

    fake_jobs = db.query(JobAnalysis).filter(
        JobAnalysis.user_id == user_id,
        JobAnalysis.result == "Fake"
    ).count()

    aptitude_tests = db.query(AptitudeResult).filter(
        AptitudeResult.user_id == user_id
    ).all()

    total_questions = sum(t.total_questions for t in aptitude_tests)
    correct_answers = sum(t.correct_answers for t in aptitude_tests)

    accuracy = round((correct_answers / total_questions) * 100) if total_questions > 0 else 0

    interviews = db.query(HRResult).filter(HRResult.user_id == user_id).count()

    readiness = round((accuracy + (total_jobs * 2)) / 2)

    return {
        "total_jobs": total_jobs,
        "fake_jobs": fake_jobs,
        "interviews": interviews,
        "accuracy": accuracy,
        "readiness": readiness
    }

# =========================
# Progress Routes
# =========================

@app.get("/user-progress/{user_id}")
def user_progress(user_id: int, db: Session = Depends(get_db)):

    total_jobs = db.query(JobAnalysis).filter(JobAnalysis.user_id == user_id).count()

    fake_jobs = db.query(JobAnalysis).filter(
        JobAnalysis.user_id == user_id,
        JobAnalysis.result == "Fake"
    ).count()

    accuracy = round(((total_jobs - fake_jobs) / total_jobs) * 100) if total_jobs > 0 else 0

    return {
        "total_jobs": total_jobs,
        "fake_jobs": fake_jobs,
        "accuracy": accuracy
    }


@app.get("/weekly-progress/{user_id}")
def weekly_progress(user_id: int, db: Session = Depends(get_db)):

    data = db.query(
        extract("dow", JobAnalysis.created_at),
        func.count(JobAnalysis.id)
    ).filter(
        JobAnalysis.user_id == user_id
    ).group_by(
        extract("dow", JobAnalysis.created_at)
    ).all()

    return data

# =========================
# Interview APIs (FIX FOR 404)
# =========================

@app.get("/ai-daily-math/{level}/{count}")
def generate_math(level: str, count: int):

    questions = []

    for i in range(count):
        questions.append({
            "question": f"What is {i+2} + {i+3}?",
            "options": [
                str((i+2)+(i+3)),
                str((i+2)+(i+3)+1),
                str((i+2)+(i+3)-1),
                str((i+2)+(i+3)+2)
            ],
            "answer": str((i+2)+(i+3)),
            "explanation": "Simple addition"
        })

    return {"questions": questions}


@app.get("/coding-questions/{level}/{count}")
def coding_questions(level: str, count: int):

    questions = []

    for i in range(count):
        questions.append({
            "title": f"Reverse String {i+1}",
            "description": "Write a function to reverse a string.",
            "difficulty": level
        })

    return {"questions": questions}


@app.get("/hr-question")
def hr_question():
    return {
        "question": "Tell me about yourself."
    }


@app.get("/technical/domains")
def technical_domains():
    return {
        "domains": ["Machine_learing", "Data_sciencist", "Full_stack", "Backend developer","Frontend developer"]
    }

# =========================
# Test Add Job
# =========================

@app.get("/test-add/{user_id}")
def test_add(user_id: int, db: Session = Depends(get_db)):

    new = JobAnalysis(
        user_id=user_id,
        job_url="test_mail",
        result="Fake",
        score=90
    )

    db.add(new)
    db.commit()

    return {"message": "Added"}