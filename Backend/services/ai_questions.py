import os
import json
import re
from datetime import date
from google import genai

# ✅ Use environment variable (SAFE)
client = genai.Client(
    api_key=os.getenv("AIzaSyC24p6QT9xng_6HjALRn62lb5g8o5kJo9I")
)


# ---------------------------
# JSON Extractor
# ---------------------------
def extract_json(text):
    try:
        text = text.replace("```json", "").replace("```", "").strip()
        match = re.search(r"\[.*\]", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return []
    except Exception as e:
        print("JSON Error:", e)
        print("RAW:", text)
        return []


# ---------------------------
# DAILY MATH QUESTIONS
# ---------------------------
def generate_daily_math_questions(level: str, count: int):
    try:
        today = date.today().isoformat()

        prompt = f"""
Generate {count} {level} level aptitude math questions for date {today}.

Return ONLY valid JSON in this exact format:

[
  {{
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "correct option",
    "explanation": "step-by-step explanation"
  }}
]

Do not add id.
Do not add difficulty.
Do not add topic.
Return only JSON.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return extract_json(response.text)

    except Exception as e:
        print("Gemini Math Error:", e)
        return []


# ---------------------------
# TECHNICAL QUESTIONS
# ---------------------------
def generate_technical_questions(domain: str, count: int):
    try:
        prompt = f"""
Generate {count} technical interview questions for {domain}.

Return ONLY valid JSON in this exact format:

[
  {{
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "correct option",
    "explanation": "clear explanation"
  }}
]

Return only JSON.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return extract_json(response.text)

    except Exception as e:
        print("Gemini Technical Error:", e)
        return []