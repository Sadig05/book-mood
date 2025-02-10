import json
from llm_rank import rank_books  # Import the ranking function

# Test data
user_emotions = {
    "anger": 0.0,
    "disgust": 0.0,
    "fear": 0.8,
    "happiness": 0.0,
    "sadness": 0.1,
    "surprise": 0.1
}

book_list = [
    {"title": "Scary Night", "anger": 0.0, "disgust": 0.0, "fear": 0.9, "happiness": 0.0, "sadness": 0.0, "surprise": 0.1},
    {"title": "Happy Days", "anger": 0.0, "disgust": 0.0, "fear": 0.0, "happiness": 0.9, "sadness": 0.0, "surprise": 0.1},
    {"title": "Dark Woods", "anger": 0.0, "disgust": 0.0, "fear": 0.7, "happiness": 0.0, "sadness": 0.1, "surprise": 0.2},
    {"title": "Mystery Tales", "anger": 0.0, "disgust": 0.0, "fear": 0.5, "happiness": 0.0, "sadness": 0.0, "surprise": 0.5}
]

# Run the ranking function
ranked_books = rank_books(user_emotions, book_list)

# Print the results
print("\n🔹 Ranked Book Recommendations:")
for idx, book in enumerate(ranked_books, 1):
    print(f"{idx}. {book['title']} (Match Score: {book['match_score']:.2f})")

# Save results for debugging if needed
with open("ranked_results.json", "w") as f:
    json.dump(ranked_books, f, indent=4)
