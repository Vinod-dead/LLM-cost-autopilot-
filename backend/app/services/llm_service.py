import os
import time
from typing import Any

import requests
from dotenv import load_dotenv
from openai import OpenAI

try:
    import anthropic
except ImportError:
    anthropic = None


# ---------------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# ---------------------------------------------------------

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OLLAMA_BASE_URL = os.getenv(
    "OLLAMA_BASE_URL",
    "http://localhost:11434",
)


# ---------------------------------------------------------
# MODEL CONFIGURATION
# ---------------------------------------------------------

MODEL_CONFIG = {
    "cheap-model": {
        "provider": "openai",
        "provider_model": "gpt-5-mini",
        "input_cost_per_1m_tokens": 0.25,
        "output_cost_per_1m_tokens": 2.00,
        "average_latency_ms": 800,
        "quality_tier": "low",
        "tier": "cheap",
    },

    "balanced-model": {
        "provider": "anthropic",
        "provider_model": "claude-sonnet-4-20250514",
        "input_cost_per_1m_tokens": 3.00,
        "output_cost_per_1m_tokens": 15.00,
        "average_latency_ms": 1200,
        "quality_tier": "medium",
        "tier": "balanced",
    },

    "powerful-model": {
        "provider": "openai",
        "provider_model": "gpt-5",
        "input_cost_per_1m_tokens": 1.25,
        "output_cost_per_1m_tokens": 10.00,
        "average_latency_ms": 1800,
        "quality_tier": "high",
        "tier": "powerful",
    },

    "local-model": {
        "provider": "ollama",
        "provider_model": "llama3.2",
        "input_cost_per_1m_tokens": 0.0,
        "output_cost_per_1m_tokens": 0.0,
        "average_latency_ms": 500,
        "quality_tier": "low",
        "tier": "cheap",
    },
}


# ---------------------------------------------------------
# COST CALCULATION
# ---------------------------------------------------------

def calculate_cost(
    model_name: str,
    input_tokens: int,
    output_tokens: int,
) -> float:

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
# DEMO FALLBACK
# ---------------------------------------------------------

def demo_response(
    prompt: str,
    provider: str,
) -> str:

    return (
        f"Demo response for: {prompt}\n\n"
        f"The {provider} provider is currently unavailable. "
        "The LLM Cost Autopilot routing and cost optimization "
        "system is still working."
    )


# ---------------------------------------------------------
# STANDARDIZED RESPONSE
# ---------------------------------------------------------

def build_response(
    model_name: str,
    config: dict[str, Any],
    response_text: str,
    input_tokens: int,
    output_tokens: int,
    latency_ms: float,
    provider: str,
    fallback: bool = False,
    error: str | None = None,
) -> dict[str, Any]:

    return {
        "model": model_name,
        "provider": provider,
        "provider_model": config["provider_model"],
        "response": response_text,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "cost": calculate_cost(
            model_name,
            input_tokens,
            output_tokens,
        ),
        "latency_ms": round(latency_ms, 2),
        "quality_tier": config["quality_tier"],
        "tier": config["tier"],
        "fallback": fallback,
        "error": error,
    }


# ---------------------------------------------------------
# OPENAI
# ---------------------------------------------------------

def generate_openai(
    prompt: str,
    model_name: str,
    config: dict[str, Any],
) -> dict[str, Any]:

    if not OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is missing."
        )

    client = OpenAI(
        api_key=OPENAI_API_KEY
    )

    start_time = time.perf_counter()

    response = client.responses.create(
        model=config["provider_model"],
        input=prompt,
    )

    latency_ms = (
        time.perf_counter() - start_time
    ) * 1000

    text = getattr(
        response,
        "output_text",
        None,
    ) or ""

    usage = getattr(
        response,
        "usage",
        None,
    )

    input_tokens = int(
        getattr(
            usage,
            "input_tokens",
            0,
        ) or 0
    )

    output_tokens = int(
        getattr(
            usage,
            "output_tokens",
            0,
        ) or 0
    )

    return build_response(
        model_name=model_name,
        config=config,
        response_text=text,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        latency_ms=latency_ms,
        provider="openai",
    )


