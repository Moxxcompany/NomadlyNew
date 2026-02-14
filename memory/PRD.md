# NomadlyBot - Project Requirements Document

## Original Problem Statement
Setup repo, configure environment, verify RapidAPI URL shortener, rebrand to "Shortit", fix free trial flow, clear free trial data.

## Architecture
- **Node.js Backend**: Telegram bot + Express REST API server (`/app/js/`)
- **FastAPI Proxy**: Python proxy (`/app/backend/server.py`) proxies to port 5000
- **React Frontend**: Admin dashboard (`/app/frontend/`)
- **MongoDB**: External database

## Free Trial Flow (URL Shortener)
1. User starts bot → `freeShortLinksOf` initialized to `FREE_LINKS` (2)
2. User accepts terms → sees `welcomeFreeTrial` if free links available
3. User goes to URL Shortener → enters URL → selects provider
4. If "Shortit (Free)" selected:
   - Check `isSubscribed()` OR `freeLinksAvailable()` 
   - If neither → show `freeLinksExhausted` message prompting subscription
   - If OK → shorten URL via RapidAPI → decrement `freeShortLinksOf` counter (unless subscribed)
5. Subscribe prompt: "🔔 Subscribe Here" button always visible on provider keyboard + exhausted message

## What's Been Implemented

### 2026-02-14: Initial Setup
- Installed deps, created root `.env`, all services running

### 2026-02-14: Shortit Rebranding
- Renamed "Ap1s.net" → "Shortit" across all 4 languages + config + auto-promo
- Fixed keyboard to show both Bit.ly and Shortit options
- Updated subscription text, planSubscribed, welcomeFreeTrial

### 2026-02-14: Free Trial Fix + Data Clear
**Bug found**: `decrement(freeShortLinksOf, chatId)` was MISSING from URL shortening flow — users got unlimited free links instead of 2
**Fix applied**:
- Added `freeLinksAvailable()` + `isSubscribed()` check BEFORE shortening (both random and custom flows)
- Added `decrement(freeShortLinksOf, chatId)` AFTER successful shortening for non-subscribed users
- Added `freeLinksExhausted` message in all 4 languages prompting subscription
- **Cleared 3,104 records** from `freeShortLinksOf` collection — all users get fresh 2 free links on next interaction

### Files Modified
- `/app/js/_index.js` — Free links check + decrement in random and custom shortening flows
- `/app/js/lang/en.js` — `freeLinksExhausted` message
- `/app/js/lang/fr.js` — `freeLinksExhausted` message
- `/app/js/lang/zh.js` — `freeLinksExhausted` message
- `/app/js/lang/hi.js` — `freeLinksExhausted` message

### 2026-02-14: Remaining Free Links Counter
- Added `linksRemaining` message function to all 4 language files (en, fr, zh, hi)
- Modified both random and custom link flows in `_index.js` to:
  1. `await decrement()` the counter
  2. Read remaining count via `get()`
  3. Send the shortened URL
  4. Send the remaining links message (e.g., "You have 1 free Shortit link remaining.")
- Subscribed users bypass this entirely and only receive the short URL

### Files Modified
- `/app/js/_index.js` — Added remaining count display in both shortening flows
- `/app/js/lang/en.js` — Added `linksRemaining` function
- `/app/js/lang/fr.js` — Added `linksRemaining` function
- `/app/js/lang/zh.js` — Added `linksRemaining` function
- `/app/js/lang/hi.js` — Added `linksRemaining` function

## Prioritized Backlog
### P0 - None
### P1
- Migrate `customCuttly.js` from legacy Cutt.ly API to RapidAPI
- Configure Connect Reseller API IP whitelist
### P2
- Admin dashboard analytics
- Payment gateway testing
