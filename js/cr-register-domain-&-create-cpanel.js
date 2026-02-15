require('dotenv').config()
const { log } = require('console')
const sendEmail = require('./send-email')
const { assignPackageToUser, set, removeKeysFromDocumentById } = require('./db')
const { translation } = require('./translation')
const { rem } = require('./config')
const { createAccount, getServerName } = require('./hostmenow')
const { buyDomainOnline } = require('./cr-domain-register')
const { saveServerInDomain } = require('./cr-dns-record-add')
const { sleep } = require('./utils')

const PRODUCT_MAP = {
  'Basic Plan': 114,
  'Starter Plan': 111,
  'Intermediate Plan': 112,
}

const HOSTMENOW_SERVER_IP = process.env.HOSTMENOW_SERVER_IP

function generateUsername(domain) {
  const clean = domain.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return clean.slice(0, 8) || 'user' + Date.now().toString().slice(-4)
}

function generatePassword(length = 14) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function registerDomainAndCreateCpanel(send, info, keyboardButtons, state, hostingTransactions, bot) {
  const lang = info?.userLanguage ?? 'en'
  send(info._id, translation('t.paymentSuccessFul', lang), rem)

  try {
    const domain = info.website_name
    const username = generateUsername(domain)
    const password = generatePassword()
    const serviceId = `nmb_${info._id}_${Date.now()}`
    const productId = PRODUCT_MAP[info.plan]

    if (!productId) {
      log('No product mapping found for plan:', info.plan)
      return send(info._id, translation('hP.support', lang, info.plan, 'Invalid plan'), keyboardButtons)
    }

    // ─── Step 1: Register domain via ConnectReseller (if new domain) ───
    if (info.existingDomain === false) {
      log(`[Hosting] Registering new domain via ConnectReseller: ${domain}`)
      send(info._id, `Registering domain <b>${domain}</b>...`, rem)

      const { error: buyDomainError } = await buyDomainOnline(domain)
      if (buyDomainError) {
        log(`[Hosting] Domain registration failed: ${buyDomainError}`)
        send(info._id, `Domain registration failed for <b>${domain}</b>: ${buyDomainError}. Proceeding with hosting setup...`, rem)
        // Don't block hosting creation — domain might already be registered or user can retry
      } else {
        log(`[Hosting] Domain registered successfully: ${domain}`)
        send(info._id, `Domain <b>${domain}</b> registered successfully!`, rem)
      }
    }

    // ─── Step 2: Create cPanel account on HostMeNow ───
    log(`[HostMeNow] Creating account: domain=${domain}, plan=${info.plan}, productId=${productId}, serviceId=${serviceId}`)
    send(info._id, `Creating your cPanel hosting account...`, rem)

    const result = await createAccount({
      serviceid: serviceId,
      billingcycle: 'monthly',
      qty: '1',
      domain: domain,
      username: username,
      password: password,
      selected_product: String(productId)
    })

    log('[HostMeNow] CreateAccount response:', JSON.stringify(result))

    if (result.status === 'success') {
      const orderId = result.data?.order_id
      const invoiceId = result.data?.invoice_id

      // ─── Step 3: Get server IP from HostMeNow ───
      let serverIP = HOSTMENOW_SERVER_IP
      try {
        const serverInfo = await getServerName(serviceId)
        log('[HostMeNow] GetServerName response:', JSON.stringify(serverInfo))
        // GetServerName returns server_name (e.g. "cPanel"), not IP
        // We rely on HOSTMENOW_SERVER_IP env var for the actual IP
      } catch (err) {
        log('[HostMeNow] GetServerName error (non-blocking):', err.message)
      }

      const response = {
        username: username,
        password: password,
        url: `https://${domain}:2083`,
        serviceId: serviceId,
        orderId: orderId,
        serverIP: serverIP,
      }

      // Send success message
      send(info._id, translation('hP.successText', lang, info, response), keyboardButtons)

      // Store hosting info in MongoDB
      if (hostingTransactions?.updateOne) {
        await hostingTransactions.updateOne(
          { _id: serviceId },
          {
            $set: {
              chatId: info._id,
              domain: domain,
              username: username,
              email: info.email,
              plan: info.plan,
              productId: productId,
              serviceId: serviceId,
              orderId: orderId,
              invoiceId: invoiceId,
              existingDomain: info.existingDomain,
              serverIP: serverIP,
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active'
            }
          },
          { upsert: true }
        )
      }

      assignPackageToUser(state, info._id, info.plan)

      // ─── Step 4: Set DNS A record (if domain was registered via ConnectReseller) ───
      if (info.existingDomain === false && serverIP) {
        log(`[Hosting] Setting DNS A record: ${domain} → ${serverIP}`)
        send(info._id, `Setting up DNS for <b>${domain}</b>...`, rem)

        // Wait for ConnectReseller to fully register the domain
        await sleep(65000)

        const { error: dnsError } = await saveServerInDomain(domain, serverIP, 'A')
        if (dnsError) {
          log(`[Hosting] DNS A record failed: ${dnsError}`)
          send(info._id, `DNS auto-setup encountered an issue: ${dnsError}\n\nPlease manually set an A record for <b>${domain}</b> pointing to <b>${serverIP}</b>`, keyboardButtons)
        } else {
          log(`[Hosting] DNS A record set successfully: ${domain} → ${serverIP}`)
          send(info._id, `DNS A record set! <b>${domain}</b> → <b>${serverIP}</b>\nPropagation may take a few minutes.`, keyboardButtons)

          // Start DNS propagation check
          if (bot) {
            const { regularCheckDns } = require('./utils')
            regularCheckDns(bot, info._id, domain, lang)
          }
        }
      } else if (info.existingDomain === true && serverIP) {
        // For existing domains, user needs to update DNS manually
        send(info._id, `Please update your domain's DNS A record:\n\n<b>${domain}</b> → <b>${serverIP}</b>\n\nThis should be done at your domain registrar.`, keyboardButtons)
      } else if (!serverIP) {
        send(info._id, `<b>Note:</b> Please contact support to get the server IP and update your domain's DNS A record.`, keyboardButtons)
      }

      // Send email
      try {
        await sendEmail(info, response)
      } catch (error) {
        log('Error sending email:', error)
      }

      // Clean up state
      set(state, info._id, 'action', 'none')
      removeKeysFromDocumentById(state, info._id, [
        'plan',
        'existingDomain',
        'price',
        'domain',
        'website_name',
        'email',
        'couponDiscount',
        'hostingPrice',
        'couponApplied',
        'totalPrice',
        'newPrice',
        'hostingType',
      ])
    } else {
      log('HostMeNow CreateAccount error:', result)
      return send(info._id, translation('hP.support', lang, info.plan, result.message || 'Account creation failed'), keyboardButtons)
    }
  } catch (err) {
    log('err registerDomain&CreateCPanel', err)
    return send(info._id, translation('hP.support', lang, info.plan, 400), keyboardButtons)
  }
}

module.exports = { registerDomainAndCreateCpanel }
