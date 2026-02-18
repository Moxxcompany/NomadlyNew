const http = require('http');

const CHAT_ID = 5590563715;
const USERNAME = 'onarrival1';
let updateId = 400000000;
let msgId = 100;

const TARGETS = ['JPMorgan C', 'BOA', 'Wfargo Bnk', 'Citi Bnk', 'U.S Bnk'];
const CARRIERS = ['Mixed Carriers', 'T-mobile', 'Verizon Wireless', 'AT&T', 'Sprint', 'Metro PCS'];

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

async function runTest(target, carrier) {
  const label = `[${target} | ${carrier}]`;
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${label} Starting...`);

  // Step 0: Phone Leads menu
  await sendWebhook('📲 Phone Leads & Validation');
  await sleep(2000);

  // Step 1: Target Leads
  await sendWebhook('🏦📲 Target Leads');
  await sleep(2000);

  // Step 2: Select target
  await sendWebhook(target);
  await sleep(2000);

  // Step 3: All Cities
  await sendWebhook('All Cities');
  await sleep(2000);

  // Step 4: Mixed Area Codes
  await sendWebhook('Mixed Area Codes');
  await sleep(2000);

  // Step 5: Select carrier
  await sendWebhook(carrier);
  await sleep(2000);

  // Step 6: No CNAM
  await sendWebhook('No');
  await sleep(2000);

  // Step 7: Amount = 10
  await sendWebhook('10');
  await sleep(2000);

  // Step 8: International Format
  await sendWebhook('International Format');
  await sleep(2000);

  // Step 9: Skip coupon
  await sendWebhook('Skip');
  await sleep(2000);

  // Step 10: Pay with USD
  await sendWebhook('USD');
  await sleep(2000);

  // Wait for lead generation to complete (10 leads should be fast)
  console.log(`${label} Payment sent. Waiting for generation...`);
  await sleep(15000);

  console.log(`${label} DONE`);
  return true;
}

async function main() {
  const results = [];
  let testNum = 0;
  const total = TARGETS.length * CARRIERS.length;

  for (const target of TARGETS) {
    for (const carrier of CARRIERS) {
      testNum++;
      console.log(`\n>>> TEST ${testNum}/${total}`);
      try {
        await runTest(target, carrier);
        results.push({ target, carrier, status: 'SENT' });
      } catch (err) {
        console.error(`FAILED: ${target} | ${carrier}: ${err.message}`);
        results.push({ target, carrier, status: 'FAILED', error: err.message });
      }
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.target} | ${r.carrier} => ${r.status}${r.error ? ` (${r.error})` : ''}`);
  });
  console.log(`\nTotal: ${results.length}, Sent: ${results.filter(r => r.status === 'SENT').length}, Failed: ${results.filter(r => r.status === 'FAILED').length}`);
}

main().catch(console.error);
