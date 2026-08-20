import re
import pandas as pd


FEATURES = [
    "token_count",
    "instruction_count",
    "constraint_count",
    "has_context",
    "output_format_complexity",
]


INSTRUCTION_WORDS = [
    "explain",
    "compare",
    "analyze",
    "summarize",
    "classify",
    "design",
    "create",
    "develop",
    "evaluate",
    "recommend",
    "identify",
    "propose",
]


CONSTRAINT_WORDS = [
    "at least",
    "maximum",
    "minimum",
    "must",
    "should",
    "while",
    "without",
    "include",
    "excluding",
    "considering",
]


CONTEXT_WORDS = [
    "following",
    "hypothetical",
    "dataset",
    "text",
    "article",
    "requirements",
    "feedback",
]


OUTPUT_FORMATS = [
    "bullet points",
    "table",
    "structured",
    "architecture",
    "framework",
    "strategy",
    "pipeline",
    "plan",
]


def extract_features(prompt: str) -> pd.DataFrame:
    """
    Extract the five features used by the trained classifier.
    Returns a pandas DataFrame with the correct feature names.
    """

    text = prompt.strip().lower()

    token_count = len(
        re.findall(r"\b\w+\b", text)
    )

    instruction_count = sum(
        1
        for word in INSTRUCTION_WORDS
        if re.search(
            rf"\b{re.escape(word)}\b",
            text,
        )
    )

    constraint_count = sum(
        1
        for phrase in CONSTRAINT_WORDS
        if phrase in text
    )

    has_context = int(
        any(
            phrase in text
            for phrase in CONTEXT_WORDS
        )
    )

    output_format_complexity = sum(
        1
        for fmt in OUTPUT_FORMATS
        if fmt in text
    )

    return pd.DataFrame(
        [[
            token_count,
            instruction_count,
            constraint_count,
            has_context,
            output_format_complexity,
        ]],
        columns=FEATURES,
    )