# Nomadly Bot - PRD

## Original Problem Statement
Telegram bot (Nomadly) setup, environment configuration, call forwarding fix, forwarding billing, premium prefix blocking, and support routing.

## Architecture
- **FastAPI Proxy** (server.py on port 8001) → spawns Node.js Express app (port 5000)
- **Node.js Telegram Bot** with webhook mode
- **MongoDB** on Railway
- **Telnyx** for Cloud Phone (SIP, SMS, Voice, IVR, Voicemail, Call Recording)

## What's Been Implemented

### Session 1 — Setup (2026-02-19)
- Updated backend `.env` with all API keys
- Set SELF_URL/SELF_URL_PROD to pod webhook URL with `/api` prefix

### Session 2 — Call Forwarding Fix (2026-02-19)
- Fixed Telnyx outbound voice profile whitelist (US/CA only → 250 countries)
- Fixed `to is not defined` error in `handleCallAnswered`
- Added `ensureProfileWhitelist()` auto-check on startup

### Session 3 — Forwarding Billing + Premium Blocking + Support Routing (2026-02-19)

**Call Forwarding Billing:**
- Added `CALL_FORWARDING_RATE_MIN=0.50` to `.env` (admin-configurable)
- Forwarded calls billed at $0.50/min from wallet (separate from plan minutes)
- Non-forwarded inbound calls still use plan minutes + `OVERAGE_RATE_MIN` overage
- Mid-call billing: wallet checked every 60s during forwarded calls
- Pre-call wallet check: forwarding blocked if wallet < $0.50
- Hangup billing: total forwarding charge calculated and logged

**Premium Prefix Blocking:**
- Blocked 20+ premium-rate prefix groups (satellite, premium rate, high-cost prefixes)
- User sees "Forwarding Blocked" message + directed to 💬 Get Support
- Prefixes include Inmarsat/Iridium satellite, premium Portuguese, Cuban, Tunisian, Russian prefixes

**Forwarding Validation (Dry-Run):**
- Added `validateForwardingDestination()` in telnyx-service.js
- Uses Telnyx Number Lookup API to validate destination before saving
- Blocks invalid/unreachable numbers with clear error message

**Support Routing Overhaul:**
- Replaced ALL `${SUPPORT_USERNAME}` and `${SUPPORT_HANDLE}` references (resolving to @onarrival1)
- Updated across all 4 language files: en.js, fr.js, hi.js, zh.js
- All support messages now route to 💬 Get Support (live chat system)
- Updated Cloud Phone service descriptions to show forwarding rates

## Files Modified
- `/app/backend/.env` + `/app/.env` — Added `CALL_FORWARDING_RATE_MIN=0.50`
- `/app/js/phone-config.js` — Forwarding rate, premium prefix blocking, updated texts
- `/app/js/telnyx-service.js` — `validateForwardingDestination()`, `ensureProfileWhitelist()`
- `/app/js/voice-service.js` — Forwarding billing, mid-call wallet checks, rate-based charging
- `/app/js/_index.js` — Premium prefix check + validation on forwarding setup
- `/app/js/lang/en.js` — Support references → 💬 Get Support
- `/app/js/lang/fr.js` — Support references → 💬 Obtenir de l'aide
- `/app/js/lang/hi.js` — Support references → 💬 सहायता प्राप्त करें
- `/app/js/lang/zh.js` — Support references → 💬 获取支持

## Env Variables
- `CALL_FORWARDING_RATE_MIN=0.50` — Per-minute forwarding charge (admin-configurable)
- `OVERAGE_RATE_MIN=0.04` — Per-minute inbound overage charge
- `OVERAGE_RATE_SMS=0.02` — Per-SMS overage charge

## Next Tasks / Backlog
- P0: Test call forwarding billing (place call, verify wallet deduction)
- P1: Add more premium prefixes as they're discovered
- P2: Analytics dashboard for forwarding revenue
