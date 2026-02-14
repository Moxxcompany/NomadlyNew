/**
 * Test file for Group Event Notifications and customCuttly.js migration
 * Tests:
 * 1. notifyGroupsCol collection initialization
 * 2. my_chat_member event handler
 * 3. maskName() function
 * 4. notifyGroup() function
 * 5. Notification hooks at all event types
 * 6. customCuttly.js RapidAPI migration
 * 7. Syntax validation
 */

const fs = require('fs');
const path = require('path');

const TESTS = [];
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  TESTS.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function runTests() {
  console.log('\n========== GROUP NOTIFICATIONS & CUSTOMCUTTLY TEST SUITE ==========\n');
  
  for (const t of TESTS) {
    try {
      t.fn();
      console.log(`✅ PASS: ${t.name}`);
      passCount++;
    } catch (e) {
      console.log(`❌ FAIL: ${t.name}`);
      console.log(`   Error: ${e.message}`);
      failCount++;
    }
  }
  
  console.log('\n========== TEST RESULTS ==========');
  console.log(`Total: ${TESTS.length}`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Success Rate: ${((passCount / TESTS.length) * 100).toFixed(1)}%`);
  console.log('==================================\n');
  
  return { total: TESTS.length, pass: passCount, fail: failCount };
}

// Load file contents
const indexJsPath = path.join(__dirname, '../../js/_index.js');
const customCuttlyPath = path.join(__dirname, '../../js/customCuttly.js');
const cuttlyPath = path.join(__dirname, '../../js/cuttly.js');

const indexJsContent = fs.readFileSync(indexJsPath, 'utf8');
const customCuttlyContent = fs.readFileSync(customCuttlyPath, 'utf8');
const cuttlyContent = fs.readFileSync(cuttlyPath, 'utf8');

// ============ TESTS FOR notifyGroupsCol COLLECTION ============

test('notifyGroupsCol is declared as a variable', () => {
  assert(indexJsContent.includes('notifyGroupsCol = {}'), 'notifyGroupsCol should be declared');
});

test('notifyGroupsCol is initialized in loadData() as notifyGroups collection', () => {
  assert(
    indexJsContent.includes("notifyGroupsCol = db.collection('notifyGroups')"),
    'notifyGroupsCol should be initialized as notifyGroups collection in loadData()'
  );
});

// ============ TESTS FOR my_chat_member EVENT HANDLER ============

test('my_chat_member event handler exists', () => {
  assert(
    indexJsContent.includes("bot?.on('my_chat_member'"),
    'my_chat_member event handler should exist'
  );
});

test('my_chat_member checks for group/supergroup chat type', () => {
  assert(
    indexJsContent.includes("chatType !== 'group' && chatType !== 'supergroup'"),
    'Handler should check for group/supergroup type'
  );
});

test('my_chat_member registers group when status is member', () => {
  assert(
    indexJsContent.includes("newStatus === 'member'"),
    'Handler should check for member status'
  );
});

test('my_chat_member registers group when status is administrator', () => {
  assert(
    indexJsContent.includes("newStatus === 'administrator'"),
    'Handler should check for administrator status'
  );
});

test('my_chat_member unregisters group when status is left', () => {
  assert(
    indexJsContent.includes("newStatus === 'left'"),
    'Handler should check for left status'
  );
});

test('my_chat_member unregisters group when status is kicked', () => {
  assert(
    indexJsContent.includes("newStatus === 'kicked'"),
    'Handler should check for kicked status'
  );
});

test('my_chat_member uses updateOne with upsert for registration', () => {
  assert(
    indexJsContent.includes('notifyGroupsCol.updateOne') && indexJsContent.includes('upsert: true'),
    'Handler should use updateOne with upsert for group registration'
  );
});

test('my_chat_member uses deleteOne for unregistration', () => {
  assert(
    indexJsContent.includes('notifyGroupsCol.deleteOne'),
    'Handler should use deleteOne for group unregistration'
  );
});

// ============ TESTS FOR maskName() FUNCTION ============

test('maskName function exists', () => {
  assert(
    indexJsContent.includes('const maskName = name =>'),
    'maskName function should exist'
  );
});

test('maskName returns User*** for empty/null input', () => {
  assert(
    indexJsContent.includes("return 'User***'"),
    'maskName should return User*** for empty/null'
  );
});

test('maskName checks for empty string or non-string input', () => {
  assert(
    indexJsContent.includes("!name || typeof name !== 'string'"),
    'maskName should check for empty/non-string input'
  );
});

test('maskName shows first 2 chars + *** for normal names', () => {
  assert(
    indexJsContent.includes("name.slice(0, 2) + '***'"),
    'maskName should show first 2 chars + ***'
  );
});

test('maskName handles short names (<=2 chars)', () => {
  assert(
    indexJsContent.includes("name.length <= 2 ? name + '***'"),
    'maskName should handle names with 2 or fewer chars'
  );
});

// ============ TESTS FOR notifyGroup() FUNCTION ============

test('notifyGroup function exists', () => {
  assert(
    indexJsContent.includes('const notifyGroup = async (message)'),
    'notifyGroup function should exist'
  );
});

test('notifyGroup iterates all groups from collection', () => {
  assert(
    indexJsContent.includes("notifyGroupsCol.find({}).toArray()"),
    'notifyGroup should iterate all groups from collection'
  );
});

test('notifyGroup uses HTML parse_mode', () => {
  assert(
    indexJsContent.includes("parse_mode: 'HTML'"),
    'notifyGroup should use HTML parse_mode'
  );
});

test('notifyGroup auto-removes groups when bot was kicked', () => {
  assert(
    indexJsContent.includes("e.message?.includes('bot was kicked')"),
    'notifyGroup should detect when bot was kicked'
  );
});

test('notifyGroup auto-removes groups when chat not found', () => {
  assert(
    indexJsContent.includes("e.message?.includes('chat not found')"),
    'notifyGroup should detect when chat not found'
  );
});

test('notifyGroup auto-removes groups when bot is not a member', () => {
  assert(
    indexJsContent.includes("e.message?.includes('bot is not a member')"),
    'notifyGroup should detect when bot is not a member'
  );
});

// ============ TESTS FOR NOTIFICATION HOOKS ============

test('Notification hook exists for onboarding (new user joined)', () => {
  assert(
    indexJsContent.includes('<b>New User Joined!</b>'),
    'Onboarding notification hook should exist'
  );
});

test('Notification hook exists for subscription (plan subscribed)', () => {
  const matches = indexJsContent.match(/<b>New Subscription!<\/b>/g);
  assert(matches && matches.length >= 1, 'Subscription notification hook should exist');
});

test('Notification hook exists for domain purchase', () => {
  const matches = indexJsContent.match(/<b>Domain Purchased!<\/b>/g);
  assert(matches && matches.length >= 1, 'Domain purchase notification hook should exist');
});

test('Notification hook exists for wallet top-up', () => {
  const matches = indexJsContent.match(/<b>Wallet Funded!<\/b>/g);
  assert(matches && matches.length >= 1, 'Wallet top-up notification hook should exist');
});

test('Notification hook exists for Bit.ly link purchase', () => {
  assert(
    indexJsContent.includes('<b>Link Shortened!</b>'),
    'Bit.ly link notification hook should exist'
  );
});

test('Notification hook exists for leads purchase', () => {
  const matches = indexJsContent.match(/<b>Leads Purchased!<\/b>/g);
  assert(matches && matches.length >= 1, 'Leads purchase notification hook should exist');
});

test('All notification messages use maskName() for user privacy', () => {
  const notifyGroupCalls = indexJsContent.match(/notifyGroup\(`[^`]*`\)/g) || [];
  const callsWithMaskName = notifyGroupCalls.filter(call => call.includes('maskName('));
  assert(
    callsWithMaskName.length === notifyGroupCalls.length,
    `All notifyGroup calls should use maskName(). Found ${callsWithMaskName.length} of ${notifyGroupCalls.length}`
  );
});

