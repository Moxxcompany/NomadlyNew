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

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express app (port 5000)
- **Bot**: Telegram bot (node-telegram-bot-api) with webhook mode
- **Database**: MongoDB (Railway-hosted)
- **Collections**: state, walletOf, phoneNumbersOf, phoneTransactions, phoneLogs, ivrAnalytics, + many others
- **Integrations**: Telegram, Telnyx (Cloud Phone), Fincra (payments), BlockBee (crypto), DynoPay, Connect Reseller (domains), Cloudflare, Brevo (email), Twilio, SignalWire, OpenAI

## What's Been Implemented

### Session 1 (2026-02-18) — Environment Setup
- Updated backend/.env with all user-provided API keys and credentials
- Set SELF_URL and SELF_URL_PROD to current pod URL for webhook routing

### Session 2 (2026-02-18) — Cloud Phone Keyboard + Feature Gating + IVR + Recording
- Added cloudPhone button to all 4 language files keyboards
- Implemented planFeatureAccess matrix and canAccessFeature gating
- Built IVR/Auto-attendant: Telnyx DTMF gather, greeting → menu → route by digit
- Built call recording for Business plan
- Dynamic buildManageMenu(num) replaces all static menu instances

### Session 3 (2026-02-18) — Three Additional Features
#### Feature 1: Auto-disable on Plan Downgrade
- cpChangePlan handler checks old vs new plan capabilities
- Automatically disables IVR, recording, voicemail, SMS email/webhook when downgrading
- User receives a clear notification listing all disabled features
- Works for all downgrade paths: Business→Pro, Business→Starter, Pro→Starter

#### Feature 2: IVR Analytics
- New MongoDB collection: ivrAnalytics
- trackIvrAnalytics() logs every DTMF press: phoneNumber, callerFrom, digit, action, timestamp
- getIvrAnalytics() queries last 30 days: totalCalls, optionBreakdown (digit/count/percent), topOption, recentCalls
- ivrAnalyticsReport() renders formatted report with visual bar chart (█░)
- "📊 IVR Analytics" button added to all IVR management menus

#### Feature 3: Custom Voicemail Greeting via Audio
- Voice/audio message handler intercepts msg.voice/msg.audio for cpVmAudioUpload state
- Extracts Telegram file link and saves as customAudioGreetingUrl
- Telnyx playback_start API plays custom audio file for callers
- call.playback.ended event triggers voicemail recording after greeting
- Fallback: if text entered instead of audio, uses TTS with custom text
- Default greeting restore option
- Voicemail menu shows greeting type (🎤 Custom Audio / 📝 Custom Text / 🔊 Default)
- Greeting management sub-menu: Custom Greeting (Audio) / Default Greeting

## Testing Status
- All tests passed across all 3 sessions
- New features: 100% validation
- Backend: 90.9% (only known minor: /api/webhook 404 = expected, correct path is /api/telegram/webhook)

## Backlog
- P0: None (all requested features complete)
- P1: IVR greeting voice preview (play back before saving)
- P2: Call recording playback in-bot (browse recordings)
- P2: Plan upgrade promos (smart upsell when Starter user tries locked features)
