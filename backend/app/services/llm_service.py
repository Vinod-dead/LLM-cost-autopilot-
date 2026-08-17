import os

from dotenv import load_dotenv
from openai import OpenAI


# ---------------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ---------------------------------------------------------

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# ---------------------------------------------------------
# MODEL CONFIGURATION
# ---------------------------------------------------------

MODEL_CONFIG = {
    "cheap-model": {
        "provider": "openai",
        "provider_model": "gpt-5-mini",
        "input_cost_per_1m_tokens": 0.10,
        "output_cost_per_1m_tokens": 0.40,
        "tier": "cheap",
    },

    "balanced-model": {
        "provider": "openai",
        "provider_model": "gpt-5",
        "input_cost_per_1m_tokens": 0.50,
        "output_cost_per_1m_tokens": 1.50,
        "tier": "balanced",
    },

    "powerful-model": {
        "provider": "openai",
        "provider_model": "gpt-5",
        "input_cost_per_1m_tokens": 1.50,
        "output_cost_per_1m_tokens": 4.00,
        "tier": "powerful",
    },
}


# ---------------------------------------------------------
# COST CALCULATION
# ---------------------------------------------------------

def calculate_cost(model_name, input_tokens, output_tokens):

    config = MODEL_CONFIG[model_name]

    input_cost = (
        input_tokens / 1_000_000
    ) * config["input_cost_per_1m_tokens"]

    output_cost = (
        output_tokens / 1_000_000
    ) * config["output_cost_per_1m_tokens"]

    return round(
        input_cost + output_cost,
        6,
    )


# ---------------------------------------------------------
# DEMO FALLBACK RESPONSE
# ---------------------------------------------------------

def demo_response(prompt):

    return (
        f"Demo response for: {prompt}\n\n"
        "OpenAI API is currently unavailable or has no credits. "
        "The routing and cost optimization system is still working."
    )


# ---------------------------------------------------------
# GENERATE RESPONSE
# ---------------------------------------------------------

def generate_response(prompt, model_name):

    if model_name not in MODEL_CONFIG:
        raise ValueError(
            f"Unknown model: {model_name}"
        )

    config = MODEL_CONFIG[model_name]

    # Default fallback usage
    input_tokens = 1000
    output_tokens = 500

    # -----------------------------------------------------
    # CHECK API KEY
    # -----------------------------------------------------

    if not OPENAI_API_KEY:

        print("OPENAI_API_KEY is missing.")
        print("Using demo fallback response.")

        return {
            "model": model_name,
            "provider": "demo",
            "provider_model": config["provider_model"],
            "response": demo_response(prompt),
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": calculate_cost(
                model_name,
                input_tokens,
                output_tokens,
            ),
        }

    # -----------------------------------------------------
    # OPENAI CLIENT
    # -----------------------------------------------------

    client = OpenAI(
        api_key=OPENAI_API_KEY
    )

    # -----------------------------------------------------
    # REAL OPENAI REQUEST
    # -----------------------------------------------------

    try:

        response = client.responses.create(
            model=config["provider_model"],
            input=prompt,
        )

        # ---------------------------------------------
        # RESPONSE TEXT
        # ---------------------------------------------

        text = getattr(
            response,
            "output_text",
            None,
        )

        if not text:
            text = demo_response(prompt)

        # ---------------------------------------------
        # REAL TOKEN USAGE
        # ---------------------------------------------

        usage = getattr(
            response,
            "usage",
            None,
        )

        if usage:

            input_tokens = int(
                getattr(
                    usage,
                    "input_tokens",
                    input_tokens,
                )
                or input_tokens
            )

            output_tokens = int(
                getattr(
                    usage,
                    "output_tokens",
                    output_tokens,
                )
                or output_tokens
            )

        # ---------------------------------------------
        # REAL COST
        # ---------------------------------------------

        cost = calculate_cost(
            model_name,
            input_tokens,
            output_tokens,
        )

        return {
            "model": model_name,
            "provider": "openai",
            "provider_model": config["provider_model"],
            "response": text,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": cost,
        }

    # -----------------------------------------------------
    # EXCEPTION / FALLBACK
    # -----------------------------------------------------

    except Exception as exc:

        print(f"OpenAI unavailable: {exc}")
        print("Using demo fallback response.")

        return {
            "model": model_name,
            "provider": "demo",
            "provider_model": config["provider_model"],
            "response": demo_response(prompt),
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost": calculate_cost(
                model_name,
                input_tokens,
                output_tokens,
            ),
        }