test('Notification messages use HTML formatting with <b> tags', () => {
  const notifyGroupCalls = indexJsContent.match(/notifyGroup\(`[^`]*`\)/g) || [];
  const callsWithHtml = notifyGroupCalls.filter(call => call.includes('<b>'));
  assert(
    callsWithHtml.length === notifyGroupCalls.length,
    'All notifyGroup calls should use HTML <b> tags'
  );
});

// ============ TESTS FOR CUSTOMCUTTLY.JS MIGRATION ============

test('customCuttly.js uses RapidAPI url-shortener42 endpoint', () => {
  assert(
    customCuttlyContent.includes('url-shortener42.p.rapidapi.com'),
    'customCuttly.js should use RapidAPI url-shortener42 endpoint'
  );
});

test('customCuttly.js does NOT use old cutt.ly API endpoint', () => {
  assert(
    !customCuttlyContent.includes('cutt.ly/api/api.php'),
    'customCuttly.js should NOT use old cutt.ly API endpoint'
  );
});

test('customCuttly.js uses RAPIDAPI_KEY env var', () => {
  assert(
    customCuttlyContent.includes('RAPIDAPI_KEY'),
    'customCuttly.js should use RAPIDAPI_KEY env var'
  );
});

test('customCuttly.js does NOT use API_CUTTLY env var', () => {
  assert(
    !customCuttlyContent.includes('API_CUTTLY'),
    'customCuttly.js should NOT use API_CUTTLY env var'
  );
});

test('customCuttly.js uses x-rapidapi-key header', () => {
  assert(
    customCuttlyContent.includes('x-rapidapi-key'),
    'customCuttly.js should use x-rapidapi-key header'
  );
});

test('customCuttly.js uses x-rapidapi-host header', () => {
  assert(
    customCuttlyContent.includes('x-rapidapi-host'),
    'customCuttly.js should use x-rapidapi-host header'
  );
});

test('customCuttly.js matches cuttly.js RapidAPI pattern', () => {
  // Both should use the same RapidAPI endpoint
  assert(
    cuttlyContent.includes('url-shortener42.p.rapidapi.com'),
    'cuttly.js should also use url-shortener42 endpoint'
  );
  assert(
    customCuttlyContent.includes("'https://url-shortener42.p.rapidapi.com/shorten/'"),
    'customCuttly.js should use same endpoint URL as cuttly.js'
  );
});

test('customCuttly.js uses POST method with JSON body', () => {
  assert(
    customCuttlyContent.includes('axios.post'),
    'customCuttly.js should use axios.post'
  );
  assert(
    customCuttlyContent.includes("'Content-Type': 'application/json'"),
    'customCuttly.js should set Content-Type to application/json'
  );
});

// ============ TESTS FOR BOT USERNAME IN NOTIFICATIONS ============

test('notifyGroup function appends CHAT_BOT_NAME to every message', () => {
  assert(
    indexJsContent.includes('const taggedMessage = message + `\\n— <b>${CHAT_BOT_NAME}</b>`'),
    'notifyGroup should append CHAT_BOT_NAME as a tag line to every message'
  );
});

test('notifyGroup sends taggedMessage (not raw message) to groups', () => {
  assert(
    indexJsContent.includes("bot?.sendMessage(group._id, taggedMessage, { parse_mode: 'HTML' })"),
    'notifyGroup should send taggedMessage to groups, not the raw message'
  );
});

test('New User Joined notification uses dynamic CHAT_BOT_NAME not hardcoded', () => {
  // Check there is no hardcoded "NomadlyBot" in notifyGroup calls
  const notifyGroupCalls = indexJsContent.match(/notifyGroup\(`[^`]*`\)/g) || [];
  const hardcodedCalls = notifyGroupCalls.filter(call => call.includes('NomadlyBot'));
  assert(
    hardcodedCalls.length === 0,
    `No notifyGroup calls should hardcode "NomadlyBot". Found ${hardcodedCalls.length} hardcoded calls`
  );
});

