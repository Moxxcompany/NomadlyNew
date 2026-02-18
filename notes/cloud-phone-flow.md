# Cloud Phone Service — Smart Flow Design for NomadlyBot

## 1. Product Overview

A fully managed virtual phone service sold through the Telegram bot, powered by Telnyx as the underlying carrier. Users can buy phone numbers, receive SMS (forwarded to Telegram), configure call forwarding, voicemail, and connect via SIP using your branded domain (e.g. `sip.nomadly.com`).

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    TELEGRAM USER                         │
│              (interacts via bot chat)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NOMADLYBOT (Node.js)                        │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ telnyx-       │  │ voice-       │  │ sms-         │  │
│  │ service.js    │  │ service.js   │  │ service.js   │  │
│  │               │  │              │  │              │  │
│  │ • searchNums  │  │ • forwarding │  │ • inbound    │  │
│  │ • buyNumber   │  │ • voicemail  │  │ • forward to │  │
│  │ • assignSIP   │  │ • call ctrl  │  │   Telegram   │  │
│  │ • releaseNum  │  │ • IVR logic  │  │ • forward to │  │
│  │ • listNums    │  │              │  │   email      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │           │
└─────────┼─────────────────┼──────────────────┼──────────┘
          │                 │                  │
          ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   TELNYX API v2                          │
│                                                          │
│  Numbers API │ SIP Trunking │ Call Control │ Messaging   │
│              │              │              │             │
│  Webhooks ──►  POST /api/telnyx/voice-webhook           │
│              ──►  POST /api/telnyx/sms-webhook           │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│  YOUR SIP INFRASTRUCTURE                                 │
│  sip.nomadly.com ─► softphones / IP phones / PBX        │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Main Menu Integration

Current main keyboard layout in `config.js`:
```
[urlShortenerMain]
[hostingDomainsRedirect]
[phoneNumberLeads]
[domainNames]
[wallet, viewPlan]
[buyPlan]
[changeSetting, getSupport, joinChannel]
```

**Add new row:**
```
[cloudPhone]   ◄── NEW: "📞☁️ Cloud Phone"
```

Position it after `hostingDomainsRedirect` (the offshore hosting row), grouping telecom services together:
```
[urlShortenerMain]
[hostingDomainsRedirect]
[cloudPhone]                    ◄── NEW
[phoneNumberLeads]
[domainNames]
[wallet, viewPlan]
[buyPlan]
[changeSetting, getSupport, joinChannel]
```

---

## 4. Submenu5 — Cloud Phone Hub

When user taps "📞☁️ Cloud Phone", show:

```
┌─────────────────────────────────┐
│  📞 Cloud Phone Service          │
│                                   │
│  🛒 Buy Phone Number             │
│  📱 My Numbers (X active)        │
│  ⚙️ SIP Settings                 │
│  📊 Usage & Billing              │
│                                   │
│  [Back]  [Cancel]                 │
└─────────────────────────────────┘
```

State action: `a.submenu5`

---

## 5. Flow 1 — Buy Phone Number

This is the primary revenue flow. Follows the same step-by-step pattern as VPS (country → config → payment).

### State Machine

```
submenu5
  └─► buyPhoneSelectCountry
        └─► buyPhoneSelectType          (local / toll-free)
              └─► buyPhoneSelectArea     (city or area code)
                    └─► buyPhoneResults  (show available numbers)
                          └─► buyPhoneConfirm   (selected number + price)
                                └─► buyPhoneFeatures   (add-ons: SMS, forwarding, voicemail)
                                      └─► buyPhoneSummary  (order review)
                                            └─► payment flow (wallet / crypto / bank)
                                                  └─► activation + credentials delivery
```

### Step-by-Step Detail

**Step 1 — Select Country**
```
action: buyPhoneSelectCountry

📍 Select country for your new phone number:

[🇺🇸 United States]  [🇬🇧 United Kingdom]
[🇨🇦 Canada]         [🇦🇺 Australia]
[🇩🇪 Germany]        [🇫🇷 France]
[🌍 More Countries]
[Back]  [Cancel]
```
Behind the scenes: `GET /v2/available_phone_numbers?filter[country_code]=US&filter[limit]=1` to verify country availability.

