# Nomadly Bot - PRD & Architecture

## Problem Statement
1. Set up Nomadly Telegram bot on Emergent platform with env vars and webhook URLs
2. Complete greeting templates library (fraud, support, voicemail) with modification + translation
3. Integrate crypto payment for Cloud Phone and Leads services
4. Fix IVR menu option wizard (was unimplemented)
5. Fix "Try Different Voice" crash (rawMsg not defined)
6. Upgrade to 15 distinct ElevenLabs voices via EdenAI (was 6 generic MALE/FEMALE)

## Architecture
- **Python FastAPI** (port 8001): Proxy → Node.js
- **Node.js Express** (port 5000): Telegram bot, URL shortener, domains, leads, phone, hosting, VPS
- **React Frontend** (port 3000): Web UI
- **MongoDB**: Remote Railway-hosted

## What's Been Implemented

### Session 1 — Setup
- Updated .env with all API keys, SELF_URL = pod URL + /api, npm install, services running

### Session 2 — Templates + Cloud Phone Crypto
- 3 template categories (Financial 8, Support 4, Voicemail 6 = 18 templates)
- Template button added to IVR + VM greeting menus
- cpVmTemplate + cpVmTemplateEdit handlers + VM translation
- Crypto/bank/DynoPay callbacks for Cloud Phone

### Session 3 — IVR Wizard + Leads Crypto
- 5-step IVR option wizard: Key → Action → Configure → Preview → Save
- 3 action types: Forward Call, Play Message (Template/TTS/Upload), Send to Voicemail
- leads-pay action with Crypto/Bank/Wallet for Buy Leads + Validate Leads
- BlockBee + DynoPay + bankApis callbacks that directly process leads orders

### Session 4 — Voice Bug Fix + ElevenLabs Upgrade
- Fixed ReferenceError: rawMsg → msg (12 occurrences in _index.js)
- Upgraded from 6 generic voices (MALE/FEMALE) to 15 distinct ElevenLabs voices with real voice IDs
- Voices: Rachel, Sarah, Laura, Emily, Domi, Dorothy, Glinda (female) + Drew, Charlie, Clyde, Adam, Josh, Arnold, Sam, Thomas (male)
- All 15 voices available for all 20 languages (ElevenLabs multilingual v2)
- EdenAI API now passes voiceId as option parameter for distinct voice selection

## Backlog
- P1: Frontend UI development
- P2: More template categories (Healthcare, Legal, Real Estate)
- P2: Template favorites/recently used
- P2: Leads reorder feature
