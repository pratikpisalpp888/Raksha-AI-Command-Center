"use client"

import { CaseHeader } from "@/components/case-detail/case-header"
import { CaseOverview } from "@/components/case-detail/case-overview"
import { CaseTimeline } from "@/components/case-detail/case-timeline"
import { CallTranscript } from "@/components/case-detail/call-transcript"
import { LocationDetails } from "@/components/case-detail/location-details"
import { CallerInfo } from "@/components/case-detail/caller-info"
import { AiAssessment } from "@/components/case-detail/ai-assessment"
import { ActionsTaken } from "@/components/case-detail/actions-taken"
import { CaseNotes } from "@/components/case-detail/case-notes"
import { RelatedCases } from "@/components/case-detail/related-cases"
import { LiveIndicator } from "@/components/case-detail/live-indicator"

// Sample data for the case detail page
const caseData = {
  caseId: "RK20240115A1",
  status: "dispatched" as const,
  priority: "critical" as const,
  emotion: "PANIC",
  emotionScore: 92,
  intent: "Domestic Violence",
  duration: "8:32",
  timestamp: "15 Jan 2024 • 14:31:22 IST",
}

const timelineEvents = [
  {
    time: "14:31:22",
    offset: "",
    title: "Call Received",
    description: "+91XXXXX0001 dialed 1092",
    type: "default" as const,
  },
  {
    time: "14:31:24",
    offset: "(+2s)",
    title: "AI Connected",
    description: "Raksha AI answered in 2.1 seconds",
    type: "saffron" as const,
  },
  {
    time: "14:31:26",
    offset: "(+4s)",
    title: "Language Detected",
    description: "Hindi detected (94% confidence)",
    type: "saffron" as const,
  },
  {
    time: "14:31:30",
    offset: "(+8s)",
    title: "Emotion Analyzed",
    description: "PANIC level detected — Priority elevated",
    type: "red" as const,
  },
  {
    time: "14:31:35",
    offset: "(+13s)",
    title: "Intent Classified",
    description: "Domestic Violence identified (92%)",
    type: "red" as const,
  },
  {
    time: "14:31:40",
    offset: "(+18s)",
    title: "Location Extracted",
    description: "Koramangala, Bangalore",
    type: "saffron" as const,
  },
  {
    time: "14:31:45",
    offset: "(+23s)",
    title: "Verification Sent",
    description: "AI asked verification question to caller",
    type: "saffron" as const,
  },
  {
    time: "14:31:52",
    offset: "(+30s)",
    title: "Caller Confirmed",
    description: "Caller confirmed situation",
    type: "green" as const,
  },
  {
    time: "14:32:01",
    offset: "(+39s)",
    title: "Help Dispatched",
    description: "PCR Van Alpha-1 dispatched • ETA: 4 minutes",
    type: "blue" as const,
    size: "large" as const,
  },
  {
    time: "14:32:02",
    offset: "(+40s)",
    title: "SMS Sent",
    description: "Confirmation SMS sent to caller",
    type: "blue" as const,
  },
  {
    time: "14:39:34",
    offset: "(+8:12)",
    title: "Case Resolved",
    description: "PCR Van arrived, situation handled",
    type: "green" as const,
    size: "large" as const,
  },
]

