import os
import pandas as pd
import numpy as np
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Paths to training and test datasets
TRAIN_PATH = "../datasets/TwitterData/training.csv"
TEST_PATH = "../datasets/TwitterData/test.csv"
VALIDATION_PATH = "../datasets/TwitterData/validation.csv"

# Function to validate dataset
def validate_dataset():
    for path in [TRAIN_PATH, TEST_PATH, VALIDATION_PATH]:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Dataset file missing: {path}")
        df = pd.read_csv(path)
        print(f"\nValidating dataset: {path}")
        print("First 5 rows:")
        print(df.head())
        print("\nColumn Info:")
        print(df.info())
        print("\nMissing Values:")
        print(df.isnull().sum())
        print("\nUnique Labels:")
        print(df['label'].unique())

# Function to train and evaluate models
def train_and_evaluate_models():
    # Loading datasets
    train_df = pd.read_csv(TRAIN_PATH)
    test_df = pd.read_csv(TEST_PATH)
    
    # Extracting features and labels
    X_train, y_train = train_df['text'], train_df['label']
    X_test, y_test = test_df['text'], test_df['label']
    
    # Converting text data into numerical features using TF-IDF
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    
    # Defining models
    models = {
        "Naive Bayes": MultinomialNB(),
        "Logistic Regression": LogisticRegression(max_iter=1000),
        "SVM": SVC(kernel='linear', probability=True),
        "Random Forest": RandomForestClassifier(n_estimators=100)
    }
    
    # Training and evaluating each model
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train_tfidf, y_train)
        y_pred = model.predict(X_test_tfidf)
        
        # Evaluation
        acc = accuracy_score(y_test, y_pred)
        print(f"{name} Accuracy: {acc:.4f}")
        print(f"Classification Report for {name}:")
        print(classification_report(y_test, y_pred))

if __name__ == "__main__":
   # validate_dataset()
    train_and_evaluate_models()

