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
2. **OpenProvider** (Fallback) - Added Feb 2026 as fallback when CR unavailable

### DNS Management
1. **ConnectReseller DNS** - Default for CR-registered domains
2. **Cloudflare DNS** - Optional, user-selectable during purchase
3. **OpenProvider DNS** - For OP-registered domains (via nameservers)

### Domain Purchase Flow
1. User enters domain name
2. System checks ConnectReseller first, falls back to OpenProvider
3. User selects nameservers: "Provider Default" or "Cloudflare"
4. Payment processing
5. Domain registration via appropriate registrar
6. DNS records set up based on nameserver choice

## Key Files
- `/app/js/_index.js` - Main bot logic
- `/app/js/config.js` - Bot configuration & keyboards
- `/app/js/op-service.js` - OpenProvider integration
- `/app/js/cf-service.js` - Cloudflare integration
- `/app/js/domain-service.js` - Unified domain orchestrator
- `/app/js/cr-*.js` - ConnectReseller services

## What's Been Implemented (Feb 2026)
- [x] OpenProvider service (auth, domain check, pricing, registration, DNS, country TLDs)
- [x] Cloudflare service (zone mgmt, DNS CRUD, nameserver fetching)
- [x] Unified domain service (CR→OP fallback, metadata storage, DNS routing)
- [x] Nameserver selection in domain purchase flow
- [x] DNS management routing (CR/OP/Cloudflare based on domain metadata)
- [x] All credentials configured in .env
- [x] Testing: 15/15 backend tests passed

## Database Schema Enhancement
- `domainsOf` collection: Added fields `registrar`, `nameserverType`, `cfZoneId`, `opDomainId`, `registeredAt`

## Integrations
- ConnectReseller API (existing)
- OpenProvider API (v1beta) - auth, domains, customers
- Cloudflare API (v4) - zones, dns_records
- Telegram Bot API
- Fincra (payments)
- Blockbee (crypto payments)

## Backlog
- P2: Enhanced analytics dashboard for domain portfolio
- P2: Auto-renewal management across registrars
- P2: Bulk domain operations
