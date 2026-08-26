from fastapi import APIRouter, HTTPException

from app.schemas.ticket_schema import (
    TicketAnalysisRequest,
    TicketAnalysisResponse,
)

from app.services.ai_service import analyze_ticket


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/analyze-ticket",
    response_model=TicketAnalysisResponse,
)
async def analyze_ticket_route(
    ticket: TicketAnalysisRequest,
):
    try:
        result = await analyze_ticket(
            title=ticket.title,
            description=ticket.description,
        )

        return result

    except Exception as error:
        print("AI analysis error:", error)

        raise HTTPException(
            status_code=500,
            detail="AI analysis failed",
        )