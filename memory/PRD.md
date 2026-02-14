# NomadlyBot - Project Requirements Document

## Original Problem Statement
Setup repo - analyze and setup the existing NomadlyBot codebase.

## Architecture
- **Node.js Backend**: Telegram bot + Express REST API server (`/app/js/`)
- **FastAPI Proxy**: Python proxy (`/app/backend/server.py`) that starts the Node.js bot as a subprocess and proxies all requests to it on port 5000
- **React Frontend**: Admin dashboard (`/app/frontend/`) showing system health, bot status, and feature overview
- **MongoDB**: External database for user data, payments, links, domains, etc.

## Tech Stack
- Node.js (Express) - Core bot logic and REST APIs
- Python (FastAPI) - Proxy layer
- React 18 - Admin dashboard frontend
- MongoDB - Data persistence
- Telegram Bot API - Bot interface

## Core Features (Existing)
- URL Shortening (Bit.ly, custom domain)
- Domain Name Sales (Connect Reseller API)
- Phone Number Leads (SMS & Voice)
- Wallet System (USD & NGN, crypto & bank deposits)
- Web Hosting (cPanel & Plesk plans)
- VPS Plans management
- Subscription Plans (Daily, Weekly, Monthly)
- DNS Management
- Crypto Payments (BlockBee, DynoPay)
- Bank Payments (Fincra)
- Multi-language support

## What's Been Implemented (Setup)
- **2026-02-14**: Analyzed existing codebase, installed Node.js dependencies (`npm install`), created root `.env` with proper config, set `TELEGRAM_BOT_ON=false` to allow Express server to start without bot token
- All 3 services running: Frontend (port 3000), FastAPI proxy (port 8001), Node.js Express (port 5000)
- Health endpoint returning: Bot Running, DB Connected, REST APIs Active
- Frontend dashboard showing all systems online

## Environment Variables Required
- `MONGO_URL` - MongoDB connection string (configured)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (NOT configured - needed to enable bot)
- `TELEGRAM_BOT_ON` - Set to `true` to enable Telegram bot (currently `false`)
- Various API keys for integrations (Connect Reseller, BlockBee, Fincra, etc.)

## Prioritized Backlog
### P0 (Critical)
- Add `TELEGRAM_BOT_TOKEN` to enable the actual Telegram bot functionality

### P1 (Important)
- Configure Connect Reseller API (IP whitelist needed)
- Set up webhook URL for Telegram bot
- Configure payment gateways (BlockBee, Fincra, DynoPay)

### P2 (Nice to have)
- Enhanced admin dashboard with real-time analytics
- User management UI
- Payment history viewer
- Domain management interface

## Next Tasks
- User to provide Telegram bot token to activate bot functionality
- Configure external service API keys as needed
