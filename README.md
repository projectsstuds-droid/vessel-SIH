# AI-Powered Vessel Chartering & Freight Forecasting Platform

An intelligent maritime decision-support system built for cargo chartering and bulk procurement.

## Architecture

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts (Command Center Dashboard).
*   **Backend**: Node.js, Express, TypeScript, Prisma, SQLite (For local dev, easily swappable to PostgreSQL).
*   **ML Service**: Python, FastAPI, Statsmodels, Scikit-learn (Freight rate forecasting).

## Project Structure

```
/frontend    - React Dashboard application
/backend     - Node.js API server & SQLite database (demo data included)
/ml          - Python FastAPI service for statistical forecasting
```

## Prerequisites
*   Node.js v18+
*   Python 3.10+
*   npm or yarn

## Setup Instructions

### 1. Setup Backend & Seed Database
```bash
cd backend
npm install
npx prisma db push
npm run seed
npm run dev
```
*(Note: If `npx prisma db push` fails, ensure you ran `npm install` successfully first).*

### 2. Setup ML Service (Forecasting)
```bash
cd ml
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features Implemented
*   ✅ **Dashboard**: KPI metrics, Market trends, AI Recommendation Panel.
*   ✅ **Freight Forecasting Engine**: Statistical Holt-Winters Exponential Smoothing model bridging Python and Node.js.
*   ✅ **Port Compatibility Engine**: Deterministic rules rejecting vessels based on draft, LOA, and beam vs port constraints.
*   ✅ **Synthetic Data Generator**: The `backend/scripts/seed.ts` generates realistic ports, vessels, and 2 years of weekly historical freight data with seasonal patterns.
*   ✅ **Modular Architecture**: Complete separation of ML concerns from standard business logic, ready for production.

## Environment Variables
Example `.env` templates have been placed in `/backend`.
* `DATABASE_URL` (Set to SQLite `file:./dev.db` for demo purposes)
* `ML_SERVICE_URL` (Defaults to `http://localhost:8000`)
* `JWT_SECRET` (For authentication - placeholder included)

## Switching to PostgreSQL
The project is currently configured to use SQLite for frictionless local testing. To switch to PostgreSQL:
1. Open `backend/prisma/schema.prisma`
2. Change `provider = "sqlite"` to `provider = "postgresql"`
3. Change `url = "file:./dev.db"` to `url = env("DATABASE_URL")`
4. Update `.env` with your Postgres credentials.
5. Run `npx prisma generate` and `npx prisma db push`.
