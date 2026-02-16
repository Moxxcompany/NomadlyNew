/* global process */
require('dotenv').config()
const { log } = require('console')
const { checkDomainPriceOnline } = require('./cr-domain-price-get')
const { buyDomainOnline } = require('./cr-domain-register')
const opService = require('./op-service')
const cfService = require('./cf-service')

/**
 * Unified Domain Service - orchestrates ConnectReseller and OpenProvider
 * with optional Cloudflare DNS management.
 *
 * Flow:
 * 1. Check domain availability on ConnectReseller first
 * 2. If unavailable or error, fallback to OpenProvider
 * 3. On registration, store registrar + nameserver choice in MongoDB
 */

/**
 * Check domain price/availability across registrars
 * Tries ConnectReseller first, falls back to OpenProvider
 *
 * @param {string} domainName
 * @param {object} db - MongoDB database instance
 * @returns {{ available, price, originalPrice, registrar, message }}
 */
const checkDomainPrice = async (domainName, db) => {
  // Try ConnectReseller first
  log(`[domain-service] Checking ${domainName} on ConnectReseller...`)
  const crResult = await checkDomainPriceOnline(domainName)

  if (crResult.available) {
    log(`[domain-service] ${domainName} available on ConnectReseller @ $${crResult.price}`)
    return {
      available: true,
      price: crResult.price,
      originalPrice: crResult.originalPrice,
      registrar: 'ConnectReseller',
      message: crResult.message,
    }
  }

  // Fallback to OpenProvider
  log(`[domain-service] ${domainName} not on CR (${crResult.message}), trying OpenProvider...`)
  const opResult = await opService.checkDomainAvailability(domainName)

  if (opResult.available) {
    log(`[domain-service] ${domainName} available on OpenProvider @ $${opResult.price}`)
    return {
      available: true,
      price: opResult.price,
      originalPrice: opResult.originalPrice,
      registrar: 'OpenProvider',
      message: `Available via OpenProvider`,
    }
  }

  // Both failed
  return {
    available: false,
    price: 0,
    originalPrice: 0,
    registrar: null,
    message: crResult.message || opResult.message || 'Domain not available',
  }
}

/**
 * Register a domain using the appropriate registrar
 *
 * @param {string} domainName
 * @param {string} registrar - 'ConnectReseller' or 'OpenProvider'
 * @param {string} nsChoice - 'provider_default' or 'cloudflare'
 * @param {object} db - MongoDB database instance
 * @param {string} chatId - Telegram chat ID for tracking
 * @returns {{ success, error, registrar, nameservers, cfZoneId }}
 */
const registerDomain = async (domainName, registrar, nsChoice, db, chatId) => {
  let result
  let nameservers = []
  let cfZoneId = null

  // If Cloudflare chosen, create zone first to get nameservers
  if (nsChoice === 'cloudflare') {
    log(`[domain-service] Creating Cloudflare zone for ${domainName}...`)
    const cfResult = await cfService.createZone(domainName)
    if (cfResult.success) {
      nameservers = cfResult.nameservers || []
      cfZoneId = cfResult.zoneId
      log(`[domain-service] Cloudflare zone created. NS: ${nameservers.join(', ')}`)
    } else {
      log(`[domain-service] Cloudflare zone creation failed:`, cfResult.errors)
      // Continue with provider default nameservers
      nsChoice = 'provider_default'
    }
  }

  if (registrar === 'ConnectReseller') {
    // ConnectReseller registration
    if (nsChoice === 'cloudflare' && nameservers.length >= 2) {
      // CR doesn't easily allow custom NS at registration time,
      // so register with defaults then we'll update NS after
      result = await buyDomainOnline(domainName)
      // After successful CR registration, update NS to Cloudflare
      // This is handled by post-registration nameserver update
    } else {
      result = await buyDomainOnline(domainName)
    }

    if (result.success) {
      log(`[domain-service] ${domainName} registered on ConnectReseller`)
    }
  } else if (registrar === 'OpenProvider') {
    // OpenProvider registration - can pass nameservers at registration time
    const ns = nsChoice === 'cloudflare' ? nameservers : []
    result = await opService.registerDomain(domainName, ns)

    if (result.success) {
      log(`[domain-service] ${domainName} registered on OpenProvider (ID: ${result.domainId})`)
    }
  } else {
    return { error: `Unknown registrar: ${registrar}` }
  }

  if (result.error) {
    return { error: result.error }
  }

  // Store domain metadata in MongoDB
  if (db) {
    try {
      await db.collection('domainsOf').updateOne(
        { domainName, chatId: String(chatId) },
        {
          $set: {
            registrar,
            nameserverType: nsChoice,
            cfZoneId: cfZoneId || null,
            opDomainId: result.domainId || null,
            registeredAt: new Date(),
          },
        },
        { upsert: true }
      )
      log(`[domain-service] Stored metadata for ${domainName} in DB`)
    } catch (err) {
      log(`[domain-service] DB update error:`, err.message)
    }
  }

  return {
    success: true,
    registrar,
    nameservers: nsChoice === 'cloudflare' ? nameservers : [],
    cfZoneId,
    opDomainId: result.domainId || null,
  }
}

