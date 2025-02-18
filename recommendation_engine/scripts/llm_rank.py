import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

# 🔑 Load API key from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("⚠️ ERROR: Missing GEMINI_API_KEY in .env file!")
    exit()

genai.configure(api_key=GEMINI_API_KEY)

# 🔧 Gemini model configuration
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 2048,
    "response_mime_type": "application/json"
}

# 🧠 Load the Gemini model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
    system_instruction="""
You rank books based on **query relevance**.

Steps:
1. Read the user's query** (what kind of book they want).
2. Compare it with **book descriptions**.
3. Rank books **from most to least relevant**.
4. Return top 3 emotional and top 3 thematic books separately.

Input Example:
{
  "user_query": "I want a thrilling horror book.",
  "books": [
    {"title": "Scary Night", "description": "A terrifying horror novel."},
    {"title": "Happy Days", "description": "A feel-good romance."}
  ]
}

Output Example:
{
  "emotional_books": [
    {"title": "Scary Night", "match_score": 0.95}
  ],
  "thematic_books": [
    {"title": "Ghost House", "match_score": 0.88}
  ]
}
"""
)

def rank_books(user_query, book_list):
    """
    Rank books based on how well they match the user's request.

    :param user_query: The text describing what kind of book the user wants.
    :param book_list: A list of books, where each book has "title" and "description".
    :return: A dictionary with top 3 emotional & top 3 thematic books.
    """

    print("\n🤖 Asking Gemini to rank books...")

    input_data = {
        "user_query": user_query,
        "books": book_list
    }

    try:
        response = model.generate_content(json.dumps(input_data))
        ranked_books = json.loads(response.text)

        # ✅ Extract top 3 books per category
        emotional_books = ranked_books.get("emotional_books", [])[:3]
        thematic_books = ranked_books.get("thematic_books", [])[:3]

        print("✅ Gemini successfully ranked the books!\n")
        return emotional_books + thematic_books  # Return as a single list

    except Exception as e:
        print(f"⚠️ ERROR: Gemini API failed - {e}")
        print("Returning first 3 books per category as fallback.")

        return book_list[:3]  # Fallback: Return the first 3 books if LLM fails

# 🏃 Test the function
if __name__ == "__main__":
    user_query_example = "I want a thrilling horror book that keeps me awake at night."

    book_list_example = [
        {"title": "Scary Night", "description": "A terrifying horror novel."},
        {"title": "Happy Days", "description": "A feel-good romance story."},
        {"title": "Dark Woods", "description": "A psychological thriller."},
        {"title": "Ghost House", "description": "A haunted house horror book."},
        {"title": "Midnight Screams", "description": "A horror book full of suspense."},
    ]

    ranked_books = rank_books(user_query_example, book_list_example)

    print("\n📚 **Top Books:**")
    for book in ranked_books:
        print(f"- {book['title']} (Score: {book.get('match_score', 'N/A')})")
