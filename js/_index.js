/*global process */
// =====================================================
// EARLY EXPRESS SERVER FOR RAILWAY HEALTH CHECKS
// Start HTTP server immediately to pass health checks
// =====================================================
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const earlyApp = express()
earlyApp.use(cors())
earlyApp.use(express.json())

let appReady = false
let serverStartTime = new Date()

// Health check endpoints - respond immediately
earlyApp.get('/', (req, res) => {
  res.status(200).send(`
    <html>
      <body style="background-color: white;">
        <p style="font-family: 'system-ui';">Nomadly — shorten URLs, register domains, buy phone leads, and grow your business. All from Telegram.

Get started with 5 trial Shortit links — /start
Support: @nomadly_support</p>
      </body>
    </html>
  `)
})

earlyApp.get('/health', (req, res) => {
  res.status(200).json({
    status: appReady ? 'healthy' : 'starting',
    database: appReady ? 'connected' : 'connecting',
    uptime: ((new Date() - serverStartTime) / (1000 * 60 * 60)).toFixed(2) + ' hours'
  })
})

// Start early server immediately
const PORT = process.env.PORT || 5000
const earlyServer = earlyApp.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Early health check server started on port ${PORT}`)
})

// =====================================================
// MAIN APPLICATION CODE CONTINUES BELOW
// =====================================================

const {
  rem,
  html,
  tickerOf,
  discountOn,
  tickerViewOf,
  buyLeadsSelectCountry,
  priceOf,
  buyLeadsSelectArea,
  buyLeadsSelectAreaCode,
  buyLeadsSelectCarrier,
  buyLeadsSelectFormat,
  _buyLeadsSelectAreaCode,
  buyLeadsSelectAmount,
  validatorSelectCountry,
  validatorSelectCarrier,
  validatorSelectAmount,
  validatorSelectFormat,
  dynopayActions,
  tickerOfDyno,
  tickerViewOfDyno,
  continueAtHostbayKeyboard,
  freeDomainsOf,
  freeValidationsOf,
  view,
  targetLeadsTargets,
  targetLeadsCities,
  targetLeadsAreaCodes,
  targetLeadsAreaCodeButtons,
} = require('./config.js')
const { user: configUser } = require('./config.js')
const createShortBitly = require('./bitly.js')
const { createShortUrlApi, analyticsCuttly } = require('./cuttly.js')
const {
  week,
  year,
  month,
  today,
  isAdmin,
  usdToNgn,
  ngnToUsd,
  isValidUrl,
  nextNumber,
  getBalance,
  sendQrCode,
  isDeveloper,
  isValidEmail,
  subscribePlan,
  regularCheckDns,
  sendMessageToAllUsers,
  getBroadcastStats,
  parse,
  extractPhoneNumbers,
  sendQr,
  sleep,
  sendMessage,
  checkFreeTrialTaken,
  removeProtocolFromDomain,
  planCheckExistingDomain,
  planGetNewDomain,
  generateQr,
  date,
} = require('./utils.js')
const fs = require('fs')
const axios = require('axios')
const { log } = require('console')
const { MongoClient, ServerApiVersion } = require('mongodb')
const { customAlphabet } = require('nanoid')
const TelegramBot = require('node-telegram-bot-api')
const { createCheckout } = require('./pay-fincra.js')
const viewDNSRecords = require('./cr-view-dns-records.js')
const { deleteDNSRecord } = require('./cr-dns-record-del.js')
const { buyDomainOnline } = require('./cr-domain-register.js')
const { saveServerInDomain } = require('./cr-dns-record-add.js')
const { updateDNSRecord } = require('./cr-dns-record-update.js')
const { checkDomainPriceOnline } = require('./cr-domain-price-get.js')
const domainService = require('./domain-service.js')
const { saveDomainInServerRailway, saveDomainInServerRender } = require('./rl-save-domain-in-server.js')
const { get, set, del, increment, atomicIncrement, getAll, decrement, insert } = require('./db.js')
const { getRegisteredDomainNames } = require('./cr-domain-purchased-get.js')
const { getCryptoDepositAddress, convert } = require('./pay-blockbee.js')
const { validateBulkNumbers } = require('./validatePhoneBulk.js')
const { countryCodeOf, areasOfCountry } = require('./areasOfCountry.js')
const { validatePhoneBulkFile } = require('./validatePhoneBulkFile.js')
const createCustomShortUrlCuttly = require('./customCuttly.js')
const schedule = require('node-schedule')
const { registerDomainAndCreateCpanel } = require('./cr-register-domain-&-create-cpanel.js')
const { isEmail } = require('validator')
const { 
  getDynopayCryptoAddress,
} = require('./pay-dynopay.js')
const { translation } = require('./translation.js')
const { safeStringify } = require('./utils.js')
const { 
  fetchAvailableCountries,
  fetchAvailableRegionsOfCountry,
  fetchAvailableZones,
  createVPSInstance,
  sendVPSCredentialsEmail,
  getExpiryDateVps,
  changeVpsInstanceStatus,
  fetchAvailableDiskTpes,
  fetchAvailableOS,
  registerVpsTelegram,
  fetchUserSSHkeyList,
  generateNewSSHkey,
  uploadSSHPublicKey,
  fetchAvailableVPSConfigs,
  fetchSelectedCpanelOptions,
  attachSSHKeysToVM,
  fetchUserVPSList,
  fetchVPSDetails,
  deleteVPSinstance,
  setVpsSshCredentials,
  unlinkSSHKeyFromVps,
  changeVpsAutoRenewal,
  downloadSSHKeyFile,
  checkMissingEmailForNameword,
  addUserEmailForNameWord,
  getVpsUpgradePrice,
  upgradeVPSPlanType,
  fetchVpsUpgradeOptions,
  upgradeVPSDiskType,
  renewVPSPlan,
  renewVPSCPanel
} = require('./vm-instance-setup.js')
const { console } = require('inspector')
const BROADCAST_CONFIG = require('./broadcast-config.js')
const { initAutoPromo } = require('./auto-promo.js')
const { initDailyCoupons } = require('./daily-coupons.js')
const telnyxApi = require('./telnyx-service.js')
const { handleInboundSms, initSmsLimits } = require('./sms-service.js')
const { handleVoiceWebhook, initVoiceService, getIvrAnalytics, incrementSmsUsed, isSmsLimitReached } = require('./voice-service.js')
const { initCnamService, lookupCnam, batchLookupCnam } = require('./cnam-service.js')
const phoneConfig = require('./phone-config.js')
const { initPhoneScheduler } = require('./phone-scheduler.js')

process.env['NTBA_FIX_350'] = 1

// Load environment variables from .env file first
require('dotenv').config()
const DB_NAME = process.env.DB_NAME
const SELF_URL = process.env.SELF_URL
const NOT_TRY_CR = process.env.NOT_TRY_CR
const RATE_LEAD = Number(process.env.RATE_LEAD)
const RATE_CNAM = Number(process.env.RATE_CNAM)
const PRICE_BITLY_LINK = Number(process.env.PRICE_BITLY_LINK)
const RATE_LEAD_VALIDATOR = Number(process.env.RATE_LEAD_VALIDATOR)
const RATE_CNAM_VALIDATOR = Number(process.env.RATE_CNAM_VALIDATOR)
const FREE_LINKS = Number(process.env.FREE_LINKS)
const HOSTED_ON = process.env.HOSTED_ON

const CHAT_BOT_NAME = process.env.CHAT_BOT_NAME
const REST_APIS_ON = process.env.REST_APIS_ON
const TELEGRAM_BOT_ON = process.env.TELEGRAM_BOT_ON
const BLOCKBEE_CRYTPO_PAYMENT_ON = process.env.BLOCKBEE_CRYTPO_PAYMENT_ON
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_DEV_CHAT_ID = process.env.TELEGRAM_DEV_CHAT_ID
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID
const FREE_LINKS_TIME_SECONDS = Number(process.env.FREE_LINKS_TIME_SECONDS) * 1000 // to milliseconds
const TELEGRAM_DOMAINS_SHOW_CHAT_ID = Number(process.env.TELEGRAM_DOMAINS_SHOW_CHAT_ID)
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 5)

// HOSTING ENVIRONMENT
const HOSTING_STARTER_PLAN_PRICE = parseFloat(process.env.HOSTING_STARTER_PLAN_PRICE)
const HOSTING_BUSINESS_PLAN_PRICE = parseFloat(process.env.HOSTING_BUSINESS_PLAN_PRICE)
const HOSTING_PRO_PLAN_PRICE = parseFloat(process.env.HOSTING_PRO_PLAN_PRICE)
const VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE = parseFloat(process.env.VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE)
const HOSTING_TRIAL_PLAN_ON = process.env.HOSTING_TRIAL_PLAN_ON

if (!DB_NAME || !RATE_LEAD_VALIDATOR || !HOSTED_ON || !TELEGRAM_BOT_ON || !REST_APIS_ON || !CHAT_BOT_NAME) {
  return log('Service is paused because some ENV variable is missing')
}

let bot

// Initialize bot with webhooks (no polling)
if (TELEGRAM_BOT_ON === 'true') {
  bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { webHook: false })
  log('TELEGRAM_BOT_ON: ' + TELEGRAM_BOT_ON)
  log('Bot initialized with webhook support')
  log('Bot ran away! ' + new Date())
} else {
  bot = {
    on: () => {
    }, sendMessage: () => {
    }, sendPhoto: () => {
    }, sendDocument: () => {
    }, processUpdate: () => {
    },
  }
  log('TELEGRAM_BOT_ON: ' + TELEGRAM_BOT_ON)
  log('Bot ran away! ' + new Date())
}

// Auto-detect when bot is added to or removed from groups
bot?.on('my_chat_member', async update => {
  try {
    const chat = update.chat
    const newStatus = update.new_chat_member?.status
    const chatType = chat?.type

    if (chatType !== 'group' && chatType !== 'supergroup') return

    if (newStatus === 'member' || newStatus === 'administrator') {
      // Bot was added to a group — register it
      if (notifyGroupsCol?.updateOne) {
        await notifyGroupsCol.updateOne(
          { _id: chat.id },
          { $set: { _id: chat.id, title: chat.title, addedAt: new Date().toISOString() } },
          { upsert: true }
        )
        log('Registered group for notifications: ' + chat.title + ' (' + chat.id + ')')
        bot?.sendMessage(chat.id, `${CHAT_BOT_NAME} is now active in this group! You will receive live event notifications here.`)?.catch(() => {})
      }
    } else if (newStatus === 'left' || newStatus === 'kicked') {
      // Bot was removed from a group — unregister it
      if (notifyGroupsCol?.deleteOne) {
        await notifyGroupsCol.deleteOne({ _id: chat.id })
        log('Unregistered group from notifications: ' + chat.title + ' (' + chat.id + ')')
      }
    }
  } catch (e) {
    log('my_chat_member handler error: ' + e.message)
  }
})

const send = (chatId, message, options) => {

// Unified coupon validator — checks static codes + daily auto-generated codes
async function resolveCoupon(code, chatId) {
  // 1. Check static coupons first
  const staticDiscount = discountOn[code]
  if (!isNaN(staticDiscount)) return { discount: staticDiscount, type: 'static' }

  // 2. Check daily auto-generated coupons
  if (dailyCouponSystem) {
    const result = await dailyCouponSystem.validateDailyCoupon(code, chatId)
    if (result?.error === 'already_used') return { error: 'already_used' }
    if (result?.discount) return { discount: result.discount, type: 'daily', code }
  }

  return null
}
  // Auto-detect HTML in message and add parse_mode if not already set
  const opts = options || {}
  if (typeof message === 'string' && !opts.parse_mode && /<\/?(?:b|i|u|s|code|pre|a)\b/.test(message)) {
    opts.parse_mode = 'HTML'
  }
  log('reply: ' + message + ' ' + (opts?.reply_markup?.keyboard?.map(i => i) || '') + '\tto: ' + chatId + '\n')
  bot?.sendMessage(chatId, message, opts)?.catch(e => log(e.message + ': ' + chatId))
}

// Mask username: show first 2 chars + ***
const maskName = name => {
  if (!name || typeof name !== 'string') return 'User***'
  return name.length <= 2 ? name + '***' : name.slice(0, 2) + '***'
}

// Send event notification to all registered groups + configured fallback targets
const TELEGRAM_NOTIFY_GROUP_ID = process.env.TELEGRAM_NOTIFY_GROUP_ID
const notifyGroup = async (message) => {
  try {
    const taggedMessage = message + `\n— <b>${CHAT_BOT_NAME}</b>`
    const sentTo = new Set()

    // 1. Always send to configured notification group (if set)
    if (TELEGRAM_NOTIFY_GROUP_ID) {
      const gid = Number(TELEGRAM_NOTIFY_GROUP_ID)
      sentTo.add(gid)
      bot?.sendMessage(gid, taggedMessage, { parse_mode: 'HTML' })?.catch(e => {
        log('Configured notify group error (' + gid + '): ' + e.message)
      })
    }

    // 2. Always send to admin chat as fallback
    if (TELEGRAM_ADMIN_CHAT_ID && !sentTo.has(Number(TELEGRAM_ADMIN_CHAT_ID))) {
      sentTo.add(Number(TELEGRAM_ADMIN_CHAT_ID))
      bot?.sendMessage(TELEGRAM_ADMIN_CHAT_ID, taggedMessage, { parse_mode: 'HTML' })?.catch(e => {
        log('Admin notify error: ' + e.message)
      })
    }

    // 3. Send to all auto-registered groups
    if (notifyGroupsCol?.find) {
      const groups = await notifyGroupsCol.find({}).toArray()
      for (const group of groups) {
        if (sentTo.has(group._id)) continue // skip duplicates
        sentTo.add(group._id)
        bot?.sendMessage(group._id, taggedMessage, { parse_mode: 'HTML' })?.catch(e => {
          log('Group notify error for ' + group._id + ': ' + e.message)
          if (e.message?.includes('bot was kicked') || e.message?.includes('chat not found') || e.message?.includes('bot is not a member')) {
            notifyGroupsCol.deleteOne({ _id: group._id })
            log('Removed group ' + group._id + ' from notifyGroups')
          }
        })
      }
    }
  } catch (e) {
    log('notifyGroup error: ' + e.message)
  }
}

// variables to implement core functionality
let state = {},
  walletOf = {},
  linksOf = {},
  expiryOf = {},
  fullUrlOf = {},
  maskOf = {},
  domainsOf = {},
  chatIdBlocked = {},
  planEndingTime = {},
  chatIdOfPayment = {},
  chatIdOfDynopayPayment = {},
  vpsPlansOf = {},
  totalShortLinks = {},
  freeShortLinksOf = {},
  freeSmsCountOf = {},
  clicksOfSms = {},
  freeDomainNamesAvailableFor = {},
  freeValidationsAvailableFor = {},
  hostingTransactions = {},
  vpsTransactions = {},
  notifyGroupsCol = {},
  phoneNumbersOf = {},
  phoneTransactions = {},
  phoneLogs = {},
  ivrAnalytics = {},
  cnamCache = {}


// variables to view system information
let nameOf = {},
  planOf = {},
  payments = {},
  clicksOf = {},
  clicksOn = {},
  loginCountOf = {},
  chatIdOf = {},
  canLogin = {}

// Support chat & lead request collections
let supportSessions = {},
  leadRequests = {}

// Daily coupon system reference
let dailyCouponSystem = null

// some info to use with bot
let adminDomains = [],
  connect_reseller_working = true,
  ip_whitelist_message_sent = false,
  last_cr_check_time = 0

let autoPromo = null

// Telnyx resources (set during init)
let telnyxResources = { sipConnectionId: null, messagingProfileId: null, callControlAppId: null }

// restoreData(); // can be use when there is no db

let db
const loadData = async () => {
  db = client.db(DB_NAME)

  // variables to implement core functionality
  state = db.collection('state')
  linksOf = db.collection('linksOf')
  walletOf = db.collection('walletOf')
  expiryOf = db.collection('expiryOf')
  maskOf = db.collection('maskOf')
  fullUrlOf = db.collection('fullUrlOf')
  domainsOf = db.collection('domainsOf')
  loginCountOf = db.collection('loginCountOf')
  canLogin = db.collection('canLogin')
  chatIdBlocked = db.collection('chatIdBlocked')
  planEndingTime = db.collection('planEndingTime')
  chatIdOfPayment = db.collection('chatIdOfPayment')
  chatIdOfDynopayPayment = db.collection('chatIdOfDynopayPayment')
  vpsPlansOf = db.collection('vpsPlansOf')
  totalShortLinks = db.collection('totalShortLinks')
  freeShortLinksOf = db.collection('freeShortLinksOf')
  freeSmsCountOf = db.collection('freeSmsCountOf')
  clicksOfSms = db.collection('clicksOfSms')
  hostingTransactions = db.collection('hostingTransactions')
  vpsTransactions = db.collection('vpsTransactions')
  notifyGroupsCol = db.collection('notifyGroups')
  phoneNumbersOf = db.collection('phoneNumbersOf')
  phoneTransactions = db.collection('phoneTransactions')
  phoneLogs = db.collection('phoneLogs')
  ivrAnalytics = db.collection('ivrAnalytics')
  cnamCache = db.collection('cnamCache')

  freeDomainNamesAvailableFor = db.collection('freeDomainNamesAvailableFor')
  freeValidationsAvailableFor = db.collection('freeValidationsAvailableFor')
  supportSessions = db.collection('supportSessions')
  leadRequests = db.collection('leadRequests')

  // variables to view system information
  nameOf = db.collection('nameOf')
  planOf = db.collection('planOf')
  payments = db.collection('payments')
  clicksOf = db.collection('clicksOf')
  clicksOn = db.collection('clicksOn')
  chatIdOf = db.collection('chatIdOf')

  log(`DB Connected lala. May peace be with you and Lord's mercy and blessings.`)

  //
  // sendMessage(6687923716, 'bot started')
  // buyDomainFullProcess(6687923716, 'ehtesham.sbs')

  // set(freeShortLinksOf, 6687923716, 20)
  // Bohut zalil karaya is galat line nai : await set(wallet **** 00)
  // {
  //   await del(walletOf, 6687923716)
  //   await set(walletOf, 6687923716, 'usdIn', 100)
  //   await set(walletOf, 6687923716, 'ngnIn', 100000)
  //   const w = await get(walletOf, 6687923716)
  //   log({ w })
  // }
  // {
  //   await del(walletOf, 5590563715)
  //   await set(walletOf, 5590563715, 'usdIn', 100)
  //   await set(walletOf, 5590563715, 'ngnIn', 100000)
  //   const w = await get(walletOf, 5590563715)
  //   log({ w })
  // }

  // 5590563715, 5168006768 chat id client
  // 6687923716 chat id testing
  // set(walletOf, 6687923716, { usdIn: 100, ngnIn: 100000 })
  // set(planEndingTime, 6687923716, 0)
  // set(freeShortLinksOf, 6687923716, FREE_LINKS)
  // adminDomains = await getPurchasedDomains(TELEGRAM_DOMAINS_SHOW_CHAT_ID)

  // Initialize auto-promo system only when Telegram bot is actually enabled
  if (TELEGRAM_BOT_ON === 'true') {
    autoPromo = initAutoPromo(bot, db, nameOf, state)
    log('[AutoPromo] System loaded successfully')
    dailyCouponSystem = initDailyCoupons(db, bot, nameOf, state)
    log('[DailyCoupon] System loaded successfully')
    // Link coupon system to promo for coupon-in-promo messages
    autoPromo.setDailyCouponSystem(dailyCouponSystem)
  } else {
    log('[AutoPromo] Skipped — Telegram bot is disabled')
  }

  // Initialize Telnyx Cloud Phone resources
  if (process.env.TELNYX_API_KEY && process.env.PHONE_SERVICE_ON === 'true') {
    try {
      telnyxResources = await telnyxApi.initializeTelnyxResources(SELF_URL)
      log('[CloudPhone] Telnyx resources initialized')
    } catch (e) {
      log('[CloudPhone] Telnyx init error:', e.message)
    }
  } else {
    log('[CloudPhone] Skipped — TELNYX_API_KEY or PHONE_SERVICE_ON not set')
  }

  // Initialize Cloud Phone scheduler (expiry, usage tracking, monthly reset)
  if (process.env.PHONE_SERVICE_ON === 'true') {
    initPhoneScheduler({
      bot,
      phoneNumbersOf,
      phoneTransactions,
      phoneLogs,
      walletOf,
      payments,
      nameOf,
      notifyGroup,
      maskName,
      nanoid,
    })
    log('[CloudPhone] Scheduler initialized')
  }

  // Initialize Voice Service (IVR, Recording, Call handling)
  if (process.env.PHONE_SERVICE_ON === 'true') {
    initVoiceService({
      bot,
      phoneNumbersOf,
      phoneLogs,
      telnyxApi,
      telnyxResources,
      ivrAnalytics,
      walletOf,
      payments,
      nanoid,
    })
    log('[CloudPhone] Voice Service initialized with IVR + Recording + Overage')
  }

  // Initialize SMS Service limits (real-time enforcement)
  if (process.env.PHONE_SERVICE_ON === 'true') {
    initSmsLimits({
      incrementSmsUsed,
      isSmsLimitReached,
      walletOf,
      payments,
      nanoid,
      bot,
    })
    log('[CloudPhone] SMS Service limits initialized with overage billing')
  }

  // Initialize CNAM Service
  if (process.env.PHONE_SERVICE_ON === 'true') {
    initCnamService({ cnamCache })
    log('[CloudPhone] CNAM Service initialized')
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Scheduled auto-cleanup: reset stale user states every 6 hours
  // Users idle in a flow for >24h get reset to 'none' so they see fresh keyboards
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24 hours
  const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000 // every 6 hours

  async function cleanupStaleStates() {
    try {
      const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS)
      // Reset users who have a non-'none' action and whose lastUpdated is older than 24h
      const result = await state.updateMany(
        {
          action: { $exists: true, $ne: 'none' },
          $or: [
            { lastUpdated: { $lt: cutoff } },
            { lastUpdated: { $exists: false } } // legacy entries without timestamp
          ]
        },
        { $set: { action: 'none' } }
      )
      if (result.modifiedCount > 0) {
        log(`[StateCleanup] Reset ${result.modifiedCount} stale user states (idle >24h)`)
      }
    } catch (err) {
      log(`[StateCleanup] Error: ${err.message}`)
    }
  }

  // Run once on startup, then every 6 hours
  cleanupStaleStates()
  setInterval(cleanupStaleStates, CLEANUP_INTERVAL_MS)
  log(`[StateCleanup] Scheduled every ${CLEANUP_INTERVAL_MS / 3600000}h (stale threshold: ${STALE_THRESHOLD_MS / 3600000}h)`)
}

const client = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 15000,
  connectTimeoutMS: 20000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 20000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  waitQueueTimeoutMS: 15000,
})

let isDbConnected = false

client.on('connectionPoolCleared', () => {
  log('⚠️ MongoDB connection pool cleared')
  isDbConnected = false
})

client.on('connectionPoolReady', () => {
  log('✅ MongoDB connection pool ready')
  isDbConnected = true
})

let consecutiveHeartbeatFailures = 0

client.on('serverHeartbeatFailed', (event) => {
  consecutiveHeartbeatFailures++
  // Only log every 3rd failure to reduce noise — single blips recover silently
  if (consecutiveHeartbeatFailures >= 3) {
    log(`❌ MongoDB heartbeat failed (${consecutiveHeartbeatFailures}x):`, event.failure?.message || 'unknown error')
  }
  isDbConnected = false
})

client.on('serverHeartbeatSucceeded', () => {
  if (!isDbConnected || consecutiveHeartbeatFailures > 0) {
    if (consecutiveHeartbeatFailures >= 3) {
      log(`✅ MongoDB heartbeat restored (was down for ${consecutiveHeartbeatFailures} beats)`)
    }
    isDbConnected = true
    consecutiveHeartbeatFailures = 0
  }
})

const connectWithRetry = async (retryCount = 0) => {
  const maxRetries = 5
  const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 30000)
  
  try {
    await client.connect()
    isDbConnected = true
    await loadData()
  } catch (err) {
    log(`❌ DB connection failed (attempt ${retryCount + 1}/${maxRetries}):`, err?.message)
    isDbConnected = false
    
    if (retryCount < maxRetries - 1) {
      log(`🔄 Retrying in ${retryDelay / 1000} seconds...`)
      setTimeout(() => connectWithRetry(retryCount + 1), retryDelay)
    } else {
      log('❌ Max retries reached. Please check your MongoDB connection.')
    }
  }
}

// Start Express server immediately so Railway health check passes while DB connects
// Note: startServer() will be called after all functions are defined at end of file

connectWithRetry()

const isDbHealthy = () => isDbConnected


async function sendRemindersForExpiringPackages() {
  const now = new Date()
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  const threeDaysMinusFive = new Date(now.getTime() + (3 * 24 * 60 - 5) * 60 * 1000)

  try {
    // ── Freedom Plan: 1-hour reminder ──
    const users = await state.find({
      'currentPackage.name': 'Freedom Plan',
      'currentPackage.expiresAt': { $lte: oneHourFromNow, $gt: now },
      'reminders.beforeExpireReminderSent': false,
    }).toArray()

    for (const user of users) {
      const lang = user?.userLanguage ?? 'en'
      send(user._id, translation('t.oneHourLeftToExpireTrialPlan', lang))

      await state.updateOne(
        { _id: user._id },
        { $set: { 'reminders.beforeExpireReminderSent': true } },
      )
    }

    // ── Freedom Plan: expired ──
    const expiredUsers = await state.find({
      'currentPackage.name': 'Freedom Plan',
      'currentPackage.expiresAt': { $lte: now },
      'reminders.expireReminderSent': false,
      'currentPackage.isActive': true,
    }).toArray()

    for (const user of expiredUsers) {
      const lang = user?.userLanguage ?? 'en'
      send(user._id, translation('t.freePlanExpired', lang))

      await state.updateOne(
        { _id: user._id },
        {
          $set: {
            'reminders.expireReminderSent': true,
            'currentPackage.isActive': false,
          },
        },
      )
    }

    // ── Bot Plan (Daily/Weekly/Monthly): 3-day expiry reminder ──
    try {
      const allPlanUsers = await planEndingTime.find({}).toArray()
      for (const entry of allPlanUsers) {
        const chatId = entry._id
        const rawTime = entry.val
        if (!rawTime || rawTime <= now.getTime()) continue

        const msLeft = rawTime - now.getTime()
        const daysLeft = msLeft / (1000 * 60 * 60 * 24)

        // Send 3-day reminder (check within 2.9 - 3.1 day window)
        if (daysLeft > 2.9 && daysLeft <= 3.1) {
          const userState = await state.findOne({ _id: String(chatId) })
          if (userState?.reminders?.botPlan3DayReminderSent) continue

          const plan = await get(planOf, chatId)
          if (!plan) continue
          const lang = userState?.userLanguage ?? 'en'
          const expiryDate = new Date(rawTime).toLocaleDateString()

          const msgs = {
            en: `📋 <b>Subscription Expiring Soon</b>\n\n📦 ${plan} expires in <b>3 days</b> (${expiryDate}).\n\nRenew now to keep your benefits active.`,
            fr: `📋 <b>Abonnement bientôt expiré</b>\n\n📦 ${plan} expire dans <b>3 jours</b> (${expiryDate}).\n\nRenouvelez pour garder vos avantages.`,
            hi: `📋 <b>सदस्यता जल्द समाप्त</b>\n\n📦 ${plan} <b>3 दिनों</b> में समाप्त होगा (${expiryDate}).\n\nअभी नवीनीकरण करें।`,
            zh: `📋 <b>订阅即将到期</b>\n\n📦 ${plan} 将在 <b>3天</b> 后到期 (${expiryDate})。\n\n请立即续订。`,
          }
          send(chatId, msgs[lang] || msgs.en, { parse_mode: 'HTML' })
          await state.updateOne(
            { _id: String(chatId) },
            { $set: { 'reminders.botPlan3DayReminderSent': true } },
            { upsert: true }
          )
          log(`[Reminders] 3-day bot plan reminder sent to ${chatId}`)
        }

        // Reset the flag when user renews (days > 3.5)
        if (daysLeft > 3.5) {
          await state.updateOne(
            { _id: String(chatId) },
            { $set: { 'reminders.botPlan3DayReminderSent': false } },
          )
        }
      }
    } catch (e) {
      console.error('Error in bot plan reminders:', e.message)
    }

    // ── VPS Plans: 3-day expiry reminder ──
    try {
      const allVps = await vpsPlansOf.find({}).toArray()
      for (const entry of allVps) {
        const chatId = entry._id
        const plans = entry.val?.plans || entry.plans || []
        for (const vps of plans) {
          if (vps.status !== 'active') continue
          const expiresAt = vps.expiresAt || vps.subscriptionEnd
          if (!expiresAt) continue

          const msLeft = new Date(expiresAt).getTime() - now.getTime()
          const daysLeft = msLeft / (1000 * 60 * 60 * 24)

          if (daysLeft > 2.9 && daysLeft <= 3.1 && !vps._reminder3DaySent) {
            const userState = await state.findOne({ _id: String(chatId) })
            const lang = userState?.userLanguage ?? 'en'
            const name = vps.name || vps.hostname || 'VPS'
            const expiryDate = new Date(expiresAt).toLocaleDateString()

            const msgs = {
              en: `🖥️ <b>VPS Expiring Soon</b>\n\n${name} expires in <b>3 days</b> (${expiryDate}).\nRenew to avoid service interruption.`,
              fr: `🖥️ <b>VPS bientôt expiré</b>\n\n${name} expire dans <b>3 jours</b> (${expiryDate}).\nRenouvelez pour éviter l'interruption.`,
              hi: `🖥️ <b>VPS जल्द समाप्त</b>\n\n${name} <b>3 दिनों</b> में समाप्त (${expiryDate}).\nनवीनीकरण करें।`,
              zh: `🖥️ <b>VPS即将到期</b>\n\n${name} 将在 <b>3天</b> 后到期 (${expiryDate})。\n请续订。`,
            }
            send(chatId, msgs[lang] || msgs.en, { parse_mode: 'HTML' })
            vps._reminder3DaySent = true
            await vpsPlansOf.updateOne(
              { _id: chatId },
              { $set: { [`val.plans`]: plans } }
            )
            log(`[Reminders] 3-day VPS reminder sent to ${chatId} for ${name}`)
          }
        }
      }
    } catch (e) {
      console.error('Error in VPS reminders:', e.message)
    }

  } catch (error) {
    console.error('Error sending reminders:', error)
  }
}

schedule.scheduleJob('*/5 * * * *', function() {
  sendRemindersForExpiringPackages()
})

bot?.on('message', async msg => {
  const chatId = msg?.chat?.id
  const chatType = msg?.chat?.type
  const isGroupChat = chatType === 'group' || chatType === 'supergroup'
  let message = msg?.text || ''
  
  // Completely ignore ALL messages in group chats
  // Bot only sends event notifications to groups, never responds to users
  if (isGroupChat) {
    return
  }

  // ── Handle voice/audio messages for voicemail custom greeting ──
  if ((msg?.voice || msg?.audio) && chatId) {
    const userInfo = await get(state, chatId)
    if (userInfo?.action === 'cpVmAudioUpload') {
      try {
        const fileId = msg.voice?.file_id || msg.audio?.file_id
        const fileLink = await bot.getFileLink(fileId)
        const infoData = await get(state, chatId + '_info')
        const num = infoData?.cpActiveNumber
        if (num) {
          const vm = num.features?.voicemail || {}
          vm.greetingType = 'custom'
          vm.customAudioGreetingUrl = fileLink
          vm.customGreetingText = null
          await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', vm)
          num.features.voicemail = vm
          await set(state, chatId + '_info', { ...infoData, cpActiveNumber: num })
          const pc = phoneConfig.btn
          send(chatId, phoneConfig.txt.vmAudioSaved)
          await set(state, chatId, { ...userInfo, action: 'cpVoicemail' })
          const btns = vm.enabled
            ? [['🔊 Greeting'],
               ['📲 VM to Telegram ' + (vm.forwardToTelegram !== false ? '✅ ON' : '❌ OFF')],
               ['📧 VM to Email ' + (vm.forwardToEmail ? '✅ ' + vm.forwardToEmail : '❌ OFF')],
               [`⏰ Ring Time: ${vm.ringTimeout || 25}s`],
               [pc.disableVoicemail]]
            : [[pc.enableVoicemail]]
          return send(chatId, phoneConfig.txt.voicemailMenu(num.phoneNumber, vm), { reply_markup: { keyboard: btns }, parse_mode: 'HTML' })
        }
      } catch (e) {
        log(`[Voice] Audio greeting upload error: ${e.message}`)
        return send(chatId, '❌ Failed to process audio. Please try again.')
      }
    }
    // If not in audio upload state, ignore voice/audio messages
    return
  }
  
  log('message: ' + message + '\tfrom: ' + chatId + ' ' + msg?.from?.username)

  // ═══════════════════════════════════════════════════
  // Admin support commands — /reply <chatId> <message> and /close <chatId>
  // Handled early so admin can reply from anywhere in the bot
  // ═══════════════════════════════════════════════════
  if (isAdmin(chatId) && message.startsWith('/reply ')) {
    const parts = message.substring(7).split(' ')
    const targetChatId = Number(parts[0])
    const replyText = parts.slice(1).join(' ')
    if (!targetChatId || !replyText) {
      return send(chatId, '⚠️ Usage: /reply <chatId> <message>')
    }
    const targetName = await get(nameOf, targetChatId)
    send(targetChatId, `💬 <b>Support:</b>\n${replyText}`, { parse_mode: 'HTML' })
    send(chatId, `✅ Reply sent to ${targetName || targetChatId}`)
    log(`[Support] Admin replied to ${targetChatId}: ${replyText}`)
    return
  }

  if (isAdmin(chatId) && message.startsWith('/close ')) {
    const targetChatId = Number(message.substring(7).trim())
    if (!targetChatId) return send(chatId, '⚠️ Usage: /close <chatId>')
    const session = await get(supportSessions, targetChatId)
    if (session) {
      await set(supportSessions, targetChatId, 0)
      // Reset user action if they're still in support mode
      const userInfo = await get(state, targetChatId)
      if (userInfo?.action === 'supportChat') {
        await set(state, targetChatId, 'action', 'none')
      }
    }
    const targetName = await get(nameOf, targetChatId)
    send(targetChatId, '✅ Support session closed. Use the menu below to continue.', translation('o', 'en'))
    send(chatId, `✅ Closed support session for ${targetName || targetChatId}`)
    log(`[Support] Admin closed session for ${targetChatId}`)
    return
  }

  // Admin: /requests — list pending lead requests
  if (isAdmin(chatId) && message === '/requests') {
    try {
      const allRequests = await leadRequests.find({}).toArray()
      const pending = allRequests.filter(r => r.val && r.val.status === 'pending')
      if (pending.length === 0) {
        return send(chatId, '📝 No pending lead requests.')
      }
      let msg = `📝 <b>Pending Lead Requests (${pending.length})</b>\n\n`
      pending.slice(0, 20).forEach((r, i) => {
        const v = r.val
        msg += `${i + 1}. <b>${v.target}</b> — ${v.city}\n   From: ${v.username} (${v.chatId})\n   Details: ${v.details || 'none'}\n   Date: ${v.createdAt?.slice(0, 10) || 'unknown'}\n   ID: <code>${r._id}</code>\n\n`
      })
      if (pending.length > 20) msg += `... and ${pending.length - 20} more`
      return send(chatId, msg, { parse_mode: 'HTML' })
    } catch (err) {
      return send(chatId, `Error fetching requests: ${err.message}`)
    }
  }

  // Throttle Connect Reseller IP check to once per hour instead of every message
  const now_cr = Date.now()
  if (NOT_TRY_CR === undefined && now_cr - last_cr_check_time > 3600000) {
    last_cr_check_time = now_cr
    tryConnectReseller()
  }

  // License check cached at startup to avoid blocking every message

  if (!db) return send(chatId, 'Bot is starting, please wait')
  if (!connect_reseller_working) {
    await tryConnectReseller()
    if (!connect_reseller_working) return send(chatId, 'Bot starting, please wait')
  }

  const nameOfChatId = await get(nameOf, chatId)
  const currentUsername = msg?.from?.username || null
  const username = currentUsername || nameOfChatId || nanoid()

  const blocked = await get(chatIdBlocked, chatId)
  if (blocked) return send(chatId, translation('t.blockedUser', 'en'), rem)

  if (!nameOfChatId) {
    // First interaction — save username
    set(nameOf, chatId, username)
    set(chatIdOf, username, chatId)
  } else if (currentUsername && currentUsername !== nameOfChatId) {
    // Username changed — update both mappings
    log(`[UsernameSync] ${chatId} changed username: ${nameOfChatId} → ${currentUsername}`)
    set(nameOf, chatId, currentUsername)
    set(chatIdOf, currentUsername, chatId)
    // Remove old username → chatId mapping to avoid stale lookups
    chatIdOf.deleteOne({ _id: nameOfChatId }).catch(() => {})
  }

  let freeLinks = await get(freeShortLinksOf, chatId)
  if (freeLinks === null || freeLinks === undefined) {
    set(freeShortLinksOf, chatId, FREE_LINKS)
    freeLinks = FREE_LINKS
  }
  const userSubscribed = await isSubscribed(chatId)

  let info = await get(state, chatId)
  const saveInfo = async (label, data) => {
    await set(state, chatId, label, data)
    info = await get(state, chatId)
  }

  const action = info?.action

  const trans = (key, ...args) => {
    const lang = info?.userLanguage || 'en';
    const result = translation(key, lang, ...args)
    if (key === 'o' && result?.reply_markup?.keyboard) {
      const label = userSubscribed
        ? `🔗✂️ URL Shortener — Unlimited`
        : freeLinks > 0
          ? `🔗✂️ URL Shortener — ${freeLinks} Free Link${freeLinks !== 1 ? 's' : ''}`
          : `🔗✂️ URL Shortener — 0 Links Left`
      return {
        ...result,
        reply_markup: {
          ...result.reply_markup,
          keyboard: result.reply_markup.keyboard.map((row, i) =>
            i === 0 ? [label] : [...row]
          )
        }
      }
    }
    return result
  };

  const user = trans('user')
  const t = trans('t')
  const u = trans('u')
  const bc = trans('bc')
  const k = trans('k')
  const aO = trans('aO')
  const admin = trans('admin')
  const payIn = trans('payIn')
  const hP = trans('hP')
  const vp = trans('vp')
  const buyLeadsSelectCnam = trans('buyLeadsSelectCnam')

  // actions
  const a = {
    // submenu
    submenu1: 'submenu1',
    submenu2: 'submenu2',

    // cPanel Plans SubMenu
    submenu3: 'submenu3',
    // Free Trial Actions
    freeTrial: 'freeTrial',
    getPlanNow: 'getPlanNow',
    domainAvailableContinue: 'domainAvailableContinue',
    continueWithDomainNameSBS: 'continueWithDomainNameSBS',
    nameserverSelectionSBS: 'nameserverSelectionSBS',
    proceedSearchAnotherDomain: 'proceedSearchAnotherDomain',
    confirmEmailBeforeProceedingSBS: 'confirmEmailBeforeProceedingSBS',

    // Plans
    starterPlan: 'starterPlan',
    businessPlan: 'businessPlan',
    proPlan: 'proPlan',

    // Plan Actions
    registerNewDomain: 'registerNewDomain',
    registerNewDomainFound: 'registerNewDomainFound',
    useExistingDomain: 'useExistingDomain',
    useExistingDomainFound: 'useExistingDomainFound',
    domainNotFound: 'domainNotFound',
    nameserverSelection: 'nameserverSelection',
    enterYourEmail: 'enterYourEmail',
    confirmEmailBeforeProceeding: 'confirmEmailBeforeProceeding',
    proceedWithEmail: 'proceedWithEmail',
    proceedWithPaymentProcess: 'proceedWithPaymentProcess',
    plansAskCoupon: 'plansAskCoupon',
    skipCoupon: 'skipCoupon',

    askDomainToUseWithShortener: 'askDomainToUseWithShortener',
    domainNsSelect: 'domainNsSelect',
    domainCustomNsEntry: 'domainCustomNsEntry',

    selectCurrencyToWithdraw: 'selectCurrencyToWithdraw',

    selectCurrencyToDeposit: 'selectCurrencyToDeposit',

    depositNGN: 'depositNGN',
    askEmailForNGN: 'askEmailForNGN',
    showDepositNgnInfo: 'showDepositNgnInfo',

    depositUSD: 'depositUSD',
    selectCryptoToDeposit: 'selectCryptoToDeposit',
    showDepositCryptoInfo: 'showDepositCryptoInfo',

    walletSelectCurrency: 'walletSelectCurrency',
    walletSelectCurrencyConfirm: 'walletSelectCurrencyConfirm',

    walletPayUsd: 'walletPayUsd',
    walletPayNgn: 'walletPayNgn',

    askCoupon: 'askCoupon',

    phoneNumberLeads: 'phoneNumberLeads',

    // buyLeads
    buyLeadsSelectCountry: 'buyLeadsSelectCountry',
    buyLeadsSelectSmsVoice: 'buyLeadsSelectSmsVoice',
    buyLeadsSelectArea: 'buyLeadsSelectArea',
    buyLeadsSelectAreaCode: 'buyLeadsSelectAreaCode',
    buyLeadsSelectCarrier: 'buyLeadsSelectCarrier',
    buyLeadsSelectCnam: 'buyLeadsSelectCnam',
    buyLeadsSelectAmount: 'buyLeadsSelectAmount',
    buyLeadsSelectFormat: 'buyLeadsSelectFormat',
    //targetLeads
    targetSelectTarget: 'targetSelectTarget',
    targetSelectCity: 'targetSelectCity',
    targetSelectAreaCode: 'targetSelectAreaCode',
    targetLeadsConfirm: 'targetLeadsConfirm',
    // Custom lead request
    customLeadRequestName: 'customLeadRequestName',
    customLeadRequestCity: 'customLeadRequestCity',
    customLeadRequestDetails: 'customLeadRequestDetails',
    // Support chat
    supportChat: 'supportChat',
    //validatePhoneNumbers
    validatorSelectCountry: 'validatorSelectCountry',
    validatorPhoneNumber: 'validatorPhoneNumber',
    validatorSelectSmsVoice: ' validatorSelectSmsVoice',
    validatorSelectCarrier: 'validatorSelectCarrier',
    validatorSelectCnam: 'validatorSelectCnam',
    validatorSelectAmount: 'validatorSelectAmount',
    validatorSelectFormat: 'validatorSelectFormat',

    // Short link
    redSelectUrl: 'redSelectUrl',
    redSelectRandomCustom: 'redSelectRandomCustom',
    redSelectProvider: 'redSelectProvider',
    redSelectCustomExt: 'redSelectCustomExt',

    // user setup
    addUserLanguage: 'addUserLanguage',
    updateUserLanguage: 'updateUserLanguage',
    askUserEmail: 'askUserEmail',
    askUserTerms: 'askUserTerms',

    //vps plans
    submenu4: 'submenu4',
    askCountryForVPS: 'askCountryForVPS',
    askRegionAreaForVPS: 'askRegionAreaForVPS',
    askZoneForVPS: 'askZoneForVPS',
    confirmZoneForVPS: 'confirmZoneForVPS',
    askUserVpsPlan: 'askUserVpsPlan',
    askVpsConfig: 'askVpsConfig',
    askVPSPlanAutoRenewal: 'askVPSPlanAutoRenewal',
    askVpsOS: 'askVpsOS',
    askVpsCpanel: 'askVpsCpanel',
    askVpsCpanelLicense: 'askVpsCpanelLicense',
    askCouponForVPSPlan: 'askCouponForVPSPlan',
    skipCouponVps: 'skipCouponVps',
    askVpsDiskType: 'askVpsDiskType',
    vpsAskSSHKey: 'vpsAskSSHKey',
    vpsLinkSSHKey: 'vpsLinkSSHKey',
    askUploadSSHPublicKey: 'askUploadSSHPublicKey',
    askSkipSSHkeyconfirmation: 'askSkipSSHkeyconfirmation',
    proceedWithVpsPayment: 'proceedWithVpsPayment',

    //vps management
    getUserAllVmIntances: 'getUserAllVmIntances',
    getVPSDetails: 'getVPSDetails',
    confirmStopVps: 'confirmStopVps',
    confirmDeleteVps: 'confirmDeleteVps',
    upgradeVpsInstance: 'upgradeVpsInstance',
    upgradeVpsPlan: 'upgradeVpsPlan',
    askVpsUpgradePayment: 'askVpsUpgradePayment',
    vpsSubscription: 'vpsSubscription',
    manageVpsSub: 'manageVpsSub',
    manageVpsPanel: 'manageVpsPanel',
    vpsLinkedSSHkeys: 'vpsLinkedSSHkeys',
    vpsUnlinkSSHKey: 'vpsUnlinkSSHKey',
    confirmVpsUnlinkSSHKey: 'confirmVpsUnlinkSSHKey',
    vpslinkNewSSHKey: 'vpslinkNewSSHKey',
    uploadSShKeyToAttach : 'uploadSShKeyToAttach',
    downloadSSHKey: 'downloadSSHKey',
    confirmVPSRenewDetails: 'confirmVPSRenewDetails',

    // Cloud Phone
    submenu5: 'submenu5',
    cpSelectCountry: 'cpSelectCountry',
    cpSelectType: 'cpSelectType',
    cpSelectArea: 'cpSelectArea',
    cpEnterAreaCode: 'cpEnterAreaCode',
    cpSelectNumber: 'cpSelectNumber',
    cpSelectPlan: 'cpSelectPlan',
    cpOrderSummary: 'cpOrderSummary',
    cpMyNumbers: 'cpMyNumbers',
    cpManageNumber: 'cpManageNumber',
    cpCallForwarding: 'cpCallForwarding',
    cpEnterForwardNumber: 'cpEnterForwardNumber',
    cpSmsSettings: 'cpSmsSettings',
    cpEnterEmail: 'cpEnterEmail',
    cpEnterWebhook: 'cpEnterWebhook',
    cpVoicemail: 'cpVoicemail',
    cpSipCredentials: 'cpSipCredentials',
    cpRenewPlan: 'cpRenewPlan',
    cpChangePlan: 'cpChangePlan',
    cpReleaseConfirm: 'cpReleaseConfirm',
    cpReleaseDigits: 'cpReleaseDigits',
    cpIvr: 'cpIvr',
    cpIvrGreeting: 'cpIvrGreeting',
    cpIvrAddOption: 'cpIvrAddOption',
    cpIvrRemoveOption: 'cpIvrRemoveOption',
    cpCallRecording: 'cpCallRecording',
    cpSmsInbox: 'cpSmsInbox',
    cpVmGreeting: 'cpVmGreeting',
    cpVmAudioUpload: 'cpVmAudioUpload',
    cpVmTextGreeting: 'cpVmTextGreeting',
  }

  const firstSteps = [
    'block-user',
    'unblock-user',
    admin.messageUsers,
    admin.broadcastSettings,

    'choose-subscription',
    user.wallet,
    a.phoneNumberLeads,

    a.submenu1,
    a.submenu2,
    // cPanel Plans SubMenu
    a.submenu3,
    'displayMainMenuButtons',

    a.submenu4,
    a.submenu5
  ]
  const goto = {
    askCoupon: action => {
      send(chatId, t.askCoupon(info?.price), k.of([t.skip]))
      set(state, chatId, 'action', a.askCoupon + action)
    },
    'domain-pay': () => {
      const { domain, price, couponApplied, newPrice } = info
      const payKeyboard = k.of([
        Object.values(payIn),
        ['🎟️ Apply Coupon'],
      ])
      couponApplied
        ? send(chatId, t.domainNewPrice(domain, price, newPrice), k.pay)
        : send(chatId, t.domainPrice(domain, price), payKeyboard)
      set(state, chatId, 'action', 'domain-pay')
    },
    'hosting-pay': () => {
      const payload = {
        domainName: info.website_name,
        domainPrice: info.price,
        existingDomain: info.existingDomain,
        couponDiscount: info.couponDiscount,
        totalPrice: info.totalPrice,
        couponApplied: info.couponApplied,
        hostingPrice: info.hostingPrice,
        newPrice: info.newPrice,
      }
      set(state, chatId, 'action', 'hosting-pay')
      send(chatId, hP.generateInvoiceText(payload), k.pay)
    },
    'vps-plan-pay' : async () => {
      set(state, chatId, 'action', 'vps-plan-pay')
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usdBal, ngnBal))
      send(chatId, vp.askPaymentMethod, k.pay)
    },
    'vps-upgrade-plan-pay' : async () => {
      set(state, chatId, 'action', 'vps-upgrade-plan-pay')
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      const lowBalance = info.vpsDetails?.billingCycle === 'Hourly' && usdBal < info.vpsDetails.totalPrice
      send(chatId, t.showWallet(usdBal, ngnBal))
      send(chatId, vp.askPaymentMethod, info.vpsDetails?.billingCycle === 'Hourly' && !lowBalance ? k.of([payIn.wallet]) : k.pay)
    },
    // ━━━ Cloud Phone goto functions ━━━
    submenu5: () => {
      set(state, chatId, 'action', a.submenu5)
      const pc = phoneConfig.btn
      send(chatId, phoneConfig.txt.hubWelcome, k.of([
        [pc.buyPhoneNumber],
        [pc.myNumbers],
        [pc.sipSettings],
        [pc.usageBilling],
      ]))
    },
    'phone-pay': async () => {
      set(state, chatId, 'action', 'phone-pay')
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usdBal, ngnBal))
      send(chatId, phoneConfig.txt.paymentPrompt(info.cpPrice), k.pay)
    },
    'choose-domain-to-buy': async () => {
      let text = ``
      if (await isSubscribed(chatId)) {
        const plan = await get(planOf, chatId)
        const available = (await get(freeDomainNamesAvailableFor, chatId)) || 0
        const s = available === 1 ? '' : 's'
        text =
          available <= 0
            ? ``
            : t.availablefreeDomain(plan, available, s)
      }
      set(state, chatId, 'action', 'choose-domain-to-buy')
      send(chatId, t.chooseDomainToBuy(text), bc)
    },
    askDomainToUseWithShortener: async () => {
      await set(state, chatId, 'action', a.askDomainToUseWithShortener)
      const domain = info?.domain || ''
      const price = info?.price || ''
      const priceText = domain && price ? `✅ <b>${domain}</b> is available for <b>$${price}</b>\n\n` : ''
      send(chatId, `${priceText}${t.askDomainToUseWithShortener}`, trans('yes_no'))
    },
    domainNsSelect: () => {
      set(state, chatId, 'action', a.domainNsSelect)
      const domain = info?.domain || ''
      send(chatId, `Select DNS for <b>${domain}</b>:\n\n<b>${configUser.nsProviderDefault}</b> — Default nameservers\n<b>${configUser.nsCloudflare}</b> — Enhanced security & performance\n<b>${configUser.nsCustom}</b> — Use your own nameservers`, k.of([[configUser.nsProviderDefault, configUser.nsCloudflare], [configUser.nsCustom]]))
    },
    domainCustomNsEntry: () => {
      set(state, chatId, 'action', a.domainCustomNsEntry)
      send(chatId, `Enter your custom nameservers separated by space.\n\nExample: <code>ns1.example.com ns2.example.com</code>\n\nMinimum 2 nameservers required.`, k.of([]))
    },
    'plan-pay': () => {
      const { plan, price, couponApplied, newPrice } = info
      couponApplied
        ? send(chatId, t.planNewPrice(plan, price, newPrice), k.pay)
        : send(chatId, t.planPrice(plan, price), k.pay)
      set(state, chatId, 'action', 'plan-pay')
    },
    'choose-subscription': () => {
      set(state, chatId, 'action', 'choose-subscription')
      send(chatId, t.chooseSubscription, trans('chooseSubscription'))
    },
    'choose-url-to-shorten': async () => {
      set(state, chatId, 'action', 'choose-url-to-shorten')
      send(chatId, t.shortenedUrlLink, bc)
      adminDomains = await getPurchasedDomains(TELEGRAM_DOMAINS_SHOW_CHAT_ID)
    },
    'choose-domain-with-shorten': domains => {
      send(chatId, t.chooseDomainWithShortener, trans('show', domains))
      set(state, chatId, 'action', 'choose-domain-with-shorten')
    },
    'choose-link-type': () => {
      send(chatId, `Choose link type:`, trans('linkType'))
      set(state, chatId, 'action', 'choose-link-type')
    },
    'get-free-domain': () => {
      send(chatId, t.chooseFreeDomainText,  trans('yes_no'))
      set(state, chatId, 'action', 'get-free-domain')
    },

    'choose-domain-to-manage': async () => {
      const domains = await getPurchasedDomains(chatId)
      set(state, chatId, 'action', 'choose-domain-to-manage')
      send(chatId, t.chooseDomainToManage, trans('show', domains))
    },

    'select-dns-record-id-to-delete': () => {
      send(chatId, t.deleteDnsTxt, bc)
      set(state, chatId, 'action', 'select-dns-record-id-to-delete')
    },

    'confirm-dns-record-id-to-delete': () => {
      send(chatId, t.confirmDeleteDnsTxt,  trans('yes_no'))
      set(state, chatId, 'action', 'confirm-dns-record-id-to-delete')
    },

    'choose-dns-action': async () => {
      const domain = info?.domainToManage

      // Use unified domain service to route DNS to correct provider
      const dnsResult = await domainService.viewDNSRecords(domain, db)
      const source = dnsResult?.source || 'connectreseller'
      const records = dnsResult?.records || []
      const domainNameId = dnsResult?.domainNameId || null
      const cfZoneId = dnsResult?.cfZoneId || null

      const toSave = records?.map((r) => ({
        dnszoneID: r.dnszoneID || null,
        dnszoneRecordID: r.dnszoneRecordID || null,
        cfRecordId: r.cfRecordId || null,
        recordType: r.recordType,
        nsId: r.nsId || null,
        recordContent: r.recordContent,
        recordName: r.recordName || null,
      }))

      const categorizeRecords = (records) => {
        return records.reduce((acc, record, index) => {
          const type = record.recordType;
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push({ index: index+1, ...record });
          return acc;
        }, {});
      };
      const categorizedRecords = categorizeRecords(records);

      set(state, chatId, 'dnsRecords', toSave)
      set(state, chatId, 'dnsSource', source)
      set(state, chatId, 'cfZoneId', cfZoneId)
      set(state, chatId, 'domainNameId', domainNameId)
      set(state, chatId, 'action', 'choose-dns-action')
      send(chatId, t.viewDnsRecords(categorizedRecords, domain), trans('dns'))
    },

    'type-dns-record-data-to-add': recordType => {
      send(chatId, t.askDnsContent[recordType], bc)
      set(state, chatId, 'recordType', recordType)
      set(state, chatId, 'action', 'type-dns-record-data-to-add')
    },

    'select-dns-record-id-to-update': () => {
      send(chatId, t.updateDnsTxt, bc)
      set(state, chatId, 'action', 'select-dns-record-id-to-update')
    },
    'type-dns-record-data-to-update': (id, recordType) => {
      set(state, chatId, 'dnsRecordIdToUpdate', id)
      set(state, chatId, 'action', 'type-dns-record-data-to-update')
      send(chatId, t.askUpdateDnsContent[recordType])
    },

    'select-dns-record-type-to-add': () => {
      set(state, chatId, 'action', 'select-dns-record-type-to-add')
      send(chatId, t.addDnsTxt, trans('dnsRecordType'))
    },

    //
    //
    [admin.messageUsers]: () => {
      send(chatId, 'Enter message', bc)
      set(state, chatId, 'action', admin.messageUsers)
    },
    adminConfirmMessage: () => {
      send(chatId, 'Confirm?',  trans('yes_no'))
      set(state, chatId, 'action', 'adminConfirmMessage')
    },
    broadcastSettings: () => {
      const configText = `⚙️ Broadcast Configuration\n\n📊 Current Settings:\n• Batch Size: ${BROADCAST_CONFIG.BATCH_SIZE} users\n• Delay Between Batches: ${BROADCAST_CONFIG.DELAY_BETWEEN_BATCHES/1000}s\n• Delay Between Messages: ${BROADCAST_CONFIG.DELAY_BETWEEN_MESSAGES}ms\n• Max Retries: ${BROADCAST_CONFIG.MAX_RETRIES}\n• Retry Delay: ${BROADCAST_CONFIG.RETRY_DELAY/1000}s\n\n📝 To modify settings, edit js/broadcast-config.js file`
      
      send(chatId, configText, aO)
      set(state, chatId, 'action', 'none')
    },
    //
    //
    //

    [user.wallet]: async () => {
      set(state, chatId, 'action', user.wallet)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      send(chatId, t.wallet(usdBal, ngnBal), k.wallet)
    },
    //
    [a.selectCurrencyToDeposit]: () => {
      set(state, chatId, 'action', a.selectCurrencyToDeposit)
      send(chatId, t.selectCurrencyToDeposit, trans('payOpts'))
    },
    //
    [a.depositNGN]: () => {
      send(chatId, t.depositNGN, bc)
      set(state, chatId, 'action', a.depositNGN)
    },
    [a.askEmailForNGN]: () => {
      send(chatId, t.askEmailForNGN, bc)
      set(state, chatId, 'action', a.askEmailForNGN)
    },
    showDepositNgnInfo: async () => {
      const ref = nanoid()
      const { depositAmountNgn: ngn, email } = info

      log({ ref })
      set(chatIdOfPayment, ref, { chatId, ngnIn: ngn, endpoint: `/bank-wallet` })
      const { url, error } = await createCheckout(ngn, `/ok?a=b&ref=${ref}&`, email, username, ref)

      set(state, chatId, 'action', 'none')
      if (error) return send(chatId, error, trans('o'))
      console.log('showDepositNgnInfo', url)
      send(chatId, t.showDepositNgnInfo(ngn), trans('payBank', url))
      return send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    },
    //
    [a.depositUSD]: () => {
      send(chatId, t.depositUSD, bc)
      set(state, chatId, 'action', a.depositUSD)
    },
    [a.selectCryptoToDeposit]: () => {
      set(state, chatId, 'action', a.selectCryptoToDeposit)
      send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    },
    showDepositCryptoInfo: async () => {
      const ref = nanoid()
      const { amount, tickerView, userLanguage } = info
      const ticker = tickerOf[tickerView]
      if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
        const { address, bb } = await getCryptoDepositAddress(ticker, chatId, SELF_URL, `/crypto-wallet?a=b&ref=${ref}&`)
        if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
        log({ ref })
        sendQrCode(bot, chatId, bb, userLanguage ?? 'en')
        set(chatIdOfPayment, ref, { chatId })
        set(state, chatId, 'action', 'none')
        const usdIn = await convert(amount, 'usd', ticker)
        send(chatId, t.showDepositCryptoInfo(usdIn, tickerView, address), trans('o'))
      } else {
        const tickerDyno = tickerOfDyno[tickerView]
        const redirect_url = `${SELF_URL}/dynopay/crypto-wallet`
        const meta_data = {
          "product_name": dynopayActions.walletFund,
          "refId" : ref
        }
        const { qr_code, address } = await getDynopayCryptoAddress(amount, tickerDyno, redirect_url, meta_data)
        if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
        await generateQr(bot, chatId, qr_code, userLanguage ?? 'en')
        set(chatIdOfDynopayPayment, ref, { chatId, action: dynopayActions.walletFund, address })
        set(state, chatId, 'action', 'none')
        const usdIn = await convert(amount, 'usd', ticker)
        send(chatId, t.showDepositCryptoInfo(usdIn, tickerView, address), trans('o'))
      }
    },

    //
    selectCurrencyToWithdraw: () => {
      send(chatId, t.comingSoonWithdraw)
    },
    //
    //
    walletSelectCurrency: async (plan = false) => {
      if (
        action.includes(a.buyLeadsSelectFormat) ||
        action.includes(a.validatorSelectFormat) ||
        action.includes(a.redSelectRandomCustom)
      ) {
        if (plan) {
          const { amount, totalPrice, couponApplied, newPrice } = info
          couponApplied
          ? send(chatId, t.buyLeadsNewPrice(amount, totalPrice, newPrice), trans('payOpts'))
          : send(chatId, t.buyLeadsPrice(amount, totalPrice), trans('payOpts'))
        } else {
          const { amount, price, couponApplied, newPrice } = info
          couponApplied
          ? send(chatId, t.buyLeadsNewPrice(amount, price, newPrice), trans('payOpts'))
          : send(chatId, t.buyLeadsPrice(amount, price), trans('payOpts'))
        }

      }

      set(state, chatId, 'action', a.walletSelectCurrency)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      send(chatId, t.walletSelectCurrency(usdBal, ngnBal), trans('payOpts'))
    },
    walletSelectCurrencyConfirm: async () => {
      const { price, couponApplied, newPrice, coin } = info
      const p = couponApplied ? newPrice : price

      let text = ''
      if (coin === u.ngn) text = t.confirmNgn(p, await usdToNgn(p))

      send(chatId, text + t.walletSelectCurrencyConfirm,  trans('yes_no'))
      set(state, chatId, 'action', a.walletSelectCurrencyConfirm)
    },
    //
    phoneNumberLeads: () => {
      send(chatId, t.phoneNumberLeads, k.phoneNumberLeads)
      set(state, chatId, 'action', a.phoneNumberLeads)
    },
    //
    //
    // buyLeads
    buyLeadsSelectCountry: () => {
      send(chatId, t.buyLeadsSelectCountry, k.buyLeadsSelectCountry)
      set(state, chatId, 'action', a.buyLeadsSelectCountry)
    },
    buyLeadsSelectSmsVoice: () => {
      send(chatId, t.buyLeadsSelectSmsVoice, k.buyLeadsSelectSmsVoice)
      set(state, chatId, 'action', a.buyLeadsSelectSmsVoice)
    },
    buyLeadsSelectArea: () => {
      send(chatId, t.buyLeadsSelectArea, k.buyLeadsSelectArea(info?.country))
      set(state, chatId, 'action', a.buyLeadsSelectArea)
    },
    buyLeadsSelectAreaCode: () => {
      send(
        chatId,
        t.buyLeadsSelectAreaCode,
        k.buyLeadsSelectAreaCode(info?.country, ['USA', 'Canada'].includes(info?.country) ? info?.area : 'Area Codes'),
      )
      set(state, chatId, 'action', a.buyLeadsSelectAreaCode)
    },
    buyLeadsSelectCarrier: () => {
      send(chatId, t.buyLeadsSelectCarrier, k.buyLeadsSelectCarrier(info?.country))
      set(state, chatId, 'action', a.buyLeadsSelectCarrier)
    },
    buyLeadsSelectCnam: () => {
      send(chatId, t.buyLeadsSelectCnam, k.buyLeadsSelectCnam)
      set(state, chatId, 'action', a.buyLeadsSelectCnam)
    },
    buyLeadsSelectAmount: () => {
      send(
        chatId,
        t.buyLeadsSelectAmount(buyLeadsSelectAmount[0], buyLeadsSelectAmount[buyLeadsSelectAmount.length - 1]),
        k.buyLeadsSelectAmount,
      )
      set(state, chatId, 'action', a.buyLeadsSelectAmount)
    },
    buyLeadsSelectFormat: () => {
      send(chatId, t.buyLeadsSelectFormat, k.buyLeadsSelectFormat)
      set(state, chatId, 'action', a.buyLeadsSelectFormat)
    },

    // target leads
    targetSelectTarget: () => {
      const validateBtn = trans('phoneNumberLeads')[1] || '✅📲 Validate PhoneLeads'
      send(chatId, '🎯 Select your target institution.\nSourced real data — verified, carrier-matched leads from high-value metro areas:', k.of([...targetLeadsTargets, '📝 Request Custom Target', validateBtn]))
      set(state, chatId, 'action', a.targetSelectTarget)
    },
    targetSelectCity: () => {
      const target = info?.targetName
      const cities = targetLeadsCities(target)
      send(chatId, `📍 Select metro area for <b>${target}</b>:\n\nChoose "All Cities" for maximum reach across all regions.`, k.of(['All Cities', ...cities]))
      set(state, chatId, 'action', a.targetSelectCity)
    },
    targetSelectAreaCode: () => {
      const target = info?.targetName
      const city = info?.targetCity
      const buttons = targetLeadsAreaCodeButtons(target, city)
      send(chatId, `📞 Select area code for <b>${target}</b> — <b>${city}</b>:\n\n"Mixed Area Codes" gives you the widest pool of verified numbers.`, k.of(buttons))
      set(state, chatId, 'action', a.targetSelectAreaCode)
    },
    targetLeadsConfirm: async () => {
      const { targetName, targetCity, carrier, cnam, amount, price, couponApplied, newPrice } = info || {}
      const finalPrice = couponApplied ? newPrice : price
      const { usdBal } = await getBalance(walletOf, chatId)
      const summary = `📋 <b>Order Summary</b>\n\n🎯 Target: <b>${targetName}</b>\n📍 Area: <b>${targetCity}</b>\n📞 Carrier: <b>${carrier}</b>\n🔍 CNAM: <b>${cnam ? 'Yes' : 'No'}</b>\n📊 Leads: <b>${amount}</b>\n📄 Format: <b>International</b>${couponApplied ? `\n💰 Price: <s>$${price}</s> <b>$${view(finalPrice)}</b>` : `\n💰 Price: <b>$${finalPrice}</b>`}\n\n💳 Wallet: <b>$${view(usdBal)}</b>`
      send(chatId, summary, k.of([`✅ Pay $${view(finalPrice)} USD`, '🎟️ Apply Coupon']))
      set(state, chatId, 'action', a.targetLeadsConfirm)
    },

    // Custom lead request
    customLeadRequestName: () => {
      send(chatId, '📝 <b>Request Custom Leads</b>\n\nType the name of the institution or company you want targeted leads for:', { parse_mode: 'HTML', reply_markup: { keyboard: [[t.backButton || '⬅️ Back']], resize_keyboard: true } })
      set(state, chatId, 'action', a.customLeadRequestName)
    },
    customLeadRequestCity: () => {
      send(chatId, `🏙️ Which city or area do you want leads from?\n\nTarget: <b>${info?.customLeadTarget}</b>\n\nType the city name or "Nationwide" for all areas:`, { parse_mode: 'HTML', reply_markup: { keyboard: [['Nationwide'], [t.backButton || '⬅️ Back']], resize_keyboard: true } })
      set(state, chatId, 'action', a.customLeadRequestCity)
    },
    customLeadRequestDetails: () => {
      send(chatId, `📋 Any additional details? (e.g., preferred area codes, carrier, volume needed)\n\nTarget: <b>${info?.customLeadTarget}</b>\nArea: <b>${info?.customLeadCity}</b>\n\nType details or "None" to skip:`, { parse_mode: 'HTML', reply_markup: { keyboard: [['None'], [t.backButton || '⬅️ Back']], resize_keyboard: true } })
      set(state, chatId, 'action', a.customLeadRequestDetails)
    },

    // validator
    validatorSelectCountry: () => {
      send(chatId, t.validatorSelectCountry, k.validatorSelectCountry)
      set(state, chatId, 'action', a.validatorSelectCountry)
    },

    validatorPhoneNumber: () => {
      send(chatId, t.validatorPhoneNumber, bc)
      set(state, chatId, 'action', a.validatorPhoneNumber)
    },

    validatorSelectSmsVoice: () => {
      send(chatId, t.validatorSelectSmsVoice(info?.phones?.length), k.validatorSelectSmsVoice)
      set(state, chatId, 'action', a.validatorSelectSmsVoice)
    },

    validatorSelectCarrier: () => {
      send(chatId, t.validatorSelectCarrier, k.validatorSelectCarrier(info?.country))
      set(state, chatId, 'action', a.validatorSelectCarrier)
    },

    validatorSelectCnam: () => {
      send(chatId, t.validatorSelectCnam, k.validatorSelectCnam)
      set(state, chatId, 'action', a.validatorSelectCnam)
    },

    validatorSelectAmount: () => {
      send(
        chatId,
        t.validatorSelectAmount(validatorSelectAmount[0], validatorSelectAmount[validatorSelectAmount.length - 1]),
        k.validatorSelectAmount,
      )
      set(state, chatId, 'action', a.validatorSelectAmount)
    },

    validatorSelectFormat: () => {
      send(chatId, t.validatorSelectFormat, k.validatorSelectFormat)
      set(state, chatId, 'action', a.validatorSelectFormat)
    },

    useFreeValidation: async () => {
      set(state, chatId, 'action', 'none')

      let cc = countryCodeOf[info?.country]
      let country = info?.country
      let cnam = info?.country === 'USA' ? info?.cnam : false

      const format = info?.format
      const l = format === validatorSelectFormat[0]

      send(chatId, t.validatorBulkNumbersStart, trans('o'))
      const phones = info?.phones?.slice(0, info?.amount)
      const leadsAmount = info?.amount
      const res = await validatePhoneBulkFile(info?.carrier, phones, cc, cnam, bot, chatId)
      if (!res) return send(chatId, t.validatorError)

      send(chatId, t.validatorSuccess(info?.amount, res.length))

      cc = '+' + cc
      const re = cc === '+1' ? '' : '0'
      const file1 = 'leads.txt'
      fs.writeFile(file1, res.map(a => (l ? a[0].replace(cc, re) : a[0])).join('\n'), () => {
        bot?.sendDocument(chatId, file1).catch()
      })

      if (cnam) {
        const file2 = 'leads_with_cnam.txt'
        fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[3]).join('\n'), () => {
          bot?.sendDocument(chatId, file2).catch()
          bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2).catch()
        })
      }

      // Deduct from free validations
      const freeRemaining = (await get(freeValidationsAvailableFor, chatId)) || 0
      const newRemaining = freeRemaining - leadsAmount
      set(freeValidationsAvailableFor, chatId, Math.max(0, newRemaining))

      const name = await get(nameOf, chatId)
      set(payments, nanoid(), `Free,Validate Leads,${leadsAmount} leads,$0,${chatId},${name},${new Date()}`)
      send(chatId, t.freeValidationUsed(leadsAmount, Math.max(0, newRemaining)), trans('o'))
    },

    usePartialFreeValidation: async () => {
      // User has some free validations but not enough for the full request
      // Use free quota first, then charge wallet for the remainder
      const freeRemaining = (await get(freeValidationsAvailableFor, chatId)) || 0
      const totalAmount = info?.amount
      const paidAmount = totalAmount - freeRemaining
      const cnam = info?.country === 'USA' ? info?.cnam : false
      const paidPrice = paidAmount * RATE_LEAD_VALIDATOR + (cnam ? paidAmount * RATE_CNAM_VALIDATOR : 0)

      // Save partial info for the wallet flow to use
      await saveInfo('freePortionAmount', freeRemaining)
      await saveInfo('paidPortionAmount', paidAmount)
      await saveInfo('price', paidPrice)
      await saveInfo('partialFree', true)

      const lang = info?.userLanguage ?? 'en'
      send(chatId, translation('t.partialFreeValidation', lang, freeRemaining, totalAmount, paidAmount, paidPrice))

      // Send to wallet to pay for the remaining portion
      return goto.walletSelectCurrency()
    },

    // short link
    redSelectUrl: async () => {
      set(state, chatId, 'action', a.redSelectUrl)
      send(chatId, t.redSelectUrl, bc)
    },

    redSelectRandomCustom: () => {
      send(chatId, t.redSelectRandomCustom, trans('k.redSelectRandomCustom'))
      set(state, chatId, 'action', a.redSelectRandomCustom)
    },

    redSelectProvider: () => {
      send(chatId, trans('t.redSelectProvider'), trans('k.redSelectProvider'))
      set(state, chatId, 'action', a.redSelectProvider)
    },

    redSelectCustomExt: () => {
      send(chatId, t.redSelectCustomExt, bc)
      set(state, chatId, 'action', a.redSelectCustomExt)
    },

    submenu1: () => {
      set(state, chatId, 'action', a.submenu1)
      send(chatId, t.urlShortenerSelect || t.select, trans('k.of', [[user.redBitly, user.redShortit], [user.urlShortener], [user.viewShortLinks]]))
    },
    submenu2: () => {
      set(state, chatId, 'action', a.submenu2)
      send(chatId, t.select, trans('k.of', [user.buyDomainName, user.viewDomainNames, user.dnsManagement]))
    },

    // cPanel Plans SubMenu
    submenu3: () => {
      saveInfo('username', username)
      set(state, chatId, 'action', a.submenu3)
      send( chatId, t.selectPlan, k.of(
        HOSTING_TRIAL_PLAN_ON && HOSTING_TRIAL_PLAN_ON === 'true'
          ? [[user.freeTrial, user.starterPlan], [user.proPlan, user.businessPlan], user.contactSupport]
          : [[user.starterPlan], [user.proPlan, user.businessPlan], user.contactSupport]
      ));
    },

    displayEmailValidationError: () => {
      send(chatId, t.trialPlanInValidEmail, k.of([[t.backButton]]))
    },

    //free Trial Package
    freeTrialMenu: () => {
      set(state, chatId, 'action', a.freeTrial)
      send(chatId, t.selectedTrialPlan, k.of([user.freeTrialMenuButton, user.contactSupport]))
    },
    freeTrial: () => {
      set(state, chatId, 'action', a.freeTrial)
      send(chatId, t.freeTrialPlanSelected(info.hostingType), k.of([[user.getFreeTrialPlanNow, t.backButton]]))
    },
    getFreeTrialPlanNow: () => {
      set(state, chatId, 'action', a.getPlanNow)
      saveInfo('plan', 'Freedom Plan')
      send(chatId, t.getFreeTrialPlan, k.of([[user.backToFreeTrial]]))
    },
    continueWithDomainNameSBS: (websiteName) => {
      set(state, chatId, 'action', a.domainAvailableContinue)
      saveInfo('website_name', websiteName)
      saveInfo('existingDomain', false)
      send(chatId, t.trialPlanContinueWithDomainNameSBSMatched(websiteName), k.of([[user.continueWithDomainNameSBS(websiteName)], [user.searchAnotherDomain], [t.backButton]]))
    },
    nameserverSelectionSBS: (websiteName) => {
      set(state, chatId, 'action', a.nameserverSelectionSBS)
      const actions = [[user.privHostNS], [user.cloudflareNS], [t.backButton]];
      send(chatId, t.trialPlanNameserverSelection(websiteName), k.of(actions))
    },
    proceedContinueWithDomainNameSBS: () => {
      set(state, chatId, 'action', a.continueWithDomainNameSBS)
      send(chatId, t.trialPlanDomainNameMatched, k.of([[t.backButton]]))
    },
    confirmEmailBeforeProceedingSBS: (email) => {
      saveInfo('email', email)
      set(state, chatId, 'action', a.confirmEmailBeforeProceedingSBS)
      send(chatId, t.confirmEmailBeforeProceedingSBS(email), k.of([[t.yesProceedWithThisEmail(email)], [t.backButton]]))
    },
    sendcPanelCredentialsAsEmailToUser: async () => {
      try {
        send(chatId, t.trialPlanActivationConfirmation)
        send(chatId, t.trialPlanActivationInProgress, trans('o'))
        return await registerDomainAndCreateCpanel(send, info, trans('o'), state)
      } catch (error) {
        console.error('Error in sending messages or email:', error)
      }
    },


    // Step 1: Select Plan
    selectPlan: plan => {
      let planName = 'Starter Plan';

      if (plan === a.businessPlan) {
        planName = 'Business Plan';
      } else if (plan === a.proPlan) {
        planName = 'Pro Plan';
      }

      saveInfo('plan', planName)
      set(state, chatId, 'action', plan)
      const message = hP.generatePlanText(info.hostingType, plan);

      let actions = [[user.buyStarterPlan], [user.viewProPlan, user.viewBusinessPlan], [user.backToHostingPlans]];
      if (plan === a.proPlan) {
        actions = [[user.buyProPlan], [user.viewStarterPlan, user.viewBusinessPlan], [user.backToHostingPlans]];
      } else if (plan === a.businessPlan) {
        actions = [[user.buyBusinessPlan], [user.viewStarterPlan, user.viewProPlan], [user.backToHostingPlans]];
      }

      send(chatId, message, k.of(actions))
    },

    // Step 1.1: View Plan
    viewPlan: plan => {
      set(state, chatId, 'action', plan)
      const message = hP.generatePlanText(info.hostingType, plan);
      send(chatId, message, bc)
    },

    // Step 2: Buy Plan
    buyPlan: plan => {
      set(state, chatId, 'action', plan)
      console.log("buyPlan", plan)
      const message = hP.generatePlanStepText("buyText");
      let actions = [user.registerANewDomain, user.useExistingDomain, [user.backToStarterPlanDetails]];

      if (plan === a.businessPlan) {
        actions = [user.registerANewDomain, user.useExistingDomain, [user.backToBusinessPlanDetails]];
      } else if (plan === a.proPlan) {
        actions = [user.registerANewDomain, user.useExistingDomain, [user.backToProPlanDetails]];
      }

      send(chatId, message, k.of(actions))
    },

    // Step 2.1: Register New Domain
    registerNewDomain: () => {
      set(state, chatId, 'action', a.registerNewDomain)
      saveInfo('existingDomain', false)

      const message = hP.generatePlanStepText("registerNewDomainText");
      send(chatId, message, bc)
    },

    // Step 2.2: Register New Domain - Found
    registerNewDomainFound: (websiteName, price) => {
      set(state, chatId, 'action', a.registerNewDomainFound)
      saveInfo('website_name', websiteName)
      const domainFoundText = hP.generateDomainFoundText(websiteName, price);
      send(chatId, domainFoundText, k.of([[user.continueWithDomain(websiteName)], [user.searchAnotherDomain]]))
    },

    // Step 2.3: Use Existing Domain
    useExistingDomain: () => {
      set(state, chatId, 'action', a.useExistingDomain)
      saveInfo('existingDomain', true)
      const message = hP.generatePlanStepText("useExistingDomainText");
      send(chatId, message, bc)
    },

    // Step 2.4: Use Existing Domain - Found
    useExistingDomainFound: (websiteName) => {
      set(state, chatId, 'action', a.useExistingDomainFound)
      saveInfo('website_name', websiteName)
      send(chatId, hP.generateExistingDomainText(websiteName), k.of([[user.continueWithDomain(websiteName)], [user.searchAnotherDomain]]))
    },

    domainNotFound: (websiteName) => {
      set(state, chatId, 'action', a.domainNotFound)
      send(chatId, hP.domainNotFound(websiteName), bc)
    },

    // Step 3: Nameserver Selection
    nameserverSelection: (websiteName) => {
      set(state, chatId, 'action', a.nameserverSelection)
      const actions = [[user.privHostNS], [user.cloudflareNS]];
      send(chatId, hP.nameserverSelectionText(websiteName), k.of(actions))
    },

    // Step 4: Enter your email
    enterYourEmail: () => {
      set(state, chatId, 'action', a.enterYourEmail)
      send(chatId, hP.generatePlanStepText('enterYourEmail'), bc)
    },

    // Step 4.1: Confirm Email
    confirmEmailBeforeProceeding: (email) => {
      saveInfo('email', email)
      set(state, chatId, 'action', a.confirmEmailBeforeProceeding)
      send(chatId, hP.confirmEmailBeforeProceeding(email), k.of([t.yesProceedWithThisEmail(email)]))
    },

    // Step 4.2: Proceed with Email
    proceedWithEmail: (domainName, domainPrice) => {
      let hostingPrice = parseFloat(HOSTING_STARTER_PLAN_PRICE)

      if (info.plan === 'Business Plan') {
        hostingPrice = parseFloat(HOSTING_BUSINESS_PLAN_PRICE)
      } else if (info.plan === 'Pro Plan') {
        hostingPrice = parseFloat(HOSTING_PRO_PLAN_PRICE)
      }

      if (info.existingDomain) {
        domainPrice = 0
      }
      const totalPrice = domainPrice + hostingPrice;

      saveInfo("couponApplied", false);
      saveInfo("couponDiscount", 0);
      saveInfo("hostingPrice", hostingPrice);
      saveInfo("totalPrice", totalPrice);

      const payload = {
        domainName: domainName,
        domainPrice: domainPrice,
        hostingPrice: hostingPrice,
        couponDiscount: 0,
        totalPrice: totalPrice,
        existingDomain: info.existingDomain
      }

      set(state, chatId, 'action', a.proceedWithEmail)
      send(chatId, hP.generateInvoiceText(payload), k.of([t.proceedWithPayment]),
      )
    },

    // Step 5: Ask Coupon
    plansAskCoupon: action => {
      saveInfo('couponApplied', false)
      saveInfo('couponDiscount', 0)
      send(chatId, t.planAskCoupon, k.of([t.skip]))
      set(state, chatId, 'action', a.askCoupon + action)
    },

    // Step 5.1: Skip Coupon
    skipCoupon: (action) => {
      // set(state, chatId, 'action', a.skipCoupon)
      saveInfo('couponApplied', false)
      saveInfo('couponDiscount', 0)
      goto[action]()
    },

    // Step 6: Proceed with Payment
    proceedWithPaymentProcess: async () => {
      send(chatId, hP.generatePlanStepText('paymentConfirmation'), k.of([t.iHaveSentThePayment]))
    },

    // Step 6.1: I have sent the payment
    iHaveSentThePayment: async () => {
      set(state, chatId, 'action', 'none')
      send(chatId, hP.generatePlanStepText('paymentSuccess'), trans('o'))
    },
    userLanguage : () => {
      set(state, chatId, 'action', a.addUserLanguage)
      return send(chatId, trans('l.askPreferredLanguage') , trans('languageMenu'))
    },
    askUserEmail : () => {
      set(state, chatId, 'action', a.askUserEmail)
      return send(chatId, trans('l.askUserEmail'), trans('k.of', [[trans('t.backButton')]]))    
    },
    askUserTerms: () => {
      set(state, chatId, 'action', a.askUserTerms)
      send(chatId, trans('l.termsAndCond'), trans('termsAndConditionType', info?.userLanguage ?? 'en'))
      setTimeout(() => {
        return send(chatId, trans('l.acceptTermMsg'), trans('k.of', [[trans('l.acceptTermButton')], [trans('l.declineTermButton')], [trans('t.backButton')]]))
      },1000)
      return
    },

    submenu4: async () => {
      set(state, chatId, 'action', a.submenu4)
      if (!info.isRegisteredTelegramForVps) {
        const result = await registerVpsTelegram(chatId, info?.userEmail)
        if (result) {
          saveInfo('isRegisteredTelegramForVps', true)
          info.isRegisteredTelegramForVps = true
        }
      }
      if (!info.isEmailRegisteredForNameword) {
        const result = await checkMissingEmailForNameword(chatId)
        if (result?.missingEmail) {
          const addEmail = await addUserEmailForNameWord(chatId, info?.userEmail)
          if (addEmail) {
            saveInfo('isEmailRegisteredForNameword', true)
          }
        } else {
          saveInfo('isEmailRegisteredForNameword', true)
        }
      }
      send(chatId, t.select, trans('k.of', [user.manageVpsPlan, user.buyVpsPlan]))
    },

    // ask vps plan
    createNewVpsFlow: async () => {
      set(state, chatId, 'action', a.askCountryForVPS)
      const availableCountry = await fetchAvailableCountries()
      if (!availableCountry) return send(chatId, vp.failedFetchingData, trans('o'))
      saveInfo('vpsAreaList', availableCountry)
      return send(chatId, vp.askCountryForUser, vp.of(availableCountry))
    },

    askRegionAreaForVps: async () => {
      set(state, chatId, 'action', a.askRegionAreaForVPS)
      const availableRegions = await fetchAvailableRegionsOfCountry(info?.vpsDetails?.country)
      if (!availableRegions) return send(chatId, vp.failedFetchingData, trans('o'))
      const regionsList = availableRegions.map((item) => item.label)
      saveInfo('vpsAreaList', availableRegions)
      return send(chatId, vp.askRegionForUser(info?.vpsDetails?.country), vp.of(regionsList))    
    },

    askZoneForVps: async () => {
      set(state, chatId, 'action', a.askZoneForVPS)
      const availableZones = await fetchAvailableZones(info?.vpsDetails?.region)
      if (!availableZones) return send(chatId, vp.failedFetchingData, trans('o'))
      const zoneList = availableZones.map((item) => item.label)
      saveInfo('vpsAreaList', availableZones)
      return send(chatId, vp.askZoneForUser(info?.vpsDetails.regionName), vp.of(zoneList))    
    },

    confirmZoneForVPS: async () => {
      set(state, chatId, 'action', a.confirmZoneForVPS)
      const vpsDetails = info?.vpsDetails
      return send(chatId, vp.confirmZone(vpsDetails.regionName, vpsDetails.zone), vp.of([vp.confirmBtn]))  
    },

    askVpsDiskType: async () => {
      set(state, chatId, 'action', a.askVpsDiskType)
      send(chatId, vp.vpsWaitingTime)
      const diskTypes = await fetchAvailableDiskTpes(info?.vpsDetails?.zone)
      log(diskTypes)
      if (!diskTypes || !diskTypes.length) return send(chatId, vp.failedFetchingData, trans('o'))
      const diskList = diskTypes?.map((item) => item.label) || []
      saveInfo('vpsDiskTypes', diskTypes)
      return send(chatId, vp.askVpsDiskType(diskTypes), vp.of(diskList))
    },
   
    askVpsConfig: async () => {
      set(state, chatId, 'action', a.askVpsConfig)
      const configTypes = info?.vpsConfigTypes
      const configList = configTypes.map((item) => item.name)
      return send(chatId, vp.askVpsConfig(configTypes), vp.of(configList))  
    },

    askUserVpsPlan: () => {
      set(state, chatId, 'action', a.askUserVpsPlan)
      const vpsDetails = info.vpsDetails
      const plans = vpsDetails.config.billingCycles.map((item) => item.type)
      send(chatId, vp.askPlanType(vpsDetails.config.billingCycles), vp.of(plans)) 
      return send(chatId, vp.hourlyBillingMessage)
    },

    askCouponForVPSPlan: () => {
      set(state, chatId, 'action', a.askCouponForVPSPlan)
      return send(chatId, vp.askForCoupon, vp.of([vp.skip]))  
    },

    skipCouponVps: () => {
      set(state, chatId, 'action', a.skipCouponVps)
      return send(chatId, vp.skipCouponwarning, vp.of([vp.confirmSkip, t.goBackToCoupon]))  
    },

    askVPSPlanAutoRenewal: () => {
      set(state, chatId, 'action', a.askVPSPlanAutoRenewal)
      return send(chatId, vp.askAutoRenewal, vp.of([vp.enable, vp.skip]))  
    },

    askVpsCpanel: () => {
      set(state, chatId, 'action', a.askVpsCpanel)
      return send(chatId, vp.askVpsCpanel, vp.cpanelMenu)
    },

    askVpsCpanelLicense: async () => {
      set(state, chatId, 'action', a.askVpsCpanelLicense)
      const licenseData = await fetchSelectedCpanelOptions(info.vpsDetails.panel)
      if (!licenseData) return send(chatId, vp.failedFetchingData, trans('o'))
      saveInfo('vpsSelectedPanelOptions', licenseData)
      const list = licenseData.map((item) => item.name)
      return send(chatId, vp.askCpanelOtions(info.vpsDetails.panel.name, licenseData), vp.of(list))
    },

    askVpsOS: async () => {
      set(state, chatId, 'action', a.askVpsOS)
      const osData = await fetchAvailableOS(info.vpsDetails.panel)
      if (!osData) return send(chatId, vp.failedFetchingData, trans('o'))
      const osList = osData.map((item) => item.name)
      const winosDetails = osData.find((ar) => ar.value === 'win')
      saveInfo('vpsOSList', osData)
      return send(chatId, vp.askVpsOS(winosDetails?.price), vp.of([...osList, vp.skipOSBtn]))
    },

    vpsAskSSHKey: async () => {
      set(state, chatId, 'action', a.vpsAskSSHKey)
      let list = []
      let vpsDetails = info.vpsDetails
      const sshKeyList = await fetchUserSSHkeyList(chatId)
      if (sshKeyList && sshKeyList.keys.length) {
        list = sshKeyList.keys.map((key) => key.name)
        vpsDetails.hasSSHKey = true
      }
      vpsDetails.sshKeysList = list
      saveInfo('vpsDetails', vpsDetails)
      return list.length ? 
        send(chatId, vp.existingSSHMessage, vp.of([vp.generateSSHKeyBtn, vp.linkSSHKeyBtn, vp.skipSSHKeyBtn]))
        : send(chatId, vp.noExistingSSHMessage, vp.of([vp.generateSSHKeyBtn, vp.skipSSHKeyBtn]))
    },

    vpsLinkSSHKey: () => {
      set(state, chatId, 'action', a.vpsLinkSSHKey)
      return send(chatId, vp.selectSSHKey, vp.of([...info.vpsDetails.sshKeysList, vp.uploadNewKeyBtn, vp.cancel]))
    },

    askSkipSSHkeyconfirmation: () => {
      set(state, chatId, 'action', a.askSkipSSHkeyconfirmation)
      return send(chatId, vp.confirmSkipSSHMsg, vp.of([vp.confirmSkipSSHBtn, vp.setUpSSHBtn]))
    },

    askUploadSSHPublicKey : () => {
      set(state, chatId, 'action', a.askUploadSSHPublicKey)
      return send(chatId, vp.askToUploadSSHKey, vp.of([]))
    },

    vpsAskPaymentConfirmation: () => {
      set(state, chatId, 'action', a.proceedWithVpsPayment)
      return send(chatId, vp.generateBillSummary(info?.vpsDetails), vp.of([vp.yes, vp.no]))
    },

    // VPS Management
    getUserAllVmIntances: async () => {
      set(state, chatId, 'action', a.getUserAllVmIntances)
      let list = []
      send(chatId, vp.vpsWaitingTime)
      const vpsList = await fetchUserVPSList(chatId)
      if (!vpsList) return send(chatId, vp.failedFetchingData, trans('o'))
      const vpsDetails = vpsList.map(({name, _id, vps_name}) => ({ name, _id, vps_name }));
      list = vpsList.map((vps) => vps.name)
      saveInfo('userVPSDetails', vpsDetails)
      return list.length ? 
        send(chatId, vp.vpsList(vpsList), vp.of([...list, user.buyVpsPlan]))
        : send(chatId, vp.noVPSfound, vp.of([user.buyVpsPlan]))
    },

    getVPSDetails: async () => {
      set(state, chatId, 'action', a.getVPSDetails)
      send(chatId, vp.vpsWaitingTime)
      const vpsData = await fetchVPSDetails(chatId, info.vpsDetails._id)
      if (!vpsData) return send(chatId, vp.failedFetchingData, trans('o'))
      saveInfo('userVPSDetails', vpsData)
      let action = vpsData.status === 'RUNNING' ? [vp.stopVpsBtn, vp.restartVpsBtn] : [vp.startVpsBtn]
      return send(chatId, vp.selectedVpsData(vpsData), vp.of([ ...action, vp.subscriptionBtn, vp.VpsLinkedKeysBtn, vp.upgradeVpsBtn,  vp.deleteVpsBtn]))
    },

    confirmStopVps : () => {
      set(state, chatId, 'action', a.confirmStopVps)
      return send(chatId, vp.confirmStopVpstext(info.vpsDetails.name), vp.of([ vp.confirmChangeBtn, vp.cancel])) 
    },

    confirmDeleteVps: () => {
      set(state, chatId, 'action', a.confirmDeleteVps)
      return send(chatId, vp.confirmDeleteVpstext(info.vpsDetails.name), vp.of([ vp.confirmChangeBtn, vp.cancel])) 
    },

    upgradeVpsInstance: () => {
      set(state, chatId, 'action', a.upgradeVpsInstance)
      return send(chatId, vp.upgradeVPS, vp.of([ vp.upgradeVpsPlanBtn, vp.upgradeVpsDiskBtn ])) 
    },

    upgradeVpsPlan: async () => {
      const vpsDetails = info.vpsDetails
      send(chatId, vp.vpsWaitingTime)
      const upgradeOptions = await fetchVpsUpgradeOptions(chatId, vpsDetails._id, vpsDetails.upgradeType === 'plan' ? 'vps' : 'disk')
      if (!upgradeOptions) return send(chatId, vp.failedFetchingData, trans('o'))
      if (vpsDetails.upgradeType === 'plan') {
        if (!upgradeOptions.length) return send(chatId, vp.alreadyEnterprisePlan)
        const upgradeBtns = upgradeOptions.map((item) => vp.upgradeOptionVPSBtn(item.to))
        set(state, chatId, 'action', a.upgradeVpsPlan)
        saveInfo('VPSUpgradeOptions', upgradeOptions)
        return send(chatId, vp.upgradeVpsPlanMsg(upgradeOptions), vp.of([ ...upgradeBtns, vp.cancel]))
      } else if (vpsDetails.upgradeType === 'disk') {
        const updatedOptions = upgradeOptions.filter(item => item?.id)
        if (!updatedOptions.length) return send(chatId, vp.alreadyHighestDisk(info?.userVPSDetails))
        const upgradeBtns = updatedOptions.map((item) => vp.upgradeOptionVPSBtn(item.to))
        set(state, chatId, 'action', a.upgradeVpsPlan)
        saveInfo('VPSUpgradeOptions', updatedOptions)
        return send(chatId, vp.upgradeVpsDiskMsg(updatedOptions), vp.of([ ...upgradeBtns, vp.cancel]))
      }
    },

    askVpsUpgradePayment : async () => {
      set(state, chatId, 'action', a.askVpsUpgradePayment)
      const { usdBal } = await getBalance(walletOf, chatId)
      const lowBalance = info.vpsDetails.billingCycle === 'Hourly' && usdBal < info.vpsDetails.totalPrice
      return send(chatId, info.vpsDetails.upgradeType === 'plan' ? vp.upgradePlanSummary(info.vpsDetails, info.userVPSDetails, lowBalance) : vp.upgradeDiskSummary(info.vpsDetails, info.userVPSDetails, lowBalance), vp.of([vp.yes, vp.no]))
    },

    vpsSubscription: () => {
      set(state, chatId, 'action', a.vpsSubscription)
      const vpsDetails = info.userVPSDetails
      const availableOptions = vpsDetails.cPanelPlanDetails?.id ? [vp.manageVpsSubBtn, vp.manageVpsPanelBtn] : [vp.manageVpsSubBtn]
      const cPanelRenewDate = vpsDetails.cPanelPlanDetails?.id ? date(vpsDetails.cPanelPlanDetails.expiryDate) : ''
      return send(chatId, vp.vpsSubscriptionData(vpsDetails, date(vpsDetails.subscriptionEnd), cPanelRenewDate), vp.of(availableOptions))
    },

    manageVpsSub: () => {
      set(state, chatId, 'action', a.manageVpsSub)
      const btn = info.userVPSDetails.autoRenewable ? vp.vpsDisableRenewalBtn : vp.vpsEnableRenewalBtn
      const expiryDate = date(info.userVPSDetails.subscriptionEnd)
      return send(chatId, vp.vpsSubDetails(info.userVPSDetails, expiryDate), vp.of([btn, vp.vpsPlanRenewBtn]))
    },

    manageVpsPanel: () => {
      set(state, chatId, 'action', a.manageVpsPanel)
      const vpsDetails = info.userVPSDetails
      const expiryDate = date(vpsDetails.cPanelPlanDetails.expiryDate)
      return send(chatId, vp.vpsCPanelDetails(info.userVPSDetails, expiryDate), vp.of([vp.vpsPlanRenewBtn]))
    },

    vpsLinkedSSHkeys : async () => {
      set(state, chatId, 'action', a.vpsLinkedSSHkeys)
      const sshKeyList = await fetchUserSSHkeyList(chatId, info.userVPSDetails._id)
      if (!sshKeyList) return send(chatId, vp.failedFetchingData, trans('o'))
      let list = []
      if (sshKeyList && sshKeyList.keys.length) {
        list = sshKeyList.keys.map((key) => key.name)
      }
      let vpsDetails = info.vpsDetails
      vpsDetails.linkedSSHKeys = list
      saveInfo('vpsDetails', vpsDetails)
      return list.length ? 
        send(chatId, vp.linkedKeyList(list, info.userVPSDetails.name), vp.of([vp.linkVpsSSHKeyBtn, vp.unlinkSSHKeyBtn, vp.downloadSSHKeyBtn])) :
        send(chatId, vp.noLinkedKey(info.userVPSDetails.name), vp.of([vp.linkVpsSSHKeyBtn])) 
    },

    vpsUnlinkSSHKey: () => {
      set(state, chatId, 'action', a.vpsUnlinkSSHKey)
      const linkedSSHKeys = info.vpsDetails.linkedSSHKeys
      return send(chatId, vp.unlinkSSHKeyList(info.userVPSDetails.name), vp.of([...linkedSSHKeys, vp.cancel]))
    },

    confirmVpsUnlinkSSHKey : () => {
      set(state, chatId, 'action', a.confirmVpsUnlinkSSHKey)
      return send(chatId, vp.confirmUnlinkKey(info.vpsDetails), vp.of([vp.confirmUnlinkBtn, vp.cancel]))
    },

    vpslinkNewSSHKey : async () => {
      set(state, chatId, 'action', a.vpslinkNewSSHKey)
      let list = []
      const sshKeyList = await fetchUserSSHkeyList(chatId)
      if (!sshKeyList) return send(chatId, vp.failedFetchingData, trans('o'))
      let vpsDetails = info.vpsDetails
      if (sshKeyList && sshKeyList.keys.length) {
        let newList = sshKeyList.keys.map((key) => key.name)
        list = newList.filter((key) => !vpsDetails.linkedSSHKeys.includes(key))
      }
      vpsDetails.allSSHkeys = list
      saveInfo('vpsDetails', vpsDetails)
      return list.length ? 
        send(chatId, vp.userSSHKeyList(info.userVPSDetails.name), vp.of([...list, vp.uploadNewKeyBtn, vp.cancel])) :
        send(chatId, vp.noUserKeyList, vp.of([vp.uploadNewKeyBtn, vp.cancel])) 
    },

    uploadSShKeyToAttach: () => {
      set(state, chatId, 'action', a.uploadSShKeyToAttach)
      return send(chatId, vp.askToUploadSSHKey, vp.of([]))
    },

    downloadSSHKey: () => {
      set(state, chatId, 'action', a.downloadSSHKey)
      const list = info.vpsDetails.linkedSSHKeys
      return send(chatId, vp.selectSSHKeyToDownload, vp.of([...list, vp.cancel]))
    },

    confirmVPSRenewDetails: async () => {
      set(state, chatId, 'action', a.confirmVPSRenewDetails)
      let vpsDetails = info.vpsDetails
      const vpsData = info.userVPSDetails
      const expiryDate = vpsData?.cPanelPlanDetails?.id ? date(vpsData.cPanelPlanDetails?.expiryDate ) : date(vpsData.subscriptionEnd)
      const { usdBal } = await getBalance(walletOf, chatId)
      const lowBalance = info.vpsDetails?.billingCycle === 'Hourly' && usdBal < info.vpsDetails.totalPrice
      return send(chatId, vpsDetails.upgradeType === 'vps-renew' 
        ?  vp.renewVpsPlanConfirmMsg(vpsDetails, vpsData, expiryDate, lowBalance) 
        : vp.renewVpsPanelConfirmMsg(vpsDetails, vpsData.cPanelPlanDetails, expiryDate), vp.of([vp.payNowBtn, vp.cancel]))
    }
  }

  const walletOk = {
    'plan-pay': async coin => {
      set(state, chatId, 'action', 'none')

      const plan = info?.plan
      const lang = info?.userLanguage || 'en'
      const name = await get(nameOf, chatId)
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      if (coin === u.usd) {
        const priceUsd = price
        if (usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
        set(payments, nanoid(), `Wallet,Plan,${plan},$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      } else {
        const priceNgn = await usdToNgn(price)
        if (ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
        set(payments, nanoid(), `Wallet,Plan,${plan},$${price},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      }

      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
      subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang, freeValidationsAvailableFor)
      notifyGroup(`💎 <b>New Subscription!</b>\nUser ${maskName(name)} just upgraded to the <b>${plan} Plan</b> — unlocking ${freeDomainsOf[plan]} free domains + ${(freeValidationsOf[plan] || 0).toLocaleString()} phone validations.\nDon't miss out — /start`)
    },

    'domain-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      // buy domain
      const domain = info?.domain
      const lang = info?.userLanguage ?? 'en'
      const error = await buyDomainFullProcess(chatId, lang, domain)
      if (error) return
      const name = await get(nameOf, chatId)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Domain,${domain},$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      }
      if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Domain,${domain},$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
      notifyGroup(`🌐 <b>Domain Registered!</b>\nUser ${maskName(name)} just claimed <b>${domain}</b> — your dream domain could be next.\nGrab yours before it's taken — /start`)
    },
    'hosting-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.totalPrice
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      await registerDomainAndCreateCpanel(send, info, trans('o'), state)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Domain,${info.domain},$${priceUsd},${chatId},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      }
      if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Domain,${info.domain},$${priceUsd},${chatId},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
    'vps-plan-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const price = Number(info?.vpsDetails.totalPrice)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
      const vpsDetails = info?.vpsDetails

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      
      // IN case of hourly need atleast min amount in wallet
      if (vpsDetails.plan === 'Hourly' && price < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE) {
        const priceUsdCheck = VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
        if (coin === u.usd && usdBal < priceUsdCheck) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
        const priceNgnCheck = await usdToNgn(VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE)
        if (coin === u.ngn && ngnBal < priceNgnCheck) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      }      

      // buy VPS
      const lang = info?.userLanguage ?? 'en'
      const name = await get(nameOf, chatId)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,VPSPlan,${vpsDetails?.plan},$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      }
      if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,VPSPlan,${vpsDetails?.plan},$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      }
      sendMessage(chatId, translation('vp.paymentRecieved', lang), rem)
      const isSuccess = await buyVPSPlanFullProcess(chatId, lang, vpsDetails)
      if (!isSuccess) return
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
    'vps-upgrade-plan-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const vpsDetails = info?.vpsDetails
      const price = Number(vpsDetails.totalPrice)
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      // IN case of hourly need atleast min amount in wallet
      if (vpsDetails?.billingCycle === 'Hourly' && price < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE) {
        const priceUsdCheck = VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE
        if (coin === u.usd && usdBal < priceUsdCheck) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
        const priceNgnCheck = await usdToNgn(VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE)
        if (coin === u.ngn && ngnBal < priceNgnCheck) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      }

      const lang = info?.userLanguage ?? 'en'
      const name = await get(nameOf, chatId)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,VPSUpgrade,${vpsDetails?.upgradeType},$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      }
      if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,VPSUpgrade,${vpsDetails?.upgradeType},$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      }
      sendMessage(chatId, translation('vp.vpsChangePaymentRecieved', lang), rem)

      const isSuccess = await upgradeVPSDetails(chatId, lang, vpsDetails)
      if (!isSuccess) return

      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
    },
    'phone-pay': async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.cpPrice
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      const name = await get(nameOf, chatId)
      
      // wallet deduct
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,CloudPhone,$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      } else {
        set(payments, nanoid(), `Wallet,CloudPhone,$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      }

      // Buy number via Telnyx
      send(chatId, phoneConfig.getMsg(info?.userLanguage).purchasingNumber)
      const selectedNumber = info?.cpSelectedNumber
      const planKey = info?.cpPlanKey
      const plan = phoneConfig.plans[planKey]
      const countryName = info?.cpCountryName || 'US'

      const orderResult = await telnyxApi.buyNumber(
        selectedNumber,
        telnyxResources.sipConnectionId,
        telnyxResources.messagingProfileId
      )

      if (!orderResult) {
        // Refund
        if (coin === u.usd) await atomicIncrement(walletOf, chatId, 'usdIn', priceUsd)
        else await atomicIncrement(walletOf, chatId, 'ngnIn', priceNgn)
        return send(chatId, '❌ Failed to purchase number. Your wallet has been refunded. Please try again or contact support.', trans('o'))
      }

      // Generate SIP credentials
      const sipUsername = phoneConfig.generateSipUsername()
      const sipPassword = phoneConfig.generateSipPassword()
      
      // Create SIP credential on Telnyx
      if (telnyxResources.sipConnectionId) {
        await telnyxApi.createSIPCredential(telnyxResources.sipConnectionId, sipUsername, sipPassword)
      }

      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      // Save to DB
      const numberDoc = {
        phoneNumber: selectedNumber,
        telnyxOrderId: orderResult.id,
        country: info?.cpCountryCode || 'US',
        countryName: countryName,
        type: info?.cpNumberType || 'local',
        plan: planKey,
        planPrice: price,
        purchaseDate: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        autoRenew: true,
        status: 'active',
        sipUsername: sipUsername,
        sipPassword: sipPassword,
        messagingProfileId: telnyxResources.messagingProfileId,
        connectionId: telnyxResources.sipConnectionId,
        smsUsed: 0,
        minutesUsed: 0,
        features: {
          sms: true,
          callForwarding: { enabled: false, mode: 'disabled', forwardTo: null, ringTimeout: 25 },
          voicemail: { enabled: false, greetingType: 'default', customGreetingUrl: null, forwardToTelegram: true, forwardToEmail: null, ringTimeout: 25 },
          smsForwarding: { toTelegram: true, toEmail: null, webhookUrl: null },
          recording: false,
        }
      }

      // Upsert into phoneNumbersOf
      const existing = await get(phoneNumbersOf, chatId)
      if (existing?.numbers) {
        existing.numbers.push(numberDoc)
        await set(phoneNumbersOf, chatId, { numbers: existing.numbers })
      } else {
        await set(phoneNumbersOf, chatId, { numbers: [numberDoc] })
      }

      // Save transaction
      await phoneTransactions.insertOne({
        chatId, phoneNumber: selectedNumber,
        action: 'purchase', plan: planKey,
        amount: price, paymentMethod: coin === u.usd ? 'wallet_usd' : 'wallet_ngn',
        timestamp: new Date().toISOString(),
      })

      const { usdBal: usd2, ngnBal: ngn2 } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd2, ngn2))
      send(chatId, phoneConfig.txt.activated(
        selectedNumber, plan.name, price, sipUsername,
        phoneConfig.SIP_DOMAIN,
        phoneConfig.shortDate(expiresAt.toISOString())
      ), trans('o'))

      // Notify admin
      notifyGroup(phoneConfig.txt.adminPurchase(maskName(name), selectedNumber, plan.name, price, coin === u.usd ? 'Wallet USD' : 'Wallet NGN'))
    },
    [a.buyLeadsSelectFormat]: async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      let cc = countryCodeOf[info?.country]
      let country = info?.country
      let cnam = info?.country === 'USA' ? info?.cnam : false

      let area = ['USA', 'Canada'].includes(info?.country) ? info?.area : 'Area Codes'
      let areaCodes

      if (info?.targetAreaCodes) {
        // Target Leads flow — area codes already resolved
        areaCodes = info?.areaCode === 'Mixed Area Codes' ? info.targetAreaCodes : [info?.areaCode]
      } else if (['Australia'].includes(info?.country)) {
        areaCodes = ['4']
      } else {
        areaCodes =
          info?.areaCode === 'Mixed Area Codes' ? _buyLeadsSelectAreaCode(info?.country, area) : [info?.areaCode]
      }

      const format = info?.format
      const l = format === buyLeadsSelectFormat[0]

      // buy leads
      const _startMsg = info?.targetName
        ? '🎯 Sourcing real data in progress. Please wait...'
        : t.validatorBulkNumbersStart
      send(chatId, _startMsg, trans('o'))
      const leadsAmount = info?.amount
      const lang = info?.userLanguage ?? 'en'
      const res = await validateBulkNumbers(info?.carrier, info?.amount, cc, areaCodes, cnam, bot, chatId, lang)
      if (!res) return send(chatId, t.buyLeadsError)

      const _successMsg = info?.targetName
        ? `🎯 Your ${info?.amount} targeted leads are ready.`
        : t.buyLeadsSuccess(info?.amount)
      send(chatId, _successMsg) // send success message

      cc = '+' + cc
      const re = cc === '+1' ? '' : '0'
      const file1 = 'leads.txt'
      fs.writeFile(file1, res.map(a => (l ? a[0].replace(cc, re) : a[0])).join('\n'), () => {
        bot?.sendDocument(chatId, file1)
      })

      if (cnam) {
        const file2 = 'leads_with_cnam.txt'
        fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[3]).join('\n'), () => {
          bot?.sendDocument(chatId, file2)
          bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2)
        })
      } else {
        if (country !== 'USA') {
          const file2 = 'leads_with_carriers.txt'
          fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1]).join('\n'), () => {
            bot?.sendDocument(chatId, file2)
            bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2)
          })
        }
      }

      {
        const file2 = 'leads_with_carriers_and_time.txt'
        chatId === 6687923716 &&
        fs.writeFile(
          file2,
          res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1] + ' ' + a[2]).join('\n'),
          () => bot?.sendDocument(chatId, file2),
        )
      }
      const name = await get(nameOf, chatId)

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Phone Leads,${leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', Number(priceUsd))
      } else if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Phone Leads,${leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      } else {
        return send(chatId, 'Some Issue')
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
      notifyGroup(`📱 <b>Leads Acquired!</b>\nUser ${maskName(name)} just got ${leadsAmount.toLocaleString()} verified phone leads.\nQuality leads on demand — try it — /start`)
    },

    [a.validatorSelectFormat]: async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))

      let cc = countryCodeOf[info?.country]
      let country = info?.country
      let cnam = info?.country === 'USA' ? info?.cnam : false

      const format = info?.format
      const l = format === validatorSelectFormat[0]

      // buy leads
      send(chatId, t.validatorBulkNumbersStart, trans('o')) // main keyboard view
      const phones = info?.phones?.slice(0, info?.amount)
      const leadsAmount = info?.amount
      const res = await validatePhoneBulkFile(info?.carrier, phones, cc, cnam, bot, chatId)
      if (!res) return send(chatId, t.validatorError)

      send(chatId, t.validatorSuccess(info?.amount, res.length)) // send success message

      cc = '+' + cc
      const re = cc === '+1' ? '' : '0'
      const file1 = 'leads.txt'
      fs.writeFile(file1, res.map(a => (l ? a[0].replace(cc, re) : a[0])).join('\n'), () => {
        bot?.sendDocument(chatId, file1).catch()
      })

      if (cnam) {
        const file2 = 'leads_with_cnam.txt'
        fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[3]).join('\n'), () => {
          bot?.sendDocument(chatId, file2).catch()
          bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2).catch()
        })
      } else {
        if (country !== 'USA') {
          const file2 = 'leads_with_carriers.txt'
          fs.writeFile(file2, res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1]).join('\n'), () => {
            bot?.sendDocument(chatId, file2).catch()
            bot?.sendDocument(TELEGRAM_ADMIN_CHAT_ID, file2).catch()
          })
        }
      }

      {
        const file2 = 'leads_with_carriers_and_time.txt'
        chatId === 6687923716 &&
        fs.writeFile(
          file2,
          res.map(a => (l ? a[0].replace(cc, re) : a[0]) + ' ' + a[1] + ' ' + a[2]).join('\n'),
          () => bot?.sendDocument(chatId, file2).catch(),
        )
      }
      const name = await get(nameOf, chatId)

      // If partial free validation, deduct free portion and log both
      if (info?.partialFree) {
        const freePortionAmount = info?.freePortionAmount || 0
        set(freeValidationsAvailableFor, chatId, 0)
        set(payments, nanoid(), `Free,Validate Leads,${freePortionAmount} leads,$0,${chatId},${name},${new Date()}`)
        send(chatId, t.freeValidationUsed(freePortionAmount, 0), trans('o'))
      }

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Validate Leads,${info?.partialFree ? info?.paidPortionAmount : leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      } else if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Validate Leads,${info?.partialFree ? info?.paidPortionAmount : leadsAmount} leads,$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      } else {
        return send(chatId, 'Some Issue')
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
      notifyGroup(`📱 <b>Leads Acquired!</b>\nUser ${maskName(name)} just got ${leadsAmount.toLocaleString()} verified phone leads.\nQuality leads on demand — try it — /start`)
    },
    [a.redSelectProvider]: async coin => {
      set(state, chatId, 'action', 'none')
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const { usdBal, ngnBal } = await getBalance(walletOf, chatId)

      if (![u.usd, u.ngn].includes(coin)) return send(chatId, 'Some Issue')

      // price validate
      const priceUsd = price
      const name = await get(nameOf, chatId)
      if (coin === u.usd && usdBal < priceUsd) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      const priceNgn = await usdToNgn(price)
      if (coin === u.ngn && ngnBal < priceNgn) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      let _shortUrl
      try {
        const { url } = info
        const slug = nanoid()
        const __shortUrl = `${SELF_URL}/${slug}`
        _shortUrl = await createShortBitly(__shortUrl)
        const shortUrl = __shortUrl.replaceAll('.', '@').replace('https://', '')
        increment(totalShortLinks, 'total')
        set(maskOf, shortUrl, _shortUrl)
        set(fullUrlOf, shortUrl, url)
        set(linksOf, chatId, shortUrl, url)
        send(chatId, _shortUrl, trans('o'))
        set(state, chatId, 'action', 'none')
      } catch (error) {
        send(TELEGRAM_DEV_CHAT_ID, error.message)
        set(state, chatId, 'action', 'none')
        return send(chatId, t.redIssueUrlBitly, trans('o'))
      }

      // wallet update
      if (coin === u.usd) {
        set(payments, nanoid(), `Wallet,Bit.ly Link,${_shortUrl},$${priceUsd},${chatId},${name},${new Date()}`)
        await atomicIncrement(walletOf, chatId, 'usdOut', priceUsd)
      } else if (coin === u.ngn) {
        set(payments, nanoid(), `Wallet,Bit.ly Link,${_shortUrl},$${priceUsd},${chatId},${name},${new Date()},${priceNgn} NGN`)
        await atomicIncrement(walletOf, chatId, 'ngnOut', priceNgn)
      } else {
        return send(chatId, 'Some Issue')
      }
      const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
      send(chatId, t.showWallet(usd, ngn), trans('o'))
      notifyGroup(`🔗 <b>Short Link Created!</b>\nUser ${maskName(name)} just shortened a link.\n${FREE_LINKS} free trial links for everyone — try it now — /start`)
    },
  }

  const goBack = () => {
    const lastStep = info?.history[info?.history?.length - 1]

    saveInfo('history', info?.history.slice(0, -1)) // rem last elem

    goto[lastStep]()
  }

  if (message === '/start') {
    // Auto-exit support mode if active
    if (action === a.supportChat) {
      await set(supportSessions, chatId, 0)
    }
    set(state, chatId, 'action', 'none')

    // Keep original admin behavior
    if (isAdmin(chatId)) return send(chatId, 'Hello, Admin! Please select an option:', aO)

    // Show main keyboard for regular users
    return send(chatId, 'Welcome! Please select an option:', trans('o'))
  }

  // /done — exit support chat
  if (message === '/done') {
    if (action === a.supportChat) {
      await set(supportSessions, chatId, 0)
      set(state, chatId, 'action', 'none')
      const name = await get(nameOf, chatId)
      send(chatId, '✅ Support session ended. Thank you for reaching out!', trans('o'))
      send(TELEGRAM_ADMIN_CHAT_ID, `📴 Support session closed by user <b>${name || chatId}</b> (${chatId})`, { parse_mode: 'HTML' })
      log(`[Support] Session ended by user ${chatId}`)
      return
    }
    return send(chatId, 'No active support session.', trans('o'))
  }

  // ═══════════════════════════════════════════════════
  // Support chat mode — forward user messages to admin (private only, not groups)
  // ═══════════════════════════════════════════════════
  if (action === a.supportChat) {
    const name = await get(nameOf, chatId)
    const displayName = name || msg?.from?.username || chatId
    send(TELEGRAM_ADMIN_CHAT_ID, `💬 <b>${displayName}</b> (${chatId}):\n${message}\n\n↩️ /reply ${chatId} <i>type response</i>`, { parse_mode: 'HTML' })
    send(chatId, '✉️ Message sent to support. We\'ll respond shortly.', { reply_markup: { keyboard: [['/done']], resize_keyboard: true } })
    log(`[Support] ${chatId} -> admin: ${message}`)
    return
  }

  // /refresh command — force refresh keyboard for users seeing old buttons
  if (message === '/refresh') {
    set(state, chatId, 'action', 'none')
    if (isAdmin(chatId)) return send(chatId, 'Keyboard refreshed! Please select an option:', aO)
    return send(chatId, 'Keyboard refreshed! Please select an option:', trans('o'))
  }

  // /help command
  if (message === '/help') {
    return send(chatId, `${CHAT_BOT_NAME} Help:\n• URL Shortener\n• Domain Names\n• Phone Leads\n• Wallet & Payments\n• Web Hosting\n\nUse the menu below to get started!`, trans('o'))
  }

  // Auto-promo opt-out/opt-in commands
  if (message === '/stop_promos') {
    if (autoPromo) {
      await autoPromo.setOptOut(chatId, true)
      return send(chatId, t.promoOptOut || 'You have been unsubscribed from promotional messages. Type /start_promos to re-subscribe anytime.', bc)
    }
    return
  }

  if (message === '/start_promos') {
    if (autoPromo) {
      await autoPromo.setOptOut(chatId, false)
      return send(chatId, t.promoOptIn || 'You have been re-subscribed to promotional messages. You will receive our latest offers and deals!', bc)
    }
    return
  }

  if (message === user.changeSetting) {
    set(state, chatId, 'action', a.updateUserLanguage)
    return send(chatId, trans('l.askPreferredLanguage') , trans('languageMenu'))
  }
  //
  if (message === t.cancel || (firstSteps.includes(action) && message === t.back)) {
    set(state, chatId, 'action', 'none')
    return send(chatId, t.userPressedBtn(message), isAdmin(chatId) ? aO : trans('o'))
  }
  //
  if (message === admin.blockUser) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    set(state, chatId, 'action', 'block-user')
    return send(chatId, t.blockUser, bc)
  }
  if (action === 'block-user') {
    const userToBlock = message
    const chatIdToBlock = await get(chatIdOf, userToBlock)
    if (!chatIdToBlock) return send(chatId, t.userToBlock(userToBlock))

    set(state, chatId, 'action', 'none')
    set(chatIdBlocked, chatIdToBlock, true)
    return send(chatId, t.userBlocked(userToBlock), aO)
  }
  //
  if (message === admin.unblockUser) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    set(state, chatId, 'action', 'unblock-user')
    return send(chatId, t.unblockUser, bc)
  }
  if (action === 'unblock-user') {
    const userToUnblock = message
    const chatIdToUnblock = await get(chatIdOf, userToUnblock)
    if (!chatIdToUnblock) return send(chatId, `User ${userToUnblock} not found`, bc)

    set(state, chatId, 'action', 'none')
    set(chatIdBlocked, chatIdToUnblock, false)
    return send(chatId, `User ${userToUnblock} has been unblocked.`, aO)
  }
  //
  if (message === admin.messageUsers) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    return goto[admin.messageUsers]()
  }
  if (message === admin.broadcastSettings) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')
    return goto.broadcastSettings()
  }
  if (action === admin.messageUsers) {
    const fileId = msg?.photo?.[0]?.file_id
    set(state, chatId, 'messageContent', fileId || message)
    set(state, chatId, 'messageMethod', fileId ? 'sendPhoto' : 'sendMessage')
    
    // Get broadcast statistics
    const stats = await getBroadcastStats(nameOf)
    const previewText = fileId ? '📷 Photo message' : `📝 Text message: ${message}`
    
    let statsText = ''
    if (stats) {
      statsText = `📊 Broadcast Statistics:\n• Total users: ${stats.totalUsers}\n• Batch size: ${stats.batchSize}\n• Estimated time: ${stats.estimatedBatchTime} seconds\n• Delay between batches: ${stats.delayBetweenBatches}s\n• Max retries: ${stats.maxRetries}`
    } else {
      statsText = '📊 Unable to get user statistics'
    }
    
    send(chatId, `${previewText}\n\n${statsText}\n\nReady to broadcast?`)
    return goto.adminConfirmMessage()
  }
  if (action === 'adminConfirmMessage') {
    if (message === t.back || message === t.no) return goto[admin.messageUsers]()
    if (message !== t.yes) return send(chatId, t.what)

    set(state, chatId, 'action', 'none')
    
    // Start broadcast with progress tracking
    send(chatId, '🚀 Starting broadcast... This may take a while for large user bases.')
    
    // Run broadcast in background to avoid blocking
    sendMessageToAllUsers(bot, info?.messageContent, info?.messageMethod, nameOf, chatId)
      .then(() => {
        // Broadcast completed successfully
        log(`Admin ${chatId} completed broadcast successfully`)
      })
      .catch((error) => {
        // Handle broadcast errors
        log(`Admin ${chatId} broadcast failed: ${error.message}`)
        send(chatId, `❌ Broadcast failed: ${error.message}`)
      })
    
    return send(chatId, '📤 Broadcast initiated! You\'ll receive progress updates.', aO)
  }
  if (action === a.addUserLanguage) {
    const language = message
    const supportedLanguages = trans('supportedLanguages')
    const validLanguage = supportedLanguages[language]
    if (!validLanguage) return send(chatId, trans('l.askValidLanguage'), trans('languageMenu') )
    info.userLanguage = validLanguage
    send(chatId, trans('l.welcomeMessage'))
    set(state, chatId, 'userLanguage', validLanguage)
    setTimeout(() => {
      return  goto.askUserEmail()
    },500)
    return
  }

  if (action === a.updateUserLanguage) {
    const language = message
    const supportedLanguages = trans('supportedLanguages')
    const validLanguage = supportedLanguages[language]
    if (!validLanguage) return send(chatId, trans('l.askValidLanguage'), trans('languageMenu') )
    info.userLanguage = validLanguage
    set(state, chatId, 'userLanguage', validLanguage)
    set(state, chatId, 'action', 'none')
    return send(chatId, trans('t.welcome'), trans('o')) 
  }

  if (action === a.askUserEmail) {
    if (message === trans('t.backButton')) return goto.userLanguage();
    const email = message;
    if (!isValidEmail(message)) {
      return send(chatId, hP.generatePlanStepText('invalidEmail'), trans('k.of', [[trans('t.backButton')]]))
    }
    set(state, chatId, 'userEmail', email)
    send(chatId, trans('l.processUserEmail'))
    setTimeout(() => {
      send(chatId, trans('l.confirmUserEmail'))
      return goto.askUserTerms()
    },1000)
    return
  }

  if (action === a.askUserTerms) {
    if (message === trans('t.backButton')) return goto.askUserEmail();
    if (message === trans('l.viewTermsAgainButton')) return goto.askUserTerms()
    if (message === trans('l.exitSetupButton')) {
      set(state, chatId, 'action', 'none')
      return send(chatId, trans('l.userExitMsg'), rem)
    }
    if (message === trans('l.acceptTermButton')) {
      set(state, chatId, 'hasAcceptedTerms', true)
      send(chatId, trans('l.acceptedTermsMsg'))
      notifyGroup(`🎉 <b>New Member!</b>\nUser ${maskName(username)} just joined ${CHAT_BOT_NAME} — domains, leads, hosting & more at your fingertips.\nSee what's possible — /start`)
      setTimeout(async () => {
        const freeLinks = await get(freeShortLinksOf, chatId)
        set(state, chatId, 'action', 'none')
        if (freeLinks === undefined || freeLinks > 0) return send(chatId, t.welcomeFreeTrial, trans('o'))
        return send(chatId, t.welcome, trans('o'))      
      },1000)
      return
    }
    return send(chatId, trans('l.declinedTermsMsg'),  trans('k.of', [[trans('l.viewTermsAgainButton')], [trans('l.exitSetupButton')], [trans('t.backButton')]]))
  }

  // cPanel Plans Events Handlers
  if ([user.cPanelWebHostingPlans, user.pleskWebHostingPlans].includes(message)) {
    return goto.selectPlan(a.starterPlan)
  }

  if (message === user.contactSupport || message === user.getSupport) {
    await set(supportSessions, chatId, Date.now())
    await saveInfo('action', a.supportChat)
    send(chatId, `💬 <b>Live Support</b>\n\nYou're now connected with support. Type your message below and we'll respond as soon as possible.\n\nSend /done when you're finished.`, { parse_mode: 'HTML', reply_markup: { keyboard: [['/done']], resize_keyboard: true } })
    // Notify admin — private message only, not to groups
    const name = await get(nameOf, chatId)
    send(TELEGRAM_ADMIN_CHAT_ID, `🔔 <b>Support session opened</b>\nUser: <b>${name || 'unknown'}</b> (${chatId})\n@${msg?.from?.username || 'no_username'}\n\nReply with: /reply ${chatId} <i>your message</i>\nClose with: /close ${chatId}`, { parse_mode: 'HTML' })
    log(`[Support] Session opened for ${chatId} ${name}`)
    return
  }

  // Free Plan
  if (message === user.freeTrial) {
    return goto.selectPlan(a.freeTrial)
  }

  if (action === a.freeTrial) {
    if (message === t.back) return goto.submenu3()
    if (message === t.backButton) return goto.freeTrialMenu()
    if (message === user.freeTrialMenuButton) return goto.freeTrial()
    if (message === user.getFreeTrialPlanNow) return goto.getFreeTrialPlanNow()
  }

  if (action === a.getPlanNow) {
    if (message === user.backToFreeTrial) return goto.freeTrial()

    if (!message.endsWith('.sbs') && message) {
       return send(chatId, t.trialPlanGetNowInvalidDomain, k.of([[user.backToFreeTrial]]))
    }

    const { modifiedDomain, price, domainType, chatMessage } = await planGetNewDomain(message, chatId, send, saveInfo, info.hostingType,false);

    if (modifiedDomain === null || price === null) {
      return send(chatId, chatMessage)
    }

    if (domainType === 'Premium') {
      return send(chatId, t.trialPlanSBSDomainIsPremium)
    }

    return goto.continueWithDomainNameSBS(modifiedDomain)
  }

  if (action === a.domainAvailableContinue) {
    if (message === t.backButton || message === user.searchAnotherDomain) return goto.getFreeTrialPlanNow()
    if ((message === user.continueWithDomainNameSBS(info.website_name))) return goto.nameserverSelectionSBS(info.website_name)
  }

  if(action === a.nameserverSelectionSBS) {
    if (message === t.backButton) return goto.continueWithDomainNameSBS(info.website_name)
    if (message === user.privHostNS || message === user.cloudflareNS) {
      let nameserver = message === user.privHostNS ? 'privhost' : 'cloudflare'
      saveInfo('nameserver', nameserver)
    }
    return goto.proceedContinueWithDomainNameSBS()
  }

  if (action === a.continueWithDomainNameSBS) {
    if (message === t.backButton) return goto.nameserverSelectionSBS(info.website_name)
    if (!isEmail(message)) return goto.displayEmailValidationError()
    return goto.confirmEmailBeforeProceedingSBS(message)
  }

  if (action === a.confirmEmailBeforeProceedingSBS) {
    if (message === t.backButton) return goto.proceedContinueWithDomainNameSBS()
    if (message === t.yesProceedWithThisEmail(info.email)) return goto.sendcPanelCredentialsAsEmailToUser()
  }


  // Starter Plan
  if (message === user.starterPlan) {
    return goto.selectPlan(a.starterPlan)
  }

  if (action === a.starterPlan) {
    if (message === user.backToHostingPlans) return goto.submenu3()
    if (message === user.buyStarterPlan) return goto.buyPlan(action)
    if (message === user.backToStarterPlanDetails) return goto.selectPlan(a.starterPlan)
    if (message === user.registerANewDomain) return goto.registerNewDomain()
    if (message === user.useExistingDomain) return goto.useExistingDomain()
    if (message === user.viewProPlan) return goto.selectPlan(a.proPlan)
    if (message === user.viewBusinessPlan) return goto.selectPlan(a.businessPlan)
  }


  // Business Plan
  if (message === user.businessPlan) {
    return goto.selectPlan(a.businessPlan)
  }

  if (action === a.businessPlan) {
    if (message === user.backToHostingPlans) return goto.submenu3()
    if (message === user.buyBusinessPlan) return goto.buyPlan(action)
    if (message === user.backToBusinessPlanDetails) return goto.selectPlan(a.businessPlan)
    if (message === user.registerANewDomain) return goto.registerNewDomain()
    if (message === user.useExistingDomain) return goto.useExistingDomain()
    if (message === user.viewStarterPlan) return goto.selectPlan(a.starterPlan)
    if (message === user.viewProPlan) return goto.selectPlan(a.proPlan)
  }


  // Pro Plan
  if (message === user.proPlan) {
    return goto.selectPlan(a.proPlan)
  }

  if (action === a.proPlan) {
    if (message === user.backToHostingPlans) return goto.submenu3()
    if (message === user.buyProPlan) return goto.buyPlan(action)
    if (message === user.backToProPlanDetails) return goto.selectPlan(a.proPlan)
    if (message === user.registerANewDomain) return goto.registerNewDomain()
    if (message === user.useExistingDomain) return goto.useExistingDomain()
    if (message === user.viewBusinessPlan) return goto.selectPlan(a.businessPlan)
    if (message === user.viewStarterPlan) return goto.selectPlan(a.starterPlan)
  }


  if (action === a.registerNewDomain) {
    if (message === t.back) return goto.buyPlan(a.starterPlan)
    send(chatId, t.checkingDomainAvail)
    const { modifiedDomain, price } = await planGetNewDomain(message, chatId, send, saveInfo, info.hostingType);
    if (modifiedDomain === null || price === null) return
    return goto.registerNewDomainFound(modifiedDomain, price)
  }

  if (action === a.useExistingDomain) {
    if (message === t.back) return goto.submenu3()
    send(chatId, t.checkingExistingDomainAvail)
    let modifiedDomain = removeProtocolFromDomain(message)
    const { available, chatMessage } = await planCheckExistingDomain(modifiedDomain, info.hostingType)
    if (!available) {
      send(chatId, chatMessage)
      return goto.domainNotFound(modifiedDomain)
    }

    return goto.useExistingDomainFound(modifiedDomain)
  }

  if (action === a.domainNotFound) {
    if (message === t.back) return goto.buyPlan(a.starterPlan)
    if (message === user.searchAnotherDomain) return goto.registerNewDomain()
    if (message === user.continueWithDomain(info.website_name)) return goto.enterYourEmail()
  }

  if (action === a.registerNewDomainFound) {
    if (message === t.back || message === user.searchAnotherDomain) return goto.registerNewDomain()
    if (message === user.continueWithDomain(info.website_name)) {
      await saveInfo('continue_domain_last_state', 'registerNewDomain')
      return goto.nameserverSelection(info.website_name)
    }
  }

  if (action === a.useExistingDomainFound) {
    if (message === t.back || message === user.searchAnotherDomain) return goto.useExistingDomain()
    if (message === user.continueWithDomain(info.website_name)) {
      await saveInfo('continue_domain_last_state', 'useExistingDomain')
      return goto.nameserverSelection(info.website_name)
    }
  }

  if (action === a.nameserverSelection) {
    if (message === t.back) {
      if (info?.continue_domain_last_state === 'registerNewDomain') return goto.registerNewDomainFound(info.website_name)
      else if (info?.continue_domain_last_state === 'useExistingDomain') return goto.useExistingDomainFound(info.website_name)
    }

    if (message === user.privHostNS || message === user.cloudflareNS) {
      let nameserver = message === user.privHostNS ? 'privhost' : 'cloudflare'
      saveInfo('nameserver', nameserver)
    }

    return goto.enterYourEmail()
  }

  if (action === a.enterYourEmail) {
    if (message === t.back) return goto.nameserverSelection(info.website_name)

    if (!isValidEmail(message)) {
      return send(chatId, hP.generatePlanStepText('invalidEmail'), bc)
    }
    return goto.confirmEmailBeforeProceeding(message)
  }

  if (action === a.confirmEmailBeforeProceeding) {
    if (message === t.back) return goto.enterYourEmail()
    if (message === t.yesProceedWithThisEmail(info.email)) return goto.proceedWithEmail(info.website_name, info.price)
  }

  if (action === a.proceedWithEmail) {
    if (message === t.back) return goto.enterYourEmail()
    if (message === t.proceedWithPayment)
      return goto.plansAskCoupon('choose-hosting-to-buy')
  }

  // 123456
  if (action === a.proceedWithPaymentProcess) {
    if (message === t.back) return goto['hosting-pay']()
    if (message === t.iHaveSentThePayment) return goto.iHaveSentThePayment()
  }

  // shortURL — Bit.ly (paid)
  if (message === user.redBitly) {
    const redSelectProviderOptions = trans('redSelectProvider')
    saveInfo('provider', redSelectProviderOptions[0])
    return goto.redSelectUrl()
  }

  // shortURL — Shortit (trial/free)
  if (message === user.redShortit) {
    const redSelectProviderOptions = trans('redSelectProvider')
    saveInfo('provider', redSelectProviderOptions[1])
    return goto.redSelectUrl()
  }

  // shortURL (legacy)
  if (message === user.redSelectUrl) {
    return goto.redSelectUrl()
  }

  //VPS plans
  if (message === user.vpsPlans) {
    return goto.submenu4()
  }

  if (message === user.buyVpsPlan) {
    return goto.createNewVpsFlow()
  }

  if (action === a.askCountryForVPS) {
    if (message === vp.back) return goto.submenu4()
    const areaList = info?.vpsAreaList
    if (!areaList.includes(message)) return send(chatId, vp.chooseValidCountry, vp.of(areaList))
    const vpsDetails = {
      country: message
    }
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.askRegionAreaForVps()
  }

  if (action === a.askRegionAreaForVPS) {
    if (message === vp.back) return goto.createNewVpsFlow()
    const areaList = info?.vpsAreaList
    const regionsList = areaList.map((item) => item.label)
    if (!regionsList.includes(message)) return send(chatId, vp.chooseValidRegion, vp.of(regionsList))
    let vpsDetails = info?.vpsDetails
    const regionDetails = areaList.find((ar) => ar.label === message)
    vpsDetails.region = regionDetails.value
    vpsDetails.regionName = regionDetails.label
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.askZoneForVps()
  }

  if (action === a.askZoneForVPS) {
    if (message === vp.back) return goto.askRegionAreaForVps()
    const areaList = info?.vpsAreaList
    const zoneList = areaList.map((item) => item.label)
    if (!zoneList.includes(message)) return send(chatId, vp.chooseValidZone, vp.of(zoneList))
    let vpsDetails = info?.vpsDetails
    const zoneDetails = areaList.find((ar) => ar.label === message)
    vpsDetails.zone = zoneDetails.name
    vpsDetails.zoneName = zoneDetails.label
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    saveInfo('vpsAreaList', null)
    return goto.confirmZoneForVPS()
  }

  if (action === a.confirmZoneForVPS) {
    if (message === vp.back) return goto.askZoneForVps()
    if (message === vp.confirmBtn) return goto.askVpsDiskType()
    return goto.confirmZoneForVPS()
  }

  if (action === a.askVpsDiskType) {
    if (message === vp.back) return goto.askZoneForVps()
    const options = info?.vpsDiskTypes
    const diskList = options?.map((item) => item?.label) || [];
    if (!diskList || !diskList.length) return send(chatId, vp.failedFetchingData, trans('o'))
    if (!diskList.includes(message)) return send (chatId, vp.chooseValidDiskType, vp.of(diskList))
    let vpsDetails = info?.vpsDetails
    const diskDetails = options.find((op) => op.label === message)
    vpsDetails.diskType = diskDetails.value
    vpsDetails.diskLabel = message
    vpsDetails.diskTypeId = diskDetails._id
    send(chatId, vp.vpsWaitingTime)
    const configTypes = await fetchAvailableVPSConfigs(chatId, vpsDetails)
    if (!configTypes) return send(chatId, vp.failedFetchingData, trans('o'))
    info.vpsDetails = vpsDetails
    info.vpsConfigTypes = configTypes
    saveInfo('vpsConfigTypes', configTypes)
    saveInfo('vpsDetails', vpsDetails)
    return goto.askVpsConfig()
  }

    // save vps configs
  if (action === a.askVpsConfig) {
    if (message === vp.back) return goto.askVpsDiskType()
    const vpsConfigurations = info?.vpsConfigTypes
    const configTypes = vpsConfigurations.map((item) => item.name)
    if (!configTypes.includes(message)) return send(chatId, vp.validVpsConfig, vp.of(configTypes))
    let vpsDetails = info?.vpsDetails
    const selectedConfigType = vpsConfigurations.find((item) => item.name === message)
    vpsDetails.config = selectedConfigType
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.askUserVpsPlan()
  }

  // save vps plan
  if (action === a.askUserVpsPlan) {
    if (message === vp.back) return goto.askVpsConfig()
    let vpsDetails = info?.vpsDetails
    const plans = vpsDetails.config.billingCycles.map((item) => item.type)
    if (!plans.includes(message)) return send(chatId, t.chooseValidPlan, vp.of(plans))
    const plan = vpsDetails.config.billingCycles.find(item => item.type === message)
    vpsDetails.plan = message
    vpsDetails.billingCycleId = plan._id
    vpsDetails.plantotalPrice = plan.originalPrice
    vpsDetails.couponApplied = false
    vpsDetails.couponDiscount = 0
    vpsDetails.planNewPrice = 0
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return vpsDetails.plan != 'Hourly' ? goto.askCouponForVPSPlan() : goto.askVpsCpanel()
  }

  if (action === a.askCouponForVPSPlan) {
    if (message === vp.back) return goto.askUserVpsPlan()
    let vpsDetails = info.vpsDetails
    const coupon = message.toUpperCase()
    if (message === vp.skip) {
      vpsDetails.couponApplied = false
      vpsDetails.couponDiscount = 0
      vpsDetails.planNewPrice = 0
      info.vpsDetails = vpsDetails
      await saveInfo('vpsDetails', vpsDetails)
      return goto.skipCouponVps()
    }
    const couponResult = await resolveCoupon(coupon, chatId)
    if (!couponResult) return send(chatId, vp.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')
    const discount = couponResult.discount
    const couponDiscount = (vpsDetails.plantotalPrice * discount) / 100;
    const newPrice = vpsDetails.plantotalPrice - couponDiscount;
    vpsDetails.couponApplied = true
    vpsDetails.couponDiscount = couponDiscount
    vpsDetails.planNewPrice = newPrice

    info.vpsDetails = vpsDetails
    await saveInfo('vpsDetails', vpsDetails)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)
    send(chatId, vp.couponValid(couponDiscount))
    return vpsDetails.plan != 'Hourly' ? goto.askVPSPlanAutoRenewal() : goto.askVpsCpanel()
  }

  if (action === a.skipCouponVps) {
    let vpsDetails = info?.vpsDetails
    if (message === t.goBackToCoupon || message === vp.back) return goto.askCouponForVPSPlan()
    return vpsDetails.plan != 'Hourly' ? goto.askVPSPlanAutoRenewal() : goto.askVpsCpanel()
  }

  if (action === a.askVPSPlanAutoRenewal) {
    if (message === vp.back) return goto.askCouponForVPSPlan()
    if (message !== vp.skip && message !== vp.enable) return send(chatId, t.selectValidOption, vp.of([vp.enable, t.skip])) 
    let vpsDetails = info.vpsDetails
    vpsDetails.autoRenewalPlan = message === vp.enable ? true : false
    info.vpsDetails = vpsDetails
    await saveInfo('vpsDetails', vpsDetails)
    const expiresAt = getExpiryDateVps(vpsDetails.plan)
    if (message === vp.skip) {
      send(chatId, vp.skipAutoRenewalWarming(expiresAt))
    }
    return goto.askVpsCpanel()
  }

  if (action === a.askVpsCpanel) {
    let vpsDetails = info?.vpsDetails
    if (message === vp.back) return vpsDetails.plan != 'Hourly' ? goto.askVPSPlanAutoRenewal() : goto.askUserVpsPlan()
    const cpanels = trans('vpsCpanelOptional')
    if (!cpanels.includes(message)) return send (chatId, vp.validCpanel, vp.cpanelMenu)
    vpsDetails.panel = message === vp.noControlPanel ? null : {
      name: message === 'WHM' ? 'whm' : 'plesk'
    }
    vpsDetails.selectedCpanelPrice = 0
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    if (message === vp.noControlPanel) {
      send (chatId, vp.skipPanelMessage)
      return goto.askVpsOS()
    }
    return goto.askVpsCpanelLicense()
  }

  if (action === a.askVpsCpanelLicense) {
    let vpsDetails = info?.vpsDetails
    if (message === vp.back) return goto.askVpsCpanel()
    const options = info.vpsSelectedPanelOptions
    const list = options.map((item) => item.name)
    if (!list.includes(message)) return send(chatId, vp.askCpanelOtions(vpsDetails.panel.name, options), vp.of(list))
    const selectedOptionDetails = options.find((ar) => ar.name === message)
    vpsDetails.panel.license = selectedOptionDetails.id
    vpsDetails.panel.licenseName = selectedOptionDetails.name
    vpsDetails.panel.pricePerMonth = selectedOptionDetails.price
    vpsDetails.panel.id = selectedOptionDetails._id
    vpsDetails.panel.duration= selectedOptionDetails.durationValue
    vpsDetails.selectedCpanelPrice = selectedOptionDetails.price
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    if (message.toLowerCase().includes('trial')) {
      send(chatId, vp.trialCpanelMessage(vpsDetails.panel))
    }
    return goto.askVpsOS()
  }

  if (action === a.askVpsOS) {
    let vpsDetails = info?.vpsDetails
    if (message === vp.back) return goto.askVpsCpanel()
    const osData = info?.vpsOSList
    const osList = osData.map((item) => item.name)     
    if (!osList.includes(message) && message != vp.skipOSBtn) return send(chatId, vp.chooseValidOS, vp.of([...osList, vp.skipOSBtn]))
    const osDetails = osData.find((ar) => ar.name ===  (message === vp.skipOSBtn ? 'Ubuntu' : message))
    vpsDetails.os = {
      name: osDetails.name,
      value: osDetails.value,
      pricePerMonth: osDetails.price,
      id: osDetails._id
    }
    vpsDetails.selectedOSPrice = osDetails.price
    const planPrice = vpsDetails.couponApplied ? vpsDetails.planNewPrice : vpsDetails.plantotalPrice
    const OSprice = vpsDetails.selectedOSPrice
    const selectedCpanelPrice = vpsDetails.selectedCpanelPrice
    const totalPrice = Number(selectedCpanelPrice) + Number(planPrice) + Number(OSprice)
    vpsDetails.totalPrice = totalPrice.toFixed(2)
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.vpsAskSSHKey()
  }

  if (action === a.vpsAskSSHKey) {
    if (message === vp.back) return goto.askVpsOS()
    const vpsDetails = info.vpsDetails
    if (message === vp.skipSSHKeyBtn) return goto.askSkipSSHkeyconfirmation()
    if (message === vp.generateSSHKeyBtn) {
      const newSShKey = await generateNewSSHkey(chatId)
      if (!newSShKey) {
        send(chatId, vp.failedGeneratingSSHKey)
        return goto.vpsAskSSHKey()
      }
      vpsDetails.sshKeyName = newSShKey.sshKeyName
      info.vpsDetails = vpsDetails
      saveInfo('vpsDetails', vpsDetails)
      send(chatId, vp.newSSHKeyGeneratedMsg(newSShKey.sshKeyName))
      return goto.vpsAskPaymentConfirmation()
    }
    if (message === vp.linkSSHKeyBtn) return goto.vpsLinkSSHKey()
    return send(chatId, t.selectValidOption, vpsDetails?.hasSSHKey 
      ? vp.of([vp.generateSSHKeyBtn, vp.linkSSHKeyBtn , vp.skipSSHKeyBtn]) : vp.of([vp.generateSSHKeyBtn , vp.skipSSHKeyBtn]))
  }

  if (action === a.askSkipSSHkeyconfirmation) {
    if (message === vp.back || message === vp.setUpSSHBtn) return goto.vpsAskSSHKey()
    let vpsDetails = info.vpsDetails
    if (message === vp.confirmSkipSSHBtn) {
      vpsDetails.sshKeyName = null
      info.vpsDetails = vpsDetails
      saveInfo('vpsDetails', vpsDetails)
      send(chatId, vp.sshLinkingSkipped)
      return goto.vpsAskPaymentConfirmation()
    }
    return send(chatId, t.selectValidOption, vp.of([vp.confirmSkipSSHBtn, vp.setUpSSHBtn]))
  }

  if (action === a.vpsLinkSSHKey) {
    if (message === vp.back) return goto.vpsAskSSHKey()
    let vpsDetails = info.vpsDetails
    if (message === vp.cancel) {
      vpsDetails.sshKeyName = null
      info.vpsDetails = vpsDetails
      saveInfo('vpsDetails', vpsDetails)
      send(chatId, vp.cancelLinkingSSHKey)
      return goto.vpsAskPaymentConfirmation()
    }
    if (message === vp.uploadNewKeyBtn) {
      return goto.askUploadSSHPublicKey()
    }
    const sshKeyList = vpsDetails.sshKeysList
    if (!sshKeyList.includes(message)) return send(chatId, vp.selectValidSShKey, vp.of([...sshKeyList, vp.uploadNewKeyBtn, vp.cancel]))
    vpsDetails.sshKeyName = message
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    send(chatId, vp.sshKeySavedForVPS(message))
    return goto.vpsAskPaymentConfirmation()
  }

  if (action === a.askUploadSSHPublicKey) {
    if (message === vp.back) return goto.vpsLinkSSHKey()
    let vpsDetails = info.vpsDetails
    let newSShKey;
    if (msg.document) {
      try {
        if (!msg.document?.file_name.includes('.pub')) return send(chatId, vp.fileTypePub)
        const fileLink = await bot?.getFileLink(msg.document.file_id)
        const content = (await axios.get(fileLink, { responseType: 'text' }))?.data
        newSShKey = await uploadSSHPublicKey(chatId, content)
      } catch (error) {
        console.error('Error:', error.message)
        return send(chatId, t.fileError)
      }
    } else if (message.length) {
      newSShKey = await uploadSSHPublicKey(chatId, message)
    }
    if (!newSShKey) {
      send(chatId, vp.failedGeneratingSSHKey)
      return goto.vpsAskSSHKey()
    }
    vpsDetails.sshKeyName = newSShKey.sshKeyName
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    send(chatId, vp.newSSHKeyUploadedMsg(newSShKey.sshKeyName))
    return goto.vpsAskPaymentConfirmation()
  }
  
  if (action === a.proceedWithVpsPayment) {
    if (message === vp.back) return goto.vpsAskSSHKey()
    if (message === vp.no) {
      saveInfo('vpsDetails', null)
      set(state, chatId, 'action', 'none')
      return send(chatId, t.welcome, trans('o'))
    }
    if (message === vp.yes) return goto['vps-plan-pay']()
    send(chatId, t.selectValidOption)
  }

  if (message === user.manageVpsPlan) {
    return goto.getUserAllVmIntances()
  }

  if (action === a.getUserAllVmIntances) {
    if (message === vp.back) return goto.submenu4()
    if (message === user.buyVpsPlan) return goto.createNewVpsFlow()
    const list = info?.userVPSDetails?.map((item) => item?.name) || [];
    if (!list?.includes(message)) return send(chatId, vp.selectCorrectOption, vp.of([...list, user.buyVpsPlan]))
    const selectedVPS = info?.userVPSDetails?.find((item) => item.name ===  message)
    info.vpsDetails = selectedVPS
    saveInfo('vpsDetails', selectedVPS)
    return goto.getVPSDetails()
  }

  if (action === a.getVPSDetails) {
    if (message === vp.back) return goto.getUserAllVmIntances()
    const userVPSDetails = info.userVPSDetails
    if (message === vp.stopVpsBtn) return goto.confirmStopVps()
    if (message === vp.deleteVpsBtn) return goto.confirmDeleteVps()
    if (message === vp.upgradeVpsBtn) return goto.upgradeVpsInstance()
    if (message === vp.subscriptionBtn) return goto.vpsSubscription()
    if (message === vp.VpsLinkedKeysBtn) return goto.vpsLinkedSSHkeys()
    if (message === vp.startVpsBtn) {
      send(chatId, vp.vpsBeingStarted(userVPSDetails.name))
      const changeVpsStatus = await changeVpsInstanceStatus(userVPSDetails, 'start')
      if (changeVpsStatus.success) {
        await vpsPlansOf.updateOne(
          { vpsId: userVPSDetails._id },
          { $set: { 'status': 'RUNNING' } },
        )
        send(chatId, vp.vpsStarted(userVPSDetails.name))
      } else {
        send(chatId, vp.failedStartedVPS(userVPSDetails.name))
      }
      return goto.getVPSDetails()
    }
    if (message === vp.restartVpsBtn) {
      send(chatId, vp.vpsBeingRestarted(userVPSDetails.name))
      const changeVpsStatus = await changeVpsInstanceStatus(userVPSDetails, 'restart')
      if (changeVpsStatus.success) {
        send(chatId, vp.vpsRestarted(userVPSDetails.name))
      } else {
        send(chatId, vp.failedRestartingVPS(userVPSDetails.name))
      }
      return goto.getVPSDetails()
    }
    return send(chatId, vp.selectCorrectOption)
  }

  if (action === a.confirmStopVps) {
    if (message === vp.back) return goto.getVPSDetails()
    if (message === vp.cancel) return goto.getUserAllVmIntances()
    if (message === vp.confirmChangeBtn) {
      const userVPSDetails = info.userVPSDetails
      send(chatId, vp.vpsBeingStopped(userVPSDetails.name))
      const changeVpsStatus = await changeVpsInstanceStatus(userVPSDetails, 'stop')
      if (changeVpsStatus.success) {
        await vpsPlansOf.updateOne(
          { vpsId: userVPSDetails._id },
          { $set: { 'status': 'TERMINATED' } },
        )
        send(chatId, vp.vpsStopped(userVPSDetails.name))
      } else {
        send(chatId, vp.failedStoppingVPS(userVPSDetails.name))
      }
      return goto.getVPSDetails()
    }
    return send(chatId, vp.selectCorrectOption, vp.of([ vp.confirmChangeBtn, vp.cancel]))
  }

  if (action === a.confirmDeleteVps) {
    if (message === vp.back) return goto.getVPSDetails()
    if (message === vp.cancel) return goto.getUserAllVmIntances()
    if (message === vp.confirmChangeBtn) {
      const userVPSDetails = info.userVPSDetails
      send(chatId, vp.vpsBeingDeleted(userVPSDetails.name))
      const deleteVpsStatus = await deleteVPSinstance(chatId, userVPSDetails._id)
      if (deleteVpsStatus.success) {
        await vpsPlansOf.deleteOne(
          { vpsId: userVPSDetails._id }
        )
        send(chatId, vp.vpsDeleted(userVPSDetails.name))
      } else {
        send(chatId, vp.failedDeletingVPS(userVPSDetails.name))
      }
      return goto.getUserAllVmIntances()
    }
    return send(chatId, vp.selectCorrectOption, vp.of([ vp.confirmChangeBtn, vp.cancel]))
  }

  if (action === a.upgradeVpsInstance) {
    if (message === vp.back) return goto.getVPSDetails()
    if (message !== vp.upgradeVpsDiskBtn && message !== vp.upgradeVpsPlanBtn) {
      return send(chatId, vp.selectCorrectOption, vp.of([ vp.upgradeVpsPlanBtn, vp.upgradeVpsDiskBtn ]))
    }
    let vpsDetails = info.vpsDetails
    if (message === vp.upgradeVpsPlanBtn) {
      vpsDetails.upgradeType = 'plan'
    } else if (message === vp.upgradeVpsDiskBtn) {
      vpsDetails.upgradeType = 'disk'
    }
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.upgradeVpsPlan()
  }

  if (action === a.upgradeVpsPlan) {
    if (message === vp.back) return goto.upgradeVpsInstance()
    if (message === vp.cancel) return goto.getVPSDetails()
    const vpsDetails = info.vpsDetails
    const upgradeOptions = info.VPSUpgradeOptions
    const upgradeBtns = upgradeOptions.map((item) => vp.upgradeOptionVPSBtn(item.to))
    if (!upgradeBtns.includes(message)) return send(chatId, vp.selectCorrectOption, vp.of([ ...upgradeBtns, vp.cancel]))
    const selectedUpgrade = upgradeOptions.find(item => vp.upgradeOptionVPSBtn(item.to) === message)
    vpsDetails.upgradeOption = selectedUpgrade
    vpsDetails.billingCycle = info.userVPSDetails.billingCycleDetails.type
    if (vpsDetails.upgradeType === 'plan') {
      vpsDetails.totalPrice = getVpsUpgradePrice(vpsDetails)
    } else if ( vpsDetails.upgradeType === 'disk') {
      if (vpsDetails.billingCycle === 'Hourly') {
        vpsDetails.totalPrice = (Number(info.userVPSDetails.price) + Number(selectedUpgrade.price)).toFixed(2)
      } else {
        vpsDetails.totalPrice = selectedUpgrade.price
      }
    }
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.askVpsUpgradePayment()
  }

  if (action === a.askVpsUpgradePayment) {
    if (message === vp.back) return goto.upgradeVpsInstance()
    if (message === vp.no) {
      set(state, chatId, 'action', 'none')
      return goto.getVPSDetails()
    }
    if (message === vp.yes) return goto['vps-upgrade-plan-pay']()
    send(chatId, t.selectValidOption)
  }

  if (action === a.vpsSubscription) {
    if (message === vp.back) return goto.getVPSDetails()
    if (message !== vp.manageVpsSubBtn && message !== vp.manageVpsPanelBtn) {
      const availableOptions = info.userVPSDetails.cPanel ? [vp.manageVpsSubBtn, vp.manageVpsPanelBtn] : [vp.manageVpsSubBtn]
      return send(chatId, vp.selectCorrectOption, vp.of(availableOptions))
    }
    if (message === vp.manageVpsSubBtn) return goto.manageVpsSub()
    if (message === vp.manageVpsPanelBtn) return goto.manageVpsPanel()
  }

  if (action === a.manageVpsSub) {
    if (message === vp.back) return goto.vpsSubscription()
    if (message === vp.vpsDisableRenewalBtn || message === vp.vpsEnableRenewalBtn) {
      let vpsDetails = info.userVPSDetails
      const changeAutoRenewal = await changeVpsAutoRenewal(chatId, vpsDetails)
      if (changeAutoRenewal) {
        vpsDetails.autoRenewable = changeAutoRenewal.autoRenewable
        saveInfo('userVPSDetails', vpsDetails)
        const expiryDate = date(changeAutoRenewal.subscriptionEnd)
        send(chatId, message === vp.vpsDisableRenewalBtn ? vp.disabledAutoRenewal(vpsDetails, expiryDate) : vp.enabledAutoRenewal(vpsDetails, expiryDate))
      } else {
        send(chatId, vp.failedDeletingVPS(vpsDetails.name))
      }
      return goto.vpsSubscription()
    }
    if (message === vp.vpsPlanRenewBtn) {
      let vpsDetails = info.vpsDetails
      vpsDetails.upgradeType = 'vps-renew'
      vpsDetails.totalPrice = info.userVPSDetails.price
      vpsDetails.billingCycle = info.userVPSDetails.billingCycleDetails.type
      info.vpsDetails = vpsDetails
      saveInfo('vpsDetails', vpsDetails)
      return goto.confirmVPSRenewDetails()
    }
    return send(chatId, vp.selectCorrectOption)
  }

  if (action === a.manageVpsPanel) {
    if (message === vp.back) return goto.vpsSubscription()
    if (message === vp.vpsPlanRenewBtn) {
      let vpsDetails = info.vpsDetails
      vpsDetails.upgradeType = 'vps-cPanel-renew'
      vpsDetails.totalPrice = info.userVPSDetails.cPanelPlanDetails.price
      vpsDetails.billingCycle = null
      info.vpsDetails = vpsDetails
      saveInfo('vpsDetails', vpsDetails)
      return goto.confirmVPSRenewDetails()
    }
    return send(chatId, vp.selectCorrectOption)
  }

  if (action === a.confirmVPSRenewDetails) {
    let vpsDetails = info.vpsDetails
    if (message === vp.back) return vpsDetails.upgradeType === 'vps-renew' ? goto.manageVpsSub() : goto.manageVpsPanel()
    if (message === vp.payNowBtn) return goto['vps-upgrade-plan-pay']()
    return send(chatId, vp.selectCorrectOption)
  }

  if (action === a.vpsLinkedSSHkeys) {
    if (message === vp.back) return goto.getVPSDetails()
    if (message === vp.unlinkSSHKeyBtn) return goto.vpsUnlinkSSHKey()
    if (message === vp.linkVpsSSHKeyBtn) return goto.vpslinkNewSSHKey()
    if (message === vp.downloadSSHKeyBtn) return goto.downloadSSHKey()
    return goto.vpsLinkedSSHkeys()
  }

  if (action === a.vpsUnlinkSSHKey) {
    if (message === vp.back) return goto.vpsLinkedSSHkeys()
    let vpsDetails = info.vpsDetails
    const linkedSSHKeys = vpsDetails.linkedSSHKeys
    if (message === vp.cancel) return goto.getVPSDetails()
    if (!linkedSSHKeys.includes(message)) return goto.vpsUnlinkSSHKey()
    vpsDetails.keyForUnlink = message
    info.vpsDetails = vpsDetails
    saveInfo('vpsDetails', vpsDetails)
    return goto.confirmVpsUnlinkSSHKey()
  }

  if (action === a.confirmVpsUnlinkSSHKey) {
    if (message === vp.back) return goto.vpsUnlinkSSHKey()
    if (message === vp.cancel) return goto.vpsLinkedSSHkeys()
    if (message === vp.confirmUnlinkBtn) {
      const vpsDetails = info.vpsDetails
      const unlinkKey = await unlinkSSHKeyFromVps(chatId, vpsDetails.keyForUnlink, info.userVPSDetails)
      if (unlinkKey) {
        send(chatId, vp.keyUnlinkedMsg(vpsDetails))
      } else {
        send(chatId, vp.failedUnlinkingKey(vpsDetails))
      }
      return goto.vpsLinkedSSHkeys()
    }
    return send(chatId, vp.selectCorrectOption, vp.of([vp.confirmUnlinkBtn, vp.cancel]))
  }

  if (action === a.vpslinkNewSSHKey) {
    if (message === vp.back) return goto.vpsLinkedSSHkeys()
    if (message === vp.cancel) return goto.getVPSDetails()
    if (message === vp.uploadNewKeyBtn) return goto.uploadSShKeyToAttach()
    let vpsDetails = info.vpsDetails
    let allSSHkeys = vpsDetails.allSSHkeys
    if (!allSSHkeys.includes(message)) return send(chatId, vp.selectCorrectOption, vp.of([...allSSHkeys, vp.uploadNewKeyBtn, vp.cancel]))
    const data = {
      zone: info.userVPSDetails.zone,
      vpsId: info.userVPSDetails._id,
      sshKeys: [ message ],
      telegramId: chatId,
    }
    const linkedKey = await attachSSHKeysToVM(data)
    if (linkedKey) {
      send(chatId, vp.linkKeyToVpsSuccess(message, vpsDetails.name))
    } else {
      send(chatId, vp.failedLinkingSSHkeyToVps(message, vpsDetails.name))
    }
    return goto.vpsLinkedSSHkeys()
  }

  if (action === a.uploadSShKeyToAttach) {
    if (message === vp.back) return goto.vpslinkNewSSHKey()
    let vpsDetails = info.vpsDetails
    let newSShKey;
    if (msg.document) {
      try {
        if (!msg.document?.file_name.includes('.pub')) return send(chatId, vp.fileTypePub)
        const fileLink = await bot?.getFileLink(msg.document.file_id)
        const content = (await axios.get(fileLink, { responseType: 'text' }))?.data
        newSShKey = await uploadSSHPublicKey(chatId, content)
      } catch (error) {
        console.error('Error:', error.message)
        return send(chatId, t.fileError)
      }
    } else if (message.length) {
      newSShKey = await uploadSSHPublicKey(chatId, message)
    }
    if (!newSShKey) {
      send(chatId, vp.failedGeneratingSSHKey)
      return goto.vpslinkNewSSHKey()
    }
    const data = {
      zone: info.userVPSDetails.zone,
      vpsId: info.userVPSDetails._id,
      sshKeys: [ newSShKey.sshKeyName ],
      telegramId: chatId,
    }
    const linkedKey = await attachSSHKeysToVM(data)
    if (linkedKey) {
      send(chatId, vp.linkKeyToVpsSuccess(newSShKey.sshKeyName, vpsDetails.name))
    } else {
      send(chatId, vp.failedLinkingSSHkeyToVps(newSShKey.sshKeyName, vpsDetails.name))
    }
    return goto.vpslinkNewSSHKey()
  }

  if (action === a.downloadSSHKey) {
    if (message === vp.back) return goto.vpsLinkedSSHkeys()
    if (message === vp.cancel) return goto.getVPSDetails()
    let vpsDetails = info.vpsDetails
    let linkedSSHKeys = vpsDetails.linkedSSHKeys
    if (!linkedSSHKeys.includes(message)) return send(chatId, vp.selectCorrectOption, vp.of([...linkedSSHKeys, vp.cancel]))
    const response = await downloadSSHKeyFile(chatId, message)
    if (response) {
      const filename = `${message}.ppk`
      fs.writeFileSync(filename, response)
      bot
        ?.sendDocument(chatId, filename)
        ?.then(() => fs.unlinkSync(filename))
        ?.catch(log)
    }
    return goto.vpsLinkedSSHkeys()
  }

  if (action === a.redSelectUrl) {
    if (message === t.back) return goto.submenu1()
    if (!isValidUrl(message)) return send(chatId, t.redValidUrl, bc)
    saveInfo('url', message)
    return goto.redSelectRandomCustom()
  }

  if (action === a.redSelectProvider) {
    if (message === t.back) return goto.redSelectUrl()
    if (message === user.buyPlan) return goto['choose-subscription']()
    const redSelectProvider = trans('redSelectProvider')
    if (!redSelectProvider.includes(message)) return send(chatId, t.what)
    saveInfo('provider', message)
    // bitly
    if (message === redSelectProvider[0]) {
      return goto.redSelectRandomCustom()
    }
    // cuttly
    if (redSelectProvider[1] === message) {
      return goto.redSelectRandomCustom()
    }
  }
  if (action === a.redSelectRandomCustom) {
    if (message === t.back) return goto.redSelectUrl()

    const redSelectRandomCustom = trans('redSelectRandomCustom')

    if (!redSelectRandomCustom.includes(message)) return send(chatId, t.what)
    saveInfo('format', message)

    // Check if Bitly (paid) provider was selected — route through wallet payment
    const redSelectProviderOptions = trans('redSelectProvider')
    if (info.provider === redSelectProviderOptions[0]) {
      await saveInfo('price', PRICE_BITLY_LINK)
      return goto.askCoupon(a.redSelectProvider)
    }

    // random (free provider)
    if (redSelectRandomCustom[0] === message) {

      // Check if user has free links or is subscribed
      if (!(await isSubscribed(chatId)) && !(await freeLinksAvailable(chatId))) {
        return send(chatId, t.freeLinksExhausted, trans('o'))
      }

      try {
        const { url } = info
        let _shortUrl, shortUrl
        if (process.env.LINK_TO_SELF_SERVER === 'false') {
          _shortUrl = await createShortUrlApi(url)
          shortUrl = _shortUrl.replaceAll('.', '@').replace('https://', '')
          set(linksOf, chatId, shortUrl, url)
        } else {
          const slug = nanoid()
          const __shortUrl = `${SELF_URL}/${slug}`
          _shortUrl = await createShortUrlApi(__shortUrl)
          shortUrl = __shortUrl.replaceAll('.', '@').replace('https://', '')
          const shortUrlLink = _shortUrl.replaceAll('.', '@').replace('https://', '')
          set(linksOf, chatId, shortUrlLink, url)
        }
        increment(totalShortLinks, 'total')
        set(maskOf, shortUrl, _shortUrl)
        set(fullUrlOf, shortUrl, url)

        const name = await get(nameOf, chatId)
        notifyGroup(`🔗 <b>Short Link Created!</b>\nUser ${maskName(name)} just shortened a link.\n${FREE_LINKS} free trial links for everyone — try it now — /start`)

        // Decrement free links counter for non-subscribed users
        if (!(await isSubscribed(chatId))) {
          await decrement(freeShortLinksOf, chatId)
          const remaining = (await get(freeShortLinksOf, chatId)) || 0
          freeLinks = remaining
          set(state, chatId, 'action', 'none')
          send(chatId, _shortUrl, trans('o'))
          return send(chatId, t.linksRemaining(remaining, FREE_LINKS))
        }

        set(state, chatId, 'action', 'none')
        return send(chatId, _shortUrl, trans('o'))
      } catch (error) {
        send(TELEGRAM_ADMIN_CHAT_ID, error?.response?.data)
        set(state, chatId, 'action', 'none')
        return send(chatId, t.redIssueUrlCuttly, trans('o'))
      }
    }

    // custom
    if (redSelectRandomCustom[1] === message) return goto.redSelectCustomExt()
  }
  if (action === a.redSelectCustomExt) {
    if (message === t.back) return goto.redSelectRandomCustom()

    // Check if user has free links or is subscribed
    if (!(await isSubscribed(chatId)) && !(await freeLinksAvailable(chatId))) {
      return send(chatId, t.freeLinksExhausted, trans('o'))
    }

    if (!isValidUrl(`https://abc.com/${message}`)) return send(chatId, t.notValidHalf)
    try {
      const { url } = info
      const slug = nanoid()
      const __shortUrl = `${SELF_URL}/${slug}`
      const _shortUrl = await createCustomShortUrlCuttly(__shortUrl, message)
      const shortUrl = __shortUrl.replaceAll('.', '@').replace('https://', '')
      increment(totalShortLinks, 'total')
      set(maskOf, shortUrl, _shortUrl)
      set(fullUrlOf, shortUrl, url)
      set(linksOf, chatId, shortUrl, url)

      const name = await get(nameOf, chatId)
      notifyGroup(`🔗 <b>Short Link Created!</b>\nUser ${maskName(name)} just shortened a link.\n${FREE_LINKS} free trial links for everyone — try it now — /start`)

      // Decrement free links counter for non-subscribed users
      if (!(await isSubscribed(chatId))) {
        await decrement(freeShortLinksOf, chatId)
        const remaining = (await get(freeShortLinksOf, chatId)) || 0
        freeLinks = remaining
        set(state, chatId, 'action', 'none')
        send(chatId, _shortUrl, trans('o'))
        return send(chatId, t.linksRemaining(remaining, FREE_LINKS))
      }

      set(state, chatId, 'action', 'none')
      return send(chatId, _shortUrl, trans('o'))
    } catch (error) {
      if (error?.response?.data?.url?.status === 3) {
        return send(chatId, t.redIssueSlugCuttly)
      }

      send(
        TELEGRAM_ADMIN_CHAT_ID,
        'cuttly issue: status:' + error?.response?.data?.url?.status + ' ' + error?.response?.data,
      )
      set(state, chatId, 'action', 'none')
      return send(chatId, t.redIssueUrlCuttly, trans('o'))
    }
  }

  if (action === a.askCoupon + a.redSelectProvider) {
    if (message === t.back) return goto.redSelectProvider()
    if (message === t.skip) {
      saveInfo('lastStep', a.redSelectProvider)
      return (await saveInfo('couponApplied', false)) || goto.walletSelectCurrency()
    }

    const { price } = info
    const coupon = message.toUpperCase()
    const couponResult = await resolveCoupon(coupon, chatId)
    if (!couponResult) return send(chatId, t.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')

    const newPrice = price - (price * couponResult.discount) / 100
    send(chatId, t.redNewPrice(price, newPrice), k.pay)
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)
    await saveInfo('lastStep', a.redSelectProvider)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)

    return goto.walletSelectCurrency()
  }

  if (message === user.urlShortener) {
    return goto['choose-url-to-shorten']()
  }
  if (action === 'choose-url-to-shorten') {
    if (message === t.back) return goto.submenu1()
    if (!isValidUrl(message)) return send(chatId, t.provideLink, bc)

    set(state, chatId, 'url', message)

    const domains = await getPurchasedDomains(chatId)
    return goto['choose-domain-with-shorten']([...domains, ...adminDomains])
  }
  if (action === 'choose-domain-with-shorten') {
    if (message === t.back) return goto['choose-url-to-shorten']()
    if (message === user.buyDomainName) return goto['choose-domain-to-buy']()

    const domain = message.toLowerCase()
    const domains = await getPurchasedDomains(chatId)
    if (!(domains.includes(domain) || adminDomains.includes(domain))) {
      return send(chatId, 'Please choose a valid domain')
    }
    set(state, chatId, 'selectedDomain', message)
    return goto['choose-link-type']()
  }
  if (action === 'choose-link-type') {
    if (message === t.back) return goto['choose-domain-with-shorten'](await getPurchasedDomains(chatId))
    const linkOptions = trans('linkOptions')
    if (!linkOptions.includes(message)) return send(chatId, t.what)

    if (message === t.customLink) {
      set(state, chatId, 'action', 'shorten-custom')
      return send(chatId, t.askShortLinkExtension, bc)
    }

    // Random Link
    const url = info?.url
    const domain = info?.selectedDomain
    const shortUrl = domain + '/' + nanoid()
    if (await get(fullUrlOf, shortUrl)) {
      send(chatId, t.linkAlreadyExist)
      return
    }

    const shortUrlSanitized = shortUrl.replaceAll('.', '@')
    increment(totalShortLinks, 'total')
    set(state, chatId, 'action', 'none')
    set(fullUrlOf, shortUrlSanitized, url)
    set(linksOf, chatId, shortUrlSanitized, url)
    send(chatId, t.yourShortendUrl(shortUrl), trans('o'))
    return
  }
  if (action === 'shorten-custom') {
    if (message === t.back) return goto['choose-link-type']()

    const url = info?.url
    const domain = info?.selectedDomain
    const shortUrl = domain + '/' + message

    if (!isValidUrl('https://' + shortUrl)) return send(chatId, t.provideLink)
    if (await get(fullUrlOf, shortUrl)) return send(chatId, t.linkAlreadyExist)

    const shortUrlSanitized = shortUrl.replaceAll('.', '@')
    increment(totalShortLinks, 'total')
    set(state, chatId, 'action', 'none')
    set(fullUrlOf, shortUrlSanitized, url)
    set(linksOf, chatId, shortUrlSanitized, url)
    send(chatId, `Your shortened URL is: ${shortUrl}`, trans('o'))
    return
  }
  //
  //
  if (message === user.buyDomainName) {
    return goto['choose-domain-to-buy']()
  }
  if (action === 'choose-domain-to-buy') {
    if (message === t.back) return goto.submenu2()
    let domain = message.toLowerCase()
    domain = domain.replace('https://', '')
    domain = domain.replace('http://', '')

    const domainRegex = /^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/
    if (!domainRegex.test(domain))
      return send(chatId, t.domainInvalid)
    send(chatId, `🔍 Searching availability for ${domain} ...`)
    const { available, price, originalPrice, registrar, message: msg } = await domainService.checkDomainPrice(domain, db)
    if (!available) {
      // Suggest alternative TLDs
      const baseName = domain.split('.')[0]
      send(chatId, `❌ <b>${domain}</b> is not available.`)
      send(chatId, `🔍 Searching alternatives for <b>${baseName}</b> ...`)
      const alts = await domainService.checkAlternativeTLDs(baseName, db)
      if (alts.length > 0) {
        const altList = alts.map(a => `  <b>${a.domain}</b> — $${a.price}`).join('\n')
        send(chatId, `✅ Available alternatives:\n\n${altList}\n\nType any domain name to check:`)
      } else {
        send(chatId, `No alternatives found. Try a different name:`)
      }
      return
    }
    if (!originalPrice) {
      send(TELEGRAM_DEV_CHAT_ID, t.issueGettingPrice)
      return send(chatId, t.issueGettingPrice)
    }
    await saveInfo('price', price)
    await saveInfo('domain', domain)
    await saveInfo('originalPrice', originalPrice)
    await saveInfo('registrar', registrar)
    return goto.askDomainToUseWithShortener()
  }
  if (action === a.askDomainToUseWithShortener) {
    const yesNo = trans('yesNo')
    if (message === t.back) return goto['choose-domain-to-buy']()
    if (!yesNo.includes(message)) return send(chatId, t.what)
    saveInfo('askDomainToUseWithShortener', message === yesNo[0])

    // Yes = shortener: skip NS selection, use provider_default for reliable Railway CNAME linking
    if (message === yesNo[0]) {
      saveInfo('nsChoice', 'provider_default')

      if ((info?.domain?.endsWith('.sbs') || info?.domain?.endsWith('.xyz')) && (await isSubscribed(chatId))) {
        const available = (await get(freeDomainNamesAvailableFor, chatId)) || 0
        if (available > 0) return goto['get-free-domain']()
      }

      return goto['domain-pay']()
    }

    // No = no shortener: show NS selection
    return goto.domainNsSelect()
  }
  if (action === a.domainNsSelect) {
    if (message === t.back) return goto.askDomainToUseWithShortener()
    if (message === configUser.nsProviderDefault) {
      saveInfo('nsChoice', 'provider_default')
    } else if (message === configUser.nsCloudflare) {
      saveInfo('nsChoice', 'cloudflare')
    } else if (message === configUser.nsCustom) {
      return goto.domainCustomNsEntry()
    } else {
      return send(chatId, t.what)
    }

    if ((info?.domain?.endsWith('.sbs') || info?.domain?.endsWith('.xyz')) && (await isSubscribed(chatId))) {
      const available = (await get(freeDomainNamesAvailableFor, chatId)) || 0
      if (available > 0) return goto['get-free-domain']()
    }

    return goto['domain-pay']()
  }
  if (action === a.domainCustomNsEntry) {
    if (message === t.back) return goto.domainNsSelect()
    const nsParts = message.trim().split(/\s+/)
    if (nsParts.length < 2) {
      return send(chatId, 'Please provide at least 2 nameservers separated by space.')
    }
    // Basic validation
    const nsRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    for (const ns of nsParts) {
      if (!nsRegex.test(ns)) {
        return send(chatId, `Invalid nameserver: <code>${ns}</code>\nPlease enter valid nameserver hostnames.`)
      }
    }
    saveInfo('nsChoice', 'custom')
    saveInfo('customNS', nsParts)

    if ((info?.domain?.endsWith('.sbs') || info?.domain?.endsWith('.xyz')) && (await isSubscribed(chatId))) {
      const available = (await get(freeDomainNamesAvailableFor, chatId)) || 0
      if (available > 0) return goto['get-free-domain']()
    }

    return goto['domain-pay']()
  }
  if (action === a.askCoupon + 'choose-domain-to-buy') {
    if (message === t.back) return goto['domain-pay']()
    if (message === t.skip) return goto.skipCoupon('domain-pay')

    const { price } = info

    const coupon = message.toUpperCase()
    const couponResult = await resolveCoupon(coupon, chatId)
    if (!couponResult) return send(chatId, t.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')

    const newPrice = price - (price * couponResult.discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)

    return goto['domain-pay']()
  }

  // Coupon for domain
  if (action === a.askCoupon + 'choose-hosting-to-buy') {
    if (message === t.back) return goto.proceedWithEmail(info.website_name, info.price)
    if (message === t.skip) return goto.skipCoupon('hosting-pay')

    const { totalPrice } = info

    const coupon = message.toUpperCase()
    const couponResult = await resolveCoupon(coupon, chatId)
    if (!couponResult) return send(chatId, t.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')

    const couponDiscount = (totalPrice * couponResult.discount) / 100;
    const newPrice = totalPrice - couponDiscount;

    await saveInfo('couponApplied', true)
    await saveInfo('couponDiscount', couponDiscount)
    await saveInfo('newPrice', newPrice)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)

    return goto['hosting-pay']()
  }
  if (action === 'domain-pay') {
    if (message === t.back) {
      // Go back to NS selection if shortener=No, otherwise to shortener question
      if (info?.askDomainToUseWithShortener === false) return goto.domainNsSelect()
      return goto.askDomainToUseWithShortener()
    }

    // Handle coupon inline
    if (message === '🎟️ Apply Coupon') {
      return goto.askCoupon('choose-domain-to-buy')
    }

    const payOption = message

    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-domain')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }

    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-domain')
      return send(chatId, t.askEmail, bc)
    }

    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'domain-pay')
      return goto.walletSelectCurrency()
    }

    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-domain') {
    if (message === t.back) return goto['domain-pay']()
    const email = message
    const price = info?.price
    const domain = info?.domain
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const ref = nanoid()

    log({ ref })
    set(state, chatId, 'action', 'none')
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, domain, endpoint: `/bank-pay-domain` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, t.bankPayDomain(priceNGN, domain), trans('payBank', url))
  }
  if (action === 'crypto-pay-domain') {
    if (message === t.back) return goto['domain-pay']()
      const tickerView = message
      const supportedCryptoView = trans('supportedCryptoView')
      const ticker = supportedCryptoView[tickerView]
      if (!ticker) return send(chatId, t.askValidCrypto)
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const domain = info?.domain
      const ref = nanoid()
      if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
        const coin = tickerOf[ticker]
        const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-domain?a=b&ref=${ref}&`)
        if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
        set(chatIdOfPayment, ref, { chatId, price, domain })
        saveInfo('ref', ref)
        log({ ref })
        await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
        set(state, chatId, 'action', 'none')
        const priceCrypto = await convert(price, 'usd', coin)
        return send(chatId, t.showDepositCryptoInfoDomain(priceCrypto, ticker, address, domain), trans('o'))
      } else {
        const coin = tickerOfDyno[ticker]
        const redirect_url = `${SELF_URL}/dynopay/crypto-pay-domain`
        const meta_data = {
          "product_name": dynopayActions.payDomain,
          "refId" : ref
        }
        const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
        if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
        set(chatIdOfDynopayPayment, ref, { chatId, price, domain, action: dynopayActions.payDomain, address })
        saveInfo('ref', ref)
        log({ ref })
        await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
        set(state, chatId, 'action', 'none')
        const priceCrypto = await convert(price, 'usd',  tickerOf[ticker])
        return send(chatId, t.showDepositCryptoInfoDomain(priceCrypto, ticker, address, domain), trans('o'))
      }
  }

  // Hosting payment
  if (action === 'hosting-pay') {
    if (message === t.back) return goto.plansAskCoupon('choose-hosting-to-buy')
    const payOption = message

    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-hosting')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }

    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-hosting')
      return send(chatId, t.askEmail, bc)
    }

    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'hosting-pay')
      return goto.walletSelectCurrency(true)
    }

    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-hosting') {
    if (message === t.back) return goto['hosting-pay']()
    const email = message
    const price = info?.totalPrice
    const domain = info?.domain
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const ref = nanoid()

    log({ ref })
    set(state, chatId, 'action', a.proceedWithPaymentProcess)
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, domain, endpoint: `/bank-pay-hosting` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, hP.bankPayDomain(priceNGN, info.plan), trans('payBank', url), k.of([t.iHaveSentThePayment]))
  }
  if (action === 'crypto-pay-hosting') {
    if (message === t.back) return goto['hosting-pay']()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const price = info?.couponApplied ? info?.newPrice : info?.totalPrice
    const domain = info?.domain
    const plan = info?.plan
    const ref = nanoid()
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-hosting?a=b&ref=${ref}&`)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      set(chatIdOfPayment, ref, { chatId, price, domain })
      log({ ref })
      await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', a.proceedWithPaymentProcess)
      const priceCrypto = await convert(price, 'usd', coin)
      return send(chatId, hP.showCryptoPaymentInfo(priceCrypto, ticker, address, plan), k.of([t.iHaveSentThePayment]))
    } else {
      const coin = tickerOfDyno[ticker]
      if (!coin) return send(chatId, t.askValidCrypto)
      const redirect_url = `${SELF_URL}/dynopay/crypto-pay-hosting`
      const meta_data = {
        "product_name": dynopayActions.payHosting,
        "refId" : ref
      }
      const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      set(chatIdOfDynopayPayment, ref, { chatId, price, domain, action: dynopayActions.payHosting, address })
      log({ ref })
      await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', a.proceedWithPaymentProcess)
      const priceCrypto = await convert(price, 'usd', tickerOf[ticker])
      return send(chatId, hP.showCryptoPaymentInfo(priceCrypto, ticker, address, plan), k.of([t.iHaveSentThePayment]))
    }
  }
  if (action === 'get-free-domain') {
    if (message === t.back || message === t.no) return goto['choose-domain-to-buy']()
    if (message !== t.yes) return send(chatId, t.what)

    const domain = info?.domain
    const lang = info?.userLanguage ?? 'en'
    const error = await buyDomainFullProcess(chatId, lang, domain)
    if (!error) decrement(freeDomainNamesAvailableFor, chatId)

    return set(state, chatId, 'action', 'none')
  }
  //
  //

  // VPS Payments
  if (action === 'vps-plan-pay') {
    if (message === t.back) return goto.vpsAskPaymentConfirmation()
    const payOption = message

    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-vps')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }

    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-vps')
      return send(chatId, t.askEmail, bc)
    }

    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'vps-plan-pay')
      return goto.walletSelectCurrency(true)
    }

    return send(chatId, t.askValidPayOption)
  }

  if (action === 'bank-pay-vps') {
    if (message === t.back) return goto['vps-plan-pay']()
    const email = message
    const vpsDetails = info?.vpsDetails
    const price = vpsDetails.plan === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE || 50 : vpsDetails?.totalPrice
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const ref = nanoid()

    log({ ref })
    set(state, chatId, 'action', 'none')
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, vpsDetails, endpoint: `/bank-pay-vps` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, vp.bankPayVPS(priceNGN, vpsDetails.plan), trans('payBank', url))
  }
  if (action === 'crypto-pay-vps') {
    if (message === t.back) return goto['vps-plan-pay']()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const vpsDetails = info.vpsDetails
    const price = vpsDetails.plan === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE  ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE || 50 : vpsDetails?.totalPrice
    const ref = nanoid()
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      set(chatIdOfPayment, ref, { chatId, price, vpsDetails })
      const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-vps?a=b&ref=${ref}&`)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      log({ ref })
      await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', 'none')
      const priceCrypto = await convert(price, 'usd', coin)
      return send(chatId, vp.showDepositCryptoInfoVps(priceCrypto, ticker, address, vpsDetails), trans('o'))
    } else {
      const coin = tickerOfDyno[ticker]
      const redirect_url = `${SELF_URL}/dynopay/crypto-pay-vps`
      const meta_data = {
        "product_name": dynopayActions.payVps,
        "refId" : ref
      }
      const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      set(chatIdOfDynopayPayment, ref, { chatId, price, vpsDetails, action: dynopayActions.payVps, address })
      log({ ref })
      await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', 'none')
      const priceCrypto = await convert(price, 'usd', tickerOf[ticker])
      return send(chatId, vp.showDepositCryptoInfoVps(priceCrypto, ticker, address, vpsDetails), trans('o'))
    }
  }
  //

  //upgrade Plan payments
  if (action === 'vps-upgrade-plan-pay') {
    if (message === t.back) return info.vpsDetails.upgradeType === 'vps-renew' || info.vpsDetails.upgradeType === 'vps-cPanel-renew' ? goto.confirmVPSRenewDetails()
      : goto.askVpsUpgradePayment()
    const payOption = message

    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-vps-upgrade')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }

    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-vps-upgrade')
      return send(chatId, t.askEmail, bc)
    }

    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'vps-upgrade-plan-pay')
      return goto.walletSelectCurrency(true)
    }

    return send(chatId, t.askValidPayOption)
  }

  if (action === 'bank-pay-vps-upgrade') {
    if (message === t.back) return goto['vps-upgrade-plan-pay']()
    const email = message
    const vpsDetails = info?.vpsDetails
    const price = vpsDetails?.billingCycle === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE || 50 : vpsDetails?.totalPrice
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const ref = nanoid()

    log({ ref })
    set(state, chatId, 'action', 'none')
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, vpsDetails, endpoint: `/bank-pay-upgrade-vps` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    if (vpsDetails.upgradeType === 'plan') {
      return send(chatId, vp.bankPayVPSUpgradePlan(priceNGN, vpsDetails), trans('payBank', url))
    } else if (vpsDetails.upgradeType === 'disk') {
      return send(chatId, vp.bankPayVPSUpgradeDisk(priceNGN, vpsDetails), trans('payBank', url))
    } else if (vpsDetails.upgradeType === 'vps-renew') {
      return send(chatId, vp.bankPayVPSRenewPlan(priceNGN, vpsDetails), trans('payBank', url))
    } else if (vpsDetails.upgradeType === 'vps-cPanel-renew') {
      return send(chatId, vp.bankPayVPSRenewCpanel(priceNGN, vpsDetails), trans('payBank', url))
    }
  }

  if (action === 'crypto-pay-vps-upgrade') {
    if (message === t.back) return goto['vps-upgrade-plan-pay']()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const vpsDetails = info.vpsDetails
    const price = vpsDetails?.billingCycle === 'Hourly' && vpsDetails.totalPrice < VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE  ? VPS_HOURLY_PLAN_MINIMUM_AMOUNT_PAYABLE || 50 : vpsDetails?.totalPrice
    const ref = nanoid()
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      set(chatIdOfPayment, ref, { chatId, price, vpsDetails })
      const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-upgrade-vps?a=b&ref=${ref}&`)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      log({ ref })
      await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', 'none')
      const priceCrypto = await convert(price, 'usd', coin)
      return send(chatId, vp.showDepositCryptoInfoVpsUpgrade(priceCrypto, ticker, address), trans('o'))
    } else {
      const coin = tickerOfDyno[ticker]
      const redirect_url = `${SELF_URL}/dynopay/crypto-pay-upgrade-vps`
      const meta_data = {
        "product_name": dynopayActions.payVps,
        "refId" : ref
      }
      const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      set(chatIdOfDynopayPayment, ref, { chatId, price, vpsDetails, action: dynopayActions.payVps, address })
      log({ ref })
      await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', 'none')
      const priceCrypto = await convert(price, 'usd', tickerOf[ticker])
      return send(chatId, vp.showDepositCryptoInfoVpsUpgrade(priceCrypto, ticker, address), trans('o'))
    }
  }
  //
  if (message === user.buyPlan) {
    return goto['choose-subscription']()
  }
  if (action === 'choose-subscription') {
    const planOptionsOf = trans('planOptionsOf')
    const planOptions = trans('planOptions')
    if (!planOptions.includes(message)) return send(chatId, t.chooseValidPlan, trans('chooseSubscription'))
    const plan = planOptionsOf[message]
    await saveInfo('plan', plan)
    await saveInfo('price', priceOf[plan])
    return goto.askCoupon('choose-subscription')
  }
  if (action === a.askCoupon + 'choose-subscription') {
    if (message === t.back) return goto['choose-subscription']()
    const price = priceOf[info?.plan]
    saveInfo('price', price)
    if (message === t.skip) return (await saveInfo('couponApplied', false)) || goto['plan-pay']()

    const coupon = message.toUpperCase()
    const couponResult = await resolveCoupon(coupon, chatId)
    if (!couponResult) return send(chatId, t.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')

    const newPrice = price - (price * couponResult.discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)

    return goto['plan-pay']()
  }
  if (action === 'plan-pay') {
    if (message === t.back) return goto.askCoupon('choose-subscription')
    const payOption = message
    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-plan')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }
    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-plan')
      return send(chatId, t.askEmail, bc)
    }
    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'plan-pay')
      return goto.walletSelectCurrency()
    }
    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-plan') {
    if (message === t.back) return goto['plan-pay']()

    const email = message
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)

    const { plan } = info
    const price = info?.couponApplied ? info?.newPrice : info?.price
    const priceNGN = Number(await usdToNgn(price))

    const ref = nanoid()
    set(state, chatId, 'action', 'none')
    set(chatIdOfPayment, ref, { chatId, price, plan, endpoint: `/bank-pay-plan` })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)

    log({ ref })
    if (error) return send(chatId, error, trans('o'))
    send(chatId, `Bank ₦aira + Card 🌐︎`, trans('o'))
    console.log('showDepositNgnInfo', url)
    return send(chatId, t['bank-pay-plan'](priceNGN, plan), trans('payBank', url))
  }
  if (action === 'crypto-pay-plan') {
    if (message === t.back) return goto['plan-pay']()

    const ref = nanoid()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const { plan } = info
    const price = info?.couponApplied ? info?.newPrice : info?.price 
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      const { address, bb } = await getCryptoDepositAddress(coin, chatId, SELF_URL, `/crypto-pay-plan?a=b&ref=${ref}&`)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      set(chatIdOfPayment, ref, { chatId, price, plan })
      log({ ref })
      await sendQrCode(bot, chatId, bb, info?.userLanguage ?? 'en')
      set(state, chatId, 'action', 'none')
      const priceCrypto = await convert(price, 'usd', coin)
      return send(chatId, t.showDepositCryptoInfoPlan(priceCrypto, ticker, address, plan), trans('o'))
    } else {
      const coin = tickerOfDyno[ticker]
      if (!coin) return send(chatId, t.askValidCrypto)
      const redirect_url = `${SELF_URL}/dynopay/crypto-pay-plan`
      const meta_data = {
        "product_name": dynopayActions.payPlan,
        "refId" : ref
      }
      const { qr_code, address } = await getDynopayCryptoAddress(price, coin, redirect_url, meta_data)
      if (!address) return send(chatId, t.errorFetchingCryptoAddress, trans('o'))
      set(chatIdOfDynopayPayment, ref, { chatId, price, plan, action: dynopayActions.payPlan, address })
      log({ ref })
      await generateQr(bot, chatId, qr_code, info?.userLanguage ?? 'en')
      const priceCrypto = await convert(price, 'usd', tickerOf[ticker])
      return send(chatId, t.showDepositCryptoInfoPlan(priceCrypto, ticker, address, plan), trans('o'))
    }
  }
  //
  //
  if (message === user.dnsManagement) {
    if (!(await ownsDomainName(chatId))) {
      send(chatId, t.noDomainFound)
      return
    }

    return goto['choose-domain-to-manage']()
  }
  if (action === 'choose-domain-to-manage') {
    if (message === t.back) return goto.submenu2()
    const domain = message.toLowerCase()

    const domains = await getPurchasedDomains(chatId)
    if (!domains.includes(domain)) {
      return send(chatId, t.chooseValidDomain)
    }

    await set(state, chatId, 'domainToManage', domain)
    info = await get(state, chatId)

    return goto['choose-dns-action']()
  }
  if (action === 'choose-dns-action') {
    if (message === t.back) return goto['choose-domain-to-manage']()

    if (![t.addDns, t.updateDns, t.deleteDns, t.activateShortener].includes(message)) return send(chatId, t.selectValidOption)

    if (message === t.activateShortener) {
      const domain = info?.domainToManage
      if (!domain) return send(chatId, 'No domain selected.')
      send(chatId, `🔗 <b>Activating URL Shortener</b> for <b>${domain}</b>...\n\nThis will configure DNS to point your domain to our shortener service. Please wait — this may take a few minutes.`)
      
      // Run the same linking process as when user answers "Yes" during purchase
      try {
        const { server, error, recordType } =
          process.env.HOSTED_ON === 'render'
            ? await saveDomainInServerRender(domain)
            : await saveDomainInServerRailway(domain)

        if (error) {
          return send(chatId, `❌ Error linking <b>${domain}</b> to shortener: ${error}\n\nPlease try again later or contact support.`)
        }

        send(chatId, `⏳ Domain <b>${domain}</b> is being linked to the shortener...\nAdding DNS record (${recordType} → ${server})...`)

        // Determine registrar from DNS records
        const dnsResult = await domainService.viewDNSRecords(domain, db)
        const source = dnsResult?.source || 'connectreseller'

        if (source === 'openprovider') {
          await sleep(10000)
          const addResult = await domainService.addDNSRecord(domain, recordType, server, '', db)
          if (addResult.error || !addResult.success) {
            return send(chatId, `❌ DNS record error for <b>${domain}</b>: ${addResult.error || 'Unknown error'}`)
          }
        } else {
          await sleep(65000)
          const { error: saveErr } = await saveServerInDomain(domain, server, recordType)
          if (saveErr) {
            return send(chatId, `❌ DNS record error for <b>${domain}</b>: ${saveErr}`)
          }
        }

        send(chatId, `✅ <b>${domain}</b> has been linked to the URL shortener!\n\nDNS propagation may take up to 24 hours. You'll be notified when your domain is ready to use for short links.`)
        const lang = info?.userLanguage || 'en'
        regularCheckDns(bot, chatId, domain, lang)
      } catch (e) {
        log(`[ActivateShortener] Error for ${domain}: ${e.message}`)
        send(chatId, `❌ Error activating shortener for <b>${domain}</b>: ${e.message}\n\nPlease try again later.`)
      }
      return
    }

    if (message === t.deleteDns) return goto['select-dns-record-id-to-delete']()

    if (message === t.updateDns) return goto['select-dns-record-id-to-update']()

    if (message === t.addDns) return goto['select-dns-record-type-to-add']()
  }
  //
  if (action === 'select-dns-record-id-to-delete') {
    if (message === t.back) return goto['choose-dns-action']()

    let id = Number(message)
    if (isNaN(id) || !(id > 0 && id <= info?.dnsRecords.length)) return send(chatId, t.selectValidOption)

    set(state, chatId, 'delId', --id) // User See id as 1,2,3 and we see as 0,1,2
    return goto['confirm-dns-record-id-to-delete']()
  }
  if (action === 'confirm-dns-record-id-to-delete') {
    if (message === t.back || message === t.no) return goto['select-dns-record-id-to-delete']()
    if (message !== t.yes) return send(chatId, t.what)

    const { domainNameId, dnsRecords, domainToManage, delId, dnsSource } = info
    if(!!dnsRecords && !!dnsRecords?.[delId]) {
      if (dnsSource === 'cloudflare' && dnsRecords[delId].cfRecordId) {
        const result = await domainService.deleteDNSRecord(domainToManage, dnsRecords[delId], db)
        if (!result.success) return send(chatId, t.errorDeletingDns(result.error || 'Cloudflare delete failed'))
      } else {
        const nsRecords = dnsRecords.filter(r => r.recordType === 'NS')
        const { dnszoneID, dnszoneRecordID, nsId } = dnsRecords[delId]
        const { error } = await deleteDNSRecord(dnszoneID, dnszoneRecordID, domainToManage, domainNameId, nsId, nsRecords)
        if (error) return send(chatId, t.errorDeletingDns(error))
      }
  
      send(chatId, t.dnsRecordDeleted)
    } else {
      send(chatId, t.errorDeletingDns("NO DNS Record ID Found"))
    }
    return goto['choose-dns-action']()
  }
  if (action === 'select-dns-record-type-to-add') {
    if (message === t.back) return goto['choose-dns-action']()

    const recordType = message

    if (![t.cname, t.ns, t.a].includes(recordType)) {
      return send(chatId, t.selectValidOption)
    }

    return goto['type-dns-record-data-to-add'](recordType)
  }
  if (action === 'type-dns-record-data-to-add') {
    if (message === t.back) return goto['select-dns-record-type-to-add']()

    const domain = info?.domainToManage
    const dnsSource = info?.dnsSource
    let recordType = info?.recordType
    let newRecordDetails = null
    if (t[recordType] !== 'NS') {
      newRecordDetails = message.split(" ")
      if (!newRecordDetails || newRecordDetails.length < 2 || newRecordDetails.length > 3) return send(chatId, t.selectValidOption)
      if (!['A', 'CNAME'].includes(newRecordDetails[0].toLocaleUpperCase()))return send(chatId, t.selectValidOption)
    }
    const recordContent = newRecordDetails ? newRecordDetails[newRecordDetails.length -1 ] : message
    const hostName = newRecordDetails && newRecordDetails.length === 3 ? newRecordDetails[1] : null
    const dnsRecords = info?.dnsRecords
    const nsRecords = dnsRecords?.filter(r => r.recordType === 'NS')
    const domainNameId = info?.domainNameId

    if (nsRecords.length >= 4 && t[recordType] === 'NS') {
      send(chatId, t.maxDnsRecord)
      return goto['choose-dns-action']()
    }

    if (dnsSource === 'cloudflare') {
      const result = await domainService.addDNSRecord(domain, t[recordType], recordContent, hostName || '', db)
      if (result.error || !result.success) {
        const m = t.errorSavingDns(result.error || 'Cloudflare add failed')
        return send(chatId, m)
      }
    } else {
      const nextId = nextNumber(nsRecords.map(r => r.nsId))
      const { error } = await saveServerInDomain(domain, recordContent, t[recordType], domainNameId, nextId, nsRecords, hostName)
      if (error) {
        const m = t.errorSavingDns(error)
        return send(chatId, m)
      }
    }

    send(chatId, t.dnsRecordSaved)
    return goto['choose-dns-action']()
  }
  //
  if (action === 'select-dns-record-id-to-update') {
    if (message === t.back) return goto['choose-dns-action']()

    const dnsRecords = info?.dnsRecords
    let id = Number(message)
    if (isNaN(id) || !(id > 0 && id <= dnsRecords.length)) {
      return send(chatId, t.selectValidOption)
    }
    id-- // User See id as 1,2,3 and we see as 0,1,2

    return goto['type-dns-record-data-to-update'](id, dnsRecords[id]?.recordType)
  }
  if (action === 'type-dns-record-data-to-update') {
    if (message === t.back) return goto['select-dns-record-id-to-update']()

    const dnsRecords = info?.dnsRecords
    const domainNameId = info?.domainNameId
    const domain = info?.domainToManage
    const dnsSource = info?.dnsSource
    const id = info?.dnsRecordIdToUpdate
    let newRecordDetails = null

    const { dnszoneID, dnszoneRecordID, recordType, nsId, cfRecordId, recordName } = dnsRecords[id]

    if (recordType !== 'NS') {
      newRecordDetails = message.split(" ")
      if (!newRecordDetails || newRecordDetails.length < 2 || newRecordDetails.length > 3) return send(chatId, t.selectValidOption)
      if (!['A', 'CNAME'].includes(newRecordDetails[0].toLocaleUpperCase()))return send(chatId, t.selectValidOption)
    }
    const recordContent = newRecordDetails ? newRecordDetails[newRecordDetails.length -1 ] : message
    const hostName = newRecordDetails && newRecordDetails.length === 3 ? newRecordDetails[1] : null

    if (dnsSource === 'cloudflare' && cfRecordId) {
      const result = await domainService.updateDNSRecord(domain, {
        cfRecordId,
        recordType,
        recordName: recordName || domain,
        recordValue: recordContent,
      }, db)
      if (result.error || !result.success) {
        const m = `Error update dns record, ${result.error || 'Cloudflare update failed'}, Provide value again`
        send(chatId, m)
        return m
      }
    } else {
      const { error } = await updateDNSRecord(
        dnszoneID,
        dnszoneRecordID,
        domain,
        recordType,
        recordContent,
        domainNameId,
        nsId,
        dnsRecords.filter(r => r.recordType === 'NS'),
        hostName
      )
      if (error) {
        const m = `Error update dns record, ${error}, Provide value again`
        send(chatId, m)
        return m
      }
    }

    send(chatId, t.dnsRecordUpdated)
    return goto['choose-dns-action']()
  }
  //
  //
  //
  if (message === user.wallet) {
    return goto[user.wallet]()
  }
  if (action === user.wallet) {
    if (message === u.deposit) return goto[a.selectCurrencyToDeposit]() // can be combine in one line with object
    if (message === u.withdraw) return goto[a.selectCurrencyToWithdraw]()
    return send(chatId, t.what)
  }

  if (message === u.deposit) return goto[a.selectCurrencyToDeposit]()

  if (action === a.selectCurrencyToDeposit) {
    if (message === t.back) return goto[user.wallet]()
    if (message === u.usd) return goto[a.depositUSD]()
    if (message === u.ngn) return goto[a.depositNGN]()
    return send(chatId, t.what, trans('payOpts'))
  }

  if (action === a.depositNGN) {
    if (message === t.back) return goto[a.selectCurrencyToDeposit]()

    const amount = message
    if (isNaN(amount)) return send(chatId, t.askValidAmount)
    await saveInfo('depositAmountNgn', Number(amount))
    return goto[a.askEmailForNGN]()
  }
  if (action === a.askEmailForNGN) {
    if (message === t.back) return goto[a.depositNGN]()

    const email = message
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)
    await saveInfo('email', email)
    return goto.showDepositNgnInfo()
  }

  if (action === a.depositUSD) {
    if (message === t.back) return goto[a.selectCurrencyToDeposit]()

    const amount = Number(message)
    if (isNaN(amount) || amount < 10) return send(chatId, t.whatNum)
    await saveInfo('amount', amount)

    return goto[a.selectCryptoToDeposit]()
  }
  if (action === a.selectCryptoToDeposit) {
    if (message === t.back) return goto[a.depositUSD]()

    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    await saveInfo('tickerView', ticker)
    return goto.showDepositCryptoInfo()
  }
  //
  //
  if (action === a.walletSelectCurrency) {
    if (message === t.back) return goto[info?.lastStep]()

    const coin = message
    if (![u.usd, u.ngn].includes(coin)) return send(chatId, t.what)
    await saveInfo('coin', coin)

    return goto.walletSelectCurrencyConfirm()
  }
  if (action === a.walletSelectCurrencyConfirm) {
    if (message === t.back || message === t.no) return goto[a.walletSelectCurrency]()

    if (message !== t.yes) return send(chatId, t.what)

    try {
      return walletOk[info?.lastStep](info?.coin)
    } catch (error) {
      return sendMessage(chatId, 'Error code 209 ' + error?.message)
    }
  }

  //
  //
  if (message === user.urlShortenerMain || message.startsWith('🔗✂️ URL Shortener')) {
    return goto.submenu1()
  }
  if (message === user.domainNames) {
    return goto.submenu2()
  }
  if (message === user.phoneNumberLeads) {
    return goto.targetSelectTarget()
  }
  if (message === user.hostingDomainsRedirect || message.startsWith('🌐 Offshore Hosting') || message.startsWith('🌐 Hosting')) {
    if (process.env.OFFSHORE_HOSTING_ON === 'false') {
      return send(chatId, `🌐 Offshore Hosting is currently unavailable. Contact ${process.env.SUPPORT_USERNAME || '@support'} for updates.`, trans('o'))
    }
    return goto.submenu3()
  }
  if (message === user.cloudPhone || message === phoneConfig.btn.cloudPhone) {
    if (process.env.PHONE_SERVICE_ON !== 'true') {
      return send(chatId, `📞 Cloud Phone is coming soon! Contact ${process.env.SUPPORT_USERNAME || '@support'} for updates.`, trans('o'))
    }
    return goto.submenu5()
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CLOUD PHONE — STATE MACHINE HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (action === a.submenu5) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back || message === t.cancel || message === pc.cancel) return send(chatId, t.userPressedBtn(message), trans('o'))
    if (message === pc.buyPhoneNumber) {
      set(state, chatId, 'action', a.cpSelectCountry)
      const countryBtns = phoneConfig.countries.map(c => c.name)
      const rows = []
      for (let i = 0; i < countryBtns.length; i += 2) {
        rows.push(countryBtns.slice(i, i + 2))
      }
      return send(chatId, phoneConfig.txt.selectCountry, k.of(rows))
    }
    if (message === pc.myNumbers) {
      const userData = await get(phoneNumbersOf, chatId)
      const numbers = (userData?.numbers || []).filter(n => n.status === 'active' || n.status === 'suspended')
      if (!numbers.length) {
        return send(chatId, phoneConfig.txt.noNumbers, k.of([[pc.buyPhoneNumber]]))
      }
      set(state, chatId, 'action', a.cpMyNumbers)
      await saveInfo('cpNumbers', numbers)
      const numBtns = numbers.map((_, i) => String(i + 1))
      return send(chatId, phoneConfig.txt.myNumbersList(numbers), k.of([numBtns, [pc.buyAnother]]))
    }
    if (message === pc.sipSettings) {
      return send(chatId, phoneConfig.txt.softphoneGuide(phoneConfig.SIP_DOMAIN), k.of([]))
    }
    if (message === pc.usageBilling) {
      // Show overall usage if they have numbers
      const userData = await get(phoneNumbersOf, chatId)
      const numbers = (userData?.numbers || []).filter(n => n.status === 'active')
      if (!numbers.length) return send(chatId, phoneConfig.getMsg(info?.userLanguage).noActiveNumbers, k.of([[pc.buyPhoneNumber]]))
      // Show list to pick a number
      set(state, chatId, 'action', a.cpMyNumbers)
      await saveInfo('cpNumbers', numbers)
      const numBtns = numbers.map((_, i) => String(i + 1))
      return send(chatId, phoneConfig.txt.myNumbersList(numbers), k.of([numBtns]))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ── BUY FLOW: Select Country ──
  if (action === a.cpSelectCountry) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) return goto.submenu5()
    const countryCode = phoneConfig.countryByName[message]
    if (!countryCode) return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectValidCountry)
    await saveInfo('cpCountryCode', countryCode)
    await saveInfo('cpCountryName', message)
    set(state, chatId, 'action', a.cpSelectType)
    return send(chatId, phoneConfig.txt.selectType(message), k.of([[pc.localNumber], [pc.tollFreeNumber]]))
  }

  // ── BUY FLOW: Select Type ──
  if (action === a.cpSelectType) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSelectCountry)
      const countryBtns = phoneConfig.countries.map(c => c.name)
      const rows = []
      for (let i = 0; i < countryBtns.length; i += 2) rows.push(countryBtns.slice(i, i + 2))
      return send(chatId, phoneConfig.txt.selectCountry, k.of(rows))
    }
    let numberType = null
    if (message === pc.localNumber) numberType = 'local'
    if (message === pc.tollFreeNumber) numberType = 'toll_free'
    if (!numberType) return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectLocalOrTollFree)
    await saveInfo('cpNumberType', numberType)

    // If US, show area codes. Otherwise, skip to search.
    const cc = info?.cpCountryCode || 'US'
    if (cc === 'US' && numberType === 'local') {
      set(state, chatId, 'action', a.cpSelectArea)
      const areaBtns = phoneConfig.usAreaCodes.map(a => `${a.city} (${a.code})`)
      const rows = []
      for (let i = 0; i < areaBtns.length; i += 2) rows.push(areaBtns.slice(i, i + 2))
      rows.push([pc.searchByArea])
      return send(chatId, phoneConfig.txt.selectArea, k.of(rows))
    }
    // Non-US or toll-free: search directly
    set(state, chatId, 'action', a.cpSelectNumber)
    send(chatId, phoneConfig.txt.searching)
    const results = await telnyxApi.searchNumbers(cc, numberType, null, 5)
    if (!results.length) return send(chatId, phoneConfig.txt.noSearchResults, k.of([]))
    await saveInfo('cpSearchResults', results)
    const location = info?.cpCountryName || cc
    const numBtns = results.map((_, i) => String(i + 1))
    return send(chatId, phoneConfig.txt.showNumbers(location, results), k.of([numBtns, [pc.showMore]]))
  }

  // ── BUY FLOW: Select Area ──
  if (action === a.cpSelectArea) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSelectType)
      return send(chatId, phoneConfig.txt.selectType(info?.cpCountryName || ''), k.of([[pc.localNumber], [pc.tollFreeNumber]]))
    }
    if (message === pc.searchByArea) {
      set(state, chatId, 'action', a.cpEnterAreaCode)
      return send(chatId, phoneConfig.txt.enterAreaCode)
    }
    const areaCode = phoneConfig.areaByLabel[message]
    if (!areaCode) return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectValidArea)
    await saveInfo('cpAreaCode', areaCode)
    await saveInfo('cpAreaName', message)

    set(state, chatId, 'action', a.cpSelectNumber)
    send(chatId, phoneConfig.txt.searching)
    const results = await telnyxApi.searchNumbers(info?.cpCountryCode || 'US', info?.cpNumberType || 'local', areaCode, 5)
    if (!results.length) return send(chatId, phoneConfig.txt.noSearchResults, k.of([]))
    await saveInfo('cpSearchResults', results)
    const numBtns = results.map((_, i) => String(i + 1))
    return send(chatId, phoneConfig.txt.showNumbers(message, results), k.of([numBtns, [pc.showMore]]))
  }

  // ── BUY FLOW: Enter Area Code ──
  if (action === a.cpEnterAreaCode) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSelectArea)
      const areaBtns = phoneConfig.usAreaCodes.map(a => `${a.city} (${a.code})`)
      const rows = []
      for (let i = 0; i < areaBtns.length; i += 2) rows.push(areaBtns.slice(i, i + 2))
      rows.push([pc.searchByArea])
      return send(chatId, phoneConfig.txt.selectArea, k.of(rows))
    }
    const areaCode = message.replace(/\D/g, '')
    if (!areaCode || areaCode.length < 2) return send(chatId, phoneConfig.getMsg(info?.userLanguage).enterValidAreaCode)
    await saveInfo('cpAreaCode', areaCode)
    await saveInfo('cpAreaName', `Area ${areaCode}`)

    set(state, chatId, 'action', a.cpSelectNumber)
    send(chatId, phoneConfig.txt.searching)
    const results = await telnyxApi.searchNumbers(info?.cpCountryCode || 'US', info?.cpNumberType || 'local', areaCode, 5)
    if (!results.length) return send(chatId, phoneConfig.txt.noSearchResults + '\nTry a different area code.', k.of([]))
    await saveInfo('cpSearchResults', results)
    const numBtns = results.map((_, i) => String(i + 1))
    return send(chatId, phoneConfig.txt.showNumbers(`Area ${areaCode}`, results), k.of([numBtns, [pc.showMore]]))
  }

  // ── BUY FLOW: Select Number ──
  if (action === a.cpSelectNumber) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) {
      const cc = info?.cpCountryCode || 'US'
      if (cc === 'US' && info?.cpNumberType === 'local') {
        set(state, chatId, 'action', a.cpSelectArea)
        const areaBtns = phoneConfig.usAreaCodes.map(a => `${a.city} (${a.code})`)
        const rows = []
        for (let i = 0; i < areaBtns.length; i += 2) rows.push(areaBtns.slice(i, i + 2))
        rows.push([pc.searchByArea])
        return send(chatId, phoneConfig.txt.selectArea, k.of(rows))
      }
      set(state, chatId, 'action', a.cpSelectType)
      return send(chatId, phoneConfig.txt.selectType(info?.cpCountryName || ''), k.of([[pc.localNumber], [pc.tollFreeNumber]]))
    }
    if (message === pc.showMore) {
      send(chatId, phoneConfig.txt.searching)
      const results = await telnyxApi.searchNumbers(info?.cpCountryCode || 'US', info?.cpNumberType || 'local', info?.cpAreaCode, 5)
      if (!results.length) return send(chatId, phoneConfig.txt.noSearchResults, k.of([]))
      await saveInfo('cpSearchResults', results)
      const location = info?.cpAreaName || info?.cpCountryName || ''
      const numBtns = results.map((_, i) => String(i + 1))
      return send(chatId, phoneConfig.txt.showNumbers(location, results), k.of([numBtns, [pc.showMore]]))
    }
    const idx = parseInt(message) - 1
    const results = info?.cpSearchResults || []
    if (isNaN(idx) || idx < 0 || idx >= results.length) return send(chatId, phoneConfig.getMsg(info?.userLanguage).tapNumberToSelect)
    const selected = results[idx]
    await saveInfo('cpSelectedNumber', selected.phone_number)

    set(state, chatId, 'action', a.cpSelectPlan)
    return send(chatId, phoneConfig.txt.selectPlan(selected.phone_number), k.of([
      [pc.starterPlan], [pc.proPlan], [pc.businessPlan]
    ]))
  }

  // ── BUY FLOW: Select Plan ──
  if (action === a.cpSelectPlan) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSelectNumber)
      const results = info?.cpSearchResults || []
      if (!results.length) return goto.submenu5()
      const location = info?.cpAreaName || info?.cpCountryName || ''
      const numBtns = results.map((_, i) => String(i + 1))
      return send(chatId, phoneConfig.txt.showNumbers(location, results), k.of([numBtns, [pc.showMore]]))
    }
    const planKey = phoneConfig.planByButton[message]
    if (!planKey) return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectPlan)
    const plan = phoneConfig.plans[planKey]
    await saveInfo('cpPlanKey', planKey)
    await saveInfo('cpPrice', plan.price)
    await saveInfo('price', plan.price)

    set(state, chatId, 'action', a.cpOrderSummary)
    return send(chatId, phoneConfig.txt.orderSummary(
      info?.cpSelectedNumber, info?.cpCountryName || 'US', plan, plan.price
    ), k.of([[pc.proceedPayment], [pc.applyCoupon]]))
  }

  // ── BUY FLOW: Order Summary → Payment ──
  if (action === a.cpOrderSummary) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSelectPlan)
      return send(chatId, phoneConfig.txt.selectPlan(info?.cpSelectedNumber), k.of([
        [pc.starterPlan], [pc.proPlan], [pc.businessPlan]
      ]))
    }
    if (message === pc.applyCoupon) {
      return goto.askCoupon('cpOrderSummary')
    }
    if (message === pc.proceedPayment) {
      return goto['phone-pay']()
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).proceedOrBack)
  }

  // ── PHONE PAY ──
  if (action === 'phone-pay') {
    if (message === t.back) {
      set(state, chatId, 'action', a.cpOrderSummary)
      const plan = phoneConfig.plans[info?.cpPlanKey]
      return send(chatId, phoneConfig.txt.orderSummary(
        info?.cpSelectedNumber, info?.cpCountryName || 'US', plan, plan?.price || info?.cpPrice
      ), k.of([[phoneConfig.btn.proceedPayment], [phoneConfig.btn.applyCoupon]]))
    }
    const payOption = message
    if (payOption === payIn.crypto) {
      set(state, chatId, 'action', 'crypto-pay-phone')
      return send(chatId, t.selectCryptoToDeposit, trans('k.of', trans('supportedCryptoViewOf')))
    }
    if (payOption === payIn.bank) {
      set(state, chatId, 'action', 'bank-pay-phone')
      return send(chatId, t.askEmail, bc)
    }
    if (payOption === payIn.wallet) {
      set(state, chatId, 'lastStep', 'phone-pay')
      return goto.walletSelectCurrency()
    }
    return send(chatId, t.askValidPayOption)
  }
  if (action === 'bank-pay-phone') {
    if (message === t.back) return goto['phone-pay']()
    const email = message
    const price = info?.cpPrice
    if (!isValidEmail(email)) return send(chatId, t.askValidEmail)
    const ref = nanoid()
    set(state, chatId, 'action', 'none')
    const priceNGN = Number(await usdToNgn(price))
    set(chatIdOfPayment, ref, { chatId, price, cpData: { selectedNumber: info?.cpSelectedNumber, planKey: info?.cpPlanKey }, endpoint: '/bank-pay-phone' })
    const { url, error } = await createCheckout(priceNGN, `/ok?a=b&ref=${ref}&`, email, username, ref)
    if (error) return send(chatId, error, trans('o'))
    return send(chatId, `Cloud Phone ₦${priceNGN.toLocaleString()}`, trans('payBank', url))
  }
  if (action === 'crypto-pay-phone') {
    if (message === t.back) return goto['phone-pay']()
    const tickerView = message
    const supportedCryptoView = trans('supportedCryptoView')
    const ticker = supportedCryptoView[tickerView]
    if (!ticker) return send(chatId, t.askValidCrypto)
    const price = info?.cpPrice
    const ref = nanoid()
    if (BLOCKBEE_CRYTPO_PAYMENT_ON === 'true') {
      const coin = tickerOf[ticker]
      set(chatIdOfPayment, ref, { chatId, price, cpData: { selectedNumber: info?.cpSelectedNumber, planKey: info?.cpPlanKey } })
      const url = await generateBlockBeeAddress(price, coin, `${SELF_URL}/crypto-pay-phone?ref=${ref}`, { chatId, coin })
      if (!url) return send(chatId, t.cryptoPayError)
      send(chatId, t.cryptoPayWaiting(url, coin.toUpperCase()), { parse_mode: 'HTML' })
    }
    return
  }

  // Helper: Build feature-gated manage menu keyboard
  function buildManageMenu(num) {
    const pc = phoneConfig.btn
    const plan = num.plan || 'starter'
    const rows = []
    // Communication
    rows.push([pc.callForwarding, pc.smsSettings])
    rows.push([pc.smsInbox])
    if (phoneConfig.canAccessFeature(plan, 'voicemail')) rows.push([pc.voicemail])
    // SIP — always visible so users can find credentials (shows upgrade prompt if Starter)
    rows.push([pc.sipCredentials])
    // Advanced (plan-gated)
    if (phoneConfig.canAccessFeature(plan, 'callRecording')) rows.push([pc.callRecording])
    if (phoneConfig.canAccessFeature(plan, 'ivr')) rows.push([pc.ivrAutoAttendant])
    // Logs & Billing
    rows.push([pc.callSmsLogs])
    rows.push([pc.renewChangePlan, pc.releaseNumber])
    return rows
  }

  // ━━━ MY NUMBERS ━━━

  // Helper: Show SMS Inbox with CNAM lookups + pagination
  async function showSmsInbox(chatId, num, page = 1) {
    const pc = phoneConfig.btn
    const perPage = 5
    const cleanNum = num.phoneNumber.replace(/[^+\d]/g, '')

    // Query SMS logs
    const totalCount = await phoneLogs.countDocuments({ phoneNumber: cleanNum, type: 'sms', direction: 'inbound' })
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
    const skip = (page - 1) * perPage
    const messages = await phoneLogs.find({ phoneNumber: cleanNum, type: 'sms', direction: 'inbound' })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(perPage)
      .toArray()

    if (!messages.length && page === 1) {
      return send(chatId, phoneConfig.txt.smsInboxEmpty, k.of([[pc.inboxRefresh]]))
    }

    // Batch CNAM lookup for sender numbers
    const uniqueFroms = [...new Set(messages.map(m => m.from).filter(Boolean))]
    let cnamResults = {}
    try {
      cnamResults = await batchLookupCnam(uniqueFroms)
    } catch (e) {
      log(`[SmsInbox] CNAM batch lookup error: ${e.message}`)
    }

    // Build inbox text
    let text = phoneConfig.txt.smsInboxHeader(num.phoneNumber, totalCount)
    messages.forEach((m, i) => {
      const senderName = cnamResults[m.from] || null
      const time = m.timestamp ? new Date(m.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'
      text += phoneConfig.txt.smsInboxEntry(skip + i + 1, m.from, senderName, m.body || '(no content)', time)
    })
    text += phoneConfig.txt.smsInboxFooter(page, totalPages)

    // Build pagination buttons
    const navBtns = []
    if (page > 1) navBtns.push(pc.inboxNewerPage)
    navBtns.push(pc.inboxRefresh)
    if (page < totalPages) navBtns.push(pc.inboxOlderPage)

    return send(chatId, text, k.of([navBtns, [pc.back]]))
  }
  if (action === a.cpMyNumbers) {
    const pc = phoneConfig.btn
    if (message === t.back || message === pc.back) return goto.submenu5()
    if (message === pc.buyAnother || message === pc.buyPhoneNumber) {
      set(state, chatId, 'action', a.cpSelectCountry)
      const countryBtns = phoneConfig.countries.map(c => c.name)
      const rows = []
      for (let i = 0; i < countryBtns.length; i += 2) rows.push(countryBtns.slice(i, i + 2))
      return send(chatId, phoneConfig.txt.selectCountry, k.of(rows))
    }
    const idx = parseInt(message) - 1
    const numbers = info?.cpNumbers || []
    if (isNaN(idx) || idx < 0 || idx >= numbers.length) return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectByIndex)
    const num = numbers[idx]
    await saveInfo('cpActiveNumber', num)
    set(state, chatId, 'action', a.cpManageNumber)
    return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
  }

  // ━━━ MANAGE NUMBER ━━━
  if (action === a.cpManageNumber) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      // Go back to my numbers list
      const userData = await get(phoneNumbersOf, chatId)
      const numbers = (userData?.numbers || []).filter(n => n.status === 'active' || n.status === 'suspended')
      await saveInfo('cpNumbers', numbers)
      set(state, chatId, 'action', a.cpMyNumbers)
      const numBtns = numbers.map((_, i) => String(i + 1))
      return send(chatId, phoneConfig.txt.myNumbersList(numbers), k.of([numBtns, [pc.buyAnother]]))
    }

    // Call Forwarding
    if (message === pc.callForwarding) {
      set(state, chatId, 'action', a.cpCallForwarding)
      const fwd = num.features?.callForwarding || {}
      let walletBal = 0
      try { const { usdBal } = await getBalance(walletOf, chatId); walletBal = usdBal } catch (e) {}
      const btns = fwd.enabled
        ? [[pc.alwaysForward], [pc.forwardBusy], [pc.forwardNoAnswer], ['📲 Change Forward-To Number'], [pc.disableForwarding]]
        : [[pc.alwaysForward], [pc.forwardBusy], [pc.forwardNoAnswer]]
      return send(chatId, phoneConfig.txt.forwardingStatus(num.phoneNumber, fwd, walletBal), k.of(btns))
    }

    // SMS Settings
    if (message === pc.smsSettings) {
      set(state, chatId, 'action', a.cpSmsSettings)
      const smsConf = num.features?.smsForwarding || {}
      const tgLabel = `📲 SMS to Telegram ${smsConf.toTelegram !== false ? '✅ ON' : '❌ OFF'}`
      const smsBtns = [[tgLabel]]
      if (phoneConfig.canAccessFeature(num.plan, 'smsToEmail')) {
        const emLabel = `📧 SMS to Email ${smsConf.toEmail ? '✅ ' + smsConf.toEmail : '❌ OFF'}`
        smsBtns.push([emLabel])
      } else {
        smsBtns.push([`🔒 SMS to Email (Pro+)`])
      }
      if (phoneConfig.canAccessFeature(num.plan, 'smsWebhook')) {
        const whLabel = `🔗 Webhook URL ${smsConf.webhookUrl ? '✅ Set' : '❌ Not Set'}`
        smsBtns.push([whLabel])
      } else {
        smsBtns.push([`🔒 Webhook URL (Pro+)`])
      }
      return send(chatId, phoneConfig.txt.smsSettingsMenu(num.phoneNumber, smsConf, num.plan), k.of(smsBtns))
    }

    // SMS Inbox
    if (message === pc.smsInbox) {
      set(state, chatId, 'action', a.cpSmsInbox)
      await saveInfo('cpInboxPage', 1)
      return showSmsInbox(chatId, num, 1)
    }

    // Voicemail — Pro/Business only (gated by buildManageMenu, but double-check)
    if (message === pc.voicemail) {
      if (!phoneConfig.canAccessFeature(num.plan, 'voicemail')) {
        return send(chatId, phoneConfig.upgradeMessage('voicemail', num.plan), k.of(buildManageMenu(num)))
      }
      set(state, chatId, 'action', a.cpVoicemail)
      const vm = num.features?.voicemail || {}
      const btns = vm.enabled
        ? [['🔊 Greeting'],
           ['📲 VM to Telegram ' + (vm.forwardToTelegram !== false ? '✅ ON' : '❌ OFF')],
           ['📧 VM to Email ' + (vm.forwardToEmail ? '✅ ' + vm.forwardToEmail : '❌ OFF')],
           [`⏰ Ring Time: ${vm.ringTimeout || 25}s`],
           [pc.disableVoicemail]]
        : [[pc.enableVoicemail]]
      return send(chatId, phoneConfig.txt.voicemailMenu(num.phoneNumber, vm), k.of(btns))
    }

    // SIP Credentials — Pro/Business only
    if (message === pc.sipCredentials) {
      if (num.sipDisabled || !phoneConfig.canAccessFeature(num.plan, 'sipCredentials')) {
        return send(chatId, phoneConfig.upgradeMessage('sipCredentials', num.plan), k.of(buildManageMenu(num)))
      }
      set(state, chatId, 'action', a.cpSipCredentials)
      return send(chatId, phoneConfig.txt.sipCredentialsMsg(num.phoneNumber, num.sipUsername, phoneConfig.SIP_DOMAIN), k.of([
        [pc.revealPassword], [pc.resetPassword], [pc.softphoneGuide]
      ]))
    }

    // Call Recording — Business only
    if (message === pc.callRecording) {
      if (!phoneConfig.canAccessFeature(num.plan, 'callRecording')) {
        return send(chatId, phoneConfig.upgradeMessage('callRecording', num.plan), k.of(buildManageMenu(num)))
      }
      set(state, chatId, 'action', a.cpCallRecording)
      const isEnabled = num.features?.recording === true
      return send(chatId, phoneConfig.txt.recordingMenu(num.phoneNumber, num.features), k.of(
        isEnabled ? [[pc.disableRecording]] : [[pc.enableRecording]]
      ))
    }

    // IVR / Auto-attendant — Business only
    if (message === pc.ivrAutoAttendant) {
      if (!phoneConfig.canAccessFeature(num.plan, 'ivr')) {
        return send(chatId, phoneConfig.upgradeMessage('ivr', num.plan), k.of(buildManageMenu(num)))
      }
      set(state, chatId, 'action', a.cpIvr)
      const ivrConf = num.features?.ivr || {}
      const btns = ivrConf.enabled
        ? [[pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]]
        : [[pc.enableIvr]]
      return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of(btns))
    }

    // Call & SMS Logs
    if (message === pc.callSmsLogs) {
      const logs = await phoneLogs.find({ phoneNumber: num.phoneNumber.replace(/[^+\d]/g, '') }).sort({ timestamp: -1 }).limit(15).toArray()
      let text = `📊 <b>Recent Activity</b> — ${phoneConfig.formatPhone(num.phoneNumber)}\n\n`
      if (!logs.length) {
        text += 'No activity yet.'
      } else {
        logs.forEach(l => {
          const time = phoneConfig.shortDate(l.timestamp)
          const from = phoneConfig.formatPhone(l.from || '?')
          if (l.type === 'sms') {
            const preview = (l.body || '').substring(0, 40)
            text += `📩 ${from} — "${preview}${l.body?.length > 40 ? '...' : ''}"\n   ${time}\n`
          } else if (l.type === 'voicemail') {
            text += `🎙️ ${from} — Voicemail ${phoneConfig.formatDuration(l.duration)}\n   ${time}\n`
          } else if (l.type === 'forwarded') {
            text += `📲 ${from} — Forwarded ${phoneConfig.formatDuration(l.duration)}\n   ${time}\n`
          } else if (l.type === 'missed') {
            text += `📞 ${from} — Missed Call\n   ${time}\n`
          } else if (l.type === 'call_recording') {
            text += `🔴 ${from} — Recorded ${phoneConfig.formatDuration(l.duration)}\n   ${time}\n`
          } else {
            text += `📞 ${from} — ${l.type || 'Call'} ${phoneConfig.formatDuration(l.duration)}\n   ${time}\n`
          }
        })
      }
      return send(chatId, text, k.of([]))
    }

    // Renew / Change Plan
    if (message === pc.renewChangePlan) {
      set(state, chatId, 'action', a.cpRenewPlan)
      const plan = phoneConfig.plans[num.plan] || { name: num.plan, price: num.planPrice }
      return send(chatId, phoneConfig.txt.renewMenu(num.phoneNumber, plan.name, num.planPrice, num.expiresAt, num.autoRenew), k.of([
        ['🔄 Renew Now ($' + num.planPrice + ')'],
        [pc.changePlan],
        ['🔁 Auto-Renew: ' + (num.autoRenew ? '✅ ON' : '❌ OFF')],
      ]))
    }

    // Release Number
    if (message === pc.releaseNumber) {
      set(state, chatId, 'action', a.cpReleaseConfirm)
      return send(chatId, phoneConfig.txt.releaseConfirm(num.phoneNumber), k.of([
        [pc.yesRelease, pc.noKeep]
      ]))
    }

    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ━━━ CALL FORWARDING ━━━
  if (action === a.cpCallForwarding) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.disableForwarding) {
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'callForwarding', { enabled: false, mode: 'disabled', forwardTo: null })
      num.features.callForwarding = { enabled: false, mode: 'disabled', forwardTo: null }
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.forwardingDisabled(num.phoneNumber))
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    let mode = null
    if (message === pc.alwaysForward) mode = 'always'
    if (message === pc.forwardBusy) mode = 'busy'
    if (message === pc.forwardNoAnswer) mode = 'no_answer'
    if (message === '📲 Change Forward-To Number') mode = num.features?.callForwarding?.mode || 'always'
    if (mode) {
      await saveInfo('cpForwardMode', mode)
      // Check wallet balance before proceeding
      let walletBal = 0
      try {
        const { usdBal } = await getBalance(walletOf, chatId)
        walletBal = usdBal
      } catch (e) {}
      if (walletBal < phoneConfig.CALL_FORWARDING_RATE_MIN) {
        send(chatId, t.fwdInsufficientBalance(walletBal, phoneConfig.CALL_FORWARDING_RATE_MIN), { parse_mode: 'HTML' })
        set(state, chatId, 'action', a.cpManageNumber)
        return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
      }
      set(state, chatId, 'action', a.cpEnterForwardNumber)
      return send(chatId, t.fwdEnterNumber(phoneConfig.CALL_FORWARDING_RATE_MIN, walletBal), { parse_mode: 'HTML' })
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectForwardMode)
  }
  if (action === a.cpEnterForwardNumber) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpCallForwarding)
      const fwd = num.features?.callForwarding || {}
      let walletBal = 0
      try { const { usdBal } = await getBalance(walletOf, chatId); walletBal = usdBal } catch (e) {}
      const btns = fwd.enabled
        ? [[pc.alwaysForward], [pc.forwardBusy], [pc.forwardNoAnswer], ['📲 Change Forward-To Number'], [pc.disableForwarding]]
        : [[pc.alwaysForward], [pc.forwardBusy], [pc.forwardNoAnswer]]
      return send(chatId, phoneConfig.txt.forwardingStatus(num.phoneNumber, fwd, walletBal), k.of(btns))
    }
    const forwardTo = message.replace(/[^+\d]/g, '')
    if (!forwardTo || forwardTo.length < 7) return send(chatId, phoneConfig.getMsg(info?.userLanguage).enterValidPhone)

    // ── Block premium-rate prefixes ──
    if (phoneConfig.isBlockedPrefix(forwardTo)) {
      return send(chatId, t.fwdBlocked(forwardTo), { parse_mode: 'HTML' })
    }

    // ── Re-check wallet balance ──
    let walletBal = 0
    try { const { usdBal } = await getBalance(walletOf, chatId); walletBal = usdBal } catch (e) {}
    if (walletBal < phoneConfig.CALL_FORWARDING_RATE_MIN) {
      send(chatId, t.fwdInsufficientBalance(walletBal, phoneConfig.CALL_FORWARDING_RATE_MIN), { parse_mode: 'HTML' })
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }

    // ── Validate destination is routable via Telnyx ──
    send(chatId, t.fwdValidating)
    const validation = await telnyxApi.validateForwardingDestination(forwardTo)
    if (!validation.valid) {
      return send(chatId, t.fwdNotRoutable(forwardTo), { parse_mode: 'HTML' })
    }

    const mode = info?.cpForwardMode || 'always'
    await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'callForwarding', { enabled: true, mode, forwardTo, ringTimeout: 25 })
    num.features.callForwarding = { enabled: true, mode, forwardTo, ringTimeout: 25 }
    await saveInfo('cpActiveNumber', num)
    const modeLabel = mode === 'always' ? 'Always Forward' : mode === 'busy' ? 'Forward When Busy' : 'Forward If No Answer'
    send(chatId, phoneConfig.txt.forwardingUpdated(num.phoneNumber, forwardTo, modeLabel, walletBal), { parse_mode: 'HTML' })
    set(state, chatId, 'action', a.cpManageNumber)
    return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
  }

  // ━━━ SMS SETTINGS ━━━
  if (action === a.cpSmsSettings) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    const smsConf = num.features?.smsForwarding || {}
    // Toggle Telegram
    if (message.startsWith('📲 SMS to Telegram')) {
      const newState = smsConf.toTelegram === false
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'smsForwarding', { ...smsConf, toTelegram: newState })
      num.features.smsForwarding = { ...smsConf, toTelegram: newState }
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.smsToggled('📲 SMS to Telegram', newState))
      const tgLabel = `📲 SMS to Telegram ${newState ? '✅ ON' : '❌ OFF'}`
      const smsBtns = [[tgLabel]]
      if (phoneConfig.canAccessFeature(num.plan, 'smsToEmail')) {
        smsBtns.push([`📧 SMS to Email ${smsConf.toEmail ? '✅ ' + smsConf.toEmail : '❌ OFF'}`])
      } else {
        smsBtns.push([`🔒 SMS to Email (Pro+)`])
      }
      if (phoneConfig.canAccessFeature(num.plan, 'smsWebhook')) {
        smsBtns.push([`🔗 Webhook URL ${smsConf.webhookUrl ? '✅ Set' : '❌ Not Set'}`])
      } else {
        smsBtns.push([`🔒 Webhook URL (Pro+)`])
      }
      return send(chatId, phoneConfig.txt.smsSettingsMenu(num.phoneNumber, { ...smsConf, toTelegram: newState }, num.plan), k.of(smsBtns))
    }
    // Locked features — show upgrade message
    if (message.startsWith('🔒 SMS to Email')) {
      return send(chatId, phoneConfig.upgradeMessage('smsToEmail', num.plan))
    }
    if (message.startsWith('🔒 Webhook URL')) {
      return send(chatId, phoneConfig.upgradeMessage('smsWebhook', num.plan))
    }
    // Email (gated)
    if (message.startsWith('📧 SMS to Email')) {
      if (!phoneConfig.canAccessFeature(num.plan, 'smsToEmail')) {
        return send(chatId, phoneConfig.upgradeMessage('smsToEmail', num.plan))
      }
      set(state, chatId, 'action', a.cpEnterEmail)
      return send(chatId, phoneConfig.txt.enterEmail)
    }
    // Webhook (gated)
    if (message.startsWith('🔗 Webhook URL')) {
      if (!phoneConfig.canAccessFeature(num.plan, 'smsWebhook')) {
        return send(chatId, phoneConfig.upgradeMessage('smsWebhook', num.plan))
      }
      set(state, chatId, 'action', a.cpEnterWebhook)
      return send(chatId, phoneConfig.txt.enterWebhook)
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }
  if (action === a.cpEnterEmail) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSmsSettings)
      const smsConf = num.features?.smsForwarding || {}
      const tgLabel = `📲 SMS to Telegram ${smsConf.toTelegram !== false ? '✅ ON' : '❌ OFF'}`
      const emLabel = `📧 SMS to Email ${smsConf.toEmail ? '✅ ' + smsConf.toEmail : '❌ OFF'}`
      const whLabel = `🔗 Webhook URL ${smsConf.webhookUrl ? '✅ Set' : '❌ Not Set'}`
      return send(chatId, phoneConfig.txt.smsSettingsMenu(num.phoneNumber, smsConf), k.of([[tgLabel], [emLabel], [whLabel]]))
    }
    if (!isValidEmail(message)) return send(chatId, phoneConfig.getMsg(info?.userLanguage).enterValidEmail)
    const smsConf = num.features?.smsForwarding || {}
    await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'smsForwarding', { ...smsConf, toEmail: message })
    num.features.smsForwarding = { ...smsConf, toEmail: message }
    await saveInfo('cpActiveNumber', num)
    send(chatId, phoneConfig.txt.emailSet(message))
    set(state, chatId, 'action', a.cpManageNumber)
    return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
  }
  if (action === a.cpEnterWebhook) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpSmsSettings)
      const smsConf = num.features?.smsForwarding || {}
      const tgLabel = `📲 SMS to Telegram ${smsConf.toTelegram !== false ? '✅ ON' : '❌ OFF'}`
      const emLabel = `📧 SMS to Email ${smsConf.toEmail ? '✅ ' + smsConf.toEmail : '❌ OFF'}`
      const whLabel = `🔗 Webhook URL ${smsConf.webhookUrl ? '✅ Set' : '❌ Not Set'}`
      return send(chatId, phoneConfig.txt.smsSettingsMenu(num.phoneNumber, smsConf), k.of([[tgLabel], [emLabel], [whLabel]]))
    }
    if (!message.startsWith('http')) return send(chatId, 'Enter a valid URL starting with http:// or https://.')
    const smsConf = num.features?.smsForwarding || {}
    await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'smsForwarding', { ...smsConf, webhookUrl: message })
    num.features.smsForwarding = { ...smsConf, webhookUrl: message }
    await saveInfo('cpActiveNumber', num)
    send(chatId, phoneConfig.txt.webhookSet(message))
    set(state, chatId, 'action', a.cpManageNumber)
    return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
  }

  // ━━━ SMS INBOX ━━━
  if (action === a.cpSmsInbox) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.inboxRefresh) {
      await saveInfo('cpInboxPage', 1)
      return showSmsInbox(chatId, num, 1)
    }
    if (message === pc.inboxOlderPage) {
      const page = (info?.cpInboxPage || 1) + 1
      await saveInfo('cpInboxPage', page)
      return showSmsInbox(chatId, num, page)
    }
    if (message === pc.inboxNewerPage) {
      const page = Math.max(1, (info?.cpInboxPage || 1) - 1)
      await saveInfo('cpInboxPage', page)
      return showSmsInbox(chatId, num, page)
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ━━━ VOICEMAIL ━━━
  if (action === a.cpVoicemail) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.enableVoicemail) {
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', { enabled: true, greetingType: 'default', forwardToTelegram: true, forwardToEmail: null, ringTimeout: 25 })
      num.features.voicemail = { enabled: true, greetingType: 'default', forwardToTelegram: true, forwardToEmail: null, ringTimeout: 25 }
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.voicemailEnabled(num.phoneNumber))
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.disableVoicemail) {
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', { enabled: false })
      num.features.voicemail = { enabled: false }
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.voicemailDisabled(num.phoneNumber))
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    // Greeting management
    if (message === pc.vmGreeting || message === '🔊 Greeting') {
      set(state, chatId, 'action', a.cpVmGreeting)
      const vm = num.features?.voicemail || {}
      return send(chatId, phoneConfig.txt.vmGreetingMenu(num.phoneNumber, vm), k.of([
        [pc.vmCustomGreeting],
        [pc.vmDefaultGreeting],
        [pc.back]
      ]))
    }
    // Toggle VM to Telegram
    if (message.startsWith('📲 VM to Telegram')) {
      const vm = num.features?.voicemail || {}
      const newState = vm.forwardToTelegram === false
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', { ...vm, forwardToTelegram: newState })
      num.features.voicemail = { ...vm, forwardToTelegram: newState }
      await saveInfo('cpActiveNumber', num)
      send(chatId, `📲 Voicemail to Telegram is now ${newState ? '✅ ON' : '❌ OFF'}`)
    }
    // Ring time
    if (message.startsWith('⏰ Ring Time')) {
      return send(chatId, 'How long should the phone ring before voicemail?', k.of([['15s', '20s', '25s', '30s']]))
    }
    const ringMatch = message.match(/^(\d+)s$/)
    if (ringMatch) {
      const seconds = parseInt(ringMatch[1])
      const vm = num.features?.voicemail || {}
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', { ...vm, ringTimeout: seconds })
      num.features.voicemail = { ...vm, ringTimeout: seconds }
      await saveInfo('cpActiveNumber', num)
      send(chatId, `✅ Ring time updated to ${seconds} seconds.`)
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ━━━ VOICEMAIL GREETING ━━━
  if (action === a.cpVmGreeting) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpVoicemail)
      const vm = num.features?.voicemail || {}
      const btns = vm.enabled
        ? [['🔊 Greeting'],
           ['📲 VM to Telegram ' + (vm.forwardToTelegram !== false ? '✅ ON' : '❌ OFF')],
           ['📧 VM to Email ' + (vm.forwardToEmail ? '✅ ' + vm.forwardToEmail : '❌ OFF')],
           [`⏰ Ring Time: ${vm.ringTimeout || 25}s`],
           [pc.disableVoicemail]]
        : [[pc.enableVoicemail]]
      return send(chatId, phoneConfig.txt.voicemailMenu(num.phoneNumber, vm), k.of(btns))
    }
    if (message === pc.vmCustomGreeting) {
      set(state, chatId, 'action', a.cpVmAudioUpload)
      return send(chatId, phoneConfig.txt.vmSendAudioPrompt)
    }
    if (message === pc.vmDefaultGreeting) {
      const vm = num.features?.voicemail || {}
      vm.greetingType = 'default'
      vm.customAudioGreetingUrl = null
      vm.customGreetingText = null
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', vm)
      num.features.voicemail = vm
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.vmDefaultRestored)
      set(state, chatId, 'action', a.cpVoicemail)
      const btns = vm.enabled
        ? [['🔊 Greeting'],
           ['📲 VM to Telegram ' + (vm.forwardToTelegram !== false ? '✅ ON' : '❌ OFF')],
           ['📧 VM to Email ' + (vm.forwardToEmail ? '✅ ' + vm.forwardToEmail : '❌ OFF')],
           [`⏰ Ring Time: ${vm.ringTimeout || 25}s`],
           [pc.disableVoicemail]]
        : [[pc.enableVoicemail]]
      return send(chatId, phoneConfig.txt.voicemailMenu(num.phoneNumber, vm), k.of(btns))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ━━━ VOICEMAIL AUDIO UPLOAD ━━━
  if (action === a.cpVmAudioUpload) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpVmGreeting)
      const vm = num.features?.voicemail || {}
      return send(chatId, phoneConfig.txt.vmGreetingMenu(num.phoneNumber, vm), k.of([
        [pc.vmCustomGreeting],
        [pc.vmDefaultGreeting],
        [pc.back]
      ]))
    }
    // If user sends text instead of audio, treat as custom text greeting
    if (message && !rawMsg?.voice && !rawMsg?.audio) {
      const vm = num.features?.voicemail || {}
      vm.greetingType = 'custom'
      vm.customGreetingText = message
      vm.customAudioGreetingUrl = null
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', vm)
      num.features.voicemail = vm
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.vmTextGreetingSet(message))
      set(state, chatId, 'action', a.cpVoicemail)
      const btns = vm.enabled
        ? [['🔊 Greeting'],
           ['📲 VM to Telegram ' + (vm.forwardToTelegram !== false ? '✅ ON' : '❌ OFF')],
           ['📧 VM to Email ' + (vm.forwardToEmail ? '✅ ' + vm.forwardToEmail : '❌ OFF')],
           [`⏰ Ring Time: ${vm.ringTimeout || 25}s`],
           [pc.disableVoicemail]]
        : [[pc.enableVoicemail]]
      return send(chatId, phoneConfig.txt.voicemailMenu(num.phoneNumber, vm), k.of(btns))
    }
    return send(chatId, 'Send a voice message, audio file, or type a custom greeting text.')
  }

  // ━━━ CALL RECORDING (Business) ━━━
  if (action === a.cpCallRecording) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.enableRecording) {
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'recording', true)
      num.features = num.features || {}
      num.features.recording = true
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.recordingEnabled(num.phoneNumber))
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.disableRecording) {
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'recording', false)
      num.features = num.features || {}
      num.features.recording = false
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.recordingDisabled(num.phoneNumber))
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ━━━ IVR / AUTO-ATTENDANT (Business) ━━━
  if (action === a.cpIvr) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.enableIvr) {
      const ivrConf = { enabled: true, greeting: 'Thank you for calling. Please listen to the following options.', options: {} }
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'ivr', ivrConf)
      num.features = num.features || {}
      num.features.ivr = ivrConf
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.ivrEnabled(num.phoneNumber))
      return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
        [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
      ]))
    }
    if (message === pc.disableIvr) {
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'ivr', { enabled: false })
      num.features = num.features || {}
      num.features.ivr = { enabled: false }
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.ivrDisabled(num.phoneNumber))
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.ivrGreeting) {
      set(state, chatId, 'action', a.cpIvrGreeting)
      return send(chatId, phoneConfig.txt.ivrSetGreeting)
    }
    if (message === pc.ivrAddOption) {
      set(state, chatId, 'action', a.cpIvrAddOption)
      return send(chatId, phoneConfig.txt.ivrAddOption)
    }
    if (message === pc.ivrRemoveOption) {
      set(state, chatId, 'action', a.cpIvrRemoveOption)
      const ivrConf = num.features?.ivr || {}
      const keys = Object.keys(ivrConf.options || {})
      if (!keys.length) return send(chatId, 'No IVR options to remove.')
      return send(chatId, 'Which key do you want to remove?', k.of([keys.map(k2 => `Key ${k2}`)]))
    }
    if (message === pc.ivrViewOptions) {
      const ivrConf = num.features?.ivr || {}
      return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
        [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
      ]))
    }
    if (message === pc.ivrAnalytics) {
      const analytics = await getIvrAnalytics(num.phoneNumber, 30)
      return send(chatId, phoneConfig.txt.ivrAnalyticsReport(num.phoneNumber, analytics), k.of([
        [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
      ]))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // IVR Greeting input
  if (action === a.cpIvrGreeting) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpIvr)
      const ivrConf = num.features?.ivr || {}
      return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
        [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
      ]))
    }
    const ivrConf = num.features?.ivr || { enabled: true, options: {} }
    ivrConf.greeting = message
    await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'ivr', ivrConf)
    num.features.ivr = ivrConf
    await saveInfo('cpActiveNumber', num)
    send(chatId, phoneConfig.txt.ivrGreetingSet(message))
    set(state, chatId, 'action', a.cpIvr)
    return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
      [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
    ]))
  }

  // IVR Add Option input
  if (action === a.cpIvrAddOption) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpIvr)
      const ivrConf = num.features?.ivr || {}
      return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
        [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
      ]))
    }
    // Parse: KEY ACTION DESTINATION
    const parts = message.trim().split(/\s+/)
    if (parts.length < 2) return send(chatId, phoneConfig.txt.ivrInvalidFormat)
    const key = parts[0]
    const action2 = parts[1].toLowerCase()
    const destination = parts.slice(2).join(' ')

    if (!['forward', 'voicemail', 'message'].includes(action2)) {
      return send(chatId, phoneConfig.txt.ivrInvalidFormat)
    }
    if (action2 === 'forward' && (!destination || destination.replace(/[^+\d]/g, '').length < 7)) {
      return send(chatId, 'Please provide a valid forward-to number. E.g: <code>1 forward +14155551234</code>', { parse_mode: 'HTML' })
    }

    const ivrConf = num.features?.ivr || { enabled: true, greeting: '', options: {} }
    ivrConf.options = ivrConf.options || {}
    ivrConf.options[key] = {
      action: action2,
      forwardTo: action2 === 'forward' ? destination.replace(/[^+\d]/g, '') : null,
      message: action2 === 'message' ? destination : null,
    }
    await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'ivr', ivrConf)
    num.features.ivr = ivrConf
    await saveInfo('cpActiveNumber', num)
    send(chatId, phoneConfig.txt.ivrOptionAdded(key, action2, destination))
    set(state, chatId, 'action', a.cpIvr)
    return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
      [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
    ]))
  }

  // IVR Remove Option
  if (action === a.cpIvrRemoveOption) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpIvr)
      const ivrConf = num.features?.ivr || {}
      return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
        [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
      ]))
    }
    const keyMatch = message.match(/Key\s*(\S+)/)
    const key = keyMatch ? keyMatch[1] : message.trim()
    const ivrConf = num.features?.ivr || { enabled: true, options: {} }
    if (ivrConf.options?.[key]) {
      delete ivrConf.options[key]
      await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'ivr', ivrConf)
      num.features.ivr = ivrConf
      await saveInfo('cpActiveNumber', num)
      send(chatId, phoneConfig.txt.ivrOptionRemoved(key))
    } else {
      send(chatId, `❌ No option found for key "${key}".`)
    }
    set(state, chatId, 'action', a.cpIvr)
    return send(chatId, phoneConfig.txt.ivrMenu(num.phoneNumber, ivrConf), k.of([
      [pc.ivrGreeting], [pc.ivrAddOption], [pc.ivrRemoveOption], [pc.ivrViewOptions], [pc.ivrAnalytics], [pc.disableIvr]
    ]))
  }

  // ━━━ SIP CREDENTIALS ━━━
  if (action === a.cpSipCredentials) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.revealPassword) {
      const msg = await bot?.sendMessage(chatId, phoneConfig.txt.sipRevealed(num.sipPassword), { parse_mode: 'HTML' })
      // Auto-delete after 30 seconds
      if (msg?.message_id) {
        setTimeout(() => {
          bot?.deleteMessage(chatId, msg.message_id)?.catch(() => {})
        }, 30000)
      }
      return
    }
    if (message === pc.resetPassword) {
      const newPassword = phoneConfig.generateSipPassword()
      await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'sipPassword', newPassword)
      num.sipPassword = newPassword
      await saveInfo('cpActiveNumber', num)
      // Create new SIP credential on Telnyx
      if (telnyxResources.sipConnectionId) {
        await telnyxApi.createSIPCredential(telnyxResources.sipConnectionId, num.sipUsername, newPassword)
      }
      const msg = await bot?.sendMessage(chatId, phoneConfig.txt.sipReset(newPassword), { parse_mode: 'HTML' })
      if (msg?.message_id) {
        setTimeout(() => {
          bot?.deleteMessage(chatId, msg.message_id)?.catch(() => {})
        }, 60000)
      }
      return
    }
    if (message === pc.softphoneGuide) {
      return send(chatId, phoneConfig.txt.softphoneGuide(phoneConfig.SIP_DOMAIN), k.of([]))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }

  // ━━━ RENEW / CHANGE PLAN ━━━
  if (action === a.cpRenewPlan) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    // Toggle Auto-Renew
    if (message.startsWith('🔁 Auto-Renew')) {
      const newState = !num.autoRenew
      await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'autoRenew', newState)
      num.autoRenew = newState
      await saveInfo('cpActiveNumber', num)
      send(chatId, `🔁 Auto-Renew is now ${newState ? '✅ ON' : '❌ OFF'}`)
      const plan = phoneConfig.plans[num.plan] || { name: num.plan, price: num.planPrice }
      return send(chatId, phoneConfig.txt.renewMenu(num.phoneNumber, plan.name, num.planPrice, num.expiresAt, newState), k.of([
        ['🔄 Renew Now ($' + num.planPrice + ')'],
        [pc.changePlan],
        ['🔁 Auto-Renew: ' + (newState ? '✅ ON' : '❌ OFF')],
      ]))
    }
    // Renew Now
    if (message.startsWith('🔄 Renew Now')) {
      await saveInfo('cpPrice', num.planPrice)
      await saveInfo('cpPlanKey', num.plan)
      await saveInfo('cpSelectedNumber', num.phoneNumber)
      await saveInfo('price', num.planPrice)
      return goto['phone-pay']()
    }
    // Change Plan
    if (message === pc.changePlan) {
      set(state, chatId, 'action', a.cpChangePlan)
      const currentPlan = num.plan
      const btns = []
      if (currentPlan !== 'starter') btns.push([`💡 Downgrade to Starter — $${phoneConfig.PHONE_STARTER_PRICE}/mo`])
      if (currentPlan !== 'pro') btns.push([`⭐ ${currentPlan === 'starter' ? 'Upgrade' : 'Change'} to Pro — $${phoneConfig.PHONE_PRO_PRICE}/mo`])
      if (currentPlan !== 'business') btns.push([`👑 Upgrade to Business — $${phoneConfig.PHONE_BUSINESS_PRICE}/mo`])
      return send(chatId, `📦 Change plan for ${phoneConfig.formatPhone(num.phoneNumber)}\n\nCurrent: ${num.plan.charAt(0).toUpperCase() + num.plan.slice(1)} — $${num.planPrice}/mo`, k.of(btns))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectOption)
  }
  if (action === a.cpChangePlan) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpRenewPlan)
      const plan = phoneConfig.plans[num.plan] || { name: num.plan, price: num.planPrice }
      return send(chatId, phoneConfig.txt.renewMenu(num.phoneNumber, plan.name, num.planPrice, num.expiresAt, num.autoRenew), k.of([
        ['🔄 Renew Now ($' + num.planPrice + ')'],
        [pc.changePlan],
        ['🔁 Auto-Renew: ' + (num.autoRenew ? '✅ ON' : '❌ OFF')],
      ]))
    }

    // Check if this is a confirmation of a pending plan change
    if (message === '✅ Confirm Change' && info?.cpPendingPlan) {
      const newPlan = info.cpPendingPlan
      const oldPlan = num.plan
      const newPrice = phoneConfig.plans[newPlan].price
      await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'plan', newPlan)
      await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'planPrice', newPrice)
      num.plan = newPlan
      num.planPrice = newPrice

      // Auto-disable features the new plan doesn't support
      const downgradeNotices = []
      if (!phoneConfig.canAccessFeature(newPlan, 'sipCredentials') && !num.sipDisabled) {
        await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'sipDisabled', true)
        num.sipDisabled = true
        downgradeNotices.push('🔑 SIP Credentials have been disabled')
      }
      if (!phoneConfig.canAccessFeature(newPlan, 'ivr') && num.features?.ivr?.enabled) {
        await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'ivr', { enabled: false })
        num.features = num.features || {}
        num.features.ivr = { enabled: false }
        downgradeNotices.push('🤖 IVR / Auto-attendant has been disabled')
      }
      if (!phoneConfig.canAccessFeature(newPlan, 'callRecording') && num.features?.recording === true) {
        await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'recording', false)
        num.features = num.features || {}
        num.features.recording = false
        downgradeNotices.push('🔴 Call Recording has been disabled')
      }
      if (!phoneConfig.canAccessFeature(newPlan, 'voicemail') && num.features?.voicemail?.enabled) {
        await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'voicemail', { enabled: false })
        num.features = num.features || {}
        num.features.voicemail = { enabled: false }
        downgradeNotices.push('🎙️ Voicemail has been disabled')
      }
      if (!phoneConfig.canAccessFeature(newPlan, 'smsToEmail') && num.features?.smsForwarding?.toEmail) {
        const smsConf = num.features?.smsForwarding || {}
        smsConf.toEmail = null
        smsConf.webhookUrl = null
        await updatePhoneNumberFeature(phoneNumbersOf, chatId, num.phoneNumber, 'smsForwarding', smsConf)
        num.features.smsForwarding = smsConf
        downgradeNotices.push('📧 SMS to Email & Webhook have been disabled')
      }

      // Re-enable SIP if upgrading to a plan that supports it
      if (phoneConfig.canAccessFeature(newPlan, 'sipCredentials') && num.sipDisabled) {
        await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'sipDisabled', false)
        num.sipDisabled = false
      }

      await saveInfo('cpActiveNumber', num)
      await saveInfo('cpPendingPlan', null)
      let confirmMsg = `✅ Plan changed to <b>${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}</b> — $${newPrice}/mo`
      if (downgradeNotices.length > 0) {
        confirmMsg += `\n\n⚠️ <b>Features disabled:</b>\n` + downgradeNotices.join('\n')
      }
      send(chatId, confirmMsg)
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }

    let newPlan = null
    if (message.includes('Starter')) newPlan = 'starter'
    if (message.includes('Pro')) newPlan = 'pro'
    if (message.includes('Business')) newPlan = 'business'
    if (!newPlan) return send(chatId, phoneConfig.getMsg(info?.userLanguage).selectValidPlan)
    const oldPlan = num.plan

    // Check what features will be lost on downgrade
    const lostFeatures = []
    if (!phoneConfig.canAccessFeature(newPlan, 'sipCredentials') && phoneConfig.canAccessFeature(oldPlan, 'sipCredentials')) {
      lostFeatures.push('🔑 SIP Credentials')
    }
    if (!phoneConfig.canAccessFeature(newPlan, 'ivr') && phoneConfig.canAccessFeature(oldPlan, 'ivr')) {
      lostFeatures.push('🤖 IVR / Auto-attendant')
    }
    if (!phoneConfig.canAccessFeature(newPlan, 'callRecording') && phoneConfig.canAccessFeature(oldPlan, 'callRecording')) {
      lostFeatures.push('🔴 Call Recording')
    }
    if (!phoneConfig.canAccessFeature(newPlan, 'voicemail') && phoneConfig.canAccessFeature(oldPlan, 'voicemail')) {
      lostFeatures.push('🎙️ Voicemail')
    }
    if (!phoneConfig.canAccessFeature(newPlan, 'smsToEmail') && phoneConfig.canAccessFeature(oldPlan, 'smsToEmail')) {
      lostFeatures.push('📧 SMS to Email & Webhook')
    }

    // If downgrading with feature loss, show warning first
    if (lostFeatures.length > 0) {
      const newPrice = phoneConfig.plans[newPlan].price
      const oldPlanMinutes = phoneConfig.plans[oldPlan]?.minutes || 0
      const newPlanMinutes = phoneConfig.plans[newPlan]?.minutes || 0
      const oldPlanSms = phoneConfig.plans[oldPlan]?.sms || 0
      const newPlanSms = phoneConfig.plans[newPlan]?.sms || 0

      let warningMsg = `⚠️ <b>Downgrade Warning</b>\n\n`
      warningMsg += `${oldPlan.charAt(0).toUpperCase() + oldPlan.slice(1)} → <b>${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}</b> ($${newPrice}/mo)\n\n`
      warningMsg += `<b>Features you will lose:</b>\n${lostFeatures.join('\n')}\n\n`
      warningMsg += `<b>Limits change:</b>\n`
      warningMsg += `📞 Minutes: ${oldPlanMinutes} → ${newPlanMinutes}\n`
      warningMsg += `📩 SMS: ${oldPlanSms} → ${newPlanSms}\n\n`
      warningMsg += `These features will be <b>immediately disabled</b>. Continue?`

      await saveInfo('cpPendingPlan', newPlan)
      return send(chatId, warningMsg, k.of([['✅ Confirm Change', pc.back]]))
    }

    // No feature loss (upgrade or same-tier) — show what they'll gain and confirm
    const newPrice = phoneConfig.plans[newPlan].price
    const gainedFeatures = []
    if (phoneConfig.canAccessFeature(newPlan, 'sipCredentials') && !phoneConfig.canAccessFeature(oldPlan, 'sipCredentials')) {
      gainedFeatures.push('🔑 SIP Credentials')
    }
    if (phoneConfig.canAccessFeature(newPlan, 'voicemail') && !phoneConfig.canAccessFeature(oldPlan, 'voicemail')) {
      gainedFeatures.push('🎙️ Voicemail')
    }
    if (phoneConfig.canAccessFeature(newPlan, 'smsToEmail') && !phoneConfig.canAccessFeature(oldPlan, 'smsToEmail')) {
      gainedFeatures.push('📧 SMS to Email & Webhook')
    }
    if (phoneConfig.canAccessFeature(newPlan, 'callRecording') && !phoneConfig.canAccessFeature(oldPlan, 'callRecording')) {
      gainedFeatures.push('🔴 Call Recording')
    }
    if (phoneConfig.canAccessFeature(newPlan, 'ivr') && !phoneConfig.canAccessFeature(oldPlan, 'ivr')) {
      gainedFeatures.push('🤖 IVR / Auto-attendant')
    }

    const oldPlanObj = phoneConfig.plans[oldPlan]
    const newPlanObj = phoneConfig.plans[newPlan]
    let upgradeMsg = `⬆️ <b>Upgrade Preview</b>\n\n`
    upgradeMsg += `${oldPlan.charAt(0).toUpperCase() + oldPlan.slice(1)} → <b>${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)}</b> ($${newPrice}/mo)\n\n`
    if (gainedFeatures.length > 0) {
      upgradeMsg += `<b>New features you'll unlock:</b>\n${gainedFeatures.join('\n')}\n\n`
    }
    upgradeMsg += `<b>Limits upgrade:</b>\n`
    upgradeMsg += `📞 Minutes: ${oldPlanObj?.minutes || 0} → ${newPlanObj?.minutes === 'Unlimited' ? 'Unlimited' : newPlanObj?.minutes || 0}\n`
    upgradeMsg += `📩 SMS: ${oldPlanObj?.sms || 0} → ${newPlanObj?.sms || 0}\n\n`
    upgradeMsg += `Confirm upgrade?`

    await saveInfo('cpPendingPlan', newPlan)
    return send(chatId, upgradeMsg, k.of([['✅ Confirm Change', pc.back]]))
  }

  // ━━━ RELEASE NUMBER ━━━
  if (action === a.cpReleaseConfirm) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === pc.noKeep || message === t.back) {
      set(state, chatId, 'action', a.cpManageNumber)
      return send(chatId, phoneConfig.txt.manageNumber(num), k.of(buildManageMenu(num)))
    }
    if (message === pc.yesRelease) {
      const last4 = num.phoneNumber.replace(/\D/g, '').slice(-4)
      set(state, chatId, 'action', a.cpReleaseDigits)
      return send(chatId, phoneConfig.txt.releaseConfirmDigits(last4))
    }
    return send(chatId, phoneConfig.getMsg(info?.userLanguage).confirmOrCancel)
  }
  if (action === a.cpReleaseDigits) {
    const pc = phoneConfig.btn
    const num = info?.cpActiveNumber
    if (!num) return goto.submenu5()
    if (message === t.back || message === pc.back) {
      set(state, chatId, 'action', a.cpReleaseConfirm)
      return send(chatId, phoneConfig.txt.releaseConfirm(num.phoneNumber), k.of([[pc.yesRelease, pc.noKeep]]))
    }
    const last4 = num.phoneNumber.replace(/\D/g, '').slice(-4)
    if (message !== last4) return send(chatId, phoneConfig.getMsg(info?.userLanguage).typeLast4(last4))

    // Release on provider
    if (num.telnyxOrderId) {
      const ok = await telnyxApi.releaseNumber(num.telnyxOrderId)
      if (!ok) await telnyxApi.releaseByPhoneNumber(num.phoneNumber)
    } else {
      await telnyxApi.releaseByPhoneNumber(num.phoneNumber)
    }

    // Update DB
    await updatePhoneNumberField(phoneNumbersOf, chatId, num.phoneNumber, 'status', 'released')
    const name = await get(nameOf, chatId)
    notifyGroup(phoneConfig.txt.adminRelease(maskName(name), num.phoneNumber, num.plan))
    
    // Log transaction
    await phoneTransactions.insertOne({
      chatId, phoneNumber: num.phoneNumber,
      action: 'release', plan: num.plan,
      amount: 0, paymentMethod: 'none',
      timestamp: new Date().toISOString(),
    })

    send(chatId, phoneConfig.txt.released(num.phoneNumber), trans('o'))
    return
  }
  if (action === a.phoneNumberLeads) {
    const phoneNumberLeads = trans('phoneNumberLeads')
    if (phoneNumberLeads[1] === message) return goto.validatorSelectCountry()
    if (phoneNumberLeads[0] === message) return goto.targetSelectTarget()

    return send(chatId, t.what)
  }
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TARGET LEADS HANDLERS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (action === a.targetSelectTarget) {
    if (message === t.back) return goto.displayMainMenuButtons ? goto.displayMainMenuButtons() : send(chatId, t.userPressedBtn(message), isAdmin(chatId) ? aO : trans('o'))
    const validateBtn = trans('phoneNumberLeads')[1] || '✅📲 Validate PhoneLeads'
    if (message === validateBtn) return goto.validatorSelectCountry()
    if (message === '📝 Request Custom Target') return goto.customLeadRequestName()
    if (!targetLeadsTargets.includes(message)) return send(chatId, t.what)
    await saveInfo('targetName', message)
    await saveInfo('country', 'USA')
    return goto.targetSelectCity()
  }
  if (action === a.targetSelectCity) {
    if (message === t.back) return goto.targetSelectTarget()
    const target = info?.targetName
    const validCities = ['All Cities', ...targetLeadsCities(target)]
    if (!validCities.includes(message)) return send(chatId, t.what)
    await saveInfo('targetCity', message)
    if (message === 'All Cities') {
      const allCodes = targetLeadsAreaCodes(target, 'All Cities')
      await saveInfo('areaCode', 'Mixed Area Codes')
      await saveInfo('targetAreaCodes', allCodes)
      await saveInfo('cameFrom', a.targetSelectAreaCode)
      return goto.buyLeadsSelectCarrier()
    }
    return goto.targetSelectAreaCode()
  }
  if (action === a.targetSelectAreaCode) {
    if (message === t.back) return goto.targetSelectCity()
    const target = info?.targetName
    const city = info?.targetCity
    const validButtons = targetLeadsAreaCodeButtons(target, city)
    if (!validButtons.includes(message)) return send(chatId, t.what)

    let areaCodes
    if (message === 'Mixed Area Codes') {
      areaCodes = targetLeadsAreaCodes(target, city)
    } else {
      areaCodes = [parse('1', message)]
    }
    await saveInfo('areaCode', message === 'Mixed Area Codes' ? message : parse('1', message))
    await saveInfo('targetAreaCodes', areaCodes)
    await saveInfo('cameFrom', a.targetSelectAreaCode)
    return goto.buyLeadsSelectCarrier()
  }
  if (action === a.targetLeadsConfirm) {
    if (message === t.back) return goto.buyLeadsSelectAmount()
    if (message === '🎟️ Apply Coupon') {
      return goto.askCoupon(a.buyLeadsSelectFormat)
    }
    if (message.startsWith('✅ Pay')) {
      const price = info?.couponApplied ? info?.newPrice : info?.price
      const { usdBal } = await getBalance(walletOf, chatId)
      if (usdBal < price) return send(chatId, t.walletBalanceLow, k.of([u.deposit]))
      await saveInfo('coin', u.usd)
      await saveInfo('couponApplied', info?.couponApplied || false)
      return walletOk[a.buyLeadsSelectFormat](u.usd)
    }
    return send(chatId, t.what)
  }
  // ═══════════════════════════════════════════════════
  // Custom Lead Request Flow
  // ═══════════════════════════════════════════════════
  if (action === a.customLeadRequestName) {
    if (message === (t.backButton || '⬅️ Back')) return goto.targetSelectTarget()
    if (message.length < 2 || message.length > 100) return send(chatId, '⚠️ Please enter a valid institution name (2-100 characters).')
    await saveInfo('customLeadTarget', message)
    return goto.customLeadRequestCity()
  }
  if (action === a.customLeadRequestCity) {
    if (message === (t.backButton || '⬅️ Back')) return goto.customLeadRequestName()
    if (message.length < 2 || message.length > 100) return send(chatId, '⚠️ Please enter a valid city name.')
    await saveInfo('customLeadCity', message)
    return goto.customLeadRequestDetails()
  }
  if (action === a.customLeadRequestDetails) {
    if (message === (t.backButton || '⬅️ Back')) return goto.customLeadRequestCity()
    const details = message === 'None' ? '' : message
    const target = info?.customLeadTarget
    const city = info?.customLeadCity
    const name = await get(nameOf, chatId)

    // Save request to DB
    const requestId = nanoid()
    await set(leadRequests, requestId, {
      chatId,
      username: name || msg?.from?.username || 'unknown',
      target,
      city,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Notify admin — direct message only, not groups
    send(TELEGRAM_ADMIN_CHAT_ID, `📝 <b>New Lead Request</b>\n\nFrom: <b>${name || 'unknown'}</b> (${chatId})\n@${msg?.from?.username || 'no_username'}\n\n🎯 Target: <b>${target}</b>\n🏙️ Area: <b>${city}</b>\n📋 Details: ${details || '<i>none</i>'}\n\nID: <code>${requestId}</code>`, { parse_mode: 'HTML' })

    // Confirm to user
    set(state, chatId, 'action', 'none')
    send(chatId, `✅ <b>Request Submitted!</b>\n\n🎯 Target: <b>${target}</b>\n🏙️ Area: <b>${city}</b>${details ? `\n📋 Details: ${details}` : ''}\n\nOur team will review your request and notify you once these leads are available. Thank you!`, { parse_mode: 'HTML', ...trans('o') })
    log(`[LeadRequest] ${chatId} requested: ${target} — ${city} (${details || 'no details'})`)
    return
  }
  if (action === a.buyLeadsSelectCountry) {
    if (message === t.back) goto.phoneNumberLeads()
    if (!buyLeadsSelectCountry.includes(message)) return send(chatId, t.what)
    if (areasOfCountry[message] && Object.keys(areasOfCountry[message]).length === 0) return send(chatId, t.comingSoon)
    saveInfo('country', message)
    return goto.buyLeadsSelectSmsVoice()
  }
  if (action === a.buyLeadsSelectSmsVoice) {
    if (message === t.back) return goto.buyLeadsSelectCountry()
    const buyLeadsSelectSmsVoice = trans('buyLeadsSelectSmsVoice')
    if (buyLeadsSelectSmsVoice[1] === message) return send(chatId, t.comingSoon)
    if (!buyLeadsSelectSmsVoice.includes(message)) return send(chatId, t.what)
    saveInfo('smsVoice', message)
    saveInfo('cameFrom', a.buyLeadsSelectSmsVoice)
    if (['Australia'].includes(info?.country)) return goto.buyLeadsSelectCarrier()
    if (['USA', 'Canada'].includes(info?.country)) return goto.buyLeadsSelectArea()
    return goto.buyLeadsSelectAreaCode()
  }
  if (action === a.buyLeadsSelectArea) {
    if (message === t.back) return goto.buyLeadsSelectSmsVoice()
    if (!buyLeadsSelectArea(info?.country).includes(message)) return send(chatId, t.what)
    await saveInfo('area', message)
    saveInfo('cameFrom', a.buyLeadsSelectArea)
    return goto.buyLeadsSelectAreaCode()
  }
  if (action === a.buyLeadsSelectAreaCode) {
    if (message === t.back) return ['USA', 'Canada'].includes(info?.country) ? goto.buyLeadsSelectArea() : goto.buyLeadsSelectSmsVoice()
    const areaCodes = buyLeadsSelectAreaCode(
      info?.country,
      ['USA', 'Canada'].includes(info?.country) ? info?.area : 'Area Codes',
    )
    if (!areaCodes.includes(message)) return send(chatId, t.what)

    let cc = countryCodeOf[info?.country]
    saveInfo('areaCode', message === 'Mixed Area Codes' ? message : parse(cc, message))

    return goto.buyLeadsSelectCarrier()
  }
  if (action === a.buyLeadsSelectCarrier) {
    if (message === t.back) {
      if (info?.targetName) {
        return info?.targetCity === 'All Cities' ? goto.targetSelectCity() : goto.targetSelectAreaCode()
      }
      return ['Australia'].includes(info?.country) ? goto.buyLeadsSelectSmsVoice() : goto.buyLeadsSelectAreaCode()
    }
    if (!buyLeadsSelectCarrier(info?.country).includes(message)) return send(chatId, t.what)
    saveInfo('carrier', message)
    saveInfo('cameFrom', a.buyLeadsSelectCarrier)
    if (['USA'].includes(info?.country)) return goto.buyLeadsSelectCnam()
    return goto.buyLeadsSelectAmount()
  }
  if (action === a.buyLeadsSelectCnam) {
    if (message === t.back) return goto.buyLeadsSelectCarrier()
    if (!buyLeadsSelectCnam.includes(message)) return send(chatId, t.what)
    saveInfo('cnam', message === t.yes)
    saveInfo('cameFrom', a.buyLeadsSelectCnam)
    return goto.buyLeadsSelectAmount()
  }
  if (action === a.buyLeadsSelectAmount) {
    if (message === t.back) return goto?.[info?.cameFrom]()

    const amount = Number(message)
    if (chatId === 6687923716) {
      if (isNaN(amount)) return send(chatId, t.whatNum)
    } else if (
      isNaN(amount) ||
      amount < Number(buyLeadsSelectAmount[0]) ||
      amount > Number(buyLeadsSelectAmount[buyLeadsSelectAmount.length - 1])
    )
      return send(chatId, t.whatNum)

    saveInfo('amount', amount)
    let cnam = info?.country === 'USA' ? info?.cnam : false
    const price = amount * RATE_LEAD + (cnam ? amount * RATE_CNAM : 0)
    await saveInfo('price', price)
    if (info?.targetName) {
      await saveInfo('format', 'International Format')
      await saveInfo('lastStep', a.buyLeadsSelectFormat)
      return goto.targetLeadsConfirm()
    }
    return goto.buyLeadsSelectFormat()
  }
  if (action === a.buyLeadsSelectFormat) {
    if (message === t.back) return goto.buyLeadsSelectAmount()
    const buyLeadsSelectFormatType = trans('buyLeadsSelectFormat')
    if (!buyLeadsSelectFormatType.includes(message)) return send(chatId, t.what)
    const formatType = trans('selectFormatOf') 
    saveInfo('format', formatType[message])
    return goto.askCoupon(a.buyLeadsSelectFormat)
  }
  if (action === a.askCoupon + a.buyLeadsSelectFormat) {
    if (message === t.back) {
      if (info?.targetName) return goto.targetLeadsConfirm()
      return goto.buyLeadsSelectFormat()
    }
    if (message === t.skip) {
      saveInfo('lastStep', a.buyLeadsSelectFormat)
      await saveInfo('couponApplied', false)
      if (info?.targetName) return goto.targetLeadsConfirm()
      return goto.walletSelectCurrency()
    }

    const { price } = info

    const coupon = message.toUpperCase()
    const couponResult = await resolveCoupon(coupon, chatId)

    if (!couponResult) return send(chatId, t.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')

    const newPrice = price - (price * couponResult.discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)

    await saveInfo('lastStep', a.buyLeadsSelectFormat)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)

    if (info?.targetName) return goto.targetLeadsConfirm()
    return goto.walletSelectCurrency()
  }

  //phone number validator
  if (action === a.validatorSelectCountry) {
    if (message === t.back) return goto.phoneNumberLeads()
    if (!validatorSelectCountry.includes(message)) return send(chatId, t.what)
    saveInfo('country', message)
    return goto.validatorPhoneNumber()
  }

  // get phone on file
  if (action === a.validatorPhoneNumber) {
    if (message === t.back) return goto.validatorSelectCountry()
    let content

    if (msg.document) {
      try {
        const fileLink = await bot?.getFileLink(msg.document.file_id)
        content = (await axios.get(fileLink, { responseType: 'text' }))?.data
      } catch (error) {
        console.error('Error:', error.message)
        return send(chatId, t.fileError)
      }
    } else {
      content = message
    }

    let cc = countryCodeOf[info?.country]
    const { phones, diff } = extractPhoneNumbers(content, cc)
    if (phones < diff) return send(chatId, t.validatorErrorFileData) // good phones are less than bad ones
    if (phones.length === 0) return send(chatId, t.validatorErrorNoPhonesFound)
    await saveInfo('phones', phones)
    saveInfo('amount', phones.length)

    return goto.validatorSelectSmsVoice()
  }

  if (action === a.validatorSelectSmsVoice) {
    if (message === t.back) return goto.validatorPhoneNumber()
    const validatorSelectSmsVoice = trans('validatorSelectSmsVoice')
    if (validatorSelectSmsVoice[1] === message) return send(chatId, t.comingSoon)
    if (!validatorSelectSmsVoice.includes(message)) return send(chatId, t.what)
    saveInfo('smsVoice', message)
    return goto.validatorSelectCarrier() //////
  }

  if (action === a.validatorSelectCarrier) {
    if (message === t.back) return goto.validatorSelectSmsVoice()
    if (!validatorSelectCarrier(info?.country).includes(message)) return send(chatId, t.what)
    saveInfo('carrier', message)
    saveInfo('history', [...(info?.history || []), a.validatorSelectCarrier])
    if (!['USA'].includes(info?.country) && info?.phones.length < 2000) {
      return goto.validatorSelectFormat()
    }
    if (!['USA'].includes(info?.country)) return goto.validatorSelectAmount()
    return goto.validatorSelectCnam()
  }
  if (action === a.validatorSelectCnam) {
    if (message === t.back) return goBack()
    const validatorSelectCnam = trans('validatorSelectCnam')
    if (!validatorSelectCnam.includes(message)) return send(chatId, t.what)
    saveInfo('cnam', message === t.yes)
    saveInfo('history', [...(info?.history || []), a.validatorSelectCnam])

    if (info?.phones.length < 2000) {
      let cnam = info?.country === 'USA' ? info?.cnam : false
      const price = info?.amount * RATE_LEAD_VALIDATOR + (cnam ? info?.amount * RATE_CNAM_VALIDATOR : 0)
      saveInfo('price', price)

      return goto.validatorSelectFormat()
    }

    return goto.validatorSelectAmount()
  }

  if (action === a.validatorSelectAmount) {
    if (message === t.back) return goBack()
    let amount = message
    if (message.toLowerCase() === 'all') {
      amount = info?.phones.length
    }
    if (isNaN(amount)) return send(chatId, t.ammountIncorrect)
    saveInfo('amount', Number(amount))
    saveInfo('history', [...(info?.history || []), a.validatorSelectAmount])
    let cnam = info?.country === 'USA' ? info?.cnam : false
    const price = amount * RATE_LEAD_VALIDATOR + (cnam ? amount * RATE_CNAM_VALIDATOR : 0)
    saveInfo('price', price)
    return goto.validatorSelectFormat()
  }
  if (action === a.validatorSelectFormat) {
    if (message === t.back) return goBack()
    const validatorSelectFormatType = trans('validatorSelectFormat')
    if (!validatorSelectFormatType.includes(message)) return send(chatId, t.what)
    const formatType = trans('selectFormatOf') 
    saveInfo('format', formatType[message])
    return goto.askCoupon(a.validatorSelectFormat)
  }
  if (action === a.askCoupon + a.validatorSelectFormat) {
    if (message === t.back) return goto.validatorSelectFormat()

    // Check for free USA validations before going to wallet
    const _checkFreeValidation = async () => {
      if (info?.country === 'USA' && (await isSubscribed(chatId))) {
        const freeRemaining = (await get(freeValidationsAvailableFor, chatId)) || 0
        if (freeRemaining >= info?.amount) {
          return 'full' // all validations covered by free quota
        }
        if (freeRemaining > 0) {
          return 'partial' // some free, rest must be paid
        }
      }
      return false
    }

    if (message === t.skip) {
      saveInfo('lastStep', a.validatorSelectFormat)
      await saveInfo('couponApplied', false)
      const freeCheck = await _checkFreeValidation()
      if (freeCheck === 'full') {
        return goto.useFreeValidation()
      }
      if (freeCheck === 'partial') {
        return goto.usePartialFreeValidation()
      }
      return goto.walletSelectCurrency()
    }

    const { price } = info

    const coupon = message.toUpperCase()
    const couponResult = await resolveCoupon(coupon, chatId)
    if (!couponResult) return send(chatId, t.couponInvalid)
    if (couponResult.error === 'already_used') return send(chatId, '⚠️ You have already used this coupon today.')

    const newPrice = price - (price * couponResult.discount) / 100
    await saveInfo('newPrice', newPrice)
    await saveInfo('couponApplied', true)

    await saveInfo('lastStep', a.validatorSelectFormat)
    if (couponResult.type === 'daily') await dailyCouponSystem.markCouponUsed(couponResult.code, chatId)

    const freeCheck2 = await _checkFreeValidation()
    if (freeCheck2 === 'full') {
      return goto.useFreeValidation()
    }
    if (freeCheck2 === 'partial') {
      return goto.usePartialFreeValidation()
    }
    return goto.walletSelectCurrency()
  }

  if (message === user.joinChannel) {
    return send(chatId, t.joinChannel)
  }

  if (message === user.viewPlan) {
    // ── Aggregate all subscriptions ──
    let sections = []
    let hasAnySub = false

    // 1. Bot Subscription (Daily/Weekly/Monthly plan)
    const subscribedPlan = await get(planOf, chatId)
    if (subscribedPlan) {
      const rawTime = await get(planEndingTime, chatId)
      const timeEnd = new Date(rawTime)
      const MAX_REASONABLE_MS = 31 * 86400 * 1000
      if (rawTime > Date.now() + MAX_REASONABLE_MS) {
        log(`[viewPlan] Anomalous planEndingTime for chatId ${chatId}: ${timeEnd.toISOString()} — auto-expiring`)
        set(planEndingTime, chatId, 0)
        sections.push(`📦 <b>Bot Plan:</b> ${subscribedPlan} — ❌ Expired`)
      } else if (await isSubscribed(chatId)) {
        const daysLeft = Math.ceil((rawTime - Date.now()) / 86400000)
        sections.push(`📦 <b>Bot Plan:</b> ${subscribedPlan}\n   ✅ Active · Expires ${timeEnd.toLocaleDateString()} (${daysLeft}d left)`)
        hasAnySub = true
      } else {
        sections.push(`📦 <b>Bot Plan:</b> ${subscribedPlan} — ❌ Expired ${timeEnd.toLocaleDateString()}`)
      }
    }

    // 2. Cloud Phone Numbers
    try {
      const phoneData = await get(phoneNumbersOf, chatId)
      const numbers = phoneData?.numbers || []
      const activeNums = numbers.filter(n => n.status === 'active')
      if (activeNums.length > 0) {
        hasAnySub = true
        let cpText = `📞 <b>CloudPhone:</b> ${activeNums.length} number${activeNums.length > 1 ? 's' : ''}`
        activeNums.forEach(n => {
          const plan = n.plan ? n.plan.charAt(0).toUpperCase() + n.plan.slice(1) : '—'
          const exp = n.expiresAt ? new Date(n.expiresAt).toLocaleDateString() : '—'
          const dLeft = n.expiresAt ? Math.ceil((new Date(n.expiresAt) - Date.now()) / 86400000) : 0
          cpText += `\n   ${phoneConfig.formatPhone(n.phoneNumber)} · ${plan} · ${exp}${dLeft > 0 ? ` (${dLeft}d)` : ''}`
        })
        sections.push(cpText)
      }
    } catch (e) {}

    // 3. VPS Plans
    try {
      const vpsData = await vpsPlansOf.findOne({ _id: String(chatId) })
      const vpsPlans = vpsData?.val?.plans || vpsData?.plans || []
      if (vpsPlans.length > 0) {
        let vpsText = `🖥️ <b>VPS:</b> ${vpsPlans.length} server${vpsPlans.length > 1 ? 's' : ''}`
        vpsPlans.forEach(v => {
          const exp = v.expiresAt ? new Date(v.expiresAt).toLocaleDateString() : '—'
          const name = v.name || v.hostname || v.planType || 'VPS'
          const status = v.status === 'active' ? '✅' : '❌'
          vpsText += `\n   ${status} ${name} · ${exp}`
          hasAnySub = true
        })
        sections.push(vpsText)
      }
    } catch (e) {}

    // 4. Hosting Plans
    try {
      const hostingData = info?.userVPSDetails
      if (hostingData && hostingData.status === 'active') {
        const exp = hostingData.expiresAt ? new Date(hostingData.expiresAt).toLocaleDateString() : '—'
        sections.push(`🌐 <b>Hosting:</b> ${hostingData.planType || hostingData.type || 'Plan'}\n   ✅ Active · Expires ${exp}`)
        hasAnySub = true
      }
    } catch (e) {}

    if (sections.length === 0) {
      send(chatId, t.planNotSubscriped)
      return
    }

    const header = hasAnySub ? '📋 <b>My Subscriptions</b>\n' : '📋 <b>My Subscriptions</b>\n\n<i>No active subscriptions.</i>\n'
    send(chatId, header + '\n' + sections.join('\n\n'), { parse_mode: 'HTML' })
    return
  }
  if (message === user.becomeReseller) {
    return send(chatId, t.becomeReseller)
  }
  if (message === user.viewShortLinks) {
    const links = await getShortLinks(chatId)
    if (links.length === 0) {
      send(chatId, t.noShortenedUrlLink)
      return
    }

    const linksText = formatLinks(links.slice(-20)).join('\n\n')
    send(chatId, t.shortenedLinkText(linksText))
    return
  }
  if (message === user.viewDomainNames) {
    const purchasedDomains = await getPurchasedDomains(chatId)
    if (purchasedDomains.length === 0) {
      send(chatId, t.noDomainRegistered)
      return
    }

    const domainsText = purchasedDomains.join('\n')
    send(chatId, t.registeredDomainList(domainsText))
    return
  }
  if (message === 'Backup Data') {
    if (!isDeveloper(chatId)) return send(chatId, 'not authorized')

    backupTheData()
    return send(chatId, 'Backup created successfully.')
  }
  if (message === 'Restore Data') {
    if (!isDeveloper(chatId)) return send(chatId, 'not authorized')

    restoreData()
    return send(chatId, 'Data restored successfully.')
  }
  if (message === admin.viewUsers) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')

    const users = await getUsers()
    return send(chatId, `Users: ${users.length}\n${users.join('\n')}`)
  }
  if (message === admin.viewAnalytics) {
    if (!isAdmin(chatId)) return send(chatId, 'not authorized')

    const analyticsData = await getAnalytics()
    send(chatId, `Analytics Data:\n${analyticsData.join('\n')}`)
    return
  }
  if (message === user.freeTrialAvailable) {
    sendQr(
      bot,
      chatId,
      `${chatId}`,
      t.scanQrOrUseChat(chatId),
    )
    return send(chatId, t.freeTrialAvailable)
  }
  if (action === 'listen_reset_login') {
    if (message === t.yes) {
      const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
      await set(loginCountOf, Number(chatId), { loginCount: loginData.loginCount, canLogin: true })
      send(chatId, t.resetLoginAdmit, trans('o'))
    } else {
      send(chatId, t.resetLoginDeny, trans('o'))
    }
    return
  }

  // Fallback: unrecognized message — reset user state and show fresh main keyboard
  // This handles users with stale keyboards from old bot versions
  set(state, chatId, 'action', 'none')
  log(`[reset] Unrecognized message from ${chatId}: "${message}" (was action: ${action || 'none'}). Resetting to main menu.`)
  return send(chatId, t.what + '\n' + t.welcome, isAdmin(chatId) ? aO : trans('o'))
})?.then(a => console.log(a))?.catch(b => console.log('the error: ', b))

async function getPurchasedDomains(chatId) {
  let ans = await get(domainsOf, chatId)
  if (!ans) return []

  ans = Object.keys(ans).map(d => d.replaceAll('@', '.')) // de sanitize due to mongo db
  return ans.filter(d => d !== '_id')
}

async function getUsers() {
  let ans = await getAll(chatIdOf)
  if (!ans) return []

  return ans.map(a => a._id)
}

// new Date('2023-9-5'), new Date('2023-9'), new Date('2023')
async function getAnalytics() {
  let ans = await getAll(clicksOf)
  if (!ans) return []
  return ans.map(a => `${a._id}: ${a.val} click${a.val === 1 ? '' : 's'}`).sort((a, b) => a.localeCompare(b))
}


async function getAnalyticsOfAllSms() {
  let ans = await getAll(clicksOfSms)
  if (!ans) return []
  return ans.map(a => `${a._id}, ${a.val}`).sort((a, b) => a.localeCompare(b))
}

async function getShortLinks(chatId) {
  let ans = await get(linksOf, chatId)
  if (!ans) return []

  ans = Object.keys(ans).map(d => ({ shorter: d, url: ans[d] }))
  ans = ans.filter(d => d.shorter !== '_id')

  let ret = []
  for (let i = 0; i < ans.length; i++) {
    const link = ans[i]

    if (link.shorter.includes('ap1s@net')) {
      const lastPart = link.shorter.substring(link.shorter.lastIndexOf('/') + 1)
      let clicks = ((await analyticsCuttly(lastPart)) === 'No such url' ? 0 : (await analyticsCuttly(lastPart))) || 0
      const shorter = (await get(maskOf, link.shorter)) || link.shorter.replaceAll('@', '.')
      ret.push({ clicks, shorter, url: link.url })
    } else {
      let clicks = (await get(clicksOn, link.shorter)) || 0
      const shorter = (await get(maskOf, link.shorter)) || link.shorter.replaceAll('@', '.')
      ret.push({ clicks, shorter, url: link.url })
    }

  }

  return ret
}

async function ownsDomainName(chatId) {
  return (await getPurchasedDomains(chatId)).length > 0
}

async function isValid(link) {
  const time = await get(expiryOf, link)
  if (time === undefined) return true

  return time > Date.now()
}

async function isSubscribed(chatId) {
  const time = await get(planEndingTime, chatId)
  if (!time || time <= Date.now()) return false

  // Sanity check: no plan should be valid more than 31 days from now
  const MAX_REASONABLE_MS = 31 * 86400 * 1000
  if (time > Date.now() + MAX_REASONABLE_MS) {
    log(`[isSubscribed] Anomalous planEndingTime for chatId ${chatId}: ${new Date(time).toISOString()} — treating as expired`)
    // Auto-fix: expire the corrupted plan
    set(planEndingTime, chatId, 0)
    return false
  }

  return true
}

async function freeLinksAvailable(chatId) {
  const freeLinks = (await get(freeShortLinksOf, chatId)) || 0
  return freeLinks > 0
}


async function backupTheData() {
  const backupData = {
    state: await getAll(state),
    linksOf: await getAll(linksOf),
    walletOf: await getAll(walletOf),
    expiryOf: await getAll(expiryOf),
    fullUrlOf: await getAll(fullUrlOf),
    domainsOf: await getAll(domainsOf),
    loginCountOf: await getAll(loginCountOf),
    canLogin: await getAll(canLogin),
    chatIdBlocked: await getAll(chatIdBlocked),
    planEndingTime: await getAll(planEndingTime),
    chatIdOfPayment: await getAll(chatIdOfPayment),
    totalShortLinks: await getAll(totalShortLinks),
    freeShortLinksOf: await getAll(freeShortLinksOf),
    freeDomainNamesAvailableFor: await getAll(freeDomainNamesAvailableFor),
    freeValidationsAvailableFor: await getAll(freeValidationsAvailableFor),
    freeSmsCountOf: await getAll(freeSmsCountOf),
    clicksOfSms: await getAll(clicksOfSms),
    payments: await getAll(payments),
    clicksOf: await getAll(clicksOf),
    clicksOn: await getAll(clicksOn),
    chatIdOf: await getAll(chatIdOf),
    nameOf: await getAll(nameOf),
    planOf: await getAll(planOf),
  }
  const backupJSON = JSON.stringify(backupData, null, 2)
  fs.writeFileSync('backup.json', backupJSON, 'utf-8')
}

async function backupPayments() {
  const data = await getAll(payments)

  const head = 'Mode, Product, Name, Price, ChatId, User Name, Time,Currency\n'
  const backup = data.map(a => a.val).join('\n')
  fs.writeFileSync('payments.csv', head + backup, 'utf-8')
}

async function buyDomain(chatId, domain, registrar, nsChoice, customNS) {
  // ref https://www.mongodb.com/docs/manual/core/dot-dollar-considerations
  const domainSanitizedForDb = domain.replaceAll('.', '@')

  // Use unified domain service for registration
  registrar = registrar || 'ConnectReseller'
  nsChoice = nsChoice || 'provider_default'

  const result = await domainService.registerDomain(domain, registrar, nsChoice, db, chatId, customNS)
  if (result.success) {
    set(domainsOf, chatId, domainSanitizedForDb, true)
  }

  return result
}

const formatLinks = links => {
  return links.map(d => `${d.clicks} ${d.clicks === 1 ? 'click' : 'clicks'} → ${d.shorter} → ${d.url}`)
}

const buyDomainFullProcess = async (chatId, lang, domain) => {
  try {
    sendMessage(chatId, translation('t.paymentSuccessFul', lang), rem)
    let info = await get(state, chatId)
    const registrar = info?.registrar || 'ConnectReseller'
    const nsChoice = info?.nsChoice || 'provider_default'
    const customNS = info?.customNS || null
    const { error: buyDomainError } = await buyDomain(chatId, domain, registrar, nsChoice, customNS)
    if (buyDomainError) {
      const m = translation('t.domainPurchasedFailed', lang, domain, buyDomainError)
      log(m)
      sendMessage(TELEGRAM_DEV_CHAT_ID, m)
      sendMessage(chatId, m)
      return m
    }
    send(chatId, translation('t.domainBoughtSuccess', lang, domain), translation('o', lang))

    // Post-registration NS update for custom or Cloudflare
    if (nsChoice === 'custom' && customNS && customNS.length >= 2 && registrar === 'ConnectReseller') {
      sendMessage(chatId, `Updating nameservers to: ${customNS.join(', ')} ...`)
      await sleep(60000) // Wait for CR to propagate
      await domainService.postRegistrationNSUpdate(domain, registrar, nsChoice, customNS, db)
    } else if (nsChoice === 'custom' && customNS && customNS.length >= 2 && registrar === 'OpenProvider') {
      // OP sets NS at registration, but verify and update if needed
      sendMessage(chatId, `Verifying nameservers: ${customNS.join(', ')} ...`)
      await sleep(10000)
      await domainService.postRegistrationNSUpdate(domain, registrar, nsChoice, customNS, db)
    } else if (nsChoice === 'cloudflare' && registrar === 'ConnectReseller') {
      const cfNS = await require('./cf-service').getAccountNameservers()
      sendMessage(chatId, `Updating nameservers to Cloudflare: ${cfNS.join(', ')} ...`)
      await sleep(60000)
      await domainService.postRegistrationNSUpdate(domain, registrar, nsChoice, cfNS, db)
    } else if (nsChoice === 'cloudflare' && registrar === 'OpenProvider') {
      // OP sets CF NS at registration, but verify and update if needed
      const cfNS = await require('./cf-service').getAccountNameservers()
      sendMessage(chatId, `Verifying Cloudflare nameservers: ${cfNS.join(', ')} ...`)
      await sleep(10000)
      await domainService.postRegistrationNSUpdate(domain, registrar, nsChoice, cfNS, db)
    }

    if (info?.askDomainToUseWithShortener === false) return

    // Link domain to Railway/Render for URL shortener
    const { server, error, recordType } =
      process.env.HOSTED_ON === 'render'
        ? await saveDomainInServerRender(domain)
        : await saveDomainInServerRailway(domain)

    if (error) {
      const m = translation('t.errorSavingDomain', lang)
      sendMessage(chatId, m)
      return m
    }
    sendMessage(chatId, translation('t.domainLinking', lang, domain))

    // Add DNS record via the correct service based on registrar
    // Note: nsChoice is always 'provider_default' here (shortener=Yes forces it)
    if (registrar === 'OpenProvider') {
      // OP domains: add DNS record via OpenProvider DNS zone API
      await sleep(10000)
      const addResult = await domainService.addDNSRecord(domain, recordType, server, '', db)
      if (addResult.error || !addResult.success) {
        const m = `Error saving DNS record for domain: ${addResult.error || 'Unknown error'}`
        sendMessage(chatId, m)
        return m
      }
    } else {
      // ConnectReseller with provider_default
      await sleep(65000)
      const { error: saveServerInDomainError } = await saveServerInDomain(domain, server, recordType)
      console.log("###saveServerInDomainError", saveServerInDomainError)
      if (saveServerInDomainError) {
        const m = `Error saving server in domain ${saveServerInDomainError}`
        sendMessage(chatId, m)
        return m
      }
    }
    sendMessage(chatId, translation('t.domainBought', lang).replaceAll('{{domain}}', domain))
    regularCheckDns(bot, chatId, domain, lang)
    return false // error = false
  } catch (error) {
    const errorMessage = `err buyDomainFullProcess ${error?.message} ${safeStringify(error?.response?.data)}`
    sendMessage(TELEGRAM_DEV_CHAT_ID, errorMessage)
    console.error(errorMessage)
    return errorMessage
  }
}

schedule.scheduleJob('*/5 * * * *', function() {
  checkVPSPlansExpiryandPayment()
})

async function checkVPSPlansExpiryandPayment() {
  const now = new Date()
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

  try {
    const expiredHourlyVpsPlans = await vpsPlansOf.find({
      'plan': 'Hourly',
      'end_time': { $lte: now },
      'status' : 'RUNNING'
    }).toArray()

    for ( const vpsPlan of expiredHourlyVpsPlans) {
      const { chatId, _id, planPrice, plan, vpsId, label } = vpsPlan
      const info = await state.findOne({ _id: parseFloat(chatId) })
      const { usdBal } = await getBalance(walletOf, chatId)
      if (usdBal < planPrice) {
        try {
          let payload = {
            _id: vpsId
          }
          const stopVPS = await changeVpsInstanceStatus(payload, 'stop')
          if (stopVPS.success) {
            await vpsPlansOf.updateOne(
              { _id: _id },
              { $set: { 'status': 'TERMINATED' } },
            )
            return send(chatId, translation('vp.lowWalletBalance', info?.userLanguage, label))
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        await vpsPlansOf.updateOne(
          { _id: _id },
          { $set: { 'end_time': oneHourFromNow } },
        )
        set(payments, nanoid(), `Wallet,VPSPlan,${plan},$${planPrice},${chatId},${new Date()}`)
        send(chatId, translation('vp.vpsHourlyPlanRenewed', info?.userLanguage, label, planPrice))
        await atomicIncrement(walletOf, chatId, 'usdOut', Number(planPrice))
        const { usdBal: usd, ngnBal: ngn } = await getBalance(walletOf, chatId)
        send(chatId, translation('t.showWallet', info?.userLanguage, usd, ngn))
      }
    }
  } catch (error) {
    console.error('Error sending reminders:', error)
  }
}

const buyVPSPlanFullProcess = async (chatId, lang, vpsDetails) => {
  try {
    const vmInstance = await createVPSInstance(chatId, vpsDetails)
    if (!vmInstance.success) {
      const m = translation('vp.errorPurchasingVPS', lang, vpsDetails.plan)
      log(m)
      sendMessage(TELEGRAM_DEV_CHAT_ID, m)
      sendMessage(chatId, m)
      return false
    }
    const { data: vpsData } = vmInstance
    const now = new Date()
    let info = await get(state, chatId)

    await vpsPlansOf.insertOne({
      chatId: chatId,
      name: vpsData.vps_name,
      label: vpsData.label,
      vpsId: vpsData._id,
      start_time: now, 
      end_time: new Date(vpsData.subscription.subscriptionEnd), 
      plan: vpsDetails.plan,
      planPrice: vpsDetails.plantotalPrice, 
      status: vpsData.status,
      timestamp: new Date()
    });
    await sleep(10000)

    if (vpsDetails.sshKeyName) {
      const data = {
        zone: vpsDetails.zone,
        vpsId: vpsData._id,
        sshKeys: [ vpsDetails.sshKeyName],
        telegramId: chatId,
      }
      await attachSSHKeysToVM(data)
    }

    await sleep(30000)
    const credentials = await setVpsSshCredentials(vpsData.host)

    set(state, info._id, 'action', 'none')
    send(chatId, translation('vp.vpsBoughtSuccess', lang, vpsDetails, vpsData, credentials?.data), translation('o', lang))
    try {
      await sendVPSCredentialsEmail(info, vpsData, vpsDetails, credentials?.data)
    } catch (error) {
      log('Error sending email:', error)
      send(TELEGRAM_DEV_CHAT_ID, 'Error sending email', translation('o'))
    }

    return true
  } catch (error) {
    const errorMessage = `err buyVPSPlanFullProcess ${error?.message} ${safeStringify(error?.response?.data)}`
    const m = translation('vp.errorPurchasingVPS', lang, vpsDetails.plan)
    sendMessage(chatId, m)
    sendMessage(TELEGRAM_DEV_CHAT_ID, errorMessage)
    console.error(errorMessage)
    return false
  }
}

const upgradeVPSDetails = async (chatId, lang, vpsDetails) => {
  try {
    log(vpsDetails)
    const vmInstanceDetails = await fetchVPSDetails(chatId, vpsDetails._id)
    if (!vmInstanceDetails) {
      const m = translation('vp.errorUpgradingVPS', lang, vpsDetails.name)
      log(m)
      sendMessage(TELEGRAM_DEV_CHAT_ID, m)
      sendMessage(chatId, m)
      return false
    }
    let vmInstanceUpgrade;
    let message = ''
    switch (vpsDetails.upgradeType) {
      case 'plan':
        vmInstanceUpgrade = await upgradeVPSPlanType(chatId, vpsDetails)
        if (vmInstanceUpgrade.success) {
          await vpsPlansOf.updateOne(
            { vpsId: vpsDetails._id },
            { $set: { 'planPrice': vmInstanceUpgrade.data.price } },
          )
        }
        message = translation('vp.vpsUpgradePlanTypeSuccess', lang, vpsDetails)
        break;
      case 'disk':
        vmInstanceUpgrade = await upgradeVPSDiskType(chatId, vpsDetails)
        if (vmInstanceUpgrade.success) {
          await vpsPlansOf.updateOne(
            { vpsId: vpsDetails._id },
            { $set: { 'planPrice': vmInstanceUpgrade.data.subscription.price } },
          )
        }
        message = translation('vp.vpsUpgradeDiskTypeSuccess', lang, vpsDetails)
        break;
      case 'vps-renew':
        vmInstanceUpgrade = await renewVPSPlan(chatId, vmInstanceDetails.subscription_id)
        if (vmInstanceUpgrade.success) {
          await vpsPlansOf.updateOne(
            { vpsId: vpsDetails._id },
            { $set: { 
              'end_time': new Date(vmInstanceUpgrade.data.subscriptionEnd), 
              'status': 'RUNNING'
            }},
          )
          const expiryDate = date(vmInstanceUpgrade.data.subscriptionEnd)
          message = translation('vp.vpsRenewPlanSuccess', lang, vmInstanceDetails, expiryDate)
        }
      case 'vps-cPanel-renew':
        vmInstanceUpgrade = await renewVPSCPanel(chatId, vmInstanceDetails.subscription_id)
        if (vmInstanceUpgrade.success) {
          const expiryDate = date(vmInstanceUpgrade.data.cPanel.expiryDate)
          message = translation('vp.vpsRenewCPanelSuccess', lang, vmInstanceDetails, expiryDate)
        }
      default:
        break;
    }
    if (!vmInstanceUpgrade?.success) {
      const m = translation('vp.errorPurchasingVPS', lang, vpsDetails.name)
      log(m)
      sendMessage(TELEGRAM_DEV_CHAT_ID, m)
      sendMessage(chatId, m)
      return false
    }

    set(state, chatId, 'action', 'none')
    send(chatId, message, translation('o', lang))
    return true
  } catch (error) {
    const errorMessage = `err buyUPgradingVPSProcess ${error?.message} ${safeStringify(error?.response?.data)}`
    const m = translation('vp.errorPurchasingVPS', lang, vpsDetails.name)
    sendMessage(chatId, m)
    sendMessage(TELEGRAM_DEV_CHAT_ID, errorMessage)
    console.error(errorMessage)
    return false
  }
}

// ── Cloud Phone DB helpers ──
async function updatePhoneNumberFeature(col, chatId, phoneNumber, featureKey, value) {
  const userData = await get(col, chatId)
  if (!userData?.numbers) return
  const nums = userData.numbers
  const idx = nums.findIndex(n => n.phoneNumber === phoneNumber)
  if (idx === -1) return
  nums[idx].features = nums[idx].features || {}
  nums[idx].features[featureKey] = value
  await set(col, chatId, { numbers: nums })
}

async function updatePhoneNumberField(col, chatId, phoneNumber, fieldKey, value) {
  const userData = await get(col, chatId)
  if (!userData?.numbers) return
  const nums = userData.numbers
  const idx = nums.findIndex(n => n.phoneNumber === phoneNumber)
  if (idx === -1) return
  nums[idx][fieldKey] = value
  await set(col, chatId, { numbers: nums })
}

const auth = async (req, res, next) => {
  log(req.hostname + req.originalUrl)
  const ref = req?.query?.ref || req?.body?.data?.reference // first for crypto and second for webhook fincra
  const pay = await get(chatIdOfPayment, ref)
  if (!pay) return log(translation('t.payError', 'en')) || res.send(html(translation('t.payError', 'en')))
  req.pay = { ...pay, ref }
  next()
}

const authDyno = async (req, res, next) => {
  log('=== DYNOPAY WEBHOOK RECEIVED ===')
  log('URL:', req.hostname + req.originalUrl)
  log('Full request body:', JSON.stringify(req.body, null, 2))
  
  // Skip pending events — they don't carry meta_data yet
  if (req.body?.event === 'payment.pending' || req.body?.status === 'pending') {
    log('Skipping pending payment event (no meta_data yet)')
    return res.send(html('OK'))
  }

  const { meta_data } = req.body
  const ref = meta_data?.refId
  
  log('Extracted refId:', ref)
  
  const pay = await get(chatIdOfDynopayPayment, ref)
  log('Payment data found for ref:', ref, '=', pay ? 'YES' : 'NO')
  
  if (!pay) {
    log('ERROR: Payment session not found for ref:', ref)
    return res.send(html(translation('t.payError', 'en')))
  }
  
  log('Payment session authenticated successfully:', pay)
  req.pay = { ...pay, ref }
  next()
}

// Use the early app that's already listening
const app = earlyApp
// Strip /api prefix from incoming requests (Emergent ingress sends /api/* to port 8001 without stripping)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '')
  }
  next()
})
app.set('json spaces', 2)

const addFundsTo = async (walletOf, chatId, coin, valueIn, lang) => {
  if (!['usd', 'ngn'].includes(coin)) throw Error('Dev Please Debug')

  const key = `${coin}In`
  await atomicIncrement(walletOf, chatId, key, valueIn)
  const { usdBal, ngnBal } = await getBalance(walletOf, chatId)
  sendMessage(chatId, translation('t.showWallet', lang, usdBal, ngnBal))
}
//
//
const bankApis = {
  '/bank-pay-plan': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price, plan } = req.pay || {}
    if (!ref || !chatId || !price || !plan) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    if (('' + ref + chatId + price + plan).includes('undefined')) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    const name = await get(nameOf, chatId)
    set(payments, ref, `Bank, Plan, ${plan}, $${usdIn}, ${chatId}, ${name}, ${new Date()}, ₦${ngnIn}`)

    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    // Subscribe Plan
    subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang, freeValidationsAvailableFor)
    notifyGroup(`💎 <b>New Subscription!</b>\nUser ${maskName(name)} just upgraded to the <b>${plan} Plan</b> — unlocking ${freeDomainsOf[plan]} free domains + ${(freeValidationsOf[plan] || 0).toLocaleString()} phone validations.\nDon't miss out — /start`)

    res.send(html())
  },
  '/bank-pay-domain': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price, domain } = req.pay || {}
    if (!ref || !chatId || !price || !domain) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    const name = await get(nameOf, chatId)
    set(payments, ref, `Bank, Domain, ${domain}, $${usdIn}, ${chatId}, ${name}, ${new Date()}, ₦${ngnIn}`)

    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentMoreMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    // Buy Domain
    const error = await buyDomainFullProcess(chatId, lang, domain)
    if (error) return res.send(html(error))
    notifyGroup(`🌐 <b>Domain Registered!</b>\nUser ${maskName(name)} just claimed <b>${domain}</b> — your dream domain could be next.\nGrab yours before it's taken — /start`)

    res.send(html())
  },
  '/bank-pay-hosting': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price } = req.pay
    const response = req?.query
    if (!ref || !chatId || !price) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    await insert(hostingTransactions, chatId, "bank", response)

    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentMoreMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    // Buy Domain Hosting
    await registerDomainAndCreateCpanel(send, info, translation('o', lang), state)

    res.send(html())
  },
  '/bank-pay-vps': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price, vpsDetails } = req.pay
    const response = req?.query
    if (!ref || !chatId || !price ) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    let transaction = {
      plan: vpsDetails.plan,
      type: 'new-plan',
      response: response
    }
    await insert(vpsTransactions, chatId, "bank", transaction)

    const totalPrice = Number(vpsDetails?.totalPrice)
    sendMessage(chatId, translation('vp.paymentRecieved', lang))
    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentMoreMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    if (vpsDetails.plan === 'Hourly') {
      addFundsTo(walletOf, chatId, 'usd', usdIn - totalPrice, lang)
      sendMessage(chatId, translation('vp.extraMoney', lang))
    }

    // Buy VPS
    const isSuccess = await buyVPSPlanFullProcess(chatId, lang, vpsDetails)
    if (!isSuccess) return res.send(html(error))

    res.send(html())
  },
  '/bank-pay-upgrade-vps': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId, price, vpsDetails } = req.pay
    const response = req?.query
    if (!ref || !chatId || !price ) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Logs
    del(chatIdOfPayment, ref)
    const usdIn = await ngnToUsd(ngnIn)
    let transaction = {
      type: vpsDetails.upgradeType === 'plan' ? 'upgarde-plan' : 'upgrade-disk',
      response : response
    }
    await insert(vpsTransactions, chatId, "bank", transaction)
    const totalPrice = Number(vpsDetails?.totalPrice)
    sendMessage(chatId, translation('vp.vpsChangePaymentRecieved', lang))
    // Update Wallet
    const ngnPrice = await usdToNgn(price)
    if (usdIn * 1.06 < price) {
      sendMessage(chatId, translation('t.sentLessMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
      addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
      return res.send(html(translation('t.lowPrice')))
    }
    if (ngnIn > ngnPrice) {
      addFundsTo(walletOf, chatId, 'ngn', ngnIn - ngnPrice, lang)
      sendMessage(chatId, translation('t.sentMoreMoney', lang, `${ngnPrice} NGN`, `${ngnIn} NGN`))
    }

    if (vpsDetails?.billingCycle === 'Hourly') {
      addFundsTo(walletOf, chatId, 'usd', usdIn - totalPrice, lang)
      sendMessage(chatId, translation('vp.extraMoney', lang))
    }
    // Upgrade VPS plan or disk
    const isSuccess = await upgradeVPSDetails(chatId, lang, vpsDetails)
    if (!isSuccess) return res.send(html(error))

    res.send(html())
  },
  '/bank-wallet': async (req, res, ngnIn) => {
    // Validate
    const { ref, chatId } = req.pay
    if (!ref || !chatId) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'

    // Update Wallet
    const usdIn = await ngnToUsd(ngnIn)
    addFundsTo(walletOf, chatId, 'ngn', ngnIn, lang)
    sendMessage(chatId, translation('t.confirmationDepositMoney', lang, `${ngnIn} NGN`, usdIn))

    // Logs
    res.send(html())
    del(chatIdOfPayment, ref)
    const name = await get(nameOf, chatId)
    set(payments, ref, `Bank,Wallet,wallet,$${usdIn},${chatId},${name},${new Date()},${ngnIn} NGN`)
    notifyGroup(`💰 <b>Wallet Top-Up!</b>\nUser ${maskName(name)} just loaded their wallet and is ready to buy domains, leads & more.\nFund yours in seconds — /start`)
  },
}
//
//
app.post('/webhook', auth, (req, res) => {
  const value = req?.body?.data?.amountReceived
  const coin = req?.body?.data?.currency
  const endpoint = req?.pay?.endpoint
  if (coin !== 'NGN' || isNaN(value) || !bankApis[endpoint]) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  bankApis[endpoint](req, res, Number(value))
})

app.get('/open-api-key', async (req, res) => {
  // Require auth header to prevent unauthorized access
  const authHeader = req.headers['x-api-auth'] || req.query?.auth
  const expectedAuth = process.env.APP_OPEN_API_AUTH || process.env.TELEGRAM_BOT_TOKEN
  if (!authHeader || authHeader !== expectedAuth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const openApiKey = process.env.APP_OPEN_API_KEY
  const length = Math.ceil(openApiKey.length / 3)
  const piece1 = openApiKey.substring(0, length)
  const piece2 = openApiKey.substring(length, length * 2)
  const piece3 = openApiKey.substring(length * 2)

  const responseJson = {
    piece1: piece1,
    piece2: piece3,
    piece3: piece2,
  }

  res.json(responseJson)
})

app.get('/bot-link', async (req, res) => {
  res.send(process.env.APP_SUPPORT_LINK)
})

app.get('/free-sms-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId
  let _count = (await get(freeSmsCountOf, Number(chatId))) || 0
  res.send('' + _count)
})

app.get('/increment-free-sms-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId
  const name = await get(nameOf, Number(chatId))

  increment(freeSmsCountOf, Number(chatId))
  increment(clicksOfSms, chatId + ', ' + name + ', ' + today())
  increment(clicksOfSms, chatId + ', ' + name + ', ' + week())
  increment(clicksOfSms, chatId + ', ' + name + ', ' + month())
  increment(clicksOfSms, chatId + ', ' + name + ', ' + year())

  increment(clicksOfSms, 'total, total, ' + today())
  increment(clicksOfSms, 'total, total, ' + week())
  increment(clicksOfSms, 'total, total, ' + month())
  increment(clicksOfSms, 'total, total, ' + year())
  res.send('ok')
})


app.get('/analytics-of-all-sms', async (req, res) => {
  const analyticsData = await getAnalyticsOfAllSms()
  const analyticsText = `chat id, name, date, sms sent\n${analyticsData.join('\n')}`
  const fileName = 'analytics.csv'
  fs.writeFileSync(fileName, analyticsText, 'utf-8')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.setHeader('Content-Type', 'application/json')
  fs.createReadStream(fileName).pipe(res)
})
app.get('/login-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId
  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  if (!loginData.canLogin) {
    const info = await state.findOne({ _id: parseFloat(chatId) })
    const lang = info?.userLanguage ?? 'en'
    send(Number(chatId), translation('t.resetLogin', lang), translation('yes_no', lang))
    // sendMessage(Number(chatId), t.resetLogin, yes_no)
    await set(state, Number(chatId), 'action', 'listen_reset_login')
  }
  res.json(loginData)
})

app.get('/increment-login-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId

  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  await set(loginCountOf, Number(chatId), { loginCount: loginData.loginCount + 1, canLogin: false })

  res.send('ok')
})

app.get('/decrement-login-count/:chatId', async (req, res) => {
  const chatId = req?.params?.chatId

  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }

  if (loginData.canLogin) return res.send('!ok')

  await set(loginCountOf, Number(chatId), { loginCount: loginData.loginCount - 1, canLogin: true })

  res.send('ok')
})
app.get('/phone-numbers-demo-link', async (req, res) => {
  res.send(process.env.APP_PHONE_NUMBERS_DEMO_LINK)
})

app.get('/content-demo-link', async (req, res) => {
  res.send(process.env.APP_CONTENT_DEMO_LINK)
})

app.get('/free-sms', async (req, res) => {
  res.send(process.env.APP_FREE_SMS)
})

app.get('/crypto-pay-plan', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price, plan } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin

  console.log({ method: '/crypto-pay-plan', ref, chatId, plan, price, coin, value })

  if (!ref || !chatId || !plan || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Logs
  del(chatIdOfPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Plan,${plan},$${price},${chatId},${name},${new Date()},${value} ${coin}`)

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  const usdNeed = usdIn * 1.06
  console.log(`usdIn ${usdIn}, usdNeed ${usdNeed}, Crypto, Plan, ${chatId}, ${name}`)
  if (usdNeed < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  console.log(`usdIn > price = ${usdIn > price}`)
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Subscribe Plan
  subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang, freeValidationsAvailableFor)
  notifyGroup(`💎 <b>New Subscription!</b>\nUser ${maskName(name)} just upgraded to the <b>${plan} Plan</b> — unlocking ${freeDomainsOf[plan]} free domains + ${(freeValidationsOf[plan] || 0).toLocaleString()} phone validations.\nDon't miss out — /start`)
  res.send(html())
})
app.get('/crypto-pay-domain', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price, domain } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  if (!ref || !chatId || !domain || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  // Logs
  del(chatIdOfPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Domain,${domain},$${price},${chatId},${name},${new Date()},${value} ${coin}`)

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Buy Domain
  const error = await buyDomainFullProcess(chatId, lang, domain)
  if (error) return res.send(html(error))
  notifyGroup(`🌐 <b>Domain Registered!</b>\nUser ${maskName(name)} just claimed <b>${domain}</b> — your dream domain could be next.\nGrab yours before it's taken — /start`)
  res.send(html())
})

// Hosting
app.get('/crypto-pay-hosting', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  const response = req?.query

  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

    // Logs
  del(chatIdOfPayment, ref)
  await insert(hostingTransactions, chatId, "blockbee", response)
  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  await registerDomainAndCreateCpanel(send, info, translation('o', lang), state)

  res.send(html())
})

app.get('/crypto-pay-vps', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price, vpsDetails } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  const response = req?.query
  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  const totalPrice = Number(vpsDetails?.totalPrice)

  sendMessage(chatId, translation('vp.paymentRecieved', lang))
  // Logs
  del(chatIdOfPayment, ref)
  let transaction = {
    type: 'new-plan',
    response : response
  }
  await insert(vpsTransactions, chatId, "blockbee", transaction)

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn), lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - Number(price), lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  if (vpsDetails.plan === 'Hourly') {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - totalPrice, lang)
    sendMessage(chatId, translation('vp.extraMoney', lang))
  }

  const isSuccess = await buyVPSPlanFullProcess(chatId, lang, vpsDetails)
  if (!isSuccess) return res.send(html(error))
  res.send(html())
})

app.get('/crypto-pay-upgrade-vps', auth, async (req, res) => {
  // Validate
  const { ref, chatId, price, vpsDetails } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  const response = req?.query
  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  const totalPrice = Number(vpsDetails?.totalPrice)

  sendMessage(chatId, translation('vp.vpsChangePaymentRecieved', lang))
  // Logs
  del(chatIdOfPayment, ref)
  let transaction = {
    type: vpsDetails.upgradeType === 'plan' ? 'upgrade-plan' : 'upgrade-disk',
    response: response
  }
  await insert(vpsTransactions, chatId, "blockbee", transaction)

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn), lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - Number(price), lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  if (vpsDetails?.billingCycle === 'Hourly') {
    addFundsTo(walletOf, chatId, 'usd', usdIn - totalPrice, lang)
    sendMessage(chatId, translation('vp.extraMoney', lang))
  }

  // Upgrade VPS plan or disk
  const isSuccess = await upgradeVPSDetails(chatId, lang, vpsDetails)
  if (!isSuccess) return res.send(html(error))
  res.send(html())
})

app.get('/crypto-wallet', auth, async (req, res) => {
  // Validate
  const { ref, chatId } = req.pay
  const coin = req?.query?.coin
  const value = req?.query?.value_coin
  if (!ref || !chatId || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Update Wallet
  const usdIn = await convert(value, coin, 'usd')
  addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
  sendMessage(chatId, translation('t.confirmationDepositMoney', lang, value + ' ' + tickerViewOf[coin], usdIn))

  // Logs
  res.send(html())
  del(chatIdOfPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Wallet,wallet,$${usdIn},${chatId},${name},${new Date()},${value} ${coin}`)
  notifyGroup(`💰 <b>Wallet Top-Up!</b>\nUser ${maskName(name)} just loaded their wallet and is ready to buy domains, leads & more.\nFund yours in seconds — /start`)
})

// Dynopay Pay plan
app.post('/dynopay/crypto-pay-plan', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price, plan } = req.pay
  const { amount:value , currency:coin, payment_id:id } = req.body

  log({ method: 'dynopay/crypto-pay-plan', ref, chatId, plan, price, coin, value })

  if (!ref || !chatId || !plan || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Logs
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Plan,${plan},$${price},${chatId},${name},${new Date()},${value} ${coin},transaction,${id}`)

  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')  
  const usdNeed = usdIn * 1.06
  console.log(`usdIn ${usdIn}, usdNeed ${usdNeed}, Crypto, Plan, ${chatId}, ${name}`)
  if (usdNeed < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  console.log(`usdIn > price = ${usdIn > price}`)
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Subscribe Plan
  subscribePlan(planEndingTime, freeDomainNamesAvailableFor, planOf, chatId, plan, bot, lang, freeValidationsAvailableFor)
  notifyGroup(`💎 <b>New Subscription!</b>\nUser ${maskName(name)} just upgraded to the <b>${plan} Plan</b> — unlocking ${freeDomainsOf[plan]} free domains + ${(freeValidationsOf[plan] || 0).toLocaleString()} phone validations.\nDon't miss out — /start`)
  res.send(html())
})

// Dynopay Domain
app.post('/dynopay/crypto-pay-domain', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price, domain } = req.pay
  const { amount:value , currency:coin, payment_id:id } = req.body

  log({ method: 'dynopay/crypto-pay-domain', ref, chatId, domain, price, coin, value })

  if (!ref || !chatId || !domain || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'

  // Logs
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Domain,${domain},$${price},${chatId},${name},${new Date()},${value} ${coin},transaction,${id}`)

  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  // Buy Domain
  const error = await buyDomainFullProcess(chatId, lang, domain)
  if (error) return res.send(html(error))
  notifyGroup(`🌐 <b>Domain Registered!</b>\nUser ${maskName(name)} just claimed <b>${domain}</b> — your dream domain could be next.\nGrab yours before it's taken — /start`)
  res.send(html())
})

// Dynopay Hosting
app.post('/dynopay/crypto-pay-hosting', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price } = req.pay
  const { amount:value , currency:coin } = req.body

  log({ method: 'dynopay/crypto-pay-hosting', ref, chatId, price, coin, value })

  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
    // Logs
  del(chatIdOfDynopayPayment, ref)
  await insert(hostingTransactions, chatId, "dynopay", req.body)
  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', usdIn - price, lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  await registerDomainAndCreateCpanel(send, info, translation('o', lang), state)

  res.send(html())
})

// Dynopay VPS
app.post('/dynopay/crypto-pay-vps', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price, vpsDetails } = req.pay
  const { amount:value , currency:coin } = req.body

  log({ method: 'dynopay/crypto-pay-vps', ref, chatId, price, coin, value })

  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  const totalPrice = vpsDetails?.totalPrice

  sendMessage(chatId, translation('vp.paymentRecieved', lang))
  // Logs
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  let transaction = {
    type: 'new-plan',
    response: req.body
  }
  await insert(vpsTransactions, chatId, "dynopay", transaction)

  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn), lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - Number(price), lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  if (vpsDetails.plan === 'Hourly') {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - Number(totalPrice), lang)
    sendMessage(chatId, translation('vp.extraMoney', lang))
  }

  const isSuccess = await buyVPSPlanFullProcess(chatId, lang, vpsDetails)
  if (!isSuccess) return res.send(html(error))
  res.send(html())
})

// Dynopay Upgrade VPS
app.post('/dynopay/crypto-pay-upgrade-vps', authDyno, async (req, res) => {
  // Validate
  const { ref, chatId, price, vpsDetails } = req.pay
  const { amount:value , currency:coin } = req.body

  log({ method: 'dynopay/crypto-pay-upgrade-vps', ref, chatId, price, coin, value })

  if (!ref || !chatId || !price || !coin || !value) return log(translation('t.argsErr')) || res.send(html(translation('t.argsErr')))

  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  const totalPrice = Number(vpsDetails?.totalPrice)

  sendMessage(chatId, translation('vp.vpsChangePaymentRecieved', lang))
  // Logs
  del(chatIdOfDynopayPayment, ref)
  let transaction = {
    type: vpsDetails.upgradeType === 'plan' ? 'upgrade-plan' : 'upgrade-disk',
    response: req.body
  }
  await insert(vpsTransactions, chatId, "dynopay", transaction)

  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  const usdIn = await convert(value, ticker , 'usd')
  if (usdIn * 1.06 < price) {
    sendMessage(chatId, translation('t.sentLessMoney', lang, `$${price}`, `$${usdIn}`))
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn), lang)
    return res.send(html(translation('t.lowPrice')))
  }
  if (usdIn > price) {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - Number(price), lang)
    sendMessage(chatId, translation('t.sentMoreMoney', lang, `$${price}`, `$${usdIn}`))
  }

  if (vpsDetails?.billingCycle === 'Hourly') {
    addFundsTo(walletOf, chatId, 'usd', Number(usdIn) - Number(totalPrice), lang)
    sendMessage(chatId, translation('vp.extraMoney', lang))
  }

  const isSuccess = await upgradeVPSDetails(chatId, lang, vpsDetails)
  if (!isSuccess) return res.send(html(error))
  res.send(html())
})

// Dynopay wallet 
app.post('/dynopay/crypto-wallet', authDyno, async (req, res) => {
  log('=== DYNOPAY WALLET WEBHOOK PROCESSING START ===')
  
  // Validate
  const { ref, chatId } = req.pay
  const { amount:value , currency:coin, payment_id:id } = req.body
  
  log('Extracted data - ref:', ref, 'chatId:', chatId, 'coin:', coin, 'value:', value, 'transaction_id:', id)
  
  if (!ref || !chatId || !coin || !value) {
    log('ERROR: Missing required fields - ref:', ref, 'chatId:', chatId, 'coin:', coin, 'value:', value)
    return res.send(html(translation('t.argsErr')))
  }
  
  const info = await state.findOne({ _id: parseFloat(chatId) })
  const lang = info?.userLanguage ?? 'en'
  log('User language:', lang)

  // Update Wallet
  const ticker = tickerViewOfDyno[coin]
  log('Currency mapping - coin:', coin, '-> ticker:', ticker)
  
  if (!ticker) {
    log('ERROR: Unknown currency received from Dynopay:', coin)
    log('Supported currencies:', Object.keys(tickerViewOfDyno))
    return res.send(html('Currency not supported: ' + coin))
  }
  
  log('Converting', value, ticker, 'to USD...')
  const usdIn = await convert(value, ticker , 'usd')
  log('Conversion result:', value, ticker, '= $' + usdIn, 'USD')
  
  log('Crediting wallet for chatId:', chatId, 'amount: $' + usdIn)
  await addFundsTo(walletOf, chatId, 'usd', usdIn, lang)
  log('Wallet credited successfully!')
  
  log('Sending confirmation message to user...')
  sendMessage(chatId, translation('t.confirmationDepositMoney' , lang, value + ' ' + coin, usdIn))
  log('Confirmation message sent')

  // Logs
  res.send(html())
  del(chatIdOfDynopayPayment, ref)
  const name = await get(nameOf, chatId)
  set(payments, ref, `Crypto,Wallet,wallet,$${usdIn},${chatId},${name},${new Date()},${value} ${coin},transaction,${id}`)
  notifyGroup(`💰 <b>Wallet Top-Up!</b>\nUser ${maskName(name)} just loaded their wallet and is ready to buy domains, leads & more.\nFund yours in seconds — /start`)
  
  log('=== DYNOPAY WALLET WEBHOOK PROCESSING COMPLETE ===')
})

//
// Override the early health check routes with full functionality
app.get('/', (req, res) => {
  // Return 200 OK for health checks even during startup
  res.status(200).send(html(translation('t.greet')))
})

app.get('/terms-condition', (req, res) => {
  const { lang } = req.query
  res.send(html(translation('l.termsAndCondMsg', lang)))
})

app.get('/ok', (req, res) => {
  res.send(html('ok'))
})
app.get('/woo', (req, res) => {
  log(req.hostname + req.originalUrl)
  res.send(html('woo'))
})
app.get('/health', async (req, res) => {
  // Always return 200 for Railway health checks
  // Report actual DB status in the response body
  const dbHealthy = isDbHealthy()
  appReady = dbHealthy // Update global appReady flag
  
  res.status(200).json({
    status: dbHealthy ? 'healthy' : 'starting',
    database: dbHealthy ? 'connected' : 'connecting',
    uptime: ((new Date() - serverStartTime) / (1000 * 60 * 60)).toFixed(2) + ' hours'
  })
})
app.get('/json1444', async (req, res) => {
  await backupTheData()
  const fileName = 'backup.json'
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.setHeader('Content-Type', 'application/json')
  fs.createReadStream(fileName).pipe(res)
})
app.get('/payments12341234', async (req, res) => {
  await backupPayments()
  const fileName = 'payments.csv'
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.setHeader('Content-Type', 'application/json')
  fs.createReadStream(fileName).pipe(res)
})
app.get('/uptime', (req, res) => {
  let now = new Date()
  let uptimeInMilliseconds = now - serverStartTime
  let uptimeInHours = uptimeInMilliseconds / (1000 * 60 * 60)
  res.send(html(`Server has been running for ${uptimeInHours.toFixed(2)} hours.`))
})
//
app.get('/subscribe', (req, res) => {
  const phone = req?.query?.Phone
  const name = req?.query?.['full-name']

  log({ phone, name })
  res.send(html(translation('t.subscribeRCS', null, phone)))
})
app.get('/unsubscribe', (req, res) => {
  const phone = req?.query?.Phone

  log({ phone })
  res.send(html(translation('t.subscribeRCS', null, phone)))
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADMIN: Reset all user keyboards
// Clears stale action states and sends fresh keyboard to all users
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get('/admin/reset-keyboards', async (req, res) => {
  const adminKey = req?.query?.key
  if (adminKey !== process.env.SESSION_SECRET?.slice(0, 16)) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  try {
    // Step 1: Reset all users' action state to 'none'
    const resetResult = await state.updateMany(
      { action: { $exists: true, $ne: 'none' } },
      { $set: { action: 'none' } }
    )
    log(`[reset-keyboards] Reset ${resetResult.modifiedCount} user states to 'none'`)

    // Step 2: Get all user chatIds from nameOf collection
    const allUsers = await nameOf.find({}).toArray()
    const chatIds = allUsers.map(u => u._id).filter(id => typeof id === 'number')

    // Step 3: Send fresh keyboard to all users in batches
    const BATCH_SIZE = 25
    const DELAY_MS = 1000
    let sent = 0
    let failed = 0

    for (let i = 0; i < chatIds.length; i += BATCH_SIZE) {
      const batch = chatIds.slice(i, i + BATCH_SIZE)
      const promises = batch.map(async (cid) => {
        try {
          const userInfo = await get(state, cid)
          const lang = userInfo?.userLanguage || 'en'
          const keyboard = translation('o', lang)
          await bot?.sendMessage(cid, translation('t.welcome', lang), keyboard)
          sent++
        } catch (e) {
          failed++
          if (e.message?.includes('bot was blocked') || e.message?.includes('chat not found')) {
            log(`[reset-keyboards] User ${cid} blocked/not found, skipping`)
          }
        }
      })
      await Promise.all(promises)
      if (i + BATCH_SIZE < chatIds.length) {
        await new Promise(r => setTimeout(r, DELAY_MS))
      }
    }

    const result = {
      success: true,
      statesReset: resetResult.modifiedCount,
      totalUsers: chatIds.length,
      keyboardsSent: sent,
      failed: failed,
    }
    log('[reset-keyboards] Complete:', JSON.stringify(result))
    res.json(result)
  } catch (error) {
    log('[reset-keyboards] Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

// Quick state-only reset (no message sent to users)
app.get('/admin/reset-states', async (req, res) => {
  const adminKey = req?.query?.key
  if (adminKey !== process.env.SESSION_SECRET?.slice(0, 16)) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  try {
    const resetResult = await state.updateMany(
      { action: { $exists: true, $ne: 'none' } },
      { $set: { action: 'none' } }
    )
    log(`[reset-states] Reset ${resetResult.modifiedCount} user states`)
    res.json({ success: true, statesReset: resetResult.modifiedCount })
  } catch (error) {
    log('[reset-states] Error:', error.message)
    res.status(500).json({ error: error.message })
  }
})

app.get('/planInfo', async (req, res) => {
  if (process.env.OLD_APP_ACTIVE === 'false') return res.send('old app off now')

  const chatId = Number(req?.query?.code)
  if (isNaN(chatId)) return res.status(400).json({ msg: 'Issue in datatype' })
  const name = await get(nameOf, chatId)

  if (!name) return res.json({ planExpiry: 'invalid' })
  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  return res.json({
    pauseTime: 10 * 1000,
    planExpiry: (await get(planEndingTime, chatId)) || 0,
    loginCount: loginData.loginCount,
  })
})

app.get('/planInfoTwo', async (req, res) => {
  const chatId = Number(req?.query?.code)
  if (isNaN(chatId)) return res.status(400).json({ msg: 'Issue in datatype' })
  const name = await get(nameOf, chatId)

  if (!name) return res.json({ planExpiry: 'invalid' })
  const loginData = (await get(loginCountOf, Number(chatId))) || { loginCount: 0, canLogin: true }
  return res.json({
    pauseTime: 10 * 1000,
    planExpiry: (await get(planEndingTime, chatId)) || 0,
    loginCount: loginData.loginCount,
    name,
  })
})
//
app.get('/:id', async (req, res) => {
  const id = req?.params?.id
  if (id === '') return res.json({ message: 'Salam', from: req.hostname })

  // Build lookup key from SELF_URL (works on both Railway and Emergent)
  // On Railway: SELF_URL = "https://app.railway.app" → key = "app@railway@app/slug"
  // On Emergent: SELF_URL = "https://pod.emergentagent.com/api" → key = "pod@...@com/api/slug"
  const selfUrlPath = (process.env.SELF_URL || '').replace('https://', '').replace('http://', '')
  const selfKey = `${selfUrlPath}/${id}`.replaceAll('.', '@')
  let url = await get(fullUrlOf, selfKey)
  let lookupKey = selfKey

  // Fallback: try custom domain lookup (e.g., goog.link/abc → goog@link/abc)
  if (!url) {
    const customKey = `${req.hostname}/${id}`.replaceAll('.', '@')
    url = await get(fullUrlOf, customKey)
    lookupKey = customKey
  }

  if (!url) return res.status(404).send(html('Link not found'))
  if (!(await isValid(lookupKey))) return res.status(404).send(html(translation('t.linkExpired')))

  res.redirect(url)
  increment(clicksOf, 'total')
  increment(clicksOf, today())
  increment(clicksOf, week())
  increment(clicksOf, month())
  increment(clicksOf, year())
  increment(clicksOn, lookupKey)
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TELNYX WEBHOOK ENDPOINTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Telnyx SMS Webhook — receives inbound SMS
app.post('/telnyx/sms-webhook', async (req, res) => {
  try {
    log('📩 Telnyx SMS webhook received')
    await handleInboundSms(req.body, bot, phoneNumbersOf, phoneLogs)
    res.sendStatus(200)
  } catch (error) {
    log('Telnyx SMS webhook error:', error.message)
    res.sendStatus(200) // Always 200 to prevent retries
  }
})

// Telnyx Voice Webhook — receives call events
app.post('/telnyx/voice-webhook', async (req, res) => {
  try {
    log('📞 Telnyx voice webhook received:', req.body?.data?.event_type || 'unknown')
    await handleVoiceWebhook(req, res)
  } catch (error) {
    log('Telnyx voice webhook error:', error.message)
    res.sendStatus(200)
  }
})

// Telegram Webhook Endpoint
app.post('/telegram/webhook', (req, res) => {
  try {
    log('📨 Telegram webhook received')
    bot.processUpdate(req.body)
    res.sendStatus(200)
  } catch (error) {
    log('❌ Webhook processing error:', error.message)
    res.sendStatus(500)
  }
})

// Setup Telegram webhook
const setupTelegramWebhook = async () => {
  if (TELEGRAM_BOT_ON !== 'true') {
    log('⏭️  Telegram bot disabled, skipping webhook setup')
    return
  }

  try {
    const webhookUrl = `${SELF_URL}/telegram/webhook`
    
    // Delete any existing webhook first
    await bot.deleteWebHook()
    log('🗑️  Deleted old webhook')
    
    // Set the new webhook with all required update types
    await bot.setWebHook(webhookUrl, {
      allowed_updates: JSON.stringify(['message', 'callback_query', 'my_chat_member'])
    })
    log('✅ Telegram webhook set successfully')
    log(`📡 Webhook URL: ${webhookUrl}`)
    
    // Verify webhook was set
    const webhookInfo = await bot.getWebHookInfo()
    log('📊 Webhook info:', JSON.stringify(webhookInfo, null, 2))
    
    if (webhookInfo.url === webhookUrl) {
      log('✅ Webhook verification passed')
    } else {
      log('⚠️  Webhook URL mismatch!')
      log('Expected:', webhookUrl)
      log('Got:', webhookInfo.url)
    }
  } catch (error) {
    log('❌ Failed to set up Telegram webhook:', error.message)
    log('Error details:', error)
  }
}

const startServer = async () => {
  // Server already started early for health checks
  // Just mark app as ready and set up webhook
  appReady = true
  log(`✅ Main application ready! Server already listening on port ${PORT}`)
  
  // Set up Telegram webhook
  await setupTelegramWebhook()
}

const tryConnectReseller = async () => {
  try {
    await getRegisteredDomainNames()
    connect_reseller_working = true
    log('✅ Connect Reseller API is working')
  } catch (error) {
    // Only send IP whitelist message once to avoid spam
    if (!ip_whitelist_message_sent) {
      ip_whitelist_message_sent = true
      axios
        .get('https://api.ipify.org/')
        .then(ip => {
          const message = `Please add <code>${ip.data}</code> to whitelist in Connect Reseller, API Section. https://global.connectreseller.com/tools/profile`
          log(`⚠️  Connect Reseller API not accessible. IP: ${ip.data}`)
          send(TELEGRAM_DEV_CHAT_ID, message, { parse_mode: 'HTML' })
          // Only send to admin if it's a different chat ID to avoid duplicates
          if (TELEGRAM_ADMIN_CHAT_ID !== TELEGRAM_DEV_CHAT_ID) {
            send(TELEGRAM_ADMIN_CHAT_ID, message, { parse_mode: 'HTML' })
          }
        })
        .catch(error => {
          console.log('Error fetching IP:', error?.message)
        })
    }
  }
}

tryConnectReseller()

// Start Express server after all functions are defined
if (REST_APIS_ON === 'true') startServer()
