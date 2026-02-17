# NomadlyBot - PRD & Status

## Original Problem Statement
Setup and analyze the existing NomadlyBot codebase. Fix keyboard state issues for existing users.

## Architecture
- **Frontend**: React 18 admin dashboard (port 3000) showing bot status, service health, and feature overview
- **Backend**: FastAPI (port 8001) acting as a reverse proxy to a Node.js Express server (port 5000)
- **Node.js App** (`/app/js/`): Telegram bot with Express REST APIs — the core business logic
- **Database**: MongoDB (hosted on Railway at `caboose.proxy.rlwy.net:59668`)

## Core Services (Node.js Bot)
1. URL Shortener — Bit.ly and custom domain shortening with analytics
2. Domain Names — Buy, manage DNS (ConnectReseller + Cloudflare)
3. Phone Leads — Buy verified leads, validate bulk phone numbers
4. Wallet System — USD & NGN deposits via crypto and bank
5. Web Hosting — cPanel & Plesk plans with free trials
6. VPS Plans — Virtual private servers on demand
7. Subscription Plans — Daily/Weekly/Monthly plans with coupons
8. Multi-language — EN, FR, ZH, HI translation system

## What's Been Implemented

### Session 1: Setup (Jan 2026)
- [x] Installed Node.js dependencies (`npm install`)
- [x] Created root `.env` with full production config
- [x] All services online: Frontend, Backend, Node.js Express, MongoDB, Telegram bot

### Session 2: Keyboard Reset & Cleanup (Jan 2026)
- [x] **Synced config.js `userKeyboard`** with language file keyboards (removed drift — was missing `domainNames` row)
- [x] **Fixed fallback handler**: Changed from `t.unknownCommand` to state-reset + fresh keyboard display. Old button taps now cleanly reset users to main menu.
- [x] **Added `/refresh` command**: Users can type `/refresh` to force-get the new keyboard
- [x] **Added admin endpoints**:
  - `GET /admin/reset-states?key=XXX` — Quick DB reset of all stale user action states
  - `GET /admin/reset-keyboards?key=XXX` — Full reset + broadcast new keyboard to all users
- [x] **Executed state reset**: Cleared 1,522 stale user states
- [x] **Broadcast new keyboard**: Sent to 2,064 active users (1,378 blocked/inactive skipped)

## Admin Endpoints
- `GET /api/admin/reset-states?key={first 16 chars of SESSION_SECRET}` — Reset states only
- `GET /api/admin/reset-keyboards?key={first 16 chars of SESSION_SECRET}` — Reset + broadcast

## Current Status
- **Frontend**: Running
- **Backend (FastAPI)**: Running
- **Node.js Express**: Running
- **Telegram Bot**: Active (webhook verified)
- **MongoDB**: Connected
- **All user states**: Reset to 'none'
- **New keyboards**: Broadcast to 2,064 active users

## Prioritized Backlog
### P0 (Critical)
- Whitelist server IP in ConnectReseller API

### P1 (Important)
- Configure payment provider keys as needed
- Monitor Telegram API rate limits during broadcasts

### P2 (Nice to have)
- Enhance admin dashboard with live data
- Add admin panel authentication
