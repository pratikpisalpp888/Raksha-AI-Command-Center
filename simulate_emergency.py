"""
╔══════════════════════════════════════════════════════════════╗
║        RAKSHA AI — INTERACTIVE DEMO SIMULATOR  v2.0          ║
║        1092 Women's Emergency Helpline Command Center        ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
  python simulate_emergency.py           → Interactive menu
  python simulate_emergency.py --auto    → Auto-sends 5 cases
  python simulate_emergency.py --critical → Sends only critical cases
"""

import requests
import time
import json
import argparse
import sys

# ─── CONFIG ──────────────────────────────────────────────────────────────────
BASE_URL = "http://localhost:8000"
SIMULATE_URL = f"{BASE_URL}/api/simulate/emergency"
CRITICAL_URL = f"{BASE_URL}/api/simulate/high-priority"
RESET_URL    = f"{BASE_URL}/api/simulate/reset-session"
HEALTH_URL   = f"{BASE_URL}/health"

COLORS = {
    "red":    "\033[91m",
    "green":  "\033[92m",
    "yellow": "\033[93m",
    "blue":   "\033[94m",
    "purple": "\033[95m",
    "cyan":   "\033[96m",
    "white":  "\033[97m",
    "bold":   "\033[1m",
    "reset":  "\033[0m",
}

def c(text, color):
    return f"{COLORS.get(color, '')}{text}{COLORS['reset']}"

def print_header():
    print("\n" + c("═" * 65, "cyan"))
    print(c("  🛡️  RAKSHA AI — DEMO SIMULATOR  v2.0", "bold"))
    print(c("  🇮🇳  1092 Women's Emergency Helpline | Navi Mumbai", "white"))
    print(c("═" * 65, "cyan"))

def print_menu():
    print(f"\n{c('WHAT DO YOU WANT TO DO?', 'yellow')}")
    print(f"  {c('[1]', 'green')} Send a RANDOM emergency case")
    print(f"  {c('[2]', 'red')}    Send a CRITICAL emergency (maximum impact)")
    print(f"  {c('[3]', 'blue')}   Send a HIGH priority case")
    print(f"  {c('[4]', 'purple')} Send MEDIUM priority case")
    print(f"  {c('[5]', 'cyan')}   Auto-send 5 cases in sequence (full demo)")
    print(f"  {c('[R]', 'yellow')} Reset session (refresh all 20 cases)")
    print(f"  {c('[Q]', 'white')}  Quit")
    print()

def check_backend():
    try:
        r = requests.get(HEALTH_URL, timeout=3)
        if r.status_code == 200:
            print(c("  ✅ Backend: ONLINE  (localhost:8000)", "green"))
            return True
    except:
        pass
    print(c("  ❌ Backend is OFFLINE! Run: python main.py  (in raksha-ai/backend)", "red"))
    return False

def send_simulate(url=SIMULATE_URL, priority=None):
    try:
        params = {}
        if priority:
            params["priority"] = priority

        r = requests.post(url, params=params, timeout=10)

        if r.status_code in [200, 201]:
            data = r.json()
            case = data.get("case", {})

            priority_val = case.get("priority", "").upper()
            color_map = {"CRITICAL": "red", "HIGH": "yellow", "MEDIUM": "blue", "LOW": "cyan"}
            color = color_map.get(priority_val, "white")

            print()
            print(c("─" * 65, color))
            print(c(f"  🚨 ALERT SENT TO DASHBOARD!", "bold"))
            print(c("─" * 65, color))
            print(f"  {c('Case ID:', 'white')}    {c(case.get('id', 'N/A'), 'bold')}")
            print(f"  {c('Type:', 'white')}       {c(case.get('intent_type', '').replace('_', ' ').upper(), 'yellow')}")
            print(f"  {c('Priority:', 'white')}   {c(priority_val, color)}")
            print(f"  {c('Emotion:', 'white')}    {c(case.get('emotion_level', '').upper(), 'red')}")
            print(f"  {c('Location:', 'white')}   {c(case.get('location_area', '') + ', ' + case.get('location_city', ''), 'cyan')}")
            print(f"  {c('Caller:', 'white')}     {c(case.get('caller_phone', 'Unknown'), 'white')}")
            print()
            print(f"  {c('Transcript:', 'purple')}")
            transcript = case.get("raw_transcript", "")
            # Word-wrap at 55 chars
            words = transcript.split(" ")
            line = "  > "
            for word in words:
                if len(line) + len(word) > 58:
                    print(c(line, "white"))
                    line = "  > " + word + " "
                else:
                    line += word + " "
            if line.strip() != ">":
                print(c(line, "white"))
            print()
            if case.get("ai_summary"):
                print(f"  {c('AI Summary:', 'green')} {case.get('ai_summary', '')[:120]}...")
            print(c("─" * 65, color))
            print(c("  🔔 Dashboard should be FLASHING now!", "bold"))
            print(c("  🗺️  Map should fly to the incident location!", "bold"))
            print()
            return True
        else:
            print(c(f"  ❌ Failed: HTTP {r.status_code} — {r.text[:200]}", "red"))
            return False
    except requests.exceptions.ConnectionError:
        print(c("  ❌ Cannot reach backend. Is it running on port 8000?", "red"))
        return False
    except Exception as e:
        print(c(f"  ❌ Error: {e}", "red"))
        return False

