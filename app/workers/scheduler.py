"""
Scheduled jobs — nightly batch ingestion + prediction refresh.
Run this as a separate process:
    python -m app.workers.scheduler

For production, prefer Celery beat over APScheduler once you have multiple
worker instances; APScheduler is fine for a single-process MVP.
"""
import asyncio
from apscheduler.schedulers.blocking import BlockingScheduler
from app.external.market_client import fetch_market_prices

scheduler = BlockingScheduler(timezone="Asia/Kolkata")


def ingest_market_prices_job():
    print("[job] Ingesting market prices from data.gov.in ...")
    records = asyncio.run(fetch_market_prices())
    print(f"[job] Fetched {len(records)} records — write your DB upsert logic here")
    # TODO: parse `records`, normalize crop/mandi names, upsert into market_prices table


def refresh_predictions_job():
    print("[job] Refreshing demand/price predictions ...")
    # TODO: loop over crops x mandis, call app.ml.inference.predict, write to `predictions` table


if __name__ == "__main__":
    scheduler.add_job(ingest_market_prices_job, "cron", hour=2, minute=0)   # 2 AM daily
    scheduler.add_job(refresh_predictions_job, "cron", hour=3, minute=0)    # 3 AM daily
    print("Scheduler started. Waiting for jobs...")
    scheduler.start()
