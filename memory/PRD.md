# NomadlyBot - Product Requirements Document

## Original Problem Statement
1. "analyze and setup" — set up existing codebase
2. "update .env and ensure webhook is working" — configured all env vars + webhook
3. "Cloud Phone Service" — design smart flow for Telnyx-powered virtual phone service

## Architecture
- **Node.js Backend** (`/app/js/`) - Telegram bot with Express server on port 5000
- **FastAPI Python Backend** (`/app/backend/server.py`) - Reverse proxy on port 8001 → Node.js (5000), strips `/api` prefix
- **React Frontend** (`/app/frontend/`) - Admin dashboard on port 3000
- **MongoDB** - Data storage (Railway-hosted)
- **Telnyx** - Planned: underlying carrier for Cloud Phone service

## Key Routing
- Kubernetes ingress routes `/api/*` → FastAPI (port 8001)
- FastAPI strips `/api` prefix and proxies to Node.js Express (port 5000)
- Webhook URL: `https://onboarding-hub-25.preview.emergentagent.com/api/telegram/webhook`
- SELF_URL: `https://onboarding-hub-25.preview.emergentagent.com/api`

## What's Been Implemented
- [Jan 2026] Initial setup: installed deps, started services
- [Jan 2026] Full .env configuration with all API keys, webhook verified
- [Jan 2026] Cloud Phone Service flow designed (see /app/notes/cloud-phone-flow.md)

## Current Status
- All services RUNNING (FastAPI, React, Node.js bot, MongoDB)
- Telegram webhook verified and active
- Cloud Phone flow fully designed, ready for implementation

## Cloud Phone Service — Design Summary
- **New main menu item**: "📞☁️ Cloud Phone" → submenu5
- **Buy Number flow**: Country → Type → Area → Search → Select → Plan → Payment → Activation
- **My Numbers**: List → Manage (Forwarding, SMS, Voicemail, SIP, Logs, Renew, Release)
- **SIP Settings**: Global SIP domain config + softphone guides
- **DB Collections**: phoneNumbersOf, phoneTransactions, phoneLogs
- **New Files**: telnyx-service.js, voice-service.js, sms-service.js, phone-config.js
- **Webhook Routes**: /telnyx/voice-webhook, /telnyx/sms-webhook
- **Business Model**: Starter $5/mo, Pro $15/mo, Business $30/mo (400-2900% margin on Telnyx)

## Backlog
- P0: Implement Cloud Phone MVP (Phase 1) — requires TELNYX_API_KEY
- P0: Whitelist pod IP in Connect Reseller
- P1: Cloud Phone Phase 2 (call forwarding, voicemail, renewals)
- P2: Cloud Phone Phase 3 (recording, IVR, outbound, admin panel)
