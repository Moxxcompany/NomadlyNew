# NomadlyBot - PRD & Project Status

## Original Problem Statement
Set up the repo code for NomadlyBot - an existing Telegram Bot Admin platform.

## Architecture
- **Node.js Backend** (Express + Telegram Bot API + MongoDB) — `/app/js/`
- **FastAPI Proxy** (`/app/backend/server.py`) — starts Node.js subprocess, proxies requests
- **React Frontend** (`/app/frontend/`) — Admin dashboard with health monitoring
- **MongoDB** — Local instance at `mongodb://127.0.0.1:27017`

## Core Services (Node.js Bot)
1. **URL Shortener** — Custom domain shortening with Bit.ly/Cutt.ly integration
2. **Domain Names** — Buy/manage domains via ConnectReseller API, DNS management
3. **Phone Leads** — SMS & Voice lead generation/validation with carrier filtering
4. **Wallet System** — USD/NGN deposits via crypto (BlockBee/DynoPay) & bank (Fincra)
5. **Web Hosting** — cPanel & Plesk plans with free trial (12hr Freedom Plan)
6. **VPS Plans** — Virtual private servers on demand (NameWord API)

## User Personas
- **Bot Admin** — Monitors bot health, manages users, broadcasts messages
- **Bot Users (Telegram)** — URL shortening, buy domains, phone leads, deposits, hosting

## What's Been Implemented (Feb 14, 2026)
- [x] Installed Node.js dependencies (`npm install`)
- [x] Created root `.env` with local MongoDB config
- [x] Updated backend `.env` to use local MongoDB
- [x] All services running: FastAPI proxy, Node.js bot, MongoDB, React frontend
- [x] Health endpoint verified: proxy=running, node=running, db=connected
- [x] Frontend dashboard showing all status cards and feature cards
- [x] Testing: 100% pass rate (backend, frontend, integration)

## Current Configuration
- `TELEGRAM_BOT_ON=false` (no bot token provided)
- `REST_APIS_ON=true` (Express API server active)
- Local MongoDB: `nomadly_bot` database

## P0 - Critical (Requires User Action)
- [ ] Set `TELEGRAM_BOT_TOKEN` to enable Telegram bot functionality
- [ ] Configure `SELF_URL` for webhook support in production

## P1 - Important
- [ ] ConnectReseller API IP whitelist (34.16.56.64 needs whitelisting)
- [ ] Configure payment gateways (BlockBee/Fincra/DynoPay API keys)
- [ ] Set up Bit.ly API token for URL shortening

## P2 - Nice to Have
- [ ] Configure production MongoDB (external Railway instance)
- [ ] Set up Telegram broadcast/promo features
- [ ] Enable VPS management (NameWord integration)

## Next Tasks
1. Provide Telegram Bot Token to activate bot features
2. Configure external API keys for full functionality
3. Set up webhook URL for Telegram notifications
