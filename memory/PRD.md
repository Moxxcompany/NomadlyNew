# Nomadly Bot - PRD & Architecture

## Problem Statement
1. Set up Nomadly Telegram bot on Emergent platform
2. Complete greeting templates library with modification + translation
3. Integrate crypto payment for Cloud Phone and Leads
4. Fix IVR menu option wizard
5. Fix "Try Different Voice" crash + upgrade to 15 ElevenLabs voices via EdenAI
6. Plan availability toggle via .env (Coming Soon)
7. Restrict phone number countries to US + Canada only

## Architecture
- **Python FastAPI** (port 8001): Proxy → Node.js
- **Node.js Express** (port 5000): Telegram bot + all business logic
- **React Frontend** (port 3000): Web UI
- **MongoDB**: Remote Railway-hosted

## What's Been Implemented

### Session 1 — Setup
- Env vars, SELF_URL, npm install, webhook verified

### Session 2 — Templates + Cloud Phone Crypto
- 3 template categories (18 templates), crypto/bank callbacks for phone

### Session 3 — IVR Wizard + Leads Crypto
- 5-step IVR option wizard, leads-pay with crypto/bank/wallet

### Session 4 — Voice Bug + ElevenLabs
- Fixed rawMsg → msg, 15 distinct ElevenLabs voices via EdenAI

### Session 5 — Plan Availability Toggle
- PHONE_STARTER_ON, PHONE_PRO_ON, PHONE_BUSINESS_ON env vars
- Coming Soon message with feature teasers for disabled plans
- Blocks purchase/change to unavailable plans

### Session 6 — Country Restriction
- Limited Buy Number to US + Canada only
- Removed 30+ other countries and "More Countries" button
- Can re-enable by adding countries back to arrays

## Backlog
- P1: Frontend UI development
- P2: Re-enable international countries when ready
- P2: More template categories
