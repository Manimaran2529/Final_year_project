from fastapi import APIRouter, Form
from services.ai_questions import (
    generate_technical_questions,
    generate_daily_math_questions
)

router = APIRouter()

# ====================================
# AI DAILY MATH PRACTICE
# ====================================

@router.get("/ai-daily-math/{level}/{count}")
def ai_daily_math(level: str, count: int):
    questions = generate_daily_math_questions(level, count)
    return {"questions": questions}


# ====================================
# AI TECHNICAL QUESTIONS
# ====================================

@router.post("/ai-technical-questions")
def ai_technical_questions(
    domain: str = Form(...),
    count: int = Form(...)
):
    questions = generate_technical_questions(domain, count)
    return {"questions": questions}