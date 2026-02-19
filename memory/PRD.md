# Nomadly Bot - PRD

## Original Problem Statement
Telegram bot (Nomadly) — setup, call forwarding fix, forwarding billing, premium prefix blocking, multi-language, support routing, UI cleanup, subscriptions aggregation.

## What's Been Implemented

### Session 5 — UI Cleanup, Dedup, Subscriptions, Branding (2026-02-19)

**1. Hub Welcome Text — Concise with forwarding cost:**
- Trimmed from 6 lines to 3 lines
- Shows: SMS inbound only · Calls plan minutes · Forwarding $0.50/min · Overage rates

**2. Duplicate Message Fix:**
- Root cause: Telnyx fires multiple `call.hangup` events for transferred calls
- Fix: Added `_hangupProcessed` guard flag on session to prevent double-processing

**3. "My Plan" → "My Subscriptions":**
- Renamed across all 4 lang files (EN/FR/HI/ZH)
- Rewrote handler to aggregate ALL subscriptions:
  - Bot Plan (daily/weekly/monthly) with expiry + days left
  - CloudPhone numbers with plan tier + expiry
  - VPS servers with status + expiry
  - Hosting plans with type + expiry
- Single clean message showing all active subscriptions

**4. "Cloud Phone" → "CloudPhone ˢᵖᵉᵉᶜʰᶜᵘᵉ":**
- Updated keyboard text in all 4 lang files
- Uses Unicode superscript for "Speechcue" to keep it smaller

**5. Verbose Text Cleanup (end-to-end):**
- Hub welcome: 6 lines → 3 lines
- Plan selection: Removed redundant footnotes
- Order summary: Condensed to single-line per field
- Forwarding status/setup/updated: All trimmed 40-60%
- Call forwarded hangup notification: Single line layout
- Mid-call billing alerts: One-liner style
- Overage notifications: Compact format
- Wallet insufficient messages: Concise with $25 top-up
- All lang translations (FR/HI/ZH) trimmed to match

## Files Modified
- `/app/js/voice-service.js` — Duplicate fix (_hangupProcessed), trimmed all notifications
- `/app/js/phone-config.js` — Concise hub welcome, plan text, forwarding texts, order summary
- `/app/js/_index.js` — My Subscriptions aggregation handler, forwarding flow
- `/app/js/lang/en.js` — CloudPhone branding, My Subscriptions, concise fwd translations
- `/app/js/lang/fr.js` — Same updates in French
- `/app/js/lang/hi.js` — Same updates in Hindi
- `/app/js/lang/zh.js` — Same updates in Chinese

## Next Tasks / Backlog
- P0: Test My Subscriptions with user who has multiple active services
- P1: Test call forwarding deduplication (should be single notification now)
- P2: Add subscription renewal reminders (3 days before expiry)
