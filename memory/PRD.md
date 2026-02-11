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
- `.nvmrc` updated from v18.13.0 → v20.20.0
- Added `"engines": { "node": ">=20.0.0" }` to package.json
- Regenerated package-lock.json (3616 → 7651 lines)
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
- `/stop_promos` command → opt-out from promos
- `/start_promos` command → re-subscribe to promos

---

## MongoDB Collections (New)
- `promoTracker` — rotation index per theme+lang
- `promoOptOut` — per-user opt-out preference
- `promoStats` — broadcast statistics/logs

## Backlog / P1
- Add banner images to promos (sendPhoto instead of sendMessage)
- Admin command to force-trigger a promo broadcast
- Admin command to view promo stats
- A/B testing different promo variations
- User engagement tracking (which promos get most clicks)

## Backlog / P2
- Add more languages (Portuguese, Arabic, Spanish)
- Dynamic pricing in promos based on current offers
- Scheduled promo campaigns (custom one-off blasts)
