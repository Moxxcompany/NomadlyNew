# Nomadly Bot - PRD

## Original Problem Statement
Update backend .env with provided API keys and credentials, using current pod URL for webhooks with /api prefix.

## Architecture
- **Backend**: FastAPI (server.py) acts as reverse proxy to Node.js Express app
- **Node.js**: Telegram Bot (Nomadly) with Express server on port 5000
- **Frontend**: React app (basic shell)
- **Database**: MongoDB (Railway-hosted)
- **Integrations**: Telegram Bot, Telnyx (Cloud Phone), BlockBee (Crypto), DynoPay, Fincra, Connect Reseller (Domains), Cloudflare, Brevo (Email), OpenAI

## Core Features
- URL Shortening (Bitly, Cuttly, custom domains)
- Domain Registration & DNS Management
- Phone Number Leads (targeted + validation)
- Cloud Phone (Telnyx - SIP, SMS, Voice, IVR, Voicemail)
- VPS Hosting
- Wallet system (USD/NGN, crypto payments)
- Subscription plans (Daily/Weekly/Monthly)
- Multi-language support (EN, FR, HI, ZH)

## What's Been Implemented (Feb 19, 2026)
- Updated backend .env with all provided API keys
- Set SELF_URL and SELF_URL_PROD to pod URL with /api: `https://quickstart-setup-1.preview.emergentagent.com/api`
- Updated API_ALCAZAR, API_KEY_RAILWAY, RAILWAY_ENVIRONMENT_ID, RAILWAY_SERVICE_ID, TELNYX_MESSAGING_PROFILE_ID
- Set PHONE_STARTER_ON, PHONE_PRO_ON, PHONE_BUSINESS_ON to empty (as specified)
- Installed Node.js dependencies (npm install)
- Verified all services running: FastAPI proxy, Node.js bot, MongoDB connected
- Telegram webhook set to pod URL
- Telnyx webhooks (voice, SMS) set to pod URL
- All services healthy (confirmed via /api/health)

## Status
- All services: RUNNING
- Database: CONNECTED
- Telegram webhook: CONFIGURED
- Telnyx webhooks: CONFIGURED
- Connect Reseller API: WORKING

## Next Tasks / Backlog
- P0: None - setup complete
- P1: Frontend dashboard development (if needed)
- P2: Additional feature development per user requests
