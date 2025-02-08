import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

# Paths to model
MODEL_PATH = "../models/svm_model.pkl"

# Load trained model and vectorizer
def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Trained model not found. Train the model first.")
    
    model, vectorizer = joblib.load(MODEL_PATH)
    return model, vectorizer

# Function to predict emotion
def predict_emotion(texts):
    model, vectorizer = load_model()
    
    # Convert text input into TF-IDF features
    text_tfidf = vectorizer.transform(texts)
    
    # Predict emotions
    predictions = model.predict(text_tfidf)
    
    # Map numerical labels back to emotions
    label_map = {0: 'sadness', 1: 'happiness', 2: 'disgust', 3: 'anger', 4: 'fear', 5: 'surprise'}
    predicted_emotions = [label_map[pred] for pred in predictions]
    
    return predicted_emotions

if __name__ == "__main__":
    test_texts = [
        "I feel so alone and miserable.",  # Sadness
        "I am extremely excited for my birthday!",  # Happiness
        "That was the most disgusting thing I've ever seen!",  # Disgust
        "I can't believe how unfair this is!",  # Anger
        "I'm scared to go outside alone at night.",  # Fear
        "Wow! This is amazing news!",  # Surprise
        "I just lost my job and I don't know what to do.",  # Sadness
        "Winning this award is the best thing that ever happened to me!",  # Happiness
        "That food smelled awful, I can't eat it!",  # Disgust
        "I am shaking with rage at what they did!",  # Anger
        "My heart is pounding, I think something bad will happen.",  # Fear
        "I didn't expect this at all, what a shock!",  # Surprise
        "I miss my best friend so much, life feels empty without them.",  # Sadness
        "I can't stop smiling, this is the happiest day of my life!",  # Happiness
        "The way they treat people is just revolting!",  # Disgust
        "How dare they betray me like this!",  # Anger
        "I keep hearing strange noises in my house at night, I am terrified!",  # Fear
        "No way! I can't believe this is real!",  # Surprise
    ]
    
    predictions = predict_emotion(test_texts)
    
    print("Emotion Predictions:")
    for text, emotion in zip(test_texts, predictions):
        print(f"Text: {text} -> Predicted Emotion: {emotion}")
