# Nomadly Bot - PRD

## Problem Statement
Set up the Nomadly Telegram Bot application with updated environment variables and webhook configuration using the current pod URL with `/api` prefix.

## Architecture
- **Node.js Express app** (`js/_index.js`) — core Telegram bot + REST APIs on port 5000
- **FastAPI proxy** (`backend/server.py`) — starts Node.js, proxies all requests on port 8001
- **React frontend** — minimal, served on port 3000
- **MongoDB** — external Railway MongoDB (`caboose.proxy.rlwy.net:59668`)
- **Kubernetes ingress** — routes `/api/*` to backend:8001, everything else to frontend:3000

## Key Services & Integrations
- Telegram Bot API (webhook mode)
- Telnyx (Cloud Phone: SIP, SMS, Voice/IVR, Call Recording)
- Connect Reseller (domain registration)
- Cloudflare (DNS management)
- OpenProvider (domain registrar)
- Fincra (NGN bank payments)
- BlockBee / DynoPay (crypto payments)
- Brevo (email/SMTP)
- Bitly / Cuttly (URL shortening)
- Twilio / SignalWire (phone validation)
- EdenAI (AI services)
- OpenAI (AI features)

## What's Been Implemented (2026-02-19)
- Updated `/app/backend/.env` with all user-provided API keys and credentials
- Set `SELF_URL` and `SELF_URL_PROD` to `https://setup-wizard-102.preview.emergentagent.com/api` (pod URL + /api)
- Updated `API_ALCAZAR`, `API_KEY_RAILWAY`, `RAILWAY_ENVIRONMENT_ID`, `RAILWAY_SERVICE_ID`, `TELNYX_MESSAGING_PROFILE_ID` with real values (were placeholder `setup-wizard-102`)
- Installed Node.js dependencies (`npm install`)
- Verified all services running: FastAPI proxy, Node.js bot, MongoDB connected
- Telegram webhook set and verified at correct URL
- Telnyx resources initialized (SIP, Messaging, Call Control)
- All scheduled jobs running (AutoPromo, DailyCoupon, PhoneScheduler, StateCleanup)

## User Personas
- Telegram bot users (link shortening, domain purchase, phone leads, hosting)
- Admin users (analytics, user management, broadcasts)

## Backlog
- P0: None — all services operational
- P1: Monitor webhook reliability, consider adding retry logic
- P2: Frontend dashboard for admin analytics
