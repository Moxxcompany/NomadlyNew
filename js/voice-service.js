// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Voice Service — Call Handling with IVR, Recording & Feature-Gating
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { log } = require('console')
const { get, set } = require('./db.js')
const { formatPhone, formatDuration, canAccessFeature } = require('./phone-config.js')

let _bot = null
let _phoneNumbersOf = null
let _phoneLogs = null
let _telnyxApi = null
let _telnyxResources = null
let _translation = null
let _ivrAnalytics = null

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
  log('[VoiceService] Initialized with IVR + Recording + Analytics support')
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
        // Speak finished — used for IVR greeting flow
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
// CALL INITIATED — Answer incoming calls
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleCallInitiated(payload) {
  const callControlId = payload.call_control_id
  const to = (payload.to || '').replace(/[^+\d]/g, '')
  const from = (payload.from || '').replace(/[^+\d]/g, '')
  const direction = payload.direction

  if (direction !== 'incoming') return

  // Lookup number owner
  const { chatId, num } = await findNumberOwner(to)
  if (!chatId || !num) {
    log(`[Voice] No owner found for ${to}, answering and hanging up`)
    await _telnyxApi.answerCall(callControlId)
    return
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

  const { num, chatId } = session

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

  // 2. Call Forwarding
  if (fwdConfig?.enabled && fwdConfig.forwardTo) {
    session.phase = 'forwarding'
    const mode = fwdConfig.mode || 'always'

    if (mode === 'always') {
      log(`[Voice] Forwarding call to ${fwdConfig.forwardTo}`)
      await _telnyxApi.transferCall(callControlId, fwdConfig.forwardTo)
      return
    }
    // For 'no_answer' mode, wait then forward
    if (mode === 'no_answer') {
      session.phase = 'ringing'
      session.forwardAfterTimeout = true
      const ringTime = (fwdConfig.ringTimeout || 25) * 1000
      setTimeout(async () => {
        const current = activeCalls[callControlId]
        if (current && current.phase === 'ringing') {
          log(`[Voice] No answer after ${fwdConfig.ringTimeout}s, forwarding to ${fwdConfig.forwardTo}`)
          current.phase = 'forwarding'
          await _telnyxApi.transferCall(callControlId, fwdConfig.forwardTo)
        }
      }, ringTime)
      return
    }
  }

  // 3. Voicemail — Pro/Business
  if (vmConfig?.enabled && canAccessFeature(num.plan, 'voicemail')) {
    session.phase = 'voicemail_greeting'
    
    // Check for custom audio greeting first
    if (vmConfig.greetingType === 'custom' && vmConfig.customAudioGreetingUrl) {
      // Play the custom audio file via Telnyx playback
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
    
    // Text-to-speech greeting
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
    // Invalid or no input — replay or hang up
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

  // Execute the IVR option
  switch (option.action) {
    case 'forward':
      session.phase = 'ivr_forward'
      log(`[Voice] IVR: forwarding to ${option.forwardTo}`)
      await _telnyxApi.transferCall(callControlId, option.forwardTo)
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
    // Start recording voicemail
    session.phase = 'voicemail_recording'
    log(`[Voice] Starting voicemail recording for ${session.num.phoneNumber}`)
    await _telnyxApi.startRecording(callControlId, 'single')

    // Auto-stop after 60 seconds
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
    // Voicemail
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

    // Log
    logEvent(to, from, 'voicemail', duration, recordingUrl)
    return
  }

  // Regular call recording (Business plan)
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
// CALL HANGUP — Cleanup
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function handleCallHangup(payload) {
  const callControlId = payload.call_control_id
  const session = activeCalls[callControlId]
  if (!session) return

  const duration = payload.duration_secs || 0
  const { chatId, num, from, to } = session
  const time = new Date().toLocaleString()

  // Notify based on phase
  if (session.phase === 'forwarding' || session.phase === 'ivr_forward') {
    const forwardTo = num.features?.callForwarding?.forwardTo || 'unknown'
    const msg = `📞 <b>Call Forwarded</b>\n\n📞 To: ${formatPhone(to)}\n👤 From: ${formatPhone(from)}\n📲 Forwarded: ${formatPhone(forwardTo)}\n⏱️ Duration: ${formatDuration(duration)}\n🕐 ${time}`
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
        if (num.phoneNumber?.replace(/[^+\d]/g, '') === clean && num.status === 'active') {
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

    // Count per digit
    const digitCounts = {}
    for (const entry of all) {
      const d = entry.digit || '?'
      digitCounts[d] = (digitCounts[d] || 0) + 1
    }

    // Sort by count descending
    const optionBreakdown = Object.entries(digitCounts)
      .map(([digit, count]) => ({ digit, count, percent: totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)

    const topOption = optionBreakdown.length > 0 ? optionBreakdown[0] : null

    // Recent 5 calls
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
}