# ---------------------------------------------------------
# ANTHROPIC
# ---------------------------------------------------------

def generate_anthropic(
    prompt: str,
    model_name: str,
    config: dict[str, Any],
) -> dict[str, Any]:

    if not ANTHROPIC_API_KEY:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is missing."
        )

    if anthropic is None:
        raise RuntimeError(
            "Anthropic package is not installed."
        )

    client = anthropic.Anthropic(
        api_key=ANTHROPIC_API_KEY
    )

    start_time = time.perf_counter()

    response = client.messages.create(
        model=config["provider_model"],
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    latency_ms = (
        time.perf_counter() - start_time
    ) * 1000

    text_parts = []

    for block in response.content:
        block_text = getattr(
            block,
            "text",
            None,
        )

        if block_text:
            text_parts.append(block_text)

    text = "".join(text_parts)

    usage = getattr(
        response,
        "usage",
        None,
    )

    input_tokens = int(
        getattr(
            usage,
            "input_tokens",
            0,
        ) or 0
    )

    output_tokens = int(
        getattr(
            usage,
            "output_tokens",
            0,
        ) or 0
    )

    return build_response(
        model_name=model_name,
        config=config,
        response_text=text,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        latency_ms=latency_ms,
        provider="anthropic",
    )


# ---------------------------------------------------------
# OLLAMA
# ---------------------------------------------------------

def generate_ollama(
    prompt: str,
    model_name: str,
    config: dict[str, Any],
) -> dict[str, Any]:

    url = (
        f"{OLLAMA_BASE_URL.rstrip('/')}"
        "/api/generate"
    )

    start_time = time.perf_counter()

    response = requests.post(
        url,
        json={
            "model": config["provider_model"],
            "prompt": prompt,
            "stream": False,
        },
        timeout=120,
    )

    latency_ms = (
        time.perf_counter() - start_time
    ) * 1000

    response.raise_for_status()

    data = response.json()

    text = data.get(
        "response",
        "",
    )

    input_tokens = int(
        data.get(
            "prompt_eval_count",
            0,
        ) or 0
    )

    output_tokens = int(
        data.get(
            "eval_count",
            0,
        ) or 0
    )

    return build_response(
        model_name=model_name,
        config=config,
        response_text=text,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        latency_ms=latency_ms,
        provider="ollama",
    )


# ---------------------------------------------------------
# MAIN GENERATION FUNCTION
# ---------------------------------------------------------

def generate_response(
    prompt: str,
    model_name: str,
) -> dict[str, Any]:

    if model_name not in MODEL_CONFIG:
        raise ValueError(
            f"Unknown model: {model_name}"
        )

    config = MODEL_CONFIG[model_name]

    provider = config["provider"]

    try:

        # ---------------------------------------------
        # OPENAI
        # ---------------------------------------------

        if provider == "openai":

            return generate_openai(
                prompt,
                model_name,
                config,
            )

        # ---------------------------------------------
        # ANTHROPIC
        # ---------------------------------------------

        if provider == "anthropic":

            return generate_anthropic(
                prompt,
                model_name,
                config,
            )

        # ---------------------------------------------
        # OLLAMA
        # ---------------------------------------------

        if provider == "ollama":

            return generate_ollama(
                prompt,
                model_name,
                config,
            )

        # ---------------------------------------------
        # UNKNOWN PROVIDER
        # ---------------------------------------------

        raise RuntimeError(
            f"Unsupported provider: {provider}"
        )

    except Exception as exc:

        print(
            f"{provider} unavailable: {exc}"
        )

        print(
            "Using demo fallback response."
        )

        # ---------------------------------------------
        # FALLBACK USAGE
        # ---------------------------------------------

        input_tokens = 1000
        output_tokens = 500
        latency_ms = 0.0

        return build_response(
            model_name=model_name,
            config=config,
            response_text=demo_response(
                prompt,
                provider,
            ),
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            latency_ms=latency_ms,
            provider="demo",
            fallback=True,
            error=str(exc),
        )


# ---------------------------------------------------------
# MODEL REGISTRY
# ---------------------------------------------------------

def get_model_registry() -> dict[str, dict[str, Any]]:
    return MODEL_CONFIG