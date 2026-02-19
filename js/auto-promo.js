// Auto-Promo System - Sends 2 daily promotional messages to all bot users
// AI-powered dynamic messages with static fallback + admin alerts + daily coupons

const schedule = require('node-schedule')
const { log } = require('console')
const BROADCAST_CONFIG = require('./broadcast-config.js')

// OpenAI - optional dependency (graceful fallback if missing)
let OpenAI = null
try { OpenAI = require('openai') } catch { log('[AutoPromo] openai package not installed, using static messages only') }

// OpenAI client (lazy init)
let openai = null
function getOpenAI() {
  if (!openai && OpenAI && process.env.APP_OPEN_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.APP_OPEN_API_KEY })
  }
  return openai
}

// Banner images for each promo theme
const PROMO_BANNERS = {
  domains: 'https://static.prod-images.emergentagent.com/jobs/f44f3da8-af55-473d-8bbc-825abdd733f0/images/0d50cd0cdecf61aea40ebbfd3f1ab29b9f5bb0d16790f42800c73cd15f6347ff.png',
  shortener: 'https://static.prod-images.emergentagent.com/jobs/f44f3da8-af55-473d-8bbc-825abdd733f0/images/b827dbbd54971ca845894edd375b003e6d8218014282ec27a95e838c12cbd679.png',
  leads: 'https://static.prod-images.emergentagent.com/jobs/f44f3da8-af55-473d-8bbc-825abdd733f0/images/134e81dc1f0118d89cd0d3ba0d9d25fc840a6b27709a0dcb31278bf1649f35da.png',
  cloudphone: 'https://static.prod-images.emergentagent.com/jobs/f44f3da8-af55-473d-8bbc-825abdd733f0/images/0d50cd0cdecf61aea40ebbfd3f1ab29b9f5bb0d16790f42800c73cd15f6347ff.png',
}

// Language names for AI prompt
const LANG_NAMES = { en: 'English', fr: 'French', zh: 'Chinese (Simplified)', hi: 'Hindi' }

// Service details for AI context (keeps promos accurate)
const SERVICE_CONTEXT = {
  domains: {
    services: 'DMCA-ignored offshore domain registration',
    details: [
      '.sbs, .com, .net, .org and 400+ extensions',
      'Offshore registration with total content privacy',
      'Instant DNS setup, pay with crypto or bank',
      'Free .sbs/.xyz domains with subscription plans',
    ],
    cta: 'Register Domain Names',
    crossPromo: 'Need phone leads? Tap HQ SMS Lead',
  },
  shortener: {
    services: 'Shortit — URL shortener with custom domain branding',
    details: [
      'FREE: 5 short links for every new user',
      'Custom branded URLs with your own domain',
      'Real-time click analytics',
      'Unlimited links with subscription plans',
    ],
    cta: 'URL Shortener',
    crossPromo: 'Register DMCA-ignored domains — tap Register Domain Names',
  },
  leads: {
    services: 'Phone number lead generation and validation',
    details: [
      'Verified leads filtered by country, state, area code, carrier',
      'Starting from $20/1000 leads, validate for $15/1000',
      'Bulk download with instant delivery',
    ],
    cta: 'HQ SMS Lead',
    crossPromo: 'Shorten campaign links — tap URL Shortener',
  },
  cloudphone: {
    services: 'CloudPhone — virtual phone numbers with IVR, SMS & SIP',
    details: [
      'Virtual numbers in US, Canada, UK, Puerto Rico & 30+ countries',
      'IVR auto-attendant with multilingual AI voice greetings',
      'Call forwarding, voicemail, SMS to Telegram & SIP access',
      'Plans from $5/mo with included minutes & SMS',
    ],
    cta: 'Cloud Phone',
    crossPromo: 'Need leads? Tap HQ SMS Lead',
  },
}

/**
 * Sanitize AI output for Telegram HTML
 */
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
    for (let i = 0; i < opens - closes; i++) s += `</${tag}>`
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

/**
 * Generate a dynamic promo message using OpenAI (shorter ~300 chars)
 */
