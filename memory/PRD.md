# NomadlyBot - PRD & Project Status

## Original Problem Statement
Set up the repo code for NomadlyBot. Verify group auto-detection/registration. Ensure all event notifications include the bot username. Rewrite all notification copy to be persuasive marketing messages.

## Architecture
- **Node.js Backend** (Express + Telegram Bot API + MongoDB) — `/app/js/`
- **FastAPI Proxy** (`/app/backend/server.py`) — starts Node.js subprocess, proxies requests
- **React Frontend** (`/app/frontend/`) — Admin dashboard with health monitoring
- **MongoDB** — Local instance at `mongodb://127.0.0.1:27017`

## What's Been Implemented

### Session 1 (Feb 14, 2026) — Repo Setup
- [x] Installed Node.js dependencies, created `.env`, all services running
- [x] 100% test pass (backend, frontend, integration)

### Session 2 (Feb 14, 2026) — Group Notifications + Bot Username
- [x] Fixed `notifyGroup()` to auto-append `CHAT_BOT_NAME` to every message
- [x] Fixed hardcoded "NomadlyBot" → dynamic `${CHAT_BOT_NAME}` everywhere

### Session 3 (Feb 14, 2026) — Persuasive Marketing Rewrite
- [x] Rewrote all 15 notification messages with persuasive copy:
  - **Subscriptions (4x):** Shows specific plan value — "unlocking X free domains + Y phone validations"
  - **Domains (4x):** Shows actual domain name — "just claimed example.com — yours could be next"
  - **Wallet (3x):** Value-driven — "loaded their wallet, ready to buy domains, leads & more"
  - **Leads (2x):** Shows quantity — "just got 5,000 verified phone leads"
  - **Short Links (1x):** Feature-driven — "branded a link with a custom domain"
  - **New Member (1x):** Service overview — "domains, leads, hosting & more at your fingertips"
- [x] Every notification now includes `/start` CTA for conversion
- [x] Imported `freeDomainsOf` + `freeValidationsOf` from config.js for dynamic plan values
- [x] Fixed bot group welcome message to use dynamic `CHAT_BOT_NAME`
- [x] Removed all generic filler copy ("Another member leveling up", "Ready to roll", etc.)
- [x] All 52 tests passing (100%)

## Group Auto-Registration Flow
1. Add bot to any Telegram group/supergroup with messaging permission
2. `my_chat_member` handler fires → registers group in `notifyGroups` MongoDB collection
3. Bot sends welcome message: "{BotName} is now active in this group!"
4. All subsequent events broadcast to every registered group with bot username signature
5. If bot is removed/kicked → group auto-unregistered

## P0 — Critical (Requires User Action)
- [ ] Set `TELEGRAM_BOT_TOKEN` to activate bot
- [ ] Configure `SELF_URL` for webhooks

## P1 — Important
- [ ] ConnectReseller IP whitelist
- [ ] Payment gateway API keys (BlockBee/Fincra/DynoPay)
- [ ] RapidAPI key for URL shortening

## Next Tasks
1. Provide Telegram Bot Token to test group registration live
2. Configure external API keys for full functionality
