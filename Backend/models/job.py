from pydantic import BaseModel

class JobRequest(BaseModel):
    description: str
    job_link: str


class JobResponse(BaseModel):
    legit_score: int
    status: str
    reasons: list[str]
