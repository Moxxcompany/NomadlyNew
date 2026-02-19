# Nomadly Telegram Bot - PRD

## Original Problem Statement
User requested setup of the Nomadly Telegram Bot application. Tasks: update .env with provided credentials, ensure pod URL used for webhooks with /api prefix, install dependencies and verify services.

## Architecture
- **Node.js Telegram Bot** (`js/_index.js`) - Main application: URL shortening, domain sales, phone leads, crypto payments, web hosting, cloud phone
- **FastAPI Proxy** (`backend/server.py`) - Starts Node.js bot as subprocess, proxies all HTTP requests to it (port 5000)
- **React Admin Dashboard** (`frontend/src/App.js`) - Shows bot health status, system overview
- **MongoDB** - External Railway instance for data persistence
- **Telegram Bot API** - Webhook-based (not polling) at `/api/telegram/webhook`
- **Telnyx** - Cloud phone services (SIP, SMS, Voice, IVR)
- **Multiple Payment Integrations** - Fincra (bank/NGN), BlockBee (crypto), DynoPay (crypto)

## User Personas
- Bot users: Telegram users who shorten URLs, buy domains, purchase phone leads
- Admin: Bot owner managing users, broadcasting, analytics

## Core Requirements
- Telegram bot running with webhook at pod URL + /api
- MongoDB connected
- All API keys configured (Alcazar, Railway, Telnyx, etc.)
- Express REST APIs active
- Cloud Phone services active (Telnyx SIP, SMS, Voice)

## What's Been Implemented (2026-02-19)
- Updated 5 placeholder API keys in backend/.env (API_ALCAZAR, API_KEY_RAILWAY, RAILWAY_ENVIRONMENT_ID, RAILWAY_SERVICE_ID, TELNYX_MESSAGING_PROFILE_ID)
- Verified webhook URLs use pod URL with /api prefix
- Installed Node.js dependencies (npm install)
- Verified all services: backend proxy, Node.js bot, MongoDB, Telegram webhook, Telnyx resources
- **CNAM Priority Change**: Switched from Multitel (primary) → SignalWire (fallback) to **Telnyx (primary) → Multitel (fallback) → SignalWire (last resort)**. Telnyx uses Number Lookup API (`/v2/number_lookup/{phone}?type=caller-name`).
- **Subscribe Button UX Overhaul**: Renamed "🔔 Subscribe Here" → "⚡ Upgrade Plan" across all 4 languages (EN/FR/ZH/HI). Moved from standalone row to shared row with [Wallet | My Plan | Upgrade Plan]. Trimmed verbose subscription text to clean, scannable format.
- **Double Back Button Fix (End-to-End)**: Replaced ALL 7 instances of `k.of([[pc.back]])` with `k.of([])` across _index.js (SIP settings, search results, number logs, softphone guide). Combined with kOf recognizing plain 'Back'/'Cancel', no Cloud Phone screen will ever show duplicate back buttons.
- **SIP Setup Guide**: Renamed "SIP Settings" → "SIP Setup Guide" (clearer it's a guide, not config). Trimmed verbose multi-section softphone text to clean compact format.
- **SIP Credentials Always Visible**: Moved out of Pro/Business plan gate in `buildManageMenu` — now always shown so users can find their SIP creds (Starter users get upgrade prompt).
- **Delete Number (was Release)**: Renamed "Release Number" → "Delete Number" with stronger double confirmation: first warning says "This cannot be undone" + lists consequences, second asks for last 4 digits as "Final confirmation". Button text: "Yes, Permanently Delete" / "No, Keep It". Admin notification updated to "Number Deleted".
- **SIP Lifecycle Management**: 
  - SIP credentials ARE created for all plans at purchase (sipUsername + sipPassword + Telnyx telephony_credential).
  - On downgrade to a plan without SIP access (e.g., Pro→Starter): SIP soft-disabled via `sipDisabled=true` flag (credentials kept on Telnyx for later re-enable). User warned before downgrade.
  - On upgrade back to SIP-eligible plan: auto re-enabled (`sipDisabled=false`).
  - Pre-downgrade warning shows ALL features that will be lost (SIP, IVR, Recording, Voicemail, Email) with limit changes (minutes/SMS) before user confirms.
  - SIP Credentials handler checks both `sipDisabled` flag AND `canAccessFeature()`.
- Testing passed: 100% (iterations 26-30)

## Prioritized Backlog
- P0: None - system fully operational
- P1: Monitor for any webhook delivery issues
- P2: Consider adding admin dashboard features (analytics, user management)

## Next Tasks
- User to verify Telegram bot is responding to messages
- Monitor logs for any integration errors