def reset_session():
    try:
        r = requests.post(RESET_URL, timeout=5)
        if r.status_code == 200:
            print(c("  🔄 Session reset! All 20 cases are available again.", "green"))
        else:
            print(c(f"  ❌ Reset failed: {r.status_code}", "red"))
    except Exception as e:
        print(c(f"  ❌ Error: {e}", "red"))

def auto_demo(count=5):
    print(c(f"\n  🎬 AUTO-DEMO MODE: Sending {count} cases with 8s intervals...\n", "purple"))
    for i in range(count):
        print(c(f"  → Case {i+1}/{count}", "cyan"))
        send_simulate()
        if i < count - 1:
            print(c(f"  ⏳ Waiting 8 seconds before next case...", "white"))
            time.sleep(8)
    print(c(f"\n  ✅ AUTO-DEMO COMPLETE! {count} cases sent.", "green"))

def interactive_mode():
    print_header()
    print()
    backend_ok = check_backend()
    if not backend_ok:
        print(c("\n  Please start the backend and try again.\n", "red"))
        return

    print(c("  📊 20 unique cases ready | No repeats per session", "cyan"))

    while True:
        print_menu()
        try:
            choice = input(c("  Enter choice: ", "bold")).strip().upper()
        except (KeyboardInterrupt, EOFError):
            print(c("\n\n  👋 Exiting Raksha AI Simulator. Stay safe!\n", "cyan"))
            break

        if choice == "1":
            input(c("  Press [ENTER] to send a random emergency case...", "yellow"))
            send_simulate()
        elif choice == "2":
            input(c("  Press [ENTER] to send a CRITICAL emergency case...", "red"))
            send_simulate(url=CRITICAL_URL)
        elif choice == "3":
            input(c("  Press [ENTER] to send a HIGH priority case...", "yellow"))
            send_simulate(priority="high")
        elif choice == "4":
            input(c("  Press [ENTER] to send a MEDIUM priority case...", "blue"))
            send_simulate(priority="medium")
        elif choice == "5":
            auto_demo(count=5)
        elif choice == "R":
            reset_session()
        elif choice in ["Q", "EXIT", "QUIT"]:
            print(c("\n  👋 Exiting Raksha AI Simulator. Stay safe!\n", "cyan"))
            break
        else:
            print(c("  ⚠️  Invalid choice. Use 1-5, R, or Q.", "yellow"))

def main():
    parser = argparse.ArgumentParser(description="Raksha AI Emergency Simulator")
    parser.add_argument("--auto",     action="store_true", help="Auto-send 5 random cases")
    parser.add_argument("--critical", action="store_true", help="Send a critical case immediately")
    parser.add_argument("--count",    type=int, default=5, help="Number of cases for auto mode")
    args = parser.parse_args()

    print_header()
    print()

    if not check_backend():
        print(c("\n  Please start the backend first:\n", "red"))
        print(c("    cd raksha-ai/backend && python main.py\n", "yellow"))
        sys.exit(1)

    if args.critical:
        print(c("  ⚡ CRITICAL MODE\n", "red"))
        send_simulate(url=CRITICAL_URL)
    elif args.auto:
        auto_demo(count=args.count)
    else:
        interactive_mode()

if __name__ == "__main__":
    main()
