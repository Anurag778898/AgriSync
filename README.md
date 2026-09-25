# AgriSync Backend — Step-by-Step Setup Guide

This is a working FastAPI backend implementing the Phase 2 roadmap, including
the **new demand-supply price prediction + best-selling-window recommender**.
Everything here has been tested and runs.

---

## 0. What's already tested and working

- ✅ App boots (`app/main.py`)
- ✅ `/health` endpoint
- ✅ `/api/v1/predictions/best-selling-window` (the new method you asked for)
- ✅ `/api/v1/predictions/price-from-supply-demand`
- ✅ `/api/v1/recommendations/rank`
- ✅ Unit tests in `tests/test_price_demand_supply.py` (3/3 passing)

Everything else (weather, market, auth, notifications) is wired up and will
run — you just need real API keys / a real database for the external calls
to return real data instead of errors.

---

## 1. Prerequisites

- Python 3.11+ installed
- (Optional but recommended) Docker Desktop, if you want Postgres + Redis
  without installing them locally

Check your Python version:
```bash
python3 --version
```

---

## 2. Where to put this project

Unzip/copy the `agrisync-backend` folder anywhere on your machine, e.g.:
```
C:\Users\<you>\Projects\agrisync-backend        (Windows)
~/Projects/agrisync-backend                     (Mac/Linux)
```

Open a terminal **inside that folder** for every command below.

---

## 3. Create a virtual environment and install dependencies

```bash
python3 -m venv venv

# activate it:
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
```

If `prophet` fails to install (it sometimes needs build tools), you can
comment it out of `requirements.txt` for now — it's only used in the
optional demand-forecast comparison from the roadmap doc, not in any code
that's wired into the API yet.

---

## 4. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and, for local dev, you can leave everything as-is —
`DATABASE_URL=sqlite:///./agrisync.db` means it'll just create a local
SQLite file, no Postgres setup needed to get started.

Later, when you're ready for Postgres, change it to:
```
DATABASE_URL=postgresql://agrisync:agrisync@localhost:5432/agrisync
```
and run `docker-compose up -d db redis` (see Step 7).

---

## 5. Run the app

```bash
uvicorn app.main:app --reload
```

You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

Open **http://127.0.0.1:8000/docs** in your browser — this gives you a full
interactive Swagger UI for every endpoint, generated automatically by
FastAPI. This is the fastest way to test everything without writing a
frontend first.

---

## 6. Test the NEW method (demand-supply price + best selling window)

In the Swagger UI (`/docs`), open **POST /api/v1/predictions/best-selling-window**
→ "Try it out" → paste this body:

```json
{
  "crop_id": 1,
  "mandi_id": 1,
  "current_price": 1800,
  "current_supply_qty": 500,
  "forecast_demand_index": 1.3,
  "forecast_supply_qty": 300,
  "horizon_days": 14
}
```

→ Execute. You'll get back the best day to sell, the predicted price, the
expected % gain, a plain-English reasoning string, and the full day-by-day
price curve (useful for plotting a chart on the dashboard).

Or from the terminal:
```bash
curl -X POST http://127.0.0.1:8000/api/v1/predictions/best-selling-window \
  -H "Content-Type: application/json" \
  -d '{"crop_id":1,"mandi_id":1,"current_price":1800,"current_supply_qty":500,"forecast_demand_index":1.3,"forecast_supply_qty":300,"horizon_days":14}'
```

**Where the logic lives:** `app/services/price_demand_supply.py` — fully
commented, explains the economics (elasticity model) and the holding-penalty
math. Run it standalone anytime with:
```bash
python -m app.services.price_demand_supply
```

---

## 7. (Optional) Run with Postgres + Redis via Docker

```bash
docker-compose up --build
```
This starts the backend, Postgres, and Redis together. Backend will be at
`http://localhost:8000`, same as before.

To stop:
```bash
docker-compose down
```

---

## 8. Run the tests

```bash
pytest tests/ -v
```
You should see 3 passing tests confirming the new pricing logic behaves
correctly (price rises when demand > supply, falls when supply > demand,
and the best-selling-window always returns a date inside your horizon).

---

## 9. Training the ML models (Demand + Price, Modules 5 & 6)

These need **your own historical CSV data** — synthetic data won't give
useful predictions. Once you have a real dataset (e.g. exported from
Agmarknet or your own collected data):

```bash
# Demand model — needs columns: date, crop_id, mandi_id, arrival_qty,
# temperature, rainfall, is_festival, demand_qty
python -m app.ml.training.train_demand_model --csv path/to/demand_history.csv

# Price model — needs columns: date, crop_id, mandi_id, modal_price,
# arrival_qty, rainfall, temperature, is_festival, msp, season
python -m app.ml.training.train_price_model --csv path/to/price_history.csv
```

Trained models are saved to `app/ml/artifacts/*.pkl`. Once trained, you can
plug your model into the selling-window recommender as an ensemble — pass a
`ml_price_model_fn` into `recommend_best_selling_window()` (see the
docstring in `app/services/price_demand_supply.py` for exactly how).

---

## 10. Where each roadmap module lives in this code

| Roadmap Module | File(s) |
|---|---|
| 1. Weather | `app/external/weather_client.py`, `app/api/v1/weather.py` |
| 2. Market Price | `app/external/market_client.py`, `app/api/v1/market.py` |
| 3. Government Schemes | `app/models/models.py` (`GovScheme` table — populate manually for now) |
| 4. Recommendation Engine | `app/services/recommendation_engine.py`, `app/api/v1/recommendations.py` |
| 5. Demand Forecasting | `app/ml/training/train_demand_model.py` |
| 6. Price Prediction | `app/ml/training/train_price_model.py` |
| **NEW: Demand-Supply Price + Best Selling Window** | `app/services/price_demand_supply.py`, `app/api/v1/predictions.py` |
| 9. Database Schema | `app/models/models.py` |
| 10. API Architecture | `app/api/v1/*.py`, `app/main.py` |
| 12. Security | `app/core/security.py` |
| 13. Deployment | `Dockerfile`, `docker-compose.yml` |
| Notifications | `app/api/v1/notifications.py`, `app/workers/scheduler.py` |

---

## 11. Next steps (in order)

1. Get this running locally end-to-end (steps 1–6 above) — do this first.
2. Sign up for a free `data.gov.in` API key and plug it into `.env`
   (`DATA_GOV_IN_API_KEY`) to get real market price data flowing.
   The dashboard's **Get live government prices** action calls
   `GET /api/v1/market/live-prices`; the key stays on the backend and is
   never sent to the browser. The default catalog is the Agmarknet daily
   mandi-prices dataset. You may override its ID with
   `DATA_GOV_IN_RESOURCE_ID` if the portal changes the catalog.
3. Collect/export a real historical price+arrivals dataset for at least
   2–3 crops to train Modules 5 & 6 properly.
4. Wire `app/workers/scheduler.py`'s TODOs to actually write into your
   `market_prices` and `predictions` tables.
5. Build the React frontend against these endpoints (Swagger docs at
   `/docs` double as your API contract).
6. Once deployed, move `DATABASE_URL` to Postgres and run
   `docker-compose up`.

If anything breaks, the first things to check are: (a) is your virtual
environment activated, (b) does `.env` exist (copied from `.env.example`),
(c) run `pip install -r requirements.txt` again after pulling any code changes.
