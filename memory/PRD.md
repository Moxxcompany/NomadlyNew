# NomadlyBot - Product Requirements Document

## Original Problem Statement
User requested: "analyze and setup" the existing codebase

## Architecture
- **Node.js Backend** (`/app/js/`) - Telegram bot with Express server on port 5000
  - URL shortening (Bitly, Cuttly, custom domains)
  - Domain name sales (Connect Reseller API)
  - Phone number leads (SMS/Voice validation)
  - Crypto payments (BlockBee, DynoPay)
  - Bank payments (Fincra)
  - Web hosting (cPanel/Plesk plans)
  - VPS management
  - Wallet system (USD/NGN)
- **FastAPI Python Backend** (`/app/backend/server.py`) - Reverse proxy on port 8001 → Node.js (5000)
- **React Frontend** (`/app/frontend/`) - Admin dashboard on port 3000
- **MongoDB** - Data storage (Railway-hosted)

## Tech Stack
- Node.js (Express, node-telegram-bot-api, mongodb driver)
- Python (FastAPI, httpx, uvicorn)
- React 18 (CRA with Craco, Tailwind CSS)
- MongoDB

## What's Been Implemented
- [Jan 2026] Initial setup and analysis completed
  - Installed Node.js dependencies (`npm install`)
  - Installed frontend dependencies (`yarn install`)
  - Started all services (backend, frontend, MongoDB)
  - Verified health endpoint returns: Bot Running, DB Connected, REST APIs Active
  - Frontend admin dashboard loading correctly

## Current Status
- Backend (FastAPI proxy): RUNNING
- Frontend (React): RUNNING
- Node.js bot: Started but paused (missing TELEGRAM_BOT_TOKEN env var)
- MongoDB: RUNNING and connected
- Health check: All systems showing online

## Missing Environment Variables (for full bot functionality)
- `TELEGRAM_BOT_TOKEN` - Required for Telegram bot to work
- `TELEGRAM_BOT_ON` - Must be set to 'true' to enable bot
- Various optional API keys (Connect Reseller, BlockBee, Fincra, DynoPay)

## Backlog
- P0: Set TELEGRAM_BOT_TOKEN to enable the Telegram bot
- P1: Configure webhook URL (SELF_URL) for production
- P2: Configure payment integrations (BlockBee, Fincra, DynoPay)
- P2: Configure Connect Reseller API for domain management
