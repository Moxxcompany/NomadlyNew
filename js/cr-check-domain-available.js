/* global process */
require('dotenv').config()
const { checkDomainPriceOnline } = require('./cr-domain-price-get')

/**
 * Check if an existing domain is valid for hosting.
 * Since HostMeNow accepts any domain, we just validate format.
 */
const checkExistingDomain = async (websiteName, hostingType) => {
  try {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/
    if (!domainRegex.test(websiteName)) {
      return {
        available: false,
        chatMessage: 'Invalid domain format. Please enter a valid domain like example.com',
      }
    }

    return {
      available: true,
      chatMessage: `Domain ${websiteName} accepted.`,
    }
  } catch (error) {
    return {
      available: false,
      chatMessage: `An error occurred while checking domain. ${error.message}`,
    }
  }
}

/**
 * Check new domain availability and pricing via ConnectReseller.
 */
const getNewDomain = async (domainName, hostingType) => {
  try {
    const result = await checkDomainPriceOnline(domainName)

    if (!result.available) {
      return {
        available: false,
        originalPrice: 0,
        price: 0,
        chatMessage: result.message || 'Domain is not available',
        domainType: null,
      }
    }

    return {
      available: true,
      originalPrice: result.originalPrice,
      price: result.price,
      chatMessage: `The domain ${domainName} is available!`,
      domainType: result.price > 100 ? 'Premium' : 'Standard',
    }
  } catch (error) {
    console.error('getNewDomain error:', error)
    return {
      available: false,
      originalPrice: 0,
      price: 0,
      chatMessage: `An error occurred while checking domain availability. ${error.message}`,
      domainType: null,
    }
  }
}

module.exports = { checkExistingDomain, getNewDomain }
