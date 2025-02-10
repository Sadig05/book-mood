import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Paths to datasets
BOOKS_RATING_PATH = "../datasets/BookData_1/Books_rating.csv"
LABELED_BOOKS_PATH = "../datasets/BookData_1/labeled_books.csv"
MODEL_PATH = "../models/svm_model.pkl"

# Function to load datasets
def load_books_data():
    print("📚 Loading book reviews...")
    if not os.path.exists(BOOKS_RATING_PATH):
        raise FileNotFoundError("Books rating dataset not found!")

    # Load only needed columns & limit to 100,000 rows
    df = pd.read_csv(BOOKS_RATING_PATH, usecols=['Title', 'review/text'], nrows=200000)
    
    # Drop rows with missing values
    df.dropna(inplace=True)
    
    return df

# Function to load trained SVM model
def load_model():
    print("Loading emotion model...")
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Trained model not found! Train the model first.")
    
    model, vectorizer = joblib.load(MODEL_PATH)
    return model, vectorizer

# Function to label emotions using SVM model
def label_emotions(reviews, model, vectorizer):
    print("Labeling emotions...")
    
    # Convert reviews to TF-IDF features
    review_tfidf = vectorizer.transform(reviews)
    
    # Predict emotions
    predictions = model.predict(review_tfidf)
    
    return predictions

# Function to process and label books
def process_books():
    # Load book reviews
    books_df = load_books_data()
    
    # Load SVM model
    model, vectorizer = load_model()
    
    # Preprocess text
    print("✍️ Preprocessing text...")
    books_df['review/text'] = books_df['review/text'].astype(str).str.lower().str.replace(r'[^a-zA-Z\s]', '', regex=True).str.strip()

    # Label emotions
    books_df['emotion'] = label_emotions(books_df['review/text'], model, vectorizer)

    # Define emotion labels mapping
    emotion_labels = {0: 'sadness', 1: 'happiness', 2: 'disgust', 3: 'anger', 4: 'fear', 5: 'surprise'}

    # Map numeric labels to emotion names
    books_df['emotion'] = books_df['emotion'].map(emotion_labels)

    # Aggregate emotion counts per book title
    print("Aggregating emotions per book...")
    emotion_counts = books_df.groupby(['Title', 'emotion']).size().unstack(fill_value=0)

    # Ensure all emotion columns exist
    for emotion in emotion_labels.values():
        if emotion not in emotion_counts.columns:
            emotion_counts[emotion] = 0

    # Reset index and save final labeled dataset
    labeled_books_df = emotion_counts.reset_index()
    labeled_books_df.to_csv(LABELED_BOOKS_PATH, index=False)
    
    print(f"Processed books saved at {LABELED_BOOKS_PATH}")

    # Print preview of final labeled data
    print("\n📌 Labeled books preview:")
    print(labeled_books_df.head())

if __name__ == "__main__":
    process_books()
