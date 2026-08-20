import os
import joblib
import yaml

from backend.app.services.model_registry import get_model
from classifier.feature_extractor import extract_features
BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../../")
)

ROUTING_CONFIG_FILE = os.path.join(
    BASE_DIR,
    "config",
    "routing.yaml",
)


def load_routing_config() -> dict:
    with open(
        ROUTING_CONFIG_FILE,
        "r",
        encoding="utf-8",
    ) as file:
        return yaml.safe_load(file)

# ---------------------------------------------------------
# LOAD TRAINED ML CLASSIFIER
# ---------------------------------------------------------

MODEL_PATH = "classifier/complexity_model.pkl"

complexity_model = joblib.load(MODEL_PATH)

# ---------------------------------------------------------
# ML COMPLEXITY CLASSIFIER
# ---------------------------------------------------------
def classify_prompt(prompt: str) -> str:
    """
    Hybrid complexity classifier.

    Uses the trained ML model for normal prompts,
    with strong complexity signals as safety overrides.
    """

    prompt = prompt.strip()

    if not prompt:
        return "simple"

    prompt_lower = prompt.lower()

    # Strong complexity signals
    complex_signals = [
        "scalable architecture",
        "distributed architecture",
        "distributed system",
        "fault tolerance",
        "fault-tolerant",
        "microservices",
        "production-ready",
        "production system",
        "machine learning pipeline",
        "deep learning model",
        "real-time fraud detection",
        "large-scale",
        "multi-step reasoning",
        "optimization strategy",
    ]

    # Safety override:
    # If the prompt clearly requires complex engineering/reasoning,
    # don't allow the ML model to downgrade it.
    if any(
        signal in prompt_lower
        for signal in complex_signals
    ):
        return "complex"

    # ML classification
    features = extract_features(prompt)

    prediction = complexity_model.predict(
        features
    )

    return str(prediction[0])

# ---------------------------------------------------------
# MODEL SELECTION
# ---------------------------------------------------------

def select_model(complexity: str) -> str:
    """
    Select a model using the YAML routing configuration.
    """

    config = load_routing_config()

    routing_map = config.get(
        "routing",
        {},
    )

    default_model = config.get(
        "default_model",
        "cheap-model",
    )

    return routing_map.get(
        complexity,
        default_model,
    )
# ---------------------------------------------------------
# COST ESTIMATION
# ---------------------------------------------------------

def estimate_cost(
    model_name: str,
    input_tokens: int,
    output_tokens: int,
) -> float:

    model = get_model(model_name)

    input_cost = (
        input_tokens / 1_000_000
    ) * model["input_cost_per_1m_tokens"]

    output_cost = (
        output_tokens / 1_000_000
    ) * model["output_cost_per_1m_tokens"]

    return round(
        input_cost + output_cost,
        8,
    )


# ---------------------------------------------------------
# SAVINGS CALCULATION
# ---------------------------------------------------------

def calculate_savings(
    selected_model: str,
    input_tokens: int,
    output_tokens: int,
) -> dict:

    selected_cost = estimate_cost(
        selected_model,
        input_tokens,
        output_tokens,
    )

    powerful_cost = estimate_cost(
        "powerful-model",
        input_tokens,
        output_tokens,
    )

    savings = powerful_cost - selected_cost

    if powerful_cost > 0:
        savings_percentage = (
            savings / powerful_cost
        ) * 100
    else:
        savings_percentage = 0

    return {
        "selected_model_cost": round(
            selected_cost,
            8,
        ),
        "powerful_model_cost": round(
            powerful_cost,
            8,
        ),
        "potential_savings": round(
            savings,
            8,
        ),
        "savings_percentage": round(
            savings_percentage,
            2,
        ),
    }


# ---------------------------------------------------------
# MAIN ROUTER
# ---------------------------------------------------------

def route_prompt(
    prompt: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
) -> dict:
    """
    ML-based routing pipeline.

    Prompt
       ↓
    Feature extraction
       ↓
    Random Forest classifier
       ↓
    Complexity tier
       ↓
    Model selection
       ↓
    Cost + savings calculation
    """

    complexity = classify_prompt(prompt)

    model_name = select_model(
        complexity
    )

    model = get_model(
        model_name
    )

    estimated_cost = estimate_cost(
        model_name,
        input_tokens,
        output_tokens,
    )

    savings = calculate_savings(
        model_name,
        input_tokens,
        output_tokens,
    )

    return {
        "prompt": prompt,
        "complexity": complexity,
        "selected_model": model_name,
        "model_details": model,
        "estimated_cost": estimated_cost,
        "savings": savings,
    }