**Step 2 — Select Number Type**
```
action: buyPhoneSelectType

📱 Select number type:

[📍 Local Number]        — Geographic number with area code
[🆓 Toll-Free Number]   — 800/888/877 prefix, nationwide
[Back]  [Cancel]
```

**Step 3 — Select Area / City**
```
action: buyPhoneSelectArea

For US Local:
🏙️ Select area or enter area code:

[New York (212)]    [Los Angeles (310)]
[Chicago (312)]     [Miami (305)]
[Houston (713)]     [Dallas (214)]
[🔍 Search by Area Code]
[Back]  [Cancel]

If user picks "Search by Area Code":
action: buyPhoneEnterAreaCode
→ User types "415"
→ Bot searches Telnyx: GET /v2/available_phone_numbers?filter[country_code]=US&filter[national_destination_code]=415&filter[limit]=10
```

**Step 4 — Browse Available Numbers**
```
action: buyPhoneResults

📞 Available numbers in New York (212):

1️⃣  +1 (212) 555-0142
2️⃣  +1 (212) 555-0198
3️⃣  +1 (212) 555-0234
4️⃣  +1 (212) 555-0301
5️⃣  +1 (212) 555-0456

[1]  [2]  [3]  [4]  [5]
[🔄 Show More Numbers]
[Back]  [Cancel]
```
Telnyx call: `GET /v2/available_phone_numbers?filter[country_code]=US&filter[national_destination_code]=212&filter[limit]=5&filter[features][]=voice&filter[features][]=sms`

**Step 5 — Confirm Number + Select Plan**
```
action: buyPhoneConfirm

✅ You selected: +1 (212) 555-0142

📋 Select your plan:

[💡 Starter — $5/mo]
   100 inbound min · 50 SMS · Call forwarding

[⭐ Pro — $15/mo]
   500 inbound min · 200 SMS · Forwarding + Voicemail + SIP

[👑 Business — $30/mo]
   Unlimited inbound · 1000 SMS · Full SIP + IVR + Recording

[Back]  [Cancel]
```

**Step 6 — Feature Add-ons (optional)**
```
action: buyPhoneFeatures

⚡ Add-ons for +1 (212) 555-0142:

[📩 SMS to Telegram — FREE]      ✅ Included
[📞 Call Forwarding — FREE]      ✅ Included
[🎙️ Voicemail — $2/mo]          [Add] / [Skip]
[🔑 SIP Access — $3/mo]          [Add] / [Skip]
[🎧 Call Recording — $5/mo]      [Add] / [Skip]

[Continue]
[Back]  [Cancel]
```
Note: For Pro/Business plans, these are already included. Only shown for Starter.

**Step 7 — Order Summary**
```
action: buyPhoneSummary

📋 Order Summary

📞 Number:     +1 (212) 555-0142
📍 Location:   New York, US
📦 Plan:       Pro — $15/mo
📩 SMS:        200/mo included
📞 Minutes:    500 inbound/mo
⚡ Add-ons:    Voicemail, SIP Access

💰 Total:      $15.00/mo
   First month billed now

[🎟️ Apply Coupon]
[✅ Proceed to Payment]
[Back]  [Cancel]
```

**Step 8 — Payment** (reuse existing `goto` payment flows)
```
→ goto['phone-pay']()

Same flow as domain-pay / vps-plan-pay / hosting-pay:
  → Wallet (USD/NGN)
  → Crypto (BTC, ETH, USDT, etc.)
  → Bank (Fincra)
```

