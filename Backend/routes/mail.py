from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from openai import OpenAI
import smtplib
from email.message import EmailMessage
import os

router = APIRouter()

# =========================
# Groq AI Client
# =========================
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# =========================
# Models
# =========================

class GenerateRequest(BaseModel):
    candidate_name: str
    query: str

class SendRequest(BaseModel):
    hr_email: EmailStr
    subject: str
    message: str
    user_email: EmailStr

# =========================
# 1️⃣ Generate AI Professional Email
# =========================
@router.post("/generate-mail")
async def generate_mail(data: GenerateRequest):

    prompt = f"""
You are a professional corporate email writer.

Rewrite the following message into a highly professional HR email.

Candidate Name: {data.candidate_name}
Message: {data.query}

Requirements:
- Add a suitable subject line
- Formal greeting
- Well-structured paragraphs
- Professional business tone
- No grammar mistakes
- Confident but polite
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    ai_response = completion.choices[0].message.content

    # Simple subject (you can improve later)
    subject = "Professional Inquiry"

    return {
        "subject": subject,
        "body": ai_response
    }


# =========================
# 2️⃣ Send Email After User Edit
# =========================
@router.post("/send-mail")
async def send_mail(data: SendRequest):

    # 🔥 DO NOT use os.getenv like this
    # It is wrong
    # sender_email = os.getenv("manimaranh9965@gmail.com")

    sender_email = "manimaranh9965@gmail.com"
    sender_password = "hldp tuop fviz tcfw"  # Gmail App Password

    msg = EmailMessage()
    msg["From"] = sender_email
    msg["To"] = data.hr_email
    msg["Subject"] = data.subject

    # 🔥 VERY IMPORTANT
    msg["Reply-To"] = data.user_email

    # ✅ Correct field
    msg.set_content(data.message)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)

        return {"status": "Email sent successfully"}

    except Exception as e:
        return {"status": "Error", "details": str(e)}