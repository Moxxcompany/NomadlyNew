# Telegram Bot Application - PRD

## Original Problem Statement
A complex Telegram bot application for domain registration, offshore hosting (cPanel via HostMeNow), URL shortening, lead validation, and more. The bot integrates with ConnectReseller (domains/DNS), HostMeNow (cPanel hosting), and various payment gateways.

## Architecture
- **Backend:** FastAPI proxy (Python) → Node.js Express bot (port 5000)
- **Frontend:** React dashboard
- **Database:** MongoDB
- **Deployment:** Dual-environment — Kubernetes preview (with `/api` prefix) and Railway production (direct)

## What's Been Implemented
- Full project setup with all dependencies and `.env` configured
- Offshore hosting automation: domain registration (ConnectReseller) + cPanel creation (HostMeNow) + DNS A record setup
- Hosting expiry cron job for auto-suspension
- **Telegram webhook URL** — environment-aware using `HOSTED_ON` env var (Feb 2026)
  - `HOSTED_ON=railway` → `${SELF_URL}/telegram/webhook`
  - Otherwise → `${SELF_URL}/api/telegram/webhook`
- **Dynopay → BlockBee auto-fallback** (Feb 2026) — All 6 crypto payment flows (wallet, domain, hosting, VPS, VPS upgrade, plan) now try Dynopay first; on any error/timeout/unreachable, silently fall back to BlockBee so users always get a crypto address
- **SUPPORT_USERNAME bug fix** — Fixed `ReferenceError` in offshore hosting disabled message (was missing `process.env.`)

## Blocked Items (Require User Action)
- **P1:** HostMeNow `CreateAccount` API returns "Access Denied" — user must contact HostMeNow support
- **P1:** `HOSTMENOW_SERVER_IP` env var needed for automated DNS — user must get IP from HostMeNow

## Prioritized Backlog
### P1
- Wire up cPanel management features (suspend/unsuspend/terminate/SSO) into bot commands

### P2
- Modularize `_index.js` (5000+ lines) into smaller files
- Organize `bot/utils/` into feature-based subdirectories

## Key Files
- `/app/js/_index.js` — Main bot entry (routes, commands, cron, webhook setup)
- `/app/js/cr-register-domain-&-create-cpanel.js` — Hosting automation workflow
- `/app/js/hostmenow.js` — HostMeNow API client
- `/app/js/config-setup.js` — Environment detection and URL config
- `/app/backend/server.py` — FastAPI proxy that starts the Node.js bot
- `/app/.env` — All secrets and configuration
