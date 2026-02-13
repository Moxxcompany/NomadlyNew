// Auto-Promo System - Sends 3 daily promotional messages to all bot users
// AI-powered dynamic messages with static fallback + admin alerts

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
      'Instant DNS setup and full management panel',
      'Pay with BTC, ETH, USDT or bank transfer',
      'Free .sbs domains with subscription plans',
    ],
    cta: 'Register Domain Names',
    crossPromo: '@hostbay_bot for cPanel/Plesk hosting and country TLDs (.ng .za .ke .gh .cm .tz)',
  },
  shortener: {
    services: 'URL shortener with custom domain branding',
    details: [
      'Custom branded short URLs with your own domain',
      'Real-time click analytics and tracking',
      'Bitly integration available',
      'Random or custom back-half for links',
      'Unlimited links with subscription plans (Daily/Weekly/Monthly)',
    ],
    cta: 'URL Shortener',
    crossPromo: '@hostbay_bot for cPanel/Plesk hosting and country TLDs (.ng .za .ke .gh .cm .tz)',
  },
  leads: {
    services: 'Phone number lead generation and validation',
    details: [
      'Buy verified phone leads filtered by country, state, area code',
      'SMS-ready and voice-ready leads',
      'Filter by carrier (T-Mobile, AT&T, Verizon etc.)',
      'Validate your own phone numbers (BYOL) for $15/1000',
      'Buy leads starting from $20 per 1000',
      'CNAM lookup available',
      'Bulk download with instant delivery',
    ],
    cta: 'HQ SMS Lead',
    crossPromo: '@hostbay_bot for cPanel/Plesk hosting and country TLDs (.ng .za .ke .gh .cm .tz)',
  },
}

/**
 * Sanitize AI output for Telegram HTML
 * - Convert markdown bold/italic to HTML
 * - Strip unsupported HTML tags
 * - Fix unclosed <b>, <i>, <code> tags
 */
function sanitizeForTelegram(text) {
  let s = text

  // Convert markdown bold **text** or __text__ to <b>text</b>
  s = s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  s = s.replace(/__(.+?)__/g, '<b>$1</b>')

  // Convert markdown italic *text* or _text_ to <i>text</i> (single only, not inside words)
  s = s.replace(/(?<!\w)\*([^*\n]+?)\*(?!\w)/g, '<i>$1</i>')
  s = s.replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '<i>$1</i>')

  // Convert markdown code `text` to <code>text</code>
  s = s.replace(/`([^`\n]+?)`/g, '<code>$1</code>')

  // Strip markdown headers (# ## ###)
  s = s.replace(/^#{1,3}\s+/gm, '')

  // Strip any HTML tags Telegram doesn't support (keep b, i, u, s, code, pre, a)
  s = s.replace(/<(?!\/?(?:b|i|u|s|code|pre|a)\b)[^>]*>/gi, '')

  // Fix unclosed tags — count opens vs closes for b, i, code
  for (const tag of ['b', 'i', 'code']) {
    const opens = (s.match(new RegExp(`<${tag}>`, 'gi')) || []).length
    const closes = (s.match(new RegExp(`</${tag}>`, 'gi')) || []).length
    for (let i = 0; i < opens - closes; i++) {
      s += `</${tag}>`
    }
    // Remove orphan closing tags (more closes than opens)
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
 * Generate a dynamic promo message using OpenAI
 */
async function generateDynamicPromo(theme, lang) {
  const ai = getOpenAI()
  if (!ai) return null

  const ctx = SERVICE_CONTEXT[theme]
  const langName = LANG_NAMES[lang] || 'English'

  const prompt = `You are a friendly, persuasive Telegram bot copywriter. Write a short promotional message for a Telegram bot that offers ${ctx.services}.

Key selling points:
${ctx.details.map(d => '- ' + d).join('\n')}

Rules:
- Write in ${langName}
- Use ONLY Telegram HTML tags: <b>bold</b> and <code>code</code>. Do NOT use markdown syntax like **bold** or *italic* or \`code\`.
- Start with a catchy <b>HEADLINE</b> in the message language
- Be friendly, engaging, and create urgency without being spammy
- Keep under 900 characters total (this will be a photo caption)
- End with a call-to-action: tap <b>${ctx.cta}</b>
- Add a separator line "-----" at the bottom
- Below the separator, mention: ${ctx.crossPromo}
- Each message should feel unique — vary the angle, hook, and structure
- Do NOT use emoji characters

Return ONLY the message text, nothing else.`

  try {
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.9,
    })
    let content = res.choices?.[0]?.message?.content?.trim()
    if (!content || content.length < 50) return null

    // Sanitize: fix markdown leaks, bad HTML, unclosed tags
    content = sanitizeForTelegram(content)

    if (content.length <= 1024) return content

    // If too long, truncate at last complete line under 1024
    const truncated = content.substring(0, 1020)
    const lastNewline = truncated.lastIndexOf('\n')
    return sanitizeForTelegram(lastNewline > 500 ? truncated.substring(0, lastNewline) : truncated)
  } catch (error) {
    log(`[AutoPromo] OpenAI error: ${error.message}`)
    return null
  }
}

