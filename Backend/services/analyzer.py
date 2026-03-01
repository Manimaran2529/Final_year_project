from services.rules import suspicious_keywords, trusted_domains


def analyze_job(description: str, job_link: str, file_text: str = ""):
    score = 100
    reasons = []

    text = (description + " " + file_text).lower()

    # keyword check
    for word in suspicious_keywords:
        if word in text:
            score -= 15
            reasons.append(f"Suspicious keyword found: {word}")

    # https check
    if not job_link.startswith("https"):
        score -= 10
        reasons.append("Unsecure link (no https)")

    # trusted domain check
    if not any(domain in job_link for domain in trusted_domains):
        score -= 10
        reasons.append("Unknown domain")

    score = max(score, 0)

    if score >= 80:
        status = "Legit"
    elif score >= 50:
        status = "Suspicious"
    else:
        status = "Scam"

    return score, status, reasons