import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report

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
    
    # Ensure label column is numeric and drop NaN values
    train_df['label'] = pd.to_numeric(train_df['label'], errors='coerce')
    test_df['label'] = pd.to_numeric(test_df['label'], errors='coerce')
    validation_df['label'] = pd.to_numeric(validation_df['label'], errors='coerce')
    
    train_df.dropna(subset=['label'], inplace=True)
    test_df.dropna(subset=['label'], inplace=True)
    validation_df.dropna(subset=['label'], inplace=True)
    
    return train_df, test_df, validation_df

# Function to preprocess text
def preprocess_text(df):
    df['text'] = df['text'].astype(str).str.lower()
    df['text'] = df['text'].str.replace(r'[^a-zA-Z\s]', '', regex=True)
    df['text'] = df['text'].str.strip()
    return df

# Function to train the model
def train_svm():
    print("Loading datasets...")
    train_df, test_df, validation_df = load_data()
    
    print("Preprocessing text...")
    train_df = preprocess_text(train_df)
    test_df = preprocess_text(test_df)
    validation_df = preprocess_text(validation_df)
    
    print("Vectorizing text...")
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train = vectorizer.fit_transform(train_df['text'])
    X_test = vectorizer.transform(test_df['text'])
    X_validation = vectorizer.transform(validation_df['text'])
    
    y_train = train_df['label']
    y_test = test_df['label']
    y_validation = validation_df['label']
    
    print("Training SVM model...")
    svm_model = SVC(kernel='linear', probability=True)
    svm_model.fit(X_train, y_train)
    
    print("Saving model...")
    joblib.dump((svm_model, vectorizer), MODEL_PATH)
    print("Model saved at", MODEL_PATH)
    
    evaluate_model(svm_model, X_test, y_test, "Test")
    evaluate_model(svm_model, X_validation, y_validation, "Validation")

# Function to evaluate the model
def evaluate_model(model, X, y, dataset_name):
    print("Evaluating", dataset_name, "dataset...")
    if len(y) == 0:
        print(f"Skipping evaluation for {dataset_name} due to empty labels.")
        return
    y_pred = model.predict(X)
    acc = accuracy_score(y, y_pred)
    print(dataset_name, "Accuracy:", round(acc, 4))
    print("Classification Report:")
    print(classification_report(y, y_pred))

if __name__ == "__main__":
    train_svm()
