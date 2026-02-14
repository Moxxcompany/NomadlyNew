# NomadlyBot - PRD & Project Status

## Original Problem Statement
Set up the repo code for NomadlyBot. Verify group auto-detection/registration. Ensure all event notifications include the bot username. Rewrite notifications to be persuasive. Fix AutoPromo 400 "chat not found" errors.

## Architecture
- **Node.js Backend** (Express + Telegram Bot API + MongoDB) — `/app/js/`
- **FastAPI Proxy** (`/app/backend/server.py`) — starts Node.js subprocess, proxies requests
- **React Frontend** (`/app/frontend/`) — Admin dashboard with health monitoring
- **MongoDB** — Local instance at `mongodb://127.0.0.1:27017`

## What's Been Implemented

### Session 1 — Repo Setup
- [x] Installed Node.js deps, created `.env`, all services running

### Session 2 — Group Notifications + Bot Username
- [x] `notifyGroup()` auto-appends `CHAT_BOT_NAME` to every message
- [x] All hardcoded "NomadlyBot" → dynamic `${CHAT_BOT_NAME}`

### Session 3 — Persuasive Marketing Rewrite
- [x] Rewrote all 15 notifications: social proof, FOMO, value props, /start CTA
- [x] Imported `freeDomainsOf` + `freeValidationsOf` from config.js

### Session 4 — AutoPromo "chat not found" Fix
- [x] Added `isUnreachableError()` helper: detects "chat not found", "user is deactivated", "bot was blocked", "have no rights to send"
- [x] Photo fallback now bails immediately for unreachable users (no more wasteful text retry)
- [x] HTML parse retry bails immediately for unreachable users
- [x] Auto-opts-out on 400 "chat not found" (was only 403 before)
- [x] Eliminates retry cascade: was 4 failed API calls per user, now just 1

## Test Status
- 52/52 group notification tests passing
- All AutoPromo unreachable error tests passing
- Backend health: proxy=running, node=running, db=connected

## P0 — Requires User Action
- [ ] Set `TELEGRAM_BOT_TOKEN` to activate bot
- [ ] Configure `SELF_URL` for webhooks

## P1 — Important
- [ ] ConnectReseller IP whitelist
- [ ] Payment gateway API keys
- [ ] RapidAPI key for URL shortening

## Next Tasks
1. Provide Telegram Bot Token to test live
2. Configure external API keys
