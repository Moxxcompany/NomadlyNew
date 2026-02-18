# NomadlyBot - Product Requirements Document

## Original Problem Statement
1. "analyze and setup" — set up existing codebase
2. "update .env and ensure webhook is working" — configured all env vars + webhook
3. "Cloud Phone Service" — design smart flow for Telnyx-powered virtual phone service
4. "implement fully" — full implementation of Cloud Phone with Telnyx + Brevo

## Architecture
- **Node.js Backend** (`/app/js/`) - Telegram bot with Express server on port 5000
- **FastAPI Python Backend** (`/app/backend/server.py`) - Reverse proxy on port 8001 → Node.js (5000), strips `/api` prefix
- **React Frontend** (`/app/frontend/`) - Admin dashboard on port 3000
- **MongoDB** - Data storage (Railway-hosted)
- **Telnyx** - Phone numbers, SIP trunking, call control, SMS
- **Brevo** - SMS-to-email forwarding

## Key Routing
- Kubernetes ingress routes `/api/*` → FastAPI (port 8001)
- FastAPI strips `/api` prefix and proxies to Node.js Express (port 5000)
- Webhook URLs:
  - Telegram: `https://setup-wizard-100.preview.emergentagent.com/api/telegram/webhook`
  - Telnyx SMS: `https://setup-wizard-100.preview.emergentagent.com/api/telnyx/sms-webhook`
  - Telnyx Voice: `https://setup-wizard-100.preview.emergentagent.com/api/telnyx/voice-webhook`

## Telnyx Resources Created
- SIP Connection ID: 2898118323872990714
- Messaging Profile ID: 40019c71-59a6-497a-8246-49536bd08d87
- Call Control App ID: 2898117434361775526

## What's Been Implemented
- [Jan 2026] Initial setup: installed deps, started services
- [Jan 2026] Full .env configuration with all API keys, webhook verified
- [Jan 2026] Cloud Phone flow designed (see /app/notes/cloud-phone-flow.md)
- [Jan 2026] Full textual user journey documented (see /app/notes/cloud-phone-user-journey.md)
- [Jan 2026] **FULL CLOUD PHONE IMPLEMENTATION**:

  ### New Files Created
  - `js/telnyx-service.js` — Telnyx API v2 wrapper (search numbers, buy, SIP connections, messaging profiles, call control, recordings)
  - `js/phone-config.js` — All button labels, texts, keyboards, plans, country/area data, helpers
  - `js/sms-service.js` — Inbound SMS handler, Telegram forwarding, Brevo email forwarding, webhook forwarding
  - `js/voice-service.js` — Inbound call handler, call forwarding logic, voicemail with recording

  ### Modified Files
  - `js/config.js` — Added `cloudPhone` button to user object and main keyboard
  - `js/_index.js` — Full state machine (25+ states):
    - Main menu → Cloud Phone hub (submenu5)
    - Buy flow: Country → Type → Area → Search → Select → Plan → Summary → Payment → Activation
    - My Numbers: List → Manage
    - Call Forwarding: Always/Busy/No Answer/Disable + enter forward number
    - SMS Settings: Toggle Telegram, set Email (Brevo), set Webhook URL
    - Voicemail: Enable/Disable, Telegram/Email delivery, ring timeout
    - SIP Credentials: View, reveal password (auto-delete 30s), reset, softphone guide
    - Call & SMS Logs: Recent activity from phoneLogs collection
    - Renew/Change Plan: Upgrade/Downgrade, auto-renew toggle
    - Release Number: 2-step confirmation (confirm + type last 4 digits)
    - Payment: Wallet (USD/NGN), Crypto, Bank — reuses existing payment infra
    - Telnyx webhook routes: /telnyx/sms-webhook, /telnyx/voice-webhook
    - DB helpers: updatePhoneNumberFeature, updatePhoneNumberField
  - `backend/.env` — Added Telnyx API key, Brevo API key, phone plan prices, SIP domain, resource IDs

  ### New DB Collections
  - `phoneNumbersOf` — User's phone numbers with full config (SIP creds, features, plan)
  - `phoneTransactions` — Purchase/renew/release transaction logs
  - `phoneLogs` — Call and SMS activity logs

  ### Business Model
  - Starter: $5/mo (100 min, 50 SMS, forwarding)
  - Pro: $15/mo (500 min, 200 SMS, forwarding + voicemail + SIP)
  - Business: $30/mo (unlimited min, 1000 SMS, all features + recording)

## Test Results
- Backend: 100% (8/8 tests passed)
- Frontend: 100% (dashboard loads correctly)
- All webhook endpoints verified

## Current Status
- All services RUNNING
- Telnyx resources initialized (SIP, Messaging, Call Control)
- Bot accepting Telegram webhook
- Cloud Phone fully operational

## Backlog
- P1: Add phone number expiry scheduler (auto-renew + reminder notifications) ✅ DONE
- P1: Add usage tracking scheduler (daily CDR pull from Telnyx) ✅ DONE
- P2: Domain detection for Railway deployment (auto-update webhook URLs)
- P2: Admin panel integration (React frontend) — phone number dashboard
- P3: IVR / Auto-attendant feature
- P3: Outbound calling via SIP
- P3: Outbound SMS (reply to forwarded SMS in Telegram)