const transcriptMessages = [
  {
    speaker: "ai" as const,
    time: "14:31:24",
    text: "नमस्ते, यह राक्षा AI है। आप 1092 पर कॉल कर रहे हैं। आपकी समस्या क्या है?",
  },
  {
    speaker: "caller" as const,
    time: "14:31:27",
    text: "मदद करो! मेरे पति मुझे मार रहे हैं!",
  },
  {
    speaker: "ai" as const,
    time: "14:31:29",
    text: "मैं समझ सकती हूं। कृपया शांत रहें। आप अभी कहाँ हैं?",
  },
  {
    speaker: "caller" as const,
    time: "14:31:33",
    text: "कोरमंगला, 5th ब्लॉक में... जल्दी भेजो!",
  },
  {
    speaker: "ai" as const,
    time: "14:31:36",
    text: "मैं आपकी लोकेशन समझ गई हूं - कोरमंगला, 5th ब्लॉक। क्या आप घर के अंदर हैं?",
  },
  {
    speaker: "caller" as const,
    time: "14:31:40",
    text: "हाँ, बेडरूम में बंद हूं। दरवाज़ा तोड़ रहे हैं!",
  },
  {
    speaker: "ai" as const,
    time: "14:31:43",
    text: "पुलिस अभी भेज रही हूं। क्या आपके पास कोई और फ़ोन नंबर है जहाँ मैसेज भेज सकूं?",
  },
  {
    speaker: "caller" as const,
    time: "14:31:48",
    text: "यही नंबर है, जल्दी करो!",
  },
  {
    speaker: "ai" as const,
    time: "14:31:51",
    text: "PCR Van अभी रवाना हो गई है। 4 मिनट में पहुँच जाएगी। क्या आप सुरक्षित जगह पर हैं?",
  },
  {
    speaker: "caller" as const,
    time: "14:31:56",
    text: "हाँ, अभी के लिए...",
  },
  {
    speaker: "ai" as const,
    time: "14:31:59",
    text: "अच्छा। आपको SMS भेज दिया है। पुलिस जल्द ही पहुँच जाएगी। लाइन पर रहें।",
  },
]

const locationData = {
  extractedLocation: "Koramangala, 5th Block",
  coordinates: "12.9352°N, 77.6245°E",
  nearestPolice: "Koramangala PS",
  policeDistance: "1.2km",
  dispatchRoute: "Via 80ft Road",
}

const callerData = {
  phone: "+91XXXXX0001",
  language: "Hindi",
  duration: "8:32",
  callQuality: 87,
  smsConfirmed: true,
}

const aiData = {
  intentConfidence: 92,
  emotionScore: 87,
  locationConfidence: 89,
  overallConfidence: 89,
}

const actionsTaken = [
  "Case logged automatically",
  "Priority set to CRITICAL",
  "PCR Van Alpha-1 dispatched",
  "SMS sent to caller",
  "Supervisor notified",
  "Case resolved in 8:32",
]

const existingNotes = [
  {
    id: "1",
    text: "Caller was in distress. Quick response required. Verified location via voice.",
    author: "AI System",
    timestamp: "15 Jan 2024, 14:32",
  },
  {
    id: "2",
    text: "PCR Van Alpha-1 confirmed arrival. Situation under control.",
    author: "Dispatch Officer",
    timestamp: "15 Jan 2024, 14:40",
  },
]

const relatedCases = [
  {
    id: "RK20240110B3",
    intent: "Domestic Violence",
    location: "Koramangala, 4th Block",
    date: "10 Jan 2024",
    status: "resolved" as const,
  },
  {
    id: "RK20240108C1",
    intent: "Assault",
    location: "Koramangala, 6th Block",
    date: "08 Jan 2024",
    status: "resolved" as const,
  },
  {
    id: "RK20240115D2",
    intent: "Domestic Violence",
    location: "HSR Layout",
    date: "15 Jan 2024",
    status: "dispatched" as const,
  },
]

export default function CaseDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <CaseHeader caseId={caseData.caseId} status={caseData.status} />
      
      {/* Live Status Bar */}
      <LiveIndicator />

      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <CaseOverview
              caseId={caseData.caseId}
              priority={caseData.priority}
              emotion={caseData.emotion}
              emotionScore={caseData.emotionScore}
              intent={caseData.intent}
              duration={caseData.duration}
              timestamp={caseData.timestamp}
            />
            <CaseTimeline events={timelineEvents} />
            <CallTranscript language="Hindi" messages={transcriptMessages} />
            <LocationDetails {...locationData} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <CallerInfo {...callerData} />
            <AiAssessment {...aiData} />
            <ActionsTaken actions={actionsTaken} />
            <CaseNotes notes={existingNotes} />
            <RelatedCases cases={relatedCases} />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/30 py-4 mt-8">
        <div className="container mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-saffron to-saffron-light flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">R</span>
            </div>
            <span>Raksha AI • Bharat Shield</span>
          </div>
          <span>Case last updated: 15 Jan 2024, 14:40:12 IST</span>
        </div>
      </footer>
    </div>
  )
}
