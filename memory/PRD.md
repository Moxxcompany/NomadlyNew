# Nomadly Bot - PRD

## Original Problem Statement
1. Update backend .env with provided API keys and credentials, using current pod URL for webhooks with /api prefix.
2. Fix crypto payment messages — ensure each service shows contextually correct text.
3. Configure `sip.speechcue.com` as custom SIP domain with Telnyx via Cloudflare DNS SRV records.

## Architecture
- **Backend**: FastAPI (server.py) acts as reverse proxy to Node.js Express app
- **Node.js**: Telegram Bot (Nomadly) with Express server on port 5000
- **Database**: MongoDB (Railway-hosted)
- **Telnyx**: Cloud Phone (SIP, SMS, Voice, IVR, Voicemail)
- **Cloudflare**: DNS management for speechcue.com

## What's Been Implemented

### Session 1: Env Setup
- Updated backend .env with all provided API keys
- Set SELF_URL/SELF_URL_PROD to pod URL with /api
- Installed Node.js deps, verified all services running

### Session 2: Crypto Payment Message Fix
- Added `showDepositCryptoInfoLeads` and `showDepositCryptoInfoPhone` templates across 5 files
- Updated 4 call sites in _index.js
- All 8 crypto payment flows now have correct contextual messages

### Session 3: SIP Domain Configuration (sip.speechcue.com)
**DNS SRV Records created on Cloudflare (speechcue.com zone):**
| Record | Target | Port | Purpose |
|--------|--------|------|---------|
| `_sip._udp.sip.speechcue.com` | `sip.telnyx.com` | 5060 | SIP over UDP |
| `_sip._tcp.sip.speechcue.com` | `sip.telnyx.com` | 5060 | SIP over TCP |
| `_sips._tcp.sip.speechcue.com` | `sip.telnyx.com` | 5061 | SIP over TLS |

**Additional changes:**
- Updated `SIP_DOMAIN=sip.speechcue.com` in backend .env
- Verified all 3 SRV records resolve correctly via DNS
- Railway CNAME for `sip.speechcue.com` remains for HTTP (web app) — SIP traffic routes via SRV to Telnyx

**How it works:**
1. SIP client configured with server `sip.speechcue.com`
2. Client performs DNS SRV lookup → finds `sip.telnyx.com:5060`
3. Client registers to Telnyx using SIP credentials (username/password)
4. Telnyx authenticates via credential connection → routes calls/SMS via webhooks to SELF_URL

## Current DNS Records (speechcue.com)
```
CNAME  sip.speechcue.com          → 3uhsq1yi.up.railway.app (HTTP)
SRV    _sip._udp.sip.speechcue.com → 10 10 5060 sip.telnyx.com
SRV    _sip._tcp.sip.speechcue.com → 10 10 5060 sip.telnyx.com
SRV    _sips._tcp.sip.speechcue.com → 10 10 5061 sip.telnyx.com
TXT    _railway-verify.sip...      → railway verification
```

## Status
- All services: RUNNING
- SRV DNS records: LIVE & RESOLVING ✅
- Telnyx webhooks: AUTO-UPDATING on startup ✅
- SIP_DOMAIN: sip.speechcue.com ✅
