# PRD - Telegram Bot (tg-bot-link-shorten)

## Overview
A Telegram bot application for URL shortening, domain name purchasing, phone number lead generation/validation, web hosting (cPanel/Plesk), VPS management, and crypto/bank payments.

## Architecture
- **Runtime**: Node.js v20
- **Entry point**: `js/start-bot.js` -> `js/_index.js`
- **Database**: MongoDB (via `mongodb` driver)
- **Bot Framework**: `node-telegram-bot-api`
- **Key integrations**: Blockbee (crypto), Fincra (bank payments), DynoPay, Connect Reseller (domains), Twilio, AWS Pinpoint, WhatsApp Web

## Tech Stack
- Node.js, Express, MongoDB, Telegram Bot API
- Payment: Blockbee crypto, Fincra NGN, DynoPay
- Domain: Connect Reseller API
- Phone validation: Twilio, AWS Pinpoint, Alcazar, Neutrino, NPL, Signalwire
- Multi-language: EN, FR, HI, ZH

## What's Been Implemented
- [Jan 2026] Analyzed full codebase and installed all dependencies
  - Core packages from package.json (16 packages)
  - Missing packages installed: @aws-sdk/client-pinpoint, twilio, qrcode-terminal, whatsapp-web.js
  - All 44 JS files pass syntax validation
- [Jan 2026] Created `.env` with 90+ environment variables
  - Updated SELF_URL and SELF_URL_PROD to Emergent pod URL
  - Added TELEGRAM_BOT_TOKEN (base key for config-setup.js)
  - All critical env vars verified loading correctly

## Core Requirements
- Bot needs valid `MONGO_URL` and `TELEGRAM_BOT_TOKEN` env vars to run
- `SELF_URL` must point to the live server for webhooks
- Supports dual-environment config (dev/prod) via `config-setup.js`

## Backlog / Next Steps
- P0: Start the bot (`npm start`) and verify MongoDB connectivity
- P1: Set up Telegram webhook at SELF_URL/telegram/webhook
- P2: Security audit (npm vulnerabilities)
- P2: Update deprecated packages
