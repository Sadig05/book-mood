import os
import pandas as pd
import numpy as np
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Paths to datasets
TRAIN_PATH = "../datasets/TwitterData/training.csv"
TEST_PATH = "../datasets/TwitterData/test.csv"
VALIDATION_PATH = "../datasets/TwitterData/validation.csv"
MODEL_PATH = "../models/svm_model.pkl"

# Function to load datasets
def load_data():
    train_df = pd.read_csv(TRAIN_PATH)
    test_df = pd.read_csv(TEST_PATH)
    validation_df = pd.read_csv(VALIDATION_PATH)
    
    return train_df, test_df, validation_df

# Function to preprocess text
def preprocess_text(text):
    text = text.str.lower()
    text = text.str.replace(r'[^a-zA-Z\s]', '', regex=True)  # Remove punctuation
    text = text.str.strip()
    return text

# Function to train SVM model
def train_svm():
    # Load datasets
    train_df, test_df, validation_df = load_data()
    
    # Preprocess text
    train_df['text'] = preprocess_text(train_df['text'])
    test_df['text'] = preprocess_text(test_df['text'])
    validation_df['text'] = preprocess_text(validation_df['text'])
    
    # Convert text to TF-IDF features
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train = vectorizer.fit_transform(train_df['text'])
    X_test = vectorizer.transform(test_df['text'])
    X_validation = vectorizer.transform(validation_df['text'])
    
    # Labels
    y_train = train_df['label']
    y_test = test_df['label']
    y_validation = validation_df['label']
    
    # Train SVM model
    print("Training SVM model...")
    svm_model = SVC(kernel='linear', probability=True)
    svm_model.fit(X_train, y_train)
    
    # Save the model
    joblib.dump((svm_model, vectorizer), MODEL_PATH)
    print(f"Model saved at {MODEL_PATH}")
    
    # Evaluate the model
    evaluate_model(svm_model, X_test, y_test, "Test")
    evaluate_model(svm_model, X_validation, y_validation, "Validation")

# Function to evaluate the model
def evaluate_model(model, X, y, dataset_name):
    y_pred = model.predict(X)
    acc = accuracy_score(y, y_pred)
    print(f"{dataset_name} Accuracy: {acc:.4f}")
    print(f"Classification Report for {dataset_name}:")
    print(classification_report(y, y_pred))

if __name__ == "__main__":
    train_svm()
