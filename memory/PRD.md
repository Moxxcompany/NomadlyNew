# NomadlyBot - Product Requirements Document

## Original Problem Statement
Set up and maintain the NomadlyBot Telegram bot platform, fixing bugs and enhancing features.

## Architecture
- **Frontend**: React admin dashboard
- **Backend**: Node.js Telegram Bot (core logic in `js/_index.js`), managed by FastAPI proxy (`backend/server.py`)
- **Database**: MongoDB (Railway-hosted)
- **Key Files**: `js/_index.js` (bot logic), `js/config.js` (config), `js/config-setup.js` (env defaults), `js/db.js` (DB helpers)
- **Language Files**: `js/lang/en.js`, `js/lang/fr.js`, `js/lang/zh.js`, `js/lang/hi.js`

## Completed Work

### Session 1
- Initial project setup (Node.js bot + FastAPI proxy + React frontend)
- Rewrote 15+ bot notification messages for persuasive marketing
- Fixed auto-promo infinite retry bug (`sendPromoToUser`)
- Fixed 3 bugs in Shortit link flow (crash, missing message, missing group notification)

### Session 2 (Feb 2026)
- **P0 Fix**: FREE_LINKS env variable confirmed set to 5 (was incorrectly 2)
- Verified bot runtime loads `FREE_LINKS=5` correctly
- All 28 static tests pass; integration test confirms 5 free links flow

### Session 3 (Feb 2026) - UX Trial Labeling
- **Provider button**: Changed from "Shortit (Free)" to "Shortit (Trial 5)" — dynamic from .env
- **Main menu button**: Changed from "URL Shortener" to "URL Shortener - 5 Trial Links" — trial visible upfront
- **Remaining message**: Changed from "You have 3 free Shortit links remaining" to "You have 3 of 5 trial Shortit links remaining" — shows used/total context
- **Exhausted message**: Changed from "all your free" to "all 5 trial" — specific count
- **Welcome message**: Updated to say "You have 5 trial Shortit links" instead of "free"
- **All 4 languages updated**: EN, FR, ZH, HI — all labels consistent
- All values dynamic from FREE_LINKS env variable
- All 28 tests passing

## P0/P1/P2 Backlog

### P0 (None remaining)
All critical bugs resolved.

### P1
- None identified.

### P2 (Future)
- Refactor `js/_index.js` monolith into modular feature files
- Add end-to-end Telegram bot test automation

## 3rd Party Integrations
Telegram Bot API, MongoDB, Bit.ly, Cutt.ly, DynoPay, Fincra, Blockbee, ResellerClub, Brevo SMTP, OpenAI, Neutrino API, Railway, Render

## Test Files
- `/app/js/tests/test_shortit_links_remaining.js` - Static/code review tests (28 tests)
- `/app/js/tests/test_free_links_integration.js` - MongoDB integration test for FREE_LINKS=5 flow
