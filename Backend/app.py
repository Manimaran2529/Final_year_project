# =========================
# Imports
# =========================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.orm import Session
import secrets

from database import engine, SessionLocal
from models import User, Base
from routes.mail import router as mail_router


# =========================
# Create Tables
# =========================

Base.metadata.create_all(bind=engine)

# =========================
# FastAPI App
# =========================

app = FastAPI()

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Mail Routes
app.include_router(mail_router)

# =========================
# Google Config
# =========================

GOOGLE_CLIENT_ID = "876274825565-uom73e2emgtlh7jhgjafte1shjed0g0p.apps.googleusercontent.com"

# =========================
# Google Login Model
# =========================

class GoogleLoginRequest(BaseModel):
    token: str

# =========================
# Register Model
# =========================

class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

# =========================
# Google Login Route
# =========================

@app.post("/auth/google-login")
def google_login(data: GoogleLoginRequest):

    db = SessionLocal()

    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo["email"]
        name = idinfo.get("name")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            random_password = secrets.token_hex(8)

            user = User(
                email=email,
                name=name,
                password=random_password
            )

            db.add(user)
            db.commit()
            db.refresh(user)

        return {
            "email": user.email,
            "name": user.name,
            "access_token": "google_success"
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    finally:
        db.close()

# =========================
# Manual Register Route
# =========================

@app.post("/auth/register")
def register(data: RegisterRequest):

    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == data.email).first()

    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=data.email,
        name=data.name,
        password=data.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {"message": "User registered successfully"}