from fastapi import FastAPI

from app.routes.ai_routes import router


app = FastAPI(
    title="SupportSphereAI",
    description="AI service for SupportSphere",
    version="1.0.0",
)


app.include_router(router)


@app.get("/")
async def root():
    return {
        "message": "SupportSphereAI is running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }