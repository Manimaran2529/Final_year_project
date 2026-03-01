from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class InterviewActivity(Base):
    __tablename__ = "interview_activity"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    category = Column(String)
    score = Column(Integer)
    date = Column(DateTime(timezone=True), server_default=func.now())


class JobAnalysis(Base):
    __tablename__ = "job_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    is_fake = Column(Integer)
    date = Column(DateTime(timezone=True), server_default=func.now())


class EmailAnalysis(Base):
    __tablename__ = "email_analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    is_spam = Column(Integer)
    date = Column(DateTime(timezone=True), server_default=func.now())