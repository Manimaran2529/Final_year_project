from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import random
import os
from google import genai

router = APIRouter(prefix="/technical", tags=["Technical Round"])

# ✅ Load API key safely from environment
client = genai.Client(api_key=os.getenv("AIzaSyC24p6QT9xng_6HjALRn62lb5g8o5kJo9I"))

# ==============================
# DOMAIN QUESTION BANK
# ==============================

technical_questions = {
    "machine_learning": [
        {
            "question": "What is overfitting in machine learning?",
            "answer": "Overfitting happens when a model learns the training data too well including noise and performs poorly on unseen data."
        },
        {
            "question": "What is the difference between supervised and unsupervised learning?",
            "answer": "Supervised learning uses labeled data while unsupervised learning works on unlabeled data."
        }
    ],
    "web_development": [
        {
            "question": "What is the difference between GET and POST?",
            "answer": "GET retrieves data while POST sends data to the server."
        }
    ],
    "dsa": [
        {
            "question": "What is time complexity?",
            "answer": "Time complexity measures how the runtime of an algorithm grows with input size."
        }
    ],
    "java": [
        {
            "question": "What is JVM?",
            "answer": "JVM (Java Virtual Machine) executes Java bytecode and provides platform independence."
        }
    ],
    "sql": [
        {
            "question": "What is normalization?",
            "answer": "Normalization organizes database tables to reduce redundancy and improve data integrity."
        }
    ]
}

# ==============================
# GET ALL DOMAINS
# ==============================

@router.get("/domains")
def get_domains():
    return {"domains": list(technical_questions.keys())}


# ==============================
# GET RANDOM QUESTION
# ==============================

@router.get("/question/{domain}")
def get_question(domain: str):

    if domain not in technical_questions:
        raise HTTPException(status_code=400, detail="Invalid domain")

    question_data = random.choice(technical_questions[domain])
    return {"question": question_data["question"]}


# ==============================
# EVALUATE ANSWER
# ==============================

class AnswerRequest(BaseModel):
    domain: str
    question: str
    user_answer: str


@router.post("/evaluate")
def evaluate_answer(data: AnswerRequest):

    if data.domain not in technical_questions:
        raise HTTPException(status_code=400, detail="Invalid domain")

    # Find correct answer
    correct_answer = None
    for q in technical_questions[data.domain]:
        if q["question"] == data.question:
            correct_answer = q["answer"]
            break

    if not correct_answer:
        raise HTTPException(status_code=404, detail="Question not found")

    # AI Prompt
    prompt = f"""
    Question: {data.question}

    Correct Answer: {correct_answer}

    User Answer: {data.user_answer}

    Evaluate the user's answer.
    Provide:
    - Correct or Wrong
    - Score out of 10
    - Explanation
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        evaluation_text = response.text

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI evaluation failed: {str(e)}")

    return {
        "correct_answer": correct_answer,
        "evaluation": evaluation_text
    }