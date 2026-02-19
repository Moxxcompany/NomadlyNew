# Nomadly Bot - PRD

## Problem Statement
Nomadly Telegram Bot — link shortener, domain registration, phone leads, cloud phone, and hosting platform. Progressive feature additions and UX improvements.

## Architecture
- **Node.js Express app** (`js/_index.js`) — core Telegram bot + REST APIs on port 5000
- **FastAPI proxy** (`backend/server.py`) — starts Node.js, proxies all requests on port 8001
- **React frontend** — minimal, served on port 3000
- **MongoDB** — external Railway MongoDB (`caboose.proxy.rlwy.net:59668`)
- **Kubernetes ingress** — routes `/api/*` to backend:8001, else to frontend:3000
- **4-language support** — EN, FR, ZH, HI (`js/lang/*.js`)

## Key Services & Integrations
- Telegram Bot API (webhook)
- Telnyx (Cloud Phone: SIP, SMS, Voice/IVR, Call Recording)
- EdenAI + ElevenLabs (TTS in 20 languages)
- Connect Reseller / OpenProvider (domain registration)
- Cloudflare (DNS)
- Fincra / BlockBee / DynoPay (payments)
- Brevo (email/SMTP)
- Bitly / Cuttly (URL shortening)
- Twilio / SignalWire (phone validation)

## What's Been Implemented

### Session 1 — Setup
- Updated `.env` with all API keys, set SELF_URL to pod URL + `/api`

### Session 2 — Reseller Text & Contextual Upgrade
- Replaced verbose reseller text with concise, dynamic version (auto-lists services from env flags)
- Removed "Upgrade Plan" from main keyboard; shows contextually when free links exhaust and in leads flow

### Session 3 — 4 Feature Additions (2026-02-19)
1. **Multilingual TTS for IVR/Voicemail**: Added 20 languages (EN, FR, ES, DE, IT, PT, NL, PL, JA, KO, ZH, HI, AR, RU, TR, SV, DA, NO, FI, EL). Language selection step added between text entry and voice selection in both IVR and VM greeting flows. English users get 6 named voices; other languages get Male/Female options.
2. **CloudPhone in Promos**: Added 'cloudphone' theme to auto-promo system with 5 promo variations in all 4 languages. Updated SERVICE_CONTEXT, PROMO_BANNERS, and THEMES.
3. **Expanded Countries**: Added Puerto Rico (PR) and US Virgin Islands (VI) as no-docs-required countries. Populated moreCountries with 28 popular Telnyx countries (AU, IE, SE, NL, DE, FR, ES, IT, BE, AT, DK, NO, FI, PL, CZ, PT, CH, NZ, MX, BR, CO, CL, IL, SG, JP, ZA, PH, MY). "More Countries" button in buy flow.
4. **Smart Link Upsell**: When free users have 2 or fewer links remaining, shows urgency upsell text + Upgrade Plan button. All 4 languages updated.

## User Personas
- Telegram bot users (link shortening, domain purchase, phone leads, cloud phone, hosting)
- International callers (multilingual IVR greetings)
- Resellers (white-label service resale)
- Admin users (analytics, user management, broadcasts)

## Backlog
- P0: None — all services operational
- P1: Consider auto-language detection for IVR based on caller's country code
- P2: Frontend admin dashboard for business analytics
- P2: Add more Telnyx countries as compliance requirements change
