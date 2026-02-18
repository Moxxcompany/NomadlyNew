// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Cloud Phone Scheduler — Expiry, Renewal & Usage Tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const schedule = require('node-schedule')
const axios = require('axios')
const { log } = require('console')
const { get, set, atomicIncrement } = require('./db.js')
const { getBalance } = require('./utils.js')
const { formatPhone, shortDate, plans } = require('./phone-config.js')

const TELNYX_API_KEY = process.env.TELNYX_API_KEY
const TELNYX_BASE = 'https://api.telnyx.com/v2'
const telnyxHeaders = () => ({
  'Authorization': `Bearer ${TELNYX_API_KEY}`,
  'Content-Type': 'application/json',
})

let _bot = null
let _phoneNumbersOf = null
let _phoneTransactions = null
let _phoneLogs = null
let _walletOf = null
let _payments = null
let _nameOf = null
let _notifyGroup = null
let _maskName = null
let _nanoid = null

function initPhoneScheduler(deps) {
  _bot = deps.bot
  _phoneNumbersOf = deps.phoneNumbersOf
  _phoneTransactions = deps.phoneTransactions
  _phoneLogs = deps.phoneLogs
  _walletOf = deps.walletOf
  _payments = deps.payments
  _nameOf = deps.nameOf
  _notifyGroup = deps.notifyGroup
  _maskName = deps.maskName
  _nanoid = deps.nanoid

  // ── Hourly: Check expiry, send reminders, auto-renew ──
  schedule.scheduleJob('0 * * * *', async () => {
    log('[PhoneScheduler] Running hourly expiry check...')
    await runExpiryCheck()
  })

  // ── Daily at 3:00 AM UTC: Pull usage from Telnyx CDR ──
  schedule.scheduleJob('0 3 * * *', async () => {
    log('[PhoneScheduler] Running daily usage tracking...')
    await runUsageTracking()
  })

  // ── Daily at 0:05 AM UTC: Reset monthly counters on billing date ──
  schedule.scheduleJob('5 0 * * *', async () => {
    log('[PhoneScheduler] Running monthly counter reset check...')
    await runMonthlyReset()
  })

  log('[PhoneScheduler] Scheduled: expiry check (hourly), usage tracking (daily 3AM), monthly reset (daily 0:05AM)')
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPIRY CHECK — Reminders + Auto-Renew
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function runExpiryCheck() {
  try {
    const allUsers = await _phoneNumbersOf.find({}).toArray()
    const now = new Date()
    let remindersSent = 0
    let autoRenewed = 0
    let suspended = 0

    for (const user of allUsers) {
      const chatId = user._id
      const numbers = user.val?.numbers || []
      let modified = false

      for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i]
        if (num.status !== 'active' && num.status !== 'suspended') continue

        const expiresAt = new Date(num.expiresAt)
        const msUntilExpiry = expiresAt.getTime() - now.getTime()
        const daysUntilExpiry = msUntilExpiry / (1000 * 60 * 60 * 24)

        // ── 3-day reminder ──
        if (daysUntilExpiry > 2.5 && daysUntilExpiry <= 3.0 && !num._reminder3Sent) {
          const { usdBal } = await getBalance(_walletOf, chatId)
          const plan = plans[num.plan] || { name: num.plan, price: num.planPrice }
          const msg = buildReminderMsg(num, 3, plan, usdBal)
          sendToUser(chatId, msg)
          numbers[i]._reminder3Sent = true
          modified = true
          remindersSent++
          log(`[PhoneScheduler] 3-day reminder sent: ${chatId} ${num.phoneNumber}`)
        }

        // ── 1-day reminder ──
        if (daysUntilExpiry > 0.5 && daysUntilExpiry <= 1.0 && !num._reminder1Sent) {
          const { usdBal } = await getBalance(_walletOf, chatId)
          const plan = plans[num.plan] || { name: num.plan, price: num.planPrice }
          const msg = buildFinalWarningMsg(num, plan, usdBal)
          sendToUser(chatId, msg)
          numbers[i]._reminder1Sent = true
          modified = true
          remindersSent++
          log(`[PhoneScheduler] 1-day warning sent: ${chatId} ${num.phoneNumber}`)
        }

        // ── Expired — attempt auto-renew or suspend ──
        if (msUntilExpiry <= 0 && num.status === 'active') {
          if (num.autoRenew) {
            const renewed = await attemptAutoRenew(chatId, num, i, numbers)
            if (renewed) {
              autoRenewed++
              modified = true
            } else {
              // Auto-renew failed — suspend
              numbers[i].status = 'suspended'
              numbers[i]._reminder3Sent = false
              numbers[i]._reminder1Sent = false
              modified = true
              suspended++
              sendToUser(chatId, buildAutoRenewFailedMsg(num))
              log(`[PhoneScheduler] Auto-renew failed, suspended: ${chatId} ${num.phoneNumber}`)
            }
          } else {
            // No auto-renew — suspend
            numbers[i].status = 'suspended'
            numbers[i]._reminder3Sent = false
            numbers[i]._reminder1Sent = false
            modified = true
            suspended++
            sendToUser(chatId, buildSuspendedMsg(num))
            log(`[PhoneScheduler] Expired & suspended (no auto-renew): ${chatId} ${num.phoneNumber}`)
          }
        }

        // ── Suspended for 7+ days — release ──
        if (num.status === 'suspended') {
          const daysSuspended = (now.getTime() - expiresAt.getTime()) / (1000 * 60 * 60 * 24)
          if (daysSuspended >= 7 && !num._released) {
            numbers[i].status = 'released'
            numbers[i]._released = true
            modified = true
            sendToUser(chatId, `📤 Your number ${formatPhone(num.phoneNumber)} has been permanently released after 7 days of suspension.`)
            const name = await get(_nameOf, chatId)
            _notifyGroup?.(`📤 <b>Auto-Released:</b> ${_maskName?.(name)} lost ${formatPhone(num.phoneNumber)} (expired + 7 days)`)
            log(`[PhoneScheduler] Auto-released: ${chatId} ${num.phoneNumber}`)

            // Release on Telnyx
            if (num.telnyxOrderId) {
              try {
                await axios.delete(`${TELNYX_BASE}/phone_numbers/${num.telnyxOrderId}`, { headers: telnyxHeaders() })
              } catch (e) {
                log(`[PhoneScheduler] Telnyx release error: ${e.message}`)
              }
            }
          }
        }
      }

      if (modified) {
        await set(_phoneNumbersOf, chatId, { numbers })
      }
    }

    log(`[PhoneScheduler] Expiry check complete: ${remindersSent} reminders, ${autoRenewed} auto-renewed, ${suspended} suspended`)
  } catch (e) {
    log(`[PhoneScheduler] Expiry check error: ${e.message}`)
  }
}

