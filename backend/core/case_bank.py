# -*- coding: utf-8 -*-

"""
RAKSHA AI — Emergency Case Bank
20 diverse, realistic emergency scenarios for demo/simulation.
Each case is unique in location, crime type, language, and severity.
"""

import random
from typing import Optional


CASE_BANK = [
    {
        "caller_phone": "+91 98200 11001",
        "language_detected": "Hindi",
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
        "raw_transcript": "कोई मेरा पीछा कर रहा है स्टेशन से... मुझे बहुत डर लग रहा है, जल्दी आओ! वो काली जैकेट पहने है और मेरे पीछे आ रहा है!",
        "ai_summary": "Caller reports being followed from Majestic Metro Station by a man in black jacket. High panic state. Immediate response required.",
        "nearby_station": {"name": "Majestic Transit Police", "lat": 12.9750, "lng": 77.5720}
    },
    {
        "caller_phone": "+91 94480 55667",
        "language_detected": "Kannada",
        "emotion_level": "panic",
        "emotion_score": 0.98,
        "intent_type": "stalking",
        "location_raw": "Near Indiranagar 100ft Road, Bengaluru",
        "location_area": "Indiranagar",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9719,
        "location_lng": 77.6412,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "ಯಾರೋ ನನ್ನನ್ನು ಮೆಟ್ರೋ ಇಂದ ಹಿಂಬಾಲಿಸುತ್ತಿದ್ದಾರೆ... ನನಗೆ ತುಂಬಾ ಭಯವಾಗುತ್ತಿದೆ, ದಯವಿಟ್ಟು ಬೇಗ ಬನ್ನಿ! ಅವನು ಕಪ್ಪು ಜಾಕೆಟ್ ಧರಿಸಿದ್ದಾನೆ!",
        "ai_summary": "Kannada caller reports stalking from Indiranagar. High panic state. Suspect in black jacket following. Urgent response needed.",
        "nearby_station": {"name": "Indiranagar Sector 2", "lat": 12.9700, "lng": 77.6450}
    },
    {
        "caller_phone": "+91 99300 22002",
        "language_detected": "Marathi",
        "emotion_level": "panic",
        "emotion_score": 0.96,
        "intent_type": "domestic_violence",
        "location_raw": "Koramangala 5th Block, near Sony World Signal",
        "location_area": "Koramangala",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9352,
        "location_lng": 77.6245,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "नवऱ्याने मारलं... मला खूप दुखतंय... मुलं घरात आहेत... कृपया लवकर या! दार उघडत नाही...",
        "ai_summary": "Domestic violence reported in Koramangala. Husband assaulted victim. Children present. Victim locked inside. Critical intervention needed."
    },
    {
        "caller_phone": "+91 97400 33003",
        "language_detected": "English",
        "emotion_level": "panic",
        "emotion_score": 0.95,
        "intent_type": "assault",
        "location_raw": "Phoenix Marketcity Parking, Whitefield",
        "location_area": "Whitefield",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9958,
        "location_lng": 77.6963,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "Someone grabbed me in the mall parking! I screamed and ran. They're still in the parking lot. I'm hiding near the pillar. Please hurry!",
        "ai_summary": "Assault attempt at Phoenix Marketcity parking, Whitefield. Caller escaped and hiding. Suspect still on premises. Urgent response needed."
    },
    {
        "caller_phone": "+91 98700 44004",
        "language_detected": "Hindi",
        "emotion_level": "panic",
        "emotion_score": 0.97,
        "intent_type": "kidnapping_attempt",
        "location_raw": "Electronic City Phase 1, Near Wipro Gate",
        "location_area": "Electronic City",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.8399,
        "location_lng": 77.6770,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "एक आदमी गाड़ी में खींचने की कोशिश कर रहा है! मैं इलेक्ट्रॉनिक सिटी में हूँ... विप्रो गेट के पास! कोई नहीं है यहाँ... जल्दी आओ प्लीज़!",
        "ai_summary": "Attempted abduction at Electronic City. Suspect attempted to force victim into a vehicle. Caller alone at location. Critical priority.",
        "nearby_station": {"name": "E-City Tactical Unit", "lat": 12.8550, "lng": 77.6650}
    },
    {
        "caller_phone": "+91 70000 55005",
        "language_detected": "Marathi",
        "emotion_level": "panic",
        "emotion_score": 0.99,
        "intent_type": "acid_attack_threat",
        "location_raw": "MG Road, Brigade Road Junction",
        "location_area": "MG Road",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9738,
        "location_lng": 77.6119,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "एक माणूस बाटली घेऊन माझ्याकडे येतोय... म्हणतोय की ॲसिड टाकेल... MG Road वर आहे मी... देवा!",
        "ai_summary": "Acid attack threat at MG Road. Suspect approaching victim with a bottle. Extreme danger. Immediate armed response required.",
        "nearby_station": {"name": "Cubbon Park Central", "lat": 12.9730, "lng": 77.6100}
    },
    # ── HIGH PRIORITY CASES ──
    {
        "caller_phone": "+91 90000 66006",
        "language_detected": "Hindi",
        "emotion_level": "distressed",
        "emotion_score": 0.87,
        "intent_type": "harassment",
        "location_raw": "HSR Layout, 27th Main Road",
        "location_area": "HSR Layout",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9121,
        "location_lng": 77.6446,
        "priority": "high",
        "status": "new",
        "raw_transcript": "यहाँ कुछ लड़के बहुत परेशान कर रहे हैं... अश्लील बातें बोल रहे हैं... मैं अकेली हूँ पार्क में शाम को...",
        "ai_summary": "Group harassment in HSR Layout. Multiple suspects making obscene remarks at lone victim. Evening time, high risk. Quick response needed.",
        "nearby_station": {"name": "HSR Sector 2 Command", "lat": 12.9150, "lng": 77.6400}
    },
    {
        "caller_phone": "+91 94490 88990",
        "language_detected": "Kannada",
        "emotion_level": "distressed",
        "emotion_score": 0.89,
        "intent_type": "domestic_violence",
        "location_raw": "Malleshwaram 8th Cross, Bengaluru",
        "location_area": "Malleshwaram",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9972,
        "location_lng": 77.5711,
        "priority": "high",
        "status": "new",
        "raw_transcript": "ನನ್ನ ಪತಿ ನನ್ನನ್ನು ಮನೆಯಿಂದ ಹೊರಹಾಕಿದ್ದಾರೆ ಮತ್ತು ಹೊಡೆದಿದ್ದಾರೆ... ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ... ನಾನು ಮಲ್ಲೇಶ್ವರಂನಲ್ಲಿ ಇದ್ದೇನೆ.",
        "ai_summary": "Domestic violence reported in Malleshwaram. Husband assaulted victim and forced her out of the house. Victim in distress on the street. High priority intervention.",
        "nearby_station": {"name": "Malleshwaram Division HQ", "lat": 12.9980, "lng": 77.5720}
    },
    {
        "caller_phone": "+91 88800 77007",
        "language_detected": "English",
        "emotion_level": "distressed",
        "emotion_score": 0.82,
        "intent_type": "cybercrime_blackmail",
        "location_raw": "Marathahalli Bridge, Bengaluru",
        "location_area": "Marathahalli",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9562,
        "location_lng": 77.7019,
        "priority": "high",
        "status": "new",
        "raw_transcript": "Someone is blackmailing me online. They have my private photos and are threatening to send them to my family and office unless I pay them. I'm in Marathahalli. I'm so scared.",
        "ai_summary": "Cybercrime blackmail reported from Marathahalli. Perpetrator threatening to distribute private images unless payment made. Victim in distress."
    },
    {
        "caller_phone": "+91 77700 88008",
        "language_detected": "Marathi",
        "emotion_level": "distressed",
        "emotion_score": 0.85,
        "intent_type": "eve_teasing",
        "location_raw": "Jayanagar 4th Block, near Complex",
        "location_area": "Jayanagar",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9285,
        "location_lng": 77.5831,
        "priority": "high",
        "status": "new",
        "raw_transcript": "जयनगरमध्ये एक गाडीतून चार मुले माझ्या मागे येत आहेत... सीटी वाजवत आहेत आणि त्रास देत आहेत... मी चालत घरी चालले आहे...",
        "ai_summary": "Eve teasing by group in a vehicle following victim on foot in Jayanagar. Four suspects. Victim walking home alone. High risk.",
        "nearby_station": {"name": "Jayanagar 4th Block Station", "lat": 12.9300, "lng": 77.5800}
    },
    {
        "caller_phone": "+91 66600 99009",
        "language_detected": "Hindi",
        "emotion_level": "distressed",
        "emotion_score": 0.88,
        "intent_type": "domestic_violence",
        "location_raw": "BTM Layout 2nd Stage, near Lake",
        "location_area": "BTM Layout",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9165,
        "location_lng": 77.6101,
        "priority": "high",
        "status": "new",
        "raw_transcript": "मेरे ससुराल वाले मुझे दहेज के लिए परेशान कर रहे हैं... आज बहुत मारा... मेरे पति भी साथ में हैं उनके... मुझे निकलना है यहाँ से...",
        "ai_summary": "Dowry harassment and physical assault in BTM Layout. Husband and in-laws both involved. Victim wants to escape. High priority.",
        "nearby_station": {"name": "BTM Lake Patrol Base", "lat": 12.9150, "lng": 77.6150}
    },
    {
        "caller_phone": "+91 55500 10010",
        "language_detected": "English",
        "emotion_level": "distressed",
        "emotion_score": 0.80,
        "intent_type": "workplace_harassment",
        "location_raw": "Manyata Tech Park, Hebbal",
        "location_area": "Hebbal",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 13.0451,
        "location_lng": 77.6204,
        "priority": "high",
        "status": "new",
        "raw_transcript": "My senior manager at our Hebbal office has been sexually harassing me for months. Today he cornered me in the conference room. I'm locked in the washroom right now. Please help.",
        "ai_summary": "Workplace sexual harassment at Manyata Tech Park. Victim locked in washroom after being cornered by senior manager. Immediate intervention required."
    },
  
    {
        "caller_phone": "+91 44400 11011",
        "language_detected": "Hindi",
        "emotion_level": "concerned",
        "emotion_score": 0.65,
        "intent_type": "stalking",
        "location_raw": "Banashankari 3rd Stage, near BDA Complex",
        "location_area": "Banashankari",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9255,
        "location_lng": 77.5468,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "एक अनजान आदमी पिछले 3 दिनों से मेरे ऑफिस के बाहर खड़ा रहता है। आज उसने मेरी गाड़ी का नंबर लिखा। मुझे डर लग रहा है।",
        "ai_summary": "Persistent stalking near Banashankari office. Suspect observed for 3 consecutive days. Today noted victim's vehicle number. Threat escalating."
    },
    {
        "caller_phone": "+91 33300 12012",
        "language_detected": "Marathi",
        "emotion_level": "concerned",
        "emotion_score": 0.60,
        "intent_type": "missing_person",
        "location_raw": "Basavanagudi, near Gandhi Bazaar",
        "location_area": "Basavanagudi",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9421,
        "location_lng": 77.5754,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "माझी मुलगी सकाळपासून घरी आली नाही... ती 16 वर्षाची आहे... शाळेतून निघाली होती पण पोचली नाही... बसवनगुडी आहे आमचं घर...",
        "ai_summary": "Missing minor female (16 years) in Basavanagudi. Did not return from school since morning. Time-sensitive case requiring immediate search."
    },
    {
        "caller_phone": "+91 81230 44556",
        "language_detected": "Kannada",
        "emotion_level": "concerned",
        "emotion_score": 0.72,
        "intent_type": "harassment",
        "location_raw": "Rajajinagar 1st Block, near Temple",
        "location_area": "Rajajinagar",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9904,
        "location_lng": 77.5532,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "ಕೆಲವು ಹುಡುಗರು ದೇವಸ್ಥಾನದ ಬಳಿ ಹುಡುಗಿಯರಿಗೆ ಕಿರುಕುಳ ನೀಡುತ್ತಿದ್ದಾರೆ. ತುಂಬಾ ಮುಜುಗರವಾಗುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಇಲ್ಲಿ ಪೊಲೀಸರನ್ನು ಕಳುಹಿಸಿ.",
        "ai_summary": "Public harassment by group near Rajajinagar temple. Victim reporting inappropriate behavior towards women. Requesting police presence to deter suspects."
    },
    {
        "caller_phone": "+91 22200 13013",
        "language_detected": "Hindi",
        "emotion_level": "concerned",
        "emotion_score": 0.70,
        "intent_type": "harassment",
        "location_raw": "Frazer Town, Coles Road Junction",
        "location_area": "Frazer Town",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9972,
        "location_lng": 77.6111,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "मेट्रो में एक आदमी ने मुझे छुआ... मैंने शोर मचाया पर कोई नहीं रुका... वो उतर कर चला गया Frazer Town में। उसकी फोटो मेरे पास है।",
        "ai_summary": "Molestation on Metro. Suspect de-boarded at Frazer Town. Victim has photo of suspect. Local CCTV should be secured immediately."
    },
    {
        "caller_phone": "+91 11100 14014",
        "language_detected": "English",
        "emotion_level": "concerned",
        "emotion_score": 0.68,
        "intent_type": "cybercrime_blackmail",
        "location_raw": "Yelahanka New Town, Bengaluru",
        "location_area": "Yelahanka",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 13.1007,
        "location_lng": 77.5963,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "There's a fake profile on Instagram using my photos. The account is posting morphed images. I've reported it but nothing is happening. I'm being harassed by unknown people commenting on my real profile.",
        "ai_summary": "Online morphed image harassment via fake Instagram profile. Victim receiving threats on real account in Yelahanka. Cyber cell intervention needed."
    },
    {
        "caller_phone": "+91 98900 15015",
        "language_detected": "Hindi",
        "emotion_level": "concerned",
        "emotion_score": 0.62,
        "intent_type": "domestic_violence",
        "location_raw": "Kalyan Nagar, HRBR Layout",
        "location_area": "Kalyan Nagar",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 13.0221,
        "location_lng": 77.6403,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "मेरे पड़ोस में रोज रात को झगड़ा होता है... एक औरत की आवाज़ आती है... आज खिड़की का शीशा टूटने की आवाज़ आई... मुझे लग रहा है कुछ गड़बड़ है...",
        "ai_summary": "Concerned neighbour reporting possible domestic violence in Kalyan Nagar. Sounds of altercation and breaking glass heard. Welfare check required."
    },
  
    {
        "caller_phone": "+91 97800 16016",
        "language_detected": "Marathi",
        "emotion_level": "calm",
        "emotion_score": 0.40,
        "intent_type": "harassment",
        "location_raw": "Peenya Industrial Area, Stage 2",
        "location_area": "Peenya",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 13.0285,
        "location_lng": 77.5197,
        "priority": "low",
        "status": "new",
        "raw_transcript": "आमच्या सोसायटीत एक सुरक्षारक्षक महिलांशी चुकीच्या प्रकारे वागतो... तक्रार करायची आहे... तातडीचं नाही पण नोंद व्हायला हवी.",
        "ai_summary": "Society security guard behaving inappropriately with female residents in Peenya. Non-urgent complaint. Registration and follow-up required."
    },
    {
        "caller_phone": "+91 87600 17017",
        "language_detected": "English",
        "emotion_level": "calm",
        "emotion_score": 0.35,
        "intent_type": "workplace_harassment",
        "location_raw": "RMZ Ecospace, Sarjapur Road",
        "location_area": "Sarjapur Road",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9231,
        "location_lng": 77.6781,
        "priority": "low",
        "status": "new",
        "raw_transcript": "I want to file a complaint about continuous micro-aggression and sexist remarks from my team lead at our Sarjapur office. It's been ongoing for 2 months. I want it documented.",
        "ai_summary": "Workplace micro-aggression and sexist remarks reported at RMZ Ecospace. Ongoing 2-month pattern. Documentation and HR escalation pathway needed."
    },
    {
        "caller_phone": "+91 76500 18018",
        "language_detected": "Hindi",
        "emotion_level": "calm",
        "emotion_score": 0.42,
        "intent_type": "eve_teasing",
        "location_raw": "JP Nagar 6th Phase, near Rose Garden",
        "location_area": "JP Nagar",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9105,
        "location_lng": 77.5857,
        "priority": "low",
        "status": "new",
        "raw_transcript": "जे पी नगर में रोज़ शाम को कुछ लड़के लड़कियों को परेशान करते हैं। मैं एक रिपोर्ट दर्ज करना चाहती हूँ ताकि वहाँ गश्त बढ़े।",
        "ai_summary": "Recurring eve teasing pattern in JP Nagar. Victim requesting patrol increase rather than emergency response. Preventive action needed."
    },
    {
        "caller_phone": "+91 65400 19019",
        "language_detected": "Marathi",
        "emotion_level": "distressed",
        "emotion_score": 0.75,
        "intent_type": "stalking",
        "location_raw": "Ulsoor Lake Road, Bengaluru",
        "location_area": "Ulsoor",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9815,
        "location_lng": 77.6167,
        "priority": "high",
        "status": "new",
        "raw_transcript": "एक माणूस महिनाभरापासून माझ्या मागे येतोय... फोन नंबर मिळवला कुठूनतरी... आता घरचा पत्ताही माहीत आहे त्याला... खूप भीती वाटतेय...",
        "ai_summary": "Month-long stalking escalation in Ulsoor. Stalker has obtained victim's phone number and home address. High threat level. Immediate protection needed."
    },
    {
        "caller_phone": "+91 54300 20020",
        "language_detected": "English",
        "emotion_level": "panic",
        "emotion_score": 0.93,
        "intent_type": "assault",
        "location_raw": "Lalbagh Botanical Garden, West Gate",
        "location_area": "Lalbagh",
        "location_city": "Bengaluru",
        "location_state": "Karnataka",
        "location_lat": 12.9507,
        "location_lng": 77.5844,
        "priority": "critical",
        "status": "new",
        "raw_transcript": "I came for morning walk at Lalbagh alone and a man attacked me. I hit him with my water bottle and ran. I'm on the main road now. I'm bleeding. My friend is coming but I'm scared he's following me.",
        "ai_summary": "Physical assault at Lalbagh garden. Victim injured and bleeding. Suspect may be pursuing. Ambulance and patrol required immediately.",
        "nearby_station": {"name": "Lalbagh West Gate Unit", "lat": 12.9520, "lng": 77.5830}
    },
    {
        "caller_phone": "+91 88800 15015",
        "language_detected": "English",
        "emotion_level": "concerned",
        "emotion_score": 0.55,
        "intent_type": "harassment",
        "location_raw": "Reliance Corporate Park, Ghansoli",
        "location_area": "Ghansoli",
        "location_city": "Navi Mumbai",
        "location_state": "Maharashtra",
        "location_lat": 19.1245,
        "location_lng": 72.9987,
        "priority": "medium",
        "status": "new",
        "raw_transcript": "I've been facing workplace micro-aggression and sexist remarks for the last 2 months. I want it documented.",
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


_session_used_indices = set()


def get_random_case(priority_filter: Optional[str] = None) -> dict:
    """
    Returns a random case from the bank.
    Ensures NO case repeats in the same session.
    Resets automatically when all cases have been used.
    """
    global _session_used_indices


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
