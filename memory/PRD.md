# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
User requested: "setup" - analyze code, set up the existing codebase, configure environment variables and Telegram webhook.

## Application Overview
**NomadlyBot** is a Telegram bot platform for URL shortening, domain registration, phone lead generation, crypto payments, and web hosting management.

## Architecture
- **Frontend**: React 18 dashboard (port 3000) - Admin panel showing bot status, DB connectivity, and feature overview
- **Backend**: FastAPI (port 8001) - Acts as a reverse proxy, spawning a Node.js process and forwarding all requests
- **Node.js Bot Engine**: Express server (port 5000) - Core Telegram bot with full business logic
- **Database**: MongoDB (Railway-hosted) - Stores user state, wallets, domains, leads, payments, etc.
- **Webhook**: Telegram webhook at `https://onboard-flow-58.preview.emergentagent.com/api/telegram/webhook`

## Tech Stack
- React 18 + Tailwind CSS + Craco (frontend)
- FastAPI + Python (backend proxy)
- Node.js + Express + node-telegram-bot-api (bot engine)
- MongoDB (database)
- Various integrations: BlockBee (crypto), Fincra (bank payments), Connect Reseller (domains), Twilio, OpenAI, DynoPay

## Key Environment Notes
- Kubernetes ingress routes `/api/*` to backend (port 8001), all other routes to frontend (port 3000)
- Express middleware strips `/api/` prefix for internal routing
- `SELF_URL` must include `/api` suffix for proper webhook routing: `https://onboard-flow-58.preview.emergentagent.com/api`
- Node.js dependencies installed via `npm install` at `/app`

## What's Been Implemented
### Setup Phase (Jan 2026)
- Installed Node.js dependencies (`npm install`)
- Created root `.env` with MONGO_URL, DB_NAME, and basic config (TELEGRAM_BOT_ON=false initially)

### Env + Webhook Configuration (Jan 2026)
- Updated root `.env` with full production credentials (90+ environment variables)
- Set `SELF_URL` and `SELF_URL_PROD` to `https://onboard-flow-58.preview.emergentagent.com/api`
- Enabled Telegram bot (`TELEGRAM_BOT_ON=true`) with production bot token
- Webhook verified by Telegram API: URL correct, pending_update_count: 0

## Current Status
- All services: RUNNING
- Database: CONNECTED
- Telegram Bot: ENABLED (webhook active, verified)
- Express REST API: ACTIVE
- Webhook URL: `https://onboard-flow-58.preview.emergentagent.com/api/telegram/webhook`
- Connect Reseller: ⚠️ IP needs whitelisting (104.198.214.223)

## Next Action Items
- P0: Whitelist IP 104.198.214.223 in Connect Reseller API for domain operations
- P1: Test end-to-end bot flow via Telegram
- P2: Enhanced admin dashboard with real-time analytics
- P3: Add user management UI to frontend