async function generateDynamicPromo(theme, lang) {
  const ai = getOpenAI()
  if (!ai) return null

  const ctx = SERVICE_CONTEXT[theme]
  const langName = LANG_NAMES[lang] || 'English'

  const prompt = `You are a Telegram bot copywriter. Write a SHORT promo for ${ctx.services}.

Key points:
${ctx.details.map(d => '- ' + d).join('\n')}

Rules:
- Write in ${langName}
- Use ONLY <b>bold</b> and <code>code</code> HTML tags
- Start with a catchy <b>HEADLINE</b>
- Keep under 300 characters total
- End with: tap <b>${ctx.cta}</b>
- Add "-----" then: ${ctx.crossPromo}
- No emoji characters

Return ONLY the message text.`

  try {
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
      temperature: 0.9,
    })
    let content = res.choices?.[0]?.message?.content?.trim()
    if (!content || content.length < 30) return null
    content = sanitizeForTelegram(content)
    if (content.length <= 1024) return content
    const truncated = content.substring(0, 500)
    const lastNewline = truncated.lastIndexOf('\n')
    return sanitizeForTelegram(lastNewline > 200 ? truncated.substring(0, lastNewline) : truncated)
  } catch (error) {
    log(`[AutoPromo] OpenAI error: ${error.message}`)
    return null
  }
}

// Timezone offsets per language
const TIMEZONE_OFFSETS = { en: 0, fr: 1, zh: 8, hi: 5.5 }
const LOCAL_TIMES = [{ hour: 10, minute: 0 }, { hour: 16, minute: 0 }]
const THEMES = ['domains', 'shortener', 'leads', 'cloudphone']
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// ─── Promo Messages (50% shorter) ──────────────────────────

