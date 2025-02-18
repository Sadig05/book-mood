import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Paths
DATASET_PATH = "../datasets/BookData_1/books_data.csv"
CACHE_PATH = "../datasets/BookData_1/book_vectors.pkl"

# Load dataset
print("📚 Loading books dataset...")
df = pd.read_csv(DATASET_PATH, usecols=['Title', 'description', 'categories'])

# Drop missing descriptions
df.dropna(subset=['description'], inplace=True)

# Fill missing categories with "Unknown"
df['categories'] = df['categories'].fillna("Unknown")

# Preprocess descriptions
df['description'] = df['description'].str.lower().str.replace(r'[^a-zA-Z\s]', '', regex=True).str.strip()

# Initialize TF-IDF vectorizer
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)

# Fit and transform descriptions
print("🔄 Computing TF-IDF vectors...")
tfidf_matrix = vectorizer.fit_transform(df['description'])

# Save TF-IDF vectors, titles, and categories
print("💾 Saving TF-IDF vectors to file...")
joblib.dump((vectorizer, tfidf_matrix, df['Title'].tolist(), df['categories'].tolist()), CACHE_PATH)

print(f"✅ TF-IDF vectors saved at {CACHE_PATH}!")
