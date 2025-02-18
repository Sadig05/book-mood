import json
import pandas as pd
import llm_extract
import llm_rank
import theme_extract
import sys
import io

# 📚 Load books dataset
books_df = pd.read_csv("../datasets/BookData_1/normalized_books.csv")

# 📌 Function to calculate match score (Emotional Matching)
def calculate_match_score(user_emotions, book_emotions):
    score = 0
    for emotion in user_emotions:
        score += user_emotions[emotion] * book_emotions.get(emotion, 0)  # Multiply matching emotions
    return score

# 📌 Main recommendation function
def recommend_books(user_query):
    # 🔍 Step 1: Extract emotions
    user_emotions = llm_extract.extract_emotions(user_query)

    # 🔍 Step 2: Find books that match **emotions**
    emotional_books = []
    for _, row in books_df.iterrows():
        book_emotions = {
            "anger": row["anger"],
            "disgust": row["disgust"],
            "fear": row["fear"],
            "happiness": row["happiness"],
            "sadness": row["sadness"],
            "surprise": row["surprise"]
        }
        score = calculate_match_score(user_emotions, book_emotions)
        if score > 0:
            emotional_books.append({"title": row["Title"], "match_score": score})

    # 🔍 Step 3: Find books that match **themes**
    thematic_books = theme_extract.find_similar_books(user_query, top_k=50)

    # 🔍 Step 4: Rank books using LLM
    top_emotional_books = llm_rank.rank_books(user_query, emotional_books[:50])
    top_thematic_books = llm_rank.rank_books(user_query, thematic_books[:50])

    # ✅ Fallback: If ranking fails, return top sorted books
    if not top_emotional_books:
        top_emotional_books = emotional_books[:3]
    
    if not top_thematic_books:
        top_thematic_books = thematic_books[:3]

    # 📚 **Final Recommendations**
    final_recommendations = {
        "emotional": [
            {"title": book.get("title", "Unknown"), "match_score": book.get("match_score", 0)}
            for book in top_emotional_books[:3]
        ],
        "thematic": [
            {"title": book.get("title", "Unknown"), "similarity": book.get("similarity", 0)}
            for book in top_thematic_books[:3]
        ]
    }

    # Print final JSON recommendations
    print(json.dumps(final_recommendations))


if __name__ == "__main__":
    user_query = input().strip()  # Ensure clean input
    
    # Redirect stdout to capture all prints from the recommendation process
    original_stdout = sys.stdout
    sys.stdout = io.StringIO()

    recommend_books(user_query)

    # Get the captured output and restore original stdout
    captured = sys.stdout.getvalue()
    sys.stdout = original_stdout

    # Extract the final JSON output (assumed to be the last printed line)
    output_lines = captured.strip().splitlines()
    json_output = output_lines[-1] if output_lines else "{}"
    print(json_output)
