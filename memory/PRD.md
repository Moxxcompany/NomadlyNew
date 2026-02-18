# NomadlyBot PRD

## Original Problem Statement
User requested setup and configuration of existing NomadlyBot codebase - a Telegram bot platform for URL shortening, domain sales, phone leads, crypto payments, and web hosting.

## Architecture
- **Backend**: FastAPI (server.py) acting as proxy to Node.js Express server
- **Node.js**: Telegram bot + Express API on port 5000 (`js/start-bot.js` → `js/_index.js`)
- **Frontend**: React dashboard showing bot status and feature overview
- **Database**: MongoDB (Railway-hosted remote instance)
- **Bot Framework**: node-telegram-bot-api with webhook mode

## Core Requirements
- Telegram bot with multi-language support (EN, FR, ZH, HI)
- URL shortening (Bit.ly, Cuttly, custom domains)
- Domain name registration and DNS management (Connect Reseller API)
- Phone number leads and validation
- Wallet system (USD & NGN via crypto/bank)
- Web hosting plans (cPanel/Plesk) with free trials
- VPS management
- Crypto payments (BlockBee, DynoPay)
- Bank payments (Fincra)

## What's Been Implemented (Jan 2026)
- [x] Node.js dependencies installed
- [x] Root `.env` configured with all 90+ environment variables
- [x] `SELF_URL` and `SELF_URL_PROD` pointed to pod URL
- [x] Backend `server.py` updated with dotenv loading
- [x] Telegram webhook set and verified
- [x] MongoDB connected
- [x] All services running (FastAPI, Node.js, React)
- [x] AutoPromo system initialized (12 scheduled jobs)

## User Personas
- **Bot Admin**: Manages bot settings, views analytics, broadcasts messages
- **Bot Users**: Telegram users who shorten URLs, buy domains, purchase leads, manage wallets
- **Resellers**: Users who resell bot services

## Backlog
- P0: End-to-end Telegram bot flow testing
- P1: Enhanced admin dashboard with real-time analytics
- P2: Payment flow verification (crypto + bank)
- P2: Domain purchase and DNS management testing

## Next Tasks
1. Test Telegram bot commands via Telegram
2. Verify webhook message processing
3. Test specific business flows (URL shortening, domains, leads, wallet)
