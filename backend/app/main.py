from fastapi import FastAPI
from backend.app.services.cost_engine import calculate_cost
from backend.app.services.model_registry import get_model
from backend.app.db.database import Base, engine
from backend.app.db.models import UsageLog
from backend.app.routes.usage import router as usage_router
from pydantic import BaseModel
from backend.app.services.router import route_prompt

app = FastAPI(
    title="LLM Cost Autopilot API",
    description="AI-powered LLM cost optimization platform",
    version="1.0.0",
)
Base.metadata.create_all(bind=engine)
app.include_router(usage_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LLM Cost Autopilot",
    }


@app.get("/cost/test")
def test_cost():
    cost = calculate_cost(
        input_tokens=10000,
        output_tokens=5000,
        input_cost_per_1m_tokens=0.1,
        output_cost_per_1m_tokens=0.4,
    )

    return {
        "input_tokens": 10000,
        "output_tokens": 5000,
        "cost": cost,
    }
@app.get("/models/{model_name}")
def get_model_info(model_name: str):
    try:
        model = get_model(model_name)

        return {
            "model": model_name,
            "details": model
        }

    except ValueError as error:
        return {
            "error": str(error)
        }
class RouteRequest(BaseModel):
    prompt: str
    input_tokens: int = 0
    output_tokens: int = 0


@app.post("/route")
def route_request(request: RouteRequest):
   return route_prompt(
    request.prompt,
    request.input_tokens,
    request.output_tokens,
)