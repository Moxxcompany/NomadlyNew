require('dotenv').config()

function sanitizeForTelegram(text) {
  let s = text
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  s = s.replace(/__(.+?)__/g, '<b>$1</b>')
  s = s.replace(/(?<!\w)\*([^*\n]+?)\*(?!\w)/g, '<i>$1</i>')
  s = s.replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '<i>$1</i>')
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>')
  s = s.replace(/^#{1,3}\s+/gm, '')
  s = s.replace(/<\/?(?!(?:b|i|u|s|code|pre|a)\b)[^>]*>/gi, '')
  for (const tag of ['b', 'i', 'code']) {
    const opens = (s.match(new RegExp(`<${tag}>`, 'gi')) || []).length
    const closes = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length
    for (let i = 0; i < opens - closes; i++) { s += `</${tag}>` }
    if (closes > opens) {
      let excess = closes - opens
      s = s.replace(new RegExp(`</${tag}>`, 'gi'), (match) => {
        if (excess > 0) { excess--; return '' }
        return match
      })
    }
  }
  return s.trim()
}

const tests = [
  ['**HEADLINE** text', '<b>HEADLINE</b> text', 'md bold to html'],
  ['__BOLD__', '<b>BOLD</b>', 'md underscore bold'],
  ['Use `code` here', 'Use <code>code</code> here', 'md backtick to code'],
  ['<b>Unclosed', '<b>Unclosed</b>', 'unclosed b tag'],
  ['Extra </b> close', 'Extra  close', 'orphan close b'],
  ['<b>OK</b> and **also**', '<b>OK</b> and <b>also</b>', 'mixed html+md'],
  ['<div>bad</div> <b>ok</b>', 'bad <b>ok</b>', 'strip div'],
  ['<span style="c">t</span>', 't', 'strip span'],
  ['<b>one</b> <b>two', '<b>one</b> <b>two</b>', 'second unclosed b'],
  ['## Heading\nText', 'Heading\nText', 'strip md header'],
  ['*italic text*', '<i>italic text</i>', 'italic conversion'],
  ['Plain text', 'Plain text', 'no change'],
  ['<p>para</p><b>bold</b>', 'para<b>bold</b>', 'strip p keep b'],
  ['<strong>s</strong>', 's', 'strip strong'],
  ['<a href="url">link</a>', '<a href="url">link</a>', 'keep a tag'],
  ['Price $20 for **1000**', 'Price $20 for <b>1000</b>', 'dollar sign safe'],
  ['**Bold** and **bold2**', '<b>Bold</b> and <b>bold2</b>', 'multiple bolds'],
]

let pass = 0
for (const [input, expected, name] of tests) {
  const got = sanitizeForTelegram(input)
  if (got === expected) {
    pass++
  } else {
    console.log(`FAIL: ${name}`)
    console.log(`  input:    ${JSON.stringify(input)}`)
    console.log(`  expected: ${JSON.stringify(expected)}`)
    console.log(`  got:      ${JSON.stringify(got)}`)
  }
}
console.log(`\n${pass}/${tests.length} passed`)
