from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.app.db.database import get_db, Base, engine
from backend.app.db.models import UsageLog

from backend.app.routes.usage import router as usage_router

from backend.app.services.cost_engine import calculate_cost
from backend.app.services.model_registry import get_model
from backend.app.services.router import route_prompt
from backend.app.services.llm_service import generate_response


# ============================================================
# DATABASE
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="LLM Cost Autopilot API",
    description="AI-powered LLM cost optimization platform",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTES
# ============================================================

app.include_router(usage_router)


# ============================================================
# REQUEST MODELS
# ============================================================

class PromptRequest(BaseModel):
    prompt: str
    input_tokens: int = 0
    output_tokens: int = 0


class RouteRequest(BaseModel):
    prompt: str
    input_tokens: int = 0
    output_tokens: int = 0


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LLM Cost Autopilot",
    }


# ============================================================
# COST TEST
# ============================================================

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


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/models/{model_name}")
def get_model_info(model_name: str):

    try:
        model = get_model(model_name)

        return {
            "model": model_name,
            "details": model,
        }

    except ValueError as error:

        return {
            "error": str(error),
        }


# ============================================================
# ROUTE ENDPOINT
# ============================================================

@app.post("/route")
def route_request(
    request: RouteRequest,
    db: Session = Depends(get_db),
):

    result = route_prompt(
        request.prompt,
        request.input_tokens,
        request.output_tokens,
    )

    usage = UsageLog(
        model=result["selected_model"],
        provider=result["model_details"]["provider"],
        input_tokens=request.input_tokens,
        output_tokens=request.output_tokens,
        cost=result["estimated_cost"],
        latency_ms=None,
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return result


# ============================================================
# GENERATE ENDPOINT
# ============================================================

@app.post("/generate")
def generate(
    prompt_request: PromptRequest,
    db: Session = Depends(get_db),
):

    prompt = prompt_request.prompt

    # --------------------------------------------------------
    # 1. ROUTE PROMPT
    # --------------------------------------------------------

    routing_result = route_prompt(prompt)

    selected_model = routing_result["selected_model"]

    model_details = routing_result["model_details"]


    # --------------------------------------------------------
    # 2. GENERATE LLM RESPONSE
    # --------------------------------------------------------

    llm_result = generate_response(
        prompt,
        selected_model,
    )


    # --------------------------------------------------------
    # 3. GET TOKEN USAGE
    # --------------------------------------------------------

    input_tokens = int(
        llm_result.get(
            "input_tokens",
            prompt_request.input_tokens or 1000,
        )
    )

    output_tokens = int(
        llm_result.get(
            "output_tokens",
            prompt_request.output_tokens or 500,
        )
    )


    # --------------------------------------------------------
    # 4. SELECTED MODEL COST
    # --------------------------------------------------------

    input_price = float(
        model_details.get(
            "input_cost_per_1m_tokens",
            0,
        )
    )

    output_price = float(
        model_details.get(
            "output_cost_per_1m_tokens",
            0,
        )
    )

    selected_cost = (
        (input_tokens / 1_000_000) * input_price
        +
        (output_tokens / 1_000_000) * output_price
    )

    selected_cost = round(
        selected_cost,
        6,
    )


    # --------------------------------------------------------
    # 5. POWERFUL MODEL COST
    # --------------------------------------------------------

    powerful_input_price = 1.5
    powerful_output_price = 4.0

    powerful_cost = (
        (input_tokens / 1_000_000)
        * powerful_input_price
        +
        (output_tokens / 1_000_000)
        * powerful_output_price
    )

    powerful_cost = round(
        powerful_cost,
        6,
    )


    # --------------------------------------------------------
    # 6. SAVINGS
    # --------------------------------------------------------

    potential_savings = max(
        powerful_cost - selected_cost,
        0,
    )

    potential_savings = round(
        potential_savings,
        6,
    )


    # --------------------------------------------------------
    # 7. SAVINGS PERCENTAGE
    # --------------------------------------------------------

    if powerful_cost > 0:

        savings_percentage = (
            potential_savings
            / powerful_cost
        ) * 100

    else:

        savings_percentage = 0


    savings_percentage = round(
        savings_percentage,
        2,
    )


    # --------------------------------------------------------
    # 8. UPDATE ROUTING RESULT
    # --------------------------------------------------------

    routing_result["estimated_cost"] = selected_cost

    routing_result["savings"] = {

        "selected_model_cost": selected_cost,

        "powerful_model_cost": powerful_cost,

        "potential_savings": potential_savings,

        "savings_percentage": savings_percentage,

    }


    # --------------------------------------------------------
    # 9. SAVE USAGE DIRECTLY TO DATABASE
    #
    # IMPORTANT:
    # We DO NOT use save_usage().
    # This fixes your NameError.
    # --------------------------------------------------------

    usage_record = UsageLog(

        model=selected_model,

        provider=llm_result.get(
            "provider",
            model_details.get(
                "provider",
                "demo",
            ),
        ),

        input_tokens=input_tokens,

        output_tokens=output_tokens,

        cost=selected_cost,

        latency_ms=None,

    )

    db.add(usage_record)

    db.commit()

    db.refresh(usage_record)


    # --------------------------------------------------------
    # 10. RETURN RESPONSE TO FRONTEND
    # --------------------------------------------------------

    return {

        "routing": routing_result,

        "llm": {

            "model": llm_result.get(
                "model",
                selected_model,
            ),

            "provider": llm_result.get(
                "provider",
                "demo",
            ),

            "provider_model": llm_result.get(
                "provider_model",
                "demo-model",
            ),

            "response": llm_result.get(
                "response",
                "",
            ),

        },

        "usage": {

            "id": usage_record.id,

            "model": usage_record.model,

            "provider": usage_record.provider,

            "input_tokens": usage_record.input_tokens,

            "output_tokens": usage_record.output_tokens,

            "cost": usage_record.cost,

        },

    }