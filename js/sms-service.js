// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SMS Service — Handle inbound SMS, forward to Telegram/Email
// Uses Brevo (Sendinblue) for email forwarding
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const axios = require('axios')
const { log } = require('console')
const { formatPhone } = require('./phone-config')

const BREVO_API_KEY = process.env.BREVO_API_KEY
const MAIL_SENDER = process.env.MAIL_SENDER || 'sms@nomadly.com'

// ── Forward SMS to Telegram chat ──
async function forwardSmsToTelegram(bot, chatId, from, to, body) {
  const time = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
  const msg = `📩 <b>SMS Received</b>

📞 To: ${formatPhone(to)}
👤 From: ${formatPhone(from)}
🕐 ${time}

💬 "${body}"`

  try {
    await bot.sendMessage(chatId, msg, { parse_mode: 'HTML' })
    log(`SMS forwarded to Telegram chatId=${chatId} from=${from}`)
  } catch (e) {
    log('forwardSmsToTelegram error:', e.message)
  }
}

// ── Forward SMS to Email via Brevo ──
async function forwardSmsToEmail(toEmail, from, to, body) {
  if (!BREVO_API_KEY || !toEmail) return

  const subject = `SMS from ${formatPhone(from)} to ${formatPhone(to)}`
  const htmlContent = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a1a2e; color: #e5e5e5; padding: 24px; border-radius: 12px;">
        <h2 style="color: #10b981; margin: 0 0 16px 0;">📩 SMS Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #9ca3af; padding: 4px 0;">To:</td><td style="color: #e5e5e5; padding: 4px 0;">${formatPhone(to)}</td></tr>
          <tr><td style="color: #9ca3af; padding: 4px 0;">From:</td><td style="color: #e5e5e5; padding: 4px 0;">${formatPhone(from)}</td></tr>
          <tr><td style="color: #9ca3af; padding: 4px 0;">Time:</td><td style="color: #e5e5e5; padding: 4px 0;">${new Date().toLocaleString()}</td></tr>
        </table>
        <div style="background: #16213e; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 3px solid #10b981;">
          <p style="margin: 0; color: #e5e5e5; font-size: 15px;">${body}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">Powered by Nomadly Cloud Phone</p>
      </div>
    </div>`

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: { name: 'Nomadly Cloud Phone', email: MAIL_SENDER },
      to: [{ email: toEmail }],
      subject: subject,
      htmlContent: htmlContent,
    }, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      }
    })
    log(`SMS forwarded to email=${toEmail} from=${from}`)
  } catch (e) {
    log('forwardSmsToEmail Brevo error:', e.response?.data || e.message)
  }
}

// ── Forward SMS to user's webhook URL ──
async function forwardSmsToWebhook(webhookUrl, from, to, body) {
  if (!webhookUrl) return

  try {
    await axios.post(webhookUrl, {
      from: from,
      to: to,
      body: body,
      timestamp: new Date().toISOString(),
    }, { timeout: 5000 })
    log(`SMS forwarded to webhook=${webhookUrl} from=${from}`)
  } catch (e) {
    log('forwardSmsToWebhook error:', e.message)
  }
}

// ── Main handler for inbound SMS webhook from Telnyx ──
async function handleInboundSms(webhookData, bot, phoneNumbersOf, phoneLogs) {
  try {
    const payload = webhookData?.data?.payload || webhookData?.payload || webhookData
    if (!payload) return log('handleInboundSms: no payload')

    const from = payload.from?.phone_number || payload.from
    const toArr = payload.to || []
    const to = Array.isArray(toArr) ? (toArr[0]?.phone_number || toArr[0]) : toArr
    const body = payload.text || payload.body || ''

    if (!from || !to) return log('handleInboundSms: missing from/to')

    log(`Inbound SMS: ${from} → ${to}: "${body.substring(0, 50)}..."`)

    // Clean the "to" number for DB lookup
    const cleanTo = to.replace(/[^+\d]/g, '')

    // Look up number owner
    const allUsers = await phoneNumbersOf.find({}).toArray()
    let ownerChatId = null
    let numberConfig = null

    for (const user of allUsers) {
      const nums = user.val?.numbers || []
      const found = nums.find(n => n.phoneNumber.replace(/[^+\d]/g, '') === cleanTo && n.status === 'active')
      if (found) {
        ownerChatId = user._id
        numberConfig = found
        break
      }
    }

    if (!ownerChatId || !numberConfig) {
      return log(`handleInboundSms: no owner found for ${cleanTo}`)
    }

    const smsConfig = numberConfig.features?.smsForwarding || {}

    // Forward to Telegram
    if (smsConfig.toTelegram !== false) {
      await forwardSmsToTelegram(bot, ownerChatId, from, to, body)
    }

    // Forward to Email via Brevo
    if (smsConfig.toEmail) {
      await forwardSmsToEmail(smsConfig.toEmail, from, to, body)
    }

    // Forward to Webhook
    if (smsConfig.webhookUrl) {
      await forwardSmsToWebhook(smsConfig.webhookUrl, from, to, body)
    }

    // Log in DB
    if (phoneLogs?.insertOne) {
      await phoneLogs.insertOne({
        phoneNumber: cleanTo,
        chatId: ownerChatId,
        type: 'sms',
        direction: 'inbound',
        from: from,
        to: to,
        body: body,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (e) {
    log('handleInboundSms error:', e.message)
  }
}

module.exports = {
  forwardSmsToTelegram,
  forwardSmsToEmail,
  forwardSmsToWebhook,
  handleInboundSms,
}
