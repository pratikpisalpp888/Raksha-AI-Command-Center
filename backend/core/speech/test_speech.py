import asyncio
import os
import sys

# Add backend directory to sys path so imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from core.speech.processor import SpeechProcessor

async def test_main():
    print("Initializing Speech Processor...")
    processor = SpeechProcessor()
    
    # Create mock WAV file (just 2000 null bytes to pass the size validation)
    mock_audio = b'\x00' * 2000
    
    print("\n--- Testing validation ---")
    val = processor.validate_audio(mock_audio)
    print(f"Validation result: {val}")
    
    print("\n--- Testing text emotion backup ---")
    text = "bachao please help mujhe maar dega"
    emotion = await processor.detect_emotion_from_text(text)
    print(f"Text: '{text}' -> Emotion: {emotion['emotion_level']} (Urgency: {emotion['urgency_level']})")

    text2 = "mujhe pareshani ho rahi hai"
    emotion2 = await processor.detect_emotion_from_text(text2)
    print(f"Text: '{text2}' -> Emotion: {emotion2['emotion_level']} (Urgency: {emotion2['urgency_level']})")
    
    print("\nTest completed successfully!")

if __name__ == "__main__":
    asyncio.run(test_main())
