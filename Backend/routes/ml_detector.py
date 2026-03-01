import joblib
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ml")

# Load trained model
model = joblib.load("phishing_model.pkl")


class EmailRequest(BaseModel):
    subject: str
    body: str


@router.post("/predict")
def predict_email(data: EmailRequest):
    text = data.subject + " " + data.body

    prediction = model.predict([text])[0]
    probability = model.predict_proba([text])[0][1]

    return {
        "is_phishing": bool(prediction),
        "risk_score": round(float(probability) * 100, 2)
    }