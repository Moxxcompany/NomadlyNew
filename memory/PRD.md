# NomadlyBot - Product Requirements Document

## Original Problem Statement
Analyze codebase and set up the application.

## Architecture Overview

### Application Type
Multi-service Telegram bot with admin dashboard. The system consists of:

1. **Node.js Telegram Bot** (`/app/js/`) - Core business logic running on Express (port 5000)
2. **FastAPI Proxy Backend** (`/app/backend/server.py`) - Proxies requests to Node.js bot (port 8001)
3. **React Admin Dashboard** (`/app/frontend/`) - Status/health monitoring UI (port 3000)
4. **MongoDB** - Primary database for all bot data

### Tech Stack
- **Bot Engine**: Node.js 20+ with `node-telegram-bot-api`
- **Web Server**: Express.js (port 5000)
- **Backend Proxy**: Python FastAPI + httpx (port 8001)
- **Frontend**: React 18 + Tailwind CSS + Craco
- **Database**: MongoDB (via `mongodb` npm driver + `motor`/`pymongo` Python)
- **Deployment Config**: Railway, Replit, Kubernetes

### Core Bot Features (Node.js)
1. **URL Shortening** - Bit.ly and custom domain shortening (Cuttly)
2. **Domain Name Sales** - Register/manage domains via ConnectReseller API
3. **Phone Number Leads** - Buy/validate phone leads with carrier filtering (US, UK, AU, NZ, Canada)
4. **Wallet System** - USD & NGN deposits via crypto (BlockBee/DynoPay) and bank (Fincra)
5. **Web Hosting** - cPanel & Plesk plans with free trials (Freedom Plan - 12hr)
6. **VPS Management** - Virtual private servers with SSH key management
7. **Multi-language** - English, French, Chinese, Hindi
8. **Subscription Plans** - Daily, Weekly, Monthly tiers
9. **Auto-Promo System** - Automated promotional messages
10. **Broadcast System** - Admin broadcast to all users

### Key Integrations
- **Telegram Bot API** (node-telegram-bot-api)
- **ConnectReseller** - Domain registration, DNS management
- **BlockBee** - Crypto payment processing
- **DynoPay** - Alternative crypto payments
- **Fincra** - NGN bank/card payments
- **Bit.ly** - URL shortening
- **Railway** - Deployment/domain linking
- **Twilio** - Phone validation
- **OpenAI** - Chat functionality
- **Nodemailer** - Email sending

### File Structure Summary
```
/app/
  js/                    # Node.js bot code
    _index.js            # Main bot logic (1700+ lines)
    start-bot.js         # Entry point
    config-setup.js      # Environment detection & defaults
    config.js            # Bot keyboards, text templates, config
    db.js                # MongoDB CRUD helpers
    utils.js             # Utility functions
    translation.js       # Multi-language support
    lang/                # Language files (en, fr, zh, hi)
    hosting/             # Hosting plan configs
    pay-blockbee.js      # Crypto payments
    pay-fincra.js        # Bank payments
    pay-dynopay.js       # Alt crypto payments
    cr-*.js              # ConnectReseller domain APIs
    validatePhone*.js    # Phone validation modules
    vm-instance-setup.js # VPS management
    auto-promo.js        # Auto-promotion system
    broadcast-config.js  # Broadcast settings
  backend/
    server.py            # FastAPI proxy to Node.js
  frontend/
    src/App.js           # Admin dashboard (health monitor)
```

### Environment Variables (Critical)
- `MONGO_URL` - MongoDB connection string
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (missing - bot runs in disabled mode)
- `DB_NAME` - Database name
- `SELF_URL` - Public URL for webhooks
- `REST_APIS_ON` - Enable Express REST server
- `TELEGRAM_BOT_ON` - Enable Telegram bot

## What's Been Implemented (Feb 2026)

### Setup & Bug Fixes
- Installed Node.js npm dependencies (were missing)
- Created root `.env` file with required environment variables
- Fixed `DAILY_PLAN_FREE_VALIDATIONS` undefined error in all 4 language files (en.js, fr.js, zh.js, hi.js)
- All services running: FastAPI proxy, Node.js bot (Telegram disabled), React frontend, MongoDB

### Current Status
- Health endpoint: `{ status: ok, proxy: running, node: running, db: connected }`
- Frontend dashboard shows all services as operational
- Telegram bot is disabled (no `TELEGRAM_BOT_TOKEN` provided)
- ConnectReseller API unreachable (IP not whitelisted)

## Prioritized Backlog

### P0 (Critical)
- Provide `TELEGRAM_BOT_TOKEN` to enable the Telegram bot
- Set `SELF_URL` for webhook functionality
- Whitelist server IP in ConnectReseller

### P1 (Important)
- Add authentication to admin dashboard
- Add real-time bot metrics/analytics to dashboard
- Configure production deployment settings

### P2 (Nice to Have)
- Dashboard: Show recent transactions, user stats
- Add logging/monitoring infrastructure
- Webhook management UI

## Next Tasks
- User to provide Telegram Bot Token to fully enable bot functionality
- Enhance admin dashboard with real-time analytics
