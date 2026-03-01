# routes/url_detector.py

from fastapi import APIRouter
from pydantic import BaseModel
import re
from urllib.parse import urlparse

router = APIRouter(prefix="/url")

class URLRequest(BaseModel):
    url: str


def calculate_url_risk(url: str):
    risk_score = 0
    reasons = []

    parsed = urlparse(url)

    # 1️⃣ IP Address check
    if re.match(r"^\d+\.\d+\.\d+\.\d+", parsed.netloc):
        risk_score += 30
        reasons.append("URL uses IP address instead of domain")

    # 2️⃣ @ symbol
    if "@" in url:
        risk_score += 20
        reasons.append("URL contains @ symbol")

    # 3️⃣ Long URL
    if len(url) > 75:
        risk_score += 15
        reasons.append("URL is very long")

    # 4️⃣ Suspicious words
    suspicious_words = ["login", "verify", "bank", "update", "secure"]
    for word in suspicious_words:
        if word in url.lower():
            risk_score += 10
            reasons.append(f"Suspicious word detected: {word}")

    # 5️⃣ HTTPS check
    if not parsed.scheme == "https":
        risk_score += 15
        reasons.append("Not using HTTPS")

    return risk_score, reasons


@router.post("/analyze")
def analyze_url(data: URLRequest):
    score, reasons = calculate_url_risk(data.url)

    return {
        "risk_score": score,
        "risk_level": "High" if score > 60 else "Medium" if score > 30 else "Low",
        "reasons": reasons
    }