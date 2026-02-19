// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Text-to-Speech Service — EdenAI + ElevenLabs
// Generates audio from text, returns downloadable URL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { log } = require('console')

const EDENAI_API_KEY = process.env.EDENAI_API_KEY
const AUDIO_DIR = path.join(__dirname, '..', 'audio_cache')

// Ensure audio cache directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true })
}

// Supported TTS languages — EdenAI + ElevenLabs support 74 languages
const TTS_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
]

// Curated voice presets — mapped to EdenAI option/language params
const VOICES = {
  rachel: { name: 'Rachel', desc: 'Calm, professional female', option: 'FEMALE', lang: 'en' },
  sarah: { name: 'Sarah', desc: 'Soft, friendly female', option: 'FEMALE', lang: 'en' },
  laura: { name: 'Laura', desc: 'Upbeat, energetic female', option: 'FEMALE', lang: 'en' },
  drew: { name: 'Drew', desc: 'Confident, warm male', option: 'MALE', lang: 'en' },
  charlie: { name: 'Charlie', desc: 'Casual, natural male', option: 'MALE', lang: 'en' },
  clyde: { name: 'Clyde', desc: 'Deep, authoritative male', option: 'MALE', lang: 'en' },
}

// Generic voices for non-English languages
const GENERIC_VOICES = {
  female: { name: 'Female', desc: 'Professional female voice', option: 'FEMALE' },
  male: { name: 'Male', desc: 'Professional male voice', option: 'MALE' },
}

const DEFAULT_VOICE = 'rachel'

/**
 * Generate TTS audio via EdenAI (ElevenLabs provider)
 * @param {string} text - Text to convert
 * @param {string} voiceKey - Voice key from VOICES
 * @returns {{ audioPath: string, audioUrl: string|null }} Local file path + remote URL
 */