const promoMessages = {
  en: {
    domains: [
      `<b>YOUR SITE, YOUR RULES</b>

DMCA-ignored domains — no takedowns.
.sbs .com .net .org & 400+ TLDs
Offshore, private, instant DNS setup.

Tap <b>Register Domain Names</b>

-----
Need leads? Tap <b>HQ SMS Lead</b>`,

      `<b>DOMAIN FLASH DEAL</b>

Why risk your site being taken down?
DMCA-ignored + full DNS control.
Free .sbs/.xyz with plans. Crypto accepted.

Tap <b>Register Domain Names</b>

-----
5 free short links — tap <b>URL Shortener</b>`,

      `<b>OWN YOUR DIGITAL IDENTITY</b>

Offshore, privacy-first domains.
400+ extensions. Manage DNS from the bot.

Tap <b>Register Domain Names</b>

-----
Buy targeted leads — tap <b>HQ SMS Lead</b>`,

      `<b>STOP WORRYING ABOUT TAKEDOWNS</b>

DMCA-ignored. Content stays up.
Crypto & bank payments. All TLDs.

<b>Register Domain Names</b> — start now!

-----
Shorten links — tap <b>URL Shortener</b>`,

      `<b>TRUSTED BY THOUSANDS</b>

Zero DMCA takedowns. Full privacy.
Fast DNS. Crypto payments for anonymity.

Tap <b>Register Domain Names</b>

-----
Verified phone leads — tap <b>HQ SMS Lead</b>`,
    ],

    shortener: [
      `<b>SHORTEN. BRAND. TRACK.</b>

5 FREE trial links — no payment needed!
Custom branded URLs + real-time analytics.

Tap <b>URL Shortener</b>

-----
DMCA-ignored domains — tap <b>Register Domain Names</b>`,

      `<b>5 FREE SHORT LINKS</b>

Brand links with YOUR domain.
Track every click. Upgrade anytime.

Tap <b>URL Shortener</b>

-----
Targeted leads — tap <b>HQ SMS Lead</b>`,

      `<b>BETTER LINKS = MORE CLICKS</b>

<code>bit.ly/3xK9mQ2</code> vs <code>yourbrand.com/deals</code>
5 free trial links to start.

<b>URL Shortener</b> — try Shortit free!

-----
Register your brand domain — tap <b>Register Domain Names</b>`,

      `<b>POWERFUL LINK SHORTENING</b>

FREE: 5 Shortit trial links!
Custom domain shortener + analytics.

Type <b>/start</b> then <b>URL Shortener</b>

-----
Buy leads by area code — tap <b>HQ SMS Lead</b>`,

      `<b>SMART LINKS = 34% MORE CLICKS</b>

Branded short links. 5 FREE to start.
Unlimited with subscription plans.

Tap <b>URL Shortener</b>

-----
DMCA-ignored domains — tap <b>Register Domain Names</b>`,
    ],

    leads: [
      `<b>HQ PHONE LEADS</b>

Filter by country, state, area, carrier.
From $20/1K. Validate for $15/1K.

Tap <b>HQ SMS Lead</b>

-----
Shorten campaign links — tap <b>URL Shortener</b>`,

      `<b>STOP WASTING ON BAD LEADS</b>

Verified leads by country & area.
CNAM lookup. Bulk instant delivery.

Tap <b>HQ SMS Lead</b>

-----
Offshore domains — tap <b>Register Domain Names</b>`,

      `<b>VALIDATE BEFORE YOU SEND</b>

Sending to dead numbers = burning cash.
Upload list, get only ACTIVE numbers. $15/1K.

<b>HQ SMS Lead</b> then <b>Validate PhoneLeads</b>

-----
Brand your links — tap <b>URL Shortener</b>`,

      `<b>FRESH LEADS = FRESH REVENUE</b>

USA | UK | Canada | Australia & more.
SMS & Voice leads. 1K to 5K+ per order.

<b>HQ SMS Lead</b> then <b>Buy PhoneLeads</b>

-----
DMCA-ignored domains — tap <b>Register Domain Names</b>`,

      `<b>SCALE YOUR SMS MARKETING</b>

Pick country, carrier, quantity.
Pay with crypto or wallet. Instant delivery.

Tap <b>HQ SMS Lead</b>

-----
Shorten campaign links — tap <b>URL Shortener</b>`,
    ],

    cloudphone: [
      `<b>YOUR OWN PHONE NUMBER</b>

Virtual numbers in US, Canada, UK & 30+ countries.
IVR, voicemail, SMS to Telegram. From $5/mo.

Tap <b>Cloud Phone</b>

-----
Need leads? Tap <b>HQ SMS Lead</b>`,

      `<b>CLOUD PHONE — BY SPEECHCUE</b>

Get a real number. Forward calls anywhere.
SIP access + multilingual AI greetings.

Tap <b>Cloud Phone</b>

-----
Shorten links — tap <b>URL Shortener</b>`,

      `<b>PROFESSIONAL IVR IN MINUTES</b>

"Press 1 for sales, 2 for support" — set up in the bot.
AI voices in 20 languages. Business plan: unlimited minutes.

Tap <b>Cloud Phone</b>

-----
DMCA-ignored domains — tap <b>Register Domain Names</b>`,

      `<b>NO SIM NEEDED</b>

Virtual numbers with call forwarding + voicemail.
SMS forwarded straight to your Telegram.

Tap <b>Cloud Phone</b>

-----
Targeted leads — tap <b>HQ SMS Lead</b>`,

      `<b>$5/mo VIRTUAL NUMBER</b>

100 min + 50 SMS. Call forwarding included.
Upgrade for IVR, recording & SIP.

Tap <b>Cloud Phone</b>

-----
5 free short links — tap <b>URL Shortener</b>`,
    ],
  },

  fr: {
    domains: [
      `<b>VOTRE SITE, VOS REGLES</b>

Domaines DMCA-ignores — aucun retrait.
400+ extensions. DNS instantane. Crypto accepte.

Appuyez sur <b>Enregistrer des noms de domaine</b>

-----
Liens courts gratuits — <b>Raccourcisseur d'URL</b>`,

      `<b>OFFRE FLASH DOMAINES</b>

Enregistrement offshore + DNS complet.
.sbs/.xyz gratuits avec abonnements.

Tapez <b>/start</b> puis <b>Enregistrer des noms de domaine</b>

-----
Leads cibles — <b>Pistes SMS HQ</b>`,

      `<b>IDENTITE NUMERIQUE</b>

Enregistrement offshore, confidentialite totale.
400+ extensions. Gerez DNS depuis le bot.

<b>Enregistrer des noms de domaine</b>

-----
5 liens gratuits — <b>Raccourcisseur d'URL</b>`,

      `<b>ZERO SUPPRESSIONS DMCA</b>

Contenu en ligne — garanti.
Paiements crypto & bancaires.

<b>Enregistrer des noms de domaine</b> — commencez !

-----
Leads par zone — <b>Pistes SMS HQ</b>`,

      `<b>CONFIANCE DE MILLIERS</b>

Protection vie privee totale.
DNS rapide. Paiements crypto anonymes.

Appuyez sur <b>Enregistrer des noms de domaine</b>

-----
Leads cibles — <b>Pistes SMS HQ</b>`,
    ],

    shortener: [
      `<b>RACCOURCISSEZ. PERSONNALISEZ. ANALYSEZ.</b>

5 liens gratuits — aucun paiement requis !
URLs personnalisees + analyse temps reel.

Appuyez sur <b>Raccourcisseur d'URL</b>

-----
Domaines DMCA — <b>Enregistrer des noms de domaine</b>`,

      `<b>5 LIENS COURTS GRATUITS</b>

Personnalisez avec VOTRE domaine.
Suivez chaque clic. Illimite avec abo.

Appuyez sur <b>Raccourcisseur d'URL</b>

-----
Domaines DMCA — <b>Enregistrer des noms de domaine</b>`,

      `<b>MEILLEURS LIENS POUR VOTRE MARQUE</b>

<code>bit.ly/3xK9mQ2</code> vs <code>votremarque.com/offres</code>
5 liens d'essai gratuits.

<b>Raccourcisseur d'URL</b> — essayez Shortit !

-----
Domaines offshore — <b>Enregistrer des noms de domaine</b>`,

      `<b>LIENS PUISSANTS</b>

5 liens Shortit gratuits !
Raccourcisseur domaine personnalise + analyses.

Tapez <b>/start</b> puis <b>Raccourcisseur d'URL</b>

-----
Leads cibles — <b>Pistes SMS HQ</b>`,

      `<b>34% DE CLICS EN PLUS</b>

Liens personnalises. 5 essais GRATUITS !
Illimite avec les plans.

Appuyez sur <b>Raccourcisseur d'URL</b>

-----
Domaines DMCA — <b>Enregistrer des noms de domaine</b>`,
    ],

    leads: [
      `<b>LEADS HQ — VOS CAMPAGNES</b>

Filtrez par pays, etat, indicatif, operateur.
A partir de 20$/1000. Validez 15$/1000.

Appuyez sur <b>Pistes SMS HQ</b>

-----
Liens courts — <b>Raccourcisseur d'URL</b>`,

      `<b>STOP GASPILLER SUR DE MAUVAIS LEADS</b>

Leads verifies par pays & zone.
CNAM inclus. Livraison instantanee.

Appuyez sur <b>Pistes SMS HQ</b>

-----
Domaines DMCA — <b>Enregistrer des noms de domaine</b>`,

      `<b>VALIDEZ AVANT D'ENVOYER</b>

Numeros morts = cash brule.
Uploadez, recuperez les ACTIFS. 15$/1K.

<b>Pistes SMS HQ</b> puis <b>Valider les leads</b>

-----
Domaines offshore — <b>Enregistrer des noms de domaine</b>`,

      `<b>LEADS FRAIS = REVENUS FRAIS</b>

USA | UK | Canada | Australie.
SMS & voix. 1K a 5K+ par commande.

<b>Pistes SMS HQ</b> puis <b>Acheter des leads</b>

-----
Domaines DMCA — <b>Enregistrer des noms de domaine</b>`,

      `<b>MARKETING SMS — PASSEZ A L'ECHELLE</b>

Pays, operateur, quantite. Crypto ou wallet.
Validez votre liste existante !

Appuyez sur <b>Pistes SMS HQ</b>

-----
Liens courts — <b>Raccourcisseur d'URL</b>`,
    ],

    cloudphone: [
      `<b>VOTRE PROPRE NUMERO</b>

Numeros virtuels US, Canada, UK et 30+ pays.
IVR, messagerie vocale, SMS vers Telegram. Des $5/mois.

Appuyez sur <b>Cloud Phone</b>

-----
Leads cibles — <b>Pistes SMS HQ</b>`,

      `<b>CLOUD PHONE — PAR SPEECHCUE</b>

Transfert d'appels + acces SIP + accueil vocal IA multilingue.

Appuyez sur <b>Cloud Phone</b>

-----
Liens courts — <b>Raccourcisseur d'URL</b>`,

      `<b>IVR PROFESSIONNEL EN MINUTES</b>

Voix IA en 20 langues. Plan Business: minutes illimitees.

Appuyez sur <b>Cloud Phone</b>

-----
Domaines offshore — <b>Enregistrer des noms de domaine</b>`,

      `<b>PAS DE SIM REQUISE</b>

Numeros virtuels + transfert + messagerie vocale.
SMS directement dans votre Telegram.

Appuyez sur <b>Cloud Phone</b>

-----
Leads — <b>Pistes SMS HQ</b>`,

      `<b>NUMERO VIRTUEL A $5/MOIS</b>

100 min + 50 SMS. Transfert inclus.
Passez au plan Pro pour SIP & IVR.

Appuyez sur <b>Cloud Phone</b>

-----
5 liens gratuits — <b>Raccourcisseur d'URL</b>`,
    ],
  },

  zh: {
    domains: [
      `<b>您的网站 您做主</b>

无视DMCA域名 — 无删除
400+扩展名 离岸注册 即时DNS

点击 <b>注册域名</b>

-----
电话线索 — <b>HQ 短信线索</b>`,

      `<b>域名限时优惠</b>

无视DMCA + 完全DNS控制
订阅赠送免费域名 加密支付

点击 <b>注册域名</b>

-----
免费链接 — <b>URL 缩短器</b>`,

      `<b>拥有数字身份</b>

离岸隐私域名 400+扩展
直接从机器人管理DNS

点击 <b>注册域名</b>

-----
免费链接 — <b>URL 缩短器</b>`,

      `<b>不再担心删除</b>

内容保持在线 加密与银行支付
所有域名一处管理

<b>注册域名</b> — 立即开始!

-----
注册域名 — <b>注册域名</b>`,

      `<b>数千用户信赖</b>

零DMCA删除 完全隐私 极速DNS
加密支付保护匿名

点击 <b>注册域名</b>

-----
免费链接 — <b>URL 缩短器</b>`,
    ],

    shortener: [
      `<b>缩短 品牌化 追踪</b>

5个免费试用链接 — 无需付款!
品牌短链接 + 实时分析

点击 <b>URL 缩短器</b>

-----
电话线索 — <b>HQ 短信线索</b>`,

      `<b>5个免费短链接</b>

自定义域名品牌 追踪每次点击
随时升级无限链接

点击 <b>URL 缩短器</b>

-----
缩短链接 — <b>URL 缩短器</b>`,

      `<b>更好的链接 更多点击</b>

<code>bit.ly/3xK9mQ2</code> vs <code>品牌.com/优惠</code>
5个免费试用链接

<b>URL 缩短器</b> — 免费试用!

-----
注册域名 — <b>注册域名</b>`,

      `<b>强大链接缩短</b>

5个免费Shortit链接!
自定义域名 + 分析数据

输入 <b>/start</b> 然后 <b>URL 缩短器</b>

-----
免费链接 — <b>URL 缩短器</b>`,

      `<b>聪明链接 34%更多点击</b>

品牌短链接 5个免费开始
订阅计划享无限链接

点击 <b>URL 缩短器</b>

-----
缩短链接 — <b>URL 缩短器</b>`,
    ],

    leads: [
      `<b>高质量电话线索</b>

按国家 州 区号 运营商筛选
$20/1K起 验证$15/1K

点击 <b>HQ 短信线索</b>

-----
缩短链接 — <b>URL 缩短器</b>`,

      `<b>停止浪费劣质线索</b>

验证线索 CNAM查询 即时交付

点击 <b>HQ 短信线索</b>

-----
缩短链接 — <b>URL 缩短器</b>`,

      `<b>发送前先验证</b>

向无效号码发短信就是烧钱
上传列表 只返回有效号码 $15/1K

<b>HQ 短信线索</b> 然后 <b>验证电话线索</b>

-----
注册域名 — <b>注册域名</b>`,

      `<b>新鲜线索 新鲜收入</b>

美国 英国 加拿大 澳大利亚
SMS和语音线索 每单1K至5K+

<b>HQ 短信线索</b> 然后 <b>购买电话线索</b>

-----
缩短链接 — <b>URL 缩短器</b>`,

      `<b>扩大SMS营销</b>

选择国家 运营商 数量
加密或钱包支付 即时交付

点击 <b>HQ 短信线索</b>

-----
缩短链接 — <b>URL 缩短器</b>`,
    ],
  },

  hi: {
    domains: [
      `<b>आपकी वेबसाइट आपके नियम</b>

DMCA-अनदेखा डोमेन — कोई हटाव नहीं
400+ एक्सटेंशन ऑफशोर तुरंत DNS

<b>डोमेन नाम पंजीकृत करें</b> दबाएं

-----
लीड्स — <b>HQ एसएमएस लीड</b>`,

      `<b>डोमेन फ्लैश डील</b>

DMCA-अनदेखा + पूर्ण DNS नियंत्रण
प्लान के साथ मुफ्त डोमेन क्रिप्टो स्वीकृत

<b>/start</b> फिर <b>डोमेन नाम पंजीकृत करें</b>

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,

      `<b>डिजिटल पहचान बनाएं</b>

ऑफशोर गोपनीयता डोमेन 400+ एक्सटेंशन
बॉट से DNS प्रबंधित करें

<b>डोमेन नाम पंजीकृत करें</b> दबाएं

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,

      `<b>हटाव की चिंता छोड़ें</b>

सामग्री ऑनलाइन — गारंटी
क्रिप्टो और बैंक भुगतान स्वीकृत

<b>डोमेन नाम पंजीकृत करें</b> — शुरू करें!

-----
DMCA डोमेन — <b>डोमेन नाम पंजीकृत करें</b>`,

      `<b>हजारों की भरोसेमंद पसंद</b>

शून्य DMCA हटाव पूर्ण गोपनीयता
तेज DNS क्रिप्टो भुगतान

<b>डोमेन नाम पंजीकृत करें</b> दबाएं

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,
    ],

    shortener: [
      `<b>छोटा करें ब्रांड बनाएं ट्रैक करें</b>

5 मुफ्त लिंक — कोई भुगतान नहीं!
ब्रांडेड URL + रियल-टाइम एनालिटिक्स

<b>URL छोटा करें</b> दबाएं

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,

      `<b>5 मुफ्त शॉर्ट लिंक</b>

कस्टम डोमेन से ब्रांड बनाएं
हर क्लिक ट्रैक अनलिमिटेड अपग्रेड

<b>URL छोटा करें</b> दबाएं

-----
DMCA डोमेन — <b>डोमेन नाम पंजीकृत करें</b>`,

      `<b>बेहतर लिंक का हकदार</b>

<code>bit.ly/3xK9mQ2</code> vs <code>ब्रांड.com/ऑफर</code>
5 मुफ्त ट्रायल लिंक

<b>URL छोटा करें</b> — Shortit आजमाएं!

-----
डोमेन — <b>डोमेन नाम पंजीकृत करें</b>`,

      `<b>शक्तिशाली लिंक शॉर्टनिंग</b>

5 मुफ्त Shortit लिंक!
कस्टम डोमेन + एनालिटिक्स

<b>/start</b> फिर <b>URL छोटा करें</b>

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,

      `<b>स्मार्ट लिंक 34% ज्यादा क्लिक</b>

ब्रांडेड लिंक 5 मुफ्त शुरू
अनलिमिटेड प्लान उपलब्ध

<b>URL छोटा करें</b> दबाएं

-----
DMCA डोमेन — <b>डोमेन नाम पंजीकृत करें</b>`,
    ],

    leads: [
      `<b>HQ फोन लीड्स</b>

देश राज्य एरिया कोड कैरियर से फ़िल्टर
$20/1K से शुरू $15/1K वैलिडेट

<b>HQ एसएमएस लीड</b> दबाएं

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,

      `<b>खराब लीड्स पर बर्बादी बंद</b>

वेरिफाइड लीड्स CNAM शामिल
तुरंत बल्क डिलीवरी

<b>HQ एसएमएस लीड</b> दबाएं

-----
DMCA डोमेन — <b>डोमेन नाम पंजीकृत करें</b>`,

      `<b>भेजने से पहले वैलिडेट</b>

डेड नंबर = पैसा जलाना
लिस्ट अपलोड सिर्फ एक्टिव वापस $15/1K

<b>HQ एसएमएस लीड</b> फिर <b>सत्यापित करें</b>

-----
डोमेन — <b>डोमेन नाम पंजीकृत करें</b>`,

      `<b>ताज़ा लीड्स ताज़ा रेवेन्यू</b>

USA UK कनाडा ऑस्ट्रेलिया
SMS वॉइस 1K-5K+ प्रति ऑर्डर

<b>HQ एसएमएस लीड</b> फिर <b>खरीदें</b>

-----
मुफ्त लिंक — <b>URL छोटा करें</b>`,

      `<b>SMS मार्केटिंग बढ़ाएं</b>

देश कैरियर मात्रा चुनें
क्रिप्टो या वॉलेट भुगतान

<b>HQ एसएमएस लीड</b> दबाएं

-----
लिंक छोटा करें — <b>URL छोटा करें</b>`,
    ],
  },
}

