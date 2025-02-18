import os
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Paths
CACHE_PATH = "../datasets/BookData_1/book_vectors.pkl"

# Load cached TF-IDF vectors
print("📂 Loading cached TF-IDF vectors...")
vectorizer, tfidf_matrix, book_titles, book_categories = joblib.load(CACHE_PATH)

def find_similar_books(user_query, top_k=10):
    """Find books thematically similar to the user's query."""
    
    # Convert query to TF-IDF vector
    query_vector = vectorizer.transform([user_query.lower()])
    
    # Compute cosine similarity
    similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()
    
    # Get top K book indices
    top_indices = np.argsort(similarities)[-top_k:][::-1]

    # Retrieve top books with categories
    top_books = [
        {
            "title": book_titles[i],
            "category": book_categories[i],
            "similarity": similarities[i]
        } 
        for i in top_indices
    ]

    return top_books

# Example usage
if __name__ == "__main__":
    user_query = input("💬 Enter your book preference: ")
    recommendations = find_similar_books(user_query, top_k=10)

    print("\n📚 Thematic Recommendations:")
    for book in recommendations[:5]:  # Show top 5
        print(f"- {book['title']} (Category: {book['category']}, Similarity: {book['similarity']:.4f})")
