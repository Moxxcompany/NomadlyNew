# PRD - Telegram Bot (tg-bot-link-shorten)

## Overview
A Telegram bot application for URL shortening, domain name purchasing, phone number lead generation/validation, web hosting (cPanel/Plesk), VPS management, and crypto/bank payments.

## Architecture
- **Runtime**: Node.js v20
- **Entry point**: `js/start-bot.js` -> `js/_index.js`
- **Database**: MongoDB (local on pod, Railway as backup in MONGO_URL2)
- **Bot Framework**: `node-telegram-bot-api` (webhook mode)
- **Express Server**: Port 8001
- **Webhook URL**: `https://3a239ed0-7ef0-4b78-b8b8-9fff646dda0f.preview.emergentagent.com/api/telegram/webhook`

## What's Been Implemented
- [Jan 2026] Installed all dependencies (20+ packages)
- [Jan 2026] Created `.env` with 90+ environment variables
- [Jan 2026] Fixed startup issues:
  - Removed blocking GitHub API check on every message (was calling raw.githubusercontent.com per message)
  - Switched MONGO_URL to local MongoDB (Railway DB unreachable from Emergent pod)
  - Removed `serverApi` strict mode from MongoClient (incompatible with local MongoDB)
  - Changed Express to port 8001 (Emergent ingress routing)
  - Updated SELF_URL/SELF_URL_PROD with `/api` prefix for Emergent routing
- Bot running successfully: MongoDB connected, Express listening, Telegram webhook active

## Backlog / Next Steps
- P1: Monitor bot responsiveness with real Telegram users
- P2: Migrate data from Railway MongoDB if needed
- P2: Security audit (npm vulnerabilities)
