from fastapi import APIRouter
from pydantic import BaseModel
from services.aptitude_ai import generate_aptitude_questions

router = APIRouter()

class GenerateRequest(BaseModel):
    category: str
    count: int
    difficulty: str

class SubmitRequest(BaseModel):
    questions: list
    user_answers: list


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
# Submit & Evaluate
# ===============================

@router.post("/aptitude/submit")
def submit_answers(data: SubmitRequest):

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

    return {
        "total": len(data.questions),
        "score": score,
        "results": results
    }

from Backend.routes import AptitudeResult
from database import SessionLocal

@router.post("/save-aptitude")
def save_aptitude(data: dict):

    db = SessionLocal()

    new_result = AptitudeResult(
        user_id=data["user_id"],
        total_questions=data["total_questions"],
        correct_answers=data["correct_answers"]
    )

    db.add(new_result)
    db.commit()
    db.close()

    return {"message": "Saved"}