async function generateTTS(text, voiceKey = DEFAULT_VOICE, langCode = null) {
  if (!EDENAI_API_KEY) throw new Error('EDENAI_API_KEY not configured')
  if (!text || text.trim().length === 0) throw new Error('Text cannot be empty')

  const voice = VOICES[voiceKey] || GENERIC_VOICES[voiceKey] || VOICES[DEFAULT_VOICE]
  const language = langCode || voice.lang || 'en'

  const res = await axios.post('https://api.edenai.run/v2/audio/text_to_speech', {
    providers: 'elevenlabs',
    text: text.trim(),
    language: language,
    option: voice.option,
  }, {
    headers: {
      Authorization: `Bearer ${EDENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  })

  const result = res.data?.elevenlabs
  if (!result || result.status === 'fail') {
    throw new Error(result?.error?.message || 'EdenAI TTS failed')
  }

  // Save audio to local file for Telegram playback
  const filename = `tts_${Date.now()}_${voiceKey}.mp3`
  const audioPath = path.join(AUDIO_DIR, filename)

  if (result.audio_resource_url) {
    // Download from URL
    const audioRes = await axios.get(result.audio_resource_url, { responseType: 'arraybuffer', timeout: 15000 })
    fs.writeFileSync(audioPath, Buffer.from(audioRes.data))
  } else if (result.audio) {
    // Base64 encoded audio
    const buffer = Buffer.from(result.audio, 'base64')
    fs.writeFileSync(audioPath, buffer)
  } else {
    throw new Error('No audio data in EdenAI response')
  }

  log(`[TTS] Generated: ${filename} (voice: ${voice.name}, ${text.length} chars)`)
  return {
    audioPath,
    audioUrl: result.audio_resource_url || null,
    voice: voice.name,
  }
}

/**
 * Download a Telegram audio/voice file to local storage
 * @param {object} bot - Telegram bot instance
 * @param {string} fileId - Telegram file ID
 * @param {string} prefix - Filename prefix
 * @returns {string} Local file path
 */
async function downloadTelegramAudio(bot, fileId, prefix = 'upload') {
  const file = await bot.getFile(fileId)
  const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`
  const ext = path.extname(file.file_path) || '.ogg'
  const filename = `${prefix}_${Date.now()}${ext}`
  const localPath = path.join(AUDIO_DIR, filename)

  const res = await axios.get(fileUrl, { responseType: 'arraybuffer', timeout: 15000 })
  fs.writeFileSync(localPath, Buffer.from(res.data))
  log(`[TTS] Downloaded Telegram audio: ${filename}`)
  return localPath
}

/**
 * Get voice options formatted for Telegram keyboard
 */
function getVoiceButtons(langCode = 'en') {
  if (langCode && langCode !== 'en') {
    return Object.entries(GENERIC_VOICES).map(([key, v]) => `${v.name} — ${v.desc}`)
  }
  return Object.entries(VOICES).map(([key, v]) => `${v.name} — ${v.desc}`)
}

function getVoiceKeyByButton(buttonText, langCode = 'en') {
  if (langCode && langCode !== 'en') {
    for (const [key, v] of Object.entries(GENERIC_VOICES)) {
      if (buttonText.startsWith(v.name)) return key
    }
    return 'female'
  }
  for (const [key, v] of Object.entries(VOICES)) {
    if (buttonText.startsWith(v.name)) return key
  }
  return DEFAULT_VOICE
}

/**
 * Get language buttons for Telegram keyboard
 */
function getLanguageButtons() {
  return TTS_LANGUAGES.map(l => `${l.flag} ${l.name}`)
}

function getLanguageByButton(buttonText) {
  for (const l of TTS_LANGUAGES) {
    if (buttonText === `${l.flag} ${l.name}`) return l.code
  }
  return null
}

// Clean old audio files (>24h)
function cleanOldAudio() {
  try {
    const files = fs.readdirSync(AUDIO_DIR)
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    for (const f of files) {
      const fp = path.join(AUDIO_DIR, f)
      const stat = fs.statSync(fp)
      if (stat.mtimeMs < cutoff) {
        fs.unlinkSync(fp)
      }
    }
  } catch (e) { /* ignore */ }
}
setInterval(cleanOldAudio, 6 * 60 * 60 * 1000)

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IVR Greeting Templates — Financial Institutions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TEMPLATE_CATEGORIES = [
  { key: 'financial', name: 'Financial Services', icon: '🏦' },
  { key: 'support', name: 'Customer Support', icon: '🎧' },
  { key: 'voicemail', name: 'Voicemail Greetings', icon: '📞' },
]

const GREETING_TEMPLATES = {
  financial: [
    {
      key: 'fin_welcome',
      name: 'General Welcome',
      icon: '🏦',
      text: 'Thank you for calling [Company Name]. For account inquiries, press 1. For customer support, press 2. For fraud reporting, press 3. To repeat this menu, press 9. To speak with a representative, press 0.',
    },
    {
      key: 'fin_fraud',
      name: 'Fraud Hotline',
      icon: '🚨',
      text: 'Thank you for calling our Fraud Prevention Hotline. If you suspect unauthorized activity on your account, press 1. To report a lost or stolen card, press 2. For identity theft concerns, press 3. For all other inquiries, press 0. Your security is our top priority.',
    },
    {
      key: 'fin_support',
      name: 'Customer Support',
      icon: '🎧',
      text: 'Welcome to Customer Support. For balance inquiries and recent transactions, press 1. For transaction disputes, press 2. For loan or credit services, press 3. For online and mobile banking assistance, press 4. To return to the main menu, press 9.',
    },
    {
      key: 'fin_afterhours',
      name: 'After Hours',
      icon: '🌙',
      text: 'Thank you for calling [Company Name]. Our offices are currently closed. Our business hours are Monday through Friday, 9 AM to 5 PM. For urgent fraud concerns, press 1 to reach our 24-hour fraud team. Otherwise, please leave a message after the tone and we will return your call on the next business day.',
    },
    {
      key: 'fin_loans',
      name: 'Loan Services',
      icon: '💰',
      text: 'Thank you for calling our Loan Services Department. For mortgage inquiries, press 1. For personal loan applications, press 2. For auto loan services, press 3. To check your existing loan status, press 4. To speak with a loan officer, press 0.',
    },
    {
      key: 'fin_collections',
      name: 'Collections',
      icon: '📋',
      text: 'You have reached the Collections Department. For payment arrangements, press 1. To make a payment now, press 2. To dispute an account balance, press 3. To speak with a representative, press 0. Please note this call may be recorded for quality and compliance purposes.',
    },
    {
      key: 'fin_wire',
      name: 'Wire & Transfers',
      icon: '🔄',
      text: 'Thank you for calling Wire Transfer Services. For domestic wire transfers, press 1. For international wire transfers, press 2. To check the status of an existing transfer, press 3. For ACH and direct deposit inquiries, press 4. To speak with a specialist, press 0.',
    },
    {
      key: 'fin_invest',
      name: 'Investment Services',
      icon: '📈',
      text: 'Welcome to Investment Services. For portfolio inquiries, press 1. For trading and brokerage, press 2. For retirement and IRA accounts, press 3. For wealth management, press 4. To speak with a financial advisor, press 0.',
    },
  ],
  support: [
    {
      key: 'sup_general',
      name: 'General Support',
      icon: '🎧',
      text: 'Thank you for calling [Company Name] Customer Support. For technical assistance, press 1. For billing inquiries, press 2. For account changes, press 3. For general information, press 4. To speak with an agent, press 0.',
    },
    {
      key: 'sup_tech',
      name: 'Technical Support',
      icon: '🔧',
      text: 'Welcome to Technical Support. For internet and connectivity issues, press 1. For software and application help, press 2. For hardware troubleshooting, press 3. For service outage updates, press 4. To speak with a technician, press 0.',
    },
    {
      key: 'sup_billing',
      name: 'Billing Department',
      icon: '💳',
      text: 'You have reached the Billing Department. For payment inquiries, press 1. To make a payment, press 2. To dispute a charge, press 3. For refund requests, press 4. To speak with a billing specialist, press 0.',
    },
    {
      key: 'sup_callback',
      name: 'Callback Request',
      icon: '📲',
      text: 'Thank you for calling [Company Name]. We are experiencing higher than normal call volume. Your call is important to us. To request a callback, press 1. To continue holding, press 2. To leave a voicemail, press 3. Our estimated wait time is approximately 10 minutes.',
    },
  ],
  voicemail: [
    {
      key: 'vm_professional',
      name: 'Professional',
      icon: '💼',
      text: 'You have reached [Your Name] at [Company Name]. I am unable to take your call right now. Please leave your name, number, and a brief message, and I will return your call as soon as possible. Thank you.',
    },
    {
      key: 'vm_afterhours',
      name: 'After Hours',
      icon: '🌙',
      text: 'Thank you for calling [Company Name]. Our office is currently closed. Our regular business hours are Monday through Friday, 9 AM to 5 PM. Please leave a message and we will return your call on the next business day.',
    },
    {
      key: 'vm_outofoffice',
      name: 'Out of Office',
      icon: '✈️',
      text: 'Hi, you have reached [Your Name]. I am currently out of the office and will return on [Date]. For immediate assistance, please contact [Colleague Name] at [Number]. Otherwise, leave a message and I will get back to you upon my return.',
    },
    {
      key: 'vm_holiday',
      name: 'Holiday Greeting',
      icon: '🎄',
      text: 'Thank you for calling [Company Name]. We are currently closed for the holidays. We will reopen on [Date]. For emergencies, please email [Email]. Wishing you a wonderful holiday season. Please leave a message after the tone.',
    },
    {
      key: 'vm_personal',
      name: 'Personal Short',
      icon: '📱',
      text: 'Hi, this is [Your Name]. I cannot take your call right now. Please leave a message and I will call you back. Thanks.',
    },
    {
      key: 'vm_sales',
      name: 'Sales Team',
      icon: '🤝',
      text: 'Thank you for calling the [Company Name] Sales Team. We are sorry we missed your call. Please leave your name, number, and what you are interested in, and a sales representative will follow up with you shortly.',
    },
  ],
}

/**
 * Get template category buttons for Telegram keyboard
 */
function getTemplateCategoryButtons() {
  return TEMPLATE_CATEGORIES.map(c => `${c.icon} ${c.name}`)
}

function getCategoryByButton(buttonText) {
  for (const c of TEMPLATE_CATEGORIES) {
    if (buttonText === `${c.icon} ${c.name}`) return c.key
  }
  return null
}

/**
 * Get template buttons for a specific category
 */
function getTemplateButtons(categoryKey) {
  const templates = GREETING_TEMPLATES[categoryKey] || []
  return templates.map(t => `${t.icon} ${t.name}`)
}

function getTemplateByButton(categoryKey, buttonText) {
  const templates = GREETING_TEMPLATES[categoryKey] || []
  for (const t of templates) {
    if (buttonText === `${t.icon} ${t.name}`) return t
  }
  return null
}

/**
 * Translate text to target language using OpenAI
 */
async function translateText(text, targetLangCode) {
  if (targetLangCode === 'en') return text
  const langName = TTS_LANGUAGES.find(l => l.code === targetLangCode)?.name || targetLangCode
  let OpenAI = null
  try { OpenAI = require('openai') } catch { return text }
  if (!OpenAI || !process.env.APP_OPEN_API_KEY) return text
  try {
    const ai = new OpenAI({ apiKey: process.env.APP_OPEN_API_KEY })
    const res = await ai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Translate the following IVR phone greeting to ${langName}. Keep the same structure, tone, and press-key references. Replace [Company Name] as-is in the translation. Return ONLY the translated text, nothing else.` },
        { role: 'user', content: text },
      ],
      max_tokens: 500,
      temperature: 0.3,
    })
    return res.choices?.[0]?.message?.content?.trim() || text
  } catch (e) {
    log(`[TTS] Translation error: ${e.message}`)
    return text
  }
}

module.exports = {
  generateTTS,
  downloadTelegramAudio,
  getVoiceButtons,
  getVoiceKeyByButton,
  getLanguageButtons,
  getLanguageByButton,
  getTemplateCategoryButtons,
  getCategoryByButton,
  getTemplateButtons,
  getTemplateByButton,
  translateText,
  VOICES,
  GENERIC_VOICES,
  TTS_LANGUAGES,
  GREETING_TEMPLATES,
  TEMPLATE_CATEGORIES,
  DEFAULT_VOICE,
  AUDIO_DIR,
}
