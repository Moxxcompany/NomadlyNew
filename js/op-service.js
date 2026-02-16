/* global process */
require('dotenv').config()
const axios = require('axios')
const { log } = require('console')

const OP_BASE_URL = 'https://api.openprovider.eu'
const OP_USERNAME = process.env.OPENPROVIDER_USERNAME
const OP_PASSWORD = process.env.OPENPROVIDER_PASSWORD
const PERCENT_INCREASE_DOMAIN = 1 + Number(process.env.PERCENT_INCREASE_DOMAIN || 0)

let cachedToken = null
let tokenExpiry = 0

// ─── Auth ───────────────────────────────────────────────

const authenticate = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  try {
    const res = await axios.post(`${OP_BASE_URL}/v1beta/auth/login`, {
      username: OP_USERNAME,
      password: OP_PASSWORD,
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 })

    if (res.data?.code === 0 && res.data?.data?.token) {
      cachedToken = res.data.data.token
      tokenExpiry = Date.now() + 3500 * 1000
      log('OpenProvider auth success')
      return cachedToken
    }
    log('OpenProvider auth failed:', res.data)
    return null
  } catch (err) {
    log('OpenProvider auth error:', err.message)
    return null
  }
}

const authHeaders = async () => {
  const token = await authenticate()
  if (!token) throw new Error('OpenProvider authentication failed')
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

// ─── Helpers ────────────────────────────────────────────

const parseDomain = (domainName) => {
  const parts = domainName.split('.')
  const name = parts[0]
  const extension = parts.slice(1).join('.')
  return { name, extension }
}

/**
 * Country-specific TLD additional_data for registration
 */
const getCountryTLDData = (tld) => {
  const map = {
    us: { us: { application_purpose: 'P1', nexus_category: 'C12' } },
    ca: { ca: { legal_type: 'CCT' } },
    it: { it: { entity_type: 1, nationality: 'IT', reg_code: '0000000000' } },
    sg: { sg: { rcb_id: 'T08LL1987D', admin_sg_id: 'T08LL1987D' } },
    eu: { eu: { registrant_citizenship: 'US' } },
    fr: { fr: { registrant_legal_form: 'OTHER', registrant_legal_form_other: 'Foreign Company' } },
    es: { es: { registrant_type: 1, id_number: 'X0000000T' } },
    de: {},
    nl: {},
    be: { be: { registrant_lang: 'en' } },
    uk: { uk: { registrant_type: 'IND' } },
    'co.uk': { uk: { registrant_type: 'IND' } },
    au: { au: { registrant_id: 'ABN 12345678901', registrant_id_type: 'ABN', eligibility_type: 'Company' } },
    nz: {},
    in: {},
    br: { br: { registrant_type: 'individual', cpf: '000.000.000-00' } },
    cl: {},
    mx: {},
  }
  return map[tld] || null
}

// ─── Domain availability & pricing ──────────────────────

const checkDomainAvailability = async (domainName) => {
  try {
    const headers = await authHeaders()
    const { name, extension } = parseDomain(domainName)

    const res = await axios.post(`${OP_BASE_URL}/v1beta/domains/check`, {
      domains: [{ name, extension }],
      with_price: true,
    }, { headers, timeout: 15000 })

    if (res.data?.code !== 0) {
      return { available: false, message: res.data?.desc || 'OpenProvider check failed' }
    }

    const results = res.data?.data?.results
    if (!results || results.length === 0) {
      return { available: false, message: 'No results from OpenProvider' }
    }

    const result = results[0]
    const status = (result.status || '').toLowerCase()

    if (status === 'free' || status === 'available') {
      const priceObj = result.price || {}
      const createPrice = parseFloat(priceObj.create?.price || priceObj.product?.price || 0)
      const originalPrice = createPrice < 1 ? 1 : createPrice
      let price = Math.ceil(originalPrice * PERCENT_INCREASE_DOMAIN)
      price = Math.max(price, 25)

      return { available: true, originalPrice, price, registrar: 'OpenProvider' }
    }

    return { available: false, message: 'Domain not available on OpenProvider' }
  } catch (err) {
    log('OP checkDomainAvailability error:', err.message)
    return { available: false, message: `OpenProvider error: ${err.message}` }
  }
}

// ─── Contact handle ─────────────────────────────────────

const getContactHandle = async () => {
  try {
    const headers = await authHeaders()

    const res = await axios.get(`${OP_BASE_URL}/v1beta/customers`, {
      headers, params: { limit: 10 }, timeout: 15000,
    })

    if (res.data?.code === 0) {
      const contacts = res.data?.data?.results || []
      if (contacts.length > 0 && contacts[0].handle) return contacts[0].handle
    }

    const createRes = await axios.post(`${OP_BASE_URL}/v1beta/customers`, {
      name: { first_name: 'Domain', last_name: 'Admin' },
      phone: { country_code: '+1', area_code: '555', subscriber_number: '1234567' },
      email: OP_USERNAME,
      address: {
        street: '123 Business Ave', number: '1',
        zipcode: '10001', city: 'New York', state: 'NY', country: 'US',
      },
    }, { headers, timeout: 15000 })

    if (createRes.data?.code === 0) return createRes.data?.data?.handle
    log('Failed to create OP contact handle:', createRes.data)
    return null
  } catch (err) {
    log('OP getContactHandle error:', err.message)
    return null
  }
}

// ─── Domain registration ────────────────────────────────

const registerDomain = async (domainName, nameservers = []) => {
  try {
    const headers = await authHeaders()
    const { name, extension } = parseDomain(domainName)

    const contactHandle = await getContactHandle()
    if (!contactHandle) return { error: 'Failed to get contact handle for OpenProvider registration' }

    const nsPayload = nameservers.map((ns, i) => ({ name: ns, seq_nr: i + 1 }))
    const contactObj = { handle: contactHandle }

    const regData = {
      domain: { name, extension },
      period: 1,
      owner_handle: contactObj,
      admin_handle: contactObj,
      tech_handle: contactObj,
      billing_handle: contactObj,
      name_servers: nsPayload.length > 0 ? nsPayload : undefined,
      autorenew: 'off',
    }

    // Country-specific TLD data
    const tld = extension.toLowerCase()
    const tldData = getCountryTLDData(tld)
    if (tldData && Object.keys(tldData).length > 0) {
      regData.additional_data = tldData
    }

    const res = await axios.post(`${OP_BASE_URL}/v1beta/domains`, regData, {
      headers, timeout: 30000,
    })

    if (res.data?.code === 0) {
      const domainId = res.data?.data?.id
      log(`OpenProvider domain registered: ${domainName}, ID: ${domainId}`)
      return { success: true, domainId, registrar: 'OpenProvider' }
    }

    const errMsg = res.data?.desc || 'Unknown OpenProvider registration error'
    log('OP registerDomain failed:', errMsg)
    return { error: errMsg }
  } catch (err) {
    log('OP registerDomain error:', err.message, err?.response?.data)
    return { error: `OpenProvider registration error: ${err.message}` }
  }
}

// ─── Domain info ────────────────────────────────────────

const getDomainInfo = async (domainName) => {
  try {
    const headers = await authHeaders()
    const { name, extension } = parseDomain(domainName)

    const searchRes = await axios.get(`${OP_BASE_URL}/v1beta/domains`, {
      headers, params: { domain_name_pattern: name, extension, limit: 1 }, timeout: 15000,
    })

    if (searchRes.data?.code !== 0 || !searchRes.data?.data?.results?.length) return null

    const domainId = searchRes.data.data.results[0].id
    const res = await axios.get(`${OP_BASE_URL}/v1beta/domains/${domainId}`, {
      headers, timeout: 15000,
    })

    if (res.data?.code === 0) {
      const data = res.data.data
      const nameservers = (data.name_servers || []).map(ns => ns.name).filter(Boolean)
      return { domainId, nameservers, status: data.status, expiresAt: data.renewal_date, domainData: data }
    }
    return null
  } catch (err) {
    log('OP getDomainInfo error:', err.message)
    return null
  }
}

// ─── Nameserver management ──────────────────────────────

const updateNameservers = async (domainName, nameservers) => {
  try {
    const info = await getDomainInfo(domainName)
    if (!info || !info.domainId) return { error: 'Domain not found on OpenProvider' }

    const headers = await authHeaders()
    const nsPayload = nameservers.map((ns, i) => ({ name: ns, seq_nr: i + 1 }))

    const res = await axios.put(`${OP_BASE_URL}/v1beta/domains/${info.domainId}`, {
      name_servers: nsPayload,
    }, { headers, timeout: 15000 })

    if (res.data?.code === 0) return { success: true }
    return { error: res.data?.desc || 'Failed to update nameservers' }
  } catch (err) {
    log('OP updateNameservers error:', err.message)
    return { error: err.message }
  }
}

// ─── DNS zone management ────────────────────────────────

/**
 * Get DNS zone records for a domain from OpenProvider's DNS zone API
 */
const listDNSRecords = async (domainName) => {
  try {
    const headers = await authHeaders()

    const res = await axios.get(`${OP_BASE_URL}/v1beta/dns/zones/${domainName}`, {
      headers, timeout: 15000,
    })

    if (res.data?.code === 0 && res.data?.data?.records) {
      return {
        records: (res.data.data.records || []).map(r => ({
          recordType: r.type,
          recordContent: r.value,
          recordName: r.name || domainName,
          ttl: r.ttl,
          priority: r.prio,
        })),
      }
    }
    return { records: [] }
  } catch (err) {
    // Zone may not exist yet; that's OK
    if (err.response?.status === 404) return { records: [] }
    log('OP listDNSRecords error:', err.message)
    return { records: [] }
  }
}

/**
 * Create or enable DNS zone for a domain on OpenProvider,
 * then add a record to it via zone update
 */
const addDNSRecord = async (domainName, recordType, recordValue, hostName) => {
  try {
    const headers = await authHeaders()

    // First try to get existing zone records
    let existingRecords = []
    try {
      const zoneRes = await axios.get(`${OP_BASE_URL}/v1beta/dns/zones/${domainName}`, {
        headers, timeout: 15000,
      })
      if (zoneRes.data?.code === 0) {
        existingRecords = (zoneRes.data.data.records || []).map(r => ({
          type: r.type, name: r.name, value: r.value, ttl: r.ttl, prio: r.prio,
        }))
      }
    } catch (e) {
      // Zone doesn't exist, will create
    }

    const newRecord = {
      type: recordType.toUpperCase(),
      name: hostName || domainName,
      value: recordValue,
      ttl: 300,
    }
    existingRecords.push(newRecord)

    // PUT to create/update zone with all records
    const res = await axios.put(`${OP_BASE_URL}/v1beta/dns/zones/${domainName}`, {
      records: { update: [newRecord] },
    }, { headers, timeout: 15000 })

    if (res.data?.code === 0) return { success: true }
    return { error: res.data?.desc || 'Failed to add DNS record via OpenProvider' }
  } catch (err) {
    log('OP addDNSRecord error:', err.message)
    return { error: err.message }
  }
}

/**
 * Update a DNS record in OpenProvider zone
 */
const updateDNSRecord = async (domainName, originalRecord, newValue, newType) => {
  try {
    const headers = await authHeaders()

    const res = await axios.put(`${OP_BASE_URL}/v1beta/dns/zones/${domainName}`, {
      records: {
        update: [{
          type: (newType || originalRecord.recordType).toUpperCase(),
          name: originalRecord.recordName || domainName,
          value: newValue,
          ttl: originalRecord.ttl || 300,
        }],
        remove: [{
          type: originalRecord.recordType.toUpperCase(),
          name: originalRecord.recordName || domainName,
          value: originalRecord.recordContent,
        }],
      },
    }, { headers, timeout: 15000 })

    if (res.data?.code === 0) return { success: true }
    return { error: res.data?.desc || 'Failed to update DNS record via OpenProvider' }
  } catch (err) {
    log('OP updateDNSRecord error:', err.message)
    return { error: err.message }
  }
}

/**
 * Delete a DNS record from OpenProvider zone
 */
const deleteDNSRecord = async (domainName, record) => {
  try {
    const headers = await authHeaders()

    const res = await axios.put(`${OP_BASE_URL}/v1beta/dns/zones/${domainName}`, {
      records: {
        remove: [{
          type: record.recordType.toUpperCase(),
          name: record.recordName || domainName,
          value: record.recordContent,
        }],
      },
    }, { headers, timeout: 15000 })

    if (res.data?.code === 0) return { success: true }
    return { error: res.data?.desc || 'Failed to delete DNS record via OpenProvider' }
  } catch (err) {
    log('OP deleteDNSRecord error:', err.message)
    return { error: err.message }
  }
}

module.exports = {
  authenticate,
  checkDomainAvailability,
  registerDomain,
  getDomainInfo,
  updateNameservers,
  getContactHandle,
  parseDomain,
  getCountryTLDData,
  listDNSRecords,
  addDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
}