// Timezone offsets per language (hours from UTC)
// Used to send promos at "local" times for each user group
const TIMEZONE_OFFSETS = {
  en: 0,      // UTC (default)
  fr: 1,      // WAT / CET (West Africa / France)
  zh: 8,      // CST (China Standard Time)
  hi: 5.5,    // IST (India Standard Time)
}

// Target local times for each theme
const LOCAL_TIMES = [
  { hour: 10, minute: 0 },  // Morning - Domains
  { hour: 16, minute: 0 },  // Afternoon - URL Shortener
  { hour: 21, minute: 0 },  // Evening - Phone Leads
]

// Theme order for the 3 daily slots
const THEMES = ['domains', 'shortener', 'leads']

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// ─── Promo Messages ──────────────────────────────────────────────

const promoMessages = {
  en: {
    domains: [
      `<b>YOUR WEBSITE, YOUR RULES</b>

Register DMCA-ignored domains — no takedowns.

- .sbs, .com, .net, .org & 400+ extensions
- Offshore registration — total privacy
- Instant DNS setup + management panel

Tap <b>Register Domain Names</b> to claim yours!

-----
cPanel hosting or country TLDs (.ng .za .ke .gh)?
Visit @hostbay_bot`,

      `<b>DOMAIN FLASH DEAL</b>

Why risk your site being taken down?

+ DMCA-Ignored registration
+ Full DNS control from day one
+ Free .sbs domains with plans

Type <b>/start</b> then tap <b>Register Domain Names</b>

-----
Country domains (.ng .za .ke .cm .tz)?
@hostbay_bot has you covered!`,

      `<b>OWN YOUR DIGITAL IDENTITY</b>

Every serious brand needs a domain:

- Offshore, privacy-first registration
- .sbs .com .net .org and 400+ more
- Manage DNS directly from the bot

Tap <b>Register Domain Names</b> now!

-----
Web hosting with cPanel?
Head to @hostbay_bot`,

      `<b>STOP WORRYING ABOUT TAKEDOWNS</b>

Your competitors use DMCA-ignored domains.

- Content stays up — guaranteed
- Crypto & bank payments accepted
- All your domains in one place

<b>Register Domain Names</b> — start now!

-----
Need .ng .za .ke .gh country domains?
Visit @hostbay_bot`,

      `<b>TRUSTED BY THOUSANDS</b>

Why choose offshore domains?

1. Zero DMCA takedowns
2. Full privacy protection
3. Fast DNS propagation
4. Crypto payments for anonymity

Tap <b>Register Domain Names</b>

-----
cPanel hosting & country TLDs?
@hostbay_bot`,
    ],

    shortener: [
      `<b>SHORTEN. BRAND. TRACK.</b>

Stop using boring links nobody clicks!

- Custom branded URLs with YOUR domain
- Real-time click analytics
- Bit.ly integration available

Tap <b>URL Shortener</b> to get started!

-----
cPanel hosting or country TLDs?
Visit @hostbay_bot`,

      `<b>ARE YOUR LINKS WORKING FOR YOU?</b>

Every click tells a story.

+ Brand links with YOUR domain
+ Track every single click
+ Unlimited links with subscription

Tap <b>URL Shortener</b> now!

-----
Country domains (.ng .za .ke .gh)?
@hostbay_bot`,

      `<b>YOUR BRAND DESERVES BETTER LINKS</b>

<code>bit.ly/3xK9mQ2</code> vs <code>yourbrand.com/deals</code>

- Use your own domain for short links
- See who clicks, when, and where
- Random or custom back-half

<b>URL Shortener</b> — try it free!

-----
Need hosting? Visit @hostbay_bot`,

      `<b>LINK SHORTENING MADE POWERFUL</b>

Marketing without tracking is driving blind.

- Redirect & shorten any URL
- Custom domain shortener
- View shortlink analytics

Type <b>/start</b> then tap <b>URL Shortener</b>

-----
cPanel hosting & country TLDs?
@hostbay_bot`,

      `<b>SMART MARKETERS USE SMART LINKS</b>

Branded short links get up to 34% more clicks.

+ Use your domain as a shortener
+ Track performance in real-time
+ Unlimited links with plans

Tap <b>URL Shortener</b>

-----
Need country-level domains?
@hostbay_bot`,
    ],

    leads: [
      `<b>HQ PHONE LEADS — FUEL YOUR CAMPAIGNS</b>

Target the right audience:

- Filter by country, state, area code, carrier
- SMS-ready & voice-ready leads
- Starting from $20 per 1,000

Already have numbers? Validate for $15/1000!

Tap <b>HQ SMS Lead</b> to start!

-----
cPanel hosting or country TLDs?
Visit @hostbay_bot`,

      `<b>STOP WASTING MONEY ON BAD LEADS</b>

Your campaigns are only as good as your list.

+ Verified leads by country & area
+ CNAM lookup included
+ Bulk download — instant delivery

Tap <b>HQ SMS Lead</b> now!

-----
Country domains & hosting?
@hostbay_bot`,

      `<b>VALIDATE BEFORE YOU SEND</b>

Sending to dead numbers? You're burning cash.

- Upload your list (any format)
- Get back only ACTIVE numbers
- Just $15 per 1,000 validations

<b>HQ SMS Lead</b> then tap <b>Validate PhoneLeads</b>

-----
Need hosting? Visit @hostbay_bot`,

      `<b>FRESH LEADS = FRESH REVENUE</b>

USA | UK | Canada | Australia & more

- SMS & Voice leads available
- Filter: state, area code, carrier
- 1,000 to 5,000+ per order

<b>HQ SMS Lead</b> then tap <b>Buy PhoneLeads</b>

-----
Country TLD domains (.ng .za .ke .gh)?
@hostbay_bot`,

      `<b>SCALE YOUR SMS MARKETING TODAY</b>

1. Choose country & region
2. Pick carrier & format
3. Select quantity (1K-5K+)
4. Pay with crypto or wallet

Already have a list? Validate it with us!

Tap <b>HQ SMS Lead</b>

-----
Need cPanel hosting?
@hostbay_bot`,
    ],
  },

  fr: {
    domains: [
      `<b>VOTRE SITE WEB, VOS REGLES</b>

Domaines ignorant le DMCA — aucun retrait.

- .sbs, .com, .net, .org & 400+ extensions
- Enregistrement offshore — confidentialite totale
- Configuration DNS instantanee

Appuyez sur <b>Enregistrer des noms de domaine</b> !

-----
Hebergement cPanel ou domaines pays (.ng .za .ke .gh) ?
Visitez @hostbay_bot`,

      `<b>OFFRE FLASH DOMAINES</b>

Pourquoi risquer la suppression de votre site ?

+ Enregistrement DMCA-ignore
+ Controle DNS complet des le premier jour
+ Domaines .sbs gratuits avec abonnements

Tapez <b>/start</b> puis <b>Enregistrer des noms de domaine</b>

-----
Domaines pays (.ng .za .ke .cm .tz) ?
@hostbay_bot`,

      `<b>POSSEDEZ VOTRE IDENTITE NUMERIQUE</b>

Toute marque serieuse a besoin d'un domaine :

- Enregistrement offshore, confidentialite d'abord
- .sbs .com .net .org .io et plus
- Gerez les DNS directement depuis le bot

Appuyez sur <b>Enregistrer des noms de domaine</b> !

-----
Hebergement cPanel ?
Direction @hostbay_bot`,

      `<b>ARRETEZ DE VOUS INQUIETER DES SUPPRESSIONS</b>

Vos concurrents utilisent deja des domaines DMCA-ignores.

- Contenu en ligne — garanti
- Paiements crypto & bancaires
- Tous vos domaines au meme endroit

<b>Enregistrer des noms de domaine</b> — commencez !

-----
Domaines .ng .za .ke .gh ?
Visitez @hostbay_bot`,

      `<b>LA CONFIANCE DE MILLIERS D'UTILISATEURS</b>

Pourquoi choisir l'offshore ?

1. Zero suppression DMCA
2. Protection vie privee totale
3. Propagation DNS rapide
4. Paiements crypto anonymes

Appuyez sur <b>Enregistrer des noms de domaine</b>

-----
Hebergement cPanel & domaines pays ?
@hostbay_bot`,
    ],

    shortener: [
      `<b>RACCOURCISSEZ. PERSONNALISEZ. ANALYSEZ.</b>

Arretez les liens generiques !

- URLs personnalisees avec VOTRE domaine
- Analyse des clics en temps reel
- Integration Bit.ly disponible

Appuyez sur <b>Raccourcisseur d'URL</b> !

-----
Hebergement cPanel ou domaines pays ?
Visitez @hostbay_bot`,

      `<b>VOS LIENS TRAVAILLENT-ILS POUR VOUS ?</b>

Chaque clic raconte une histoire.

+ Personnalisez avec VOTRE domaine
+ Suivez chaque clic
+ Liens illimites avec abonnement

Appuyez sur <b>Raccourcisseur d'URL</b> !

-----
Domaines pays (.ng .za .ke .gh) ?
@hostbay_bot`,

      `<b>VOTRE MARQUE MERITE DE MEILLEURS LIENS</b>

<code>bit.ly/3xK9mQ2</code> vs <code>votremarque.com/offres</code>

- Utilisez votre propre domaine
- Voyez qui clique, quand et ou
- Extension aleatoire ou personnalisee

<b>Raccourcisseur d'URL</b> — essayez gratuitement !

-----
Besoin d'hebergement ? @hostbay_bot`,

      `<b>RACCOURCISSEMENT DE LIENS PUISSANT</b>

Le marketing sans suivi = conduire a l'aveugle.

- Redirigez & raccourcissez n'importe quelle URL
- Raccourcisseur domaine personnalise
- Consultez les analyses de vos liens

Tapez <b>/start</b> puis <b>Raccourcisseur d'URL</b>

-----
Hebergement cPanel & domaines pays ?
@hostbay_bot`,

      `<b>LIENS PERSONNALISES = 34% DE CLICS EN PLUS</b>

+ Utilisez votre domaine comme raccourcisseur
+ Suivez la performance en temps reel
+ Liens illimites avec les plans Quotidien/Hebdo/Mensuel

Appuyez sur <b>Raccourcisseur d'URL</b>

-----
Domaines pays ?
@hostbay_bot`,
    ],

    leads: [
      `<b>LEADS HQ — ALIMENTEZ VOS CAMPAGNES</b>

Ciblez avec precision :

- Filtrez par pays, etat, indicatif, operateur
- Leads SMS & voix prets
- A partir de 20$ pour 1 000 leads

Numeros existants ? Validez pour 15$/1000 !

Appuyez sur <b>Pistes SMS HQ</b> !

-----
Hebergement cPanel ou domaines pays ?
Visitez @hostbay_bot`,

      `<b>ARRETEZ DE GASPILLER SUR DE MAUVAIS LEADS</b>

Vos campagnes valent votre liste.

+ Leads verifies par pays & zone
+ Recherche CNAM incluse
+ Telechargement masse — livraison instantanee

Appuyez sur <b>Pistes SMS HQ</b> !

-----
Domaines pays & hebergement ?
@hostbay_bot`,

      `<b>VALIDEZ AVANT D'ENVOYER</b>

SMS a des numeros morts ? Vous brulez du cash.

- Uploadez votre liste (tout format)
- Recuperez uniquement les numeros ACTIFS
- 15$ pour 1 000 validations

<b>Pistes SMS HQ</b> puis <b>Valider les leads</b>

-----
Besoin d'hebergement ? @hostbay_bot`,

      `<b>LEADS FRAIS = REVENUS FRAIS</b>

USA | UK | Canada | Australie & plus

- Leads SMS & voix disponibles
- Filtres : etat, indicatif, operateur
- 1 000 a 5 000+ par commande

<b>Pistes SMS HQ</b> puis <b>Acheter des leads</b>

-----
Domaines TLD pays ?
@hostbay_bot`,

      `<b>DEVELOPPEZ VOTRE MARKETING SMS</b>

1. Choisissez pays & region
2. Selectionnez operateur & format
3. Quantite (1K-5K+)
4. Payez en crypto ou portefeuille

Liste existante ? Validez-la chez nous !

Appuyez sur <b>Pistes SMS HQ</b>

-----
Hebergement cPanel ?
@hostbay_bot`,
    ],
  },

  zh: {
    domains: [
      `<b>您的网站 您做主</b>

注册无视DMCA的域名 — 无删除无干扰

- .sbs .com .net .org 及400+扩展名
- 离岸注册 — 完全隐私
- 即时DNS设置 + 管理面板

点击 <b>注册域名</b> 立即注册!

-----
cPanel主机或国家域名?
访问 @hostbay_bot`,

      `<b>域名限时优惠</b>

为什么冒网站被下架的风险?

+ 无视DMCA域名注册
+ 从第一天起完全控制DNS
+ 订阅赠送免费.sbs域名

输入 <b>/start</b> 然后点击 <b>注册域名</b>

-----
国家域名 (.ng .za .ke .cm .tz)?
@hostbay_bot`,

      `<b>拥有您的数字身份</b>

每个品牌都需要域名:

- 离岸 隐私优先注册
- .sbs .com .net .org 等
- 直接从机器人管理DNS

立即点击 <b>注册域名</b>!

-----
cPanel网站托管?
@hostbay_bot`,

      `<b>不再担心内容被删除</b>

竞争对手已在用无视DMCA的域名

- 内容保持在线 — 保证
- 接受加密货币和银行支付
- 所有域名一处管理

<b>注册域名</b> — 立即开始!

-----
.ng .za .ke .gh 国家域名?
访问 @hostbay_bot`,

      `<b>数千用户的信赖之选</b>

为什么选择离岸域名?

1. 零DMCA删除
2. 完全隐私保护
3. 极速DNS传播
4. 加密支付保护匿名

点击 <b>注册域名</b>

-----
cPanel托管和国家域名?
@hostbay_bot`,
    ],

    shortener: [
      `<b>缩短 品牌化 追踪</b>

别再用无人点击的链接!

- 用您的域名创建品牌短链接
- 实时点击分析
- 支持Bit.ly集成

点击 <b>URL 缩短器</b> 开始!

-----
cPanel托管或国家域名?
访问 @hostbay_bot`,

      `<b>您的链接在为您工作吗?</b>

每次点击都是故事

+ 用自定义域名打造品牌
+ 追踪每一次点击
+ 订阅即可无限链接

立即点击 <b>URL 缩短器</b>!

-----
国家域名?
@hostbay_bot`,

      `<b>您的品牌值得更好的链接</b>

<code>bit.ly/3xK9mQ2</code> vs <code>您的品牌.com/优惠</code>

- 用自己的域名创建短链接
- 查看谁点击了 何时 从哪里
- 随机或自定义后缀

<b>URL 缩短器</b> — 免费试用!

-----
需要托管? @hostbay_bot`,

      `<b>强大的链接缩短工具</b>

没有追踪的营销就像蒙眼开车

- 重定向和缩短任何URL
- 自定义域名缩短器
- 查看短链接分析数据

输入 <b>/start</b> 然后点击 <b>URL 缩短器</b>

-----
cPanel托管和国家域名?
@hostbay_bot`,

      `<b>聪明的营销人用聪明的链接</b>

品牌短链接点击率高出34%

+ 注册域名用它作缩短器
+ 实时跟踪性能
+ 日/周/月计划享无限链接

点击 <b>URL 缩短器</b>

-----
国家级域名?
@hostbay_bot`,
    ],

    leads: [
      `<b>高质量电话线索 — 驱动营销</b>

精准定位目标受众:

- 按国家 州 区号 运营商筛选
- 短信和语音线索
- 1000条起仅需$20

已有号码? 验证$15/1000条!

点击 <b>HQ 短信线索</b> 开始!

-----
cPanel托管或国家域名?
@hostbay_bot`,

      `<b>停止在劣质线索上浪费</b>

营销效果取决于列表质量

+ 按国家区域购买验证线索
+ CNAM查询了解联系对象
+ 批量下载即时交付

立即点击 <b>HQ 短信线索</b>!

-----
国家域名和托管?
@hostbay_bot`,

      `<b>发送前先验证</b>

向无效号码发短信就是烧钱

- 上传电话列表 (任何格式)
- 只返回有效号码
- 1000次验证仅$15

<b>HQ 短信线索</b> 然后 <b>验证电话线索</b>

-----
需要托管? @hostbay_bot`,

      `<b>新鲜线索 = 新鲜收入</b>

美国 | 英国 | 加拿大 | 澳大利亚等

- 短信和语音线索均可
- 筛选: 州 区号 运营商
- 每单1000至5000+条

<b>HQ 短信线索</b> 然后 <b>购买电话线索</b>

-----
国家TLD域名?
@hostbay_bot`,

      `<b>扩大您的短信营销</b>

1. 选择国家和区域
2. 选择运营商和格式
3. 数量 (1K-5K+)
4. 加密货币或钱包支付

已有列表? 在这里验证!

点击 <b>HQ 短信线索</b>

-----
cPanel托管?
@hostbay_bot`,
    ],
  },

  hi: {
    domains: [
      `<b>आपकी वेबसाइट आपके नियम</b>

DMCA-अनदेखा डोमेन — कोई हटाव नहीं

- .sbs .com .net .org और 400+ एक्सटेंशन
- ऑफशोर रजिस्ट्रेशन — पूर्ण गोपनीयता
- तुरंत DNS सेटअप + प्रबंधन पैनल

<b>डोमेन नाम पंजीकृत करें</b> दबाएं!

-----
cPanel होस्टिंग या देश TLD?
@hostbay_bot पर जाएं`,

      `<b>डोमेन फ्लैश डील</b>

वेबसाइट हटाए जाने का खतरा क्यों उठाएं?

+ DMCA-अनदेखा रजिस्ट्रेशन
+ पहले दिन से पूर्ण DNS नियंत्रण
+ प्लान के साथ मुफ्त .sbs डोमेन

<b>/start</b> टाइप करें फिर <b>डोमेन नाम पंजीकृत करें</b>

-----
देश डोमेन (.ng .za .ke .cm .tz)?
@hostbay_bot`,

      `<b>अपनी डिजिटल पहचान बनाएं</b>

हर ब्रांड को डोमेन चाहिए:

- ऑफशोर गोपनीयता-प्रथम रजिस्ट्रेशन
- .sbs .com .net .org और अधिक
- बॉट से सीधे DNS प्रबंधित करें

अभी <b>डोमेन नाम पंजीकृत करें</b> दबाएं!

-----
cPanel होस्टिंग?
@hostbay_bot`,

      `<b>हटाव की चिंता छोड़ें</b>

प्रतिद्वंद्वी DMCA-अनदेखा डोमेन इस्तेमाल कर रहे हैं

- सामग्री ऑनलाइन — गारंटी
- क्रिप्टो और बैंक भुगतान स्वीकृत
- सभी डोमेन एक जगह

<b>डोमेन नाम पंजीकृत करें</b> — अभी शुरू करें!

-----
.ng .za .ke .gh देश डोमेन?
@hostbay_bot`,

      `<b>हजारों की भरोसेमंद पसंद</b>

ऑफशोर डोमेन क्यों चुनें?

1. शून्य DMCA हटाव
2. पूर्ण गोपनीयता सुरक्षा
3. तेज DNS प्रसारण
4. क्रिप्टो भुगतान

<b>डोमेन नाम पंजीकृत करें</b> दबाएं

-----
cPanel होस्टिंग और देश डोमेन?
@hostbay_bot`,
    ],

    shortener: [
      `<b>छोटा करें ब्रांड बनाएं ट्रैक करें</b>

बोरिंग लिंक बंद करें!

- अपने डोमेन से ब्रांडेड शॉर्ट URL
- रियल-टाइम क्लिक एनालिटिक्स
- Bit.ly इंटीग्रेशन उपलब्ध

<b>URL छोटा करें</b> दबाएं!

-----
cPanel होस्टिंग या देश TLD?
@hostbay_bot`,

      `<b>क्या आपके लिंक काम कर रहे हैं?</b>

हर क्लिक एक कहानी बताता है

+ कस्टम डोमेन से ब्रांड बनाएं
+ हर क्लिक ट्रैक करें
+ सब्सक्रिप्शन के साथ अनलिमिटेड लिंक

अभी <b>URL छोटा करें</b> दबाएं!

-----
देश डोमेन?
@hostbay_bot`,

      `<b>आपका ब्रांड बेहतर लिंक का हकदार है</b>

<code>bit.ly/3xK9mQ2</code> vs <code>आपकाब्रांड.com/ऑफर</code>

- अपने डोमेन से शॉर्ट लिंक बनाएं
- देखें कौन क्लिक करता है कब और कहां से
- रैंडम या कस्टम बैक-हाफ

<b>URL छोटा करें</b> — मुफ्त में आजमाएं!

-----
होस्टिंग? @hostbay_bot`,

      `<b>शक्तिशाली लिंक शॉर्टनिंग</b>

बिना ट्रैकिंग के मार्केटिंग = अंधेरे में गाड़ी

- किसी भी URL को रीडायरेक्ट और छोटा करें
- कस्टम डोमेन शॉर्टनर
- शॉर्टलिंक एनालिटिक्स देखें

<b>/start</b> टाइप करें फिर <b>URL छोटा करें</b>

-----
cPanel होस्टिंग और देश TLD?
@hostbay_bot`,

      `<b>स्मार्ट मार्केटर स्मार्ट लिंक इस्तेमाल करते हैं</b>

ब्रांडेड लिंक पर 34% ज्यादा क्लिक आते हैं

+ डोमेन रजिस्टर करें शॉर्टनर बनाएं
+ रियल-टाइम परफॉर्मेंस ट्रैक
+ दैनिक/साप्ताहिक/मासिक प्लान

<b>URL छोटा करें</b> दबाएं

-----
देश-स्तरीय डोमेन?
@hostbay_bot`,
    ],

    leads: [
      `<b>HQ फोन लीड्स — कैंपेन को ईंधन दें</b>

सटीक लक्ष्यीकरण:

- देश राज्य एरिया कोड कैरियर से फ़िल्टर
- SMS और वॉइस लीड्स
- 1000 लीड्स सिर्फ $20 से

नंबर हैं? $15/1000 में वैलिडेट करें!

<b>HQ एसएमएस लीड</b> दबाएं!

-----
cPanel होस्टिंग या देश TLD?
@hostbay_bot`,

      `<b>खराब लीड्स पर पैसा बर्बाद बंद करें</b>

कैंपेन उतनी अच्छी जितनी फोन लिस्ट

+ वेरिफाइड लीड्स देश और क्षेत्र अनुसार
+ CNAM लुकअप शामिल
+ बल्क डाउनलोड तुरंत डिलीवरी

अभी <b>HQ एसएमएस लीड</b> दबाएं!

-----
देश डोमेन और होस्टिंग?
@hostbay_bot`,

      `<b>भेजने से पहले वैलिडेट करें</b>

डेड नंबर्स पर SMS = पैसा जलाना

- फोन लिस्ट अपलोड करें (कोई भी फॉर्मेट)
- सिर्फ एक्टिव नंबर वापस
- 1000 वैलिडेशन सिर्फ $15

<b>HQ एसएमएस लीड</b> फिर <b>फोन लीड्स सत्यापित करें</b>

-----
होस्टिंग? @hostbay_bot`,

      `<b>ताज़ा लीड्स = ताज़ा रेवेन्यू</b>

USA | UK | कनाडा | ऑस्ट्रेलिया और अधिक

- SMS और वॉइस लीड्स
- फ़िल्टर: राज्य एरिया कोड कैरियर
- प्रति ऑर्डर 1000 से 5000+

<b>HQ एसएमएस लीड</b> फिर <b>फोन लीड्स खरीदें</b>

-----
देश TLD डोमेन?
@hostbay_bot`,

      `<b>SMS मार्केटिंग बढ़ाएं</b>

1. देश और क्षेत्र चुनें
2. कैरियर और फॉर्मेट चुनें
3. मात्रा (1K-5K+)
4. क्रिप्टो या वॉलेट से भुगतान

लिस्ट है? वैलिडेट करें!

<b>HQ एसएमएस लीड</b> दबाएं

-----
cPanel होस्टिंग?
@hostbay_bot`,
    ],
  },
}

