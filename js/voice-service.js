// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Voice Service — Handle inbound calls, forwarding, voicemail
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const { log } = require('console')
const { formatPhone, formatDuration } = require('./phone-config')
const telnyx = require('./telnyx-service')

// Track active calls for forwarding/voicemail logic
const activeCalls = {}

// ── Main handler for inbound voice webhook from Telnyx ──
async function handleVoiceWebhook(webhookData, bot, phoneNumbersOf, phoneLogs) {
  try {
    const data = webhookData?.data || webhookData
    const eventType = data?.event_type || data?.record_type
    const payload = data?.payload || data

    if (!eventType || !payload) return log('handleVoiceWebhook: no event or payload')

    const callControlId = payload.call_control_id
    const from = payload.from || ''
    const to = payload.to || ''

    log(`Voice event: ${eventType} from=${from} to=${to}`)

    switch (eventType) {
      case 'call.initiated':
        await handleCallInitiated(payload, bot, phoneNumbersOf)
        break
      case 'call.answered':
        log(`Call answered: ${callControlId}`)
        break
      case 'call.hangup':
        await handleCallHangup(payload, bot, phoneNumbersOf, phoneLogs)
        break
      case 'call.recording.saved':
      case 'recording.completed':
        await handleRecordingCompleted(payload, bot, phoneNumbersOf, phoneLogs)
        break
      default:
        log(`Unhandled voice event: ${eventType}`)
    }
  } catch (e) {
    log('handleVoiceWebhook error:', e.message)
  }
}

// ── Handle incoming call ──
async function handleCallInitiated(payload, bot, phoneNumbersOf) {
  const callControlId = payload.call_control_id
  const from = payload.from
  const to = payload.to
  const direction = payload.direction

  if (direction !== 'incoming') return

  // Look up number owner and config
  const cleanTo = (typeof to === 'string' ? to : '').replace(/[^+\d]/g, '')
  const allUsers = await phoneNumbersOf.find({}).toArray()
  let ownerChatId = null
  let numberConfig = null

  for (const user of allUsers) {
    const nums = user.val?.numbers || []
    const found = nums.find(n => n.phoneNumber.replace(/[^+\d]/g, '') === cleanTo && n.status === 'active')
    if (found) {
      ownerChatId = user._id
      numberConfig = found
      break
    }
  }

  if (!ownerChatId || !numberConfig) {
    log(`No owner for inbound call to ${cleanTo}, rejecting`)
    await telnyx.hangupCall(callControlId)
    return
  }

  const fwdConfig = numberConfig.features?.callForwarding || {}
  const vmConfig = numberConfig.features?.voicemail || {}

  // Store call info for later events
  activeCalls[callControlId] = {
    from, to, ownerChatId, numberConfig,
    startTime: Date.now(),
    forwarded: false,
  }

  // Decision: Forward or Voicemail or just ring
  if (fwdConfig.enabled && fwdConfig.forwardTo) {
    if (fwdConfig.mode === 'always' || fwdConfig.mode === 'Always Forward') {
      // Always forward — transfer immediately
      log(`Always forward: ${cleanTo} → ${fwdConfig.forwardTo}`)
      await telnyx.answerCall(callControlId)
      await telnyx.transferCall(callControlId, fwdConfig.forwardTo)
      activeCalls[callControlId].forwarded = true
      return
    }
    // For busy/no_answer modes, answer and set timeout
  }

  // If voicemail is enabled and no forwarding
  if (vmConfig.enabled && !fwdConfig.enabled) {
    // Answer, play greeting, then record
    await telnyx.answerCall(callControlId)
    const greeting = 'The person you are calling is not available. Please leave a message after the tone.'
    await telnyx.speakOnCall(callControlId, greeting)
    // Wait a bit then start recording
    setTimeout(async () => {
      try {
        await telnyx.startRecording(callControlId)
        log(`Voicemail recording started for ${cleanTo}`)
      } catch (e) {
        log('Start recording error:', e.message)
      }
    }, 5000)
    return
  }

  // No forwarding, no voicemail — send missed call notification after timeout
  if (!fwdConfig.enabled && !vmConfig.enabled) {
    const ringTimeout = (vmConfig.ringTimeout || 25) * 1000
    setTimeout(async () => {
      const call = activeCalls[callControlId]
      if (call && !call.answered && !call.forwarded) {
        // Send missed call notification
        const time = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
        const msg = `📞 <b>Missed Call</b>\n\n📞 To: ${formatPhone(to)}\n👤 From: ${formatPhone(from)}\n🕐 ${time}`
        bot?.sendMessage(ownerChatId, msg, { parse_mode: 'HTML' })?.catch(() => {})
      }
    }, ringTimeout)
  }
}

