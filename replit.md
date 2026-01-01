# Project Documentation

## Overview

Nomadly is a Telegram bot application that provides phone number leads services (buy and validate HQ SMS leads). The bot includes multi-language support (English, French, Chinese, Hindi) and maintains separate interfaces for admin and regular users. Domain, hosting, VPS, and URL shortener features redirect users to @Hostbay_bot for those services.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 2025)

### Bug Fixes & Security Improvements (November 6, 2025)
- **Fixed Admin Spam**: Prevented repeated IP whitelist warning messages from flooding admin chat
- **Improved Security**: Replaced insecure `Math.random()` with cryptographically secure `crypto.randomBytes()` for VPS password and name generation
- **Removed Hardcoded Credentials**: Moved all Railway deployment IDs to environment variables (RAILWAY_SERVICE_ID, RAILWAY_ENVIRONMENT_ID, RAILWAY_PROJECT_ID)
- **Enhanced Database Error Handling**: Improved `db.set()` function with input validation, operation verification, and better error logging
- **Added API Error Handler**: Created centralized `handleApiError()` utility for better API debugging across the codebase
- **Fixed Test Files**: Removed hardcoded chat ID from `hello.js`, now requires TEST_CHAT_ID environment variable
- **Code Modernization**: Replaced deprecated `.substr()` with `.substring()` throughout codebase

### Webhook Implementation & Environment Detection (November 6, 2025)
- **Webhook-Based Bot**: Converted from polling to webhooks to eliminate 409 conflicts and improve reliability
- **Environment-Based Bot Tokens**: Implemented automatic environment detection to use different Telegram bot tokens for development and production
- **Configuration Priority**: BOT_ENVIRONMENT → REPLIT_DEPLOYMENT → NODE_ENV → default (development)
- **Separate Tokens Support**: Added support for TELEGRAM_BOT_TOKEN_DEV (development) and TELEGRAM_BOT_TOKEN_PROD (production)
- **No More 409 Errors**: Webhooks eliminate polling conflicts between multiple instances
- **Port Conflict Handling**: Enhanced error handling for port conflicts with helpful debugging messages
- **User-Configurable**: Users can manually override environment using BOT_ENVIRONMENT secret

### Bot Functionality Update (October 2025)
- **Active Features**: Phone number leads services (buy and validate HQ SMS leads) fully operational
- **Redirected Features**: Domain registration, hosting services, VPS plans, and URL shortener now redirect users to @Hostbay_bot
- **User Keyboard Layout**: Phone Leads | Hosting & Domains (redirect) | Wallet | Settings | Support
- **Admin Interface**: Unchanged, retains all original admin features and controls
- **Multi-Language Support**: All new features and messages translated to EN/FR/ZH/HI

## System Architecture

### Core Application Structure
- **Telegram Bot**: Built on Node.js with node-telegram-bot-api using **webhook mode** (not polling)
- **Webhook Endpoint**: `/telegram/webhook` receives updates from Telegram servers
- **Multi-Language Support**: English, French, Chinese, Hindi with translation system
- **User Differentiation**: Separate keyboard layouts for admins and regular users
- **JavaScript/Node.js Backend**: Built using modern ES2021 standards with ESLint configuration for code quality
- **Multi-Service Architecture**: Integrates various external APIs and services for different functionalities
- **Environment-Based Configuration**: Extensive use of environment variables for API keys and configuration management

### Phone Leads Functionality
- **Buy Leads**: Purchase phone number leads with country selection (USA, Canada, Australia, UK, New Zealand)
- **Validate Leads**: Phone number validation using multiple APIs (Alcazar, NPL, Neutrino, SignalWire, AWS, Twilio)
- **Features**: Carrier selection, SMS/Voice options, CNAM options
- **Payment**: Wallet-based payments supporting USD/NGN currencies

### Payment Processing System
- **Multi-Gateway Support**: Integrates multiple payment processors including Fincra, DynoPay, and BlockBee for cryptocurrency
- **Flexible Payment Options**: Supports bank payments, cryptocurrency payments, and traditional payment methods
- **Subscription Management**: Implements tiered pricing with daily, weekly, and monthly subscription plans

### Domain and Hosting Services
- **Domain Management**: Connects to external domain services through reseller APIs
- **Hosting Integration**: Links to Railway and Render services for hosting provisioning
- **Automated Provisioning**: Uses Connect Reseller API for domain registration and management

### Communication Services
- **SMS Integration**: SignalWire API integration for SMS messaging capabilities
- **Email Services**: Brevo SMTP integration for transactional emails
- **Customer Support**: Telegram integration for customer support channels

