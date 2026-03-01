from fastapi import APIRouter, Body
import random
import io
import sys
import traceback
from .coding_bank import coding_bank

router = APIRouter()

# --------------------------------------------------
# Get Questions
# --------------------------------------------------
@router.get("/coding-questions/{difficulty}/{count}")
def get_questions(difficulty: str, count: int):

    filtered = [q for q in coding_bank if q["difficulty"] == difficulty]

    if not filtered:
        return {"questions": []}

    selected = random.sample(filtered, min(count, len(filtered)))

    questions_to_send = []

    for q in selected:
        q_copy = q.copy()
        q_copy.pop("solution", None)  # remove solution before sending
        questions_to_send.append(q_copy)

    return {"questions": questions_to_send}


# --------------------------------------------------
# Submit Code (Print Output Mode)
# --------------------------------------------------
@router.post("/submit-code")
def submit_code(data: dict = Body(...)):

    user_code = data.get("code")
    question_id = data.get("question_id")

    question = next((q for q in coding_bank if q["id"] == question_id), None)

    if not question:
        return {"error": "Question not found"}

    try:
        # Capture print output
        old_stdout = sys.stdout
        sys.stdout = mystdout = io.StringIO()

        exec(user_code)

        sys.stdout = old_stdout

        output = mystdout.getvalue().strip()
        expected = question["expected_output"].strip()

        if output == expected:
            return {
                "passed": True,
                "your_output": output
            }
        else:
            return {
                "passed": False,
                "your_output": output,
                "expected_output": expected,
                "correct_solution": question["solution"]
            }

    except Exception:
        sys.stdout = old_stdout
        return {
            "passed": False,
            "error": traceback.format_exc(),
            "correct_solution": question["solution"]
        }