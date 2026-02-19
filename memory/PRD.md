# Nomadly Bot - PRD

## Original Problem Statement
1. Update backend .env with provided API keys and credentials, using current pod URL for webhooks with /api prefix.
2. Fix crypto payment messages — ensure each service shows contextually correct text, not "domain" for non-domain services.

## Architecture
- **Backend**: FastAPI (server.py) acts as reverse proxy to Node.js Express app
- **Node.js**: Telegram Bot (Nomadly) with Express server on port 5000
- **Frontend**: React app (basic shell)
- **Database**: MongoDB (Railway-hosted)

## What's Been Implemented

### Session 1: Env Setup
- Updated backend .env with all provided API keys
- Set SELF_URL/SELF_URL_PROD to pod URL with /api
- Installed Node.js deps, verified all services running

### Session 2: Crypto Payment Message Fix (End-to-End Audit)
**Bug**: Leads and Cloud Phone crypto payment flows both reused `showDepositCryptoInfoDomain`, producing incorrect "domain" wording.

**Fix — Full audit of all 8 crypto payment flows:**
| Service | Template | Status |
|---------|----------|--------|
| Wallet Deposit | `showDepositCryptoInfo` | ✅ Already correct |
| Domain | `showDepositCryptoInfoDomain` | ✅ Already correct |
| Subscription Plan | `showDepositCryptoInfoPlan` | ✅ Already correct |
| VPS | `showDepositCryptoInfoVps` | ✅ Already correct |
| VPS Upgrade | `showDepositCryptoInfoVpsUpgrade` | ✅ Already correct |
| Hosting | `showCryptoPaymentInfo` | ✅ Already correct |
| **Leads** | `showDepositCryptoInfoLeads` | ✅ **Fixed** — "will be delivered" |
| **Cloud Phone** | `showDepositCryptoInfoPhone` | ✅ **Fixed** — "number will be activated" |

**Files changed:** config.js, lang/en.js, lang/fr.js, lang/hi.js, lang/zh.js, _index.js (4 call sites updated)

## Status
- All services: RUNNING
- All 8 crypto payment flows: CORRECT contextual messages
