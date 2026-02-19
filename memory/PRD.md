# Nomadly Bot - PRD

## Original Problem Statement
1. Update backend .env with provided API keys and credentials, using current pod URL for webhooks with /api prefix.
2. Fix crypto payment message for leads — was using domain template ("your Phone Leads domain will be seamlessly activated") instead of a leads-specific message.

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

## What's Been Implemented

### Feb 19, 2026 — Session 1: Env Setup
- Updated backend .env with all provided API keys
- Set SELF_URL and SELF_URL_PROD to pod URL with /api
- Installed Node.js dependencies
- Verified all services running

### Feb 19, 2026 — Session 2: Leads Crypto Message Fix
- **Bug**: Crypto payment for leads used `showDepositCryptoInfoDomain` template, producing "your Phone Leads domain will be seamlessly activated"
- **Fix**: Added `showDepositCryptoInfoLeads` template in all 5 files (config.js, en.js, fr.js, hi.js, zh.js) with correct wording: "your {label} will be delivered"
- Updated 2 call sites in _index.js (lines 5478, 5491) from `showDepositCryptoInfoDomain` → `showDepositCryptoInfoLeads`

## Status
- All services: RUNNING
- Database: CONNECTED
- Telegram webhook: CONFIGURED
- Crypto payment messages: FIXED for leads context

## Next Tasks / Backlog
- P0: None
- P1: Frontend dashboard development (if needed)
- P2: Additional feature development per user requests
