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
- **IVR Menu/Greeting Fix**: Fixed keyboard not clearing when entering Set Greeting or Add Menu Option — bot now sends `k.of([])` to show only Back/Cancel. Added guards to reject IVR button text being saved as greeting. Same fix applied to Voicemail audio upload.
- **Voicemail Default Greeting**: Menu now shows exactly what callers will hear: "You have reached [number]. Please leave a message after the tone."
- **Pro-rated Upgrade Billing**: Upgrades now calculate daily price difference × remaining days and charge pro-rated amount from wallet. Wallet balance checked before confirming. Downgrades: no refund, warning shown.
- **Full Multilingual Coverage**: Added 5 new Cloud Phone msg keys (noIvrOptions, whichKeyRemove, sendVoiceOrText, noActivity, insufficientBalUpgrade) in 4 languages. Added 6 non-Cloud-Phone translation keys (failedAudio, enterBroadcastMessage, provide2Nameservers, noDomainSelected, validInstitutionName, validCityName) to all 4 lang files and wired in _index.js.
- **IVR/Voicemail TTS Overhaul** (EdenAI + ElevenLabs):
  - Created `js/tts-service.js` — EdenAI TTS integration with 6 voice presets (Rachel, Sarah, Laura, Drew, Charlie, Clyde). Generates MP3, caches locally, auto-cleans after 24h.
  - IVR Greeting: Step-by-step wizard → Choose method (Type Text / Upload Audio) → Type text → Select voice → Preview (Telegram voice message) → Save/Retry/Re-type.
  - IVR Menu Options: Guided wizard → Pick key (0-9 buttons) → Pick action (Forward to Number / Play Message & Voicemail) → Configure message (TTS / Upload / Skip) → Preview → Save.
  - Voicemail Greeting: Same TTS/Upload wizard pattern. Default greeting text now displayed clearly.
  - All flows support Back/Cancel at every step. Audio preview sent as Telegram voice message before saving.
- Testing passed: 100% (iterations 26-33)
- **Upgrade Plan Preview**: Upgrade flow now shows feature gain preview (what user will unlock) + limit changes (minutes/SMS increase) with Confirm/Back buttons, matching the downgrade flow.
- **SIP Username Branding**: `generateSipUsername()` prefix changed from `user_` to `sc_` (speechcue branding). New numbers will get `sc_XXXXXX` usernames.
- **Cloud Phone Multilingual**: Added `phoneConfig.msg` object with 25+ message keys in 4 languages (EN/FR/ZH/HI) + `getMsg(lang)` helper. Replaced 34+ hardcoded English strings in `_index.js` with multilingual calls. Covers: validation messages, toggle confirmations, plan change headers, error messages, IVR prompts.

## Prioritized Backlog
- P0: None - system fully operational
- P1: Monitor for any webhook delivery issues
- P2: Consider adding admin dashboard features (analytics, user management)

## Next Tasks
- User to verify Telegram bot is responding to messages
- Monitor logs for any integration errors
