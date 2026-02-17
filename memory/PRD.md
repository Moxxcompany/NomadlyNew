# NomadlyBot - PRD & Status

## Original Problem Statement
Setup and analyze the existing NomadlyBot codebase.

## Architecture
- **Frontend**: React 18 admin dashboard (port 3000) showing bot status, service health, and feature overview
- **Backend**: FastAPI (port 8001) acting as a reverse proxy to a Node.js Express server (port 5000)
- **Node.js App** (`/app/js/`): Telegram bot with Express REST APIs — the core business logic
- **Database**: MongoDB (hosted on Railway at `caboose.proxy.rlwy.net:59668`)

## Core Services (Node.js Bot)
1. **URL Shortener** — Bit.ly and custom domain shortening with analytics
2. **Domain Names** — Buy, manage DNS (ConnectReseller + Cloudflare)
3. **Phone Leads** — Buy verified leads, validate bulk phone numbers (SMS/Voice)
4. **Wallet System** — USD & NGN deposits via crypto (BlockBee/Dynopay) and bank (Fincra)
5. **Web Hosting** — cPanel & Plesk plans with free trials
6. **VPS Plans** — Virtual private servers on demand
7. **Subscription Plans** — Daily/Weekly/Monthly plans with coupons
8. **Multi-language** — Translation system for bot messages
9. **Auto Promo** — Automated promotional messaging
10. **Group Notifications** — Live event alerts to registered Telegram groups

## Tech Stack
- Frontend: React 18, Tailwind CSS, Craco
- Backend Proxy: Python FastAPI, httpx
- Core App: Node.js 20+, Express, MongoDB driver, node-telegram-bot-api
- Database: MongoDB 5.x
- Payments: BlockBee (crypto), Fincra (bank), Dynopay
- Domains: ConnectReseller API, Cloudflare DNS

## What's Been Implemented (Setup - Jan 2026)
- [x] Installed Node.js dependencies (`npm install`)
- [x] Created root `.env` file with MONGO_URL and service defaults
- [x] Node.js Express server running on port 5000 (Telegram bot disabled, REST APIs active)
- [x] FastAPI proxy running on port 8001
- [x] React frontend running on port 3000
- [x] MongoDB connected successfully
- [x] Health check passing: all systems online

## Current Status
- **Frontend**: ✅ Running
- **Backend (FastAPI)**: ✅ Running  
- **Node.js Express**: ✅ Running (REST APIs active)
- **Telegram Bot**: ⚠️ Disabled (no TELEGRAM_BOT_TOKEN configured)
- **MongoDB**: ✅ Connected
- **ConnectReseller**: ⚠️ IP needs whitelisting

## Prioritized Backlog
### P0 (Critical)
- Configure TELEGRAM_BOT_TOKEN to enable the Telegram bot
- Whitelist server IP in ConnectReseller API

### P1 (Important)
- Configure payment provider keys (BlockBee, Fincra, Dynopay)
- Set proper admin chat IDs (TELEGRAM_ADMIN_CHAT_ID, TELEGRAM_DEV_CHAT_ID)
- Configure SELF_URL for webhook support

### P2 (Nice to have)
- Enhance admin dashboard with live data from MongoDB
- Add analytics/charts to the React frontend
- Add authentication to admin panel
