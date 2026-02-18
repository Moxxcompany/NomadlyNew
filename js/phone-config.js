// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Cloud Phone Config — Texts, keyboards, state actions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PHONE_STARTER_PRICE = parseFloat(process.env.PHONE_STARTER_PRICE || '5')
const PHONE_PRO_PRICE = parseFloat(process.env.PHONE_PRO_PRICE || '15')
const PHONE_BUSINESS_PRICE = parseFloat(process.env.PHONE_BUSINESS_PRICE || '30')
const SIP_DOMAIN = process.env.SIP_DOMAIN || 'sip.nomadly.com'

// ── Button labels ──
const btn = {
  cloudPhone: '📞☁️ Cloud Phone',
  buyPhoneNumber: '🛒 Buy Phone Number',
  myNumbers: '📱 My Numbers',
  sipSettings: '⚙️ SIP Settings',
  usageBilling: '📊 Usage & Billing',

  // Number types
  localNumber: '📍 Local Number',
  tollFreeNumber: '🆓 Toll-Free Number',

  // Plans
  starterPlan: `💡 Starter — $${PHONE_STARTER_PRICE}/mo`,
  proPlan: `⭐ Pro — $${PHONE_PRO_PRICE}/mo`,
  businessPlan: `👑 Business — $${PHONE_BUSINESS_PRICE}/mo`,

  // Management
  callForwarding: '📞 Call Forwarding',
  smsSettings: '📩 SMS Settings',
  voicemail: '🎙️ Voicemail',
  sipCredentials: '🔑 SIP Credentials',
  callRecording: '🔴 Call Recording',
  ivrAutoAttendant: '🤖 IVR / Auto-attendant',
  callSmsLogs: '📊 Call & SMS Logs',
  renewChangePlan: '🔄 Renew / Change Plan',
  releaseNumber: '❌ Release Number',

  // Forwarding modes
  alwaysForward: '📞 Always Forward',
  forwardBusy: '📵 Forward When Busy',
  forwardNoAnswer: '⏰ Forward If No Answer',
  disableForwarding: '🚫 Disable Forwarding',

  // SMS
  smsToTelegram: '📲 SMS to Telegram',
  smsToEmail: '📧 SMS to Email',
  smsWebhook: '🔗 Webhook URL',

  // Voicemail
  enableVoicemail: '✅ Enable Voicemail',
  disableVoicemail: '🚫 Disable Voicemail',
  vmGreeting: '🔊 Greeting',
  vmCustomGreeting: '🎤 Custom Greeting (Audio)',
  vmDefaultGreeting: '🔄 Default Greeting',
  vmToTelegram: '📲 Send to Telegram',
  vmToEmail: '📧 Send to Email',
  vmRingTime: '⏰ Ring Time',

  // SIP
  revealPassword: '👁️ Reveal Password',
  resetPassword: '🔄 Reset Password',
  softphoneGuide: '📋 Softphone Setup Guide',

  // Renew
  renewNow: '🔄 Renew Now',
  changePlan: '📦 Change Plan',
  autoRenew: '🔁 Auto-Renew',

  // Misc
  showMore: '🔄 Show More Numbers',
  searchByArea: '🔍 Search by Area Code',
  moreCountries: '🌍 More Countries',
  applyCoupon: '🎟️ Apply Coupon',
  proceedPayment: '✅ Proceed to Payment',
  buyAnother: '🛒 Buy Another Number',
  confirm: '✅ Confirm',
  yesRelease: 'Yes, Release Number',
  noKeep: 'No, Keep It',
  yesReset: 'Yes, Reset',

  // IVR
  enableIvr: '✅ Enable IVR',
  disableIvr: '🚫 Disable IVR',
  ivrGreeting: '🎤 Set Greeting',
  ivrAddOption: '➕ Add Menu Option',
  ivrRemoveOption: '➖ Remove Option',
  ivrViewOptions: '📋 View Menu Options',
  ivrAnalytics: '📊 IVR Analytics',

  // Recording
  enableRecording: '✅ Enable Recording',
  disableRecording: '🚫 Disable Recording',

  back: 'Back',
  cancel: 'Cancel',
}