**Step 9 — Activation & Credential Delivery**
```
After successful payment:

🎉 Your Cloud Phone is Active!

📞 Number: +1 (212) 555-0142
📍 Location: New York, US
📦 Plan: Pro ($15/mo)
📅 Renewal: March 18, 2026

━━━ SIP Credentials ━━━
🌐 Server: sip.nomadly.com
👤 Username: user_a7k2m9
🔑 Password: ●●●●●●●● (tap /reveal_sip_xxxxx)
📡 Port: 5060 (UDP/TCP) | 5061 (TLS)

━━━ Quick Setup ━━━
• Softphone: Download Ooma/Zoiper, enter above credentials
• SMS: Inbound SMS will be forwarded to this chat automatically
• Forwarding: Set up via 📱 My Numbers → Call Forwarding

Need help? Contact @onarrival1
```

Behind the scenes (Telnyx API calls):
1. `POST /v2/number_orders` — purchase number
2. Assign number to SIP Connection (pre-created Elastic SIP Trunk)
3. Set messaging profile → webhook URL for inbound SMS
4. Generate SIP credentials → store in DB
5. Store in `phoneNumbersOf` collection
6. Notify admin group

---

## 6. Flow 2 — My Numbers (Management)

### Entry
```
action: myPhoneNumbers

📱 Your Cloud Phone Numbers:

1️⃣  +1 (212) 555-0142  ✅ Active
    Pro Plan · Renews Mar 18

2️⃣  +44 (20) 7946-0958  ✅ Active
    Starter Plan · Renews Apr 2

[1]  [2]
[Back]  [Cancel]
```

### Number Management Menu
```
action: managePhoneNumber

⚙️ Managing: +1 (212) 555-0142

[📞 Call Forwarding]
[📩 SMS Settings]
[🎙️ Voicemail]
[🔑 SIP Credentials]
[📊 Call & SMS Logs]
[🔄 Renew / Change Plan]
[❌ Release Number]
[Back]  [Cancel]
```

### 6a. Call Forwarding
```
action: phoneCallForwarding

📞 Call Forwarding for +1 (212) 555-0142

Current: Disabled

Select mode:
[📞 Always Forward]       — All calls go to another number
[📵 Forward When Busy]    — Only if line is busy
[⏰ Forward No Answer]    — If no pickup in 30s
[🚫 Disable Forwarding]
[Back]

→ If user selects a forward mode:
action: phoneForwardEnterNumber

Enter the number to forward calls to:
(Include country code, e.g. +14155551234)

→ User types number → Confirm:

✅ Call Forwarding Updated!

📞 +1 (212) 555-0142
📲 Forward to: +1 (415) 555-1234
📋 Mode: Always Forward

Calls will ring your forwarding number.
```

Implementation: Telnyx Call Control webhook → on `call.initiated` event → execute `transfer` command to forward number. Store config in `callForwardingOf` collection.

### 6b. SMS Settings
```
action: phoneSmsSettings

📩 SMS Settings for +1 (212) 555-0142

[📲 Forward SMS to Telegram]  ✅ ON
[📧 Forward SMS to Email]     ❌ OFF
[🔗 SMS Webhook URL]          ❌ Not Set
[Back]

→ "Forward to Telegram" toggle:
  ON: Inbound SMS delivered as Telegram message to user's chat
  Format: "📩 SMS from +14155551234:\nHello, I'm interested in..."

→ "Forward to Email":
  action: phoneSmsEmail
  Enter email address: user@example.com
  ✅ SMS will be forwarded to user@example.com

→ "Webhook URL" (for developers):
  action: phoneSmsWebhook
  Enter your webhook URL: https://myapp.com/sms
```

Implementation: Telnyx Messaging webhook → `POST /api/telnyx/sms-webhook` → look up number owner → forward via bot.sendMessage() to their chatId.

### 6c. Voicemail
```
action: phoneVoicemail

🎙️ Voicemail for +1 (212) 555-0142

Status: Disabled

[✅ Enable Voicemail]
[Back]

→ After enabling:

🎙️ Voicemail Settings:

[🔊 Greeting: Default]
  → [Use Default] / [Record Custom] (send voice note)

[📲 Send to Telegram]    ✅ ON
  → Receive voicemail recordings in this chat

[📧 Send to Email]       ❌ OFF
  → Enter email for voicemail delivery

[⏰ Ring Time: 25 seconds]
  → [15s] [20s] [25s] [30s]

[🚫 Disable Voicemail]
[Back]
```

