"""
RAKSHA AI — Emergency Case Bank
20 diverse, realistic emergency scenarios for demo/simulation.
Each case is unique in location, crime type, language, and severity.
"""

import random
from typing import Optional

# ─── THE 20-CASE BANK ──────────────────────────────────────────────────────
CASE_BANK = [
    # ── CRITICAL CASES ──
    {
        "caller_phone": "+91 98200 11001",
        "language_detected": "Hindi",
        "emotion_level": "panic",
        "emotion_score": 0.98,
        "intent_type": "stalking",
        "location_raw": "Near Vashi Railway Station, Sector 17",
        "location_area": "Vashi",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0384,
        "location_lng": 73.0121,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "कोई मेरा पीछा कर रहा है स्टेशन से... मुझे बहुत डर लग रहा है, जल्दी आओ! वो काली जैकेट पहने है और मेरे पीछे आ रहा है!",
        "ai_summary": "Caller reports being followed from Vashi Station by a man in black jacket. High panic state. Immediate response required."
    },
    {
        "caller_phone": "+91 94480 55667",
        "language_detected": "Kannada",
        "emotion_level": "panic",
        "emotion_score": 0.98,
        "intent_type": "stalking",
        "location_raw": "Near Majestic Metro Station, Bengaluru",
        "location_area": "Majestic",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9766,
        "location_lng": 77.5712,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "ಯಾರೋ ನನ್ನನ್ನು ಮೆಟ್ರೋ ಇಂದ ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ... ನನಗೆ ತುಂಬಾ ಭಯವಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ಬೇಗ ಬನ್ನಿ! ಅವನು ಕಪ್ಪು ಜಾಕೆಟ್ ಧರಿಸಿದ್ದಾನೆ!",
        "ai_summary": "Kannada caller reports stalking from Majestic Metro Station. High panic state. Suspect in black jacket following. Urgent response needed."
    },
    {
        "caller_phone": "+91 99300 22002",
        "language_detected": "Marathi",
        "emotion_level": "panic",
        "emotion_score": 0.96,
        "intent_type": "domestic_violence",
        "location_raw": "Sector 8, Kharghar, Building No. 14",
        "location_area": "Kharghar",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0473,
        "location_lng": 73.0699,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "नवऱ्याने मारलं... मला खूप दुखतंय... मुलं घरात आहेत... कृपया लवकर या! दार उघडत नाही...",
        "ai_summary": "Domestic violence reported in Kharghar. Husband assaulted victim. Children present. Victim locked inside. Critical intervention needed."
    },
    {
        "caller_phone": "+91 97400 33003",
        "language_detected": "English",
        "emotion_level": "panic",
        "emotion_score": 0.95,
        "intent_type": "assault",
        "location_raw": "Inorbit Mall Parking, Vashi",
        "location_area": "Vashi",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0760,
        "location_lng": 73.0063,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "Someone grabbed me in the mall parking! I screamed and ran. They're still in the parking lot. I'm hiding near the pillar. Please hurry!",
        "ai_summary": "Assault attempt at Inorbit Mall parking, Vashi. Caller escaped and hiding. Suspect still on premises. Urgent response needed."
    },
    {
        "caller_phone": "+91 98700 44004",
        "language_detected": "Hindi",
        "emotion_level": "panic",
        "emotion_score": 0.97,
        "intent_type": "kidnapping_attempt",
        "location_raw": "Nerul Bus Stop, Sector 25",
        "location_area": "Nerul",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0330,
        "location_lng": 73.0169,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "एक आदमी गाड़ी में खींचने की कोशिश कर रहा है! मैं बस स्टॉप पर हूँ... नेरुल में! कोई नहीं है यहाँ... जल्दी आओ प्लीज़!",
        "ai_summary": "Attempted abduction at Nerul bus stop. Suspect attempted to force victim into a vehicle. Caller alone at location. Critical priority."
    },
    {
        "caller_phone": "+91 70000 55005",
        "language_detected": "Marathi",
        "emotion_level": "panic",
        "emotion_score": 0.99,
        "intent_type": "acid_attack_threat",
        "location_raw": "Panvel Market, Old Panvel Road",
        "location_area": "Panvel",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 18.9894,
        "location_lng": 73.1175,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "एक माणूस बाटली घेऊन माझ्याकडे येतोय... म्हणतोय की ॲसिड टाकेल... पनवेल मार्केटमध्ये आहे मी... देवा!",
        "ai_summary": "Acid attack threat in Panvel Market. Suspect approaching victim with a bottle. Extreme danger. Immediate armed response required."
    },
    # ── HIGH PRIORITY CASES ──
    {
        "caller_phone": "+91 90000 66006",
        "language_detected": "Hindi",
        "emotion_level": "distressed",
        "emotion_score": 0.87,
        "intent_type": "harassment",
        "location_raw": "Kharghar Central Park, Sector 20",
        "location_area": "Kharghar",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0501,
        "location_lng": 73.0699,
        "priority": "high",
        "status": "new",
        "raw_transcript": "यहाँ कुछ लड़के बहुत परेशान कर रहे हैं... अश्लील बातें बोल रहे हैं... मैं अकेली हूँ पार्क में शाम को...",
        "ai_summary": "Group harassment in Kharghar Central Park. Multiple suspects making obscene remarks at lone victim. Evening time, high risk. Quick response needed."
    },
    {
        "caller_phone": "+91 94490 88990",
        "language_detected": "Kannada",
        "emotion_level": "distressed",
        "emotion_score": 0.89,
        "intent_type": "domestic_violence",
        "location_raw": "Indiranagar 100ft Road, Sector 4",
        "location_area": "Indiranagar",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9719,
        "location_lng": 77.6412,
        "priority": "high",
        "status": "new",
        "raw_transcript": "ನನ್ನ ಪತಿ ನನ್ನನ್ನು ಮನೆಯಿಂದ ಹೊರಹಾಕಿದ್ದಾರೆ ಮತ್ತು ಹೊಡೆದಿದ್ದಾರೆ... ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ... ನಾನು ಇಂದಿರಾನಗರದಲ್ಲಿ ಇದ್ದೇನೆ.",
        "ai_summary": "Domestic violence reported in Indiranagar. Husband assaulted victim and forced her out of the house. Victim in distress on the street. High priority intervention."
    },
    {
        "caller_phone": "+91 88800 77007",
        "language_detected": "English",
        "emotion_level": "distressed",
        "emotion_score": 0.82,
        "intent_type": "cybercrime_blackmail",
        "location_raw": "Belapur CBD, Sector 11",
        "location_area": "CBD Belapur",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0219,
        "location_lng": 73.0379,
        "priority": "high",
        "status": "new",
        "raw_transcript": "Someone is blackmailing me online. They have my private photos and are threatening to send them to my family and office unless I pay them. I'm in Belapur. I'm so scared.",
        "ai_summary": "Cybercrime blackmail reported from CBD Belapur. Perpetrator threatening to distribute private images unless payment made. Victim in distress."
    },
    {
        "caller_phone": "+91 77700 88008",
        "language_detected": "Marathi",
        "emotion_level": "distressed",
        "emotion_score": 0.85,
        "intent_type": "eve_teasing",
        "location_raw": "Airoli Bridge Road, Near Toll Naka",
        "location_area": "Airoli",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.1590,
        "location_lng": 72.9998,
        "priority": "high",
        "status": "new",
        "raw_transcript": "एअरोलीला एक गाडीतून चार मुले माझ्या मागे येत आहेत... सीटी वाजवत आहेत आणि त्रास देत आहेत... मी चालत घरी चालले आहे...",
        "ai_summary": "Eve teasing by group in a vehicle following victim on foot near Airoli. Four suspects. Victim walking home alone. High risk."
    },
    {
        "caller_phone": "+91 66600 99009",
        "language_detected": "Hindi",
        "emotion_level": "distressed",
        "emotion_score": 0.88,
        "intent_type": "domestic_violence",
        "location_raw": "Sanpada, Sector 3, C Wing Building",
        "location_area": "Sanpada",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0586,
        "location_lng": 73.0130,
        "priority": "high",
        "status": "new",
        "raw_transcript": "मेरे ससुराल वाले मुझे दहेज के लिए परेशान कर रहे हैं... आज बहुत मारा... मेरे पति भी साथ में हैं उनके... मुझे निकलना है यहाँ से...",
        "ai_summary": "Dowry harassment and physical assault in Sanpada. Husband and in-laws both involved. Victim wants to escape. High priority."
    },
    {
        "caller_phone": "+91 55500 10010",
        "language_detected": "English",
        "emotion_level": "distressed",
        "emotion_score": 0.80,
        "intent_type": "workplace_harassment",
        "location_raw": "TCS Building, Vashi IT Park",
        "location_area": "Vashi",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0748,
        "location_lng": 73.0014,
        "priority": "high",
        "status": "new",
        "raw_transcript": "My senior manager at our Vashi office has been sexually harassing me for months. Today he cornered me in the conference room. I'm locked in the washroom right now. Please help.",
        "ai_summary": "Workplace sexual harassment at Vashi IT Park. Victim locked in washroom after being cornered by senior manager. Immediate intervention required."
    },
    # ── MEDIUM PRIORITY CASES ──
    {
        "caller_phone": "+91 44400 11011",
        "language_detected": "Hindi",
        "emotion_level": "concerned",
        "emotion_score": 0.65,
        "intent_type": "stalking",
        "location_raw": "Turbhe MIDC Road, Gate No. 2",
        "location_area": "Turbhe",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0851,
        "location_lng": 73.0237,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "एक अनजान आदमी पिछले 3 दिनों से मेरे ऑफिस के बाहर खड़ा रहता है। आज उसने मेरी गाड़ी का नंबर लिखा। मुझे डर लग रहा है।",
        "ai_summary": "Persistent stalking near Turbhe MIDC office. Suspect observed for 3 consecutive days. Today noted victim's vehicle number. Threat escalating."
    },
    {
        "caller_phone": "+91 33300 12012",
        "language_detected": "Marathi",
        "emotion_level": "concerned",
        "emotion_score": 0.60,
        "intent_type": "missing_person",
        "location_raw": "Ghansoli Node, Sector 6",
        "location_area": "Ghansoli",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.1207,
        "location_lng": 73.0136,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "माझी मुलगी सकाळपासून घरी आली नाही... ती 16 वर्षाची आहे... शाळेतून निघाली होती पण पोचली नाही... घणसोली आहे आमचं घर...",
        "ai_summary": "Missing minor female (16 years) in Ghansoli. Did not return from school since morning. Time-sensitive case requiring immediate search."
    },
    {
        "caller_phone": "+91 81230 44556",
        "language_detected": "Kannada",
        "emotion_level": "concerned",
        "emotion_score": 0.72,
        "intent_type": "harassment",
        "location_raw": "Malleshwaram 8th Cross, near Temple",
        "location_area": "Malleshwaram",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9972,
        "location_lng": 77.5711,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "ಕೆಲವು ಹುಡುಗರು ದೇವಸ್ಥಾನದ ಬಳಿ ಹುಡುಗಿಯರಿಗೆ ಕಿರುಕುಳ ನೀಡುತ್ತಿದ್ದಾರೆ. ತುಂಬಾ ಮುಜುಗರವಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಇಲ್ಲಿ ಪೊಲೀಸರನ್ನು ಕಳುಹಿಸಿ.",
        "ai_summary": "Public harassment by group near Malleshwaram temple. Victim reporting inappropriate behavior towards women. Requesting police presence to deter suspects."
    },
    {
        "caller_phone": "+91 22200 13013",
        "language_detected": "Hindi",
        "emotion_level": "concerned",
        "emotion_score": 0.70,
        "intent_type": "harassment",
        "location_raw": "Kopar Khairane Metro Station Exit 2",
        "location_area": "Kopar Khairane",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.1026,
        "location_lng": 73.0079,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "मेट्रो में एक आदमी ने मुझे छुआ... मैंने शोर मचाया पर कोई नहीं रुका... वो उतर कर चला गया कोपर खैरणे स्टेशन पर। उसकी फोटो मेरे पास है।",
        "ai_summary": "Molestation on Metro. Suspect de-boarded at Kopar Khairane. Victim has photo of suspect. Station CCTV should be secured immediately."
    },
    {
        "caller_phone": "+91 11100 14014",
        "language_detected": "English",
        "emotion_level": "concerned",
        "emotion_score": 0.68,
        "intent_type": "cybercrime_blackmail",
        "location_raw": "Ulwe Sector 19, Navi Mumbai",
        "location_area": "Ulwe",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 18.9740,
        "location_lng": 73.0300,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "There's a fake profile on Instagram using my photos. The account is posting morphed images. I've reported it but nothing is happening. I'm being harassed by unknown people commenting on my real profile.",
        "ai_summary": "Online morphed image harassment via fake Instagram profile. Victim receiving threats on real account. Cyber cell intervention needed."
    },
    {
        "caller_phone": "+91 98900 15015",
        "language_detected": "Hindi",
        "emotion_level": "concerned",
        "emotion_score": 0.62,
        "intent_type": "domestic_violence",
        "location_raw": "Taloja Sector 2, Block B",
        "location_area": "Taloja",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0102,
        "location_lng": 73.1224,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "मेरे पड़ोस में रोज रात को झगड़ा होता है... एक औरत की आवाज़ आती है... आज खिड़की का शीशा टूटने की आवाज़ आई... मुझे लग रहा है कुछ गड़बड़ है...",
        "ai_summary": "Concerned neighbour reporting possible domestic violence in Taloja. Sounds of altercation and breaking glass heard. Welfare check required."
    },
    # ── LOW/AWARENESS CASES ──
    {
        "caller_phone": "+91 97800 16016",
        "language_detected": "Marathi",
        "emotion_level": "calm",
        "emotion_score": 0.40,
        "intent_type": "harassment",
        "location_raw": "Dronagiri, Uran Road, Navi Mumbai",
        "location_area": "Dronagiri",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 18.9241,
        "location_lng": 72.9648,
        "priority": "low",
        "status": "new",
        "raw_transcript": "आमच्या सोसायटीत एक सुरक्षारक्षक महिलांशी चुकीच्या प्रकारे वागतो... तक्रार करायची आहे... तातडीचं नाही पण नोंद व्हायला हवी.",
        "ai_summary": "Society security guard behaving inappropriately with female residents in Dronagiri. Non-urgent complaint. Registration and follow-up required."
    },
    {
        "caller_phone": "+91 87600 17017",
        "language_detected": "English",
        "emotion_level": "calm",
        "emotion_score": 0.35,
        "intent_type": "workplace_harassment",
        "location_raw": "Reliance Corporate Park, Ghansoli",
        "location_area": "Ghansoli",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.1180,
        "location_lng": 73.0120,
        "priority": "low",
        "status": "new",
        "raw_transcript": "I want to file a complaint about continuous micro-aggression and sexist remarks from my team lead at our Ghansoli office. It's been ongoing for 2 months. I want it documented.",
        "ai_summary": "Workplace micro-aggression and sexist remarks reported at Reliance Corporate Park. Ongoing 2-month pattern. Documentation and HR escalation pathway needed."
    },
    {
        "caller_phone": "+91 76500 18018",
        "language_detected": "Hindi",
        "emotion_level": "calm",
        "emotion_score": 0.42,
        "intent_type": "eve_teasing",
        "location_raw": "Palm Beach Road, Seawoods",
        "location_area": "Seawoods",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0207,
        "location_lng": 73.0156,
        "priority": "low",
        "status": "new",
        "raw_transcript": "सी वुड्स में रोज़ शाम को कुछ लड़के पाम बीच रोड पर लड़कियों को परेशान करते हैं। मैं एक रिपोर्ट दर्ज करना चाहती हूँ ताकि वहाँ गश्त बढ़े।",
        "ai_summary": "Recurring eve teasing pattern on Palm Beach Road, Seawoods. Victim requesting patrol increase rather than emergency response. Preventive action needed."
    },
    {
        "caller_phone": "+91 65400 19019",
        "language_detected": "Marathi",
        "emotion_level": "distressed",
        "emotion_score": 0.75,
        "intent_type": "stalking",
        "location_raw": "Belapur Station Road, Sector 15",
        "location_area": "CBD Belapur",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0219,
        "location_lng": 73.0379,
        "priority": "high",
        "status": "new",
        "raw_transcript": "एक माणूस महिनाभरापासून माझ्या मागे येतोय... फोन नंबर मिळवला कुठूनतरी... आता घरचा पत्ताही माहीत आहे त्याला... खूप भीती वाटतेय...",
        "ai_summary": "Month-long stalking escalation in CBD Belapur. Stalker has obtained victim's phone number and home address. High threat level. Immediate protection needed."
    },
    {
        "caller_phone": "+91 54300 20020",
        "language_detected": "English",
        "emotion_level": "panic",
        "emotion_score": 0.93,
        "intent_type": "assault",
        "location_raw": "Kharghar Hills, Nature Trail Entry",
        "location_area": "Kharghar",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.0437,
        "location_lng": 73.0785,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "I came for morning walk at Kharghar Hills alone and a man attacked me. I hit him with my water bottle and ran. I'm on the main road now. I'm bleeding. My friend is coming but I'm scared he's following me.",
        "ai_summary": "Physical assault at Kharghar Hills nature trail. Victim injured and bleeding. Suspect may be pursuing. Ambulance and patrol required immediately."
    },
]

# ─── SESSION TRACKER (prevents same case repeating in one session) ──────────
_session_used_indices = set()


def get_random_case(priority_filter: Optional[str] = None) -> dict:
    """
    Returns a random case from the bank.
    Ensures NO case repeats in the same session.
    Resets automatically when all cases have been used.
    """
    global _session_used_indices

    # Filter by priority if requested
    if priority_filter:
        available = [
            i for i, c in enumerate(CASE_BANK)
            if c["priority"] == priority_filter and i not in _session_used_indices
        ]
    else:
        available = [i for i in range(len(CASE_BANK)) if i not in _session_used_indices]

    # If all cases used, reset the session
    if not available:
        _session_used_indices.clear()
        available = list(range(len(CASE_BANK)))
        if priority_filter:
            available = [i for i, c in enumerate(CASE_BANK) if c["priority"] == priority_filter]

    chosen_idx = random.choice(available)
    _session_used_indices.add(chosen_idx)

    return CASE_BANK[chosen_idx].copy()


def reset_session():
    """Reset the used-case tracker for a new demo session."""
    global _session_used_indices
    _session_used_indices.clear()


def get_case_count():
    return len(CASE_BANK)
