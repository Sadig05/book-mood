import os
import google.generativeai as genai
import json
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Dict, List

# Load API key from .env
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Define Emotion Schema using Pydantic
class EmotionScores(BaseModel):
    anger: float
    disgust: float
    fear: float
    happiness: float
    sadness: float
    surprise: float

# Define model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 4096,
    "response_mime_type": "application/json"
}

# Instantiate Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="""
You are an AI assistant specializing in emotion extraction from user book requests.

Your Task:
- Extract six emotions (anger, disgust, fear, happiness, sadness, surprise) from each user input.
- Return a **valid JSON array**, where each item contains the original query and its emotion scores.
- Ensure the **sum of all scores does not exceed 1.0**.
- **Only return numerical values (float) for emotion scores. Do not return string representations of numbers.**

Rules:
1. **Explicit emotions** (e.g., "I want a scary book") → High score (0.8 - 1.0)
2. **Implied emotions** (e.g., "thrilling" implies fear) → Moderate score (0.4 - 0.7)
3. **Unrelated emotions** → Set the score to 0.0.

Example:
User Queries:
[
    "I want an uplifting and inspiring book that fills me with joy!",
    "Give me a horror book that keeps me awake at night."
]
Output:
[
    {
        "query": "I want an uplifting and inspiring book that fills me with joy!",
        "anger": 0.0,
        "disgust": 0.0,
        "fear": 0.0,
        "happiness": 0.9,
        "sadness": 0.1,
        "surprise": 0.0
    },
    {
        "query": "Give me a horror book that keeps me awake at night.",
        "anger": 0.0,
        "disgust": 0.1,
        "fear": 0.8,
        "happiness": 0.0,
        "sadness": 0.0,
        "surprise": 0.1
    }
]
"""
)

def extract_emotions_bulk(queries: List[str]) -> List[Dict[str, float]]:
    """
    Extract emotion scores for multiple user queries using Gemini.

    :param queries: A list of user queries.
    :return: A list of dictionaries, each containing a query and its emotion scores.
    """
    print("\n🤖 Sending batch queries to Gemini for emotion extraction...")

    try:
        formatted_input = json.dumps(queries)  # Convert list to JSON format
        response = model.generate_content(f"Extract emotions for these queries: {formatted_input}")

        # 🔹 Debugging: Print raw response before parsing
        print("\n📜 Raw Gemini Response:")
        print(response.text)

        # 🔹 Extract JSON from Gemini response
        emotions_list = json.loads(response.text)

        # Ensure all six emotions exist in each result and convert to float
        default_emotions = {
            "anger": 0.0, "disgust": 0.0, "fear": 0.0,
            "happiness": 0.0, "sadness": 0.0, "surprise": 0.0
        }
        for emotions in emotions_list:
            emotions.update({k: default_emotions[k] for k in default_emotions if k not in emotions})
            
            # Convert all values to float to prevent type errors
            for key in emotions:
                if key != "query":
                    emotions[key] = float(emotions[key])

            # Normalize values if sum exceeds 1.0
            total = sum(emotions[k] for k in default_emotions)
            if total > 1.0:
                emotions.update({k: v / total for k, v in emotions.items() if k != "query"})

        print("✅ Successfully extracted emotions for all queries!")
        return emotions_list

    except json.JSONDecodeError:
        print("⚠️ Failed to parse JSON response. Returning defaults.")
    except Exception as e:
        print(f"⚠️ Gemini API error: {e}. Returning defaults.")

    # 🔹 Return default values on failure
    return [{"query": q, "anger": 0.0, "disgust": 0.0, "fear": 0.0, "happiness": 0.2, "sadness": 0.1, "surprise": 0.1} for q in queries]

# 🔹 Test Queries
test_queries = [
    "I want a heartwarming book that makes me smile.",
    "Give me an inspiring book that fills me with hope and happiness.",
    "I love stories with happy endings that leave me feeling good.",
    "I need a book that makes me cry.",
    "Recommend a deeply emotional and heartbreaking novel.",
    "I enjoy tragic love stories that leave a lasting impact.",
    "I want a thrilling horror book that keeps me awake at night.",
    "Give me something dark and terrifying with unexpected twists.",
    "I enjoy psychological thrillers that make my heart race.",
    "I want a book that is mysterious and makes me think deeply.",
    "Give me a story with unexpected plot twists and hidden meanings.",
    "I love books that challenge my perception of reality.",
    "I need an action-packed adventure book full of surprises!",
    "Recommend a fast-paced book with lots of twists and excitement.",
    "I love stories of heroes going on epic quests.",
    "I want a book that explores dark, unsettling themes.",
    "Give me something disturbing and psychologically intense.",
    "I enjoy reading about the darker sides of human nature.",
    "Tell me about the history of mathematics.",
    "What is the best way to cook pasta?"
]

# 🔹 Run Emotion Extraction for All Queries in One Call
if __name__ == "__main__":
    extracted_results = extract_emotions_bulk(test_queries)

    # Print results in readable format
    print("\n📊 Extracted Emotions for All Queries:")
    print(json.dumps(extracted_results, indent=4))
