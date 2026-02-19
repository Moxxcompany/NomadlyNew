# Nomadly Bot - PRD & Architecture

## Problem Statement
Set up the Nomadly Telegram bot codebase on the Emergent platform, configure environment variables and webhook URLs to use the current pod URL with `/api` prefix.

## Architecture
- **Python FastAPI** (port 8001): Proxy layer that starts Node.js bot and forwards all `/api/*` requests
- **Node.js Express** (port 5000): Main business logic - Telegram bot, URL shortener, domain registration, phone leads, hosting, VPS, cloud phone
- **React Frontend** (port 3000): Web UI
- **MongoDB**: Remote Railway-hosted MongoDB for data storage

## Webhook Flow
1. External requests → `https://getting-started-64.preview.emergentagent.com/api/*`
2. Kubernetes ingress → FastAPI on port 8001
3. FastAPI strips `/api` prefix → forwards to Node.js on port 5000
4. Node.js Express handles the request

## Key Webhooks Configured
- Telegram: `https://getting-started-64.preview.emergentagent.com/api/telegram/webhook`
- Telnyx Voice: `https://getting-started-64.preview.emergentagent.com/api/telnyx/voice-webhook`
- Telnyx SMS: `https://getting-started-64.preview.emergentagent.com/api/telnyx/sms-webhook`

## What's Been Implemented (2026-02-19)
- Updated `/app/backend/.env` with all provided API keys and credentials
- Set `SELF_URL` and `SELF_URL_PROD` to pod URL + `/api`
- Installed Node.js dependencies (`npm install`)
- Restarted backend service
- Verified: MongoDB connected, Telegram webhook set & verified, Telnyx resources initialized, all services running

## Core Features (existing)
- Telegram bot (URL shortening, domain registration, phone leads, wallet, subscriptions)
- Cloud Phone (Telnyx: SIP, SMS, Voice, IVR, Voicemail)
- Domain management (Connect Reseller, Cloudflare, OpenProvider)
- Payment processing (Fincra bank, BlockBee/DynoPay crypto)
- VPS/Hosting management
- Auto-promo & daily coupons system
- Multi-language support (EN, FR, HI, ZH)

## Backlog
- P0: Connect Reseller IP whitelist (35.225.230.28 needs to be added)
- P1: Frontend UI development (currently minimal)
- P2: Production deployment optimization
