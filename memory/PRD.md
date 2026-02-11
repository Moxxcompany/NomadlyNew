# PRD - Telegram Bot Link Shortener (NomadlyBot)

## Original Problem Statement
Setup and install needed dependencies and analyze code if needed. Then optimize Railway resource usage.

## Architecture
- **Backend**: Python FastAPI proxy (`server.py`) on port 8001 that spawns a Node.js Express server on port 5000
- **Node.js App**: Telegram bot built with `node-telegram-bot-api`, Express server, MongoDB
- **Database**: MongoDB (via `mongodb` npm driver and `pymongo` Python driver)
- **Deployment**: Railway-ready with `nixpacks.toml`

## Core Features
1. URL Shortening (Bitly + custom domain)
2. Domain Name Sales (Connect Reseller API)
3. DNS Management
4. Phone Number Leads (buy/validate)
5. Web Hosting Plans (cPanel/Plesk + free trials)
6. VPS Management
7. Wallet System (USD/NGN, crypto, bank)
8. Subscription Plans (Daily/Weekly/Monthly)
9. Multi-language Support
10. Auto-Promo System (AI-powered + static)

## What's Been Implemented
- [2026-02-11] Initial setup: Node.js + Python dependencies installed, environment configured, services running
- [2026-02-11] Railway usage optimizations:
  - Removed unused `whatsapp-web.js` (+ puppeteer-core, chromium-bidi, fluent-ffmpeg transitive deps) — saved ~84MB disk, 94 packages removed
  - Removed unused `@aws-sdk/client-pinpoint` — saved ~11MB disk
  - Changed two `* * * * *` cron jobs to `*/5 * * * *` — 5x fewer MongoDB queries
  - Disabled auto-promo system (12 cron jobs + OpenAI calls) when Telegram bot is off
  - Throttled Connect Reseller IP check from every-message to once-per-hour
  - Reduced MongoDB pool (10→5 connections, heartbeat 10s→30s, idle timeout 30s→60s)

## Prioritized Backlog
- P0: Configure TELEGRAM_BOT_TOKEN to enable Telegram bot
- P0: Whitelist server IP in Connect Reseller for domain features
- P1: Configure payment API keys (BlockBee, Fincra, DynoPay)
- P1: Configure Bitly API key for URL shortening
- P2: Set up production SELF_URL for webhooks
- P2: Web admin dashboard for analytics

## Constraints
- Supervisor config is READONLY — cannot remove Python proxy layer (uvicorn required on port 8001)
- Frontend supervisor entry exists but no React app — expected FATAL status

## Next Tasks
- Enable Telegram bot with token
- Test end-to-end bot flows
- Configure external API integrations
