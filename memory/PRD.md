# Nomadly Bot - PRD & Status

## Original Problem Statement
1. Setup env with all API keys/credentials and webhooks using current pod URL
2. Cloud Phone not visible on keyboard — fix all language files
3. Verify credentials work for all registered phone numbers
4. Implement IVR/Auto-attendant system for Business plan
5. Ensure all plan features are correctly implemented with feature gating
6. Auto-disable IVR/recording on plan downgrade from Business
7. IVR analytics (track caller key presses)
8. Custom voicemail greeting via audio upload
9. Bug: Selecting area code shows "no numbers yet" instead of search results

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express app (port 5000)
- **Bot**: Telegram bot (node-telegram-bot-api) with webhook mode
- **Database**: MongoDB (Railway-hosted)
- **Collections**: state, walletOf, phoneNumbersOf, phoneTransactions, phoneLogs, ivrAnalytics, + many others

## Bug Fix (Session 4)
**Root cause**: Duplicate `noNumbers` key in phone-config.js txt object. The search-failure message (line 214: "No numbers available") was overridden by the My Numbers message (line 272: "You don't have any phone numbers yet"). JavaScript objects take the last value for duplicate keys.

**Fix**:
1. Renamed search-failure message to `noSearchResults` to avoid key collision
2. Added `best_effort=true` to Telnyx searchNumbers API — returns nearby numbers when exact area code not available
3. Updated all 4 references in _index.js to use `noSearchResults`

## What's Been Implemented
- Sessions 1-3: env setup, keyboard fix, feature gating, IVR, recording, downgrade auto-disable, IVR analytics, custom VM greeting
- Session 4: Bug fix for number search showing wrong message

## Backlog
- P0: None
- P1: IVR greeting voice preview, Call recording browser
- P2: Smart plan upsell prompts
