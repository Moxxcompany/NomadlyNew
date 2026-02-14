// Reset free trial links for a user
// Usage: CHAT_ID=123456789 FREE_LINKS=5 node scripts/reset-free-links.js

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const CHAT_ID = Number(process.env.CHAT_ID);
const LINKS = Number(process.env.FREE_LINKS_RESET || 5);

if (!CHAT_ID) {
  console.error('Usage: CHAT_ID=123456789 node scripts/reset-free-links.js');
  process.exit(1);
}

(async () => {
  const client = new MongoClient(process.env.MONGO_URL, { serverApi: { version: ServerApiVersion.v1 } });
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  const freeShortLinksOf = db.collection('freeShortLinksOf');

  const before = await freeShortLinksOf.findOne({ _id: CHAT_ID });
  console.log('Before:', before ? before.val : 'no record');

  await freeShortLinksOf.updateOne({ _id: CHAT_ID }, { $set: { val: LINKS } }, { upsert: true });

  const after = await freeShortLinksOf.findOne({ _id: CHAT_ID });
  console.log('After:', after.val);
  console.log(`Free links for chatId ${CHAT_ID} set to ${LINKS}`);

  await client.close();
})();
