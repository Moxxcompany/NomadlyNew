# Nomadly Bot - PRD

## Problem Statement
Set up the Nomadly Telegram Bot application with updated environment variables and webhook configuration. Improve UX by making reseller text concise/dynamic and relocating "Upgrade Plan" to contextual flows.

## Architecture
- **Node.js Express app** (`js/_index.js`) — core Telegram bot + REST APIs on port 5000
- **FastAPI proxy** (`backend/server.py`) — starts Node.js, proxies all requests on port 8001
- **React frontend** — minimal, served on port 3000
- **MongoDB** — external Railway MongoDB (`caboose.proxy.rlwy.net:59668`)
- **Kubernetes ingress** — routes `/api/*` to backend:8001, everything else to frontend:3000
- **4-language support** — EN, FR, ZH, HI (`js/lang/*.js`)

## Key Services & Integrations
- Telegram Bot API (webhook mode)
- Telnyx (Cloud Phone: SIP, SMS, Voice/IVR, Call Recording)
- Connect Reseller (domain registration)
- Cloudflare (DNS management)
- Fincra / BlockBee / DynoPay (payments)
- Brevo (email/SMTP)
- Bitly / Cuttly (URL shortening)
- Twilio / SignalWire (phone validation)

## What's Been Implemented

### Session 1 (2026-02-19) — Setup
- Updated `/app/backend/.env` with all user-provided API keys and credentials
- Set `SELF_URL` and `SELF_URL_PROD` to pod URL + `/api`
- All services verified running: proxy, bot, DB, Telegram webhook, Telnyx

### Session 2 (2026-02-19) — Reseller Text & Contextual Upgrade
- **Reseller text** — replaced verbose 10-line message with concise 3-line version in all 4 languages + config.js; auto-generates service list from env flags (PHONE_SERVICE_ON, HIDE_SMS_APP, OFFSHORE_HOSTING_ON)
- **Removed "Upgrade Plan" from main keyboard** in all 4 lang files + config.js
- **Contextual upgrade prompts** — freeLinksExhausted now shows upgrade button inline; leads flow shows subscription benefits hint for non-subscribed users
- **Added `subscriptionLeadsHint`** text in all 4 languages
- All tests passed (8/8)

## Backlog
- P0: None
- P1: Consider adding contextual upgrade prompts in more flows (domain purchase, hosting)
- P2: Frontend admin dashboard for analytics
