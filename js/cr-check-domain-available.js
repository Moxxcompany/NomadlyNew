/* global process */
require('dotenv').config()
const axios = require('axios')

const NAMEWORD_BASE_URL = process.env.NAMEWORD_BASE_URL;
const PERCENT_INCREASE_DOMAIN = 1 + Number(process.env.PERCENT_INCREASE_DOMAIN)

const checkExistingDomain = async (websiteName, hostingType) => {
  hostingType = hostingType.toLowerCase()

  try {
    const URL = `${NAMEWORD_BASE_URL}/${hostingType}/accounts/telegram/domain/existing?domain=${websiteName}`

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': process.env.NAMEWORD_API_KEY,
    }

    const response = await axios.get(URL, { headers })

    console.log('Response:', response);

    return {
      available: true,
      message: response.data.message,
    }
  } catch (error) {
    if (error?.response?.status === 409) {
      return {
        available: false,
        message: error.response.data.message,
      }
    } else {
      return {
        available: false,
        message: `An error occurred while checking domain availability. Maybe IP Not Whitelisted. ${error.response?.status}`,
      }
    }
  }
}

const getNewDomain = async (domainName, hostingType) => {
  hostingType = hostingType.toLowerCase()

  const apiUrl = `${NAMEWORD_BASE_URL}/${hostingType}/accounts/telegram/domain/new?domain=${domainName}`
  console.log("###API URL:",apiUrl)
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    'x-api-key': process.env.NAMEWORD_API_KEY,
  }

  console.log(apiUrl, headers);
  let domainPrice = 0;
  try {
    let response = await axios.get(apiUrl, { headers })
    console.log("###Response FROM API:",response)
    response = response.data.data
    console.log('Response Formatted:', response);

    let { registrationFee, registrationFees, domainType } = response.responseData;

    if (registrationFees) {
      domainPrice = registrationFees
    } else {
      domainPrice = registrationFee
    }

    let price = Math.ceil(domainPrice * PERCENT_INCREASE_DOMAIN)
    price = Math.max(price, 25) // Minimum $25

    const chatMessage = response.responseMsg.message;
    console.log(chatMessage);

    return {
      available: true,
      originalPrice: domainPrice < 1 ? 1 : domainPrice,
      price,
      chatMessage,
      domainType
    }
  } catch (error) {
    console.log("###error",error?.response?.data?.message)
    if (error?.response?.status === 409) {
      return {
        available: false,
        originalPrice: 0,
        price: 0,
        chatMessage: error.response.data.message,
      }
    } else {
      console.log("###error",error)
      const chatMessage = `An error occurred while checking domain availability. Maybe IP Not Whitelisted. ${error.response?.status}`
      console.error('checkDomainPriceOnline', error.response.data.errors)
      console.error('checkDomainPriceOnline error', error.response.data)

      return {
        available: false,
        originalPrice: 0,
        price: 0,
        chatMessage,
      }
    }
  }
}

module.exports = {checkExistingDomain, getNewDomain}
