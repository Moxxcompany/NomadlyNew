# NomadlyBot - Product Requirements Document

## Original Problem Statement
User requested: "analyze and setup" then "update .env and ensure webhook is working"

## Architecture
- **Node.js Backend** (`/app/js/`) - Telegram bot with Express server on port 5000
- **FastAPI Python Backend** (`/app/backend/server.py`) - Reverse proxy on port 8001 → Node.js (5000), strips `/api` prefix
- **React Frontend** (`/app/frontend/`) - Admin dashboard on port 3000
- **MongoDB** - Data storage (Railway-hosted)

## Key Routing
- Kubernetes ingress routes `/api/*` → FastAPI (port 8001)
- FastAPI strips `/api` prefix and proxies to Node.js Express (port 5000)
- Webhook URL: `https://onboarding-hub-25.preview.emergentagent.com/api/telegram/webhook`
- SELF_URL set to `https://onboarding-hub-25.preview.emergentagent.com/api`

## What's Been Implemented
- [Jan 2026] Initial setup: installed deps, started services
- [Jan 2026] Full .env configuration with all API keys and credentials
  - Updated SELF_URL/SELF_URL_PROD to current pod URL with /api suffix
  - Updated FastAPI proxy to strip /api prefix before forwarding to Node.js
  - Telegram webhook set and verified: URL matches, pending_update_count=0
  - Bot token configured: YES, Environment: PRODUCTION
  - MongoDB connected, bot running, REST APIs active

## Current Status
- Backend (FastAPI proxy): RUNNING
- Frontend (React): RUNNING
- Node.js bot: RUNNING with webhook active
- MongoDB: RUNNING and connected
- Telegram Webhook: VERIFIED at `https://onboarding-hub-25.preview.emergentagent.com/api/telegram/webhook`
- Connect Reseller: IP needs whitelisting (35.184.53.215)

## Note
- Connect Reseller API requires IP whitelist: add `35.184.53.215` at https://global.connectreseller.com/tools/profile

## Backlog
- P1: Whitelist pod IP in Connect Reseller for domain management
- P2: Monitor webhook reliability in production
