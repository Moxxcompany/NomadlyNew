# PRD - Telegram Bot (tg-bot-link-shorten)

## Original Problem Statement
Setup and install needed dependencies after analyzing codebase.

## Architecture
- **Runtime**: Node.js v20 (single process)
- **Entry Point**: `js/start-bot.js` → `js/_index.js`
- **Database**: MongoDB (via `mongodb` driver v5)
- **Bot Framework**: `node-telegram-bot-api` (webhook mode)
- **Web Server**: Express.js (REST APIs for payment callbacks, health checks)
- **Deployment Targets**: Railway, Replit, Nixpacks

## Core Features
- Telegram bot with multi-language support (EN/FR/ZH/HI)
- URL shortening (Bitly, Cuttly, custom domain)
- Domain name purchasing (Connect Reseller API)
- DNS management (A, CNAME, NS records)
- Phone number leads (buy + validate bulk numbers)
- Crypto payments (BlockBee, DynoPay)
- Bank/card payments (Fincra)
- Wallet system (USD + NGN)
- cPanel/Plesk hosting plans
- VPS instance management (Nameword API)
- Auto-promo system (AI-powered via OpenAI)
- Admin broadcast messaging

## Key Integrations
- Telegram Bot API
- MongoDB
- Connect Reseller (domains)
- BlockBee / DynoPay (crypto payments)
- Fincra (bank payments)
- Twilio / AWS Pinpoint / SignalWire (phone validation)
- OpenAI (auto-promo)
- Bitly / Cuttly (URL shortening)
- Nodemailer (emails)
- Nameword (VPS management)

## What's Been Implemented (Jan 2026)
- [x] Analyzed full codebase (41 JS source files, 4 language files, hosting module)
- [x] Installed all 21 npm dependencies + `validator` (438 packages total)
- [x] Created `.env` file with all 110 environment variables
- [x] Verified all 28 core modules load successfully
- [x] Node.js v20.20.0 environment confirmed

## Critical Environment Variables (Must Be Set)
- `MONGO_URL` - MongoDB connection string
- `TELEGRAM_BOT_TOKEN` - Telegram Bot API token
- `TELEGRAM_BOT_ON` - Set to `true` to enable bot

## Backlog / Next Steps
- P0: User to provide MONGO_URL and TELEGRAM_BOT_TOKEN to start bot
- P1: Run the bot and test end-to-end flows
- P2: Address npm audit vulnerabilities (23 total)
- P2: Fix `validatePhoneAlcazar.js` undefined carrier edge case
