# Nomadly Bot - PRD & Status

## Original Problem Statement
Full Cloud Phone system setup and feature completeness for Nomadly Telegram Bot.

## Architecture
- **Backend**: Python FastAPI proxy (port 8001) → Node.js Express app (port 5000)
- **Bot**: Telegram bot (node-telegram-bot-api) with webhook mode
- **Database**: MongoDB (Railway-hosted)
- **Collections**: state, walletOf, phoneNumbersOf, phoneTransactions, phoneLogs, ivrAnalytics, cnamCache

## Implementation History

### Session 1 — Environment Setup
- Updated .env with all API keys, set webhooks to current pod URL

### Session 2 — Keyboard + Feature Gating + IVR + Recording
- Added cloudPhone to all 4 language keyboards
- Plan-based feature gating (Starter/Pro/Business)
- Full IVR/Auto-attendant with DTMF gather
- Call recording for Business plan

### Session 3 — Downgrade + Analytics + Audio Greeting
- Auto-disable features on plan downgrade
- IVR analytics with bar chart reports
- Custom voicemail greeting via audio upload

### Session 4 — Number Search Bug Fix
- Fixed duplicate noNumbers key collision

### Session 5 — Usage Limits & Edge Cases
- Real-time minute/SMS enforcement
- Call forwarding counts toward minutes
- Business "Unlimited" handled as Infinity
- Limit-reached notifications
- All texts updated for "Inbound SMS only"

### Session 6 — Mid-Call Disconnect + SMS Inbox + UX
#### Mid-Call Auto-Disconnect
- 60-second interval timer monitors projected minutesUsed for non-Business plans
- Speaks warning + hangs up when limit reached mid-call
- Telegram notification sent to owner
- Timer cleaned up on call hangup

#### SMS Inbox with CNAM
- New cpSmsInbox action state with pagination (5 per page)
- Queries phoneLogs for inbound SMS entries
- CNAM lookup via Multitel (primary) + SignalWire (fallback)
- Results cached in MongoDB cnamCache (30-day TTL)
- Batch lookup (5 concurrent) for performance
- Shows sender name + number + message preview + timestamp

#### UX Improvements
- Manage menu reorganized: Communication row (Forwarding + SMS Settings), SMS Inbox, then Advanced features, then Billing
- Call & SMS Logs improved: shows all event types with distinct icons (📩/🎙️/📲/📞/🔴)
- 15 entries instead of 10, unified format

## Testing Status
- All sessions: 100% pass rate
- 28/28 feature validations passed

## Backlog
- P1: Overage billing (pay-per-use above plan limits)
- P2: Usage dashboard command (daily/weekly breakdown)
- P2: Export SMS inbox as CSV
