import os

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel


load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured"
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


MODEL = "gemini-3.5-flash-lite"


class TicketAnalysis(BaseModel):
    summary: str
    category: str
    priority: str
    sentiment: str
    resolution: str
    suggested_reply: str
    recommended_status: str


async def analyze_ticket(
    title: str,
    description: str,
):

    prompt = f"""
You are SupportSphereAI, an AI customer support assistant.

Analyze the following customer support ticket.

Your goal is to help a human support agent understand
the customer's problem and decide the best next action.

Return:

- summary
- category
- priority
- sentiment
- resolution
- suggested_reply
- recommended_status

Priority must be exactly one of:

low
medium
high
urgent

Recommended status must be exactly one of:

open
in-progress
resolved

Rules for recommended_status:

- Use "open" when the issue has not been addressed yet.
- Use "in-progress" when investigation or agent action is required.
- Use "resolved" only when the provided information indicates
  that the issue can reasonably be considered solved.
- Never use "closed".
- Do not mark a ticket resolved merely because a solution is suggested.

Category should be exactly one of:

technical
billing
account
general
other

Sentiment should be exactly one of:

positive
neutral
negative

Important rules:

- Do not invent information.
- Use only the information provided in the ticket.
- Keep the resolution practical.
- Keep the suggested reply professional and empathetic.
- Do not promise refunds, credits, or actions that are not confirmed.
- The final decision always belongs to the human support agent.

Ticket Title:
{title}

Ticket Description:
{description}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": TicketAnalysis,
        },
    )

    result = TicketAnalysis.model_validate_json(
        response.text
    )

    return result