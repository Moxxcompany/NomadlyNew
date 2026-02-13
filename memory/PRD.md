# NomadlyBot — PRD

## Original Problem Statement
1. Analyze code and setup
2. Review recent commits for shortener without subscription — confirmed correct
3. Revert Ap1s.net keyboard from visible back to hidden
4. Reduce promo messages by 25%

## Architecture
- Frontend: React (port 3000) — Admin dashboard
- Backend: FastAPI proxy (port 8001) → Node.js Express (port 5000)
- Database: MongoDB (external Railway)
- Bot: Telegram bot (node-telegram-bot-api)
- Languages: EN, FR, HI, ZH

## What's Been Implemented
- **2026-02-13**: Analyzed shortener commits, confirmed correct implementation
- **2026-02-13**: Reverted Ap1s.net keyboard to hidden in 5 files (config.js + 4 lang files)
- **2026-02-13**: Trimmed all 60 promo messages by ~31% (20,905→14,362 chars), reduced AI cap 900→650

## Prioritized Backlog
- P2: Clean up dead code — freeShortLinksOf counter, welcome free trial messaging
- P2: Install Node.js dependencies (npm install) to get bot running
- P3: Build out admin dashboard with link analytics
- P3: A/B test short vs long promo messages

## Next Tasks
- Deploy and verify bot + promo rendering in Telegram
