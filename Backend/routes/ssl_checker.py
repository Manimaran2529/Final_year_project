from fastapi import APIRouter
from pydantic import BaseModel
import ssl
import socket
from urllib.parse import urlparse
from datetime import datetime

router = APIRouter(prefix="/ssl")


class SSLRequest(BaseModel):
    url: str


def check_ssl_certificate(url: str):
    parsed = urlparse(url)
    hostname = parsed.netloc

    if not hostname:
        return {"error": "Invalid URL"}

    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()

                expiry_date = datetime.strptime(
                    cert['notAfter'], "%b %d %H:%M:%S %Y %Z"
                )

                days_left = (expiry_date - datetime.utcnow()).days

                return {
                    "issuer": cert['issuer'],
                    "expires_on": expiry_date.strftime("%Y-%m-%d"),
                    "days_remaining": days_left,
                    "ssl_valid": days_left > 0
                }

    except Exception as e:
        return {
            "ssl_valid": False,
            "error": str(e)
        }


@router.post("/check")
def ssl_check(data: SSLRequest):
    return check_ssl_certificate(data.url)