// ── Countries with flag ──
const countries = [
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'GB', name: '🇬🇧 United Kingdom' },
  { code: 'CA', name: '🇨🇦 Canada' },
  { code: 'AU', name: '🇦🇺 Australia' },
  { code: 'DE', name: '🇩🇪 Germany' },
  { code: 'FR', name: '🇫🇷 France' },
]

const moreCountries = [
  { code: 'NL', name: '🇳🇱 Netherlands' },
  { code: 'SE', name: '🇸🇪 Sweden' },
  { code: 'ES', name: '🇪🇸 Spain' },
  { code: 'IT', name: '🇮🇹 Italy' },
  { code: 'BR', name: '🇧🇷 Brazil' },
  { code: 'MX', name: '🇲🇽 Mexico' },
  { code: 'IL', name: '🇮🇱 Israel' },
  { code: 'PL', name: '🇵🇱 Poland' },
  { code: 'CZ', name: '🇨🇿 Czech Republic' },
  { code: 'AT', name: '🇦🇹 Austria' },
]

// US popular area codes
const usAreaCodes = [
  { code: '212', city: 'New York' },
  { code: '310', city: 'Los Angeles' },
  { code: '312', city: 'Chicago' },
  { code: '305', city: 'Miami' },
  { code: '713', city: 'Houston' },
  { code: '214', city: 'Dallas' },
  { code: '415', city: 'San Francisco' },
  { code: '206', city: 'Seattle' },
]

const countryByName = {}
;[...countries, ...moreCountries].forEach(c => { countryByName[c.name] = c.code })

const areaByLabel = {}
usAreaCodes.forEach(a => { areaByLabel[`${a.city} (${a.code})`] = a.code })

// ── Plans ──
const plans = {
  starter: { name: 'Starter', price: PHONE_STARTER_PRICE, minutes: 100, sms: 50, features: ['Call forwarding', 'SMS to Telegram'] },
  pro: { name: 'Pro', price: PHONE_PRO_PRICE, minutes: 500, sms: 200, features: ['Forwarding', 'Voicemail', 'SIP access', 'SMS to Telegram & Email'] },
  business: { name: 'Business', price: PHONE_BUSINESS_PRICE, minutes: 'Unlimited', sms: 1000, features: ['All Pro features', 'Call recording', 'IVR / Auto-attendant'] },
}

// Feature gating per plan — which features each plan unlocks
const planFeatureAccess = {
  starter: {
    callForwarding: true,
    smsToTelegram: true,
    smsToEmail: false,
    smsWebhook: false,
    voicemail: false,
    sipCredentials: false,
    callRecording: false,
    ivr: false,
  },
  pro: {
    callForwarding: true,
    smsToTelegram: true,
    smsToEmail: true,
    smsWebhook: true,
    voicemail: true,
    sipCredentials: true,
    callRecording: false,
    ivr: false,
  },
  business: {
    callForwarding: true,
    smsToTelegram: true,
    smsToEmail: true,
    smsWebhook: true,
    voicemail: true,
    sipCredentials: true,
    callRecording: true,
    ivr: true,
  },
}

const canAccessFeature = (planKey, feature) => {
  return planFeatureAccess[planKey]?.[feature] === true
}

const upgradeMessage = (feature, currentPlan) => {
  const needed = feature === 'callRecording' || feature === 'ivr' ? 'Business' : 'Pro'
  return `🔒 <b>${feature === 'voicemail' ? 'Voicemail' : feature === 'sipCredentials' ? 'SIP Credentials' : feature === 'smsToEmail' ? 'SMS to Email' : feature === 'smsWebhook' ? 'SMS Webhook' : feature === 'callRecording' ? 'Call Recording' : 'IVR / Auto-attendant'}</b> requires the <b>${needed}</b> plan or higher.\n\nYour current plan: <b>${currentPlan}</b>\n\nUpgrade via 🔄 Renew / Change Plan.`
}

