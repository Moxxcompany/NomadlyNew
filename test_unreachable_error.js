#!/usr/bin/env node

/**
 * Test script to verify isUnreachableError helper function functionality
 * Tests the specific error messages mentioned in the review request
 */

const fs = require('fs');
const path = require('path');

// Load the auto-promo.js file content to extract the isUnreachableError function
const autoPromoPath = path.join(__dirname, 'js/auto-promo.js');
const autoPromoContent = fs.readFileSync(autoPromoPath, 'utf8');

// Extract the isUnreachableError function for testing
const funcMatch = autoPromoContent.match(/function isUnreachableError\(error\) \{[\s\S]*?\n  \}/);
if (!funcMatch) {
  console.error('❌ Could not extract isUnreachableError function');
  process.exit(1);
}

// Evaluate the function in our test context
let isUnreachableError;
eval(`isUnreachableError = ${funcMatch[0]}`);

// Test cases for error messages that should trigger auto opt-out
const testCases = [
  { message: 'chat not found', expected: true, description: '400 chat not found error' },
  { message: 'user is deactivated', expected: true, description: 'user deactivated error' },
  { message: 'bot was blocked', expected: true, description: '403 bot blocked error' },
  { message: 'have no rights to send a message', expected: true, description: 'no rights to send message error' },
  { message: 'rate limited', expected: false, description: 'rate limiting error (should not trigger opt-out)' },
  { message: 'network error', expected: false, description: 'generic network error' },
  { message: '', expected: false, description: 'empty error message' },
  { message: undefined, expected: false, description: 'undefined error message' }
];

console.log('\n🧪 Testing isUnreachableError Helper Function\n');

let passed = 0;
let failed = 0;

testCases.forEach(({ message, expected, description }, index) => {
  const error = { message };
  const result = isUnreachableError(error);
  
  if (result === expected) {
    console.log(`✅ PASS: Test ${index + 1} - ${description}`);
    passed++;
  } else {
    console.log(`❌ FAIL: Test ${index + 1} - ${description}`);
    console.log(`   Expected: ${expected}, Got: ${result}`);
    failed++;
  }
});

console.log('\n📊 Test Results:');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%\n`);

// Test that opt-out logic exists in sendPromoToUser
const optOutCheck = autoPromoContent.includes('code === 403 || isUnreachableError(error)');
const skipRetryPhotoCheck = autoPromoContent.includes('if (isUnreachableError(photoErr)) throw photoErr');
const skipRetryHtmlCheck = autoPromoContent.includes('if (isUnreachableError(parseErr)) throw parseErr');

console.log('🔍 Verifying Integration Points:');
console.log(`✅ Auto opt-out on 403 OR isUnreachableError: ${optOutCheck ? 'PASS' : 'FAIL'}`);
console.log(`✅ Skip retry cascade in photo fallback: ${skipRetryPhotoCheck ? 'PASS' : 'FAIL'}`);
console.log(`✅ Skip retry cascade in HTML parse retry: ${skipRetryHtmlCheck ? 'PASS' : 'FAIL'}`);

const allIntegrationPassed = optOutCheck && skipRetryPhotoCheck && skipRetryHtmlCheck;

console.log('\n🎯 Overall Results:');
console.log(`Function Tests: ${failed === 0 ? 'PASS' : 'FAIL'}`);
console.log(`Integration Tests: ${allIntegrationPassed ? 'PASS' : 'FAIL'}`);

process.exit((failed === 0 && allIntegrationPassed) ? 0 : 1);