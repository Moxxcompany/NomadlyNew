# NomadlyBot - PRD & Status

## Original Problem Statement
Setup NomadlyBot codebase, fix keyboard state issues, update auto-promo messaging consistency, implement auto-cleanup.

## Architecture
- **Frontend**: React 18 admin dashboard (port 3000)
- **Backend**: FastAPI (port 8001) reverse proxy to Node.js Express (port 5000)
- **Node.js App** (`/app/js/`): Telegram bot with REST APIs
- **Database**: MongoDB (Railway)

## What's Been Implemented

### Session 1: Setup
- [x] Installed Node.js dependencies, created root .env, all services online

### Session 2: Keyboard Reset & Cleanup
- [x] Synced config.js userKeyboard with language files
- [x] Fixed fallback handler to reset state + show fresh keyboard
- [x] Added /refresh command and admin reset endpoints
- [x] Reset 1,522 stale states, broadcast new keyboard to 2,064 users

### Session 3: Auto-Promo Consistency & Auto-Cleanup
- [x] **Updated SERVICE_CONTEXT crossPromo**: All 3 themes now say "@hostbay_bot for RDP, VPS and cPanel/Plesk hosting" (removed country domain references)
- [x] **Updated all 60 static promo messages** (4 languages x 3 themes x 5 variations):
  - EN: Country domains (.ng .za .ke .gh) promoted as THIS bot's feature in domain promos
  - FR: Same treatment in French
  - ZH: Same treatment in Chinese
  - HI: Same treatment in Hindi
  - @hostbay_bot now ONLY mentioned for RDP/VPS/hosting across all messages
- [x] **Scheduled auto-cleanup**: Runs every 6h, resets user states idle >24h
  - Cleanup function added to startup
  - db.js `set()` now tracks `lastUpdated` timestamp on action changes
  - Handles legacy entries without timestamps

## Key Admin Endpoints
- `GET /api/admin/reset-states?key={first 16 chars of SESSION_SECRET}` — Quick state reset
- `GET /api/admin/reset-keyboards?key={first 16 chars of SESSION_SECRET}` — Reset + broadcast

## Current Status
- All services: Running
- Telegram Bot: Active (webhook verified)
- Auto-promo: 12 scheduled jobs, consistent messaging
- State cleanup: Running every 6h

## Prioritized Backlog
### P0
- Whitelist server IP in ConnectReseller API

### P1
- Monitor promo delivery stats via promoStats collection
- Add admin dashboard metrics

### P2
- Add AI-powered promo A/B testing
- Enhance admin panel with live analytics
