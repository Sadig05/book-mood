import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import subprocess  # To call recommendation engine

# Load API Key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("⚠️ ERROR: Missing GEMINI_API_KEY!")
    exit()

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# System Instructions (Helps the LLM Decide When to Recommend Books)
SYSTEM_INSTRUCTION = """
You are BookMood Assistant, an AI that helps users discover books based on emotions and themes. 
Your goals:
1. Engage in conversation and understand the user's book preferences.
2. If the user explicitly asks for recommendations (e.g., 'Recommend me a book'), trigger the recommendation system.
3. If the user gradually describes their preferences, wait until you have enough details before recommending.
4. Respond conversationally and naturally.

When introducing yourself, say:  
"Hello! I'm **BookMood Assistant**, your personal AI for book recommendations. Tell me what you're in the mood to read!"

Important:
- When you decide to recommend books, respond with this JSON format:
  {"trigger_recommendation": true, "response": "I found some books you might like!"}
- Otherwise, respond normally as a chatbot.
"""

# Initialize Chat Session
chat = genai.GenerativeModel(model_name="gemini-2.0-flash", system_instruction=SYSTEM_INSTRUCTION).start_chat(history=[])


def handle_user_message(user_message):
    """Handles user messages and decides if recommendations should be triggered."""
    
    print(f"\n📝 User: {user_message}")

    try:
        # Send user message to Gemini chat
        response = chat.send_message(user_message)
        bot_response = response.text

        print(f"🤖 Gemini: {bot_response}")

        # Check if LLM wants to trigger recommendation
        if '{"trigger_recommendation": true' in bot_response:
            print("\n📚 Triggering Recommendation Engine...")

            # Call recommendation engine script
            recommendations = call_recommendation_engine(user_message)

            # Format response
            return json.dumps({
                "response": "I found some books you might like!",
                "books": recommendations
            })

        else:
            # Regular chatbot response
            return json.dumps({
                "response": bot_response,
                "books": []
            })

    except Exception as e:
        print(f"⚠️ ERROR: {e}")
        return json.dumps({"response": "Sorry, I encountered an error.", "books": []})


def call_recommendation_engine(user_query):
    """Calls the recommendation engine and returns book recommendations."""
    
    try:
        # Run recommendation_engine.py and capture output
        result = subprocess.run(
            ["python3", "recommendation_engine.py"],
            input=user_query,
            text=True,
            capture_output=True,
            cwd="../recommendation_engine/scripts"  # Set working directory
        )

        print("\n🔄 Recommendation Engine Output:\n", result.stdout)
        print("\n⚠️ Recommendation Engine Errors:\n", result.stderr)  # Debugging

        # Extract only the last valid JSON line
        output_lines = result.stdout.strip().split("\n")
        json_output = output_lines[-1] if output_lines else "{}"

        # Ensure it's valid JSON
        books = json.loads(json_output)  
        return books

    except json.JSONDecodeError:
        print(f"⚠️ ERROR: Could not parse JSON from recommendation engine.")
        return []

    except Exception as e:
        print(f"⚠️ ERROR: Could not run recommendation engine: {e}")
        return []



if __name__ == "__main__":
    while True:
        user_input = input("\n💬 You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("👋 Exiting chat.")
            break
        response = handle_user_message(user_input)
        print("\n📨 Response to Frontend:", response)
