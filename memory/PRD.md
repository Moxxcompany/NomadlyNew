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
10. Enforce usage limits: minutes, SMS, call forwarding counting, edge cases

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express app (port 5000)
- **Bot**: Telegram bot (node-telegram-bot-api) with webhook mode
- **Database**: MongoDB (Railway-hosted)
- **Collections**: state, walletOf, phoneNumbersOf, phoneTransactions, phoneLogs, ivrAnalytics

## Session 5 (2026-02-18) — Usage Limits & Edge Cases

### Edge Cases Analyzed & Fixed:

1. **NO real-time minute enforcement** → FIXED: `handleCallInitiated` now checks `isMinuteLimitReached()` before answering. Rejects with TTS message + hangup.

2. **NO real-time SMS enforcement** → FIXED: `handleInboundSms` checks `isSmsLimitReached()` before forwarding. Silently drops if over limit.

3. **Call forwarding didn't count toward minutes** → FIXED: `handleCallHangup` increments `minutesUsed` via `incrementMinutesUsed()` for ALL call types (forwarded, IVR, voicemail). Math.ceil(duration/60) = 1 second billed as 1 minute.

4. **Stale usage data (only batch tracked daily)** → FIXED: Real-time increment on every call hangup and SMS delivery. Daily batch still runs as backup.

5. **Business "Unlimited" minutes causes NaN** → FIXED: `getMinuteLimit()` returns `Infinity` for Business. `isMinuteLimitReached()` returns `false` when limit is Infinity.

6. **Suspended numbers still received calls/SMS** → FIXED: Both voice-service and sms-service check `status !== 'active'` and reject/skip.

7. **SMS appears to be outbound capable** → FIXED: All user-facing texts now clearly state "Inbound SMS only — receive SMS, not send."

8. **Call forwarding not mentioned as counting** → FIXED: Plan selection, forwarding status, and hub welcome all note "forwarded calls count toward inbound minutes."

9. **Limit notifications sent repeatedly** → FIXED: `_minLimitNotified` and `_smsLimitNotified` flags prevent spam. Cleared on monthly reset.

10. **Monthly reset didn't clear real-time flags** → FIXED: `runMonthlyReset` now clears `_smsLimitNotified` and `_minLimitNotified`.

### Files Modified:
- voice-service.js — Full rewrite with limit enforcement, real-time tracking
- sms-service.js — Added initSmsLimits, limit check before forward, real-time smsUsed increment
- phone-config.js — All texts updated for "inbound only" + manage menu shows limit warnings
- phone-scheduler.js — Monthly reset clears real-time limit flags, usage messages say "inbound"
- _index.js — Wired up SMS limits initialization

## Testing Status
- All tests passed: 100% across usage limits, SMS limits, voice limits, integration
- All previous features verified working

## Backlog
- P0: None
- P1: Overage billing (allow usage above limit at per-minute/per-SMS rate)
- P2: Usage dashboard command (show daily/weekly breakdown)
