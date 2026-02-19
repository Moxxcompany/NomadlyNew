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

// Curated voice presets (ElevenLabs voice IDs)
const VOICES = {
  rachel: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', desc: 'Calm, professional female', gender: 'female' },
  drew: { id: '29vD33N1CtxCmqQRPOHJ', name: 'Drew', desc: 'Confident, warm male', gender: 'male' },
  clyde: { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde', desc: 'Deep, authoritative male', gender: 'male' },
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', desc: 'Soft, friendly female', gender: 'female' },
  laura: { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', desc: 'Upbeat, energetic female', gender: 'female' },
  charlie: { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', desc: 'Casual, natural male', gender: 'male' },
}

const DEFAULT_VOICE = 'rachel'

/**
 * Generate TTS audio via EdenAI (ElevenLabs provider)
 * @param {string} text - Text to convert
 * @param {string} voiceKey - Voice key from VOICES
 * @returns {{ audioPath: string, audioUrl: string|null }} Local file path + remote URL if available
 */
async function generateTTS(text, voiceKey = DEFAULT_VOICE) {
  if (!EDENAI_API_KEY) throw new Error('EDENAI_API_KEY not configured')
  if (!text || text.trim().length === 0) throw new Error('Text cannot be empty')

  const voice = VOICES[voiceKey] || VOICES[DEFAULT_VOICE]

  const res = await axios.post('https://api.edenai.run/v2/audio/text_to_speech', {
    providers: 'elevenlabs',
    text: text.trim(),
    language: 'en',
    option: voice.gender === 'male' ? 'MALE' : 'FEMALE',
    settings: {
      elevenlabs: {
        voice_id: voice.id,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      },
    },
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
