from fastapi import APIRouter, UploadFile, File, Form
from services.analyzer import analyze_job
from services.explainer import explain_result

router = APIRouter()


@router.post("/analyze-job")
async def analyze_job_route(
    description: str = Form(...),
    job_link: str = Form(...),
    offer_letter: UploadFile = File(None)
):

    file_text = ""

    if offer_letter:
        content = await offer_letter.read()
        file_text = content.decode("utf-8", errors="ignore")

    score, status, reasons = analyze_job(description, job_link, file_text)

    explanation = explain_result(score, reasons)

    return {
        "legit_score": score,
        "status": status,
        "reasons": reasons,
        "explanation": explanation
    }