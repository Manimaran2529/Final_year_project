from fastapi import APIRouter, UploadFile, File
import random
import whisper
import os
from google import genai

router = APIRouter()

# ===============================
# AI HR QUESTION GENERATOR
# ===============================

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@router.get("/hr-question")
def get_hr_question():

    prompt = """
    Generate 1 professional HR interview question.
    Do not repeat common questions.
    Make it realistic and corporate.
    Return only the question.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {"question": response.text.strip()}


# ===============================
# LOAD WHISPER MODEL
# ===============================

model = whisper.load_model("base")


# ===============================
# HR VIDEO EVALUATION
# ===============================

@router.post("/hr-evaluate")
async def evaluate_hr(video: UploadFile = File(...)):

    folder = "recordings"
    os.makedirs(folder, exist_ok=True)

    file_path = f"{folder}/{video.filename}"

    # Save uploaded video
    with open(file_path, "wb") as f:
        f.write(await video.read())

    # Transcribe using Whisper
    result = model.transcribe(file_path)
    transcript = result["text"]

    # AI Evaluation Prompt
    prompt = f"""
    You are an HR interviewer.

    Evaluate this candidate answer:

    "{transcript}"

    Give structured JSON response in this format:

    {{
      "score": number (0-10),
      "confidence_level": percentage,
      "strengths": "text",
      "weaknesses": "text",
      "communication": "text",
      "improvements": "text"
    }}

    Return only valid JSON.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "transcript": transcript,
        "analysis": response.text
    }