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
- **Double Back Button Fix**: Updated `kOf` function in config.js to recognize plain 'Back' and 'Cancel' buttons from Cloud Phone flows, preventing `_bc` from appending duplicate [Back, Cancel] row.
- Testing passed: 100% all iterations

## Prioritized Backlog
- P0: None - system fully operational
- P1: Monitor for any webhook delivery issues
- P2: Consider adding admin dashboard features (analytics, user management)

## Next Tasks
- User to verify Telegram bot is responding to messages
- Monitor logs for any integration errors
