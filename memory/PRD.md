# Nomadly Bot - PRD

## Original Problem Statement
User requested setup and analysis of the existing Nomadly Telegram Bot codebase, with environment variable configuration and webhook URL update.

## Architecture
- **FastAPI Proxy** (server.py on port 8001) → spawns and proxies to **Node.js Express** app (port 5000)
- **Node.js Telegram Bot** using `node-telegram-bot-api` with webhook mode
- **MongoDB** hosted on Railway (`caboose.proxy.rlwy.net:59668`)
- **React Frontend** (port 3000) — minimal, mainly a landing/status page

## Core Features
- URL Shortening (Bit.ly, Cuttly, custom domain shortener)
- Domain Registration (Connect Reseller, Cloudflare DNS, OpenProvider)
- Phone Number Leads (targeted leads, validation, bulk)
- Cloud Phone (Telnyx: SIP, SMS, Voice, IVR, Voicemail, Call Recording)
- Subscription Plans (Daily/Weekly/Monthly)
- Payments (Crypto via BlockBee/DynoPay, Bank via Fincra, Wallet)
- Hosting (cPanel/Plesk, VPS via Nameword)
- Multi-language support (EN, FR, ZH, HI)
- Auto-promo & daily coupon system
- Admin tools (broadcast, analytics, user management)

## What's Been Implemented (2026-02-19)
- Updated backend `.env` with all user-provided API keys and credentials
- Set SELF_URL and SELF_URL_PROD to current pod URL with `/api` prefix
- Copied .env to project root for Node.js dotenv compatibility
- Installed Node.js dependencies (npm install)
- Verified all services running:
  - FastAPI proxy: OK
  - Node.js bot: OK
  - MongoDB: Connected
  - Telegram webhook: Set to `https://setup-assistant-11.preview.emergentagent.com/api/telegram/webhook`
  - Telnyx resources: Initialized (SIP, Messaging, Call Control)
  - AutoPromo & DailyCoupon: Active
  - Connect Reseller API: Working

## Key Environment Variables Updated
- API_ALCAZAR, API_KEY_RAILWAY, RAILWAY_ENVIRONMENT_ID, RAILWAY_SERVICE_ID
- TELNYX_MESSAGING_PROFILE_ID, OVERAGE_RATE_MIN
- All other user-provided keys preserved

## Webhook URL
`https://setup-assistant-11.preview.emergentagent.com/api/telegram/webhook`

## Next Tasks / Backlog
- P0: Monitor bot stability and webhook delivery
- P1: Frontend dashboard improvements (if needed)
- P2: Additional feature requests from user