Implementation: Telnyx Call Control → if no answer after ring timeout → play greeting audio → record → on `recording.completed` webhook → send audio file to user via Telegram.

### 6d. SIP Credentials
```
action: phoneSipCredentials

🔑 SIP Credentials for +1 (212) 555-0142

🌐 SIP Server:  sip.nomadly.com
👤 Username:     user_a7k2m9
🔑 Password:     ●●●●●●●●
📡 Ports:        5060 (UDP/TCP) · 5061 (TLS)
🎵 Codecs:       G.711μ, G.711a, Opus

[👁️ Reveal Password]
[🔄 Reset Password]
[📋 Softphone Guide]
[Back]
```

### 6e. Call & SMS Logs
```
action: phoneCallLogs

📊 Recent Activity for +1 (212) 555-0142

📞 Calls (Last 7 days):
  ↙️ +14155551234  2m 15s   Today 14:32
  ↗️ +14085559876  0m 45s   Today 11:20
  ↙️ +12125554321  5m 03s   Yesterday

📩 SMS (Last 7 days):
  ↙️ +14155551234  "Hey, is this..."  Today 13:15
  ↗️ +14085559876  "Yes, confirmed"   Today 10:00

[📞 Full Call History]
[📩 Full SMS History]
[Back]
```

### 6f. Renew / Change Plan
```
action: phoneRenewPlan

🔄 Plan for +1 (212) 555-0142

Current: Pro — $15/mo
Renews: March 18, 2026
Auto-Renew: ✅ ON

[🔄 Renew Now]
[📦 Change Plan]
[🔁 Auto-Renew: ON/OFF]
[Back]
```

### 6g. Release Number
```
action: phoneReleaseNumber

⚠️ Release +1 (212) 555-0142?

This will:
• Cancel your monthly plan
• Remove all forwarding & voicemail
• Release the number (cannot be recovered)
• No refund for remaining days

[Yes, Release Number]  [No, Keep It]
```

---

## 7. Flow 3 — SIP Settings (Global)

```
action: sipSettings

⚙️ SIP Configuration

🌐 SIP Domain: sip.nomadly.com
📡 Status: ✅ Connected

━━━ Connection Details ━━━
Protocol: SIP over UDP/TCP/TLS
Ports: 5060 (UDP/TCP) · 5061 (TLS)
Codecs: G.711μ, G.711a, G.729, Opus
DTMF: RFC 2833

━━━ Quick Links ━━━
[📱 Softphone Setup Guide]
[💻 IP Phone Config]
[🔧 PBX Integration]
[Back]
```

---

## 8. Database Schema (New Collections)

### phoneNumbersOf
```js
{
  _id: chatId,                    // or number-based key
  val: {
    numbers: [{
      phoneNumber: "+12125550142",
      telnyxNumberId: "1234567890",
      telnyxOrderId: "ord_xxx",
      country: "US",
      city: "New York",
      areaCode: "212",
      type: "local",              // local | toll_free
      plan: "pro",                // starter | pro | business
      planPrice: 15.00,
      purchaseDate: "2026-02-18T14:40:00Z",
      expiresAt: "2026-03-18T14:40:00Z",
      autoRenew: true,
      status: "active",           // active | suspended | released
      sipUsername: "user_a7k2m9",
      sipPassword: "encrypted_password",
      messagingProfileId: "msg_xxx",
      connectionId: "conn_xxx",
      features: {
        sms: true,
        callForwarding: {
          enabled: true,
          mode: "always",         // always | busy | no_answer | disabled
          forwardTo: "+14155551234",
          ringTimeout: 25
        },
        voicemail: {
          enabled: true,
          greetingType: "default", // default | custom
          customGreetingUrl: null,
          forwardToTelegram: true,
          forwardToEmail: "user@example.com",
          ringTimeout: 25
        },
        smsForwarding: {
          toTelegram: true,
          toEmail: null,
          webhookUrl: null
        },
        recording: false
      }
    }]
  }
}
```