/**
 * Convert a local target time to UTC given a timezone offset
 */
function localToUtc(localHour, localMinute, offsetHours) {
  let utcHour = localHour - Math.floor(offsetHours)
  let utcMinute = localMinute - Math.round((offsetHours % 1) * 60)
  if (utcMinute < 0) { utcMinute += 60; utcHour -= 1 }
  if (utcMinute >= 60) { utcMinute -= 60; utcHour += 1 }
  if (utcHour < 0) utcHour += 24
  if (utcHour >= 24) utcHour -= 24
  return { hour: utcHour, minute: utcMinute }
}

/**
 * Initialize the auto-promo system
 */
function initAutoPromo(bot, db, nameOf, stateCol) {
  const promoTracker = db.collection('promoTracker')
  const promoOptOut = db.collection('promoOptOut')
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  let dailyCouponSystem = null
  function setDailyCouponSystem(sys) { dailyCouponSystem = sys }

  function alertAdmin(msg) {
    if (adminChatId) bot.sendMessage(adminChatId, `[AutoPromo Alert] ${msg}`).catch(() => {})
  }

  async function getRotationIndex(theme, lang) {
    const trackerId = `${theme}_${lang}`
    const tracker = await promoTracker.findOne({ _id: trackerId })
    const currentIndex = tracker?.index || 0
    const nextIndex = (currentIndex + 1) % 5
    await promoTracker.updateOne({ _id: trackerId }, { $set: { index: nextIndex, lastSent: new Date() } }, { upsert: true })
    return currentIndex
  }

  async function isOptedOut(chatId) {
    const record = await promoOptOut.findOne({ _id: chatId })
    return record?.optedOut === true
  }

  async function setOptOut(chatId, optedOut) {
    await promoOptOut.updateOne({ _id: chatId }, { $set: { optedOut, updatedAt: new Date() } }, { upsert: true })
  }

  async function getAllChatIds() {
    try {
      const users = await nameOf.find({}).toArray()
      return users.map(u => u._id).filter(id => typeof id === 'number')
    } catch (error) {
      log(`[AutoPromo] Error fetching chat IDs: ${error.message}`)
      return []
    }
  }

  async function getUserLanguage(chatId) {
    try {
      const userState = await stateCol.findOne({ _id: chatId })
      const lang = userState?.userLanguage || 'en'
      return promoMessages[lang] ? lang : 'en'
    } catch { return 'en' }
  }

  function isUnreachableError(error) {
    const msg = error.message || ''
    return msg.includes('chat not found') || msg.includes('user is deactivated') || msg.includes('bot was blocked') || msg.includes('have no rights to send a message')
  }

  async function sendPromoToUser(chatId, theme, variationIndex, lang, dynamicMessage, couponLine) {
    try {
      if (await isOptedOut(chatId)) return { success: true, skipped: true }
      let caption = dynamicMessage || (promoMessages[lang]?.[theme] || promoMessages.en[theme])[variationIndex % 5]
      if (couponLine) caption += '\n\n' + couponLine
      const bannerUrl = PROMO_BANNERS[theme]

      const trySend = async (useHtml) => {
        const opts = useHtml ? { parse_mode: 'HTML' } : {}
        if (bannerUrl) {
          try {
            await bot.sendPhoto(chatId, bannerUrl, { caption, ...opts })
          } catch (photoErr) {
            if (isUnreachableError(photoErr)) throw photoErr
            log(`[AutoPromo] Photo failed for ${chatId}, text fallback: ${photoErr.message}`)
            await bot.sendMessage(chatId, caption, { ...opts, disable_web_page_preview: true })
          }
        } else {
          await bot.sendMessage(chatId, caption, { ...opts, disable_web_page_preview: true })
        }
      }

      try { await trySend(true) }
      catch (parseErr) {
        if (isUnreachableError(parseErr)) throw parseErr
        if (parseErr.message?.includes('parse') || parseErr.response?.statusCode === 400) {
          log(`[AutoPromo] HTML parse error for ${chatId}, retrying plain`)
          await trySend(false)
        } else throw parseErr
      }
      return { success: true }
    } catch (error) {
      const code = error.response?.statusCode
      if (code === 403 || isUnreachableError(error)) {
        await setOptOut(chatId, true)
        log(`[AutoPromo] User ${chatId} unreachable, auto opted-out`)
      } else if (code === 429) {
        log(`[AutoPromo] Rate limited: ${chatId}`)
      } else {
        log(`[AutoPromo] Failed ${chatId}: [${code || 'unknown'}] ${error.message}`)
      }
      return { success: false, error: error.message }
    }
  }

  async function broadcastPromoForLang(themeIndex, lang) {
    const theme = THEMES[themeIndex]
    const variationIndex = await getRotationIndex(theme, lang)
    const allChatIds = await getAllChatIds()
    if (allChatIds.length === 0) return log(`[AutoPromo] No users found`)

    const targetChatIds = []
    for (const chatId of allChatIds) {
      const userLang = await getUserLanguage(chatId)
      if (userLang === lang) targetChatIds.push(chatId)
    }
    if (targetChatIds.length === 0) return log(`[AutoPromo] No ${lang} users for ${theme}`)

    let dynamicMessage = null
    let usedAI = false
    try {
      dynamicMessage = await generateDynamicPromo(theme, lang)
      if (dynamicMessage) { usedAI = true; log(`[AutoPromo] AI ${theme}/${lang} (${dynamicMessage.length} chars)`) }
    } catch (err) { log(`[AutoPromo] AI fail: ${err.message}`) }

    if (!dynamicMessage) {
      log(`[AutoPromo] Static fallback for ${theme}/${lang}`)
      alertAdmin(`OpenAI failed for ${theme}/${lang}. Using static fallback.`)
    }

    log(`[AutoPromo] Broadcasting ${theme} (${usedAI ? 'AI' : 'static #' + (variationIndex + 1)}) to ${targetChatIds.length} ${lang} users`)

    let couponLine = null
    if (dailyCouponSystem) {
      try {
        const codes = await dailyCouponSystem.getTodayCoupons()
        const entries = Object.entries(codes)
        if (entries.length > 0) {
          const [code, info] = entries[Math.floor(Math.random() * entries.length)]
          couponLine = `<b>TODAY ONLY:</b> Use code <code>${code}</code> for ${info.discount}% off!`
        }
      } catch (err) { log(`[AutoPromo] Coupon error: ${err.message}`) }
    }

    const { BATCH_SIZE, DELAY_BETWEEN_BATCHES, DELAY_BETWEEN_MESSAGES } = BROADCAST_CONFIG
    let successCount = 0, errorCount = 0, skippedCount = 0

    for (let i = 0; i < targetChatIds.length; i += BATCH_SIZE) {
      const batch = targetChatIds.slice(i, i + BATCH_SIZE)
      const results = await Promise.allSettled(batch.map(async (chatId, index) => {
        await sleep(index * DELAY_BETWEEN_MESSAGES)
        return sendPromoToUser(chatId, theme, variationIndex, lang, dynamicMessage, couponLine)
      }))
      for (const result of results) {
        if (result.status === 'fulfilled') {
          if (result.value?.skipped) skippedCount++
          else if (result.value?.success) successCount++
          else errorCount++
        } else errorCount++
      }
      if (i + BATCH_SIZE < targetChatIds.length) await sleep(DELAY_BETWEEN_BATCHES)
    }

    const stats = { theme, lang, variation: usedAI ? 'ai' : variationIndex + 1, usedAI, total: targetChatIds.length, success: successCount, errors: errorCount, skipped: skippedCount, timestamp: new Date().toISOString() }
    log(`[AutoPromo] Done:`, JSON.stringify(stats))
    await db.collection('promoStats').insertOne(stats)
  }

  function getTodayThemes() {
    const dayOfYear = Math.floor(Date.now() / 86400000)
    const cycle = dayOfYear % 3
    const pairs = [[0, 1], [1, 2], [2, 0]]
    return pairs[cycle]
  }

  const supportedLangs = Object.keys(TIMEZONE_OFFSETS)
  let scheduledCount = 0

  for (const lang of supportedLangs) {
    const offset = TIMEZONE_OFFSETS[lang]
    LOCAL_TIMES.forEach((localTime, slotIndex) => {
      const utcTime = localToUtc(localTime.hour, localTime.minute, offset)
      const cronExpr = `${utcTime.minute} ${utcTime.hour} * * *`
      schedule.scheduleJob(cronExpr, () => {
        const todayThemes = getTodayThemes()
        const themeIndex = todayThemes[slotIndex]
        log(`[AutoPromo] Triggered ${THEMES[themeIndex]} for ${lang} (local ${localTime.hour}:${String(localTime.minute).padStart(2, '0')})`)
        broadcastPromoForLang(themeIndex, lang).catch(err => log(`[AutoPromo] Broadcast error: ${err.message}`))
      })
      log(`[AutoPromo] Scheduled slot ${slotIndex + 1} for ${lang.toUpperCase()} at local ${localTime.hour}:${String(localTime.minute).padStart(2, '0')} (UTC ${utcTime.hour}:${String(utcTime.minute).padStart(2, '0')})`)
      scheduledCount++
    })
  }

  log(`[AutoPromo] Initialized with ${scheduledCount} scheduled jobs (${supportedLangs.length} languages x ${LOCAL_TIMES.length} slots, rotating ${THEMES.length} themes)`)

  return {
    setOptOut,
    isOptedOut,
    broadcastPromoForLang,
    setDailyCouponSystem,
    getPromoMessages: () => promoMessages,
    getThemes: () => THEMES,
  }
}

module.exports = { initAutoPromo, promoMessages, PROMO_BANNERS }
