# NomadlyBot - PRD & Project Status

## Original Problem Statement
Set up the repo code for NomadlyBot. Fix group notifications, persuasive marketing copy, AutoPromo unreachable user errors, and Shortit free trial link bugs.

## Architecture
- **Node.js Backend** (Express + Telegram Bot API + MongoDB) — `/app/js/`
- **FastAPI Proxy** (`/app/backend/server.py`) — starts Node.js subprocess, proxies requests
- **React Frontend** (`/app/frontend/`) — Admin dashboard with health monitoring
- **MongoDB** — Local instance at `mongodb://127.0.0.1:27017`

## What's Been Implemented

### Session 1 — Repo Setup
- [x] All services running

### Session 2 — Group Notifications + Bot Username
- [x] `notifyGroup()` auto-appends `CHAT_BOT_NAME`; all hardcoded refs fixed

### Session 3 — Persuasive Marketing Rewrite
- [x] All 15→17 notifications rewritten with social proof, FOMO, value props, /start CTA

### Session 4 — AutoPromo "chat not found" Fix
- [x] `isUnreachableError()` auto-opts-out unreachable users; eliminated retry cascade

### Session 5 — Shortit Free Link Bugs
- [x] Fixed `increment(totalShortLinks)` → `increment(totalShortLinks, 'total')` across all 5 paths
- [x] Root cause: missing key caused "Key cannot be undefined or null" error, crashing the flow before remaining links message or group notification
- [x] Added `notifyGroup` to Shortit random + custom link paths (was only on Bitly paid path)
- [x] Remaining links message (`t.linksRemaining`) now executes correctly after link creation
- [x] All 52 tests passing

## Test Status
- 52/52 group notification tests passing
- All increment calls verified with 'total' key
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
