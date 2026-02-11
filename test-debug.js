// Debug sanitizer step by step
const input = '**HEADLINE** text'
let s = input

console.log('Input:', JSON.stringify(s))

// Step 1: markdown bold
s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
console.log('After md bold:', JSON.stringify(s))

// Step 2: underscore bold
s = s.replace(/__(.+?)__/g, '<b>$1</b>')
console.log('After __ bold:', JSON.stringify(s))

// Step 3: italic
s = s.replace(/(?<!\w)\*([^*\n]+?)\*(?!\w)/g, '<i>$1</i>')
console.log('After italic:', JSON.stringify(s))

// Step 4: underscore italic
s = s.replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '<i>$1</i>')
console.log('After _ italic:', JSON.stringify(s))

// Step 5: backtick
s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>')
console.log('After backtick:', JSON.stringify(s))

// Step 6: headers
s = s.replace(/^#{1,3}\s+/gm, '')
console.log('After headers:', JSON.stringify(s))

// Step 7: strip tags
s = s.replace(/<\/?(?!(?:b|i|u|s|code|pre|a)\b)[^>]*>/gi, '')
console.log('After strip:', JSON.stringify(s))

// Step 8: balance
for (const tag of ['b', 'i', 'code']) {
  const opens = (s.match(new RegExp(`<${tag}>`, 'gi')) || []).length
  const closes = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length
  console.log(`  ${tag}: opens=${opens} closes=${closes}`)
  for (let i = 0; i < opens - closes; i++) { s += `</${tag}>` }
  if (closes > opens) {
    let excess = closes - opens
    s = s.replace(new RegExp(`</${tag}>`, 'gi'), (match) => {
      if (excess > 0) { excess--; return '' }
      return match
    })
  }
}
console.log('Final:', JSON.stringify(s))

console.log('\n--- Test 2: <a> tag ---')
let s2 = '<a href="url">link</a>'
console.log('Input:', JSON.stringify(s2))
s2 = s2.replace(/<\/?(?!(?:b|i|u|s|code|pre|a)\b)[^>]*>/gi, '')
console.log('After strip:', JSON.stringify(s2))
