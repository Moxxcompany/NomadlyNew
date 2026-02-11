# PRD - Nomadly Telegram Bot (tg-bot-link-shorten)

## Original Problem Statement
Setup and install needed dependencies after analyzing codebase. Ensure SELF_URL uses Emergent pod URL and webhooks are working.

## Architecture
- **Runtime**: Node.js v20 (Express on port 5000)
- **Proxy**: FastAPI reverse proxy on port 8001 → Node.js port 5000
- **Entry Point**: `js/start-bot.js` → `js/_index.js`
- **Database**: MongoDB (external Railway instance)
- **Bot Framework**: `node-telegram-bot-api` (webhook mode)
- **Webhook URL**: `https://08cb8415-a230-42f2-b61f-a0a112370a97.preview.emergentagent.com/api/telegram/webhook`
- **Pod Routing**: `/api/*` → port 8001 (FastAPI proxy) → port 5000 (Node.js Express)

## What's Been Implemented (Jan 2026)
- [x] Analyzed full codebase (41 JS files, 4 language packs, hosting module)
- [x] Installed all npm dependencies (438 packages) + missing `validator` package
- [x] Created `.env` with all user-provided credentials
- [x] Set `SELF_URL` to Emergent pod URL (`/api` prefix for ingress routing)
- [x] Created FastAPI reverse proxy (`/app/backend/server.py`) to bridge Emergent's port 8001 → Node.js port 5000
- [x] Telegram webhook registered and verified via Telegram API
- [x] Bot is live and processing messages (confirmed `/start` command working)
- [x] MongoDB connected to external Railway instance
- [x] AutoPromo system initialized (12 scheduled jobs)

## Key Configuration
- SELF_URL: `https://pod-url/api` (Emergent ingress strips `/api`, forwards to port 8001)
- Bot Token: Production token active
- MongoDB: External Railway MongoDB
- Bot logs: `/var/log/supervisor/node-bot.log`

## Backlog / Next Steps
- P1: Whitelist pod IP `34.16.56.64` in Connect Reseller API dashboard
- P2: Address npm audit vulnerabilities (23 total)
- P2: AWS credentials not yet configured (phone validation via AWS Pinpoint)
