import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Phone, PhoneOff, MapPin, AlertTriangle, Activity, Mic, Clock, Shield, 
  Radio, Volume2, User, CheckCircle, MessageSquare, Send, VolumeX, 
  Unlock, Volume1, Settings, ChevronDown, PlayCircle, Waves, Sparkles,
  ShieldCheck, Zap, Lock, Globe
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Header from "../components/shared/Header"

// ─── Dialogue Script ──────────────────────────────────────────────────────
const DIALOGUE_TREE = {
  initial: {
    text: "मदद करो! कोई मेरा पीछा कर रहा है... मैं नेरुल पार्क के पास हूँ, जल्दी आओ प्लीज! वो आदमी मेरे बहुत करीब आ रहा है!",
    options: [
      { id: "ask_safe", label: "Check Safety", text: "क्या आप किसी सुरक्षित जगह हैं? घबराइए मत, राक्षा हेल्पलाईन आपके साथ है।", next: "caller_safe" },
      { id: "reassure", label: "Reassure", text: "हिम्मत रखिये, हमने आपकी लोकेशन ट्रैक कर ली है। पुलिस की टीम आपकी तरफ निकल चुकी है।", next: "caller_reassured" }
    ]
  },
  caller_safe: {
    text: "हाँ, मैं एक दुकान के पास हूँ, लेकिन यहाँ कोई नहीं है। वो आदमी अभी भी मुझे देख रहा है... प्लीज जल्दी आइये!",
    options: [
      { id: "confirm_dispatch", label: "Final Dispatch", text: "ठीक है, हमारी टीम बस 1 मिनट में वहाँ पहुँच रही है। कॉल मत काटियेगा।", next: "end" }
    ]
  },
  caller_reassured: {
    text: "शुक्रिया... प्लीज जल्दी! मुझे लग रहा है वो पास आ रहा है। मुझे बहुत डर लग रहा है!",
    options: [
      { id: "confirm_dispatch", label: "Final Dispatch", text: "बिल्कुल मत डरिए, पुलिस बस मोड़ पर ही है। हम आपकी आवाज़ सुन रहे हैं।", next: "end" }
    ]
  }
}

