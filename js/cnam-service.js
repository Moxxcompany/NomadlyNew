// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CNAM Lookup Service — Resolve caller/sender names
// Uses Multitel as primary, SignalWire as fallback
// Results cached in MongoDB to avoid repeat lookups
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const axios = require('axios')
const { log } = require('console')

const MULTITEL_USERNAME = process.env.MULTITEL_USERNAME
const MULTITEL_PASSWORD = process.env.MULTITEL_PASSWORD
const TOKEN_SIGNALWIRE = process.env.TOKEN_SIGNALWIRE

let _cnamCache = null // MongoDB collection

function initCnamService(deps) {
  _cnamCache = deps.cnamCache
  log('[CnamService] Initialized with Multitel + SignalWire + MongoDB cache')
}

// ── Multitel CNAM lookup ──
async function lookupMultitel(phone) {
  const clean = phone.replace(/[^0-9]/g, '')
  const res = await axios({
    method: 'get',
    url: `https://api.multitel.net/v3/cnam/${clean}`,
    auth: { username: MULTITEL_USERNAME, password: MULTITEL_PASSWORD },
    timeout: 8000,
  })
  if (res?.data?.status?.code !== 200) {
    throw new Error(res?.data?.status?.msg || 'Multitel lookup failed')
  }
  return res?.data?.response?.name || null
}

// ── SignalWire CNAM lookup (fallback) ──
async function lookupSignalwire(phone) {
  const clean = phone.replace(/[^0-9]/g, '')
  const res = await axios({
    method: 'get',
    url: `https://greetline-llc.signalwire.com/api/relay/rest/lookup/phone_number/%2B${clean}?include=carrier,cnam`,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${TOKEN_SIGNALWIRE}`,
    },
    timeout: 8000,
  })
  return res?.data?.cnam?.caller_id || null
}

// ── Main CNAM lookup with caching ──
async function lookupCnam(phoneNumber) {
  const clean = phoneNumber.replace(/[^+\d]/g, '')
  if (!clean || clean.length < 7) return null

  // Check cache first
  if (_cnamCache) {
    try {
      const cached = await _cnamCache.findOne({ phone: clean })
      if (cached && cached.name) {
        // Cache hit — return if less than 30 days old
        const age = Date.now() - new Date(cached.updatedAt).getTime()
        if (age < 30 * 24 * 60 * 60 * 1000) {
          return cached.name
        }
      }
    } catch (e) { /* cache miss */ }
  }

  let name = null

  // Try Multitel first
  if (MULTITEL_USERNAME && MULTITEL_PASSWORD) {
    try {
      name = await lookupMultitel(clean)
    } catch (e) {
      log(`[CNAM] Multitel failed for ${clean}: ${e.message}`)
    }
  }

  // Fallback to SignalWire
  if (!name && TOKEN_SIGNALWIRE) {
    try {
      name = await lookupSignalwire(clean)
    } catch (e) {
      log(`[CNAM] SignalWire failed for ${clean}: ${e.message}`)
    }
  }

  // Cache result (even null to avoid re-lookups)
  if (_cnamCache && name) {
    try {
      await _cnamCache.updateOne(
        { phone: clean },
        { $set: { phone: clean, name: name, updatedAt: new Date().toISOString() } },
        { upsert: true }
      )
    } catch (e) {
      log(`[CNAM] Cache write error: ${e.message}`)
    }
  }

  return name
}

// ── Batch CNAM lookup for multiple numbers ──
async function batchLookupCnam(phoneNumbers) {
  const results = {}
  // Process in parallel, max 5 concurrent
  const chunks = []
  for (let i = 0; i < phoneNumbers.length; i += 5) {
    chunks.push(phoneNumbers.slice(i, i + 5))
  }
  for (const chunk of chunks) {
    const promises = chunk.map(async phone => {
      const name = await lookupCnam(phone)
      results[phone] = name
    })
    await Promise.allSettled(promises)
  }
  return results
}

module.exports = {
  initCnamService,
  lookupCnam,
  batchLookupCnam,
}
