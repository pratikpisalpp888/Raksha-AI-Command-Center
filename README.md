# 🛡️ Raksha AI — 1092 Women's Emergency Command Center

Raksha AI is a state-of-the-art, AI-powered emergency response system designed to protect women in distress. It transforms standard 1092 calls into a real-time, actionable tactical dashboard using advanced voice-to-voice AI and sentiment analysis.

## 🚀 Key Features
- **Live Voice-to-Voice Interaction:** Real-time AI processing of emergency calls via Twilio.
- **Multilingual & Dialect Aware:** Automated detection and interpretation of Hindi, Kannada, and Hinglish.
- **Sentiment & Urgency Cues:** Real-time panic level detection with interactive waveforms.
- **Tactical Command Map:** Live Google Maps integration showing exact caller locations with priority markers.
- **Editable AI Suggestions:** Human-in-the-loop design allowing agents to refine AI-generated summaries and notes.
- **Confidence-Aware Escalation:** Automated detection of low-confidence scenarios for immediate human agent intervention.

---

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- [ngrok](https://ngrok.com/) (for real-time Twilio testing)

### 2. Backend Setup
1. Navigate to the backend directory: `cd raksha-ai/backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Configure your `.env` file with your API keys (Twilio, OpenAI, Google Maps, Supabase).
4. Start the server: `python main.py`
   - The backend will run on `http://localhost:8000`

### 3. Frontend Setup
1. Navigate to the frontend directory: `cd raksha-frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
   - The dashboard will be available at `http://localhost:3000`

---

## 🧪 Testing & Demonstration

### The Emergency Simulator (Recommended for Demo)
To demonstrate the full power of the dashboard without making a real international call, use our custom simulator:
1. Ensure the Backend and Frontend are both running.
2. Open a new terminal in the root directory.
3. Run the simulator: `python simulate_emergency.py`
4. **Result:** A "CRITICAL" emergency will instantly pop up on your dashboard with live data, map pins, and transcripts.

### Real Call Testing (Optional)
1. Start `ngrok http 8000`.
2. Copy the ngrok URL and set it as the Webhook URL in your Twilio Console.
3. Call your Twilio number: `+1 754 256 2315`.
4. The dashboard will update in real-time as the AI interacts with the caller.

---

## 🏛️ Project Architecture
- **Frontend:** React, Tailwind CSS, Framer Motion (Animations), Google Maps SDK.
- **Backend:** FastAPI (Python), SQLAlchemy (PostgreSQL/Supabase).
- **AI Core:** OpenAI GPT-4o (Reasoning), Whisper (STT), Hume AI (Emotion).
- **Telephony:** Twilio Voice API.

---

**Government of India • Ministry of Women & Child Development**
🇮🇳 *Raksha • Suraksha • Nyay*
