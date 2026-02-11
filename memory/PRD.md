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
  - Core packages: axios, mongodb, express, node-telegram-bot-api, nanoid, dotenv, etc.
  - Missing packages installed: @aws-sdk/client-pinpoint, twilio, qrcode-terminal, whatsapp-web.js
  - All 44 JS files pass syntax validation

## Core Requirements
- Bot needs valid `MONGO_URL` and `TELEGRAM_BOT_TOKEN` env vars to run
- `.env` file must be configured with appropriate secrets
- Supports dual-environment config (dev/prod) via `config-setup.js`

## Backlog / Next Steps
- P0: Configure `.env` file with required credentials (MONGO_URL, TELEGRAM_BOT_TOKEN)
- P1: Test bot startup with valid credentials
- P2: Security audit (25 npm vulnerabilities flagged)
- P2: Update deprecated packages (request, fstream, rimraf)
