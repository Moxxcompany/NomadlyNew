# Nomadly Bot - PRD & Progress

## Original Problem Statement
Nomadly Telegram Bot — URL shortener, domain registration, phone leads, crypto payments, cloud phone, hosting. Hosted on Emergent pod with FastAPI proxy + Node.js bot + React dashboard.

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express + Telegram Bot (port 5000)
- **Frontend**: React dashboard (port 3000)
- **Database**: MongoDB (Railway-hosted)
- **Bot**: Telegram webhook at `{SELF_URL}/telegram/webhook`

## What's Been Implemented

### Session 1 (2026-02-18): Initial Setup
- Installed Node.js dependencies, updated .env with 90+ variables
- Configured SELF_URL to use pod URL with /api prefix

### Session 2 (2026-02-18): 6 Major Changes
1. Immediate Telnyx release on renewal failure (no 7-day grace)
2. Pre-expiry notifications warn about permanent deletion
3. Reliable release via releaseByPhoneNumber fallback
4. Compliance-free numbers only (US, CA, GB)
5. Overage billing ($0.02/SMS, $0.03/min from wallet)
6. Promo messages 50% shorter
- Speechcue branding on Cloud Phone button

### Session 3 (2026-02-18): Overage Rates + Wallet-Empty Notifications
- **OVERAGE_RATE_SMS and OVERAGE_RATE_MIN now driven from .env** (configurable)
- **Plan selection text** shows overage rates and "Service pauses if wallet balance is insufficient"
- **Order summary** includes overage rate line
- **Hub welcome** mentions overage billing and wallet pause behavior
- **Manage number view** shows dynamic overage rates when limits exceeded
- **Calls blocked with notification** when minutes exhausted + wallet empty (user gets Telegram alert with rate info)
- **Mid-call disconnect with notification** when wallet runs out during overage call
- **SMS dropped with notification** when SMS limit exhausted + wallet empty
- **Usage alerts & limit messages** all reference dynamic .env rates and wallet pause behavior

### Testing: 100% pass rate (18/18 tests, iteration 23)

## Prioritized Backlog
- P0: None
- P1: Monitor overage billing accuracy in production
- P2: Add overage spending cap per user
- P2: Add overage charge summary in usage/billing view
