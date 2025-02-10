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
        # Sadness
        "I feel completely alone in this world.",
        "Nothing excites me anymore, I’ve lost all interest.",
        "My heart aches every time I think about it.",
        "I keep crying myself to sleep every night.",
        "Why does life feel so empty and meaningless?",
        "I miss the days when I used to be happy.",
        "The pain of losing someone never fades.",
        "I feel abandoned by the people I trusted.",
        "Everything reminds me of how much I’ve lost.",
        "I have no motivation to do anything anymore.",

        # Happiness
        "I just got promoted at work, I’m so happy!",
        "Today has been the best day of my life!",
        "I love spending time with my friends and family.",
        "Hearing my favorite song always puts me in a good mood.",
        "I’m so excited for the trip next week!",
        "This is exactly what I’ve always dreamed of!",
        "Life is beautiful when you surround yourself with positivity.",
        "My heart is full of joy seeing them smile.",
        "I feel truly blessed and grateful today.",
        "There’s nothing better than laughing with loved ones.",

        # Disgust (Including Ambiguous Cases)
        "The smell of that garbage made me gag.",
        "I almost threw up when I saw that moldy bread.",
        "The way he treated that poor dog was revolting.",
        "I can’t believe they eat something that looks so disgusting.",
        "The slimy texture of that food made my stomach churn.",
        "That video was so gross I had to look away.",
        "Watching people spit on the sidewalk disgusts me.",
        "Why would anyone wear something so filthy?",
        "Hearing them chew loudly makes me sick.",
        "This place is so unhygienic, it’s disturbing.",

        # Anger
        "How could they lie to me like that?!",
        "I can’t stand people who break promises.",
        "The way they treated me was absolutely unfair!",
        "I’m furious about how they handled the situation.",
        "It makes me so mad when people don’t respect boundaries.",
        "They had no right to make that decision for me.",
        "I feel like punching a wall right now!",
        "My blood is boiling just thinking about it!",
        "I will never forgive them for what they did.",
        "I hate when people act like they’re better than everyone else.",

        # Fear
        "I can hear strange noises outside my house.",
        "My heart is racing, I think someone is following me.",
        "I’m terrified of what might happen next.",
        "I feel like something bad is about to happen.",
        "I hate walking alone in the dark.",
        "The thought of failing scares me to death.",
        "I’m too scared to even move right now.",
        "Every little noise is making me paranoid.",
        "I have a bad feeling about this situation.",
        "I can’t breathe, my anxiety is taking over.",

        # Surprise
        "I just won the lottery, I can’t believe it!",
        "Wait, you mean to tell me that wasn’t a joke?!",
        "I had no idea they were planning a surprise party!",
        "I never expected to see them here!",
        "That twist in the movie completely shocked me!",
        "Wow, I didn’t think this was even possible!",
        "You mean to tell me I got the highest score?!",
        "I’m speechless, this is absolutely amazing!",
        "This is the most unexpected news I’ve ever received!",
        "No way! I can’t believe this actually happened!"
    ]
    
    predictions = predict_emotion(test_texts)
    
    print("\nEmotion Predictions:")
    for text, emotion in zip(test_texts, predictions):
        print(f"Text: {text} -> Predicted Emotion: {emotion}")
