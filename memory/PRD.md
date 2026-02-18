# Nomadly Bot - PRD & Progress

## Original Problem Statement
Nomadly Telegram Bot — URL shortener, domain registration, phone leads, crypto payments, cloud phone, hosting. Hosted on Emergent pod with FastAPI proxy + Node.js bot + React dashboard.

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express + Telegram Bot (port 5000)
- **Frontend**: React dashboard (port 3000) showing bot health/status
- **Database**: MongoDB (Railway-hosted)
- **Bot**: Telegram Bot using webhook mode at `{SELF_URL}/telegram/webhook`

## What's Been Implemented

### Session 1 (2026-02-18): Initial Setup
- Installed Node.js dependencies, updated .env with 90+ variables
- Configured SELF_URL to use pod URL with /api prefix
- All services running, 98% test pass

### Session 2 (2026-02-18): 6 Major Changes
1. **Immediate Telnyx release on renewal failure** — Removed 7-day grace period. When auto-renew fails or plan expires without auto-renew, number is immediately released from Telnyx to stop billing. `releaseFromProvider()` function with order ID + phone number string fallback.
2. **Pre-expiry notifications warn about permanent deletion** — 3-day and 1-day reminders now explicitly state number will be "permanently deleted and cannot be recovered". Final warning emphasizes irreversibility.
3. **Reliable release on user action** — Manual "Release Number" now calls `releaseByPhoneNumber()` as fallback if order ID fails. New Telnyx API function looks up phone number resource by string and deletes it.
4. **Compliance-free numbers only** — Countries restricted to US, CA, GB (removed AU, DE, FR, NL, SE, ES, IT, BR, MX, IL, PL, CZ, AT). Removed "More Countries" button entirely.
5. **Overage billing (pay-per-use)** — When SMS/minutes plan limit is exhausted, wallet balance is checked. If sufficient, traffic continues with per-use charges ($0.02/SMS, $0.03/min). Users notified of overage charges. If wallet empty, traffic blocked as before.
6. **Promo messages 50% shorter** — All 60 static messages (4 languages × 3 themes × 5 variations) cut from ~500-650 chars to ~200-225 chars. AI prompt max reduced to 300 chars / 250 tokens.
- **Speechcue branding** — Cloud Phone button now shows "Cloud Phone — Speechcue". No user-facing "Telnyx" text.

### Testing: 97-100% pass rate (24/24 core features verified)

## Prioritized Backlog
- P0: None
- P1: Monitor overage billing in production (wallet charge accuracy)
- P2: Add overage billing summary in My Numbers view
- P2: Consider adding per-call/per-SMS overage notifications toggle

## Next Tasks
- Test the Telegram bot end-to-end with real phone number purchases
- Monitor Telnyx webhook delivery and overage charge accuracy
- Consider adding usage analytics dashboard to frontend