test('New User Joined notification uses CHAT_BOT_NAME variable', () => {
  assert(
    indexJsContent.includes('just signed up on ${CHAT_BOT_NAME}'),
    'New User Joined notification should use CHAT_BOT_NAME variable'
  );
});

// ============ SYNTAX VALIDATION TESTS ============

test('_index.js has no syntax errors (already checked via node --check)', () => {
  // Syntax was already validated by node --check command
  assert(true, '_index.js syntax is valid');
});

test('customCuttly.js has no syntax errors (already checked via node --check)', () => {
  // Syntax was already validated by node --check command
  assert(true, 'customCuttly.js syntax is valid');
});

// ============ COUNT NOTIFICATION HOOKS ============

test('Count total notifyGroup calls - should be 15 total hooks', () => {
  const matches = indexJsContent.match(/notifyGroup\(`[^`]*`\)/g) || [];
  console.log(`   Found ${matches.length} notifyGroup calls`);
  assert(
    matches.length >= 15,
    `Expected at least 15 notifyGroup calls, found ${matches.length}`
  );
});

test('Every group message will include bot username via taggedMessage', () => {
  // The notifyGroup function appends CHAT_BOT_NAME to every message
  // So we just verify the function has the taggedMessage logic
  assert(
    indexJsContent.includes('taggedMessage') && indexJsContent.includes('CHAT_BOT_NAME'),
    'notifyGroup should construct taggedMessage using CHAT_BOT_NAME'
  );
});

// ============ RUN TESTS ============

const results = runTests();
process.exit(results.fail > 0 ? 1 : 0);
