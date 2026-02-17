# NomadlyBot - Telegram Bot

## Overview
NomadlyBot is a Telegram bot for domain registration, hosting, URL shortening, and telecom services.

## Core Architecture
- **Runtime**: Node.js
- **Database**: MongoDB
- **Interface**: Telegram Bot API
- **Proxy**: FastAPI (starts Node.js bot as child process)

## Domain Registration System

### Registrars
1. **ConnectReseller** (Primary) - Original registrar
2. **OpenProvider** (Fallback) - Fallback when CR unavailable/doesn't support TLD

### DNS Management
1. **ConnectReseller DNS** - Default for CR-registered domains with provider_default NS
2. **OpenProvider DNS** - For OP-registered domains via OP DNS zone API (CRUD)
3. **Cloudflare DNS** - Optional, user-selectable during purchase (only when shortener=No)

### Nameserver Options (only when shortener=No)
1. **Provider Default** - Uses registrar's default nameservers
2. **Cloudflare** - Creates CF zone, uses CF nameservers, DNS managed via CF API
3. **Custom Nameservers** - User provides own NS, updated post-registration

### Domain Purchase Flow
1. User enters domain name
2. System checks ConnectReseller first, falls back to OpenProvider
3. Price shown immediately after availability check
4. User asked to use domain with URL shortener (Yes/No) with price displayed
5. **If Yes**: Skip NS selection, auto-set provider_default, go to payment
6. **If No**: Show NS selection (Standard DNS / Cloudflare DNS / Custom DNS) -> payment
7. Payment screen shows Apply Coupon button inline (merged into payment)
8. Domain registration via appropriate registrar
9. Post-registration: NS update, Railway/Render linking (if shortener=Yes)

### Alternative TLD Suggestions
- When a domain is unavailable, the bot searches and suggests alternative TLDs
- Checks .com, .net, .org, .io, .co, .de, .fr, .it, .xyz, .sbs, .app, .dev

### URL Shortener Linking
- Shortener=Yes forces provider_default NS for reliable Railway CNAME linking
- DNS record creation routes through unified domain-service

### Country-Specific TLD Support
.us, .ca, .it, .sg, .eu, .fr, .es, .de, .nl, .be, .uk, .co.uk, .au, .nz, .in, .br, .cl, .mx

## Key Files
- `/app/js/_index.js` - Main bot logic
- `/app/js/config.js` - Bot configuration & keyboards
- `/app/js/db.js` - Database layer (get/set/del functions)
- `/app/js/op-service.js` - OpenProvider integration
- `/app/js/cf-service.js` - Cloudflare integration
- `/app/js/domain-service.js` - Unified domain orchestrator
- `/app/js/cr-*.js` - ConnectReseller services
- `/app/backend/server.py` - FastAPI proxy that starts Node.js bot
- `/app/backend/tests/test_telegram_webhook.py` - Regression tests

## What's Been Implemented

### Phase 1: Core Features (Feb 2026)
- [x] OpenProvider service: auth, domain check, pricing, registration, DNS zone CRUD, country TLDs
- [x] Cloudflare service: zone mgmt, DNS CRUD, nameserver fetching, default DNS records
- [x] Unified domain service: CR->OP fallback, metadata storage, DNS routing, post-reg NS update
- [x] 3 nameserver options (only shown when shortener=No): Provider Default, Cloudflare, Custom
- [x] Shortener=Yes skips NS selection, uses provider_default for reliable Railway CNAME
- [x] Custom NS entry flow with validation (min 2 NS, hostname format check)
- [x] URL shortener works for OP domains (routes DNS add to OP API)
- [x] DNS management routes to correct API based on stored domain metadata
- [x] No registrar names shown in user-facing messages
- [x] SUPPORT_USERNAME bug fix for Offshore Hosting
- [x] All credentials configured in .env
- [x] Webhook fixed with /api prefix + SELF_URL_PROD override

### Phase 2: UX Enhancements (Feb 2026)
- [x] Show price immediately after domain availability check
- [x] Merge coupon step into payment screen (Apply Coupon button)
- [x] Suggest alternative TLDs when domain is unavailable
- [x] Show price on shortener question
- [x] Simplify nameserver button labels (Standard DNS, Cloudflare DNS, Custom DNS)
- [x] Fix duplicate Back button in NS selection keyboard
- [x] State management verified working (top-level fields in MongoDB, get function returns full doc)

## Database Schema
- `state` collection: User session data stored as top-level fields (action, domain, price, registrar, nsChoice, etc.)
- `domainsOf` collection: registrar, nameserverType, cfZoneId, opDomainId, customNS, registeredAt
- `walletOf`, `linksOf`, `payments`, etc.: Standard bot data collections

## Integrations
- ConnectReseller API (existing)
- OpenProvider API (v1beta): auth, domains, customers, dns/zones
- Cloudflare API (v4): zones, dns_records
- Telegram Bot API
- Fincra (payments), Blockbee (crypto), Railway/Render (URL shortener hosting)

## Testing
- 19/19 webhook simulation tests passed (Feb 2026)
- Test file: `/app/backend/tests/test_telegram_webhook.py`
- Test reports: `/app/test_reports/iteration_14.json`

## Backlog
- P2: Enhanced analytics dashboard for domain portfolio
- P2: Auto-renewal management across registrars
- P2: Bulk domain operations
