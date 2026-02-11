# PRD - Telegram Bot (tg-bot-link-shorten)

## Overview
Telegram bot for URL shortening, domain purchasing, phone lead gen/validation, web hosting, VPS, and crypto/bank payments.

## Architecture
- **Runtime**: Node.js v20 | **DB**: MongoDB (Railway) | **Bot**: node-telegram-bot-api (webhook)
- **Express**: Port 8001 with optional `/api` prefix stripping middleware

## Environment-Agnostic Design (Railway + Emergent)
The code uses `${SELF_URL}/path` everywhere. The only difference between environments is SELF_URL:
- **Railway**: `SELF_URL="https://nomadlynew-production.up.railway.app"` → no prefix needed
- **Emergent**: `SELF_URL="https://pod.emergentagent.com/api"` → middleware strips `/api`

This means:
- URL shortener: `${SELF_URL}/${slug}` works on both
- Callbacks: `${SELF_URL}/dynopay/...` routes correctly on both
- Webhook: `${SELF_URL}/telegram/webhook` works on both
- Custom domains: fallback lookup in `/:id` handler

## Fixes Applied
- [Jan 2026] Added `/api` prefix stripping middleware (Emergent-only, no-op on Railway)
- [Jan 2026] Fixed `/:id` redirect handler: primary lookup via SELF_URL key, fallback via req.hostname for custom domains
- [Jan 2026] Fixed DynoPay env var mismatch (DYNOPAY_* vs DYNO_PAY_*)
- [Jan 2026] Removed blocking GitHub API check on every message

## Backlog
- P1: Test full URL shortener e2e (create + redirect)
- P2: Verify Cutt.ly API key still works
- P2: npm security audit