async function attemptAutoRenew(chatId, num, index, numbers) {
  try {
    const price = num.planPrice
    const { usdBal } = await getBalance(_walletOf, chatId)

    if (usdBal < price) {
      log(`[PhoneScheduler] Auto-renew failed for ${num.phoneNumber}: balance $${usdBal} < $${price}`)
      return false
    }

    // Deduct from wallet
    const name = await get(_nameOf, chatId)
    const ref = _nanoid?.() || `ar_${Date.now()}`
    if (_payments) set(_payments, ref, `AutoRenew,CloudPhone,$${price},${chatId},${name},${new Date()}`)
    await atomicIncrement(_walletOf, chatId, 'usdOut', price)

    // Extend expiry by 1 month
    const newExpiry = new Date(num.expiresAt)
    newExpiry.setMonth(newExpiry.getMonth() + 1)

    numbers[index].expiresAt = newExpiry.toISOString()
    numbers[index].status = 'active'
    numbers[index].smsUsed = 0
    numbers[index].minutesUsed = 0
    numbers[index]._reminder3Sent = false
    numbers[index]._reminder1Sent = false

    // Log transaction
    await _phoneTransactions?.insertOne({
      chatId,
      phoneNumber: num.phoneNumber,
      action: 'auto_renew',
      plan: num.plan,
      amount: price,
      paymentMethod: 'wallet_usd',
      timestamp: new Date().toISOString(),
    })

    // Notify user
    const { usdBal: newBal } = await getBalance(_walletOf, chatId)
    sendToUser(chatId, buildAutoRenewSuccessMsg(num, newExpiry, usdBal, newBal))

    // Notify admin
    _notifyGroup?.(`✅ <b>Auto-Renewed:</b> ${_maskName?.(name)} → ${formatPhone(num.phoneNumber)} ($${price})`)

    log(`[PhoneScheduler] Auto-renewed: ${chatId} ${num.phoneNumber} until ${newExpiry.toISOString()}`)
    return true
  } catch (e) {
    log(`[PhoneScheduler] Auto-renew error: ${e.message}`)
    return false
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// USAGE TRACKING — Pull from Telnyx CDR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function runUsageTracking() {
  try {
    if (!TELNYX_API_KEY) return log('[PhoneScheduler] No TELNYX_API_KEY, skipping usage tracking')

    const allUsers = await _phoneNumbersOf.find({}).toArray()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const startDate = yesterday.toISOString().split('T')[0] + 'T00:00:00Z'
    const endDate = yesterday.toISOString().split('T')[0] + 'T23:59:59Z'

    let totalCallsTracked = 0
    let totalSmsTracked = 0

    for (const user of allUsers) {
      const chatId = user._id
      const numbers = user.val?.numbers || []
      let modified = false

      for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i]
        if (num.status !== 'active') continue
        const cleanNumber = num.phoneNumber.replace(/[^+\d]/g, '')

        // ── Pull Call Events ──
        try {
          const callRes = await axios.get(`${TELNYX_BASE}/call_events`, {
            headers: telnyxHeaders(),
            params: {
              'filter[call_leg_id][exists]': true,
              'filter[type]': 'call.hangup',
              'page[size]': 100,
            }
          })
          const callEvents = callRes.data?.data || []
          // Filter for this number and count duration
          const relevantCalls = callEvents.filter(e => {
            const payload = e.payload || {}
            const to = (payload.to || '').replace(/[^+\d]/g, '')
            const from = (payload.from || '').replace(/[^+\d]/g, '')
            return to === cleanNumber || from === cleanNumber
          })

          if (relevantCalls.length > 0) {
            let totalDurationSec = 0
            for (const call of relevantCalls) {
              const dur = call.payload?.duration_secs || call.payload?.duration || 0
              totalDurationSec += dur
            }
            const totalMinutes = Math.ceil(totalDurationSec / 60)
            numbers[i].minutesUsed = (numbers[i].minutesUsed || 0) + totalMinutes
            modified = true
            totalCallsTracked += relevantCalls.length
          }
        } catch (e) {
          // Call events API may not be available for all accounts
          log(`[PhoneScheduler] Call CDR fetch error for ${cleanNumber}: ${e.response?.status || e.message}`)
        }

        // ── Pull SMS usage from our own logs (more reliable than Telnyx CDR) ──
        try {
          const smsCount = await _phoneLogs?.countDocuments({
            phoneNumber: cleanNumber,
            type: 'sms',
            timestamp: { $gte: startDate, $lte: endDate }
          }) || 0

          if (smsCount > 0) {
            numbers[i].smsUsed = (numbers[i].smsUsed || 0) + smsCount
            modified = true
            totalSmsTracked += smsCount
          }
        } catch (e) {
          log(`[PhoneScheduler] SMS log count error for ${cleanNumber}: ${e.message}`)
        }

        // ── Check usage limits & send alerts ──
        const plan = plans[num.plan]
        if (plan) {
          const smsLimit = plan.sms
          const smsUsed = numbers[i].smsUsed || 0
          const smsPercent = Math.round((smsUsed / smsLimit) * 100)

          // 80% SMS usage alert
          if (smsPercent >= 80 && smsPercent < 100 && !numbers[i]._smsAlert80) {
            sendToUser(chatId, buildUsageAlertMsg(num, 'SMS', smsUsed, smsLimit, smsPercent))
            numbers[i]._smsAlert80 = true
            modified = true
          }
          // 100% SMS usage alert
          if (smsPercent >= 100 && !numbers[i]._smsAlert100) {
            sendToUser(chatId, buildUsageLimitMsg(num, 'SMS', smsUsed, smsLimit))
            numbers[i]._smsAlert100 = true
            modified = true
          }

          // Minutes alert (skip for unlimited)
          if (plan.minutes !== 'Unlimited') {
            const minLimit = plan.minutes
            const minUsed = numbers[i].minutesUsed || 0
            const minPercent = Math.round((minUsed / minLimit) * 100)

            if (minPercent >= 80 && minPercent < 100 && !numbers[i]._minAlert80) {
              sendToUser(chatId, buildUsageAlertMsg(num, 'Minutes', minUsed, minLimit, minPercent))
              numbers[i]._minAlert80 = true
              modified = true
            }
            if (minPercent >= 100 && !numbers[i]._minAlert100) {
              sendToUser(chatId, buildUsageLimitMsg(num, 'Minutes', minUsed, minLimit))
              numbers[i]._minAlert100 = true
              modified = true
            }
          }
        }
      }

      if (modified) {
        await set(_phoneNumbersOf, chatId, { numbers })
      }
    }

    log(`[PhoneScheduler] Usage tracking complete: ${totalCallsTracked} calls, ${totalSmsTracked} SMS tracked`)
  } catch (e) {
    log(`[PhoneScheduler] Usage tracking error: ${e.message}`)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MONTHLY RESET — Reset counters on billing date
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function runMonthlyReset() {
  try {
    const allUsers = await _phoneNumbersOf.find({}).toArray()
    const today = new Date()
    const todayDay = today.getDate()
    let resetCount = 0

    for (const user of allUsers) {
      const chatId = user._id
      const numbers = user.val?.numbers || []
      let modified = false

      for (let i = 0; i < numbers.length; i++) {
        const num = numbers[i]
        if (num.status !== 'active') continue

        // Reset on purchase anniversary day
        const purchaseDay = new Date(num.purchaseDate).getDate()
        if (todayDay === purchaseDay) {
          numbers[i].smsUsed = 0
          numbers[i].minutesUsed = 0
          numbers[i]._smsAlert80 = false
          numbers[i]._smsAlert100 = false
          numbers[i]._minAlert80 = false
          numbers[i]._minAlert100 = false
          numbers[i]._smsLimitNotified = false
          numbers[i]._minLimitNotified = false
          modified = true
          resetCount++
          log(`[PhoneScheduler] Monthly reset: ${chatId} ${num.phoneNumber}`)
        }
      }

      if (modified) {
        await set(_phoneNumbersOf, chatId, { numbers })
      }
    }

    log(`[PhoneScheduler] Monthly reset complete: ${resetCount} numbers reset`)
  } catch (e) {
    log(`[PhoneScheduler] Monthly reset error: ${e.message}`)
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MESSAGE BUILDERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildReminderMsg(num, days, plan, balance) {
  const price = num.planPrice
  const lowBal = balance < price
  return `🔔 <b>Renewal Reminder</b>

Your Cloud Phone number ${formatPhone(num.phoneNumber)} (${plan.name} Plan) expires in <b>${days} days</b> (${shortDate(num.expiresAt)}).

Auto-Renew: ${num.autoRenew ? '✅ ON' : '❌ OFF'}
Wallet Balance: $${balance.toFixed(2)}
Plan Price: $${price}/mo${lowBal ? `

⚠️ Insufficient balance! Please deposit at least $${(price - balance).toFixed(2)} to renew.` : ''}${num.autoRenew && !lowBal ? `

✅ Your number will auto-renew from your wallet.` : ''}`
}

function buildFinalWarningMsg(num, plan, balance) {
  const price = num.planPrice
  return `🚨 <b>Final Renewal Warning</b>

Your number ${formatPhone(num.phoneNumber)} expires <b>TOMORROW</b> (${shortDate(num.expiresAt)}).

If not renewed:
• Incoming calls will stop
• SMS forwarding will stop
• SIP credentials will be deactivated
• Number will be released after 7 days

Wallet: $${balance.toFixed(2)} | Need: $${price}`
}

function buildAutoRenewSuccessMsg(num, newExpiry, oldBal, newBal) {
  const plan = plans[num.plan] || { name: num.plan }
  return `✅ <b>Auto-Renewal Successful</b>

📞 ${formatPhone(num.phoneNumber)}
📦 Plan: ${plan.name} ($${num.planPrice}/mo)
💰 Charged: $${num.planPrice} from wallet
📅 New expiry: ${shortDate(newExpiry.toISOString())}

Wallet: $${oldBal.toFixed(2)} → $${newBal.toFixed(2)}`
}

function buildAutoRenewFailedMsg(num) {
  const plan = plans[num.plan] || { name: num.plan }
  return `❌ <b>Auto-Renewal Failed</b>

📞 ${formatPhone(num.phoneNumber)}
📦 Plan: ${plan.name} ($${num.planPrice}/mo)

⚠️ Insufficient wallet balance. Your number is now <b>SUSPENDED</b>.

Incoming calls and SMS are paused. Deposit funds and renew within 7 days to keep your number. After 7 days, the number will be permanently released.`
}

function buildSuspendedMsg(num) {
  return `⚠️ <b>Number Suspended</b>

📞 ${formatPhone(num.phoneNumber)} has expired and is now suspended.

Renew within 7 days to keep your number. Go to 📱 My Numbers → 🔄 Renew.`
}

function buildUsageAlertMsg(num, type, used, limit, percent) {
  return `⚠️ <b>Usage Alert</b>

📞 ${formatPhone(num.phoneNumber)}

You've used <b>${used}/${limit}</b> inbound ${type} this month (${percent}%).${type === 'SMS' ? '\n📌 SMS is inbound only. Consider upgrading your plan for more inbound SMS.' : '\n📌 All incoming calls (including forwarded) count toward minutes. Consider upgrading for more.'}`
}

function buildUsageLimitMsg(num, type, used, limit) {
  return `🚫 <b>Inbound ${type} Limit Reached</b>

📞 ${formatPhone(num.phoneNumber)}

You've used all <b>${limit}</b> inbound ${type} in your plan this month.
${type === 'SMS' ? '📌 Incoming SMS will no longer be forwarded until your plan resets or you upgrade.\nReminder: SMS is inbound only.' : '📌 Incoming calls will be rejected (including forwarded calls) until your plan resets or you upgrade.'}`
}

function sendToUser(chatId, text) {
  _bot?.sendMessage(chatId, text, { parse_mode: 'HTML' })?.catch(e => {
    log(`[PhoneScheduler] Send error to ${chatId}: ${e.message}`)
  })
}

module.exports = {
  initPhoneScheduler,
  runExpiryCheck,
  runUsageTracking,
  runMonthlyReset,
}
