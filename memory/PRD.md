# PRD - Telegram Bot (tg-bot-link-shorten)

## Overview
A Telegram bot for URL shortening, domain purchasing, phone lead gen/validation, web hosting, VPS management, and crypto/bank payments.

## Architecture
- **Runtime**: Node.js v20
- **Entry**: `js/start-bot.js` -> `js/_index.js`
- **Database**: MongoDB local (Railway URL preserved in MONGO_URL_RAILWAY)
- **Bot**: `node-telegram-bot-api` (webhook mode)
- **Express**: Port 8001 with `/api` prefix stripping middleware
- **Webhook**: `https://...emergentagent.com/api/telegram/webhook`

## Fixes Applied
- [Jan 2026] Added `/api` prefix stripping middleware in Express (Emergent ingress passes `/api/*` without stripping)
- [Jan 2026] Webhook URL set to `SELF_URL/api/telegram/webhook` for correct Emergent routing
- [Jan 2026] Removed blocking `raw.githubusercontent.com` check on every message
- [Jan 2026] Switched to local MongoDB (Railway DB unreachable from pod)
- [Jan 2026] Removed `serverApi` strict mode from MongoClient (local MongoDB incompatible)

## Bot Status: RUNNING
- MongoDB: Connected
- Express: Listening on port 8001
- Telegram webhook: Active, receiving and processing /start messages
- All routes accessible via `/api/*` prefix

## Backlog
- P1: Data migration from Railway MongoDB if needed
- P2: npm security audit
