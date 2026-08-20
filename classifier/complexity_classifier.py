import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report


DATASET_FILE = "classifier/complexity_dataset.csv"


FEATURES = [
    "token_count",
    "instruction_count",
    "constraint_count",
    "has_context",
    "output_format_complexity",
]


def train_classifier():

    # Load dataset
    data = pd.read_csv(DATASET_FILE)

    print("=" * 60)
    print("LLM COMPLEXITY CLASSIFIER")
    print("=" * 60)

    print(f"Dataset size: {len(data)}")

    # Features
    X = data[FEATURES]

    # Target
    y = data["complexity"]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples: {len(X_test)}")

    # Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        max_depth=8,
    )

    # Train
    model.fit(X_train, y_train)

    # Predict
    predictions = model.predict(X_test)

    # Accuracy
    accuracy = accuracy_score(
        y_test,
        predictions,
    )

    print()
    print("=" * 60)
    print("MODEL PERFORMANCE")
    print("=" * 60)

    print(
        f"Accuracy: {accuracy * 100:.2f}%"
    )

    # Confusion matrix
    matrix = confusion_matrix(
        y_test,
        predictions,
        labels=[
            "simple",
            "moderate",
            "complex",
        ],
    )

    print()
    print("Confusion Matrix")
    print("-" * 40)

    print(
        "             simple  moderate  complex"
    )

    for label, row in zip(
        ["simple", "moderate", "complex"],
        matrix,
    ):

        print(
            f"{label:<12}"
            f"{row[0]:<9}"
            f"{row[1]:<10}"
            f"{row[2]}"
        )

    # Classification report
    print()
    print("Classification Report")
    print("-" * 40)

    print(
        classification_report(
            y_test,
            predictions,
        )
    )

        # Feature importance
    print()
    print("Feature Importance")
    print("-" * 40)

    importance = pd.DataFrame(
        {
            "feature": FEATURES,
            "importance": model.feature_importances_,
        }
    ).sort_values(
        "importance",
        ascending=False,
    )

    for _, row in importance.iterrows():

        print(
            f"{row['feature']:<30}"
            f"{row['importance']:.4f}"
        )

    # Save trained model
    joblib.dump(
        model,
        "classifier/complexity_model.pkl"
    )

    print()
    print("Model saved to: classifier/complexity_model.pkl")

    return model


if __name__ == "__main__":
    train_classifier()