import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("⚠️ ERROR: Missing GEMINI_API_KEY in .env file!")
    exit()

genai.configure(api_key=GEMINI_API_KEY)

# Define Gemini model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 1024,
    "response_mime_type": "application/json"
}

# Load Gemini model with instructions
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="""
You extract emotions from **book requests**.

Steps:
1. Analyze the **user's request** for books.
2. Identify emotions **(anger, disgust, fear, happiness, sadness, surprise)**.
3. Score each emotion **from 0 to 1** (total sum must not exceed 1.0).
4. Return a **JSON object** with the six emotions.

Example:
User Request: "I want an uplifting book that makes me feel happy!"
Output:
{
    "anger": 0.0,
    "disgust": 0.0,
    "fear": 0.0,
    "happiness": 0.9,
    "sadness": 0.1,
    "surprise": 0.0
}
"""
)

def extract_emotions(user_query):
    """
    Extract emotions from the user's book request.

    :param user_query: A string describing what kind of book the user wants.
    :return: A dictionary with six emotion scores.
    """

    print("\n Asking Gemini to analyze emotions...")

    try:
        # Send request to Gemini
        response = model.generate_content(f"Extract emotions from this query: {user_query}")

        # Convert Gemini's response to JSON
        emotions = json.loads(response.text)

        # Default emotions (ensures all six exist)
        default_emotions = {
            "anger": 0.0, "disgust": 0.0, "fear": 0.0,
            "happiness": 0.0, "sadness": 0.0, "surprise": 0.0
        }
        emotions = {**default_emotions, **emotions}  # Fill missing values

        # Normalize values if sum exceeds 1.0
        total = sum(emotions.values())
        if total > 1.0:
            for key in emotions:
                emotions[key] = emotions[key] / total  # Scale down to keep sum ≤ 1

        print("Successfully extracted emotions!")
        return emotions

    except Exception as e:
        print(f"⚠️ ERROR: Gemini API failed - {e}")
        print("Returning safe default emotions.")

        # Default values if API fails
        return {
            "anger": 0.0, "disgust": 0.0, "fear": 0.0,
            "happiness": 0.2, "sadness": 0.1, "surprise": 0.1
        }

# Example usage
if __name__ == "__main__":
    sample_query = "I love dark, mysterious books that challenge my mind."
    extracted = extract_emotions(sample_query)

    print("\n Extracted Emotions:")
    print(json.dumps(extracted, indent=4))
