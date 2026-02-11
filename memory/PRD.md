# PRD - tg-bot-link-shorten

## Project
Telegram link shortener bot offering domain registration, URL shortening, phone number leads (buy/validate), and wallet management.

## Architecture
- **Runtime**: Node.js (>=20.0.0)
- **Entry**: `js/start-bot.js`
- **Deployment**: Railway (Nixpacks builder)
- **DB**: MongoDB
- **Languages**: EN, FR, ZH, HI

## Services Offered (THIS bot)
- Domain Registration (DMCA-ignored, offshore, .sbs)
- URL Shortener (custom domain + Bitly integration)
- Buy Phone Number Leads (SMS/Voice)
- Validate Your Own Phone Leads (BYOL)
- Wallet (Crypto + NGN/USD)
- Subscriptions (Daily/Weekly/Monthly)

## Services on @hostbay_bot (cross-promoted)
- cPanel/Plesk hosting
- Country-level TLD domains (.ng .za .ke .gh .cm .tz)

---

## Changes Implemented

### 1. Deployment Fix (Session 1)
- `.nvmrc` updated from v18.13.0 -> v20.20.0
- Added `"engines": { "node": ">=20.0.0" }` to package.json
- Regenerated package-lock.json (3616 -> 7651 lines)
- `npm ci` now passes with 0 errors/warnings

### 2. Auto-Promo System (Session 2)
**New file**: `js/auto-promo.js`
- 3x daily automated promotional broadcasts
- 60 unique promo messages (5 variations x 3 themes x 4 languages)
- Timezone-aware scheduling (EN=UTC, FR=UTC+1, ZH=UTC+8, HI=UTC+5:30)
- Each user receives promos at their local 10:00, 16:00, 21:00
- Rotation tracking in MongoDB (avoids repeats)
- Auto opt-out on bot block (403 detection)
- `/stop_promos` and `/start_promos` commands
- @hostbay_bot cross-promotion in every message
- Respects existing broadcast-config.js rate limits

**Promo themes:**
| Slot | Theme | Focus |
|------|-------|-------|
| Morning 10:00 local | Domains | Offshore DMCA-ignored, .sbs, privacy |
| Afternoon 16:00 local | URL Shortener | Custom branding, Bitly, analytics |
| Evening 21:00 local | Phone Leads | Buy/validate leads, carrier filtering |

### 3. Language Gap Fixes (Session 2)
- Added `t.promoOptOut` and `t.promoOptIn` to all 4 languages
- Added `vp.upgradeDiskSummary` to FR, ZH, HI
- Uncommented `user.cPanelWebHostingPlans` + `user.pleskWebHostingPlans` in ZH
- All top-level keys, user.*, vp.* now fully synced across languages

### 4. Integration into _index.js
- Import `initAutoPromo` from `./auto-promo.js`
- Initialize in `loadData()` after DB connection
- `/stop_promos` command -> opt-out from promos
- `/start_promos` command -> re-subscribe to promos

### 5. Build Configuration Fixed (Session 2)
- Created `nixpacks.toml` to force `npm install` during deployment
- Updated `railway.json` with aligned build command
- Bypasses `npm ci` sync errors

### 6. Lead Credential Testing (Session 3 - Feb 2026)
Tested user-provided credentials with real phone numbers:
- **Alcazar** (API_ALCAZAR): WORKING - detects WIRELESS/LANDLINE + carrier
- **NPL** (NUMBER_PROBABLITY_API_ID/PASS): WORKING - detects mobile/reachable, ~35K credits
- **Neutrino** (NEUTRINO_ID/KEY): FAIL - free plan limit exceeded
- **SignalWire** (API_SIGNALWIRE): FAIL - 401 Unauthorized (token format mismatch)

### 7. Banner Images for Promos (Session 3 - Feb 2026)
- Generated 3 professional banner images (domains, shortener, leads)
- Updated `auto-promo.js` to use `bot.sendPhoto()` with image + caption
- Fallback to `bot.sendMessage()` if banner URL unavailable
- Exported `PROMO_BANNERS` for easy URL management
- All message captions verified under Telegram's 1024-char limit

### 8. AI-Powered Dynamic Promos (Session 3 - Feb 2026)
- Integrated OpenAI GPT-4o-mini for on-the-fly promo message generation
- Each broadcast generates a fresh, unique message per theme+language
- Service context (pricing, features, CTAs) baked into prompts for accuracy
- Friendly, persuasive tone with Telegram HTML formatting
- Automatic fallback to static messages if OpenAI fails
- Admin alert via Telegram bot on AI failure (APP_OPEN_API_KEY issue)
- Stats track whether AI or static was used per broadcast
- New dependency: `openai` npm package

---

## MongoDB Collections (New)
- `promoTracker` -- rotation index per theme+lang
- `promoOptOut` -- per-user opt-out preference
- `promoStats` -- broadcast statistics/logs

## Credential Status
| Service | Env Var | Status | Notes |
|---------|---------|--------|-------|
| Alcazar | API_ALCAZAR | Working | LRN lookup API |
| NPL | NUMBER_PROBABLITY_API_ID/PASS | Working | ~35K credits |
| Neutrino | NEUTRINO_ID/KEY | Exhausted | Free plan limit hit |
| SignalWire | TOKEN_SIGNALWIRE | Auth Fail | Need project_id:token format |

## Backlog / P0
- Fix Neutrino: user needs to upgrade plan or add credits
- Fix SignalWire: need correct project_id:api_token pair from user

## Backlog / P1
- Admin command to force-trigger a promo broadcast
- Admin command to view promo stats
- A/B testing different promo variations
- User engagement tracking (which promos get most clicks)

## Backlog / P2
- Add more languages (Portuguese, Arabic, Spanish)
- Dynamic pricing in promos based on current offers
- Scheduled promo campaigns (custom one-off blasts)
