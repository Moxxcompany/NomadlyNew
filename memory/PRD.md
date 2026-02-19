# Nomadly Bot - PRD

## Original Problem Statement
Telegram bot (Nomadly) setup, environment configuration, and call forwarding fix.

## Architecture
- **FastAPI Proxy** (server.py on port 8001) → spawns and proxies to **Node.js Express** app (port 5000)
- **Node.js Telegram Bot** using `node-telegram-bot-api` with webhook mode
- **MongoDB** hosted on Railway (`caboose.proxy.rlwy.net:59668`)
- **Telnyx** for Cloud Phone (SIP, SMS, Voice, IVR, Voicemail, Call Recording)

## What's Been Implemented

### Session 1 (2026-02-19) — Setup
- Updated backend `.env` with all user-provided API keys
- Set SELF_URL/SELF_URL_PROD to pod webhook URL with `/api` prefix
- All services verified running

### Session 2 (2026-02-19) — Call Forwarding Fix
**Problem**: Calling +18556820054 with forwarding to Portugal (+351) failed — call answered but no actual forwarding occurred.

**Root Cause**: Telnyx Outbound Voice Profile `2897375459551478845` ("Speechcue Try First Call") only whitelisted `["US","CA"]`. Portugal (PT) was not in the whitelist, causing Telnyx error 10010.

**Fixes Applied**:
1. Updated outbound voice profile whitelist from 2 → 250 countries (comprehensive international coverage)
2. Added `ensureProfileWhitelist()` to `telnyx-service.js` — auto-checks/updates whitelist on every startup
3. Updated `transferCall()` to pass `from` number for proper international routing
4. Updated `voice-service.js` forwarding paths (always, no_answer, IVR) to pass caller's Telnyx number
5. Improved error logging in `transferCall()` with detailed error extraction

## Files Modified
- `/app/backend/.env` — Environment variables
- `/app/js/telnyx-service.js` — transferCall with from param, ensureProfileWhitelist, better error logging
- `/app/js/voice-service.js` — Pass `to` number as `from` in all transfer calls

## Next Tasks / Backlog
- P0: User should test call forwarding to Portugal again to confirm fix
- P1: Monitor for any other country-specific forwarding issues
- P2: Consider adding number-level forwarding destination validation (warn user if country not supported)
