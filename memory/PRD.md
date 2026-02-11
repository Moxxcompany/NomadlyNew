# PRD - Telegram Bot Link Shortener (Nomadly)

## Original Problem Statement
Setup and install needed dependencies for an existing Node.js Telegram bot project.

## Architecture
- **Runtime**: Node.js v20.20.0
- **Database**: MongoDB (via `mongodb` npm driver)
- **Bot Framework**: `node-telegram-bot-api`
- **HTTP Server**: Express.js (for webhooks, REST APIs, payment callbacks)
- **Key Integrations**: Telegram Bot API, BlockBee (crypto payments), Fincra (bank payments), DynoPay, Connect Reseller (domains), Bitly/Cuttly (URL shortening), Nodemailer (emails), Railway/Render (hosting)

## Core Features
- Telegram bot with URL shortening (Bitly, custom domains)
- Domain name purchase & DNS management (Connect Reseller)
- cPanel/Plesk hosting plans (Free Trial, Starter, Pro, Business)
- VPS instance management (create, stop, start, delete, upgrade, SSH keys)
- Phone number leads (buy/validate bulk leads)
- Wallet system (USD/NGN) with crypto & bank deposits
- Subscription plans (Daily, Weekly, Monthly)
- Multi-language support (EN, FR, HI, ZH)
- Admin tools (analytics, broadcast, user management)

## What's Been Implemented (Jan 2026)
- [x] Installed all 301 npm dependencies via `npm install`
- [x] Verified all 14 npm packages load correctly (axios, cors, dotenv, express, graphql, mongodb, nanoid, node-schedule, node-telegram-bot-api, nodemailer, qrcode, validator, etc.)
- [x] Verified all 7 core local modules load correctly
- [x] Created `.env` file with all 60+ required environment variables (placeholder values for secrets)
- [x] Config setup loads successfully with environment detection

## Next Action Items
- P0: Replace placeholder values in `.env` with real credentials (MONGO_URL, TELEGRAM_BOT_TOKEN are critical)
- P1: Test full bot startup with real MongoDB and Telegram token
- P2: Run `npm audit fix` to address 25 known vulnerabilities

## Backlog
- P2: Upgrade deprecated packages (request, request-promise, uuid@3)
- P2: Add `nodemon` as dev dependency for easier development
