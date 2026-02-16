/* global process */
require('dotenv').config()
const axios = require('axios')
const { log } = require('console')

const CF_BASE_URL = 'https://api.cloudflare.com/client/v4'
const CF_EMAIL = process.env.CLOUDFLARE_EMAIL
const CF_API_KEY = process.env.CLOUDFLARE_API_KEY

const cfHeaders = () => ({
  'X-Auth-Email': CF_EMAIL,
  'X-Auth-Key': CF_API_KEY,
  'Content-Type': 'application/json',
})

// ─── Connection ─────────────────────────────────────────

const testConnection = async () => {
  try {
    if (!CF_EMAIL || !CF_API_KEY) return { success: false, message: 'Cloudflare credentials not configured' }
    const res = await axios.get(`${CF_BASE_URL}/user`, { headers: cfHeaders(), timeout: 10000 })
    if (res.data?.success) return { success: true, email: res.data.result?.email }
    return { success: false, message: 'Cloudflare API auth failed' }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

// ─── Nameservers ────────────────────────────────────────

const getAccountNameservers = async () => {
  try {
    const res = await axios.get(`${CF_BASE_URL}/zones`, {
      headers: cfHeaders(), params: { per_page: 1 }, timeout: 10000,
    })
    if (res.data?.success && res.data.result?.length > 0) {
      const ns = res.data.result[0].name_servers
      if (ns && ns.length >= 2) return ns
    }
    return ['anderson.ns.cloudflare.com', 'leanna.ns.cloudflare.com']
  } catch (err) {
    log('CF getAccountNameservers error:', err.message)
    return ['anderson.ns.cloudflare.com', 'leanna.ns.cloudflare.com']
  }
}

// ─── Zone management ────────────────────────────────────

const createZone = async (domainName) => {
  try {
    const existing = await getZoneByName(domainName)
    if (existing) {
      log(`CF zone already exists for ${domainName}`)
      return {
        success: true,
        zoneId: existing.id,
        nameservers: existing.name_servers || [],
        status: existing.status,
      }
    }

    const res = await axios.post(`${CF_BASE_URL}/zones`, {
      name: domainName, type: 'full',
    }, { headers: cfHeaders(), timeout: 30000 })

    if (res.data?.success) {
      const zone = res.data.result
      log(`CF zone created for ${domainName}`)
      return {
        success: true,
        zoneId: zone.id,
        nameservers: zone.name_servers || [],
        status: zone.status,
      }
    }

    // "already exists" error
    const errors = res.data?.errors || []
    for (const err of errors) {
      if (err.code === 1061) {
        const existing2 = await getZoneByName(domainName)
        if (existing2) {
          return {
            success: true,
            zoneId: existing2.id,
            nameservers: existing2.name_servers || [],
            status: existing2.status,
          }
        }
      }
    }

    return { success: false, errors }
  } catch (err) {
    log('CF createZone error:', err.message)
    return { success: false, errors: [{ message: err.message }] }
  }
}

const getZoneByName = async (domainName) => {
  try {
    const res = await axios.get(`${CF_BASE_URL}/zones`, {
      headers: cfHeaders(), params: { name: domainName }, timeout: 10000,
    })
    if (res.data?.success && res.data.result?.length > 0) return res.data.result[0]
    return null
  } catch (err) {
    log('CF getZoneByName error:', err.message)
    return null
  }
}

const deleteZone = async (zoneId) => {
  try {
    const res = await axios.delete(`${CF_BASE_URL}/zones/${zoneId}`, {
      headers: cfHeaders(), timeout: 10000,
    })
    if (res.data?.success) return { success: true }
    return { success: false }
  } catch (err) {
    if (err.response?.status === 404) return { success: true }
    log('CF deleteZone error:', err.message)
    return { success: false }
  }
}

// ─── DNS record CRUD ────────────────────────────────────

const listDNSRecords = async (zoneId, recordType) => {
  try {
    const params = {}
    if (recordType) params.type = recordType
    const res = await axios.get(`${CF_BASE_URL}/zones/${zoneId}/dns_records`, {
      headers: cfHeaders(), params, timeout: 10000,
    })
    if (res.data?.success) return res.data.result || []
    return []
  } catch (err) {
    log('CF listDNSRecords error:', err.message)
    return []
  }
}

const createDNSRecord = async (zoneId, recordType, name, content, ttl = 300, proxied = false) => {
  try {
    const data = { type: recordType.toUpperCase(), name, content, ttl, proxied }
    const res = await axios.post(`${CF_BASE_URL}/zones/${zoneId}/dns_records`, data, {
      headers: cfHeaders(), timeout: 10000,
    })
    if (res.data?.success) return { success: true, record: res.data.result }
    return { success: false, errors: res.data?.errors || [] }
  } catch (err) {
    log('CF createDNSRecord error:', err.message)
    return { success: false, errors: [{ message: err.message }] }
  }
}

const updateDNSRecord = async (zoneId, recordId, recordType, name, content, ttl = 300, proxied = false) => {
  try {
    const data = { type: recordType.toUpperCase(), name, content, ttl, proxied }
    const res = await axios.put(`${CF_BASE_URL}/zones/${zoneId}/dns_records/${recordId}`, data, {
      headers: cfHeaders(), timeout: 10000,
    })
    if (res.data?.success) return { success: true, record: res.data.result }
    return { success: false, errors: res.data?.errors || [] }
  } catch (err) {
    log('CF updateDNSRecord error:', err.message)
    return { success: false, errors: [{ message: err.message }] }
  }
}

const deleteDNSRecord = async (zoneId, recordId) => {
  try {
    const res = await axios.delete(`${CF_BASE_URL}/zones/${zoneId}/dns_records/${recordId}`, {
      headers: cfHeaders(), timeout: 10000,
    })
    if (res.data?.success) return { success: true }
    return { success: false, errors: res.data?.errors || [] }
  } catch (err) {
    log('CF deleteDNSRecord error:', err.message)
    return { success: false, errors: [{ message: err.message }] }
  }
}

// ─── Default DNS records ────────────────────────────────

/**
 * Create default DNS records for a domain: A record @ + www CNAME
 */
const createDefaultDNSRecords = async (zoneId, domainName, serverIP, recordType = 'A') => {
  const results = []

  // Root record (A or CNAME)
  const rootResult = await createDNSRecord(zoneId, recordType, domainName, serverIP, 300, false)
  results.push({ type: `root-${recordType}`, ...rootResult })

  // www CNAME pointing to root
  if (recordType === 'A') {
    const wwwResult = await createDNSRecord(zoneId, 'CNAME', `www.${domainName}`, domainName, 300, false)
    results.push({ type: 'www-CNAME', ...wwwResult })
  } else if (recordType === 'CNAME') {
    const wwwResult = await createDNSRecord(zoneId, 'CNAME', `www.${domainName}`, serverIP, 300, false)
    results.push({ type: 'www-CNAME', ...wwwResult })
  }

  const allSuccess = results.every(r => r.success)
  return { success: allSuccess, results }
}

module.exports = {
  testConnection,
  getAccountNameservers,
  createZone,
  getZoneByName,
  listDNSRecords,
  createDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
  deleteZone,
  createDefaultDNSRecords,
}
