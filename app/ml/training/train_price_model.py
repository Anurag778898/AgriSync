"""
Trains an XGBoost price-prediction model (Module 6).
Run:
    python -m app.ml.training.train_price_model --csv path/to/price_history.csv

Expected CSV columns:
    date, crop_id, mandi_id, modal_price, arrival_qty, rainfall, temperature,
    is_festival, msp, season
"""
import argparse
import os
import joblib
import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_absolute_percentage_error

ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(["crop_id", "mandi_id", "date"])
    df["lag_1"] = df.groupby(["crop_id", "mandi_id"])["modal_price"].shift(1)
    df["lag_7"] = df.groupby(["crop_id", "mandi_id"])["modal_price"].shift(7)
    df["rolling_mean_7"] = df.groupby(["crop_id", "mandi_id"])["modal_price"].transform(
        lambda x: x.rolling(7, min_periods=1).mean()
    )
    df["season_code"] = df["season"].astype("category").cat.codes
    df = df.dropna(subset=["lag_1", "lag_7"])
    return df


def train(csv_path: str):
    df = pd.read_csv(csv_path)
    df = build_features(df)

    feature_cols = [
        "crop_id", "mandi_id", "arrival_qty", "rainfall", "temperature",
        "is_festival", "msp", "season_code", "lag_1", "lag_7", "rolling_mean_7",
    ]
    X = df[feature_cols]
    y = df["modal_price"]

    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    model = xgb.XGBRegressor(
        n_estimators=400, max_depth=7, learning_rate=0.03, subsample=0.8, colsample_bytree=0.8
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mape = mean_absolute_percentage_error(y_test, preds)
    print(f"Price model MAPE on holdout: {mape:.3f}")

    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    out_path = os.path.join(ARTIFACT_DIR, "price_model.pkl")
    joblib.dump({"model": model, "feature_cols": feature_cols}, out_path)
    print(f"Saved model to {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True, help="Path to historical price CSV")
    args = parser.parse_args()
    train(args.csv)
