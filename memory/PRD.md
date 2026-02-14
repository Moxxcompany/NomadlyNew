# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
Setup the existing codebase - analyze and get it running.

## Architecture Overview
- **Frontend**: React 18 admin dashboard (port 3000) - shows bot status, DB connection, feature cards
- **Backend**: FastAPI (Python, port 8001) - acts as reverse proxy to Node.js server
- **Node.js Core**: Express server (port 5000) - Telegram bot engine with REST APIs
- **Database**: MongoDB (remote, Railway hosted)

## Tech Stack
- React 18 + Tailwind CSS + Craco (frontend)
- FastAPI + httpx (Python backend proxy)
- Node.js 20 + Express + node-telegram-bot-api (core bot logic)
- MongoDB 5.x (via mongodb driver)

## Core Features
1. **URL Shortener** - Bitly integration, custom domain shortening with analytics
2. **Domain Names** - Buy via Connect Reseller API, DNS management
3. **Phone Leads** - SMS & Voice leads with carrier filtering, bulk validation
4. **Wallet System** - USD & NGN deposits via crypto (BlockBee/Dynopay) & bank (Fincra)
5. **Web Hosting** - cPanel & Plesk plans with free trials
6. **VPS Plans** - Virtual private server management
7. **Telegram Bot** - Full bot interface for all features
8. **Multi-language** - English, Chinese, and other language support

## What's Been Implemented (Setup - Feb 14, 2026)
- Installed Node.js dependencies (`npm install`)
- Fixed syntax error in `/app/js/lang/zh.js` (stray template literal on line 298)
- Created root `.env` file with MONGO_URL, DB_NAME, and service flags
- Bot set to TELEGRAM_BOT_ON=false (no token provided yet)
- All services running: FastAPI proxy, Node.js Express server, React frontend
- Health check passing: Bot Running, DB Connected, REST APIs Active

## Environment Variables Needed (for full functionality)
- `TELEGRAM_BOT_TOKEN` - Telegram bot API token
- Connect Reseller API credentials
- BlockBee/Dynopay crypto payment API keys
- Fincra bank payment API keys
- Bitly API key

## Prioritized Backlog
### P0 (Critical)
- Provide TELEGRAM_BOT_TOKEN to enable Telegram bot functionality

### P1 (High)
- Connect Reseller IP whitelisting (IP: 34.16.56.64)
- Configure payment provider API keys

### P2 (Nice to have)
- Admin dashboard enhancements (real-time stats, user management UI)
- Webhook configuration for Telegram bot
