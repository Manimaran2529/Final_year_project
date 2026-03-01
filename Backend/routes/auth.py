from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel

router = APIRouter()

GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID.apps.googleusercontent.com"


class GoogleLoginRequest(BaseModel):
    token: str


@router.post("/google-login")
def google_login(data: GoogleLoginRequest):
    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]

        return {
            "access_token": "google-user-token",
            "email": email
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")