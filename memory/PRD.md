# Nomadly Bot - PRD & Architecture

## Problem Statement
1. Set up Nomadly Telegram bot on Emergent platform with correct env vars and webhook URLs
2. Complete greeting templates library for financial institutions (fraud, support, etc.) with modification and translation support
3. Integrate crypto payment for Cloud Phone service (was wallet-only for crypto callbacks)
4. Fix IVR menu option wizard — pressing a key (0-9) said "not available" because handlers were never implemented
5. Add crypto/bank payment for Leads (buy/validate) — was wallet-only

## Architecture
- **Python FastAPI** (port 8001): Proxy layer that starts Node.js bot and forwards all `/api/*` requests
- **Node.js Express** (port 5000): Main business logic — Telegram bot, URL shortener, domain registration, phone leads, hosting, VPS, cloud phone
- **React Frontend** (port 3000): Web UI
- **MongoDB**: Remote Railway-hosted MongoDB

## What's Been Implemented

### Session 1 (2026-02-19) — Setup
- Updated `/app/backend/.env` with all API keys, set SELF_URL to pod URL + `/api`
- Installed Node.js dependencies, verified all services running

### Session 2 (2026-02-19) — Templates + Cloud Phone Crypto
- Expanded template categories to 3 (Financial, Support, Voicemail) with 18 total templates
- Added `📋 Use Template` to both IVR and VM greeting menus
- Added `cpVmTemplate` + `cpVmTemplateEdit` handlers + VM translation
- Added crypto/bank/DynoPay callbacks for Cloud Phone (`crypto-pay-phone`, `dynopay/crypto-pay-phone`, `bank-pay-phone`)

### Session 3 (2026-02-19) — IVR Wizard + Leads Crypto Payment
**IVR Menu Option Wizard (Complete)**
- Implemented 5-step wizard: cpIvrOptionKey → cpIvrOptionAction → cpIvrOptionMsg → cpIvrOptionVoice → cpIvrOptionPreview
- Supports 3 action types: Forward Call (enter phone number), Play Message (Template/TTS/Upload with translation), Send to Voicemail
- Each step has proper back navigation, template selection with translation, voice preview, and save
- Options saved to ivrConf.options[key] with proper structure for voice-service.js

**Leads Crypto/Bank Payment (Complete)**
- Added `leads-pay` action with Crypto/Bank/Wallet options for both buy leads AND validate leads
- Added `crypto-pay-leads` + `bank-pay-leads` action handlers
- Added 3 callback endpoints: `app.get('/crypto-pay-leads')` (BlockBee), `app.post('/dynopay/crypto-pay-leads')` (DynoPay), `bankApis['/bank-pay-leads']`
- All callbacks directly process leads orders (no wallet intermediate step)
- Changed `askCoupon` flows and `targetLeadsConfirm` to use `leads-pay` instead of wallet-only
- Added `payLeads` to `dynopayActions`

## Backlog
- P1: Frontend UI development
- P2: Add more template categories (Healthcare, Legal, Real Estate)
- P2: Template favorites/recently used system
- P2: Leads order history and reorder feature
