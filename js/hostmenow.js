const axios = require('axios')
require('dotenv').config()

const API_ENDPOINT = 'https://hostmenow.org/backstage/modules/addons/products_reseller/api.php'
const API_KEY = process.env.HOSTMENOW_API_KEY

async function sendRequest(action, params = {}) {
  try {
    const response = await axios.post(API_ENDPOINT, {
      api_key: API_KEY,
      action: action,
      params: params
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000
    })
    return response.data
  } catch (error) {
    console.error(`HostMeNow API error (${action}):`, error?.response?.data || error.message)
    return { status: 'error', message: error?.response?.data?.message || error.message }
  }
}

async function getProducts() {
  return await sendRequest('Get_Products')
}

async function createAccount(params) {
  return await sendRequest('CreateAccount', params)
}

async function suspendAccount(serviceId) {
  return await sendRequest('SuspendAccount', { serviceid: serviceId })
}

async function unsuspendAccount(serviceId) {
  return await sendRequest('UnsuspendAccount', { serviceid: serviceId })
}

async function terminateAccount(serviceId) {
  return await sendRequest('TerminateAccount', { serviceid: serviceId })
}

async function changePassword(serviceId, newPassword) {
  return await sendRequest('ChangePassword', { serviceid: serviceId, password: newPassword })
}

async function changePackage(serviceId, params = {}) {
  return await sendRequest('ChangePackage', { serviceid: serviceId, ...params })
}

async function getUsage(serviceId) {
  return await sendRequest('get_Bandwidth_Disk_Usage', { serviceid: serviceId })
}

async function createSSOSession(serviceId, app) {
  const params = { serviceid: serviceId }
  if (app) params.app = app
  return await sendRequest('CreateSSOSession', params)
}

async function getServerName(serviceId) {
  return await sendRequest('GetServerName', { serviceid: serviceId })
}

module.exports = {
  getProducts,
  createAccount,
  suspendAccount,
  unsuspendAccount,
  terminateAccount,
  changePassword,
  changePackage,
  getUsage,
  createSSOSession,
  getServerName
}