### phoneTransactions
```js
{
  _id: "txn_xxxxx",
  chatId: 5590563715,
  phoneNumber: "+12125550142",
  action: "purchase",             // purchase | renew | upgrade | release
  plan: "pro",
  amount: 15.00,
  paymentMethod: "wallet_usd",
  timestamp: "2026-02-18T14:40:00Z"
}
```

### phoneLogs (call + SMS combined)
```js
{
  _id: ObjectId,
  phoneNumber: "+12125550142",
  chatId: 5590563715,
  type: "call",                   // call | sms
  direction: "inbound",           // inbound | outbound
  from: "+14155551234",
  to: "+12125550142",
  // Call-specific:
  duration: 135,                  // seconds
  status: "completed",            // completed | missed | voicemail
  recordingUrl: null,
  // SMS-specific:
  body: "Hey, is this available?",
  // Common:
  timestamp: "2026-02-18T14:40:00Z"
}
```

---

## 9. New Files to Create

### js/telnyx-service.js
Telnyx API wrapper — all HTTP calls to Telnyx v2 API:
- `searchNumbers(country, type, areaCode, limit)`
- `buyNumber(phoneNumber, connectionId, messagingProfileId)`
- `releaseNumber(telnyxNumberId)`
- `listOwnedNumbers()`
- `assignToConnection(numberId, connectionId)`
- `updateNumberConfig(numberId, config)`

### js/voice-service.js
Call control logic:
- `handleInboundCall(webhookPayload)` — route based on forwarding/voicemail config
- `forwardCall(callControlId, forwardTo)`
- `sendToVoicemail(callControlId, greetingUrl)`
- `handleRecordingCompleted(webhookPayload)` — forward to Telegram/email

### js/sms-service.js
SMS handling:
- `handleInboundSms(webhookPayload)` — look up owner, forward to Telegram
- `forwardSmsToTelegram(chatId, from, body)`
- `forwardSmsToEmail(email, from, body)`

### js/phone-config.js
Config, text, keyboards for the Cloud Phone menus (following config.js pattern).

---

## 10. Express Routes (Webhook Receivers)

```js
// Telnyx voice webhook — receives all call events
app.post('/telnyx/voice-webhook', async (req, res) => {
  // Verify webhook signature using TELNYX_PUBLIC_KEY
  // Route: call.initiated → check forwarding config → forward or voicemail
  // Route: call.answered → log
  // Route: call.hangup → log duration
  // Route: recording.completed → send to user
  res.sendStatus(200)
})

// Telnyx SMS webhook — receives inbound SMS
app.post('/telnyx/sms-webhook', async (req, res) => {
  // Look up number owner in phoneNumbersOf
  // Forward to Telegram chat via bot.sendMessage()
  // Forward to email if configured
  // Log in phoneLogs
  res.sendStatus(200)
})
```

These routes exist in Node.js Express (port 5000). The proxy will forward:
`POST /api/telnyx/voice-webhook` → strips /api → `POST /telnyx/voice-webhook`

Webhook URLs registered in Telnyx:
- Voice: `https://setup-wizard-100.preview.emergentagent.com/api/telnyx/voice-webhook`
- SMS: `https://setup-wizard-100.preview.emergentagent.com/api/telnyx/sms-webhook`

---

## 11. ENV Variables Needed

```
TELNYX_API_KEY=KEY...                    # Telnyx v2 API key
TELNYX_PUBLIC_KEY=...                    # For webhook signature verification
TELNYX_SIP_CONNECTION_ID=...             # Pre-created Elastic SIP Trunk ID
TELNYX_MESSAGING_PROFILE_ID=...         # Pre-created messaging profile ID
SIP_DOMAIN=sip.nomadly.com              # Your branded SIP domain
PHONE_STARTER_PRICE=5                   # Monthly price Starter plan
PHONE_PRO_PRICE=15                      # Monthly price Pro plan
PHONE_BUSINESS_PRICE=30                 # Monthly price Business plan
PHONE_SERVICE_ON=true                   # Feature toggle
```

