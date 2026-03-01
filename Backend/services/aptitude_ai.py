import os
import json
import re
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def extract_json(text):
    text = text.replace("```json", "").replace("```", "").strip()
    match = re.search(r"\[.*\]", text, re.DOTALL)
    if match:
        return json.loads(match.group())
    return []

def generate_aptitude_questions(category, count, difficulty):

    prompt = f"""
Generate {count} {difficulty} level aptitude questions for category: {category}.

Categories can be:
- Logical Reasoning
- Quantitative Aptitude
- Verbal Ability

For Quantitative include:
- Percentage
- Ratio
- Profit & Loss
- Time & Work

For Logical include:
- Seating Arrangement
- Direction Sense
- Blood Relation

For Verbal include:
- Synonyms
- Grammar correction
- Sentence completion

Return ONLY valid JSON in this format:

[
  {{
    "question": "string",
    "options": ["A", "B", "C", "D"],
    "answer": "correct option",
    "solution": "step by step explanation"
  }}
]
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return extract_json(response.text)