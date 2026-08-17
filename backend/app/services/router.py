from backend.app.services.model_registry import get_model


def classify_prompt(prompt: str) -> str:
    """
    Classify a prompt into simple, moderate, or complex.
    """

    prompt = prompt.strip()

    if not prompt:
        return "simple"

    prompt_lower = prompt.lower()
    word_count = len(prompt.split())

    # Strong signals of genuinely complex work
    complex_keywords = [
        "production-ready",
        "distributed system",
        "scalable architecture",
        "system architecture",
        "machine learning pipeline",
        "deep learning model",
        "train a model",
        "deploy a model",
        "real-time fraud detection",
        "fault tolerance",
        "microservices",
        "large-scale",
        "optimization strategy",
        "research paper",
        "multi-step reasoning",
    ]

    # Moderate tasks
    moderate_keywords = [
        "explain",
        "summarize",
        "calculate",
        "difference",
        "compare",
        "example",
        "examples",
        "describe",
        "how does",
        "how do",
        "advantages",
        "disadvantages",
    ]

    # Complex if strong complexity signals exist
    if (
        any(keyword in prompt_lower for keyword in complex_keywords)
        or word_count > 80
    ):
        return "complex"

    # Moderate if it asks for explanation/comparison
    if (
        any(keyword in prompt_lower for keyword in moderate_keywords)
        or word_count > 25
    ):
        return "moderate"

    return "simple"


def select_model(complexity: str) -> str:
    """
    Select the most appropriate model based on prompt complexity.
    """

    model_map = {
        "simple": "cheap-model",
        "moderate": "balanced-model",
        "complex": "powerful-model",
    }

    return model_map.get(complexity, "cheap-model")


def route_prompt(
    prompt: str,
    input_tokens: int = 0,
    output_tokens: int = 0,
) -> dict:
    """
    Classify a prompt, select a model, estimate its cost,
    and calculate potential savings.
    """

    complexity = classify_prompt(prompt)
    model_name = select_model(complexity)
    model = get_model(model_name)

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

    return round(input_cost + output_cost, 8)
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
        "selected_model_cost": round(selected_cost, 8),
        "powerful_model_cost": round(powerful_cost, 8),
        "potential_savings": round(savings, 8),
        "savings_percentage": round(savings_percentage, 2),
    }