---

## 12. Pricing / Business Model

| Item | Your Cost (Telnyx) | Your Price (Markup) | Margin |
|------|---------------------|---------------------|--------|
| Local Number/mo | $1.00 | $5–30 (plan) | 400–2900% |
| Toll-Free Number/mo | $1.00 | $8–35 (plan) | 700–3400% |
| Inbound Call/min | $0.005 | Included in plan | Bundled |
| Outbound Call/min | $0.009 | $0.03/min | 233% |
| Inbound SMS | $0.004 | Included in plan | Bundled |
| Outbound SMS | $0.004 | $0.02/msg | 400% |
| SIP Channel | $8–12/mo | Included in Pro+ | Bundled |

Plans:
- **Starter $5/mo**: 100 inbound min, 50 SMS, call forwarding
- **Pro $15/mo**: 500 inbound min, 200 SMS, forwarding + voicemail + SIP
- **Business $30/mo**: Unlimited inbound, 1000 SMS, full features + recording + IVR

---

## 13. One-Time Setup (Before First User)

1. **Telnyx Account**: Create account, get API key
2. **Create Elastic SIP Trunk**: In Telnyx portal, create FQDN-based SIP connection pointing to `sip.nomadly.com`
3. **DNS**: Point `sip.nomadly.com` A record to your SIP server / Telnyx FQDN
4. **Messaging Profile**: Create in Telnyx, set webhook URL to `/api/telnyx/sms-webhook`
5. **Voice Application**: Create in Telnyx, set webhook URL to `/api/telnyx/voice-webhook`
6. **Set ENV vars** in `/app/backend/.env`

---

## 14. Notification Group Messages

Following existing bot pattern (like domain purchases, new members):

```
🎉 New Phone Number Purchase!
User ab*** bought +1 (212) 555-0142
Plan: Pro ($15/mo)
— Nomadly Bot

📞 Inbound Call Alert
+14155551234 → +12125550142 (user ab***)
Duration: 2m 15s
— Nomadly Bot

📩 SMS Received
+14155551234 → +12125550142 (user ab***)
"Hey, is this available?"
— Nomadly Bot
```

---

## 15. Scheduled Jobs

Following existing `node-schedule` pattern:

1. **Phone Number Expiry Check** (every hour)
   - Check `phoneNumbersOf` for numbers expiring in <24h
   - Send reminder to user
   - If expired + no auto-renew → suspend number

2. **Usage Tracking** (daily)
   - Pull call/SMS usage from Telnyx CDR API
   - Update user quotas
   - Alert users approaching plan limits

3. **Auto-Renewal** (daily)
   - Check numbers due for renewal
   - If auto-renew ON + sufficient wallet balance → charge and renew
   - Else → send payment reminder

---

## 16. Implementation Priority

### Phase 1 — Core (MVP)
- [ ] `telnyx-service.js` — search + buy + assign numbers
- [ ] `phone-config.js` — texts, keyboards, state actions
- [ ] Buy Number flow (country → type → area → search → buy → pay)
- [ ] My Numbers — list + view SIP credentials
- [ ] Main menu integration (submenu5)
- [ ] Payment integration (reuse existing wallet/crypto/bank flows)
- [ ] Basic SMS forwarding to Telegram

### Phase 2 — Management
- [ ] Call forwarding configuration
- [ ] Voicemail (enable/disable, forward to Telegram)
- [ ] SMS to email forwarding
- [ ] Release number flow
- [ ] Renewal + auto-renew

### Phase 3 — Advanced
- [ ] Call recording
- [ ] Usage logs & analytics in bot
- [ ] IVR / auto-attendant
- [ ] Outbound calling via SIP
- [ ] Webhook URL configuration for developers
- [ ] Admin panel integration (React frontend)
