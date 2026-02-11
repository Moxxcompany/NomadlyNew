require('dotenv').config()
const OpenAI = require('openai')
const ai = new OpenAI({ apiKey: process.env.APP_OPEN_API_KEY })

// Copy of sanitizer from auto-promo.js
function sanitizeForTelegram(text) {
  let s = text
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  s = s.replace(/__(.+?)__/g, '<b>$1</b>')
  s = s.replace(/(?<!\w)\*([^*\n]+?)\*(?!\w)/g, '<i>$1</i>')
  s = s.replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '<i>$1</i>')
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>')
  s = s.replace(/^#{1,3}\s+/gm, '')
  s = s.replace(/<(?!\/?(?:b|i|u|s|code|pre|a)\b)[^>]*>/gi, '')
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

const themes = ['domains', 'shortener', 'leads']
const langs = ['en', 'fr', 'zh', 'hi']

const SERVICE_CONTEXT = {
  domains: { services: 'DMCA-ignored offshore domain registration', details: ['.sbs .com .net .org 400+ extensions','Offshore with total privacy','Pay with BTC ETH USDT'], cta: 'Register Domain Names', crossPromo: '@hostbay_bot for hosting' },
  shortener: { services: 'URL shortener with custom domains', details: ['Custom branded short URLs','Real-time analytics','Bitly integration'], cta: 'URL Shortener', crossPromo: '@hostbay_bot for hosting' },
  leads: { services: 'Phone lead generation', details: ['Buy leads by country/state','SMS and voice ready','$20 per 1000'], cta: 'HQ SMS Lead', crossPromo: '@hostbay_bot for hosting' },
}
const LANG_NAMES = { en: 'English', fr: 'French', zh: 'Chinese', hi: 'Hindi' }

async function generate(theme, lang) {
  const ctx = SERVICE_CONTEXT[theme]
  const prompt = `Write a short Telegram promo for ${ctx.services} in ${LANG_NAMES[lang]}. Use ONLY HTML tags <b>bold</b>. No markdown **bold**. Keep under 900 chars. End with tap <b>${ctx.cta}</b>. Add ----- then ${ctx.crossPromo}. No emoji. Return ONLY message text.`
  const res = await ai.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 400, temperature: 0.9 })
  return res.choices[0].message.content.trim()
}

async function run() {
  const pairs = [['domains','en'], ['shortener','fr'], ['leads','zh'], ['domains','hi']]
  
  for (const [theme, lang] of pairs) {
    console.log(`\n===== ${theme}/${lang} =====`)
    const raw = await generate(theme, lang)
    const clean = sanitizeForTelegram(raw)
    
    // Check for issues
    const hasMarkdownBold = /\*\*/.test(clean)
    const hasMarkdownItalic = /(?<!\w)\*[^*]+\*(?!\w)/.test(clean)
    const hasUnclosedB = (clean.match(/<b>/gi) || []).length !== (clean.match(/<\/b>/gi) || []).length
    const over1024 = clean.length > 1024
    
    console.log('RAW:', raw.substring(0, 100) + '...')
    console.log('CLEAN:', clean.substring(0, 100) + '...')
    console.log(`Length: ${clean.length} | MD bold: ${hasMarkdownBold ? 'LEAK!' : 'clean'} | MD italic: ${hasMarkdownItalic ? 'LEAK!' : 'clean'} | Unclosed <b>: ${hasUnclosedB ? 'YES!' : 'none'} | Over 1024: ${over1024 ? 'YES!' : 'ok'}`)
  }
}

run().catch(e => console.log('Error:', e.message))
