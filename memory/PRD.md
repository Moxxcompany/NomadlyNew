# NomadlyBot - Product Requirements Document

## Original Problem Statement
Analyze codebase, set up, audit recent subscription feature commits, and fix all identified gaps.

## Architecture Overview
Multi-service Telegram bot with admin dashboard:
- **Node.js Bot** (`/app/js/`) — Core business logic on Express (port 5000)
- **FastAPI Proxy** (`/app/backend/server.py`) — Routes to Node.js (port 8001)
- **React Dashboard** (`/app/frontend/`) — Admin status UI (port 3000)
- **MongoDB** — Primary database

### Core Bot Features
URL Shortening, Domain Sales (.sbs/.xyz free with plans), Phone Leads (buy/validate), Wallet System (USD/NGN via crypto + bank), Web Hosting, VPS Management, Multi-language (en/fr/zh/hi), Subscription Plans (Daily/Weekly/Monthly), Auto-Promo, Broadcast.

## What's Been Implemented

### Session 1: Setup & Initial Fixes (Feb 2026)
- Installed npm dependencies, created root `.env`
- Fixed `DAILY_PLAN_FREE_VALIDATIONS` undefined in all 4 lang files

### Session 2: Subscription Feature Audit (Feb 2026)
- Audited subscription feature implementation across entire codebase
- Confirmed correct: validation counts (5K/10K/15K), `.xyz` in free domain logic, subscription messages in 4 langs, promo messages

### Session 3: Gap Fixes (Feb 2026)

**GAP 1 — Promo messages missing .xyz (6 places fixed)**
- `auto-promo.js`: SERVICE_CONTEXT, EN/FR/ZH/HI domain promo messages all now say `.sbs/.xyz`

**GAP 2 — Partial free validations not handled (new feature)**
- Added `usePartialFreeValidation` goto in `_index.js`
- When user has < requested free validations: uses free portion, charges wallet for remainder
- `_checkFreeValidation()` now returns `'full'`, `'partial'`, or `false`
- Added `partialFreeValidation` translation message in all 4 lang files
- Wallet payment handler logs both free + paid portions separately

**GAP 3 — Wallet race condition (19 operations fixed)**
- Added `atomicIncrement()` in `db.js` using MongoDB `$inc` operator
- Replaced all 19 read-modify-write wallet operations with atomic increments
- Also fixed `addFundsTo` to use atomic increment
- Cleaned up 9 unused `wallet` variable reads

**GAP 4 — /open-api-key endpoint security**
- Added `x-api-auth` header / `auth` query param check
- Uses `APP_OPEN_API_AUTH` or `TELEGRAM_BOT_TOKEN` as auth secret
- Returns 401 Unauthorized without valid credentials

**Also fixed in Session 2:**
- `config.js` `planSubscribed` text — updated to mention .sbs/.xyz + validations
- `config.js` `welcomeFreeTrial` text — updated
- `zh.js` `availablefreeDomain` — fixed missing .xyz

## Prioritized Backlog

### P0 (Critical)
- Provide `TELEGRAM_BOT_TOKEN` to enable Telegram bot
- Set `SELF_URL` for webhook functionality

### P1 (Important)
- Add dashboard auth
- Add real-time bot metrics/analytics
- Test partial free validation flow end-to-end with live bot

### P2 (Nice to Have)
- Dashboard: recent transactions, user stats
- Logging/monitoring infrastructure
- Rate limiting on public endpoints
