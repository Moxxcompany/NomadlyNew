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

### Session 4: Toll-Free Setup + Username Sync
- Toll-free +1 (855) 682-0054 for @Hostbay_support, old toll-free released
- Username change detection on every message

### Session 5: Domain Shortener + SMS UX + Activate Later (2026-02-18)
1. **Domain shortener question improved** — Now clearly explains: Yes = DNS auto-configured for URL shortener (yourdomain.com/abc), No = register only, can activate later from Manage Domains
2. **Activate for URL Shortener (later)** — New button in DNS Management (choose-dns-action). Runs same linking process as answering "Yes" during purchase: links to Railway/Render, adds DNS record, monitors propagation, notifies user when ready
3. **SMS Settings locked features visible** — Starter plan users now see 🔒 SMS to Email (Pro+) and 🔒 Webhook URL (Pro+) buttons instead of nothing. Tapping them shows upgrade message explaining which plan is required. Email forwarding (Brevo) and webhook forwarding are functional for Pro+ plans.

### Testing: 100% pass (13/13 iteration 25)

## Prioritized Backlog
- P0: None
- P1: Monitor overage billing in production
- P2: Per-user overage spending cap
- P2: Add "Activate Shortener" confirmation dialog before processing
