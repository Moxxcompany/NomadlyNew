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
3. User asked to use domain with URL shortener (Yes/No)
4. **If Yes**: Skip NS selection, auto-set provider_default, go to coupon/payment
5. **If No**: Show NS selection (Provider Default / Cloudflare / Custom) → coupon/payment
6. Domain registration via appropriate registrar
7. Post-registration: NS update (for custom/cloudflare on CR), Railway/Render linking (if shortener=Yes)

### URL Shortener Linking
- Shortener=Yes forces provider_default NS for reliable Railway CNAME linking
- DNS record creation routes through unified domain-service:
  - CR + provider_default: uses CR saveServerInDomain
  - OP + provider_default: uses OP addDNSRecord (DNS zone API)

### Country-Specific TLD Support
.us, .ca, .it, .sg, .eu, .fr, .es, .de, .nl, .be, .uk, .co.uk, .au, .nz, .in, .br, .cl, .mx

## Key Files
- `/app/js/_index.js` - Main bot logic
- `/app/js/config.js` - Bot configuration & keyboards
- `/app/js/op-service.js` - OpenProvider integration (12 exports)
- `/app/js/cf-service.js` - Cloudflare integration (10 exports)
- `/app/js/domain-service.js` - Unified domain orchestrator (8 exports)
- `/app/js/cr-*.js` - ConnectReseller services

## What's Been Implemented (Feb 2026)
- [x] OpenProvider service: auth, domain check, pricing, registration, DNS zone CRUD, country TLDs
- [x] Cloudflare service: zone mgmt, DNS CRUD, nameserver fetching, default DNS records
- [x] Unified domain service: CR->OP fallback, metadata storage, DNS routing, post-reg NS update
- [x] 3 nameserver options (only shown when shortener=No): Provider Default, Cloudflare, Custom
- [x] Shortener=Yes skips NS selection, uses provider_default for reliable Railway CNAME
- [x] Custom NS entry flow with validation (min 2 NS, hostname format check)
- [x] URL shortener works for OP domains (routes DNS add to OP API)
- [x] DNS management routes to correct API based on stored domain metadata
- [x] No registrar names (OpenProvider/ConnectReseller) shown in user-facing messages
- [x] SUPPORT_USERNAME bug fix for Offshore Hosting
- [x] All credentials configured in .env, SELF_URL set to pod URL
- [x] Webhook fixed with /api prefix + SELF_URL_PROD override
- [x] E2E tested: 22/22 human-like tests passed

## Database Schema Enhancement
- `domainsOf` collection fields: `registrar`, `nameserverType`, `cfZoneId`, `opDomainId`, `customNS`, `registeredAt`

## Integrations
- ConnectReseller API (existing)
- OpenProvider API (v1beta): auth, domains, customers, dns/zones
- Cloudflare API (v4): zones, dns_records
- Telegram Bot API
- Fincra (payments), Blockbee (crypto), Railway/Render (URL shortener hosting)

## Backlog
- P2: Enhanced analytics dashboard for domain portfolio
- P2: Auto-renewal management across registrars
- P2: Bulk domain operations
