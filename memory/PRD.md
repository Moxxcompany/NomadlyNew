# NomadlyBot - PRD & Project Status

## Original Problem Statement
Set up the repo code for NomadlyBot - an existing Telegram Bot Admin platform. Then verify and complete group auto-detection/registration and ensure all event notifications include the bot username.

## Architecture
- **Node.js Backend** (Express + Telegram Bot API + MongoDB) — `/app/js/`
- **FastAPI Proxy** (`/app/backend/server.py`) — starts Node.js subprocess, proxies requests
- **React Frontend** (`/app/frontend/`) — Admin dashboard with health monitoring
- **MongoDB** — Local instance at `mongodb://127.0.0.1:27017`

## Core Services (Node.js Bot)
1. **URL Shortener** — Custom domain shortening with RapidAPI (migrated from Cutt.ly)
2. **Domain Names** — Buy/manage domains via ConnectReseller API, DNS management
3. **Phone Leads** — SMS & Voice lead generation/validation with carrier filtering
4. **Wallet System** — USD/NGN deposits via crypto (BlockBee/DynoPay) & bank (Fincra)
5. **Web Hosting** — cPanel & Plesk plans with free trial (12hr Freedom Plan)
6. **VPS Plans** — Virtual private servers on demand (NameWord API)

## User Personas
- **Bot Admin** — Monitors bot health, manages users, broadcasts messages
- **Bot Users (Telegram)** — URL shortening, buy domains, phone leads, deposits, hosting

## What's Been Implemented

### Session 1 (Feb 14, 2026) — Repo Setup
- [x] Installed Node.js dependencies (`npm install`)
- [x] Created root `.env` with local MongoDB config
- [x] Updated backend `.env` to use local MongoDB
- [x] All services running: FastAPI proxy, Node.js bot, MongoDB, React frontend
- [x] Testing: 100% pass (backend, frontend, integration)

### Session 2 (Feb 14, 2026) — Group Notifications & Bot Username
- [x] Fixed `notifyGroup()` to always append bot username (`CHAT_BOT_NAME`) to every message
- [x] Fixed hardcoded "NomadlyBot" in New User Joined notification → uses dynamic `${CHAT_BOT_NAME}`
- [x] Verified group auto-detection via `my_chat_member` handler (registers on add, unregisters on remove)
- [x] Added 5 new tests for bot username inclusion
- [x] All 45 tests passing (group notifications + customCuttly migration)
- [x] Node.js syntax validation passed

### Recent Commits (Pre-existing)
- Group notification system: `my_chat_member` handler, `notifyGroup()`, `maskName()`
- 15 notification hooks across all event types (onboarding, subscription, domain, wallet, bitly, leads)
- `customCuttly.js` migrated from Cutt.ly API to RapidAPI `url-shortener42`

## P0 - Critical (Requires User Action)
- [ ] Set `TELEGRAM_BOT_TOKEN` to enable Telegram bot functionality
- [ ] Configure `SELF_URL` for webhook support in production

## P1 - Important
- [ ] ConnectReseller API IP whitelist (34.16.56.64 needs whitelisting)
- [ ] Configure payment gateways (BlockBee/Fincra/DynoPay API keys)
- [ ] Set up RapidAPI key for URL shortening

## P2 - Nice to Have
- [ ] Configure production MongoDB (external Railway instance)
- [ ] Set up Telegram broadcast/promo features
- [ ] Enable VPS management (NameWord integration)

## Next Tasks
1. Provide Telegram Bot Token to activate bot & test group registration live
2. Configure external API keys for full functionality
3. Set up webhook URL for Telegram notifications
