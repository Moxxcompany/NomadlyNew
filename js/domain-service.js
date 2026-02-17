/* global process */
require('dotenv').config()
const { log } = require('console')
const { checkDomainPriceOnline } = require('./cr-domain-price-get')
const { buyDomainOnline } = require('./cr-domain-register')
const opService = require('./op-service')
const cfService = require('./cf-service')

/**
 * Unified Domain Service
 * - CR first, fallback to OP for availability/pricing
 * - Supports: provider_default, cloudflare, custom nameservers
 * - Routes DNS ops to correct API based on stored metadata
 */

// ─── Domain check ───────────────────────────────────────

const checkDomainPrice = async (domainName, db) => {
  // Check both registrars in parallel for speed
  log(`[domain-service] Checking ${domainName} on CR + OP in parallel...`)
  const [crResult, opResult] = await Promise.allSettled([
    checkDomainPriceOnline(domainName),
    opService.checkDomainAvailability(domainName),
  ])

  const cr = crResult.status === 'fulfilled' ? crResult.value : { available: false, message: crResult.reason?.message }
  const op = opResult.status === 'fulfilled' ? opResult.value : { available: false, message: opResult.reason?.message }

  // Prefer ConnectReseller if available (primary registrar)
  if (cr.available) {
    log(`[domain-service] ${domainName} available on ConnectReseller @ $${cr.price}`)
    return {
      available: true, price: cr.price,
      originalPrice: cr.originalPrice, registrar: 'ConnectReseller',
      message: cr.message,
    }
  }

  if (op.available) {
    log(`[domain-service] ${domainName} available on OpenProvider @ $${op.price}`)
    return {
      available: true, price: op.price,
      originalPrice: op.originalPrice, registrar: 'OpenProvider',
      message: `Domain is available`,
    }
  }

  return {
    available: false, price: 0, originalPrice: 0, registrar: null,
    message: 'Domain name not available, please try another domain name',
  }
}

/**
 * Check multiple TLD alternatives in parallel
 */
const checkAlternativeTLDs = async (baseName, db) => {
  const tlds = ['com', 'net', 'org', 'io', 'co', 'de', 'fr', 'it', 'xyz', 'sbs', 'app', 'dev']
  const checks = tlds.map(tld => {
    const domain = `${baseName}.${tld}`
    return checkDomainPrice(domain, db).then(r => ({ domain, ...r })).catch(() => ({ domain, available: false }))
  })
  const results = await Promise.allSettled(checks)
  return results
    .filter(r => r.status === 'fulfilled' && r.value.available)
    .map(r => r.value)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5) // Top 5 cheapest
}

// ─── Domain registration ────────────────────────────────

/**
 * @param {string} nsChoice - 'provider_default', 'cloudflare', or 'custom'
 * @param {string[]} customNS - custom nameservers (only when nsChoice === 'custom')
 */
const registerDomain = async (domainName, registrar, nsChoice, db, chatId, customNS) => {
  let result
  let nameservers = []
  let cfZoneId = null

  // Determine nameservers based on choice
  if (nsChoice === 'cloudflare') {
    log(`[domain-service] Creating Cloudflare zone for ${domainName}...`)
    const cfResult = await cfService.createZone(domainName)
    if (cfResult.success) {
      nameservers = cfResult.nameservers || []
      cfZoneId = cfResult.zoneId
      log(`[domain-service] Cloudflare zone created. NS: ${nameservers.join(', ')}`)
    } else {
      log(`[domain-service] Cloudflare zone creation failed:`, cfResult.errors)
      nsChoice = 'provider_default'
    }
  } else if (nsChoice === 'custom' && customNS && customNS.length >= 2) {
    nameservers = customNS
    log(`[domain-service] Using custom NS: ${nameservers.join(', ')}`)
  }

  if (registrar === 'ConnectReseller') {
    result = await buyDomainOnline(domainName)
    if (result.success) {
      log(`[domain-service] ${domainName} registered on ConnectReseller`)
    }
  } else if (registrar === 'OpenProvider') {
    // OP can accept nameservers at registration time
    const ns = (nsChoice === 'cloudflare' || nsChoice === 'custom') ? nameservers : []
    result = await opService.registerDomain(domainName, ns)
    if (result.success) {
      log(`[domain-service] ${domainName} registered on OpenProvider (ID: ${result.domainId})`)
    }
  } else {
    return { error: `Unknown registrar: ${registrar}` }
  }

  if (result.error) return { error: result.error }

  // Store metadata in MongoDB
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
            customNS: nsChoice === 'custom' ? nameservers : null,
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
    success: true, registrar,
    nameservers: nsChoice !== 'provider_default' ? nameservers : [],
    cfZoneId, opDomainId: result.domainId || null,
  }
}

/**
 * Post-registration: update nameservers for custom NS or Cloudflare on CR domains
 */
