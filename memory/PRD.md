# Nomadly Bot - PRD & Progress

## Original Problem Statement
Nomadly Telegram Bot — URL shortener, domain registration, phone leads, crypto payments, cloud phone, hosting.

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express + Telegram Bot (port 5000)
- **Frontend**: React dashboard (port 3000)
- **Database**: MongoDB (Railway-hosted)

## What's Been Implemented

### Session 1: Initial Setup
- Installed deps, updated .env, configured pod URL with /api prefix

### Session 2: 6 Major Cloud Phone Changes
- Immediate Telnyx release on renewal failure, pre-expiry deletion warnings, reliable release via releaseByPhoneNumber fallback, compliance-free countries only (US/CA/GB), overage billing, promos 50% shorter, Speechcue branding

### Session 3: Overage Rates from .env + Wallet-Empty Notifications
- OVERAGE_RATE_SMS/MIN driven from .env, plan text shows overage rates, calls/SMS stop with notification when wallet empty

### Session 4: Toll-Free Setup + Username Sync (2026-02-18)
- **Toll-free +1 (855) 682-0054** bought on Telnyx, configured with SIP connection + messaging profile, assigned to @Hostbay_support (chat_id: 5168006768) as Starter plan ($5/mo, auto-renew ON, expires 2026-03-20)
- **Old toll-free +18777000068 released** from Telnyx to stop billing
- **Username updated** in DB: nameOf → Hostbay_support, chatIdOf → Hostbay_support, stale onarrival2 mapping removed
- **Username change detection** implemented: on every message, bot compares msg.from.username with stored nameOf value. If changed: updates nameOf, creates new chatIdOf mapping, deletes stale old mapping. Logs `[UsernameSync]` for auditing.

### Testing: 100% pass (11/11 iteration 24)

## Prioritized Backlog
- P0: None
- P1: Monitor overage billing in production
- P2: Per-user overage spending cap
