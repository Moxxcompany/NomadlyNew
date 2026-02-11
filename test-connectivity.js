// Comprehensive connectivity test for all services
require('dotenv').config();
const axios = require('axios');
const { MongoClient, ServerApiVersion } = require('mongodb');
const nodemailer = require('nodemailer');

const results = [];
const log = (service, status, detail) => {
  const icon = status === 'OK' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  results.push({ service, status, detail });
  console.log(`${icon} ${service}: ${detail}`);
};

async function testMongoDB() {
  const url = process.env.MONGO_URL;
  if (!url) return log('MongoDB', 'FAIL', 'MONGO_URL not set');
  
  const client = new MongoClient(url, {
    serverApi: { version: ServerApiVersion.v1 },
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
  });
  
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'test');
    await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    log('MongoDB', 'OK', `Connected. DB="${process.env.DB_NAME}" has ${collections.length} collections`);
  } catch (e) {
    log('MongoDB', 'FAIL', `Connection failed: ${e.message}`);
  } finally {
    try { await client.close(); } catch(e) {}
  }
}

async function testTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return log('Telegram Bot', 'FAIL', 'TELEGRAM_BOT_TOKEN not set');
  
  try {
    const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 10000 });
    if (res.data.ok) {
      log('Telegram Bot', 'OK', `Bot: @${res.data.result.username} (${res.data.result.first_name})`);
    } else {
      log('Telegram Bot', 'FAIL', `API returned ok=false: ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    log('Telegram Bot', 'FAIL', `${e.response?.data?.description || e.message}`);
  }
}

async function testOpenExchangeRates() {
  const key = process.env.API_KEY_CURRENCY_EXCHANGE;
  if (!key) return log('OpenExchangeRates', 'FAIL', 'API_KEY_CURRENCY_EXCHANGE not set');
  
  try {
    const res = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${key}`, { timeout: 10000 });
    if (res.data.rates && res.data.rates.NGN) {
      log('OpenExchangeRates', 'OK', `Working. 1 USD = ${res.data.rates.NGN} NGN`);
    } else {
      log('OpenExchangeRates', 'FAIL', 'No NGN rate in response');
    }
  } catch (e) {
    log('OpenExchangeRates', 'FAIL', `${e.response?.status}: ${e.response?.data?.description || e.message}`);
  }
}

async function testBitly() {
  const key = process.env.API_BITLY;
  if (!key) return log('Bitly', 'FAIL', 'API_BITLY not set');
  
  try {
    const res = await axios.get('https://api-ssl.bitly.com/v4/user', {
      headers: { Authorization: `Bearer ${key}` },
      timeout: 10000,
    });
    log('Bitly', 'OK', `Authenticated as: ${res.data.login || res.data.name || 'OK'}`);
  } catch (e) {
    log('Bitly', 'FAIL', `${e.response?.status}: ${e.response?.data?.message || e.message}`);
  }
}

