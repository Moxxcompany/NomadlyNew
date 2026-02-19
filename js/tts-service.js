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
function getVoiceButtons() {
  return Object.entries(VOICES).map(([key, v]) => `${v.name} — ${v.desc}`)
}

function getVoiceKeyByButton(buttonText) {
  for (const [key, v] of Object.entries(VOICES)) {
    if (buttonText.startsWith(v.name)) return key
  }
  return DEFAULT_VOICE
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

module.exports = {
  generateTTS,
  downloadTelegramAudio,
  getVoiceButtons,
  getVoiceKeyByButton,
  VOICES,
  DEFAULT_VOICE,
  AUDIO_DIR,
}
