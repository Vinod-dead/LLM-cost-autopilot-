import csv
import os
import sys
import time
from datetime import datetime

PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.app.services.llm_service import generate_response


PROMPTS = [
    "What is Python?",
    "Explain machine learning in simple terms.",
    "What is the difference between AI and machine learning?",
    "Summarize the benefits of cloud computing.",
    "Extract the main points from this text: AI helps computers learn from data.",
    "Compare supervised learning and unsupervised learning.",
    "Explain how a REST API works.",
    "Write a short explanation of neural networks.",
    "Analyze the advantages and disadvantages of using AI in healthcare.",
    "Explain step by step how gradient descent works.",
]


MODELS = [
    "cheap-model",
    "balanced-model",
    "powerful-model",
    "local-model",
]


OUTPUT_FILE = os.path.join(
    PROJECT_ROOT,
    "benchmarks",
    "baseline_results.csv",
)


def run_benchmark():

    results = []

    unavailable_providers = set()

    total_tests = len(PROMPTS) * len(MODELS)

    print("=" * 70)
    print("LLM COST AUTOPILOT - BASELINE BENCHMARK")
    print("=" * 70)

    print(f"Prompts: {len(PROMPTS)}")
    print(f"Models:  {len(MODELS)}")
    print(f"Maximum tests: {total_tests}")
    print()

    test_number = 0

    for model in MODELS:

        print("-" * 70)
        print(f"MODEL: {model}")
        print("-" * 70)

        for prompt in PROMPTS:

            test_number += 1

            print(
                f"[{test_number}/{total_tests}] "
                f"{model} -> {prompt[:55]}"
            )

            try:

                started = time.perf_counter()

                response = generate_response(
                    prompt,
                    model,
                )

                measured_latency = (
                    time.perf_counter() - started
                ) * 1000

                provider = response.get(
                    "provider",
                    "unknown",
                )

                fallback = response.get(
                    "fallback",
                    False,
                )

                error = response.get(
                    "error",
                    "",
                )

                # -------------------------------------------------
                # DETECT UNAVAILABLE PROVIDER
                # -------------------------------------------------

                if fallback and error:

                    error_lower = str(error).lower()

                    provider_config = {
                        "openai": "openai",
                        "anthropic": "anthropic",
                        "ollama": "ollama",
                    }

                    detected_provider = None

                    for provider_name in provider_config:

                        if provider_name in error_lower:
                            detected_provider = provider_name
                            break

                    if detected_provider:

                        print(
                            f"    {detected_provider.upper()} "
                            "unavailable."
                        )

                        print(
                            "    Skipping remaining prompts "
                            "for this provider."
                        )

                        unavailable_providers.add(
                            detected_provider
                        )

                        continue

                results.append(
                    {
                        "timestamp": datetime.now().isoformat(),
                        "model": response.get(
                            "model",
                            model,
                        ),
                        "provider": provider,
                        "provider_model": response.get(
                            "provider_model",
                            "",
                        ),
                        "prompt": prompt,
                        "input_tokens": response.get(
                            "input_tokens",
                            0,
                        ),
                        "output_tokens": response.get(
                            "output_tokens",
                            0,
                        ),
                        "cost": response.get(
                            "cost",
                            0,
                        ),
                        "latency_ms": response.get(
                            "latency_ms",
                            measured_latency,
                        ),
                        "quality_tier": response.get(
                            "quality_tier",
                            "",
                        ),
                        "fallback": fallback,
                        "error": error,
                    }
                )

                print(
                    f"    Provider: {provider}"
                )

                print(
                    f"    Cost: "
                    f"${response.get('cost', 0):.6f}"
                )

                print(
                    f"    Latency: "
                    f"{response.get('latency_ms', 0):.2f} ms"
                )

                print(
                    f"    Fallback: {fallback}"
                )

            except Exception as exc:

                print(
                    f"    ERROR: {exc}"
                )

            print()

    # ---------------------------------------------------------
    # SAVE RESULTS
    # ---------------------------------------------------------

    fieldnames = [
        "timestamp",
        "model",
        "provider",
        "provider_model",
        "prompt",
        "input_tokens",
        "output_tokens",
        "cost",
        "latency_ms",
        "quality_tier",
        "fallback",
        "error",
    ]

    with open(
        OUTPUT_FILE,
        "w",
        newline="",
        encoding="utf-8",
    ) as csv_file:

        writer = csv.DictWriter(
            csv_file,
            fieldnames=fieldnames,
        )

        writer.writeheader()
        writer.writerows(results)

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------

    print("=" * 70)
    print("BENCHMARK COMPLETE")
    print("=" * 70)

    print()

    print(
        f"Valid benchmark records: {len(results)}"
    )

    if unavailable_providers:

        print()

        print(
            "Unavailable providers:"
        )

        for provider in sorted(
            unavailable_providers
        ):
            print(
                f"  - {provider}"
            )

    print()

    print(
        f"Results saved to:"
    )

    print(
        OUTPUT_FILE
    )

    print()

    print(
        "Note: unavailable providers were skipped "
        "instead of generating repeated fallback results."
    )


if __name__ == "__main__":
    run_benchmark()