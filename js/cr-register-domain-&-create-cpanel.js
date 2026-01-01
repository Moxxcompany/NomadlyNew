require('dotenv').config()
const axios = require('axios')
const { log } = require('console')
const sendEmail = require('./send-email')
const { assignPackageToUser, set, removeKeysFromDocumentById } = require('./db')
const { translation } = require('./translation')
const { rem } = require('./config')


const NAMEWORD_BASE_URL = process.env.NAMEWORD_BASE_URL
const CPANEL_API_KEY = process.env.NAMEWORD_API_KEY
const TELEGRAM_DEV_CHAT_ID = process.env.TELEGRAM_DEV_CHAT_ID

async function registerDomainAndCreateCpanel(send, info, keyboardButtons, state) {
  let headers, payload;
  let hostingType = info.hostingType.toLowerCase();

  let endpoint = `${NAMEWORD_BASE_URL}/${hostingType}/accounts/telegram`
  
  const lang = info?.userLanguage ?? 'en'
  send(info._id, translation('t.paymentSuccessFul', lang), rem)
  try {
    headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': CPANEL_API_KEY,
    }

    payload = {
      telegramId: info._id,
      name: info.username,
      email: info.email,
      domain: info.website_name,
      existingDomain: info.existingDomain || false,
      plan: info.plan,
      nameserver: info.nameserver,
    }

    let response = await axios.post(endpoint, payload, { headers })

    const statusCode = response.request.res.statusCode;

    if (statusCode === 201) {
      response = response.data.data

      send(info._id, translation('hP.successText', lang, info, response), keyboardButtons)

      assignPackageToUser(state, info._id, info.plan)

      try {
        await sendEmail(info, response)
      } catch (error) {
        log('Error sending email:', error)
        send(TELEGRAM_DEV_CHAT_ID, 'Error sending email', keyboardButtons)
      }

      set(state, info._id, 'action', 'none')

      removeKeysFromDocumentById(state, info._id, [
        'plan',
        'existingDomain',
        'price',
        'domain',
        'website_name',
        'nameserver',
        'originalPrice',
        'continue_domain_last_state',
        'email',
        'couponDiscount',
        'hostingPrice',
        'couponApplied',
        'totalPrice',
        'newPrice',
        'hostingType',
      ])
    } else {
      return send(info._id, translation('hP.support', lang, info.plan, statusCode), keyboardButtons)
    }
  } catch (err) {
    log('err registerDomain&CreateCPanel', { endpoint, headers, payload }, err.data, err?.response?.data)
    return send(info._id, translation('hP.support', lang, info.plan, 400), keyboardButtons)
  }
}

module.exports = { registerDomainAndCreateCpanel }
