// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Telnyx API v2 Service — All HTTP calls to Telnyx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const axios = require('axios')
const { log } = require('console')

const TELNYX_API_KEY = process.env.TELNYX_API_KEY
const BASE = 'https://api.telnyx.com/v2'

const headers = () => ({
  'Authorization': `Bearer ${TELNYX_API_KEY}`,
  'Content-Type': 'application/json'
})

// ── Search available phone numbers ──
async function searchNumbers(countryCode, numberType, areaCode, limit = 5) {
  const params = {
    'filter[country_code]': countryCode || 'US',
    'filter[phone_number_type]': numberType || 'local',
    'filter[limit]': limit,
  }
  if (areaCode) params['filter[national_destination_code]'] = areaCode
  // Request both voice and sms capable numbers
  params['filter[features][]'] = ['sms', 'voice']

  try {
    const res = await axios.get(`${BASE}/available_phone_numbers`, { headers: headers(), params })
    return res.data?.data || []
  } catch (e) {
    log('Telnyx searchNumbers error:', e.response?.data || e.message)
    return []
  }
}

// ── Buy a phone number ──
async function buyNumber(phoneNumber, connectionId, messagingProfileId) {
  try {
    const body = {
      phone_numbers: [{ phone_number: phoneNumber }]
    }
    if (connectionId) body.connection_id = connectionId
    if (messagingProfileId) body.messaging_profile_id = messagingProfileId

    const res = await axios.post(`${BASE}/number_orders`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx buyNumber error:', e.response?.data || e.message)
    return null
  }
}

// ── Update a phone number (assign connection, messaging profile) ──
async function updateNumber(phoneNumberId, updates) {
  try {
    const res = await axios.patch(`${BASE}/phone_numbers/${phoneNumberId}`, updates, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx updateNumber error:', e.response?.data || e.message)
    return null
  }
}

// ── Release a phone number ──
async function releaseNumber(phoneNumberId) {
  try {
    const res = await axios.delete(`${BASE}/phone_numbers/${phoneNumberId}`, { headers: headers() })
    return true
  } catch (e) {
    log('Telnyx releaseNumber error:', e.response?.data || e.message)
    return false
  }
}

// ── List owned phone numbers ──
async function listNumbers() {
  try {
    const res = await axios.get(`${BASE}/phone_numbers`, { headers: headers(), params: { 'page[size]': 100 } })
    return res.data?.data || []
  } catch (e) {
    log('Telnyx listNumbers error:', e.response?.data || e.message)
    return []
  }
}

// ── Create SIP Connection (credential-based) ──
async function createSIPConnection(name, webhookUrl) {
  try {
    const body = {
      active: true,
      connection_name: name,
      user_name: 'nomadly_sip_main',
      password: 'NomadlySIP#2026!Secure',
      webhook_event_url: webhookUrl,
      webhook_api_version: '2',
    }
    const res = await axios.post(`${BASE}/credential_connections`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx createSIPConnection error:', e.response?.data || e.message)
    return null
  }
}

// ── Get SIP Connection details ──
async function getSIPConnection(connectionId) {
  try {
    const res = await axios.get(`${BASE}/credential_connections/${connectionId}`, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx getSIPConnection error:', e.response?.data || e.message)
    return null
  }
}

// ── Create SIP Credential (username/password for a connection) ──
async function createSIPCredential(connectionId, username, password) {
  try {
    const body = {
      connection_id: connectionId,
      sip_username: username,
      sip_password: password,
    }
    const res = await axios.post(`${BASE}/telephony_credentials`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx createSIPCredential error:', e.response?.data || e.message)
    return null
  }
}

// ── Create Messaging Profile ──
async function createMessagingProfile(name, webhookUrl) {
  try {
    const body = {
      name: name,
      webhook_url: webhookUrl,
      webhook_api_version: '2',
      whitelisted_destinations: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
    }
    const res = await axios.post(`${BASE}/messaging_profiles`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx createMessagingProfile error:', e.response?.data || e.message)
    return null
  }
}

// ── Update Messaging Profile webhook ──
async function updateMessagingProfile(profileId, webhookUrl) {
  try {
    const body = { webhook_url: webhookUrl, webhook_api_version: '2' }
    const res = await axios.patch(`${BASE}/messaging_profiles/${profileId}`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx updateMessagingProfile error:', e.response?.data || e.message)
    return null
  }
}

// ── Create Call Control Application ──
async function createCallControlApp(name, webhookUrl) {
  try {
    const body = {
      application_name: name,
      webhook_event_url: webhookUrl,
      webhook_api_version: '2',
    }
    const res = await axios.post(`${BASE}/call_control_applications`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx createCallControlApp error:', e.response?.data || e.message)
    return null
  }
}

// ── Update Call Control Application webhook ──
async function updateCallControlApp(appId, webhookUrl) {
  try {
    const body = { webhook_event_url: webhookUrl, webhook_api_version: '2' }
    const res = await axios.patch(`${BASE}/call_control_applications/${appId}`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx updateCallControlApp error:', e.response?.data || e.message)
    return null
  }
}

// ── Call Control: Answer ──
async function answerCall(callControlId) {
  try {
    const res = await axios.post(`${BASE}/calls/${callControlId}/actions/answer`, {}, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx answerCall error:', e.response?.data || e.message)
    return null
  }
}

// ── Call Control: Transfer ──
async function transferCall(callControlId, toNumber) {
  try {
    const body = { to: toNumber }
    const res = await axios.post(`${BASE}/calls/${callControlId}/actions/transfer`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx transferCall error:', e.response?.data || e.message)
    return null
  }
}

// ── Call Control: Speak (TTS) ──
async function speakOnCall(callControlId, text, voice = 'female', language = 'en-US') {
  try {
    const body = { payload: text, voice, language }
    const res = await axios.post(`${BASE}/calls/${callControlId}/actions/speak`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx speakOnCall error:', e.response?.data || e.message)
    return null
  }
}

// ── Call Control: Record Start ──
async function startRecording(callControlId, channels = 'single', format = 'mp3') {
  try {
    const body = { channels, format }
    const res = await axios.post(`${BASE}/calls/${callControlId}/actions/record_start`, body, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx startRecording error:', e.response?.data || e.message)
    return null
  }
}

// ── Call Control: Hangup ──
async function hangupCall(callControlId) {
  try {
    const res = await axios.post(`${BASE}/calls/${callControlId}/actions/hangup`, {}, { headers: headers() })
    return res.data?.data || null
  } catch (e) {
    log('Telnyx hangupCall error:', e.response?.data || e.message)
    return null
  }
}

// ── Setup: Initialize Telnyx resources (SIP + Messaging Profile + Call Control App) ──
async function initializeTelnyxResources(selfUrl) {
  const voiceWebhook = `${selfUrl}/telnyx/voice-webhook`
  const smsWebhook = `${selfUrl}/telnyx/sms-webhook`

  log('━━━ Initializing Telnyx Resources ━━━')
  log('Voice webhook:', voiceWebhook)
  log('SMS webhook:', smsWebhook)

  let sipConnectionId = process.env.TELNYX_SIP_CONNECTION_ID
  let messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID
  let callControlAppId = process.env.TELNYX_CALL_CONTROL_APP_ID

  // Create SIP Connection if not exists
  if (!sipConnectionId) {
    const sip = await createSIPConnection('Nomadly Cloud Phone SIP', voiceWebhook)
    if (sip) {
      sipConnectionId = sip.id
      log('Created SIP Connection:', sipConnectionId)
    }
  } else {
    log('Using existing SIP Connection:', sipConnectionId)
  }

  // Create Messaging Profile if not exists
  if (!messagingProfileId) {
    const mp = await createMessagingProfile('Nomadly Cloud Phone SMS', smsWebhook)
    if (mp) {
      messagingProfileId = mp.id
      log('Created Messaging Profile:', messagingProfileId)
    }
  } else {
    // Update webhook URL to current domain
    await updateMessagingProfile(messagingProfileId, smsWebhook)
    log('Updated Messaging Profile webhook:', messagingProfileId)
  }

  // Create Call Control App if not exists
  if (!callControlAppId) {
    const app = await createCallControlApp('Nomadly Cloud Phone Voice', voiceWebhook)
    if (app) {
      callControlAppId = app.id
      log('Created Call Control App:', callControlAppId)
    }
  } else {
    await updateCallControlApp(callControlAppId, voiceWebhook)
    log('Updated Call Control App webhook:', callControlAppId)
  }

  log('━━━ Telnyx Resources Ready ━━━')
  log('SIP Connection ID:', sipConnectionId)
  log('Messaging Profile ID:', messagingProfileId)
  log('Call Control App ID:', callControlAppId)

  return { sipConnectionId, messagingProfileId, callControlAppId }
}

module.exports = {
  searchNumbers,
  buyNumber,
  updateNumber,
  releaseNumber,
  listNumbers,
  createSIPConnection,
  getSIPConnection,
  createSIPCredential,
  createMessagingProfile,
  updateMessagingProfile,
  createCallControlApp,
  updateCallControlApp,
  answerCall,
  transferCall,
  speakOnCall,
  startRecording,
  hangupCall,
  initializeTelnyxResources,
}
