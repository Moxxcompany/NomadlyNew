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

/**
 * Authenticate with OpenProvider API and cache the bearer token
 */
const authenticate = async () => {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  try {
    const res = await axios.post(`${OP_BASE_URL}/v1beta/auth/login`, {
      username: OP_USERNAME,
      password: OP_PASSWORD,
    }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 })

    if (res.data?.code === 0 && res.data?.data?.token) {
      cachedToken = res.data.data.token
      tokenExpiry = Date.now() + 3500 * 1000 // ~58 min
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

/**
 * Parse domain name into name + extension parts for OP API
 */
const parseDomain = (domainName) => {
  const parts = domainName.split('.')
  const name = parts[0]
  const extension = parts.slice(1).join('.')
  return { name, extension }
}

/**
 * Check domain availability via OpenProvider
 * Returns { available, price, originalPrice } or { available: false, message }
 */
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
      price = Math.max(price, 25) // Minimum $25

      return {
        available: true,
        originalPrice,
        price,
        registrar: 'OpenProvider',
      }
    }

    return { available: false, message: 'Domain not available on OpenProvider' }
  } catch (err) {
    log('OP checkDomainAvailability error:', err.message)
    return { available: false, message: `OpenProvider error: ${err.message}` }
  }
}

/**
 * Get or create a contact handle for domain registration
 */
const getContactHandle = async () => {
  try {
    const headers = await authHeaders()

    // List existing contacts
    const res = await axios.get(`${OP_BASE_URL}/v1beta/customers`, {
      headers,
      params: { limit: 10 },
      timeout: 15000,
    })

    if (res.data?.code === 0) {
      const contacts = res.data?.data?.results || []
      if (contacts.length > 0) {
        // Return first valid contact handle
        const handle = contacts[0].handle
        if (handle) return handle
      }
    }

    // Create a default contact handle
    const createRes = await axios.post(`${OP_BASE_URL}/v1beta/customers`, {
      name: {
        first_name: 'Domain',
        last_name: 'Admin',
      },
      phone: { country_code: '+1', area_code: '555', subscriber_number: '1234567' },
      email: OP_USERNAME,
      address: {
        street: '123 Business Ave',
        number: '1',
        zipcode: '10001',
        city: 'New York',
        state: 'NY',
        country: 'US',
      },
    }, { headers, timeout: 15000 })

    if (createRes.data?.code === 0) {
      return createRes.data?.data?.handle
    }

    log('Failed to create OP contact handle:', createRes.data)
    return null
  } catch (err) {
    log('OP getContactHandle error:', err.message)
    return null
  }
}

/**
 * Register a domain via OpenProvider
 * @param {string} domainName - e.g. "example.com"
 * @param {string[]} nameservers - e.g. ["ns1.example.com", "ns2.example.com"]
 */
const registerDomain = async (domainName, nameservers = []) => {
  try {
    const headers = await authHeaders()
    const { name, extension } = parseDomain(domainName)

    const contactHandle = await getContactHandle()
    if (!contactHandle) {
      return { error: 'Failed to get contact handle for OpenProvider registration' }
    }

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

    // Handle country-specific TLDs
    const tld = extension.toLowerCase()
    if (tld === 'us') {
      regData.additional_data = { us: { application_purpose: 'P1', nexus_category: 'C12' } }
    } else if (tld === 'ca') {
      regData.additional_data = { ca: { legal_type: 'CCT' } }
    }

    const res = await axios.post(`${OP_BASE_URL}/v1beta/domains`, regData, {
      headers,
      timeout: 30000,
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
    const errMsg = `OpenProvider registration error: ${err.message}`
    log(errMsg, err?.response?.data)
    return { error: errMsg }
  }
}

/**
 * Get domain info (including nameservers) from OpenProvider by domain name
 */
const getDomainInfo = async (domainName) => {
  try {
    const headers = await authHeaders()
    const { name, extension } = parseDomain(domainName)

    // Search for the domain to get its ID
    const searchRes = await axios.get(`${OP_BASE_URL}/v1beta/domains`, {
      headers,
      params: { domain_name_pattern: name, extension, limit: 1 },
      timeout: 15000,
    })

    if (searchRes.data?.code !== 0 || !searchRes.data?.data?.results?.length) {
      return null
    }

    const domainId = searchRes.data.data.results[0].id

    // Get full domain details
    const res = await axios.get(`${OP_BASE_URL}/v1beta/domains/${domainId}`, {
      headers,
      timeout: 15000,
    })

    if (res.data?.code === 0) {
      const data = res.data.data
      const nameservers = (data.name_servers || []).map(ns => ns.name).filter(Boolean)
      return {
        domainId,
        nameservers,
        status: data.status,
        expiresAt: data.renewal_date,
        domainData: data,
      }
    }
    return null
  } catch (err) {
    log('OP getDomainInfo error:', err.message)
    return null
  }
}

/**
 * Update nameservers for an OpenProvider domain
 */
const updateNameservers = async (domainName, nameservers) => {
  try {
    const info = await getDomainInfo(domainName)
    if (!info || !info.domainId) {
      return { error: 'Domain not found on OpenProvider' }
    }

    const headers = await authHeaders()
    const nsPayload = nameservers.map((ns, i) => ({ name: ns, seq_nr: i + 1 }))

    const res = await axios.put(`${OP_BASE_URL}/v1beta/domains/${info.domainId}`, {
      name_servers: nsPayload,
    }, { headers, timeout: 15000 })

    if (res.data?.code === 0) {
      return { success: true }
    }
    return { error: res.data?.desc || 'Failed to update nameservers' }
  } catch (err) {
    log('OP updateNameservers error:', err.message)
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
}
