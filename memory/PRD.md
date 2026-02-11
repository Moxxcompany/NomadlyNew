# PRD - Telegram Bot Link Shortener (Nomadly)

## Original Problem Statement
Setup and install needed dependencies, update SELF_URL to Emergent pod URL, test all service connectivity, and identify bad credentials.

## Architecture
- **Runtime**: Node.js v20.20.0
- **Database**: MongoDB (via `mongodb` npm driver)
- **Bot Framework**: `node-telegram-bot-api`
- **HTTP Server**: Express.js (webhooks, REST APIs, payment callbacks)
- **Key Integrations**: Telegram Bot API, BlockBee, Fincra, DynoPay, ConnectReseller, Bitly, Cuttly, Nodemailer/Brevo SMTP, Railway, Render, Neutrino, Twilio, Nameword/VPS

## What's Been Implemented (Jan 2026)
- [x] Installed all 301 npm dependencies
- [x] Created `.env` with all 100+ environment variables from user-provided credentials
- [x] Updated `SELF_URL` to Emergent pod URL: `https://bot-payment-flow-1.preview.emergentagent.com`
- [x] Ran comprehensive connectivity tests for 15 services
- [x] Identified 9 working services and 7 failed/bad credential services

## Connectivity Test Results

### ✅ Working (9 services)
| Service | Details |
|---------|---------|
| MongoDB | Connected, DB "test" has 27 collections |
| Telegram Bot | @NomadlyBot authenticated |
| BlockBee | API key valid (crypto payments disabled) |
| SMTP/Email | Brevo SMTP verified (smtp-relay.brevo.com:587) |
| Twilio | Account active, name: AppLemon |
| Bitly | Authenticated as o_4qne9pe0od |
| OpenExchangeRates | Working, 1 USD = 1353.39 NGN |
| SELF_URL | Updated to Emergent pod URL |

### ❌ Bad Credentials / Failed (7 services)
| Service | Issue |
|---------|-------|
| Fincra | 401 Invalid authentication credentials - public key may be expired or wrong |
| DynoPay | 401 Requires "user" auth, wallet token is "customer" type |
| ConnectReseller | 404 API endpoint returned Tomcat error page - API key may need IP whitelisting |
| Railway API | GraphQL "Not Authorized" - API token expired or revoked |
| Render API | 401 Unauthorized - token expired or revoked |
| Nameword/VPS | Timeout - server at 34.44.198.68 unreachable |
| Neutrino | 403 ACCESS DENIED - user ID or API key invalid |

## Next Action Items
- P0: Fix 7 failed credentials (see table above)
- P1: Start bot with `npm start` for full end-to-end test
- P2: ConnectReseller likely needs this pod's IP whitelisted

## Backlog
- P2: Upgrade deprecated npm packages (request, uuid@3)
- P3: Add health-check endpoint for monitoring
