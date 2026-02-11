# Nomadly Telegram Bot - PRD

## Original Problem Statement
Set up and maintain a Node.js Telegram bot for link shortening, domain registration, DNS management, hosting, and crypto payments (DynoPay).

## Architecture
- **Runtime:** Node.js/Express.js (single monolithic app)
- **Entry:** `js/start-bot.js` → `js/_index.js`
- **Database:** MongoDB (Railway)
- **Bot Framework:** `node-telegram-bot-api` with webhook mode
- **Port:** 3000 (from .env PORT)
- **Webhook:** `{SELF_URL}/telegram/webhook`

## Core Features
1. URL Shortening (Bitly, Cuttly, Custom domains)
2. Domain Registration (ConnectReseller API)
3. DNS Management (Add/Update/Delete A, CNAME, NS records)
4. Crypto Payments (DynoPay)
5. Hosting Plans (cPanel via NAMEWORD API)
6. Phone Number Validation
7. SMS Broadcasting

## What's Been Implemented
- **Feb 2026:** Environment setup, webhook config, DynoPay fixes (field mapping, webhook_url, min $1), min deposit $6→$10, re-enabled core features (removed redirect messages from 22 locations), domain search progress message, DNS management analysis
- **Feb 11, 2026:** Webhook re-registered for new pod URL, full DNS management analysis and verification

## DNS Management System
All ConnectReseller API endpoints verified working:
- ViewDomain, ViewDNSRecord, ManageDNSRecords
- AddDNSRecord, ModifyDNSRecord, DeleteDNSRecord
- UpdateNameServer, checkDomainPrice, SearchDomainList, Order

## Known Issues
- **NAMEWORD API** (`http://34.44.198.68/api/v1`) unreachable - affects hosting plan domain flow only, not direct domain purchase
- **DynoPay getSupportedCurrency** endpoint defunct, replaced with hardcoded list
- **DynoPay getCryptoTransaction/getSingleTransaction** endpoints untested

## Backlog
- P2: Refactor monolithic `_index.js` (~5000+ lines) into modules
- P2: Verify untested DynoPay tracking endpoints
- P2: NAMEWORD API connectivity investigation
