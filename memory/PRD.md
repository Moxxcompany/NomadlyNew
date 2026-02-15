# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
Analyze code and setup the existing NomadlyBot codebase.

## Application Overview
**NomadlyBot** is a Telegram bot platform for URL shortening, domain name sales, phone leads generation/validation, crypto payments, and web hosting management.

## Architecture

### Tech Stack
- **Frontend**: React 18 + Tailwind CSS (Admin Dashboard at port 3000)
- **Backend Proxy**: FastAPI (Python) at port 8001 — proxies requests to Node.js
- **Core Bot Engine**: Node.js/Express at port 5000 — Telegram bot + REST APIs
- **Database**: MongoDB (external Railway-hosted instance)
- **Bot Framework**: node-telegram-bot-api

### Service Architecture
```
[Frontend :3000] → [FastAPI Proxy :8001] → [Node.js Express :5000] → [MongoDB]
                                                     ↓
                                              [Telegram Bot API]
```

### Key Modules (js/)
1. **start-bot.js** — Entry point, runs bot
2. **_index.js** — Main bot logic, Express server, MongoDB connection, all command handlers
3. **config.js** — Bot configuration, keyboard layouts, pricing, text templates
4. **config-setup.js** — Environment detection, defaults setup
5. **db.js** — MongoDB CRUD helpers (get/set/del/increment)
6. **pay-blockbee.js** — BlockBee crypto payment integration
7. **pay-fincra.js** — Fincra bank payment integration
8. **pay-dynopay.js** — DynoPay crypto payment integration
9. **cr-*.js** — ConnectReseller domain API modules
10. **validatePhone*.js** — Phone number validation (Twilio, AWS, Neutrino, etc.)
11. **bitly.js / cuttly.js** — URL shortening services
12. **vm-instance-setup.js** — VPS management
13. **hosting/** — Web hosting plan management
14. **translation.js / lang/** — Multi-language support
15. **auto-promo.js** — Auto-promotion system
16. **broadcast-config.js** — Broadcast messaging configuration

### Frontend
- Single-page React admin dashboard showing system status
- Polls `/api/health` every 30s
- Shows bot status, DB connection, REST APIs, and feature cards

### Environment Variables
- Root `.env` — Node.js bot config (MONGO_URL, TELEGRAM_BOT_TOKEN, etc.)
- `backend/.env` — FastAPI config (MONGO_URL, DB_NAME)
- `frontend/.env` — React config (REACT_APP_BACKEND_URL)

## What's Been Implemented
- [2026-02-15] Full codebase analysis and environment setup
  - Installed Node.js dependencies (npm install)
  - Created root `.env` with MongoDB URL and defaults
  - All 3 services running: Frontend (React), Backend (FastAPI proxy), Node.js Express
  - MongoDB connected successfully
  - Health checks passing on all endpoints
  - Telegram bot disabled (no token configured — set to false)

## User Personas
1. **Bot Admin** — Manages bot via Telegram admin commands + web dashboard
2. **Bot Users** — Telegram users buying domains, shortening URLs, purchasing leads
3. **Resellers** — Potential resellers via partnership program

## Core Features
- URL Shortening (Bitly, Cuttly, custom domain)
- Domain Name Purchase & DNS Management (ConnectReseller)
- Phone Number Leads (buy & validate)
- Wallet System (USD & NGN, crypto & bank deposits)
- Web Hosting Plans (cPanel & Plesk)
- VPS Management
- Subscription Plans (Daily/Weekly/Monthly)
- Multi-language support
- Group notifications
- Auto-promotion system

## Status
- All services: RUNNING
- MongoDB: CONNECTED
- Telegram Bot: DISABLED (no token)
- Frontend Dashboard: OPERATIONAL

## Prioritized Backlog
- P0: Configure Telegram bot token for full bot functionality
- P1: ConnectReseller IP whitelist (34.16.56.64)
- P2: Add more dashboard features (user analytics, transaction history)
- P3: Improve error handling and monitoring

## Next Tasks
- User to provide Telegram bot token if they want bot functionality
- User to whitelist IP in ConnectReseller if domain features needed
- Any specific feature requests or bug fixes
