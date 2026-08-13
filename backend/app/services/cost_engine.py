def calculate_cost(
    input_tokens: int,
    output_tokens: int,
    input_cost_per_1m_tokens: float,
    output_cost_per_1m_tokens: float,
) -> float:
    input_cost = (
        input_tokens / 1_000_000
    ) * input_cost_per_1m_tokens

    output_cost = (
        output_tokens / 1_000_000
    ) * output_cost_per_1m_tokens

    return round(input_cost + output_cost, 8)