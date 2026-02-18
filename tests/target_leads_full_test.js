const http = require('http');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const CHAT_ID = 5590563715;
const USERNAME = 'onarrival1';
let updateId = 600000000;
let msgId = 300;

const TARGETS = ['JPMorgan C', 'BOA', 'Wfargo Bnk', 'Citi Bnk', 'U.S Bnk'];
const CARRIERS = ['Mixed Carriers', 'T-mobile', 'Verizon Wireless', 'AT&T', 'Sprint', 'Metro PCS'];

let client, db, stateCol;

function sendWebhook(text) {
  return new Promise((resolve, reject) => {
    updateId++;
    msgId++;
    const payload = JSON.stringify({
      update_id: updateId,
      message: {
        message_id: msgId,
        from: { id: CHAT_ID, is_bot: false, first_name: 'Test', username: USERNAME },
        chat: { id: CHAT_ID, first_name: 'Test', username: USERNAME, type: 'private' },
        date: Math.floor(Date.now() / 1000),
        text: text,
      },
    });
    const options = {
      hostname: 'localhost',
      port: 8001,
      path: '/telegram/webhook',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    };
    const req = http.request(options, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForAction(expectedAction, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const info = await stateCol.findOne({ _id: CHAT_ID });
    if (info?.action === expectedAction) return true;
    await sleep(500);
  }
  const info = await stateCol.findOne({ _id: CHAT_ID });
  console.log(`  TIMEOUT waiting for action '${expectedAction}', current: '${info?.action}'`);
  return false;
}

async function sendAndWait(text, expectedAction) {
  await sendWebhook(text);
  const ok = await waitForAction(expectedAction);
  if (!ok) return false;
  return true;
}

async function resetState() {
  await stateCol.updateOne({ _id: CHAT_ID }, { $set: { action: 'none' } });
  await sleep(500);
}

async function runTest(target, carrier) {
  await resetState();

  const steps = [
    { text: '📲 Phone Leads & Validation', expect: 'phoneNumberLeads' },
    { text: '🏦📲 Target Leads', expect: 'targetSelectTarget' },
    { text: target, expect: 'targetSelectCity' },
    { text: 'All Cities', expect: 'targetSelectAreaCode' },
    { text: 'Mixed Area Codes', expect: 'buyLeadsSelectCarrier' },
    { text: carrier, expect: 'buyLeadsSelectCnam' },
    { text: 'No', expect: 'buyLeadsSelectAmount' },
    { text: '10', expect: 'buyLeadsSelectFormat' },
    { text: 'International Format', expect: 'askCouponbuyLeadsSelectFormat' },
    { text: 'Skip', expect: 'walletSelectCurrency' },
    { text: 'USD', expect: 'walletSelectCurrencyConfirm' },
    { text: 'Yes', expect: null },
  ];

  for (const step of steps) {
    const ok = await sendAndWait(step.text, step.expect);
    if (!ok) {
      console.log(`  FAILED at step: "${step.text}" (expected: ${step.expect})`);
      return 'FAILED_FLOW';
    }
  }

  // Final: Pay with USD - this triggers generation
  await sendWebhook('USD');

  // Wait for generation to complete (10 leads = ~30 seconds max)
  console.log(`  Paid. Waiting for leads generation...`);
  let generated = false;
  const start = Date.now();
  while (Date.now() - start < 60000) {
    const info = await stateCol.findOne({ _id: CHAT_ID });
    // After generation, action returns to none or a completed state
    if (info?.action === 'none' || info?.action === 'displayMainMenuButtons') {
      generated = true;
      break;
    }
    await sleep(2000);
  }
  if (!generated) {
    const info = await stateCol.findOne({ _id: CHAT_ID });
    console.log(`  Generation timeout. Current action: ${info?.action}`);
    return 'TIMEOUT_GENERATION';
  }
  return 'SUCCESS';
}

async function main() {
  client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  stateCol = db.collection('state');

  const results = [];
  let testNum = 0;
  const total = TARGETS.length * CARRIERS.length;

  for (const target of TARGETS) {
    for (const carrier of CARRIERS) {
      testNum++;
      const label = `${target} | ${carrier}`;
      console.log(`\n[${testNum}/${total}] ${label}`);
      try {
        const result = await runTest(target, carrier);
        console.log(`  => ${result}`);
        results.push({ target, carrier, status: result });
      } catch (err) {
        console.error(`  => ERROR: ${err.message}`);
        results.push({ target, carrier, status: 'ERROR', error: err.message });
      }
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  const passed = results.filter(r => r.status === 'SUCCESS').length;
  const failed = results.filter(r => r.status !== 'SUCCESS').length;
  results.forEach((r, i) => {
    const icon = r.status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${icon} ${i + 1}. ${r.target} | ${r.carrier} => ${r.status}${r.error ? ` (${r.error})` : ''}`);
  });
  console.log(`\nTotal: ${total} | Passed: ${passed} | Failed: ${failed}`);

  // Check final wallet balance
  const wallet = await db.collection('walletOf').findOne({ _id: CHAT_ID });
  const bal = (wallet?.usdIn || 0) - (wallet?.usdOut || 0);
  console.log(`Wallet balance: $${bal.toFixed(2)}`);

  await client.close();
}

main().catch(console.error);
