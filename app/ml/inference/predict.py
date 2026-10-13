"""
Loads trained model artifacts and runs predictions.
Used by the nightly batch job (app/workers/scheduler.py) to populate the
`predictions` table — the API never trains or infers live per-request.
"""
import os
import joblib
import pandas as pd

ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")


def _load(model_name: str):
    path = os.path.join(ARTIFACT_DIR, model_name)
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"{model_name} not found at {path}. Train it first: "
            f"python -m app.ml.training.train_{model_name.replace('_model.pkl', '')}_model --csv <your_csv>"
        )
    return joblib.load(path)


def predict_demand(feature_row: dict) -> float:
    bundle = _load("demand_model.pkl")
    model, feature_cols = bundle["model"], bundle["feature_cols"]
    X = pd.DataFrame([feature_row])[feature_cols]
    return float(model.predict(X)[0])


def predict_price(feature_row: dict) -> float:
    bundle = _load("price_model.pkl")
    model, feature_cols = bundle["model"], bundle["feature_cols"]
    X = pd.DataFrame([feature_row])[feature_cols]
    return float(model.predict(X)[0])
