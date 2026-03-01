from fastapi import APIRouter, UploadFile, File
import random
import whisper
import os
from google import genai

router = APIRouter()

# ================= HR QUESTIONS =================

hr_questions = [
    "Tell me about yourself.",
    "Why should we hire you?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "What are your short-term and long-term goals?",
    "Why do you want to work in our company?",
    "Describe a challenging situation and how you handled it.",
    "What is your expected salary?"
]

@router.get("/hr-question")
def get_hr_question():
    return {"question": random.choice(hr_questions)}

# ================= WHISPER MODEL =================

model = whisper.load_model("base")

# ================= GEMINI =================

client = genai.Client(api_key="AIzaSyC24p6QT9xng_6HjALRn62lb5g8o5kJo9I")

# ================= EVALUATION =================

@router.post("/hr-evaluate")
async def evaluate_hr(audio: UploadFile = File(...)):

    folder = "recordings"
    os.makedirs(folder, exist_ok=True)

    file_location = f"{folder}/{audio.filename}"

    with open(file_location, "wb") as f:
        f.write(await audio.read())

    result = model.transcribe(file_location)
    transcript = result["text"]

    prompt = f"""
    Evaluate this HR interview answer:

    "{transcript}"

    Give:
    - Score out of 10
    - Strengths
    - Improvements
    - Confidence level
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "transcript": transcript,
        "feedback": response.text
    }