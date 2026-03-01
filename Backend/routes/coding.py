import os
import random
import json
import re
from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from google import genai
from google.genai.errors import ClientError
from models import CodingResult
from database import SessionLocal

router = APIRouter()

# ===============================
# GEMINI CLIENT
# ===============================

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ===============================
# FALLBACK QUESTIONS
# ===============================

fallback_questions = {
    "python": {
        "easy": [
            {
                "title": "Check Even or Odd",
                "problem_statement": "Check if a number is even or odd.",
                "input_format": "Integer n",
                "output_format": "Print Even or Odd",
                "constraints": "-10^9 <= n <= 10^9",
                "example_input": "4",
                "example_output": "Even",
                "correct_solution": """n = int(input())
print("Even" if n % 2 == 0 else "Odd")"""
            },
            {
                "title": "String Length",
                "problem_statement": "Print length of string.",
                "input_format": "String s",
                "output_format": "Print length",
                "constraints": "1 <= len(s) <= 1000",
                "example_input": "hello",
                "example_output": "5",
                "correct_solution": """s = input()
print(len(s))"""
            },
            {
                "title": "Sum of Two Numbers",
                "problem_statement": "Add two numbers.",
                "input_format": "Two integers",
                "output_format": "Print sum",
                "constraints": "-10^9 <= a,b <= 10^9",
                "example_input": "2 3",
                "example_output": "5",
                "correct_solution": """a,b = map(int,input().split())
print(a+b)"""
            }
        ]
    }
}

# ===============================
# JSON EXTRACTOR
# ===============================

def extract_json(text):
    try:
        text = text.replace("```json", "").replace("```", "")
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return None
    except:
        return None

# ===============================
# GENERATE QUESTION
# ===============================

@router.get("/ai-coding-question/{language}/{difficulty}")
def generate_coding_question(language: str, difficulty: str):

    language = language.lower()
    difficulty = difficulty.lower()

    prompt = f"""
Generate one {difficulty} coding question in {language}.

Return ONLY valid JSON:

{{
"title": "",
"problem_statement": "",
"input_format": "",
"output_format": "",
"constraints": "",
"example_input": "",
"example_output": "",
"correct_solution": ""
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        data = extract_json(response.text)

        if data:
            return data

    except ClientError:
        print("Gemini quota exceeded. Using fallback.")

    # Fallback
    if language in fallback_questions and difficulty in fallback_questions[language]:
        return random.choice(fallback_questions[language][difficulty])

    return {"error": "No questions available"}

# ===============================
# EVALUATE CODE
# ===============================

class CodeRequest(BaseModel):
    code: str
    language: str
    correct_solution: Optional[str] = None

@router.post("/ai-evaluate-code")
def evaluate_code(data: CodeRequest):

    if not data.correct_solution:
        return {
            "passed": False,
            "score": 0,
            "feedback": "No correct solution provided.",
            "correct_solution": None
        }

    is_correct = data.code.strip() == data.correct_solution.strip()

    return {
        "passed": is_correct,
        "score": 10 if is_correct else 0,
        "feedback": "Great job! 🎉" if is_correct else "Try again. Review logic.",
        "correct_solution": data.correct_solution
    }

# ===============================
# SAVE CODING RESULT
# ===============================

@router.post("/save-coding")
def save_coding(data: dict):

    db = SessionLocal()

    new_result = CodingResult(
        user_id=data["user_id"],
        problems_attempted=data["problems_attempted"],
        problems_solved=data["problems_solved"]
    )

    db.add(new_result)
    db.commit()
    db.close()

    return {"message": "Coding result saved"}