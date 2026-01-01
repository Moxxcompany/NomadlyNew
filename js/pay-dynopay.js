/* global process */
const axios = require('axios')
require('dotenv').config()

const baseUrl = process.env.DYNO_PAY_BASE_URL
const apiKey = process.env.DYNO_PAY_API_KEY
const walletToken = process.env.DYNO_PAY_WALLET_TOKEN

const headers = {
  accept: 'application/json',
  'content-type': 'application/json',
  'x-api-key': apiKey,
  'Authorization' : `Bearer ${walletToken}`
}

const fetchSupportedCryptoCurrency = async () => {
  const options = {
    method: 'GET',
    url: `${baseUrl}/getSupportedCurrency`,
    headers: headers
  }

  try {
    const response = await axios.request(options)
    return response.data.data
  } catch (error) {
    console.error('Error in Fetching Crypto Currency', error?.message)
    return { error: error?.message }
  }
}

const getDynopayCryptoAddress = async (amount, currency, redirect_uri, meta_data) => {
  const options = {
    method: 'POST',
    url: `${baseUrl}/user/cryptoPayment`,
    headers: headers,
    data: {
      amount,
      currency,
      redirect_uri,
      meta_data
    },
  }
  
  try {
    const response = await axios.request(options)
    return response?.data?.data
  } catch (error) {
    console.error('Error in gettign Crypto address', error?.message)
    return { error: error?.message }
  }
}

const getDynopayCryptoPaymentStatus = async (address) => {
  const options = {
    method: 'GET',
    url: `${baseUrl}/user/getCryptoTransaction/${address}`,
    headers: headers
  }

  try {
    const response = await axios.request(options)
    return response.data.data
  } catch (error) {
    console.error('Error in Fetching Crypto Currency', error?.response?.data?.message)
    return false
  }
}

const fetchDynoPayTransaction = async (id) => {
  const options = {
    method: 'GET',
    url: `${baseUrl}/user/getSingleTransaction/${id}`,
    headers: headers
  }

  try {
    const response = await axios.request(options)
    return response.data.data
  } catch (error) {
    console.error('Error in Fetching transactions data', error?.response?.data?.message)
    return false
  }
}

module.exports = { fetchSupportedCryptoCurrency, getDynopayCryptoAddress, getDynopayCryptoPaymentStatus, fetchDynoPayTransaction }