async function testBlockBee() {
  const key = process.env.API_KEY_BLOCKBEE;
  if (!key) return log('BlockBee', 'FAIL', 'API_KEY_BLOCKBEE not set');
  
  try {
    const res = await axios.get(`https://api.blockbee.io/btc/info/?apikey=${key}`, { timeout: 10000 });
    if (res.data.status === 'success' || res.data.coin) {
      log('BlockBee', 'OK', `API key valid. Crypto payment enabled=${process.env.BLOCKBEE_CRYTPO_PAYMENT_ON}`);
    } else {
      log('BlockBee', 'WARN', `Response: ${JSON.stringify(res.data).substring(0, 200)}`);
    }
  } catch (e) {
    log('BlockBee', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testFincra() {
  const key = process.env.FINCRA_PUBLIC_KEY;
  const endpoint = process.env.FINCRA_ENDPOINT;
  if (!key || !endpoint) return log('Fincra', 'FAIL', 'FINCRA_PUBLIC_KEY or FINCRA_ENDPOINT not set');
  
  try {
    const url = endpoint.startsWith('http') ? endpoint : `https://${endpoint}`;
    const res = await axios.get(`${url}/profile/business/me`, {
      headers: { 'api-key': key },
      timeout: 10000,
    });
    log('Fincra', 'OK', `Connected. Business: ${res.data?.data?.name || JSON.stringify(res.data).substring(0, 100)}`);
  } catch (e) {
    log('Fincra', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testConnectReseller() {
  const key = process.env.API_KEY_CONNECT_RESELLER;
  if (!key) return log('ConnectReseller', 'FAIL', 'API_KEY_CONNECT_RESELLER not set');
  
  try {
    const res = await axios.get(`https://api.connectreseller.com/ConnectReseller/ESHOP/CheckAvailability?domainName=testcheckonly12345.com&apikey=${key}`, { timeout: 15000 });
    if (res.data) {
      log('ConnectReseller', 'OK', `API responding. Result: ${JSON.stringify(res.data).substring(0, 150)}`);
    }
  } catch (e) {
    log('ConnectReseller', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testSMTP() {
  const user = process.env.MAIL_AUTH_USER;
  const pass = process.env.MAIL_AUTH_PASSWORD;
  const host = process.env.MAIL_DOMAIN;
  const port = process.env.MAIL_PORT;
  if (!user || !pass || !host) return log('SMTP/Email', 'FAIL', 'Mail env vars not set');
  
  try {
    const transporter = nodemailer.createTransport({
      host: host,
      port: Number(port) || 587,
      secure: false,
      auth: { user, pass },
    });
    await transporter.verify();
    log('SMTP/Email', 'OK', `SMTP connection verified (${host}:${port})`);
  } catch (e) {
    log('SMTP/Email', 'FAIL', `${e.message}`);
  }
}

async function testDynoPay() {
  const baseUrl = process.env.DYNO_PAY_BASE_URL;
  const token = process.env.DYNOPAY_WALLET_TOKEN;
  if (!baseUrl || !token) return log('DynoPay', 'FAIL', 'DYNO_PAY_BASE_URL or DYNOPAY_WALLET_TOKEN not set');
  
  try {
    const res = await axios.get(`${baseUrl}/wallet/balance`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    log('DynoPay', 'OK', `API responding: ${JSON.stringify(res.data).substring(0, 150)}`);
  } catch (e) {
    log('DynoPay', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testNameword() {
  const baseUrl = process.env.NAMEWORD_BASE_URL;
  const key = process.env.NAMEWORD_API_KEY;
  if (!baseUrl) return log('Nameword/VPS', 'FAIL', 'NAMEWORD_BASE_URL not set');
  
  try {
    const res = await axios.get(`${baseUrl}/health`, { timeout: 10000 });
    log('Nameword/VPS', 'OK', `API reachable: ${res.status} ${JSON.stringify(res.data).substring(0, 100)}`);
  } catch (e) {
    if (e.response) {
      log('Nameword/VPS', 'WARN', `API reachable but returned ${e.response.status}: ${JSON.stringify(e.response.data || '').substring(0, 150)}`);
    } else {
      log('Nameword/VPS', 'FAIL', `Unreachable: ${e.message}`);
    }
  }
}

async function testRailwayAPI() {
  const key = process.env.API_KEY_RAILWAY;
  if (!key) return log('Railway API', 'FAIL', 'API_KEY_RAILWAY not set');
  
  try {
    const res = await axios.post('https://backboard.railway.app/graphql/v2', {
      query: '{ me { email name } }',
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      timeout: 10000,
    });
    if (res.data?.data?.me) {
      log('Railway API', 'OK', `Authenticated as: ${res.data.data.me.email || res.data.data.me.name}`);
    } else if (res.data?.errors) {
      log('Railway API', 'FAIL', `GraphQL error: ${res.data.errors[0]?.message}`);
    }
  } catch (e) {
    log('Railway API', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testRenderAPI() {
  const token = process.env.RENDER_AUTH_TOKEN;
  if (!token) return log('Render API', 'FAIL', 'RENDER_AUTH_TOKEN not set');
  
  try {
    const res = await axios.get('https://api.render.com/v1/owners', {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    log('Render API', 'OK', `Authenticated. Response: ${JSON.stringify(res.data).substring(0, 100)}`);
  } catch (e) {
    log('Render API', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testSelfURL() {
  const url = process.env.SELF_URL;
  if (!url) return log('SELF_URL', 'FAIL', 'SELF_URL not set');
  log('SELF_URL', 'OK', `Set to: ${url}`);
}

async function testNeutrino() {
  const userId = process.env.NEUTRINO_ID;
  const apiKey = process.env.NEUTRINO_KEY;
  if (!userId || !apiKey) return log('Neutrino', 'FAIL', 'NEUTRINO_ID or NEUTRINO_KEY not set');

  try {
    const res = await axios.get('https://neutrinoapi.net/ip-info?ip=1.1.1.1', {
      headers: { 'User-ID': userId, 'API-Key': apiKey },
      timeout: 10000,
    });
    if (res.data.valid !== undefined) {
      log('Neutrino', 'OK', `API working. Test response valid`);
    } else {
      log('Neutrino', 'WARN', `Unexpected response: ${JSON.stringify(res.data).substring(0, 100)}`);
    }
  } catch (e) {
    log('Neutrino', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

async function testTwilio() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return log('Twilio', 'FAIL', 'TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set');

  try {
    const res = await axios.get(`https://api.twilio.com/2010-04-01/Accounts/${sid}.json`, {
      auth: { username: sid, password: token },
      timeout: 10000,
    });
    log('Twilio', 'OK', `Account status: ${res.data.status}, name: ${res.data.friendly_name}`);
  } catch (e) {
    log('Twilio', 'FAIL', `${e.response?.status}: ${JSON.stringify(e.response?.data || e.message).substring(0, 200)}`);
  }
}

// Run all tests
(async () => {
  console.log('\n' + '═'.repeat(60));
  console.log('  🔍 COMPREHENSIVE CONNECTIVITY TEST');
  console.log('═'.repeat(60) + '\n');

  await testSelfURL();
  console.log('');
  
  console.log('─── Core Services ───');
  await testMongoDB();
  await testTelegramBot();
  console.log('');
  
  console.log('─── Payment Services ───');
  await testFincra();
  await testBlockBee();
  await testDynoPay();
  console.log('');

  console.log('─── Domain & Hosting ───');
  await testConnectReseller();
  await testRailwayAPI();
  await testRenderAPI();
  await testNameword();
  console.log('');

  console.log('─── Communication ───');
  await testSMTP();
  await testTelegramBot(); // Already tested, skip duplicate
  await testTwilio();
  await testNeutrino();
  console.log('');

  console.log('─── URL Shortening ───');
  await testBitly();
  await testOpenExchangeRates();
  console.log('');

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('  📊 SUMMARY');
  console.log('═'.repeat(60));
  
  const ok = results.filter(r => r.status === 'OK');
  const warn = results.filter(r => r.status === 'WARN');
  const fail = results.filter(r => r.status === 'FAIL');
  
  console.log(`\n  ✅ Working: ${ok.length}  |  ⚠️ Warnings: ${warn.length}  |  ❌ Failed: ${fail.length}\n`);
  
  if (fail.length > 0) {
    console.log('  ❌ BAD CREDENTIALS / FAILED SERVICES:');
    fail.forEach(f => console.log(`     • ${f.service}: ${f.detail}`));
  }
  if (warn.length > 0) {
    console.log('\n  ⚠️ WARNINGS:');
    warn.forEach(w => console.log(`     • ${w.service}: ${w.detail}`));
  }
  if (ok.length > 0) {
    console.log('\n  ✅ WORKING:');
    ok.forEach(o => console.log(`     • ${o.service}`));
  }
  
  console.log('\n' + '═'.repeat(60) + '\n');
  
  process.exit(0);
})();
