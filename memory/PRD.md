# NomadlyBot — PRD

## Original Problem Statement
Analyze code and setup. Review recent commits where bot users were allowed to use domains registered for shortener without subscription. Confirm correctness. Revert Ap1s.net shortener keyboard from visible back to hidden.

## Architecture
- **Frontend**: React (port 3000) — Admin dashboard showing bot health
- **Backend**: FastAPI proxy (port 8001) → Node.js Express (port 5000)
- **Database**: MongoDB (external Railway instance)
- **Bot**: Telegram bot (node-telegram-bot-api)
- **Languages**: EN, FR, HI, ZH

## Core Features
- URL Shortening (Bit.ly, Ap1s.net, custom domains)
- Domain Sales (ConnectReseller API)
- Phone Leads (SMS & Voice with carrier filtering)
- Wallet System (USD & NGN, crypto + bank deposits)
- Web Hosting (cPanel/Plesk plans, free trial)
- VPS Management
- Payments (BlockBee, DynoPay, Fincra)

## What's Been Implemented
- **2026-02-13**: Analyzed recent commits. Confirmed "shortener without subscription" feature is correctly implemented (4 expiry/decrement blocks removed). Reverted Ap1s.net keyboard visibility in 5 files (config.js + 4 lang files).

## Prioritized Backlog
- P2: Clean up dead code — `freeShortLinksOf` counter decrement, welcome "free trial" messaging
- P2: Install Node.js dependencies (`npm install`) to get bot running in this environment
- P3: Build out admin dashboard with link analytics

## Next Tasks
- Deploy and verify bot behavior in production
- Consider adding shortlink analytics to admin panel