// ── Handle call hangup ──
async function handleCallHangup(payload, bot, phoneNumbersOf, phoneLogs) {
  const callControlId = payload.call_control_id
  const call = activeCalls[callControlId]

  if (call) {
    const duration = Math.floor((Date.now() - call.startTime) / 1000)

    // Log call
    if (phoneLogs?.insertOne) {
      await phoneLogs.insertOne({
        phoneNumber: (typeof call.to === 'string' ? call.to : '').replace(/[^+\d]/g, ''),
        chatId: call.ownerChatId,
        type: 'call',
        direction: 'inbound',
        from: call.from,
        to: call.to,
        duration: duration,
        status: call.forwarded ? 'forwarded' : 'completed',
        timestamp: new Date().toISOString(),
      })
    }

    // Send forwarded notification
    if (call.forwarded) {
      const time = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
      const fwdTo = call.numberConfig?.features?.callForwarding?.forwardTo || ''
      const msg = `📞 <b>Call Forwarded</b>\n\n📞 To: ${formatPhone(call.to)}\n👤 From: ${formatPhone(call.from)}\n📲 Forwarded: ${formatPhone(fwdTo)}\n⏱️ Duration: ${formatDuration(duration)}\n🕐 ${time}`
      bot?.sendMessage(call.ownerChatId, msg, { parse_mode: 'HTML' })?.catch(() => {})
    }

    delete activeCalls[callControlId]
  }
}

// ── Handle voicemail recording completed ──
async function handleRecordingCompleted(payload, bot, phoneNumbersOf, phoneLogs) {
  const callControlId = payload.call_control_id
  const call = activeCalls[callControlId]
  const recordingUrl = payload.recording_urls?.mp3 || payload.public_recording_urls?.mp3 || payload.download_urls?.mp3

  if (!call || !recordingUrl) {
    log('Recording completed but no call context or URL')
    return
  }

  const duration = payload.recording_duration || Math.floor((Date.now() - call.startTime) / 1000)
  const time = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

  const vmConfig = call.numberConfig?.features?.voicemail || {}

  // Send to Telegram
  if (vmConfig.forwardToTelegram !== false) {
    const msg = `🎙️ <b>New Voicemail</b>\n\n📞 To: ${formatPhone(call.to)}\n👤 From: ${formatPhone(call.from)}\n⏱️ Duration: ${formatDuration(duration)}\n🕐 ${time}`
    try {
      await bot.sendMessage(call.ownerChatId, msg, { parse_mode: 'HTML' })
      // Try to send audio file
      await bot.sendAudio(call.ownerChatId, recordingUrl, { caption: `Voicemail from ${formatPhone(call.from)}` })
    } catch (e) {
      log('Send voicemail to Telegram error:', e.message)
    }
  }

  // Send to Email via Brevo
  if (vmConfig.forwardToEmail) {
    const { forwardSmsToEmail } = require('./sms-service')
    await forwardSmsToEmail(vmConfig.forwardToEmail, call.from, call.to, `[Voicemail - ${formatDuration(duration)}] Listen: ${recordingUrl}`)
  }

  // Log
  if (phoneLogs?.insertOne) {
    await phoneLogs.insertOne({
      phoneNumber: (typeof call.to === 'string' ? call.to : '').replace(/[^+\d]/g, ''),
      chatId: call.ownerChatId,
      type: 'call',
      direction: 'inbound',
      from: call.from,
      to: call.to,
      duration: duration,
      status: 'voicemail',
      recordingUrl: recordingUrl,
      timestamp: new Date().toISOString(),
    })
  }

  delete activeCalls[callControlId]
}

module.exports = {
  handleVoiceWebhook,
}
