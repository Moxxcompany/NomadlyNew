# NomadlyBot - PRD & Architecture

## Original Problem Statement
Analyze and set up the existing NomadlyBot codebase — a Telegram bot platform for URL shortening, domain sales, phone leads, crypto payments, and web hosting.

## Architecture
- **Frontend**: React 18 admin dashboard (port 3000) showing bot health status
- **Backend**: FastAPI (port 8001) acting as a reverse proxy to Node.js Express server (port 5000)
- **Node.js Bot**: Telegram bot (`js/start-bot.js`) with Express REST APIs
- **Database**: MongoDB (Railway-hosted)

## Tech Stack
- React 18 + Tailwind CSS (frontend)
- FastAPI + Python (backend proxy)
- Node.js + Express (bot engine & REST APIs)
- MongoDB (data storage)
- Telegram Bot API

## Core Features
1. URL Shortening (Bit.ly, custom domain shortener)
2. Domain Name Registration & DNS Management
3. Phone Number Leads (buy & validate)
4. Wallet System (USD/NGN, crypto deposits)
5. Web Hosting (cPanel/Plesk plans, free trials)
6. VPS Plans management
7. Auto-promo system
8. Multi-language support

## What's Been Implemented (Setup - Feb 2026)
- Installed Node.js dependencies (`npm install`)
- Created root `.env` with MongoDB URL and service config
- Telegram bot set to `false` (no token provided)
- REST APIs enabled and running on port 5000
- All 3 services running: Frontend, Backend proxy, Node.js Express server
- Health endpoint confirms: proxy=running, node=running, db=connected

## Missing / Required from User
- **TELEGRAM_BOT_TOKEN** — Required to enable the Telegram bot
- Connect Reseller API whitelist (IP: 104.198.214.223)
- BlockBee crypto API keys (if crypto payments needed)
- Fincra API keys (if bank payments needed)

## Backlog (P0/P1/P2)
- P0: Provide Telegram Bot Token to activate bot functionality
- P1: Configure Connect Reseller API access
- P1: Set up payment provider API keys (BlockBee, Fincra, DynoPay)
- P2: Production deployment configuration
- P2: Admin dashboard enhancements (analytics, user management)
