# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
Replace Nameword hosting provider with HostMeNow offshore cPanel hosting in the NomadlyBot Telegram bot platform. 
- Plans: Basic (Product ID 114), Starter (Product ID 111), Intermediate (Product ID 112)
- Monthly billing cycle
- No free trial
- cPanel only (no Plesk)
- Domain registration stays with ConnectReseller

## Architecture

### Tech Stack
- **Frontend**: React 18 + Tailwind CSS (Admin Dashboard at port 3000)
- **Backend Proxy**: FastAPI (Python) at port 8001 — proxies to Node.js
- **Core Bot Engine**: Node.js/Express at port 5000 — Telegram bot + REST APIs
- **Database**: MongoDB (external Railway-hosted instance)
- **Hosting Provider**: HostMeNow Reseller API (offshore cPanel)

### Service Architecture
```
[Frontend :3000] → [FastAPI Proxy :8001] → [Node.js Express :5000] → [MongoDB]
                                                     ↓                    ↓
                                              [Telegram Bot API]   [HostMeNow API]
                                                                   [ConnectReseller API]
```

## What's Been Implemented

### [2026-02-15] Initial Setup
- Installed Node.js dependencies
- Created root `.env` with MongoDB config
- All 3 services running

### [2026-02-15] HostMeNow Integration (Nameword Replacement)
**New files:**
- `js/hostmenow.js` — HostMeNow Reseller API client (CreateAccount, SuspendAccount, UnsuspendAccount, TerminateAccount, ChangePassword, ChangePackage, get_Bandwidth_Disk_Usage, CreateSSOSession, GetServerName, Get_Products)

**Modified files:**
- `js/cr-register-domain-&-create-cpanel.js` — Replaced Nameword API with HostMeNow CreateAccount, generates username/password, stores serviceid in MongoDB
- `js/cr-check-domain-available.js` — Removed Nameword dependency, uses format validation for existing domains, ConnectReseller for new domains
- `js/hosting/plans.js` — Updated plans: Basic (ID 114), Starter (ID 111), Intermediate (ID 112) with Offshore cPanel branding
- `js/lang/en.js` — Updated button labels, plan names, success text (removed nameservers, added DNS note)
- `js/config.js` — Updated button labels to match new plan names
- `js/config-setup.js` — Set HOSTING_TRIAL_PLAN_ON=false by default
- `js/_index.js` — Updated submenu3 (removed free trial, removed Plesk, set hostingType=cPanel), updated plan names in selectPlan, skipped nameserver selection step, updated plan name comparisons in proceedWithEmail, passed hostingTransactions to registerDomainAndCreateCpanel
- `js/send-email.js` — Removed nameservers from email template, updated for cPanel-only branding
- `.env` — Added HOSTMENOW_API_KEY and OFFSHORE_HOSTING_ON=true
- `frontend/src/App.js` — Updated Web Hosting card to "Offshore Hosting" with new plan names

**Key flow changes:**
- Offshore Hosting flow: submenu3 → plan selection (Basic/Starter/Intermediate) → domain → email → payment → HostMeNow CreateAccount
- Nameserver selection step removed (was Nameword-specific)
- Free trial removed from submenu3 keyboard
- hostingType hardcoded to 'cPanel'

## Plan Mapping
| Bot Plan | HostMeNow Product | Product ID | Price (default) |
|---|---|---|---|
| Basic | Basic | 114 | $9.99/mo |
| Starter | Starter | 111 | $39.99/mo |
| Intermediate | Intermediate | 112 | $19.99/mo |

## Testing Results
- Backend: 100% (10/10 tests passed)
- Frontend: 100% (all UI elements correct)
- HostMeNow API: Verified (Get_Products returns all expected product IDs)

## Status
- All services: RUNNING
- MongoDB: CONNECTED
- HostMeNow API: CONNECTED
- Telegram Bot: DISABLED (no token)

## Prioritized Backlog
- P0: Configure Telegram bot token for live testing
- P1: ConnectReseller IP whitelist (34.16.56.64) for domain features
- P1: Set actual hosting plan pricing (current defaults: $9.99, $19.99, $39.99)
- P2: Add account management features in dashboard (suspend/unsuspend/terminate via HostMeNow API)
- P2: SSO session creation for direct cPanel access links
- P3: Bandwidth/disk usage monitoring dashboard
