# NomadlyBot - Telegram Bot Admin Panel

## Overview
Multi-service Telegram bot for URL shortening, domain sales, phone leads, crypto payments, and web hosting.

## Architecture
- **Frontend**: React (port 3000) - Admin dashboard displaying bot status, features
- **Backend**: FastAPI proxy (port 8001) → Node.js Express (port 5000)
- **Database**: MongoDB (external via MONGO_URL)
- **Bot**: Telegram Bot API (currently disabled, needs valid TELEGRAM_BOT_TOKEN)

## Tech Stack
- React 18 + Tailwind CSS (Frontend)
- FastAPI + httpx (Python proxy)
- Express.js + MongoDB driver (Node.js backend)
- node-telegram-bot-api (Telegram integration)

## Core Features
1. URL Shortener (Bit.ly, Custom domains, Shortit trial)
2. Domain Names (Buy, DNS management)
3. Phone Leads & Validation (SMS, Voice, Carrier filtering)
4. Wallet System (USD & NGN, Crypto, Bank deposits)
5. Web Hosting (cPanel, Plesk plans with trials)
6. VPS Plans (Virtual private servers)

## What's Been Implemented (Feb 14, 2026)
- [x] Installed Node.js dependencies
- [x] Created `/app/.env` with required environment variables
- [x] Fixed `config.js` missing PRICE_BITLY_LINK variable
- [x] Fixed `_index.js` startServer() hoisting issue
- [x] Backend proxy + Node.js server running
- [x] MongoDB connected
- [x] Frontend dashboard displaying live status

## Environment Variables Required
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - Database name (default: nomadly_bot)
- `TELEGRAM_BOT_TOKEN` - Telegram bot token (placeholder currently)
- `TELEGRAM_BOT_ON` - Enable/disable bot (currently: false)
- `REST_APIS_ON` - Enable REST APIs (currently: true)

## Next Action Items
- P0: Provide valid TELEGRAM_BOT_TOKEN to enable bot functionality
- P1: Configure webhook URL (SELF_URL) for production
- P2: Add Connect Reseller IP whitelist

## Backlog
- Add admin authentication to dashboard
- Add analytics charts
- Enable payment integrations (Fincra, Blockbee)
