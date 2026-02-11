require('dotenv').config()
const axios = require('axios')
const { log } = require('console')

// Test phone numbers (known US mobile numbers)
const testPhones = [
  '12125551234',
  '13105551234',
  '14155551234',
  '17135551234',
  '18625201234',
  '16465551234',
  '12025551234',
  '17185551234',
  '15105551234',
  '14085551234',
]

// ── 1. Test Alcazar API ──
async function testAlcazar(phone) {
  const key = process.env.API_ALCAZAR
  if (!key) return { service: 'Alcazar', status: 'FAIL', error: 'API_ALCAZAR not set' }
  
  const url = `http://api.east.alcazarnetworks.com/api/2.2/lrn?tn=${phone}&extended=true&output=json&key=${key}`
  try {
    const res = await axios.get(url, { timeout: 10000 })
    return { 
      service: 'Alcazar', 
      phone, 
      status: 'OK', 
      lineType: res.data?.LINETYPE || 'N/A',
      carrier: res.data?.LEC || 'N/A',
      raw: JSON.stringify(res.data).substring(0, 200)
    }
  } catch (e) {
    return { service: 'Alcazar', phone, status: 'FAIL', error: e.message.substring(0, 150) }
  }
}

// ── 2. Test NPL (Number Portability Lookup) ──
async function testNpl(phone) {
  const user = process.env.NUMBER_PROBABLITY_API_ID
  const pass = process.env.NUMBER_PROBABLITY_API_PASS
  if (!user || !pass) return { service: 'NPL', status: 'FAIL', error: 'NPL credentials not set' }
  
  const url = `https://api.numberportabilitylookup.com/npl?user=${user}&pass=${pass}&msisdn=${phone}&format=json`
  try {
    const res = await axios.get(url, { timeout: 10000 })
    const rec = res.data?.[0] || res.data
    return { 
      service: 'NPL', 
      phone, 
      status: 'OK', 
      numberType: rec?.numbertype || 'N/A',
      carrier: rec?.operatorname || 'N/A',
      mobile: rec?.mobile,
      reachable: rec?.reachable,
      raw: JSON.stringify(res.data).substring(0, 200)
    }
  } catch (e) {
    return { service: 'NPL', phone, status: 'FAIL', error: e.message.substring(0, 150) }
  }
}

// ── 3. Test Neutrino ──
async function testNeutrino(phone) {
  const userId = process.env.NEUTRINO_ID
  const apiKey = process.env.NEUTRINO_KEY
  if (!userId || !apiKey) return { service: 'Neutrino', status: 'FAIL', error: 'Neutrino credentials not set' }
  
  try {
    const res = await axios.post('https://neutrinoapi.net/phone-validate', 
      { number: `+${phone}` },
      { headers: { 'User-ID': userId, 'API-Key': apiKey }, timeout: 10000 }
    )
    return { 
      service: 'Neutrino', 
      phone, 
      status: 'OK', 
      valid: res.data?.valid,
      isMobile: res.data?.['is-mobile'],
      type: res.data?.type || 'N/A',
      carrier: res.data?.['international-calling-code'] || 'N/A',
      raw: JSON.stringify(res.data).substring(0, 200)
    }
  } catch (e) {
    return { service: 'Neutrino', phone, status: 'FAIL', error: e.message.substring(0, 150) }
  }
}

// ── 4. Test SignalWire (CNAM) ──
async function testSignalwire(phone) {
  const token = process.env.TOKEN_SIGNALWIRE
  if (!token) return { service: 'SignalWire', status: 'FAIL', error: 'TOKEN_SIGNALWIRE not set' }
  
  try {
    const res = await axios.get(
      `https://greetline-llc.signalwire.com/api/relay/rest/lookup/phone_number/%2B${phone}?include=carrier,cnam`,
      { headers: { Accept: 'application/json', Authorization: `Basic ${token}` }, timeout: 10000 }
    )
    return { 
      service: 'SignalWire', 
      phone, 
      status: 'OK', 
      cnam: res.data?.cnam?.caller_id || 'N/A',
      carrier: res.data?.carrier?.name || 'N/A',
      raw: JSON.stringify(res.data).substring(0, 200)
    }
  } catch (e) {
    return { service: 'SignalWire', phone, status: 'FAIL', error: e.message.substring(0, 150) }
  }
}

// ── Run all tests ──
async function runTests() {
  log('=== LEAD CREDENTIAL TEST ===')
  log(`Testing ${testPhones.length} numbers across 4 services\n`)
  
  // Test each service with first 2-3 numbers to avoid burning credits
  const samplePhones = testPhones.slice(0, 3)
  
  log('--- Alcazar API ---')
  for (const phone of samplePhones) {
    const result = await testAlcazar(phone)
    log(JSON.stringify(result, null, 2))
  }
  
  log('\n--- NPL (Number Portability Lookup) ---')
  for (const phone of samplePhones) {
    const result = await testNpl(phone)
    log(JSON.stringify(result, null, 2))
  }
  
  log('\n--- Neutrino API ---')
  for (const phone of samplePhones) {
    const result = await testNeutrino(phone)
    log(JSON.stringify(result, null, 2))
  }
  
  log('\n--- SignalWire CNAM ---')
  for (const phone of samplePhones) {
    const result = await testSignalwire(phone)
    log(JSON.stringify(result, null, 2))
  }
  
  log('\n=== TEST COMPLETE ===')
}

runTests().catch(e => log('Fatal error:', e.message))
