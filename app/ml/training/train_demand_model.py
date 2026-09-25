"""
Trains an XGBoost demand-forecasting model (Module 5).
Run manually or from a scheduled job:
    python -m app.ml.training.train_demand_model --csv path/to/demand_history.csv

Expected CSV columns (adjust to your real dataset):
    date, crop_id, mandi_id, arrival_qty, temperature, rainfall, is_festival, demand_qty
"""
import argparse
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_percentage_error
import joblib
import os

ARTIFACT_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")
    df["day_of_year"] = df["date"].dt.dayofyear
    df["month"] = df["date"].dt.month
    df["lag_7_demand"] = df.groupby("crop_id")["demand_qty"].shift(7)
    df["rolling_mean_7"] = df.groupby("crop_id")["demand_qty"].transform(lambda x: x.rolling(7, min_periods=1).mean())
    df = df.dropna(subset=["lag_7_demand"])
    return df


def train(csv_path: str):
    df = pd.read_csv(csv_path)
    df = build_features(df)

    feature_cols = [
        "crop_id", "mandi_id", "arrival_qty", "temperature", "rainfall",
        "is_festival", "day_of_year", "month", "lag_7_demand", "rolling_mean_7",
    ]
    X = df[feature_cols]
    y = df["demand_qty"]

    # IMPORTANT: time-based split, never random shuffle for time series
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    model = xgb.XGBRegressor(
        n_estimators=300, max_depth=6, learning_rate=0.05, subsample=0.8, colsample_bytree=0.8
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mape = mean_absolute_percentage_error(y_test, preds)
    print(f"Demand model MAPE on holdout: {mape:.3f}")

    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    out_path = os.path.join(ARTIFACT_DIR, "demand_model.pkl")
    joblib.dump({"model": model, "feature_cols": feature_cols}, out_path)
    print(f"Saved model to {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True, help="Path to historical demand CSV")
    args = parser.parse_args()
    train(args.csv)
