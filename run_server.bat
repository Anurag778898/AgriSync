@echo off
REM ------------------------------------------------------------
REM One‑click script to run the AgriSync FastAPI backend locally
REM ------------------------------------------------------------

REM Change to the backend directory (ensure script works even if launched elsewhere)
cd /d "%~dp0"

REM Activate the Python virtual environment
if exist "venv\Scripts\activate.bat" (
    call "venv\Scripts\activate.bat"
) else (
    echo WARNING: Virtual environment not found. Creating one now…
    python -m venv venv
    call "venv\Scripts\activate.bat"
)

REM Install / upgrade required packages (quiet install)
if exist "requirements.txt" (
    pip install -r requirements.txt --quiet
) else (
    echo WARNING: requirements.txt not found.
)

REM Launch the FastAPI development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

pause
