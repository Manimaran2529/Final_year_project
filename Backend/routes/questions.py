from fastapi import APIRouter
from pydantic import BaseModel
from services.ai_questions import generate_technical_questions

router = APIRouter()

# ==============================
# REQUEST MODELS
# ==============================

class GenerateRequest(BaseModel):
    domain: str
    count: int

class SubmitRequest(BaseModel):
    questions: list
    user_answers: list


# ==============================
# GENERATE DOMAIN QUESTIONS
# ==============================

@router.post("/technical/generate")
def generate_questions(data: GenerateRequest):

    questions = generate_technical_questions(
        data.domain,
        data.count
    )

    return {"questions": questions}


# ==============================
# SUBMIT & EVALUATE
# ==============================

@router.post("/technical/submit")
def evaluate_answers(data: SubmitRequest):

    questions = data.questions
    user_answers = data.user_answers

    score = 0
    results = []

    for i in range(len(questions)):

        correct_answer = questions[i]["answer"]
        user_answer = user_answers[i]

        is_correct = user_answer == correct_answer

        if is_correct:
            score += 1

        results.append({
            "question": questions[i]["question"],
            "options": questions[i]["options"],
            "your_answer": user_answer,
            "correct_answer": correct_answer,
            "explanation": questions[i]["explanation"],
            "is_correct": is_correct
        })

    return {
        "total_questions": len(questions),
        "score": score,
        "results": results
    }