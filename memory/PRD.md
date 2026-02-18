# Nomadly Bot - PRD & Status

## Original Problem Statement
User requested environment setup: update backend `.env` with all provided API keys/credentials and ensure all webhooks (Telegram, Telnyx) use the current pod URL.

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express app (port 5000)
- **Bot**: Telegram bot (node-telegram-bot-api) with webhook mode
- **Database**: MongoDB (Railway-hosted)
- **Integrations**: Telegram, Telnyx (Cloud Phone), Fincra (payments), BlockBee (crypto), DynoPay, Connect Reseller (domains), Cloudflare, Brevo (email), Twilio, SignalWire, OpenAI

## What's Been Implemented (2026-02-18)
- Updated backend/.env with all user-provided API keys and credentials
- Set SELF_URL and SELF_URL_PROD to current pod URL for webhook routing
- All webhooks confirmed working:
  - Telegram webhook set & verified
  - Telnyx voice/SMS webhooks updated
  - Telnyx Messaging Profile & Call Control App webhooks updated
- All services running: FastAPI proxy, Node.js bot, MongoDB, Telegram, Telnyx, AutoPromo, DailyCoupon

## Core Features (existing)
- URL shortening (Bitly, Cuttly, custom domains)
- Domain registration & DNS management
- Phone number leads (targeted & validation)
- Subscription plans (Daily/Weekly/Monthly)
- Wallet system (USD/NGN, crypto deposits)
- Offshore hosting (cPanel/Plesk)
- Cloud Phone (Telnyx-powered)
- VPS management
- Multi-language support
- Auto-promo & daily coupon systems

## Backlog
- P0: None (setup complete)
- P1: Monitor bot stability with new tokens
- P2: Review and optimize webhook error handling
