from fastapi import APIRouter

router = APIRouter()

@router.get("/interview-tips")
def interview_tips():

    return {
        "prepare": [
            "Study company background",
            "Review job description skills",
            "Practice common HR questions",
            "Revise core technical concepts"
        ],
        "how_to_speak": [
            "Speak slow and clear",
            "Be confident",
            "Use examples",
            "Do not memorize answers"
        ],
        "bonus": [
            "Dress neat",
            "Check internet before online interview",
            "Keep resume ready"
        ]
    }