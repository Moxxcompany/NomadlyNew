# NomadlyBot - Project Requirements Document

## Original Problem Statement
Setup repo, configure environment, verify RapidAPI URL shortener integration, rebrand "Ap1s.net" to "Shortit", include Shortit in subscription plans, update bot UI keyboard and promo ads.

## Architecture
- **Node.js Backend**: Telegram bot + Express REST API server (`/app/js/`)
- **FastAPI Proxy**: Python proxy (`/app/backend/server.py`) that starts Node.js bot as subprocess, proxies requests to port 5000
- **React Frontend**: Admin dashboard (`/app/frontend/`)
- **MongoDB**: External database

## Tech Stack
Node.js (Express), Python (FastAPI), React 18, MongoDB, Telegram Bot API, RapidAPI URL Shortener42

## What's Been Implemented

### 2026-02-14: Initial Setup
- Installed Node.js deps, created root `.env` with full config, all services running

### 2026-02-14: .env Update
- Updated root `.env` with all 90+ production environment variables
- Set `SELF_URL` and `SELF_URL_PROD` to pod URL
- Enabled Telegram bot (`TELEGRAM_BOT_ON=true`)

### 2026-02-14: Shortit Rebranding & Subscription Integration
- **Verified** RapidAPI URL Shortener42 integration working (returns short URLs, redirects work)
- **Renamed** "Ap1s.net (Free)" → "Shortit (Free)" across all 4 languages (EN/FR/ZH/HI) + config.js
- **Fixed keyboard**: `k.redSelectProvider` now shows BOTH options (Bit.ly + Shortit) — previously only showed Bit.ly, hiding the free option
- **Updated subscription text** (`chooseSubscription`): All plans now mention "unlimited Shortit links" in all 4 languages
- **Updated `planSubscribed`**: Success message now mentions "unlimited Shortit links" in all 4 languages
- **Updated `welcomeFreeTrial`**: Now mentions "Shortit" by name in all 4 languages
- **Updated auto-promo ads**: All shortener promos now reference "Shortit" across EN/FR/ZH/HI

### Files Modified
- `/app/.env` - Full production config
- `/app/js/config.js` - redSelectProvider label + keyboard
- `/app/js/lang/en.js` - Labels, subscription, planSubscribed, welcomeFreeTrial
- `/app/js/lang/fr.js` - Same
- `/app/js/lang/zh.js` - Same
- `/app/js/lang/hi.js` - Same
- `/app/js/auto-promo.js` - Shortit branding in all promo ads

## Prioritized Backlog
### P0
- None

### P1
- Migrate `customCuttly.js` (custom back-half links) from legacy Cutt.ly API to RapidAPI
- Configure Connect Reseller API IP whitelist

### P2
- Enhanced admin dashboard with analytics
- Payment gateway testing (BlockBee, Fincra, DynoPay)

## Next Tasks
- Test bot flow end-to-end via Telegram to confirm keyboard shows "Shortit (Free)" and "Bit.ly $10"
- Migrate custom short URL feature to RapidAPI if legacy Cutt.ly API is deprecated
