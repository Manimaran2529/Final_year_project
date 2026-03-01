from fastapi import APIRouter

router = APIRouter()

user_progress = {
    "aptitude_done": 5,
    "coding_done": 3,
    "hr_practice_done": 2,
    "score": 78
}


@router.get("/progress")
def progress():
    return user_progress