/**
 * Get domain metadata from MongoDB
 */
const getDomainMeta = async (domainName, db) => {
  if (!db) return null
  try {
    return await db.collection('domainsOf').findOne(
      { domainName },
      { projection: { _id: 0 } }
    )
  } catch (err) {
    log(`[domain-service] getDomainMeta error:`, err.message)
    return null
  }
}

/**
 * View DNS records for a domain - routes to correct service
 */
const viewDNSRecords = async (domainName, db) => {
  const meta = await getDomainMeta(domainName, db)

  // If domain uses Cloudflare nameservers, fetch from Cloudflare
  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId) {
    const records = await cfService.listDNSRecords(meta.cfZoneId)
    return {
      records: records.map(r => ({
        recordType: r.type,
        recordContent: r.content,
        recordName: r.name,
        cfRecordId: r.id,
        ttl: r.ttl,
        proxied: r.proxied,
      })),
      source: 'cloudflare',
      cfZoneId: meta.cfZoneId,
    }
  }

  // If OpenProvider domain (no Cloudflare), get NS info
  if (meta?.registrar === 'OpenProvider') {
    const info = await opService.getDomainInfo(domainName)
    if (info) {
      return {
        records: info.nameservers.map((ns, i) => ({
          recordType: 'NS',
          recordContent: ns,
          nsId: i + 1,
        })),
        source: 'openprovider',
        opDomainId: info.domainId,
      }
    }
  }

  // Default: ConnectReseller
  const viewCRDNS = require('./cr-view-dns-records')
  return { ...(await viewCRDNS(domainName)), source: 'connectreseller' }
}

/**
 * Add a DNS record - routes to correct service
 */
const addDNSRecord = async (domainName, recordType, recordValue, hostName, db) => {
  const meta = await getDomainMeta(domainName, db)

  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId) {
    const name = hostName ? `${hostName}.${domainName}` : domainName
    return await cfService.createDNSRecord(meta.cfZoneId, recordType, name, recordValue)
  }

  if (meta?.registrar === 'OpenProvider') {
    // OpenProvider DNS is managed via nameservers, not direct records
    // If they want to add records, they need Cloudflare
    return { error: 'DNS records for OpenProvider domains require Cloudflare nameservers. Please update your nameserver choice.' }
  }

  // Default: ConnectReseller
  const { saveServerInDomain } = require('./cr-dns-record-add')
  return await saveServerInDomain(domainName, recordValue, recordType, null, null, null, hostName)
}

/**
 * Update a DNS record - routes to correct service
 */
const updateDNSRecord = async (domainName, recordData, db) => {
  const meta = await getDomainMeta(domainName, db)

  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId && recordData.cfRecordId) {
    return await cfService.updateDNSRecord(
      meta.cfZoneId,
      recordData.cfRecordId,
      recordData.recordType,
      recordData.recordName || domainName,
      recordData.recordValue,
      recordData.ttl || 300
    )
  }

  // Default: ConnectReseller
  const { updateDNSRecord: crUpdate } = require('./cr-dns-record-update')
  return await crUpdate(
    recordData.DNSZoneID,
    recordData.DNSZoneRecordID,
    domainName,
    recordData.recordType,
    recordData.recordValue,
    recordData.domainNameId,
    recordData.nsId,
    recordData.dnsRecords,
    recordData.hostName
  )
}

/**
 * Delete a DNS record - routes to correct service
 */
const deleteDNSRecord = async (domainName, recordData, db) => {
  const meta = await getDomainMeta(domainName, db)

  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId && recordData.cfRecordId) {
    return await cfService.deleteDNSRecord(meta.cfZoneId, recordData.cfRecordId)
  }

  // Default: ConnectReseller
  const { deleteDNSRecord: crDelete } = require('./cr-dns-record-del')
  return await crDelete(
    recordData.DNSZoneID,
    recordData.DNSZoneRecordID,
    domainName,
    recordData.domainNameId,
    recordData.nsId,
    recordData.dnsRecords
  )
}

module.exports = {
  checkDomainPrice,
  registerDomain,
  getDomainMeta,
  viewDNSRecords,
  addDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
}
