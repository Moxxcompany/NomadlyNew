require('dotenv').config()
const axios = require('axios')
const { log } = require('console')

// Use more realistic US mobile numbers (not 555 test numbers)
const realishPhones = [
  '14152401761',
  '18622039173', 
  '18622919288',
  '14154700185',
  '13109902195',
]

// ── Fix Neutrino: try different number formats ──
async function testNeutrinoFormats(phone) {
  const userId = process.env.NEUTRINO_ID
  const apiKey = process.env.NEUTRINO_KEY
  
  const formats = [
    { label: 'with +', number: `+${phone}` },
    { label: 'raw', number: phone },
    { label: '+1-formatted', number: `+1${phone.replace(/^1/, '')}` },
  ]
  
  for (const fmt of formats) {
    try {
      const res = await axios.post('https://neutrinoapi.net/phone-validate', 
        { number: fmt.number },
        { headers: { 'User-ID': userId, 'API-Key': apiKey }, timeout: 10000 }
      )
      log(`  Neutrino [${fmt.label}] ${fmt.number}: OK`, JSON.stringify(res.data).substring(0, 200))
      return
    } catch (e) {
      const errData = e.response?.data ? JSON.stringify(e.response.data).substring(0, 200) : 'no body'
      log(`  Neutrino [${fmt.label}] ${fmt.number}: ${e.response?.status || e.message} - ${errData}`)
    }
  }
}

// ── Fix SignalWire: the token might need project:token format ──
async function testSignalwireFormats(phone) {
  const token = process.env.TOKEN_SIGNALWIRE
  
  // Try raw token as-is (Basic auth)
  const formats = [
    { label: 'raw-basic', auth: `Basic ${token}` },
    { label: 'base64-of-token', auth: `Basic ${Buffer.from(token).toString('base64')}` },
    { label: 'token-as-bearer', auth: `Bearer ${token}` },
  ]
  
  for (const fmt of formats) {
    try {
      const res = await axios.get(
        `https://greetline-llc.signalwire.com/api/relay/rest/lookup/phone_number/%2B${phone}?include=carrier,cnam`,
        { headers: { Accept: 'application/json', Authorization: fmt.auth }, timeout: 10000 }
      )
      log(`  SignalWire [${fmt.label}]: OK`, JSON.stringify(res.data).substring(0, 200))
      return
    } catch (e) {
      const errData = e.response?.data ? JSON.stringify(e.response?.data).substring(0, 200) : 'no body'
      log(`  SignalWire [${fmt.label}]: ${e.response?.status || e.message} - ${errData}`)
    }
  }
}

async function runDiagnostics() {
  log('=== DIAGNOSTICS: Better Numbers + Auth Formats ===\n')
  
  // Test Alcazar with real numbers
  log('--- Alcazar (real numbers) ---')
  const key = process.env.API_ALCAZAR
  for (const phone of realishPhones.slice(0, 2)) {
    try {
      const url = `http://api.east.alcazarnetworks.com/api/2.2/lrn?tn=${phone}&extended=true&output=json&key=${key}`
      const res = await axios.get(url, { timeout: 10000 })
      log(`  ${phone}: ${res.data?.LINETYPE} | ${res.data?.LEC}`)
    } catch (e) {
      log(`  ${phone}: FAIL - ${e.message}`)
    }
  }
  
  // Test NPL with real numbers
  log('\n--- NPL (real numbers) ---')
  for (const phone of realishPhones.slice(0, 2)) {
    try {
      const url = `https://api.numberportabilitylookup.com/npl?user=${process.env.NUMBER_PROBABLITY_API_ID}&pass=${process.env.NUMBER_PROBABLITY_API_PASS}&msisdn=${phone}&format=json`
      const res = await axios.get(url, { timeout: 10000 })
      const rec = res.data?.[0] || res.data
      log(`  ${phone}: type=${rec?.numbertype} carrier=${rec?.operatorname} mobile=${rec?.mobile} reachable=${rec?.reachable}`)
    } catch (e) {
      log(`  ${phone}: FAIL - ${e.message}`)
    }
  }
  
  // Test Neutrino with different formats
  log('\n--- Neutrino (format tests) ---')
  await testNeutrinoFormats(realishPhones[0])
  
  // Test SignalWire with different auth approaches
  log('\n--- SignalWire (auth tests) ---')
  await testSignalwireFormats(realishPhones[0])
  
  log('\n=== DIAGNOSTICS COMPLETE ===')
}

runDiagnostics().catch(e => log('Fatal:', e.message))
