# Nomadly Bot - PRD

## Original Problem Statement
Telegram bot (Nomadly) setup, call forwarding fix, forwarding billing with wallet enforcement, premium prefix blocking, multi-language support, and support routing.

## Architecture
- **FastAPI Proxy** (server.py on port 8001) -> Node.js Express (port 5000)
- **Node.js Telegram Bot** with webhook mode
- **MongoDB** on Railway
- **Telnyx** for Cloud Phone (SIP, SMS, Voice, IVR, Voicemail, Call Recording)

## What's Been Implemented

### Session 1 - Setup (2026-02-19)
- Updated backend .env with all API keys
- Set SELF_URL/SELF_URL_PROD to pod webhook URL

### Session 2 - Call Forwarding Fix (2026-02-19)
- Fixed Telnyx outbound voice profile whitelist (2 -> 250 countries)
- Fixed `to is not defined` error in `handleCallAnswered`

### Session 3 - Forwarding Billing + Premium Blocking + Support Routing (2026-02-19)
- Added CALL_FORWARDING_RATE_MIN=0.50 to .env
- Premium prefix blocking (satellite, premium rate numbers)
- Telnyx Number Lookup validation on forwarding setup
- Replaced all @onarrival1 references with live chat support

### Session 4 - Wallet Enforcement + Multi-Language + $25 Top-up (2026-02-19)

**Wallet Enforcement (6 checkpoints):**
1. Menu entry: Shows wallet balance + warnings when opening Call Forwarding
2. Mode selection: Blocks activation if wallet < $0.50, recommends $25 top-up
3. Number entry: Re-checks wallet before saving forwarding config
4. Live call pre-check: Rejects forwarding if wallet insufficient (TTS + Telegram msg)
5. Mid-call billing: $0.50/min charged every 60s; auto-disconnects when wallet empty with $25 top-up recommendation
6. Hangup billing: Final charge with itemized forwarding cost

**$25 Top-up Recommendations shown at:**
- Forwarding menu (when balance < $5)
- Mode selection (when balance < CALL_FORWARDING_RATE_MIN - blocks activation)
- After activation (estimated minutes + top-up suggestion)
- During live call (low balance warning)
- After forced disconnect (wallet empty)

**Multi-Language Translations:**
- Added `fwdInsufficientBalance`, `fwdBlocked`, `fwdNotRoutable`, `fwdValidating`, `fwdEnterNumber` to all 4 lang files:
  - en.js: English
  - fr.js: French (proper French telecom terminology)
  - hi.js: Hindi (Devanagari script)
  - zh.js: Chinese (Simplified)
- All forwarding setup messages now use `trans()` system for user's preferred language
- phone-config.js texts (English) used for non-translatable technical displays

## Files Modified
- `/app/backend/.env` + `/app/.env` - CALL_FORWARDING_RATE_MIN=0.50
- `/app/js/phone-config.js` - forwardingStatus/enterForwardNumber/forwardingUpdated now accept walletBal, forwardingInsufficientBalance text
- `/app/js/voice-service.js` - Pre-call wallet check with low balance warning, mid-call $25 recommendation on disconnect
- `/app/js/_index.js` - Wallet checks at every forwarding step, uses trans() for translations
- `/app/js/lang/en.js` - fwd* translation keys added
- `/app/js/lang/fr.js` - French fwd* translations
- `/app/js/lang/hi.js` - Hindi fwd* translations
- `/app/js/lang/zh.js` - Chinese fwd* translations
- `/app/js/telnyx-service.js` - validateForwardingDestination, ensureProfileWhitelist

## Next Tasks / Backlog
- P0: Test full forwarding flow with wallet deduction
- P1: Add forwarding usage to Usage & Billing report
- P2: Forwarding analytics dashboard