const postRegistrationNSUpdate = async (domainName, registrar, nsChoice, nameservers, db) => {
  if (nsChoice === 'provider_default') return { success: true }
  if (!nameservers || nameservers.length < 2) return { success: true }

  if (registrar === 'ConnectReseller') {
    // CR: update NS via the CR API
    const { updateDNSRecordNs } = require('./cr-dns-record-update-ns')
    const viewCRDNS = require('./cr-view-dns-records')
    const crData = await viewCRDNS(domainName)
    if (!crData || !crData.domainNameId) {
      return { error: 'Could not fetch CR domain data for NS update' }
    }
    const nsRecords = (crData.records || []).filter(r => r.recordType === 'NS')
    // Update each NS record
    for (let i = 0; i < nameservers.length && i < 4; i++) {
      const existingNS = nsRecords[i]
      if (existingNS) {
        await updateDNSRecordNs(crData.domainNameId, domainName, nameservers[i], existingNS.nsId, nsRecords)
      }
    }
    return { success: true }
  } else if (registrar === 'OpenProvider') {
    // OP was already registered with the nameservers, but update if needed
    return await opService.updateNameservers(domainName, nameservers)
  }
  return { success: true }
}

// ─── Domain metadata ────────────────────────────────────

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

// ─── DNS operations (routing) ───────────────────────────

const viewDNSRecords = async (domainName, db) => {
  const meta = await getDomainMeta(domainName, db)

  // Cloudflare DNS
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

  // OpenProvider DNS (provider_default or custom)
  if (meta?.registrar === 'OpenProvider') {
    const dnsResult = await opService.listDNSRecords(domainName)
    if (dnsResult.records && dnsResult.records.length > 0) {
      return {
        records: dnsResult.records.map(r => ({
          recordType: r.recordType,
          recordContent: r.recordContent,
          recordName: r.recordName,
          ttl: r.ttl,
        })),
        source: 'openprovider',
        opDomainId: meta.opDomainId,
      }
    }
    // Fallback: show nameserver info
    const info = await opService.getDomainInfo(domainName)
    if (info) {
      return {
        records: info.nameservers.map((ns, i) => ({
          recordType: 'NS', recordContent: ns, nsId: i + 1,
        })),
        source: 'openprovider',
        opDomainId: info.domainId,
      }
    }
    return { records: [], source: 'openprovider' }
  }

  // Default: ConnectReseller
  const viewCRDNS = require('./cr-view-dns-records')
  return { ...(await viewCRDNS(domainName)), source: 'connectreseller' }
}

const addDNSRecord = async (domainName, recordType, recordValue, hostName, db) => {
  const meta = await getDomainMeta(domainName, db)

  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId) {
    const name = hostName ? `${hostName}.${domainName}` : domainName
    return await cfService.createDNSRecord(meta.cfZoneId, recordType, name, recordValue)
  }

  if (meta?.registrar === 'OpenProvider') {
    return await opService.addDNSRecord(domainName, recordType, recordValue, hostName || domainName)
  }

  // Default: ConnectReseller
  const { saveServerInDomain } = require('./cr-dns-record-add')
  return await saveServerInDomain(domainName, recordValue, recordType, null, null, null, hostName)
}

const updateDNSRecord = async (domainName, recordData, db) => {
  const meta = await getDomainMeta(domainName, db)

  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId && recordData.cfRecordId) {
    return await cfService.updateDNSRecord(
      meta.cfZoneId, recordData.cfRecordId,
      recordData.recordType, recordData.recordName || domainName,
      recordData.recordValue, recordData.ttl || 300
    )
  }

  if (meta?.registrar === 'OpenProvider') {
    return await opService.updateDNSRecord(domainName, recordData, recordData.recordValue, recordData.recordType)
  }

  // Default: ConnectReseller
  const { updateDNSRecord: crUpdate } = require('./cr-dns-record-update')
  return await crUpdate(
    recordData.DNSZoneID, recordData.DNSZoneRecordID,
    domainName, recordData.recordType, recordData.recordValue,
    recordData.domainNameId, recordData.nsId, recordData.dnsRecords, recordData.hostName
  )
}

const deleteDNSRecord = async (domainName, recordData, db) => {
  const meta = await getDomainMeta(domainName, db)

  if (meta?.nameserverType === 'cloudflare' && meta?.cfZoneId && recordData.cfRecordId) {
    return await cfService.deleteDNSRecord(meta.cfZoneId, recordData.cfRecordId)
  }

  if (meta?.registrar === 'OpenProvider') {
    return await opService.deleteDNSRecord(domainName, recordData)
  }

  // Default: ConnectReseller
  const { deleteDNSRecord: crDelete } = require('./cr-dns-record-del')
  return await crDelete(
    recordData.DNSZoneID, recordData.DNSZoneRecordID,
    domainName, recordData.domainNameId, recordData.nsId, recordData.dnsRecords
  )
}

module.exports = {
  checkDomainPrice,
  checkAlternativeTLDs,
  registerDomain,
  postRegistrationNSUpdate,
  getDomainMeta,
  viewDNSRecords,
  addDNSRecord,
  updateDNSRecord,
  deleteDNSRecord,
}