export default function LiveCallPage() {
  const navigate = useNavigate()
  const [callState, setCallState] = useState("idle") // idle, ringing, connected, ended
  const [currentStep, setCurrentStep] = useState("initial")
  const [displayedText, setDisplayedText] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [duration, setDuration] = useState(0)
  const [chatHistory, setChatHistory] = useState([])
  const [inputText, setInputText] = useState("")
  
  const timerRef = useRef(null)
  const typingIntervalRef = useRef(null)
  const chatEndRef = useRef(null)
  const ringtoneRef = useRef(null)
  const blipRef = useRef(null)

  // Initialize Sound Effects
  useEffect(() => {
    ringtoneRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3")
    ringtoneRef.current.loop = true
    blipRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3")
    
    // Pre-load voices
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }

    return () => {
      if (ringtoneRef.current) ringtoneRef.current.pause()
      if (timerRef.current) clearInterval(timerRef.current)
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      window.speechSynthesis.cancel()
    }
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory, displayedText])

  const speak = (text, isAgent = false) => {
    return new Promise((resolve) => {
        window.speechSynthesis.cancel()
        
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
        
        const utterance = new SpeechSynthesisUtterance(text)
        const voices = window.speechSynthesis.getVoices()
        
        // Detect language
        const hasKannada = /[\u0C80-\u0CFF]/.test(text)
        const hasDevanagari = /[\u0900-\u097F]/.test(text)
        const hasMarathi = hasDevanagari && (text.includes('आहे') || text.includes('मी') || text.includes('माझे'))
        
        if (hasKannada) utterance.lang = 'kn-IN'
        else if (hasMarathi) utterance.lang = 'mr-IN'
        else if (hasDevanagari) utterance.lang = 'hi-IN'
        else utterance.lang = 'en-IN'

        // SELECT BEST REGIONAL VOICES
        let selectedVoice = null
        const targetLang = utterance.lang.split('-')[0]

        if (isAgent) {
            // Agent uses professional Indian English or Hindi voice
            selectedVoice = voices.find(v => (v.name.includes('Madhur') || v.lang.includes('hi-IN')) && v.name.includes('Google')) || 
                            voices.find(v => v.lang.includes('en-IN')) || 
                            voices[0]
            utterance.pitch = 1.0
            utterance.rate = 1.0
        } else {
            // Caller uses emotional regional voice
            selectedVoice = voices.find(v => v.lang.startsWith(targetLang) && (v.name.includes('Female') || v.name.includes('Google'))) || 
                            voices.find(v => v.lang.startsWith(targetLang)) || 
                            voices[0]
            utterance.pitch = 1.1
            utterance.rate = 0.85
        }

        if (selectedVoice) utterance.voice = selectedVoice
        utterance.volume = 1.0
        
        setIsSpeaking(true)
        setDisplayedText("")

        // Sync typing animation with speech
        let currentPos = 0
        const charTime = (text.length > 50) ? 25 : 45 
        
        typingIntervalRef.current = setInterval(() => {
            if (currentPos <= text.length) {
                setDisplayedText(text.slice(0, currentPos))
                setAudioLevel(20 + Math.random() * 40)
                currentPos += 1
            } else {
                clearInterval(typingIntervalRef.current)
                setAudioLevel(0)
            }
        }, charTime)

        utterance.onend = () => {
            setIsSpeaking(false)
            setAudioLevel(0)
            setChatHistory(prev => [...prev, { role: isAgent ? 'agent' : 'caller', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
            resolve()
        }

        utterance.onerror = (err) => {
            console.error('Speech error:', err)
            setIsSpeaking(false)
            resolve()
        }

        window.speechSynthesis.speak(utterance)
    })
  }

  const handleTriggerEmergency = () => {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance("")) // Wake up engine
    setCallState("ringing")
    if (ringtoneRef.current) {
        ringtoneRef.current.currentTime = 0
        ringtoneRef.current.play().catch(e => console.log("Audio play blocked", e))
    }
  }

  const handlePickUp = async () => {
    if (ringtoneRef.current) ringtoneRef.current.pause()
    setCallState("connected")
    setDuration(0)
    timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000)
    
    await speak(DIALOGUE_TREE.initial.text, false)
  }

  const handleAgentResponse = async (option) => {
    if (isSpeaking) return
    if (blipRef.current) blipRef.current.play().catch(() => {})
    
    await speak(option.text, true)
    
    if (option.next === "end") {
        setTimeout(handleHangUp, 2000)
    } else {
        setCurrentStep(option.next)
        setTimeout(async () => {
            await speak(DIALOGUE_TREE[option.next].text, false)
        }, 800)
    }
  }

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!inputText.trim() || isSpeaking) return
    
    const text = inputText
    setInputText("")
    
    if (blipRef.current) blipRef.current.play().catch(() => {})
    await speak(text, true)
    
    // Simple mock response logic for custom input
    if (text.toLowerCase().includes("location") || text.toLowerCase().includes("कहाँ")) {
        setTimeout(() => speak("मैं नेरुल पार्क के पास काली माता मंदिर के पास हूँ!", false), 1000)
    }
  }

  const handleHangUp = () => {
    setCallState("ended")
    if (ringtoneRef.current) ringtoneRef.current.pause()
    clearInterval(timerRef.current)
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setTimeout(() => {
        setCallState("idle")
        setDisplayedText("")
        setChatHistory([])
        setCurrentStep("initial")
    }, 4000)
  }

  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`

  return (
    <div className="min-h-screen bg-[#02060E] text-[#F5F0FF] overflow-y-auto selection:bg-[#FF9933]/30 font-sans">
      <Header />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FF2D55]/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF9933]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8 min-h-[calc(100vh-100px)]">
        
        {/* MAIN CONSOLE AREA */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-[#FF2D55]/10 border border-[#FF2D55]/30 flex items-center justify-center">
                  <Radio className="text-[#FF2D55] animate-pulse" size={28} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00E676] rounded-full border-2 border-[#02060E] animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                   <h1 className="text-2xl font-black tracking-tight uppercase text-white">Raksha Command Center</h1>
                   <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-[#7B8FA8] uppercase tracking-widest">v4.0 HD</div>
                </div>
                <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#00E676] tracking-widest uppercase">
                        <Lock size={10} /> End-to-End Encrypted
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#7B8FA8] tracking-widest uppercase">
                        <Globe size={10} /> Region: Mumbai-West
                    </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
                {callState === "idle" && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleTriggerEmergency}
                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF2D55] to-[#FF6B00] text-white font-black text-xs tracking-[0.2em] shadow-[0_0_40px_rgba(255,45,85,0.4)] uppercase transition-all"
                    >
                        <Zap size={16} className="group-hover:animate-bounce" />
                        Trigger Live Emergency
                    </motion.button>
                )}
                {callState === "connected" && (
                    <button
                        onClick={handleHangUp}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-red-500 font-bold text-[10px] tracking-widest uppercase hover:bg-red-500/10 transition-all"
                    >
                        <PhoneOff size={14} /> Terminate Link
                    </button>
                )}
            </div>
          </div>

          {/* MAIN CALL INTERFACE */}
          <div className="cyber-card flex-1 flex flex-col p-1 rounded-[40px] bg-white/[0.02] overflow-hidden group border border-white/5 shadow-2xl">
            <div className="flex-1 bg-gradient-to-b from-[#040E1E]/60 to-[#02060E]/80 backdrop-blur-3xl rounded-[38px] flex flex-col p-8 relative overflow-hidden">
                
              {/* Tactical Grid Background Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              {/* Radar Sweep Animation */}
              {(callState === "connected" || callState === "ringing") && <div className="radar-sweep" />}

              <AnimatePresence mode="wait">
                {callState === "connected" ? (
                  <motion.div key="connected" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col h-full relative z-20">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex gap-6">
                        <div className="relative">
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#FF2D55]/20 to-transparent border border-[#FF2D55]/40 flex items-center justify-center shadow-[0_0_50px_rgba(255,45,85,0.15)] overflow-hidden relative group"
                            >
                                <User size={48} className="text-[#FF2D55] relative z-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D55]/30 to-transparent opacity-50" />
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            </motion.div>
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} 
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#00E676] border-4 border-[#040E1E] flex items-center justify-center shadow-[0_0_15px_rgba(0,230,118,0.5)]"
                            >
                                <Activity size={14} className="text-white" />
                            </motion.div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-[#FF2D55] animate-pulse" />
                            <p className="text-[10px] font-black text-[#FF2D55] tracking-[0.5em] uppercase">Biometric Signal: ACTIVE</p>
                          </div>
                          <h4 className="text-4xl font-black text-white tracking-tighter uppercase mb-1 drop-shadow-sm">Priya Sharma</h4>
                          <div className="flex items-center gap-3">
                              <span className="text-xl font-mono font-black text-[#FF2D55] tabular-nums tracking-wider">{formatTime(duration)}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              <span className="text-[10px] font-bold text-[#7B8FA8] uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Secure Line #9928-XA</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end gap-1.5 h-14 bg-black/20 p-3 rounded-2xl border border-white/5">
                          {[...Array(16)].map((_, i) => (
                              <motion.div 
                                  key={i}
                                  animate={{ 
                                      height: isSpeaking ? [8, 36, 12, 32, 8] : [8, 12, 8],
                                      opacity: isSpeaking ? [0.4, 1, 0.6] : 0.2
                                  }}
                                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.03 }}
                                  className="w-1 rounded-full bg-gradient-to-t from-[#FF2D55] to-[#FF6B00]"
                              />
                          ))}
                      </div>
                    </div>

                    {/* AI TRANSCRIPTION BOX - REWORKED FOR SPACING */}
                    <div className="flex-1 bg-black/40 rounded-[48px] border border-white/10 p-10 flex flex-col relative shadow-2xl backdrop-blur-md overflow-hidden border-t-white/20">
                      {/* Scanning Line Effect */}
                      <motion.div 
                        className="absolute left-0 right-0 h-[2px] bg-[#FF2D55]/30 z-10"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                         <div className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
                         <span className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.4em]">Neural Stream v4.2</span>
                      </div>

                      {/* Content Area with Flex for proper distribution */}
                      <div className="flex-1 flex flex-col justify-center items-center py-10">
                        <div className="relative w-full max-w-[92%] text-center overflow-y-auto custom-scrollbar max-h-[220px] px-4">
                          <motion.p 
                            layout
                            className="text-3xl lg:text-4xl font-bold leading-[1.3] text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                          >
                             {displayedText || <span className="opacity-20 italic font-medium tracking-normal text-2xl">Listening to neural patterns...</span>}
                             {isSpeaking && (
                               <motion.span 
                                 animate={{ opacity: [0, 1, 0] }} 
                                 transition={{ duration: 0.6, repeat: Infinity }} 
                                 className="inline-block w-1.5 h-10 bg-[#FF9933] ml-4 align-middle rounded-full shadow-[0_0_20px_#FF9933]" 
                               />
                             )}
                          </motion.p>
                        </div>
                      </div>

                      {/* ACTION CONTROLS - NOW IN-FLOW, NOT ABSOLUTE TO PREVENT OVERLAP */}
                      <div className="mt-auto pt-6 border-t border-white/5">
                          <div className="flex justify-center flex-wrap gap-4">
                              {DIALOGUE_TREE[currentStep].options.map(option => (
                                  <motion.button
                                      key={option.id}
                                      whileHover={{ scale: 1.02, y: -2 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleAgentResponse(option)}
                                      disabled={isSpeaking}
                                      className={`group relative overflow-hidden px-8 py-4 rounded-[20px] font-black text-[10px] tracking-[0.2em] transition-all border shadow-lg ${
                                          isSpeaking 
                                          ? "bg-white/5 text-[#3D5068] cursor-not-allowed border-transparent opacity-50"
                                          : "bg-gradient-to-b from-white/[0.08] to-transparent text-white border-white/10 hover:border-[#FF9933]/50 hover:from-[#FF9933]/20 hover:to-[#FF9933]/5"
                                      }`}
                                  >
                                      <div className="relative z-10 flex items-center gap-3">
                                          <ShieldCheck size={14} className={isSpeaking ? "opacity-20" : "text-[#FF9933] group-hover:scale-110 transition-transform"} />
                                          {option.label.toUpperCase()}
                                      </div>
                                      {!isSpeaking && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                      )}
                                  </motion.button>
                              ))}
                          </div>
                      </div>
                    </div>
                  </motion.div>
                ) : callState === "ringing" ? (
                  <motion.div key="ringing" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center relative z-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,45,85,0.05)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="relative mb-16">
                        <motion.div 
                            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-[-40px] rounded-full border-2 border-[#FF2D55]/30 blur-sm"
                        />
                        <motion.div 
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-[#FF2D55] blur-3xl"
                        />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-20px] rounded-full border border-dashed border-[#FF2D55]/40"
                        />
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="relative w-56 h-56 rounded-full bg-[#040E1E] border-4 border-[#FF2D55] flex items-center justify-center shadow-[0_0_100px_rgba(255,45,85,0.4)] z-10"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 rounded-full" />
                            <Phone size={90} className="text-[#FF2D55] drop-shadow-[0_0_20px_#FF2D55]" fill="#FF2D55" />
                        </motion.div>
                    </div>
                    
                    <div className="mb-12">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mb-6 mx-auto w-fit"
                      >
                         <span className="text-[10px] font-black text-[#FF9933] uppercase tracking-[0.5em]">Neural Signal Detected</span>
                      </motion.div>
                      <h2 className="text-7xl font-black mb-4 uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,45,85,0.6)]">Incoming Distress</h2>
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[#FF2D55] font-black tracking-[0.6em] uppercase text-lg animate-pulse">Location: Nerul Park Sector 15</p>
                        <p className="text-[10px] text-[#7B8FA8] font-bold tracking-[0.3em] uppercase opacity-60">Source: Mobile Uplink #7721-X</p>
                      </div>
                    </div>

                    <div className="flex gap-20">
                      <div className="flex flex-col items-center gap-4">
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePickUp} 
                          className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00E676] to-[#00C853] flex items-center justify-center shadow-[0_0_60px_rgba(0,230,118,0.5)] border-4 border-white/30 group"
                        >
                          <Phone size={48} color="white" className="group-hover:rotate-12 transition-transform" />
                        </motion.button>
                        <span className="text-[11px] font-black text-[#00E676] uppercase tracking-[0.3em]">Accept Link</span>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <motion.button 
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleHangUp} 
                          className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF2D55] to-[#D50000] flex items-center justify-center shadow-[0_0_60px_rgba(255,45,85,0.3)] border-4 border-white/30 group"
                        >
                          <PhoneOff size={48} color="white" className="group-hover:-rotate-12 transition-transform" />
                        </motion.button>
                        <span className="text-[11px] font-black text-[#FF2D55] uppercase tracking-[0.3em]">Reject Feed</span>
                      </div>
                    </div>
                  </motion.div>
                ) : callState === "ended" ? (
                  <motion.div key="ended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 rounded-full bg-[#00E676]/10 border-2 border-[#00E676]/30 flex items-center justify-center mb-8">
                        <CheckCircle size={64} className="text-[#00E676]" />
                    </div>
                    <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Mission Logged</h2>
                    <p className="text-[#7B8FA8] font-bold tracking-[0.3em] uppercase text-xs">Closing Encrypted Session...</p>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="flex-1 flex flex-col items-center justify-center text-center">
                     <div className="relative">
                        <Shield size={120} className="text-white/[0.03] mb-8" />
                        <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-dashed border-white/5 rounded-full" 
                        />
                     </div>
                     <p className="text-[13px] font-black text-[#3D5068] uppercase tracking-[0.8em] animate-pulse">Monitoring Global Distress Signals...</p>
                     <div className="mt-8 flex gap-2">
                        {[...Array(3)].map((_, i) => (
                            <motion.div 
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                                className="w-2 h-2 rounded-full bg-[#FF9933]/40"
                            />
                        ))}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* INTERACTION LOG & CHAT SIDEBAR */}
        <div className="flex flex-col gap-6 h-full overflow-hidden">
            <div className="cyber-card flex-1 flex flex-col rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="p-6 border-bottom border-white/5 flex items-center justify-between bg-white/[0.02]">
                   <h3 className="text-[10px] font-black text-[#7B8FA8] tracking-[0.4em] uppercase flex items-center gap-3">
                      <MessageSquare size={16} className="text-[#FF9933]" />
                      Communication Pipeline
                   </h3>
                   <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                       <span className="text-[8px] font-bold text-[#7B8FA8] uppercase tracking-widest">LIVE DATA</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                   <AnimatePresence initial={false}>
                      {chatHistory.length === 0 && (
                          <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                              <Sparkles size={48} className="mb-4" />
                              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Log awaiting data...</p>
                          </div>
                      )}
                      {chatHistory.map((msg, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: msg.role === 'agent' ? 20 : -20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            className={`flex flex-col ${msg.role === 'agent' ? 'items-end' : 'items-start'}`}
                          >
                              <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] relative shadow-lg ${
                                  msg.role === 'agent' 
                                  ? 'bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] rounded-tr-none' 
                                  : 'bg-white/[0.03] border border-white/10 text-white rounded-tl-none'
                              }`}>
                                  <p className="font-medium leading-relaxed">{msg.text}</p>
                                  <div className="flex items-center justify-between mt-2 opacity-40">
                                      <p className="text-[9px] font-black uppercase tracking-widest">{msg.role === 'agent' ? 'COMMAND' : 'SIGNAL'}</p>
                                      <p className="text-[8px] font-mono">{msg.time}</p>
                                  </div>
                              </div>
                          </motion.div>
                      ))}
                      <div ref={chatEndRef} />
                   </AnimatePresence>
                </div>

                {/* CHAT INPUT BAR */}
                <div className="p-6 bg-[#040E1E]/60 border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="relative group">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={callState !== "connected" || isSpeaking}
                            placeholder={callState === "connected" ? "Transmit instructions..." : "Line inactive..."}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-medium focus:outline-none focus:border-[#FF9933]/50 focus:bg-white/[0.05] transition-all disabled:opacity-30 placeholder:text-[#3D5068]"
                        />
                        <button 
                            type="submit"
                            disabled={callState !== "connected" || isSpeaking || !inputText.trim()}
                            className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center rounded-xl bg-[#FF9933] text-[#02060E] hover:scale-105 active:scale-95 disabled:opacity-0 disabled:scale-90 transition-all shadow-lg"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <button className="text-[9px] font-black text-[#7B8FA8] hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                            <Mic size={12} /> Voice Override
                        </button>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <button className="text-[9px] font-black text-[#7B8FA8] hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                            <Volume2 size={12} /> Auto-Sync
                        </button>
                    </div>
                </div>
            </div>

            {/* QUICK STATS PANEL */}
            <div className="cyber-card p-6 rounded-[24px] bg-white/[0.02] border border-white/5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-black text-[#7B8FA8] uppercase tracking-widest mb-1">Signal Strength</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: "94%" }} className="h-full bg-[#00E676]" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#00E676]">94%</span>
                    </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[8px] font-black text-[#7B8FA8] uppercase tracking-widest mb-1">Packet Loss</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: "2%" }} className="h-full bg-[#FF2D55]" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#FF2D55]">0.02%</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
