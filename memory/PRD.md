# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
Telegram bot platform (NomadlyBot) for URL shortening, domain sales, phone leads, crypto payments, and offshore web hosting. User requested: "analyze codebase and setup".

## Architecture

### Tech Stack
- **Frontend**: React 18 + Tailwind CSS (Admin Dashboard at port 3000)
- **Backend Proxy**: FastAPI (Python) at port 8001 — proxies all requests to Node.js
- **Core Bot Engine**: Node.js/Express at port 5000 — Telegram bot + REST APIs
- **Database**: MongoDB (external Railway-hosted instance)
- **Hosting Provider**: HostMeNow Reseller API (offshore cPanel)

### Service Architecture
```
[Frontend :3000] → [FastAPI Proxy :8001] → [Node.js Express :5000] → [MongoDB]
                                                     ↓                    ↓
                                              [Telegram Bot API]   [HostMeNow API]
                                                                   [ConnectReseller API]
                                                                   [BlockBee/DynoPay Crypto]
                                                                   [Fincra Payments]
```

### Key Modules (js/)
- `_index.js` — Main bot logic, Express server, MongoDB collections, Telegram message handler
- `config.js` — Bot config, keyboard layouts, pricing, supported crypto
- `config-setup.js` — Environment detection, defaults, token management
- `db.js` — MongoDB CRUD operations (get/set/del/increment)
- `start-bot.js` — Entry point, loads config, starts bot
- `hostmenow.js` — HostMeNow Reseller API client
- `pay-blockbee.js` / `pay-dynopay.js` / `pay-fincra.js` — Payment integrations
- `cr-*.js` — ConnectReseller domain management APIs
- `vm-instance-setup.js` — VPS management
- `validatePhone*.js` — Phone number validation services
- `bitly.js` / `cuttly.js` — URL shortening services
- `broadcast-config.js` / `auto-promo.js` — Marketing automation
- `translation.js` / `lang/` — i18n support

## What's Been Implemented

### [2026-02-15] HostMeNow Integration
- Replaced Nameword hosting with HostMeNow Reseller API
- Plans: Basic (ID 114), Starter (ID 111), Intermediate (ID 112)
- No free trial, cPanel only

### [2026-02-15] Setup & Verification
- Installed Node.js dependencies (npm install)
- Created root `.env` with MongoDB URL and service config
- All 3 services running and healthy:
  - Frontend (React): Running on port 3000
  - Backend (FastAPI proxy): Running on port 8001
  - Node.js bot/Express: Running on port 5000
  - MongoDB: Connected
- Telegram bot: Disabled (no token configured)
- Dashboard showing all services online

## Status
- All services: RUNNING
- MongoDB: CONNECTED
- HostMeNow API: CONFIGURED
- Telegram Bot: DISABLED (no token)
- ConnectReseller: WARNING (IP not whitelisted)

## Prioritized Backlog
- P0: Configure Telegram bot token for live testing
- P1: ConnectReseller IP whitelist for domain features
- P1: Set actual hosting plan pricing
- P2: Add account management features in dashboard
- P2: SSO session creation for direct cPanel access
- P3: Bandwidth/disk usage monitoring dashboard
