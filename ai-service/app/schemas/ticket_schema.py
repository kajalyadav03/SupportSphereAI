from pydantic import BaseModel


class TicketAnalysisRequest(BaseModel):
    title: str
    description: str


class TicketAnalysisResponse(BaseModel):
    summary: str
    category: str
    priority: str
    sentiment: str
    resolution: str
    suggested_reply: str
    recommended_status: str
    