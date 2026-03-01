# =========================
# Imports
# =========================

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime
import secrets

from database import engine, SessionLocal
from models import (
    Base,
    User,
    JobAnalysis,
    AptitudeResult,
    CodingResult,
    HRResult
)

from routes.questions import router as question_router
from routes.aptitude import router as aptitude_router
from routes.coding import router as coding_router
from routes.hr import router as hr_router
from routes.mail import router as mail_router

# =========================
# Create Tables
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# FastAPI App
# =========================

app = FastAPI()

# ✅ CORS (ONLY ONCE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(question_router)
app.include_router(hr_router)
app.include_router(aptitude_router)
app.include_router(coding_router)
app.include_router(mail_router)

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

# ✅ FIXED LOGIN MODEL
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

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


# ✅ FIXED LOGIN ROUTE
@app.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

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

    coding_tests = db.query(CodingResult).filter(
        CodingResult.user_id == user_id
    ).all()

    hr_tests = db.query(HRResult).filter(
        HRResult.user_id == user_id
    ).all()

    total_questions = sum(t.total_questions for t in aptitude_tests)
    correct_answers = sum(t.correct_answers for t in aptitude_tests)

    aptitude_accuracy = round((correct_answers / total_questions) * 100) if total_questions > 0 else 0

    coding_attempted = sum(t.problems_attempted for t in coding_tests)
    coding_solved = sum(t.problems_solved for t in coding_tests)

    coding_accuracy = round((coding_solved / coding_attempted) * 100) if coding_attempted > 0 else 0

    total_hr_attempts = len(hr_tests)

    readiness = round((aptitude_accuracy + coding_accuracy + total_jobs) / 3)

    return {
        "total_jobs": total_jobs,
        "fake_jobs": fake_jobs,
        "aptitude_accuracy": aptitude_accuracy,
        "coding_accuracy": coding_accuracy,
        "hr_attempts": total_hr_attempts,
        "readiness": readiness
    }

# =========================
# Daily Activity (Heatmap)
# =========================

@app.get("/daily-activity/{user_id}")
def daily_activity(user_id: int, db: Session = Depends(get_db)):

    coding = db.query(
        func.date(CodingResult.created_at),
        func.count(CodingResult.id)
    ).filter(
        CodingResult.user_id == user_id
    ).group_by(
        func.date(CodingResult.created_at)
    ).all()

    aptitude = db.query(
        func.date(AptitudeResult.created_at),
        func.count(AptitudeResult.id)
    ).filter(
        AptitudeResult.user_id == user_id
    ).group_by(
        func.date(AptitudeResult.created_at)
    ).all()

    hr = db.query(
        func.date(HRResult.created_at),
        func.count(HRResult.id)
    ).filter(
        HRResult.user_id == user_id
    ).group_by(
        func.date(HRResult.created_at)
    ).all()

    result = {}

    for date, count in coding:
        result[str(date)] = {"coding": count, "aptitude": 0, "hr": 0}

    for date, count in aptitude:
        result.setdefault(str(date), {"coding": 0, "aptitude": 0, "hr": 0})
        result[str(date)]["aptitude"] = count

    for date, count in hr:
        result.setdefault(str(date), {"coding": 0, "aptitude": 0, "hr": 0})
        result[str(date)]["hr"] = count

    final = []

    for date, values in result.items():
        final.append({
            "date": date,
            "coding": values["coding"],
            "aptitude": values["aptitude"],
            "hr": values["hr"],
            "total": values["coding"] + values["aptitude"] + values["hr"]
        })

    return final

from sqlalchemy import func
from datetime import datetime, timedelta
import calendar


@app.get("/weekly-detailed-progress/{user_id}")
def weekly_detailed_progress(user_id: int, db: Session = Depends(get_db)):

    today = datetime.utcnow()
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    # Fetch aptitude
    aptitude = db.query(
        func.date(AptitudeResult.created_at),
        func.sum(AptitudeResult.correct_answers),
        func.sum(AptitudeResult.total_questions)
    ).filter(
        AptitudeResult.user_id == user_id,
        AptitudeResult.created_at >= start_of_week,
        AptitudeResult.created_at <= end_of_week
    ).group_by(
        func.date(AptitudeResult.created_at)
    ).all()

    # Fetch coding
    coding = db.query(
        func.date(CodingResult.created_at),
        func.sum(CodingResult.problems_solved),
        func.sum(CodingResult.problems_attempted)
    ).filter(
        CodingResult.user_id == user_id,
        CodingResult.created_at >= start_of_week,
        CodingResult.created_at <= end_of_week
    ).group_by(
        func.date(CodingResult.created_at)
    ).all()

    result = {}

    for date, correct, total in aptitude:
        result[str(date)] = {
            "day": calendar.day_name[date.weekday()],
            "aptitude_score": correct or 0,
            "aptitude_total": total or 0,
            "coding_score": 0,
            "coding_total": 0
        }

    for date, solved, attempted in coding:
        if str(date) not in result:
            result[str(date)] = {
                "day": calendar.day_name[date.weekday()],
                "aptitude_score": 0,
                "aptitude_total": 0,
                "coding_score": solved or 0,
                "coding_total": attempted or 0
            }
        else:
            result[str(date)]["coding_score"] = solved or 0
            result[str(date)]["coding_total"] = attempted or 0

    return list(result.values())

@app.get("/monthly-progress/{user_id}")
def monthly_progress(user_id: int, db: Session = Depends(get_db)):

    today = datetime.utcnow()
    start_of_month = today.replace(day=1)

    aptitude = db.query(
        func.extract("week", AptitudeResult.created_at),
        func.sum(AptitudeResult.correct_answers),
        func.sum(AptitudeResult.total_questions)
    ).filter(
        AptitudeResult.user_id == user_id,
        AptitudeResult.created_at >= start_of_month
    ).group_by(
        func.extract("week", AptitudeResult.created_at)
    ).all()

    coding = db.query(
        func.extract("week", CodingResult.created_at),
        func.sum(CodingResult.problems_solved),
        func.sum(CodingResult.problems_attempted)
    ).filter(
        CodingResult.user_id == user_id,
        CodingResult.created_at >= start_of_month
    ).group_by(
        func.extract("week", CodingResult.created_at)
    ).all()

    result = {}

    for week, correct, total in aptitude:
        result[int(week)] = {
            "week": int(week),
            "aptitude_score": correct or 0,
            "aptitude_total": total or 0,
            "coding_score": 0,
            "coding_total": 0
        }

    for week, solved, attempted in coding:
        week = int(week)
        if week not in result:
            result[week] = {
                "week": week,
                "aptitude_score": 0,
                "aptitude_total": 0,
                "coding_score": solved or 0,
                "coding_total": attempted or 0
            }
        else:
            result[week]["coding_score"] = solved or 0
            result[week]["coding_total"] = attempted or 0

    return list(result.values())