/**
 * Convert a local target time to UTC given a timezone offset
 */
function localToUtc(localHour, localMinute, offsetHours) {
  let utcHour = localHour - Math.floor(offsetHours)
  let utcMinute = localMinute - Math.round((offsetHours % 1) * 60)

  if (utcMinute < 0) {
    utcMinute += 60
    utcHour -= 1
  }
  if (utcMinute >= 60) {
    utcMinute -= 60
    utcHour += 1
  }
  if (utcHour < 0) utcHour += 24
  if (utcHour >= 24) utcHour -= 24

  return { hour: utcHour, minute: utcMinute }
}

/**
 * Initialize the auto-promo system
 * @param {Object} bot - Telegram bot instance
 * @param {Object} db - MongoDB database instance
 * @param {Object} nameOf - nameOf collection for getting all user chatIds
 * @param {Object} stateCol - state collection for user language/opt-out
 */
function initAutoPromo(bot, db, nameOf, stateCol) {
  const promoTracker = db.collection('promoTracker')
  const promoOptOut = db.collection('promoOptOut')
  const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

  function alertAdmin(msg) {
    if (adminChatId) {
      bot.sendMessage(adminChatId, `[AutoPromo Alert] ${msg}`).catch(() => {})
    }
  }

  /**
   * Get the next rotation index for a theme+lang combo
   */
  async function getRotationIndex(theme, lang) {
    const trackerId = `${theme}_${lang}`
    const tracker = await promoTracker.findOne({ _id: trackerId })
    const currentIndex = tracker?.index || 0
    const maxVariations = 5
    const nextIndex = (currentIndex + 1) % maxVariations

    await promoTracker.updateOne(
      { _id: trackerId },
      { $set: { index: nextIndex, lastSent: new Date() } },
      { upsert: true }
    )

    return currentIndex
  }

  /**
   * Check if user has opted out of promos
   */
  async function isOptedOut(chatId) {
    const record = await promoOptOut.findOne({ _id: chatId })
    return record?.optedOut === true
  }

  /**
   * Set opt-out status for a user
   */
  async function setOptOut(chatId, optedOut) {
    await promoOptOut.updateOne(
      { _id: chatId },
      { $set: { optedOut, updatedAt: new Date() } },
      { upsert: true }
    )
  }

  /**
   * Get all user chatIds from nameOf collection
   */
  async function getAllChatIds() {
    try {
      const users = await nameOf.find({}).toArray()
      return users.map(u => u._id).filter(id => typeof id === 'number')
    } catch (error) {
      log(`[AutoPromo] Error fetching chat IDs: ${error.message}`)
      return []
    }
  }

  /**
   * Get user language preference
   */
  async function getUserLanguage(chatId) {
    try {
      const userState = await stateCol.findOne({ _id: chatId })
      const lang = userState?.userLanguage || 'en'
      return promoMessages[lang] ? lang : 'en'
    } catch {
      return 'en'
    }
  }

  /**
   * Send a promo to a single user (with banner image)
   * @param {string|null} dynamicMessage - AI-generated message, or null to use static
   */
  async function sendPromoToUser(chatId, theme, variationIndex, lang, dynamicMessage) {
    try {
      if (await isOptedOut(chatId)) return { success: true, skipped: true }

      const caption = dynamicMessage || (promoMessages[lang]?.[theme] || promoMessages.en[theme])[variationIndex % 5]
      const bannerUrl = PROMO_BANNERS[theme]

      const trySend = async (useHtml) => {
        const opts = useHtml ? { parse_mode: 'HTML' } : {}
        if (bannerUrl) {
          try {
            await bot.sendPhoto(chatId, bannerUrl, { caption, ...opts })
          } catch (photoErr) {
            // Photo URL failed — fall back to text-only
            log(`[AutoPromo] Photo send failed for ${chatId}, falling back to text: ${photoErr.message}`)
            await bot.sendMessage(chatId, caption, { ...opts, disable_web_page_preview: true })
          }
        } else {
          await bot.sendMessage(chatId, caption, { ...opts, disable_web_page_preview: true })
        }
      }

      try {
        await trySend(true)
      } catch (parseErr) {
        if (parseErr.message?.includes('parse') || parseErr.response?.statusCode === 400) {
          log(`[AutoPromo] HTML parse error for ${chatId}, retrying plain text`)
          await trySend(false)
        } else {
          throw parseErr
        }
      }
      return { success: true }
    } catch (error) {
      const code = error.response?.statusCode
      if (code === 403) {
        await setOptOut(chatId, true)
        log(`[AutoPromo] User ${chatId} blocked bot, auto opted-out`)
      } else if (code === 429) {
        log(`[AutoPromo] Rate limited sending to ${chatId}`)
      } else {
        log(`[AutoPromo] Failed to send to ${chatId}: [${code || 'unknown'}] ${error.message}`)
      }
      return { success: false, error: error.message }
    }
  }

  /**
   * Broadcast a promo to users of a specific language
   */
  async function broadcastPromoForLang(themeIndex, lang) {
    const theme = THEMES[themeIndex]
    const variationIndex = await getRotationIndex(theme, lang)
    const allChatIds = await getAllChatIds()

    if (allChatIds.length === 0) {
      log(`[AutoPromo] No users found`)
      return
    }

    // Filter users by language
    const targetChatIds = []
    for (const chatId of allChatIds) {
      const userLang = await getUserLanguage(chatId)
      if (userLang === lang) {
        targetChatIds.push(chatId)
      }
    }

    if (targetChatIds.length === 0) {
      log(`[AutoPromo] No ${lang} users for ${theme} promo`)
      return
    }

    // Try AI-generated dynamic message first
    let dynamicMessage = null
    let usedAI = false
    try {
      dynamicMessage = await generateDynamicPromo(theme, lang)
      if (dynamicMessage) {
        usedAI = true
        log(`[AutoPromo] AI-generated ${theme}/${lang} message (${dynamicMessage.length} chars)`)
      }
    } catch (err) {
      log(`[AutoPromo] AI generation failed: ${err.message}`)
    }

    if (!dynamicMessage) {
      log(`[AutoPromo] Falling back to static message for ${theme}/${lang}`)
      alertAdmin(`OpenAI failed for ${theme}/${lang} promo. Using static fallback. Check APP_OPEN_API_KEY.`)
    }

    log(`[AutoPromo] Starting ${theme} broadcast (${usedAI ? 'AI-generated' : 'static #' + (variationIndex + 1)}) to ${targetChatIds.length} ${lang} users`)

    const { BATCH_SIZE, DELAY_BETWEEN_BATCHES, DELAY_BETWEEN_MESSAGES } = BROADCAST_CONFIG
    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    for (let i = 0; i < targetChatIds.length; i += BATCH_SIZE) {
      const batch = targetChatIds.slice(i, i + BATCH_SIZE)

      const batchPromises = batch.map(async (chatId, index) => {
        await sleep(index * DELAY_BETWEEN_MESSAGES)
        return sendPromoToUser(chatId, theme, variationIndex, lang, dynamicMessage)
      })

      const results = await Promise.allSettled(batchPromises)

      for (const result of results) {
        if (result.status === 'fulfilled') {
          if (result.value?.skipped) skippedCount++
          else if (result.value?.success) successCount++
          else errorCount++
        } else {
          errorCount++
        }
      }

      if (i + BATCH_SIZE < targetChatIds.length) {
        await sleep(DELAY_BETWEEN_BATCHES)
      }
    }

    const stats = {
      theme,
      lang,
      variation: usedAI ? 'ai-generated' : variationIndex + 1,
      usedAI,
      total: targetChatIds.length,
      success: successCount,
      errors: errorCount,
      skipped: skippedCount,
      timestamp: new Date().toISOString()
    }

    log(`[AutoPromo] Broadcast complete:`, JSON.stringify(stats))
    await db.collection('promoStats').insertOne(stats)
  }

  // Schedule timezone-aware promos
  // For each language, calculate UTC time for each local target time
  const supportedLangs = Object.keys(TIMEZONE_OFFSETS)
  let scheduledCount = 0

  for (const lang of supportedLangs) {
    const offset = TIMEZONE_OFFSETS[lang]

    LOCAL_TIMES.forEach((localTime, themeIndex) => {
      const utcTime = localToUtc(localTime.hour, localTime.minute, offset)
      const cronExpr = `${utcTime.minute} ${utcTime.hour} * * *`

      schedule.scheduleJob(cronExpr, () => {
        log(`[AutoPromo] Triggered ${THEMES[themeIndex]} for ${lang} users (local ${localTime.hour}:${String(localTime.minute).padStart(2, '0')}, UTC ${utcTime.hour}:${String(utcTime.minute).padStart(2, '0')})`)
        broadcastPromoForLang(themeIndex, lang).catch(err => {
          log(`[AutoPromo] Broadcast error: ${err.message}`)
        })
      })

      log(`[AutoPromo] Scheduled ${THEMES[themeIndex]} for ${lang.toUpperCase()} at local ${localTime.hour}:${String(localTime.minute).padStart(2, '0')} (UTC ${utcTime.hour}:${String(utcTime.minute).padStart(2, '0')})`)
      scheduledCount++
    })
  }

  log(`[AutoPromo] Initialized with ${scheduledCount} scheduled jobs (${supportedLangs.length} languages x ${THEMES.length} themes)`)

  // Return control functions
  return {
    setOptOut,
    isOptedOut,
    broadcastPromoForLang,
    getPromoMessages: () => promoMessages,
    getThemes: () => THEMES,
  }
}

module.exports = { initAutoPromo, promoMessages, PROMO_BANNERS }