const planByButton = {}
planByButton[btn.starterPlan] = 'starter'
planByButton[btn.proPlan] = 'pro'
planByButton[btn.businessPlan] = 'business'

// ── Text messages ──
const txt = {
  hubWelcome: `📞 <b>Cloud Phone Service</b>

Buy virtual phone numbers, receive inbound SMS directly in Telegram, configure call forwarding, voicemail, and connect via SIP.

📩 SMS: <b>Inbound only</b> — receive SMS, not send.
📞 Minutes: All inbound calls (including forwarded calls) count toward your plan minutes.

Select an option:`,

  selectCountry: '📍 Select country for your new phone number:',

  selectType: (country) => `📱 Select number type for <b>${country}</b>:

<b>📍 Local</b> — Geographic number with area code
<b>🆓 Toll-Free</b> — 800/888/877 prefix, nationwide`,

  selectArea: '🏙️ Select area or enter your preferred area code:',
  enterAreaCode: 'Enter area code (e.g. 415):',

  searching: '🔍 Searching available numbers...',

  noSearchResults: '❌ No numbers available for this criteria. Try a different area or country.',

  showNumbers: (location, numbers) => {
    let text = `📞 Available numbers in <b>${location}</b>:\n\n`
    numbers.forEach((n, i) => {
      text += `${i + 1}️⃣  ${formatPhone(n.phone_number)}\n`
    })
    text += '\nTap a number to select it.'
    return text
  },

  selectPlan: (number) => `✅ You selected: <b>${formatPhone(number)}</b>

📋 Choose your plan:

<b>💡 Starter — $${PHONE_STARTER_PRICE}/mo</b>
${plans.starter.minutes} inbound min · ${plans.starter.sms} SMS
${plans.starter.features.join(' · ')}

<b>⭐ Pro — $${PHONE_PRO_PRICE}/mo</b>
${plans.pro.minutes} inbound min · ${plans.pro.sms} SMS
${plans.pro.features.join(' · ')}

<b>👑 Business — $${PHONE_BUSINESS_PRICE}/mo</b>
${plans.business.minutes} inbound min · ${plans.business.sms} SMS
${plans.business.features.join(' · ')}`,

  orderSummary: (number, country, plan, price) => `📋 <b>Order Summary</b>

📞 Number: ${formatPhone(number)}
📍 Location: ${country}
📦 Plan: ${plan.name} — $${price}/mo
📩 SMS: ${plan.sms}/mo included
📞 Minutes: ${plan.minutes} inbound/mo
⚡ Features: ${plan.features.join(', ')}

💰 Total: <b>$${price}/mo</b>
First month billed now.`,

  paymentPrompt: (price) => `Price of Cloud Phone is <b>$${price}</b>.\nPlease choose payment method.`,

  activated: (number, plan, price, sipUser, sipDomain, expiry) => `🎉 <b>Your Cloud Phone is Active!</b>

📞 Number: ${formatPhone(number)}
📦 Plan: ${plan} ($${price}/mo)
📅 Renewal: ${expiry}

━━━ <b>SIP Credentials</b> ━━━
🌐 Server: ${sipDomain}
👤 Username: ${sipUser}
🔑 Password: ●●●●●●●● (use 🔑 SIP Credentials to reveal)
📡 Port: 5060 (UDP/TCP) | 5061 (TLS)

━━━ <b>Quick Setup</b> ━━━
• Softphone: Download Zoiper/Ooma, enter SIP credentials
• SMS: Inbound SMS forwarded to this chat automatically
• Forwarding: Set up via 📱 My Numbers → Call Forwarding`,

  noNumbers: '📱 You don\'t have any phone numbers yet.\n\nTap below to get your first virtual number.',

  myNumbersList: (numbers) => {
    let text = '📱 <b>Your Cloud Phone Numbers:</b>\n\n'
    numbers.forEach((n, i) => {
      const status = n.status === 'active' ? '✅ Active' : n.status === 'suspended' ? '⚠️ Suspended' : '❌ Released'
      text += `${i + 1}️⃣  ${formatPhone(n.phoneNumber)}  ${status}\n`
      text += `    ${n.plan.charAt(0).toUpperCase() + n.plan.slice(1)} Plan · Renews ${shortDate(n.expiresAt)}\n\n`
    })
    return text
  },

  manageNumber: (n) => `⚙️ Managing: <b>${formatPhone(n.phoneNumber)}</b>

Status: ${n.status === 'active' ? '✅ Active' : '⚠️ ' + n.status}
Plan: ${n.plan.charAt(0).toUpperCase() + n.plan.slice(1)} ($${n.planPrice}/mo)
SMS used: ${n.smsUsed || 0} / ${plans[n.plan]?.sms || 0} this month
Minutes: ${n.minutesUsed || 0} / ${plans[n.plan]?.minutes || 0} this month`,

  // Call Forwarding
  forwardingStatus: (number, config) => {
    const status = config?.enabled ? '✅ Active' : '❌ Disabled'
    let text = `📞 Call Forwarding for <b>${formatPhone(number)}</b>\n\nCurrent status: ${status}`
    if (config?.enabled) {
      text += `\nMode: ${config.mode}\nForward to: ${formatPhone(config.forwardTo)}`
    }
    return text
  },
  enterForwardNumber: 'Enter the phone number to forward calls to.\nInclude country code (e.g. +14155551234):',
  forwardingUpdated: (number, forwardTo, mode) => `✅ <b>Call Forwarding Updated!</b>

📞 ${formatPhone(number)}
📲 Forward to: ${formatPhone(forwardTo)}
📋 Mode: ${mode}

All incoming calls will now be forwarded.`,
  forwardingDisabled: (number) => `✅ Call forwarding disabled for ${formatPhone(number)}.`,

  // SMS Settings
  smsSettingsMenu: (number, config) => {
    const tg = config?.toTelegram ? '✅ ON' : '❌ OFF'
    const em = config?.toEmail ? '✅ ' + config.toEmail : '❌ OFF'
    const wh = config?.webhookUrl ? '✅ Set' : '❌ Not Set'
    return `📩 SMS Settings for <b>${formatPhone(number)}</b>

📲 SMS to Telegram: ${tg}
📧 SMS to Email: ${em}
🔗 Webhook URL: ${wh}`
  },
  smsToggled: (channel, state) => `${channel} is now ${state ? '✅ ON' : '❌ OFF'}`,
  enterEmail: 'Enter the email address to forward SMS messages to:',
  emailSet: (email) => `✅ SMS to Email enabled!\nAll inbound SMS will also be sent to <b>${email}</b>.`,
  enterWebhook: 'Enter your webhook URL (inbound SMS will be POSTed as JSON):',
  webhookSet: (url) => `✅ Webhook URL configured!\nSMS will be POSTed to: ${url}`,

  // Voicemail
  voicemailMenu: (number, config) => {
    if (!config?.enabled) {
      return `🎙️ Voicemail for <b>${formatPhone(number)}</b>\n\nStatus: ❌ Disabled\n\nWhen enabled, unanswered calls will hear a greeting and callers can leave a voice message.`
    }
    const tg = config.forwardToTelegram ? '✅ ON' : '❌ OFF'
    const em = config.forwardToEmail ? '✅ ' + config.forwardToEmail : '❌ OFF'
    const greetType = config.greetingType === 'custom'
      ? (config.customAudioGreetingUrl ? '🎤 Custom Audio' : config.customGreetingText ? '📝 Custom Text' : '🔊 Default')
      : '🔊 Default (TTS)'
    return `🎙️ Voicemail for <b>${formatPhone(number)}</b>\n\nStatus: ✅ Enabled\n🎤 Greeting: ${greetType}\n\n📲 Send to Telegram: ${tg}\n📧 Send to Email: ${em}\n⏰ Ring Time: ${config.ringTimeout || 25}s`
  },
  voicemailEnabled: (number) => `✅ Voicemail enabled for ${formatPhone(number)}!\nRecordings will be sent to this Telegram chat.`,
  voicemailDisabled: (number) => `✅ Voicemail disabled for ${formatPhone(number)}.`,

  vmGreetingMenu: (number, vm) => {
    const type = vm?.greetingType === 'custom' ? '🎤 Custom Audio' : '🔊 Default (text-to-speech)'
    const customText = vm?.customGreetingText ? `\n\nCustom text: "${vm.customGreetingText}"` : ''
    const audioUrl = vm?.customAudioGreetingUrl ? '\n📎 Custom audio file uploaded' : ''
    return `🔊 <b>Voicemail Greeting</b> for <b>${formatPhone(number)}</b>\n\nCurrent: ${type}${customText}${audioUrl}\n\nChoose an option below.`
  },
  vmSendAudioPrompt: '🎤 <b>Custom Audio Greeting</b>\n\nSend a voice message or audio file to use as your voicemail greeting.\n\nCallers will hear this audio when they reach your voicemail.\n\n<i>Tip: Record a professional greeting like "Hi, you\'ve reached [name]. I can\'t answer right now. Please leave a message after the tone."</i>',
  vmAudioSaved: '✅ Custom audio greeting saved! Callers will now hear your uploaded greeting.',
  vmDefaultRestored: '✅ Voicemail greeting reset to default text-to-speech.',
  vmTextGreetingPrompt: 'Enter a custom greeting text (will be read aloud by text-to-speech):',
  vmTextGreetingSet: (text) => `✅ Custom text greeting saved!\n\n"${text}"`,

  // SIP
  sipCredentialsMsg: (number, username, domain) => `🔑 SIP Credentials for <b>${formatPhone(number)}</b>

🌐 SIP Server: ${domain}
👤 Username: ${username}
🔑 Password: ●●●●●●●●
📡 Ports: 5060 (UDP/TCP) · 5061 (TLS)
🎵 Codecs: G.711μ, G.711a, Opus`,

  sipRevealed: (password) => `🔑 Password: <code>${password}</code>\n\n⚠️ Save this now — this message will be deleted in 30 seconds.`,
  sipReset: (password) => `✅ SIP password has been reset!\n\n🔑 New Password: <code>${password}</code>\n\n⚠️ Save this now. Update this password on all your SIP devices.`,
  softphoneGuide: (domain) => `📋 <b>Softphone Setup Guide</b>

━━━ Zoiper (iOS/Android/Desktop) ━━━
1. Download Zoiper from App Store/Google Play
2. Open → Add Account → SIP
3. Enter:
   • Username: (from SIP Credentials)
   • Password: (from Reveal Password)
   • Domain: ${domain}
4. Save → Make a test call

━━━ Any SIP Client ━━━
• SIP Proxy: ${domain}
• Transport: UDP, TCP, or TLS
• Port: 5060 (UDP/TCP) or 5061 (TLS)
• DTMF: RFC 2833
• Codecs: G.711μ preferred`,

  // Renew
  renewMenu: (number, plan, price, expiry, autoRenewOn) => `🔄 Plan for <b>${formatPhone(number)}</b>

Current Plan: ${plan} — $${price}/mo
Renewal Date: ${shortDate(expiry)}
Auto-Renew: ${autoRenewOn ? '✅ ON' : '❌ OFF'}`,

  // Release
  releaseConfirm: (number) => `⚠️ Release <b>${formatPhone(number)}</b>?

This action is <b>permanent</b>. It will:
• Cancel your monthly plan immediately
• Remove all forwarding & voicemail settings
• Delete SIP credentials
• Release the number (cannot be recovered)
• No refund for remaining days`,
  releaseConfirmDigits: (digits) => `Are you absolutely sure?\nType the last 4 digits of the number to confirm: <b>${digits}</b>`,
  released: (number) => `✅ Number ${formatPhone(number)} has been released.\n\nYour plan has been cancelled and all settings removed.`,

  // Real-time events
  inboundSms: (to, from, body, time) => `📩 <b>SMS Received</b>

📞 To: ${formatPhone(to)}
👤 From: ${formatPhone(from)}
🕐 ${time}

💬 "${body}"`,

  missedCall: (to, from, time) => `📞 <b>Missed Call</b>

📞 To: ${formatPhone(to)}
👤 From: ${formatPhone(from)}
🕐 ${time}`,

  callForwarded: (to, from, forwardedTo, duration, time) => `📞 <b>Call Forwarded</b>

📞 To: ${formatPhone(to)}
👤 From: ${formatPhone(from)}
📲 Forwarded: ${formatPhone(forwardedTo)}
⏱️ Duration: ${formatDuration(duration)}
🕐 ${time}`,

  newVoicemail: (to, from, duration, time) => `🎙️ <b>New Voicemail</b>

📞 To: ${formatPhone(to)}
👤 From: ${formatPhone(from)}
⏱️ Duration: ${formatDuration(duration)}
🕐 ${time}`,

  // Admin notifications
  adminPurchase: (user, number, plan, price, method) => `🎉 <b>New Phone Number Purchase!</b>\nUser ${user} bought ${formatPhone(number)}\nPlan: ${plan} ($${price}/mo)\nPayment: ${method}`,
  adminRelease: (user, number, plan) => `📤 <b>Number Released</b>\nUser ${user} released ${formatPhone(number)}\nWas: ${plan} Plan`,

  // Expiry reminders
  expiryReminder: (number, days, plan, price, balance) => `🔔 <b>Renewal Reminder</b>

Your Cloud Phone number ${formatPhone(number)} (${plan} Plan) expires in <b>${days} day${days !== 1 ? 's' : ''}</b>.

Wallet Balance: $${balance}
Plan Price: $${price}/mo${balance < price ? '\n\n⚠️ Insufficient balance. Please deposit funds.' : ''}`,

  autoRenewed: (number, plan, price, newExpiry, oldBal, newBal) => `✅ <b>Auto-Renewal Successful</b>

📞 ${formatPhone(number)}
📦 Plan: ${plan} ($${price}/mo)
📅 New expiry: ${shortDate(newExpiry)}
Wallet: $${oldBal} → $${newBal}`,

  autoRenewFailed: (number, plan, price, balance) => `❌ <b>Auto-Renewal Failed</b>

📞 ${formatPhone(number)}
📦 Plan: ${plan} ($${price}/mo)
💰 Wallet: $${balance} (need $${price})

⚠️ Your number is now SUSPENDED. Deposit funds and renew within 7 days.`,

  // IVR / Auto-attendant (Business Plan)
  ivrMenu: (number, config) => {
    if (!config?.enabled) {
      return `🤖 <b>IVR / Auto-attendant</b> for <b>${formatPhone(number)}</b>\n\nStatus: ❌ Disabled\n\nWhen enabled, callers hear a greeting menu and can press keys to reach the right destination.`
    }
    let text = `🤖 <b>IVR / Auto-attendant</b> for <b>${formatPhone(number)}</b>\n\nStatus: ✅ Enabled\n\n🎤 Greeting: "${config.greeting || 'Default'}"\n\n📋 <b>Menu Options:</b>\n`
    if (config.options && Object.keys(config.options).length > 0) {
      Object.entries(config.options).forEach(([key, opt]) => {
        text += `  Press <b>${key}</b> → ${opt.action === 'forward' ? '📲 Forward to ' + formatPhone(opt.forwardTo) : opt.action === 'voicemail' ? '🎙️ Voicemail' : '🔊 ' + (opt.message || 'Play message')}\n`
      })
    } else {
      text += '  No options configured yet.\n'
    }
    return text
  },
  ivrEnabled: (number) => `✅ IVR / Auto-attendant enabled for ${formatPhone(number)}!\n\nCallers will hear your greeting and can press keys to navigate.`,
  ivrDisabled: (number) => `✅ IVR / Auto-attendant disabled for ${formatPhone(number)}.`,
  ivrSetGreeting: 'Enter the IVR greeting message (what callers will hear):\n\nExample: "Thank you for calling. Press 1 for support, press 2 for sales, or stay on the line."',
  ivrGreetingSet: (greeting) => `✅ IVR greeting updated!\n\n"${greeting}"`,
  ivrAddOption: 'Enter the key and action in this format:\n\n<code>KEY ACTION DESTINATION</code>\n\nExamples:\n• <code>1 forward +14155551234</code>\n• <code>2 voicemail</code>\n• <code>3 message We will call you back</code>\n• <code>0 forward +14155559999</code>',
  ivrOptionAdded: (key, action, destination) => `✅ IVR option added!\n\nPress <b>${key}</b> → ${action === 'forward' ? '📲 Forward to ' + formatPhone(destination) : action === 'voicemail' ? '🎙️ Voicemail' : '🔊 ' + destination}`,
  ivrOptionRemoved: (key) => `✅ IVR option for key <b>${key}</b> removed.`,
  ivrInvalidFormat: '❌ Invalid format. Please use:\n<code>KEY ACTION DESTINATION</code>\n\nExample: <code>1 forward +14155551234</code>',

  ivrAnalyticsReport: (number, data) => {
    let text = `📊 <b>IVR Analytics</b> for <b>${formatPhone(number)}</b>\n(Last 30 days)\n\n`
    text += `📞 Total IVR calls: <b>${data.totalCalls}</b>\n`
    if (data.topOption) {
      text += `🏆 Most pressed: Key <b>${data.topOption.digit}</b> (${data.topOption.count} times, ${data.topOption.percent}%)\n`
    }
    text += '\n'
    if (data.optionBreakdown.length > 0) {
      text += '📋 <b>Option Breakdown:</b>\n'
      data.optionBreakdown.forEach(o => {
        const bar = '█'.repeat(Math.max(1, Math.round(o.percent / 10))) + '░'.repeat(Math.max(0, 10 - Math.round(o.percent / 10)))
        text += `  Key <b>${o.digit}</b>: ${bar} ${o.count} (${o.percent}%)\n`
      })
      text += '\n'
    }
    if (data.recentCalls.length > 0) {
      text += '📱 <b>Recent IVR Calls:</b>\n'
      data.recentCalls.forEach(c => {
        text += `  ${formatPhone(c.from)} → Key <b>${c.digit}</b> (${c.action}) ${shortDate(c.time)}\n`
      })
    }
    if (data.totalCalls === 0) text += '\nNo IVR calls recorded yet.'
    return text
  },

  // Call Recording (Business Plan)
  recordingMenu: (number, config) => {
    const enabled = config?.recording === true
    return `🔴 <b>Call Recording</b> for <b>${formatPhone(number)}</b>\n\nStatus: ${enabled ? '✅ Enabled' : '❌ Disabled'}\n\nWhen enabled, all incoming and outgoing calls will be automatically recorded. Recordings are sent to your Telegram chat.`
  },
  recordingEnabled: (number) => `✅ Call recording enabled for ${formatPhone(number)}!\n\nAll calls will be recorded and sent to this chat.`,
  recordingDisabled: (number) => `✅ Call recording disabled for ${formatPhone(number)}.`,
}

// ── Helpers ──
function formatPhone(num) {
  if (!num) return ''
  const clean = num.replace(/[^+\d]/g, '')
  if (clean.startsWith('+1') && clean.length === 12) {
    return `+1 (${clean.slice(2, 5)}) ${clean.slice(5, 8)}-${clean.slice(8)}`
  }
  return clean
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function shortDate(dateStr) {
  if (!dateStr) return 'N/A'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function generateSipUsername() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'user_'
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function generateSipPassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
  let result = ''
  for (let i = 0; i < 16; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

module.exports = {
  btn,
  txt,
  plans,
  planByButton,
  planFeatureAccess,
  canAccessFeature,
  upgradeMessage,
  countries,
  moreCountries,
  countryByName,
  usAreaCodes,
  areaByLabel,
  formatPhone,
  formatDuration,
  shortDate,
  generateSipUsername,
  generateSipPassword,
  PHONE_STARTER_PRICE,
  PHONE_PRO_PRICE,
  PHONE_BUSINESS_PRICE,
  SIP_DOMAIN,
}
