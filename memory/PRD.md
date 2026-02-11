# PRD - Telegram Bot Link Shortener (NomadlyBot)

## Original Problem Statement
Setup and install needed dependencies and analyze code if needed.

## Architecture
- **Backend**: Python FastAPI proxy (`server.py`) on port 8001 that spawns a Node.js Express server on port 5000
- **Node.js App**: Telegram bot built with `node-telegram-bot-api`, Express server, MongoDB
- **Database**: MongoDB (via `mongodb` npm driver and `pymongo` Python driver)
- **Deployment**: Railway-ready with `nixpacks.toml`

## Core Features
1. **URL Shortening** — Bitly and custom domain shortener (ap1s.net)
2. **Domain Name Sales** — Buy/manage domains via Connect Reseller API
3. **DNS Management** — Add/update/delete DNS records
4. **Phone Number Leads** — Buy/validate phone leads (Twilio, AWS Pinpoint, Neutrino, SignalWire)
5. **Web Hosting Plans** — cPanel/Plesk hosting with free trials
6. **VPS Management** — Create, manage, upgrade VPS instances
7. **Wallet System** — USD/NGN balances, crypto deposits (BlockBee/DynoPay), bank payments (Fincra)
8. **Subscription Plans** — Daily/Weekly/Monthly with coupon codes
9. **Multi-language Support** — Translation system
10. **Auto-Promo System** — Scheduled promotional messages

## User Personas
- **End Users**: Telegram users who need URL shortening, domain purchases, hosting, and phone leads
- **Admin**: Bot operator who manages users, analytics, broadcasts, and billing
- **Resellers**: Partners who earn commission on sales

## What's Been Implemented
- [2026-02-11] Initial setup: Node.js dependencies installed (438 packages), Python dependencies verified, root `.env` created, backend proxy and Node.js server both running, MongoDB connected

## Prioritized Backlog
- P0: Configure TELEGRAM_BOT_TOKEN to enable Telegram bot
- P0: Whitelist server IP in Connect Reseller for domain features
- P1: Configure payment API keys (BlockBee, Fincra, DynoPay)
- P1: Configure Bitly API key for URL shortening
- P2: Set up production SELF_URL for webhooks
- P2: Web admin dashboard for analytics

## Next Tasks
- Enable Telegram bot with token
- Test end-to-end bot flows
- Configure external API integrations
