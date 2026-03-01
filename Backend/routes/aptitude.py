from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal
from services.aptitude_ai import generate_aptitude_questions
from models import AptitudeResult   # ✅ FIXED IMPORT

router = APIRouter()

# ===============================
# Request Models
# ===============================

class GenerateRequest(BaseModel):
    category: str
    count: int
    difficulty: str


class SubmitRequest(BaseModel):
    questions: list
    user_answers: list
    user_id: int   # ✅ add user_id here for saving


# ===============================
# DB Dependency
# ===============================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===============================
# Generate Aptitude Questions
# ===============================

@router.post("/aptitude/generate")
def generate_questions(data: GenerateRequest):

    questions = generate_aptitude_questions(
        data.category,
        data.count,
        data.difficulty
    )

    return {"questions": questions}


# ===============================
# Submit, Evaluate & Save
# ===============================

@router.post("/aptitude/submit")
def submit_answers(data: SubmitRequest, db: Session = Depends(get_db)):

    score = 0
    results = []

    for i in range(len(data.questions)):

        correct = data.questions[i]["answer"]
        user = data.user_answers[i]

        is_correct = user == correct
        if is_correct:
            score += 1

        results.append({
            "question": data.questions[i]["question"],
            "options": data.questions[i]["options"],
            "your_answer": user,
            "correct_answer": correct,
            "solution": data.questions[i]["solution"],
            "is_correct": is_correct
        })

    # ✅ Save result to database
    new_result = AptitudeResult(
        user_id=data.user_id,
        total_questions=len(data.questions),
        correct_answers=score
    )

    db.add(new_result)
    db.commit()

    return {
        "total": len(data.questions),
        "score": score,
        "results": results
    }