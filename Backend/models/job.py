from pydantic import BaseModel

class JobRequest(BaseModel):
    description: str
    job_link: str


class JobResponse(BaseModel):
    legit_score: int
    status: str
    reasons: list[str]

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from database import Base

# ======================
# USER TABLE
# ======================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password = Column(String)

# ======================
# JOB ANALYSIS
# ======================

class JobAnalysis(Base):
    __tablename__ = "job_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    job_url = Column(String)
    result = Column(String)   # Real / Fake
    score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

# ======================
# INTERVIEW PRACTICE
# ======================

class InterviewPractice(Base):
    __tablename__ = "interview_practice"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    topic = Column(String)
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    practice_date = Column(DateTime, default=datetime.utcnow)

# ======================
# EMAIL HISTORY
# ======================

class EmailHistory(Base):
    __tablename__ = "email_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    hr_email = Column(String)
    subject = Column(String)
    sent_date = Column(DateTime, default=datetime.utcnow)

# ======================
# APTITUDE RESULTS
# ======================

class AptitudeResult(Base):
    __tablename__ = "aptitude_results"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())

# ======================
# CODING RESULTS
# ======================

class CodingResult(Base):
    __tablename__ = "coding_results"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    problems_attempted = Column(Integer)
    problems_solved = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())

# ======================
# HR RESULTS
# ======================

class HRResult(Base):
    __tablename__ = "hr_results"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    answers_submitted = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())