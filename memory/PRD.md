# Nomadly Bot - PRD

## Original Problem Statement
Telegram bot (Nomadly) — full setup, call forwarding fix/billing, UI cleanup, subscriptions aggregation, expiry reminders, branding.

## What's Been Implemented

### Sessions 1-4 (2026-02-19)
- Environment setup + webhook configuration
- Call forwarding fix (Telnyx outbound whitelist 2→250 countries)
- Forwarding billing ($0.50/min from wallet, admin-configurable)
- Premium prefix blocking + destination validation
- Support routing (@onarrival → live chat) across 4 languages
- Wallet enforcement (6 checkpoints) + $25 top-up recommendations

### Session 5 — UI Cleanup + Subscriptions + Branding
- Hub welcome trimmed to 3 lines with forwarding cost
- Duplicate "Call Forwarded" fix (_hangupProcessed guard)
- "My Plan" → "📋 My Subscriptions" with aggregated view
- "Cloud Phone" → "📞 CloudPhone ˢᵖᵉᵉᶜʰᶜᵘᵉ"
- All verbose texts trimmed 40-60% across all languages

### Session 6 — Leads Rename + Expiry Reminders
- "🎯 Targeted Leads & Validation" → "🎯 Buy Valid Leads | Verify Yours" (all 4 langs)
- 3-day expiry reminders for:
  - Bot Plans (Daily/Weekly/Monthly) — scans planEndingTime, sends translated reminder
  - VPS Plans — scans vpsPlansOf, marks _reminder3DaySent flag
  - CloudPhone — already had 3-day + 1-day reminders in phone-scheduler.js
- Reminder runs every 5 min via existing schedule.scheduleJob
- Multi-language reminder messages (EN/FR/HI/ZH)

## Files Modified This Session
- `/app/js/lang/en.js` — phoneNumberLeads renamed
- `/app/js/lang/fr.js` — phoneNumberLeads renamed
- `/app/js/lang/hi.js` — phoneNumberLeads renamed
- `/app/js/lang/zh.js` — phoneNumberLeads renamed
- `/app/js/_index.js` — Expiry reminders for bot plans + VPS (3-day)

## Reminder Coverage
| Service | 3-Day | 1-Day | On Expire |
|---------|-------|-------|-----------|
| Bot Plan | ✅ New | — | — |
| CloudPhone | ✅ Existing | ✅ Existing | ✅ Auto-release |
| VPS | ✅ New | — | — |
| Freedom Plan | — | ✅ 1hr | ✅ Existing |

## Next Tasks / Backlog
- P1: Add 1-day reminders for bot plans and VPS
- P2: Auto-renew option for bot plans (from wallet)
- P2: Subscription renewal analytics
