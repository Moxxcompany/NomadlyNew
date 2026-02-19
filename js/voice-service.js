// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Voice Service — Call Handling with IVR, Recording, Limits & Feature-Gating
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { log } = require('console')
const { get, set, atomicIncrement } = require('./db.js')
const { formatPhone, formatDuration, canAccessFeature, plans, OVERAGE_RATE_MIN, OVERAGE_RATE_SMS, CALL_FORWARDING_RATE_MIN } = require('./phone-config.js')
const { getBalance } = require('./utils.js')

let _bot = null
let _phoneNumbersOf = null
let _phoneLogs = null
let _telnyxApi = null
let _telnyxResources = null
let _translation = null
let _ivrAnalytics = null
let _walletOf = null
let _payments = null
let _nanoid = null

// In-memory store for active call sessions (callControlId → session data)
const activeCalls = {}

function initVoiceService(deps) {
  _bot = deps.bot
  _phoneNumbersOf = deps.phoneNumbersOf
  _phoneLogs = deps.phoneLogs
  _telnyxApi = deps.telnyxApi
  _telnyxResources = deps.telnyxResources
  _translation = deps.translation
  _ivrAnalytics = deps.ivrAnalytics
  _walletOf = deps.walletOf
  _payments = deps.payments
  _nanoid = deps.nanoid
  log('[VoiceService] Initialized with IVR + Recording + Analytics + Limits + Overage billing')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USAGE LIMIT HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getMinuteLimit(planKey) {
  const plan = plans[planKey]
  if (!plan) return 0
  if (plan.minutes === 'Unlimited') return Infinity
  return plan.minutes || 0
}

function getSmsLimit(planKey) {
  const plan = plans[planKey]
  if (!plan) return 0
  return plan.sms || 0
}

function isMinuteLimitReached(num) {
  const limit = getMinuteLimit(num.plan)
  if (limit === Infinity) return false
  const used = num.minutesUsed || 0
  return used >= limit
}

function isSmsLimitReached(num) {
  const limit = getSmsLimit(num.plan)
  const used = num.smsUsed || 0
  return used >= limit
}

// Atomically increment minutesUsed for a phone number in DB
async function incrementMinutesUsed(chatId, phoneNumber, minutes) {
  try {
    const userData = await get(_phoneNumbersOf, chatId)
    const numbers = userData?.numbers || []
    const idx = numbers.findIndex(n => n.phoneNumber === phoneNumber)
    if (idx === -1) return
    numbers[idx].minutesUsed = (numbers[idx].minutesUsed || 0) + minutes
    // Check if just hit limit and notify
    const limit = getMinuteLimit(numbers[idx].plan)
    const used = numbers[idx].minutesUsed
    if (limit !== Infinity && used >= limit && !numbers[idx]._minLimitNotified) {
      numbers[idx]._minLimitNotified = true
      const msg = `⚠️ <b>Plan Minutes Exhausted</b>\n\n📞 ${formatPhone(phoneNumber)}\nUsed: <b>${used}/${limit}</b> minutes this cycle.\n\nOverage billing is now active at <b>$${OVERAGE_RATE_MIN}/min</b> from your wallet. Service pauses if wallet is empty. Top up or upgrade your plan.`
      _bot?.sendMessage(chatId, msg, { parse_mode: 'HTML' }).catch(() => {})
    }
    await set(_phoneNumbersOf, chatId, { numbers })
  } catch (e) {
    log(`[Voice] incrementMinutesUsed error: ${e.message}`)
  }
}

// Atomically increment smsUsed for a phone number in DB
async function incrementSmsUsed(chatId, phoneNumber) {
  try {
    const userData = await get(_phoneNumbersOf, chatId)
    const numbers = userData?.numbers || []
    const idx = numbers.findIndex(n => n.phoneNumber === phoneNumber)
    if (idx === -1) return
    numbers[idx].smsUsed = (numbers[idx].smsUsed || 0) + 1
    // Check if just hit limit and notify
    const limit = getSmsLimit(numbers[idx].plan)
    const used = numbers[idx].smsUsed
    if (used >= limit && !numbers[idx]._smsLimitNotified) {
      numbers[idx]._smsLimitNotified = true
      const msg = `⚠️ <b>Plan SMS Exhausted</b>\n\n📞 ${formatPhone(phoneNumber)}\nUsed: <b>${used}/${limit}</b> inbound SMS this cycle.\n\nOverage billing is now active at <b>$${OVERAGE_RATE_SMS}/SMS</b> from your wallet. Service pauses if wallet is empty. Top up or upgrade your plan.`
      _bot?.sendMessage(chatId, msg, { parse_mode: 'HTML' }).catch(() => {})
    }
    await set(_phoneNumbersOf, chatId, { numbers })
  } catch (e) {
    log(`[Voice] incrementSmsUsed error: ${e.message}`)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN WEBHOOK HANDLER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleVoiceWebhook(req, res) {
  res.sendStatus(200)

  try {
    const event = req.body?.data || req.body
    const eventType = event?.event_type || event?.type
    const payload = event?.payload || event

    if (!eventType) return

    log(`[Voice] Event: ${eventType}`)

    switch (eventType) {
      case 'call.initiated':
        await handleCallInitiated(payload)
        break
      case 'call.answered':
        await handleCallAnswered(payload)
        break
      case 'call.hangup':
        await handleCallHangup(payload)
        break
      case 'call.gather.ended':
        await handleGatherEnded(payload)
        break
      case 'call.recording.saved':
        await handleRecordingSaved(payload)
        break
      case 'call.speak.ended':
        await handleSpeakEnded(payload)
        break
      case 'call.playback.ended':
        await handleSpeakEnded(payload)
        break
      default:
        log(`[Voice] Unhandled event: ${eventType}`)
    }
  } catch (e) {
    log(`[Voice] Webhook error: ${e.message}`)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CALL INITIATED — Answer or reject based on limits
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleCallInitiated(payload) {
  const callControlId = payload.call_control_id
  const to = (payload.to || '').replace(/[^+\d]/g, '')
  const from = (payload.from || '').replace(/[^+\d]/g, '')
  const direction = payload.direction

  if (direction !== 'incoming') return

  // Lookup number owner — get FRESH data from DB
  const { chatId, num } = await findNumberOwner(to)
  if (!chatId || !num) {
    log(`[Voice] No owner found for ${to}, rejecting`)
    await _telnyxApi.answerCall(callControlId)
    setTimeout(() => _telnyxApi.hangupCall(callControlId), 1000)
    return
  }

  // ── CHECK: Number suspended? ──
  if (num.status !== 'active') {
    log(`[Voice] Number ${to} is ${num.status}, rejecting call`)
    await _telnyxApi.answerCall(callControlId)
    await _telnyxApi.speakOnCall(callControlId, 'This number is no longer in service.')
    setTimeout(() => _telnyxApi.hangupCall(callControlId), 4000)
    return
  }

  // ── CHECK: Inbound minutes limit reached? → Try overage billing ──
  if (isMinuteLimitReached(num)) {
    let overageAllowed = false
    if (_walletOf) {
      try {
        const { usdBal } = await getBalance(_walletOf, chatId)
        if (usdBal >= OVERAGE_RATE_MIN) {
          overageAllowed = true
          log(`[Voice] Minutes limit reached for ${to}, but wallet has $${usdBal} — allowing overage`)
        }
      } catch (e) { log(`[Voice] Overage check error: ${e.message}`) }
    }
    if (!overageAllowed) {
      log(`[Voice] Minutes limit reached for ${to} (${num.minutesUsed || 0}/${getMinuteLimit(num.plan)}), no wallet balance — rejecting call`)
      await _telnyxApi.answerCall(callControlId)
      await _telnyxApi.speakOnCall(callControlId, 'Your inbound minutes limit has been reached and wallet balance is insufficient. Please top up your wallet or upgrade your plan.')
      setTimeout(() => _telnyxApi.hangupCall(callControlId), 6000)
      _bot?.sendMessage(chatId, `🚫 <b>Incoming Call Blocked — Wallet Empty</b>\n\n📞 ${formatPhone(to)}\n👤 Caller: ${formatPhone(from)}\n\nPlan minutes exhausted and wallet balance is insufficient for overage ($${OVERAGE_RATE_MIN}/min). Top up your wallet or upgrade your plan to resume receiving calls.`, { parse_mode: 'HTML' }).catch(() => {})
      return
    }
  }

  // Store session data
  activeCalls[callControlId] = {
    chatId,
    num,
    from,
    to,
    startedAt: new Date(),
    phase: 'answering',
    recordingEnabled: num.features?.recording === true && canAccessFeature(num.plan, 'callRecording'),
  }

  // ── MID-CALL LIMIT MONITOR ──
  // For forwarded calls: check wallet can cover CALL_FORWARDING_RATE_MIN each minute
  // For regular calls: check plan minutes + overage
  const minuteLimit = getMinuteLimit(num.plan)
  const sessionRef = activeCalls[callControlId]
  sessionRef._limitTimer = setInterval(async () => {
    const sess = activeCalls[callControlId]
    if (!sess) { clearInterval(sessionRef._limitTimer); return }
    const elapsedSec = Math.floor((Date.now() - sess.startedAt.getTime()) / 1000)
    const elapsedMin = Math.ceil(elapsedSec / 60)

    // Forwarded calls: bill at CALL_FORWARDING_RATE_MIN per minute from wallet
    if (sess.phase === 'forwarding' || sess.phase === 'ivr_forward') {
      if (_walletOf) {
        try {
          const { usdBal } = await getBalance(_walletOf, chatId)
          if (usdBal >= CALL_FORWARDING_RATE_MIN) {
            await atomicIncrement(_walletOf, chatId, 'usdOut', CALL_FORWARDING_RATE_MIN)
            if (!sess._fwdBillingNotified) {
              sess._fwdBillingNotified = true
              _bot?.sendMessage(chatId, `💰 <b>Forwarding Active</b>\n\n📞 ${formatPhone(to)}\nCharging $${CALL_FORWARDING_RATE_MIN}/min from wallet.\nWallet: $${(usdBal - CALL_FORWARDING_RATE_MIN).toFixed(2)}`, { parse_mode: 'HTML' }).catch(() => {})
            }
          } else {
            log(`[Voice] Forwarded call wallet empty for ${to}: $${usdBal}. Disconnecting.`)
            clearInterval(sessionRef._limitTimer)
            sess._limitDisconnect = true
            try {
              await _telnyxApi.speakOnCall(callControlId, 'Your wallet balance has been exhausted. This forwarded call will now end.')
              setTimeout(() => _telnyxApi.hangupCall(callControlId), 5000)
            } catch (e) {
              await _telnyxApi.hangupCall(callControlId).catch(() => {})
            }
            _bot?.sendMessage(chatId, `🚫 <b>Forwarding Ended</b> — Wallet empty.\n⏱️ ~${elapsedMin} min · $${CALL_FORWARDING_RATE_MIN}/min\nTop up <b>$25</b> via 👛 Wallet.`, { parse_mode: 'HTML' }).catch(() => {})
          }
        } catch (e) { log(`[Voice] Mid-call forwarding billing error: ${e.message}`) }
      }
      return
    }

    // Regular (non-forwarded) calls: plan minutes + overage
    if (minuteLimit !== Infinity) {
      const projectedTotal = (num.minutesUsed || 0) + elapsedMin
      if (projectedTotal >= minuteLimit) {
        let canContinue = false
        if (_walletOf) {
          try {
            const { usdBal } = await getBalance(_walletOf, chatId)
            if (usdBal >= OVERAGE_RATE_MIN) {
              canContinue = true
              await atomicIncrement(_walletOf, chatId, 'usdOut', OVERAGE_RATE_MIN)
              if (!sess._overageNotified) {
                sess._overageNotified = true
                _bot?.sendMessage(chatId, `💰 <b>Overage Active</b> — Plan minutes exhausted. $${OVERAGE_RATE_MIN}/min from wallet.\n💳 $${(usdBal - OVERAGE_RATE_MIN).toFixed(2)}`, { parse_mode: 'HTML' }).catch(() => {})
              }
            }
          } catch (e) { log(`[Voice] Mid-call overage error: ${e.message}`) }
        }
        if (!canContinue) {
          log(`[Voice] Mid-call limit reached for ${to}: projected ${projectedTotal}/${minuteLimit} min, no wallet balance. Disconnecting.`)
          clearInterval(sessionRef._limitTimer)
          sess._limitDisconnect = true
          try {
            await _telnyxApi.speakOnCall(callControlId, 'Your call limit and wallet balance have been exhausted. This call will now end.')
            setTimeout(() => _telnyxApi.hangupCall(callControlId), 5000)
          } catch (e) {
            await _telnyxApi.hangupCall(callControlId).catch(() => {})
          }
          _bot?.sendMessage(chatId, `🚫 <b>Call Disconnected — Wallet Empty</b>\n\n📞 ${formatPhone(to)}\n👤 Caller: ${formatPhone(from)}\n⏱️ ~${elapsedMin} min\n\nPlan minutes (${minuteLimit}) exhausted and wallet balance ran out during the call. Top up your wallet ($${OVERAGE_RATE_MIN}/min overage) or upgrade your plan.`, { parse_mode: 'HTML' }).catch(() => {})
        }
      }
    }
  }, 60000)

  // Answer the call
  await _telnyxApi.answerCall(callControlId)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CALL ANSWERED — Route based on features
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleCallAnswered(payload) {
  const callControlId = payload.call_control_id
  const session = activeCalls[callControlId]
  if (!session) return

  const { num, chatId, to, from } = session

  // Start recording if Business plan + recording enabled
  if (session.recordingEnabled) {
    log(`[Voice] Starting call recording for ${num.phoneNumber}`)
    await _telnyxApi.startRecording(callControlId, 'single')
    session.isRecording = true
  }

  // Route based on features priority: IVR > Forwarding > Voicemail > Missed Call
  const ivrConfig = num.features?.ivr
  const fwdConfig = num.features?.callForwarding
  const vmConfig = num.features?.voicemail

  // 1. IVR — Business plan only
  if (ivrConfig?.enabled && canAccessFeature(num.plan, 'ivr') && ivrConfig.options && Object.keys(ivrConfig.options).length > 0) {
    session.phase = 'ivr'
    const greeting = ivrConfig.greeting || 'Thank you for calling. Please listen to the following options.'
    log(`[Voice] Starting IVR for ${num.phoneNumber}`)

    await _telnyxApi.gatherDTMF(callControlId, greeting, {
      minDigits: 1,
      maxDigits: 1,
      timeout: 15000,
      validDigits: Object.keys(ivrConfig.options).join(''),
    })
    return
  }

  // 2. Call Forwarding (billed at CALL_FORWARDING_RATE_MIN from wallet)
  if (fwdConfig?.enabled && fwdConfig.forwardTo) {
    // Check wallet balance for forwarding rate
    let forwardingAllowed = false
    if (_walletOf) {
      try {
        const { usdBal } = await getBalance(_walletOf, chatId)
        if (usdBal >= CALL_FORWARDING_RATE_MIN) {
          forwardingAllowed = true
          // Low balance warning
          const estMinutes = Math.floor(usdBal / CALL_FORWARDING_RATE_MIN)
          if (usdBal < 5) {
            _bot?.sendMessage(chatId, `⚠️ <b>Low Balance</b> — $${usdBal.toFixed(2)} (~${estMinutes} min fwd). Top up <b>$25</b> via 👛 Wallet.`, { parse_mode: 'HTML' }).catch(() => {})
          }
        } else {
          log(`[Voice] Forwarding wallet check: $${usdBal} < $${CALL_FORWARDING_RATE_MIN} required — blocking forward`)
          await _telnyxApi.speakOnCall(callControlId, 'Your wallet balance is insufficient for call forwarding. Please top up your wallet.')
          setTimeout(() => _telnyxApi.hangupCall(callControlId), 5000)
          _bot?.sendMessage(chatId, `🚫 <b>Forwarding Blocked</b> — Wallet $${usdBal.toFixed(2)} (need $${CALL_FORWARDING_RATE_MIN}/min).\nTop up <b>$25</b> via 👛 Wallet.`, { parse_mode: 'HTML' }).catch(() => {})
          return
        }
      } catch (e) { log(`[Voice] Forwarding wallet check error: ${e.message}`) }
    }

    session.phase = 'forwarding'
    session.forwardingRate = CALL_FORWARDING_RATE_MIN
    const mode = fwdConfig.mode || 'always'

    if (mode === 'always') {
      log(`[Voice] Forwarding call to ${fwdConfig.forwardTo} from ${to} (rate: $${CALL_FORWARDING_RATE_MIN}/min)`)
      await _telnyxApi.transferCall(callControlId, fwdConfig.forwardTo, to)
      return
    }
    if (mode === 'no_answer') {
      session.phase = 'ringing'
      session.forwardAfterTimeout = true
      session.forwardingRate = CALL_FORWARDING_RATE_MIN
      const ringTime = (fwdConfig.ringTimeout || 25) * 1000
      setTimeout(async () => {
        const current = activeCalls[callControlId]
        if (current && current.phase === 'ringing') {
          log(`[Voice] No answer after ${fwdConfig.ringTimeout}s, forwarding to ${fwdConfig.forwardTo} from ${to} (rate: $${CALL_FORWARDING_RATE_MIN}/min)`)
          current.phase = 'forwarding'
          await _telnyxApi.transferCall(callControlId, fwdConfig.forwardTo, to)
        }
      }, ringTime)
      return
    }
  }

  // 3. Voicemail — Pro/Business (also counts toward minutes)
  if (vmConfig?.enabled && canAccessFeature(num.plan, 'voicemail')) {
    session.phase = 'voicemail_greeting'
    
    // Check for custom audio greeting first
    if (vmConfig.greetingType === 'custom' && vmConfig.customAudioGreetingUrl) {
      try {
        const axios = require('axios')
        await axios.post(`https://api.telnyx.com/v2/calls/${callControlId}/actions/playback_start`, {
          audio_url: vmConfig.customAudioGreetingUrl,
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            'Content-Type': 'application/json',
          }
        })
      } catch (e) {
        log(`[Voice] Custom audio playback failed, falling back to TTS: ${e.message}`)
        const fallback = vmConfig.customGreetingText || `The person at ${formatPhone(num.phoneNumber)} is unavailable. Please leave a message after the tone.`
        await _telnyxApi.speakOnCall(callControlId, fallback)
      }
      return
    }
    
    const greeting = vmConfig.greetingType === 'custom' && vmConfig.customGreetingText
      ? vmConfig.customGreetingText
      : `The person at ${formatPhone(num.phoneNumber)} is unavailable. Please leave a message after the tone.`
    await _telnyxApi.speakOnCall(callControlId, greeting)
    return
  }

  // 4. No features — notify missed call and hang up
  session.phase = 'missed'
  await _telnyxApi.speakOnCall(callControlId, 'This number is currently unavailable. Please try again later.')
  setTimeout(async () => {
    await _telnyxApi.hangupCall(callControlId)
  }, 5000)

  notifyUser(chatId, num, 'missed', session)
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GATHER ENDED — IVR DTMF selection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleGatherEnded(payload) {
  const callControlId = payload.call_control_id
  const session = activeCalls[callControlId]
  if (!session) return

  const digits = payload.digits || ''
  const { num, chatId } = session
  const ivrConfig = num.features?.ivr

  log(`[Voice] DTMF received: "${digits}" for ${num.phoneNumber}`)

  // Track IVR analytics
  trackIvrAnalytics(num.phoneNumber, chatId, session.from, digits, ivrConfig?.options?.[digits]?.action || 'invalid')

  if (!digits || !ivrConfig?.options?.[digits]) {
    if (!session.ivrRetried) {
      session.ivrRetried = true
      await _telnyxApi.gatherDTMF(callControlId, 'Sorry, that was not a valid option. Please try again.', {
        minDigits: 1,
        maxDigits: 1,
        timeout: 10000,
        validDigits: Object.keys(ivrConfig?.options || {}).join('') || '0123456789',
      })
    } else {
      await _telnyxApi.speakOnCall(callControlId, 'Goodbye.')
      setTimeout(() => _telnyxApi.hangupCall(callControlId), 2000)
    }
    return
  }

  const option = ivrConfig.options[digits]

  switch (option.action) {
    case 'forward':
      session.phase = 'ivr_forward'
      session.forwardingRate = CALL_FORWARDING_RATE_MIN
      log(`[Voice] IVR: forwarding to ${option.forwardTo} from ${session.to} (rate: $${CALL_FORWARDING_RATE_MIN}/min)`)
      await _telnyxApi.transferCall(callControlId, option.forwardTo, session.to)
      notifyUser(chatId, num, 'ivr_forward', session, { digit: digits, forwardTo: option.forwardTo })
      break

    case 'voicemail':
      session.phase = 'voicemail_greeting'
      await _telnyxApi.speakOnCall(callControlId, 'Please leave a message after the tone.')
      break

    case 'message':
      session.phase = 'ivr_message'
      await _telnyxApi.speakOnCall(callControlId, option.message || 'Thank you for calling.')
      setTimeout(() => _telnyxApi.hangupCall(callControlId), 8000)
      notifyUser(chatId, num, 'ivr_message', session, { digit: digits, message: option.message })
      break

    default:
      await _telnyxApi.speakOnCall(callControlId, 'Goodbye.')
      setTimeout(() => _telnyxApi.hangupCall(callControlId), 2000)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPEAK ENDED — After IVR/Voicemail greeting
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleSpeakEnded(payload) {
  const callControlId = payload.call_control_id
  const session = activeCalls[callControlId]
  if (!session) return

  if (session.phase === 'voicemail_greeting') {
    session.phase = 'voicemail_recording'
    log(`[Voice] Starting voicemail recording for ${session.num.phoneNumber}`)
    await _telnyxApi.startRecording(callControlId, 'single')

    setTimeout(async () => {
      const current = activeCalls[callControlId]
      if (current && current.phase === 'voicemail_recording') {
        await _telnyxApi.stopRecording(callControlId)
        await _telnyxApi.hangupCall(callControlId)
      }
    }, 60000)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECORDING SAVED — Deliver voicemail / call recording
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleRecordingSaved(payload) {
  const callControlId = payload.call_control_id
  const session = activeCalls[callControlId]
  if (!session) return

  const recordingUrl = payload.recording_urls?.mp3 || payload.public_recording_urls?.mp3 || payload.recording_urls?.wav
  const duration = payload.duration_secs || 0
  const { chatId, num, from, to } = session
  const time = new Date().toLocaleString()

  if (session.phase === 'voicemail_recording') {
    log(`[Voice] Voicemail saved for ${to} from ${from}: ${recordingUrl}`)

    if (num.features?.voicemail?.forwardToTelegram && recordingUrl) {
      const caption = `🎙️ <b>New Voicemail</b>\n\n📞 To: ${formatPhone(to)}\n👤 From: ${formatPhone(from)}\n⏱️ Duration: ${formatDuration(duration)}\n🕐 ${time}`
      try {
        await _bot.sendAudio(chatId, recordingUrl, { caption, parse_mode: 'HTML' })
      } catch (e) {
        log(`[Voice] Failed to send voicemail audio: ${e.message}`)
        _bot.sendMessage(chatId, caption + `\n\n🔗 <a href="${recordingUrl}">Listen</a>`, { parse_mode: 'HTML' }).catch(() => {})
      }
    }

    logEvent(to, from, 'voicemail', duration, recordingUrl)
    return
  }

  if (session.isRecording && recordingUrl) {
    log(`[Voice] Call recording saved for ${to} from ${from}: ${recordingUrl}`)
    const caption = `🔴 <b>Call Recording</b>\n\n📞 To: ${formatPhone(to)}\n👤 From: ${formatPhone(from)}\n⏱️ Duration: ${formatDuration(duration)}\n🕐 ${time}`
    try {
      await _bot.sendAudio(chatId, recordingUrl, { caption, parse_mode: 'HTML' })
    } catch (e) {
      log(`[Voice] Failed to send recording audio: ${e.message}`)
      _bot.sendMessage(chatId, caption + `\n\n🔗 <a href="${recordingUrl}">Listen</a>`, { parse_mode: 'HTML' }).catch(() => {})
    }

    logEvent(to, from, 'call_recording', duration, recordingUrl)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CALL HANGUP — Cleanup + REAL-TIME minute tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleCallHangup(payload) {
  const callControlId = payload.call_control_id
  const session = activeCalls[callControlId]
  if (!session) return

  // Prevent duplicate hangup processing (Telnyx can fire multiple hangup events for transferred calls)
  if (session._hangupProcessed) return
  session._hangupProcessed = true

  const duration = payload.duration_secs || 0
  const { chatId, num, from, to } = session
  const time = new Date().toLocaleString()

  // ── REAL-TIME MINUTE TRACKING + BILLING ──
  const minutesBilled = duration > 0 ? Math.ceil(duration / 60) : 0
  const isForwarded = session.phase === 'forwarding' || session.phase === 'ivr_forward'
  const effectiveRate = isForwarded ? CALL_FORWARDING_RATE_MIN : OVERAGE_RATE_MIN

  if (minutesBilled > 0) {
    // Forwarded calls: charge forwarding rate per minute from wallet (not plan minutes)
    if (isForwarded && _walletOf) {
      const forwardingCharge = minutesBilled * CALL_FORWARDING_RATE_MIN
      try {
        await atomicIncrement(_walletOf, chatId, 'usdOut', forwardingCharge)
        const ref = _nanoid?.() || `fwd_${Date.now()}`
        if (_payments) set(_payments, ref, `CallForwarding,$${forwardingCharge.toFixed(2)},${chatId},${num.phoneNumber},${new Date()}`)
        log(`[Voice] Forwarding charge: $${forwardingCharge.toFixed(2)} for ${minutesBilled} min on ${num.phoneNumber}`)
        _bot?.sendMessage(chatId, `💰 <b>Forwarding Charge</b>\n\n📞 ${formatPhone(to)}\n📲 Forwarded to: ${formatPhone(num.features?.callForwarding?.forwardTo || 'unknown')}\n⏱️ ${minutesBilled} min × $${CALL_FORWARDING_RATE_MIN} = <b>$${forwardingCharge.toFixed(2)}</b> charged from wallet.`, { parse_mode: 'HTML' }).catch(() => {})
      } catch (e) { log(`[Voice] Forwarding charge error: ${e.message}`) }
    } else {
      // Non-forwarded calls: use plan minutes + overage
      await incrementMinutesUsed(chatId, num.phoneNumber, minutesBilled)

      // Calculate overage minutes and charge wallet
      const plan = plans[num.plan]
      const minuteLimit = plan ? (plan.minutes === 'Unlimited' ? Infinity : plan.minutes) : 0
      if (minuteLimit !== Infinity && _walletOf) {
        const totalUsed = (num.minutesUsed || 0) + minutesBilled
        const overageMinutes = Math.max(0, totalUsed - minuteLimit)
        if (overageMinutes > 0) {
          const overageCharge = overageMinutes * OVERAGE_RATE_MIN
          try {
            await atomicIncrement(_walletOf, chatId, 'usdOut', overageCharge)
            const ref = _nanoid?.() || `ov_${Date.now()}`
            if (_payments) set(_payments, ref, `Overage,CloudPhoneMin,$${overageCharge.toFixed(2)},${chatId},${num.phoneNumber},${new Date()}`)
            log(`[Voice] Overage charged: $${overageCharge.toFixed(2)} for ${overageMinutes} min on ${num.phoneNumber}`)
            _bot?.sendMessage(chatId, `💰 <b>Overage Charge</b>\n\n📞 ${formatPhone(to)}\n⏱️ ${overageMinutes} overage min × $${OVERAGE_RATE_MIN} = <b>$${overageCharge.toFixed(2)}</b> charged from wallet.`, { parse_mode: 'HTML' }).catch(() => {})
          } catch (e) { log(`[Voice] Overage charge error: ${e.message}`) }
        }
      }
    }

    log(`[Voice] Billed ${minutesBilled} min for ${to} (${duration}s call, ${session.phase}, rate: $${effectiveRate}/min)`)
  }

  // Clean up mid-call limit timer
  if (session._limitTimer) {
    clearInterval(session._limitTimer)
  }

  // Notify based on phase
  if (session.phase === 'forwarding' || session.phase === 'ivr_forward') {
    const forwardTo = num.features?.callForwarding?.forwardTo || 'unknown'
    const msg = `📞 <b>Call Forwarded</b>\n\n📞 ${formatPhone(to)} → 📲 ${formatPhone(forwardTo)}\n👤 ${formatPhone(from)}\n⏱️ ${formatDuration(duration)} (${minutesBilled} min) · $${CALL_FORWARDING_RATE_MIN}/min\n🕐 ${time}`
    _bot.sendMessage(chatId, msg, { parse_mode: 'HTML' }).catch(() => {})
    logEvent(to, from, 'forwarded', duration)
  } else if (session.phase === 'missed' || session.phase === 'answering') {
    const msg = `📞 <b>Missed Call</b>\n\n📞 To: ${formatPhone(to)}\n👤 From: ${formatPhone(from)}\n🕐 ${time}`
    _bot.sendMessage(chatId, msg, { parse_mode: 'HTML' }).catch(() => {})
    logEvent(to, from, 'missed', 0)
  }

  // Cleanup
  delete activeCalls[callControlId]
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function findNumberOwner(phoneNumber) {
  try {
    const clean = phoneNumber.replace(/[^+\d]/g, '')
    const allUsers = await _phoneNumbersOf.find({}).toArray()
    for (const user of allUsers) {
      const numbers = user.val?.numbers || []
      for (const num of numbers) {
        if (num.phoneNumber?.replace(/[^+\d]/g, '') === clean && (num.status === 'active' || num.status === 'suspended')) {
          return { chatId: user._id, num }
        }
      }
    }
    return {}
  } catch (e) {
    log(`[Voice] findNumberOwner error: ${e.message}`)
    return {}
  }
}

function notifyUser(chatId, num, type, session, extra = {}) {
  const time = new Date().toLocaleString()
  let msg = ''
  if (type === 'missed') {
    msg = `📞 <b>Missed Call</b>\n\n📞 To: ${formatPhone(session.to)}\n👤 From: ${formatPhone(session.from)}\n🕐 ${time}`
  } else if (type === 'ivr_forward') {
    msg = `📞 <b>IVR Call Routed</b>\n\n📞 To: ${formatPhone(session.to)}\n👤 From: ${formatPhone(session.from)}\nPressed: <b>${extra.digit}</b> → Forwarded to ${formatPhone(extra.forwardTo)}\n🕐 ${time}`
  } else if (type === 'ivr_message') {
    msg = `📞 <b>IVR Call</b>\n\n📞 To: ${formatPhone(session.to)}\n👤 From: ${formatPhone(session.from)}\nPressed: <b>${extra.digit}</b> → Played message\n🕐 ${time}`
  }
  if (msg) _bot.sendMessage(chatId, msg, { parse_mode: 'HTML' }).catch(() => {})
}

function logEvent(to, from, type, duration, recordingUrl) {
  if (!_phoneLogs) return
  _phoneLogs.insertOne({
    phoneNumber: to,
    from,
    type,
    duration: duration || 0,
    recordingUrl: recordingUrl || null,
    timestamp: new Date().toISOString(),
  }).catch(e => log(`[Voice] Log error: ${e.message}`))
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IVR ANALYTICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function trackIvrAnalytics(phoneNumber, chatId, callerFrom, digit, action) {
  if (!_ivrAnalytics) return
  _ivrAnalytics.insertOne({
    phoneNumber,
    chatId,
    callerFrom,
    digit,
    action,
    timestamp: new Date().toISOString(),
  }).catch(e => log(`[Voice] IVR analytics log error: ${e.message}`))
}

async function getIvrAnalytics(phoneNumber, days = 30) {
  if (!_ivrAnalytics) return { totalCalls: 0, optionBreakdown: [], topOption: null, recentCalls: [] }
  try {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString()

    const all = await _ivrAnalytics.find({
      phoneNumber,
      timestamp: { $gte: sinceStr },
    }).sort({ timestamp: -1 }).toArray()

    const totalCalls = all.length

    const digitCounts = {}
    for (const entry of all) {
      const d = entry.digit || '?'
      digitCounts[d] = (digitCounts[d] || 0) + 1
    }

    const optionBreakdown = Object.entries(digitCounts)
      .map(([digit, count]) => ({ digit, count, percent: totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)

    const topOption = optionBreakdown.length > 0 ? optionBreakdown[0] : null

    const recentCalls = all.slice(0, 5).map(e => ({
      from: e.callerFrom,
      digit: e.digit,
      action: e.action,
      time: e.timestamp,
    }))

    return { totalCalls, optionBreakdown, topOption, recentCalls }
  } catch (e) {
    log(`[Voice] IVR analytics query error: ${e.message}`)
    return { totalCalls: 0, optionBreakdown: [], topOption: null, recentCalls: [] }
  }
}

module.exports = {
  handleVoiceWebhook,
  initVoiceService,
  activeCalls,
  getIvrAnalytics,
  incrementSmsUsed,
  isSmsLimitReached,
  isMinuteLimitReached,
  getMinuteLimit,
  getSmsLimit,
}
