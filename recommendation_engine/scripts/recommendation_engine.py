import json
import pandas as pd
import llm_extract
import llm_rank

# Load books dataset (normalized emotions)
print("📚 Loading books dataset...")
books_df = pd.read_csv("../datasets/BookData_1/normalized_books.csv")

# Function to calculate match score
def calculate_match_score(user_emotions, book_emotions):
    score = 0
    for emotion in user_emotions:
        score += user_emotions[emotion] * book_emotions.get(emotion, 0)  # Multiply matching emotions
    return score

# Main recommendation function
def recommend_books(user_query):
    print("\n🚀 Extracting emotions from user query...\n")
    
    # Step 1: Extract emotions
    user_emotions = llm_extract.extract_emotions(user_query)
    print("✅ Successfully extracted emotions!\n")

    # Step 2: Filter books based on user emotions
    print("🔍 Filtering books based on user emotions...")
    filtered_books = []
    
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
        
        if score > 0:  # Keep books with nonzero match score
            filtered_books.append({"title": row["Title"], "match_score": score})
    
    print(f"✅ Found {len(filtered_books)} books matching user emotions!\n")

    # Step 3: Sort books by match score
    filtered_books.sort(key=lambda x: x["match_score"], reverse=True)

    # Step 4: Limit to top 100 books before sending to Gemini
    top_books = filtered_books[:100]
    
    print("📊 Sending books for ranking...\n")
    ranked_books = llm_rank.rank_books(user_emotions, top_books)

    # If Gemini fails, fallback to the first 10 books
    if not ranked_books:
        print("⚠️ ERROR: Gemini API failed. Returning top 10 books as fallback.\n")
        ranked_books = top_books[:10]

    # Step 5: Display final recommendations
    print("\n📚 FINAL RECOMMENDATIONS:")
    for book in ranked_books[:10]:  # Show top 10 ranked books
        print(f"- {book.get('title', 'Unknown')} (Score: {book.get('match_score', 0):.2f})")

# Run the recommendation system
if __name__ == "__main__":
    user_query = input("\n💬 Enter your book preference: ")
    recommend_books(user_query)
