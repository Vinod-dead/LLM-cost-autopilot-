import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODELS_FILE = PROJECT_ROOT / "config" / "models.json"


def load_models():
    with open(MODELS_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data["models"]


def get_model(model_name: str):
    models = load_models()

    if model_name not in models:
        raise ValueError(f"Model '{model_name}' not found")

    return models[model_name]