### Feature Management
- **Subscription Tiers**: Different feature limits based on subscription levels (free domains per plan)
- **Feature Toggles**: Environment-controlled feature enabling/disabling (SMS app, bank payments, reseller features)
- **Demo Integration**: YouTube demo links for user onboarding

## External Dependencies

### Payment Gateways
- **Fincra**: Primary payment processor with webhook support
- **DynoPay**: Alternative payment processing with wallet functionality
- **BlockBee**: Cryptocurrency payment processing (optional)

### Communication Services
- **SignalWire**: SMS and voice communication API
- **Brevo (formerly Sendinblue)**: Email delivery service
- **Telegram**: Customer support integration

### Domain and Hosting
- **Connect Reseller API**: Domain registration and management
- **Railway**: Cloud hosting platform integration
- **Render**: Additional hosting service integration
- **Nameword API**: Domain-related services

### Utility Services
- **OpenAI API**: AI-powered features integration
- **Neutrino API**: Phone number validation and verification
- **Bitly & Cuttly**: URL shortening services
- **Currency Exchange API**: Real-time currency conversion

### Infrastructure
- **VS Code**: Development environment with custom spell-check dictionary
- **ESLint**: Code quality and standards enforcement
- **Environment Variables**: Comprehensive configuration management for API keys and service endpoints
- **Environment Detection**: Automatic detection of development vs production mode with environment-specific bot tokens

## Environment Configuration

### Bot Environment System

The bot now supports **separate bot tokens** for development and production environments to prevent conflicts (Telegram 409 errors).

#### Environment Detection Priority:

1. **BOT_ENVIRONMENT** (Manual override - highest priority)
   - Set to `development` or `production`
   - Allows users to manually control environment
   
2. **REPLIT_DEPLOYMENT** (Automatic)
   - Set to `1` or `true` when deployed to Replit production
   - Automatically uses production token
   
3. **NODE_ENV** (Standard Node.js)
   - Set to `production` for production environment
   
4. **Default**: `development` (if none of the above are set)

#### Required Secrets:

##### Option 1: Separate Tokens (Recommended)
Create two separate Telegram bots via @BotFather:

- **TELEGRAM_BOT_TOKEN_DEV**: Token for development bot (workspace testing)
- **TELEGRAM_BOT_TOKEN_PROD**: Token for production bot (live users)

##### Option 2: Single Token (Fallback)
- **TELEGRAM_BOT_TOKEN**: Used if environment-specific tokens are not configured

#### Webhook URLs:

The webhook system automatically detects the correct URL based on environment:

**Development (Workspace):**
- Automatically uses `REPLIT_DEV_DOMAIN` (e.g., `https://xxxxx.replit.dev`)
- No manual configuration needed - Replit provides this automatically
- Fallback: Can manually set `SELF_URL_DEV` if needed

**Production (Deployment):**
- Uses `SELF_URL_PROD` for your published Replit app (e.g., `https://nomadly1.replit.app`)
- Or falls back to `SELF_URL` if `SELF_URL_PROD` is not set
- For external hosting (Railway, etc.), set `SELF_URL_PROD` to your production domain

The webhook endpoint is automatically set to `${SELF_URL}/telegram/webhook`.

#### How to Set Environment:

**Development Mode (Workspace):**
```
BOT_ENVIRONMENT=development
```

**Production Mode (Deployment):**
```
BOT_ENVIRONMENT=production
```
or leave unset - Replit deployments automatically use production mode.

#### Benefits:

- ✅ **No 409 Conflicts**: Webhook mode eliminates polling conflicts entirely
- ✅ **No Duplicate Messages**: Single webhook endpoint receives each update once
- ✅ **Better Performance**: Webhooks are more efficient than polling
- ✅ **Safe Testing**: Test features in development without affecting live users  
- ✅ **Automatic Detection**: Production deployments automatically use production token
- ✅ **Manual Override**: Can force development mode even in deployed environment
- ✅ **Port Conflict Detection**: Clear error messages when port 5000 is occupied

#### Technical Details:

**Webhook Mode:**
- Uses `POST /telegram/webhook` endpoint to receive updates
- Automatically sets webhook URL based on `SELF_URL` environment variable
- Webhook URL format: `${SELF_URL}/telegram/webhook`
- No polling = No 409 conflicts
- More reliable and efficient than polling mode

**Port Handling:**
- Default port: 5000
- Graceful error handling for port conflicts
- Helpful debug messages when port is already in use