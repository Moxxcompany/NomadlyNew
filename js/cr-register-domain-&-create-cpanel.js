require('dotenv').config()
const { log } = require('console')
const sendEmail = require('./send-email')
const { assignPackageToUser, set, removeKeysFromDocumentById } = require('./db')
const { translation } = require('./translation')
const { rem } = require('./config')
const { createAccount } = require('./hostmenow')

const PRODUCT_MAP = {
  'Basic Plan': 114,
  'Starter Plan': 111,
  'Intermediate Plan': 112,
}

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

async function registerDomainAndCreateCpanel(send, info, keyboardButtons, state, hostingTransactions) {
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

    log(`[HostMeNow] Creating account: domain=${domain}, plan=${info.plan}, productId=${productId}, serviceId=${serviceId}`)

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
      const response = {
        username: username,
        password: password,
        url: `https://${domain}:2083`,
        serviceId: serviceId,
        orderId: result.data?.order_id,
      }

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
              plan: info.plan,
              productId: productId,
              serviceId: serviceId,
              orderId: result.data?.order_id,
              invoiceId: result.data?.invoice_id,
              createdAt: new Date().toISOString(),
              status: 'active'
            }
          },
          { upsert: true }
        )
      }

      assignPackageToUser(state, info._id, info.plan)

      try {
        await sendEmail(info, response)
      } catch (error) {
        log('Error sending email:', error)
      }

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
