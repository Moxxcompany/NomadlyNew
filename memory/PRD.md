# Nomadly Bot - PRD & Architecture

## Problem Statement
1. Set up Nomadly Telegram bot on Emergent platform with correct env vars and webhook URLs
2. Complete greeting templates library for financial institutions (fraud, support, etc.) with modification and translation support
3. Integrate crypto payment for Cloud Phone service (was wallet-only for crypto callbacks)
4. Fix other gaps (missing bank-pay-phone handler)

## Architecture
- **Python FastAPI** (port 8001): Proxy layer that starts Node.js bot and forwards all `/api/*` requests
- **Node.js Express** (port 5000): Main business logic — Telegram bot, URL shortener, domain registration, phone leads, hosting, VPS, cloud phone
- **React Frontend** (port 3000): Web UI
- **MongoDB**: Remote Railway-hosted MongoDB

## Webhook Flow
1. External requests → `https://getting-started-64.preview.emergentagent.com/api/*`
2. Kubernetes ingress → FastAPI on port 8001
3. FastAPI strips `/api` prefix → forwards to Node.js on port 5000
4. Node.js Express handles the request

## What's Been Implemented

### Session 1 (2026-02-19) — Setup
- Updated `/app/backend/.env` with all API keys, set SELF_URL to pod URL + `/api`
- Installed Node.js dependencies, verified all services running

### Session 2 (2026-02-19) — Templates + Crypto Payment
**Greeting Templates Library (Complete)**
- Expanded from 1 category (Financial) to 3 categories: Financial Services (8 templates), Customer Support (4 templates), Voicemail Greetings (6 templates) — 18 total
- Added `📋 Use Template` button to both IVR greeting AND VM greeting menus
- Added `cpVmTemplate` + `cpVmTemplateEdit` handlers for voicemail template flow
- Added automatic translation for VM greeting voice (was missing — IVR had it)
- Flow: Tap template → edit if wanted → pick language → auto-translate → pick voice → preview → save

**Crypto Payment for Cloud Phone (Complete)**
- Added `app.get('/crypto-pay-phone')` — BlockBee callback that processes phone purchase after crypto confirmation
- Added `app.post('/dynopay/crypto-pay-phone')` — DynoPay callback for the same
- Fixed `crypto-pay-phone` action to support BOTH BlockBee and DynoPay paths (was BlockBee-only)
- Added `payPhone` to `dynopayActions` config
- Added `/bank-pay-phone` to `bankApis` — was completely missing (bank payment endpoint stored but never handled)
- All 3 callbacks (crypto BlockBee, crypto DynoPay, bank) now process the full order: buy number → generate SIP credentials → save to DB → notify admin

## Core Features
- Telegram bot (URL shortening, domain registration, phone leads, wallet, subscriptions)
- Cloud Phone (Telnyx: SIP, SMS, Voice, IVR, Voicemail with templates)
- Domain management (Connect Reseller, Cloudflare, OpenProvider)
- Payment processing (Fincra bank, BlockBee crypto, DynoPay crypto, Wallet)
- VPS/Hosting management
- Auto-promo & daily coupons system
- Multi-language support (EN, FR, HI, ZH + 20 TTS languages)

## Backlog
- P1: Frontend UI development
- P2: Add more template categories (Healthcare, Legal, Real Estate)
- P2: Template sharing/favorites system
