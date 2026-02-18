# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
User requested: "setup" - analyze code and set up the existing codebase.

## Application Overview
**NomadlyBot** is a Telegram bot platform for URL shortening, domain registration, phone lead generation, crypto payments, and web hosting management. It includes:

## Architecture
- **Frontend**: React 18 dashboard (port 3000) - Admin panel showing bot status, DB connectivity, and feature overview
- **Backend**: FastAPI (port 8001) - Acts as a reverse proxy, spawning a Node.js process and forwarding all requests
- **Node.js Bot Engine**: Express server (port 5000) - Core Telegram bot with full business logic
- **Database**: MongoDB (Railway-hosted) - Stores user state, wallets, domains, leads, payments, etc.

## Tech Stack
- React 18 + Tailwind CSS + Craco (frontend)
- FastAPI + Python (backend proxy)
- Node.js + Express + node-telegram-bot-api (bot engine)
- MongoDB (database)
- Various integrations: BlockBee (crypto), Fincra (bank payments), Connect Reseller (domains), Twilio, OpenAI

## Core Features
1. **URL Shortener** - Bit.ly and custom domain shortening with analytics
2. **Domain Names** - Purchase, DNS management via Connect Reseller API
3. **Phone Leads** - Targeted leads by area code, carrier filtering, CNAM lookup
4. **Wallet System** - USD & NGN deposits via crypto (BlockBee) and bank (Fincra)
5. **Web Hosting** - cPanel & Plesk plans with free trials
6. **VPS Plans** - Virtual private servers on demand
7. **Subscription Plans** - Daily/Weekly/Monthly with free domains and validations

## What's Been Implemented (Setup - Jan 2026)
- Installed Node.js dependencies (`npm install`)
- Created root `.env` with MONGO_URL, DB_NAME, and essential config
- Set TELEGRAM_BOT_ON=false (no live bot token provided)
- All services running: Frontend (3000), Backend/Proxy (8001), Node.js Express (5000)
- Health check passing: Bot Running, DB Connected, REST APIs Active
- Frontend dashboard loading correctly

## Current Status
- All services: RUNNING
- Database: CONNECTED
- Telegram Bot: DISABLED (no real token)
- Express REST API: ACTIVE

## Next Action Items
- P0: Provide real TELEGRAM_BOT_TOKEN to enable live bot functionality
- P0: Add Connect Reseller API credentials for domain operations
- P1: Configure BlockBee/DynoPay API keys for crypto payments
- P1: Set up Fincra credentials for bank payments
- P2: Configure email (SMTP) for sending hosting credentials
- P2: Set real admin chat IDs (TELEGRAM_ADMIN_CHAT_ID, TELEGRAM_DEV_CHAT_ID)

## Backlog
- P2: Enhanced admin dashboard with real-time analytics
- P3: Add user management UI to frontend
- P3: Payment history and transaction logs in dashboard
