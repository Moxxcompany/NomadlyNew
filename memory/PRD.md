# NomadlyBot - PRD & Architecture Document

## Original Problem Statement
Set up and maintain the NomadlyBot Telegram bot platform, fixing bugs and enhancing features.

## Architecture
- **Frontend**: React 18 admin dashboard (port 3000) - shows bot status, DB connection, feature cards
- **Backend**: FastAPI (Python, port 8001) - reverse proxy to Node.js Express server
- **Node.js Core**: Express server (port 5000) - Telegram bot engine with REST APIs
- **Database**: MongoDB (remote, Railway hosted)
- **Key Files**: `js/_index.js` (bot logic), `js/config.js` (config/fallback), `js/lang/en.js` (English text), `js/config-setup.js` (env defaults), `js/db.js` (DB helpers)

## What's Been Implemented

### Prior Sessions (Feb 13-14, 2026)
- Initial project setup (Node.js bot + FastAPI proxy + React frontend)
- Rewrote 15+ bot notification messages for persuasive marketing
- Fixed auto-promo infinite retry bug
- Fixed 3 bugs in Shortit link flow (crash, missing message, missing group notification)
- FREE_LINKS env confirmed at 5
- Group auto-detection/registration system
- 52 backend tests passing

### Current Session (Feb 14, 2026) — Setup & UX Fixes
- Installed Node.js dependencies, created root `.env`, fixed zh.js syntax error
- All services running (FastAPI proxy, Node.js Express, React dashboard)

**UX Fixes Applied (config.js + en.js + fr.js + hi.js + zh.js):**

#### HIGH IMPACT
- **Main Menu Keyboard Reorder** (config.js + all 4 lang files): URL Shortener first (free hook), then Hosting/Domains, Phone Leads, Wallet/Plan, Subscribe, Settings/Support
- **Confusing Labels**: phoneNumberLeads text → "Buy verified phone leads or validate your own numbers:" (all 5 files)
- **Dynamic Trial Links Counter**: URL Shortener button now shows user's actual remaining free links (e.g., "3 Links Left") instead of static "5 Trial Links". Updates after each link creation. Uses `startsWith` matching for button routing.
- **URL Shortener Submenu Redesign**: Replaced confusing [Redirect & Shorten] with clear provider choice upfront: [Bit.ly] [Shortit (Trial)] [Custom Domain] [View Analytics]. Flow: pick provider → enter URL → random/custom → payment (Bitly) or generate (Shortit)
- **Offshore Hosting Rename + Toggle**: "Hosting & Domains" → "Offshore Hosting" (all 5 lang files). `OFFSHORE_HOSTING_ON=false` env variable — when disabled, shows unavailable message instead of hosting submenu

#### MEDIUM
- **Submenu Text**: Added `urlShortenerSelect: "Shorten, brand, or track your links:"` in config.js
- **Vague Errors Fixed**:
  - `redIssueUrlBitly` → "Link shortening failed. Your wallet was not charged. Please try again or contact support."
  - `redIssueUrlCuttly` → "Link shortening failed. Please try again or contact support."
  - `issueGettingPrice` (en.js) → "We couldn't fetch the price right now. Please try again or contact support."
- **Grammar Fix**: `showDepositNgnInfo` → "wallet will be updated" (was "wallet will updated")

#### LOW - Polish
- `whatNum` → "That doesn't look right. Please enter a valid number."
- `walletBalanceLow` → "Your wallet balance is too low. Tap '👛 My Wallet' → '➕💵 Deposit' to top up."
- `askValidAmount` → "Please enter a valid amount."

## P0 — Critical (Requires User Action)
- [ ] Set `TELEGRAM_BOT_TOKEN` to activate Telegram bot
- [ ] Configure `SELF_URL` for webhooks

## P1 — Important
- [ ] ConnectReseller IP whitelist (IP: 34.16.56.64)
- [ ] Payment gateway API keys (BlockBee/Fincra/DynoPay)

## P2 — Future
- [ ] Admin dashboard enhancements (real-time stats from MongoDB)
- [ ] Refactor `js/_index.js` monolith into modular feature files
- [ ] End-to-end Telegram bot test automation

## Test Files
- `/app/backend/tests/test_group_notifications.js` — 52 tests (all pass)
- `/app/backend_test.py` — Backend validation
- `/app/final_validation_test.py` — UX fixes validation
- `/app/test_reports/iteration_9.json` — Latest test results (100% pass)
