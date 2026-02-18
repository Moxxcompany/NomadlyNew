const http = require('http');

const CHAT_ID = 5590563715;
const USERNAME = 'onarrival1';
let updateId = 400000000;
let msgId = 100;

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

async function runSingleTest(target, carrier) {
  const steps = [
    '📲 Phone Leads & Validation',
    '🏦📲 Target Leads',
    target,
    'All Cities',
    'Mixed Area Codes',
    carrier,
    'No',
    '10',
    'International Format',
    'Skip',
    'USD'
  ];

  for (const step of steps) {
    await sendWebhook(step);
    await sleep(2500);
  }
  // Wait for generation
  await sleep(20000);
}

const target = process.argv[2];
const carrier = process.argv[3];

if (!target || !carrier) {
  console.error('Usage: node test_single.js "JPMorgan C" "Mixed Carriers"');
  process.exit(1);
}

console.log(`Testing: ${target} | ${carrier}`);
runSingleTest(target, carrier)
  .then(() => console.log('DONE'))
  .catch(e => console.error('ERROR:', e.message));
