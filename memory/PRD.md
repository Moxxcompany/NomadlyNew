# PRD - tg-bot-link-shorten

## Project
Telegram link shortener bot that sells domain names and phone number leads.

## Architecture
- **Runtime**: Node.js (>=20.0.0)
- **Entry**: `js/start-bot.js`
- **Deployment**: Railway (Nixpacks builder)
- **DB**: MongoDB

## Issue Fixed (2026-01-xx)
### Deployment failure: `npm ci` out-of-sync lock file + Node engine mismatch

**Root Causes:**
1. `.nvmrc` pinned Node v18.13.0 — AWS SDK v3.987+ requires Node >=20
2. `package-lock.json` was stale (3616 lines) — many deps added to `package.json` were missing from lock file
3. `npm ci` enforces exact sync and rightly failed

**Changes Made:**
- Updated `.nvmrc` from `v18.13.0` → `v20.20.0`
- Added `"engines": { "node": ">=20.0.0" }` to `package.json`
- Regenerated `package-lock.json` (now 7651 lines, fully synced)

**Verification:**
- `npm ci` completes with 0 errors and 0 EBADENGINE warnings

## Next Action Items
- Re-deploy on Railway and confirm Docker build succeeds
- Consider running `npm audit fix` to address 10 reported vulnerabilities
