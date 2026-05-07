import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, X, Phone, AlertTriangle, RotateCcw, Zap, Volume2, VolumeX, Radio, Globe } from 'lucide-react'
import { useRakshaWebSocket } from '../../hooks/useWebSocket'

// ── Alert sound using Web Audio API (no file needed) ─────────────────────────
function playAlertSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    const playTone = (freq, start, duration, type = 'square') => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
      gain.gain.setValueAtTime(0.3, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + duration)
    }

    // Emergency siren pattern: three rising tones
    playTone(880, 0.0, 0.2)
    playTone(1100, 0.25, 0.2)
    playTone(1320, 0.5, 0.3)
    playTone(880, 0.9, 0.2)
    playTone(1100, 1.15, 0.2)
    playTone(1320, 1.4, 0.3)
  } catch (e) {
    console.log('Audio context not available:', e)
  }
}

function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(523, ctx.currentTime)
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch (e) {}
}

// ── Speak transcript using browser TTS (multilingual) ────────────────────────
// ── Speak transcript using browser TTS (multilingual) ────────────────────────
function speakTranscript(text, languageHint = '') {
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    // 1. Script-based detection (most reliable for native scripts)
    const hasDevanagari = /[\u0900-\u097F]/.test(text)
    const hasKannada = /[\u0C80-\u0CFF]/.test(text)
    
    // 2. Hint-based detection (from backend)
    const hint = languageHint?.toLowerCase() || ''
    
    // 3. Logic to determine language
    if (hasKannada || hint === 'kannada' || hint === 'kn') {
      utterance.lang = 'kn-IN'
    } else if (hint === 'marathi' || (hasDevanagari && (text.includes('आहे') || text.includes('मी') || text.includes('माझे')))) {
      utterance.lang = 'mr-IN'
    } else if (hasDevanagari || hint === 'hindi' || hint === 'hinglish') {
      utterance.lang = 'hi-IN'
    } else {
      utterance.lang = 'en-IN'
    }

    utterance.rate = 0.9 
    utterance.pitch = 1.1
    utterance.volume = 1.0

    // Pick best available voice for the detected language
    const voices = window.speechSynthesis.getVoices()
    const targetLang = utterance.lang.split('-')[0]
    
    const regionalVoice = voices.find(v =>
      v.lang.startsWith(targetLang) && (v.name.includes('India') || v.name.includes('Google'))
    ) || voices.find(v => v.lang.startsWith(targetLang)) || voices[0]
    
    if (regionalVoice) utterance.voice = regionalVoice

    window.speechSynthesis.speak(utterance)
    return true
  } catch (e) {
    console.error('Speech synthesis error:', e)
    return false
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function DemoControls() {
  const [isOpen, setIsOpen] = useState(true)
  const [isLoading, setIsLoading] = useState('')
  const [lastCase, setLastCase] = useState(null)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [mode, setMode] = useState('live') // 'live' | 'simulation'
  const [status, setStatus] = useState('ready') // 'ready' | 'sending' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('')

  const BASE_URL = 'http://localhost:8000'

  // 📡 Listen for Live Cases via WebSocket to trigger automatic audio alerts
  useRakshaWebSocket({
    onNewCase: (newCase) => {
      if (!audioEnabled || mode === 'simulation') return // Simulation mode handles its own alerts to avoid double-play

      const isCritical = newCase.priority === 'critical'
      if (isCritical) {
        playAlertSound()
      } else {
        playSuccessSound()
      }

      // 🗣️ Speak the transcript after 1.5s
      setTimeout(() => {
        if (newCase.raw_transcript && audioEnabled) {
          speakTranscript(newCase.raw_transcript, newCase.language_detected)
        }
      }, 1500)
    }
  })

  const triggerCase = useCallback(async (endpoint, priority = null) => {
    setIsLoading(endpoint)
    setStatus('sending')
    setStatusMsg('Sending to dashboard...')

    try {
      const url = new URL(`${BASE_URL}${endpoint}`)
      if (priority) url.searchParams.set('priority', priority)

      const res = await fetch(url.toString(), { method: 'POST' })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const cas = data.case

      setLastCase(cas)
      setMode('simulation')
      setStatus('success')
      setStatusMsg(`✅ ${cas.intent_type?.replace(/_/g, ' ')} — ${cas.location_area}`)

      // 🔊 Play alert sound
      if (audioEnabled) {
        const isCritical = cas.priority === 'critical'
        if (isCritical) {
          playAlertSound()
        } else {
          playSuccessSound()
        }

        // 🗣️ Speak the transcript after 1.5s
        setTimeout(() => {
          if (cas.raw_transcript && audioEnabled) {
            speakTranscript(cas.raw_transcript, cas.language_detected)
          }
        }, 1500)
      }

    } catch (err) {
      setStatus('error')
      setStatusMsg(`❌ Backend offline. Start: python main.py`)
    } finally {
      setIsLoading('')
      setTimeout(() => {
        if (status !== 'error') {
          setStatus('ready')
          setStatusMsg('')
        }
      }, 5000)
    }
  }, [audioEnabled, status])

  const resetSession = async () => {
    setIsLoading('reset')
    try {
      await fetch(`${BASE_URL}/api/simulate/reset-session`, { method: 'POST' })
      setStatus('success')
      setStatusMsg('🔄 All 20 cases refreshed!')
      setLastCase(null)
      setTimeout(() => { setStatus('ready'); setStatusMsg('') }, 3000)
    } catch {
      setStatusMsg('❌ Reset failed')
    } finally {
      setIsLoading('')
    }
  }

  const priorityColor = (p) => ({
    critical: '#FF2D55', high: '#FF9933', medium: '#FFD60A', low: '#00E676'
  })[p] || '#7B8FA8'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="mb-3 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(4,14,30,0.97)',
              border: '1px solid rgba(255,107,0,0.3)',
              backdropFilter: 'blur(24px)',
              width: 290,
              boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(255,107,0,0.05)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,107,0,0.04)' }}>
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Radio size={14} style={{ color: '#FF9933' }} />
                </motion.div>
                <span className="text-xs font-black tracking-widest" style={{ color: '#FF9933' }}>DEMO CONTROLS</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Audio toggle */}
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  title={audioEnabled ? 'Mute alerts' : 'Enable alerts'}
                  className="p-1 rounded-lg transition-colors"
                  style={{ color: audioEnabled ? '#00E676' : '#3D5068' }}
                >
                  {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                <button onClick={() => setIsOpen(false)} style={{ color: '#3D5068' }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Mode indicator */}
            <div className="flex items-center gap-3 px-4 py-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-1.5">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: mode === 'live' ? '#00E676' : '#FF9933' }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-bold tracking-widest"
                  style={{ color: mode === 'live' ? '#00E676' : '#FF9933' }}>
                  {mode === 'live' ? 'LIVE MODE' : 'SIM MODE'}
                </span>
              </div>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <span className="text-[9px]" style={{ color: '#3D5068' }}>20 cases ready</span>
            </div>

            {/* Status bar */}
            <AnimatePresence>
              {statusMsg && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 text-[10px] font-bold"
                  style={{
                    color: status === 'error' ? '#FF2D55' : status === 'success' ? '#00E676' : '#FF9933',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: status === 'error' ? 'rgba(255,45,85,0.05)' : 'rgba(0,230,118,0.03)'
                  }}>
                  {status === 'sending' && (
                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                      ⏳ {statusMsg}
                    </motion.span>
                  )}
                  {status !== 'sending' && statusMsg}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="p-3 space-y-2">
              {/* Random case */}
              <button
                onClick={() => triggerCase('/api/simulate/emergency')}
                disabled={!!isLoading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:opacity-90 active:scale-98"
                style={{
                  background: 'rgba(255,107,0,0.08)',
                  border: '1px solid rgba(255,107,0,0.2)',
                  opacity: isLoading && isLoading !== '/api/simulate/emergency' ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}>
                <Phone size={15} style={{ color: '#FF9933', flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: '#FF9933' }}>
                    {isLoading === '/api/simulate/emergency' ? 'Sending...' : 'Random Emergency Call'}
                  </p>
                  <p className="text-[9px]" style={{ color: '#3D5068' }}>Picks from 20 unique cases</p>
                </div>
              </button>

              {/* Critical case */}
              <button
                onClick={() => triggerCase('/api/simulate/high-priority')}
                disabled={!!isLoading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'rgba(255,45,85,0.08)',
                  border: '1px solid rgba(255,45,85,0.3)',
                  opacity: isLoading && isLoading !== '/api/simulate/high-priority' ? 0.5 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}>
                <AlertTriangle size={15} style={{ color: '#FF2D55', flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: '#FF2D55' }}>
                    {isLoading === '/api/simulate/high-priority' ? 'Sending...' : '🔴 CRITICAL Alert'}
                  </p>
                  <p className="text-[9px]" style={{ color: '#3D5068' }}>Maximum impact — triggers siren</p>
                </div>
              </button>


              {/* Reset session */}
              <button
                onClick={resetSession}
                disabled={!!isLoading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'rgba(123,143,168,0.06)',
                  border: '1px solid rgba(123,143,168,0.15)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}>
                <RotateCcw size={15} style={{ color: '#7B8FA8', flexShrink: 0 }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: '#7B8FA8' }}>Reset Session</p>
                  <p className="text-[9px]" style={{ color: '#3D5068' }}>Refresh all 20 cases</p>
                </div>
              </button>
            </div>

            {/* Last case preview */}
            <AnimatePresence>
              {lastCase && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <p className="text-[9px] font-black tracking-widest mt-3 mb-2" style={{ color: '#3D5068' }}>LAST SENT:</p>
                  <div className="rounded-lg px-3 py-2"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold" style={{ color: '#F5F0FF' }}>
                        {lastCase.id}
                      </span>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${priorityColor(lastCase.priority)}20`, color: priorityColor(lastCase.priority) }}>
                        {lastCase.priority?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px]" style={{ color: '#7B8FA8' }}>
                      {lastCase.intent_type?.replace(/_/g, ' ')} · {lastCase.location_area}
                    </p>
                    {lastCase.raw_transcript && audioEnabled && (
                      <button
                        onClick={() => speakTranscript(lastCase.raw_transcript, lastCase.language_detected)}
                        className="mt-1.5 flex items-center gap-1 text-[9px] font-bold"
                        style={{ color: '#FF9933' }}
                      >
                        <Volume2 size={10} /> Replay transcript voice
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="px-4 py-2 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-[9px]" style={{ color: '#3D5068' }}>
                {audioEnabled ? '🔊 Audio ON — voice will play on alert' : '🔇 Audio muted'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm"
        style={{
          background: 'linear-gradient(135deg, #FF6B00, #FF9933)',
          boxShadow: '0 4px 20px rgba(255,107,0,0.4)',
          color: 'white'
        }}>
        <Gamepad2 size={16} />
        {isOpen ? 'HIDE' : 'DEMO'}
        {!isOpen && lastCase && (
          <motion.span
            className="w-2 h-2 rounded-full bg-green-400"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  )
}
