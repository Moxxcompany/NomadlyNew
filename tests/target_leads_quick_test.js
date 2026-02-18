const http = require('http');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const CHAT_ID = 5168006768;
const USERNAME = 'Hostbay_support';
let updateId = 700000000;
let msgId = 500;

let client, db, stateCol;

function sendWebhook(text) {
  return new Promise((resolve, reject) => {
    updateId++;
    msgId++;
    const payload = JSON.stringify({
      update_id: updateId,
      message: {
        message_id: msgId,
        from: { id: CHAT_ID, is_bot: false, first_name: 'Hostbay', username: USERNAME },
        chat: { id: CHAT_ID, first_name: 'Hostbay', username: USERNAME, type: 'private' },
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

async function waitForAction(expectedAction, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const info = await stateCol.findOne({ _id: CHAT_ID });
    if (info?.action === expectedAction) return true;
    await sleep(500);
  }
  const info = await stateCol.findOne({ _id: CHAT_ID });
  console.log(`  TIMEOUT: expected '${expectedAction}', got '${info?.action}'`);
  return false;
}

async function resetState() {
  await stateCol.updateOne({ _id: CHAT_ID }, { $set: { action: 'none' } });
  await sleep(1000);
}

async function runTest(target, carrier) {
  await resetState();
  console.log(`  Resetting state...`);

  const steps = [
    { text: '📲 Phone Leads & Validation', expect: 'phoneNumberLeads', label: 'Phone Leads menu' },
    { text: '🏦📲 Target Leads', expect: 'targetSelectTarget', label: 'Target Leads' },
    { text: target, expect: 'targetSelectCity', label: `Target: ${target}` },
    { text: 'All Cities', expect: 'targetSelectAreaCode', label: 'All Cities' },
    { text: 'Mixed Area Codes', expect: 'buyLeadsSelectCarrier', label: 'Mixed Area Codes' },
    { text: carrier, expect: 'buyLeadsSelectCnam', label: `Carrier: ${carrier}` },
    { text: 'No', expect: 'buyLeadsSelectAmount', label: 'CNAM: No' },
    { text: '10', expect: 'buyLeadsSelectFormat', label: 'Amount: 10' },
    { text: 'International Format', expect: 'askCouponbuyLeadsSelectFormat', label: 'Format: International' },
    { text: 'Skip', expect: 'walletSelectCurrency', label: 'Coupon: Skip' },
    { text: 'USD', expect: 'walletSelectCurrencyConfirm', label: 'Currency: USD' },
  ];

  for (const step of steps) {
    process.stdout.write(`  ${step.label}...`);
    await sendWebhook(step.text);
    const ok = await waitForAction(step.expect);
    if (!ok) {
      console.log(` FAIL`);
      return 'FAILED_FLOW';
    }
    console.log(` OK`);
  }

  // Confirm payment
  process.stdout.write(`  Confirm: Yes...`);
  await sendWebhook('Yes');
  console.log(` SENT`);

  // Wait for generation
  console.log(`  Generating 10 leads...`);
  const start = Date.now();
  while (Date.now() - start < 120000) {
    const info = await stateCol.findOne({ _id: CHAT_ID });
    if (info?.action === 'none' || info?.action === 'displayMainMenuButtons') {
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`  Generation complete in ${elapsed}s`);
      return 'SUCCESS';
    }
    await sleep(3000);
  }
  const info = await stateCol.findOne({ _id: CHAT_ID });
  console.log(`  Generation timeout. Action: ${info?.action}`);
  return 'TIMEOUT';
}

async function main() {
  client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  db = client.db(process.env.DB_NAME);
  stateCol = db.collection('state');

  const tests = [
    { target: 'JPMorgan C', carrier: 'Mixed Carriers' },
    { target: 'JPMorgan C', carrier: 'T-mobile' },
  ];

  const results = [];
  for (let i = 0; i < tests.length; i++) {
    const { target, carrier } = tests[i];
    console.log(`\n${'='.repeat(50)}`);
    console.log(`TEST ${i + 1}/${tests.length}: ${target} | ${carrier}`);
    console.log('='.repeat(50));
    const status = await runTest(target, carrier);
    results.push({ target, carrier, status });
    console.log(`RESULT: ${status}`);
  }

  // Final wallet check
  const wallet = await db.collection('walletOf').findOne({ _id: CHAT_ID });
  const bal = (wallet?.usdIn || 0) - (wallet?.usdOut || 0);

  console.log(`\n${'='.repeat(50)}`);
  console.log('SUMMARY');
  console.log('='.repeat(50));
  results.forEach((r, i) => {
    const icon = r.status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${icon} ${r.target} | ${r.carrier} => ${r.status}`);
  });
  console.log(`Wallet: $${bal.toFixed(2)}`);
  await client.close();
}

main().catch(console.error);
