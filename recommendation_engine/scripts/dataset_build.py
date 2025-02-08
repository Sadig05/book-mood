import os
import pandas as pd
import numpy as np
import nltk
from sklearn.model_selection import train_test_split

# Paths to datasets
FINAL_DATASET_PATH = "../datasets/TwitterData/final_dataset.csv"
TRAIN_PATH = "../datasets/TwitterData/training.csv"
TEST_PATH = "../datasets/TwitterData/test.csv"
VALIDATION_PATH = "../datasets/TwitterData/validation.csv"
EKMAN_DATA_PATH = "../datasets/TwitterData/data.csv"
NEW_DATASET_PATH = "../datasets/TwitterData/emotions.csv"

# Function to create the final dataset
def create_final_dataset():
    # Load datasets
    emotions_df = pd.read_csv(NEW_DATASET_PATH)
    ekman_df = pd.read_csv(EKMAN_DATA_PATH)
    
    # Drop unnecessary columns (SI no, Search key)
    emotions_df = emotions_df[['text', 'label']]
    ekman_df = ekman_df[['Tweets', 'Feeling']].rename(columns={'Tweets': 'text', 'Feeling': 'label'})
    
    # Select 4000 samples for each emotion (except disgust, which we take all available)
    selected_labels = {0: 'sadness', 1: 'happiness', 3: 'anger', 4: 'fear', 5: 'surprise'}
    final_data = pd.concat([
        emotions_df[emotions_df['label'] == label].sample(n=4000, random_state=42)
        for label in selected_labels.keys()
    ], ignore_index=True)
    
    # Extract all "disgust" samples from Ekman dataset
    disgust_data = ekman_df[ekman_df['label'] == 'disgust']
    
    # Replace "love" with "disgust" in the final dataset
    final_data = final_data[final_data['label'] != 2]  # Remove "love"
    disgust_data['label'] = 2  # Assign "disgust" label as 2
    final_data = pd.concat([final_data, disgust_data], ignore_index=True)
    
    # Ensure all labels are numerical
    final_data['label'] = final_data['label'].replace({
        'sadness': 0, 'happiness': 1, 'anger': 3, 'fear': 4, 'surprise': 5, 'disgust': 2
    })
    
    # Save final dataset
    final_data.to_csv(FINAL_DATASET_PATH, index=False)
    print(f"Final dataset saved at {FINAL_DATASET_PATH}")
    print("Final Label Distribution:")
    print(final_data['label'].value_counts())

    # Split into training, validation, and testing sets
    train_data, temp_data = train_test_split(final_data, test_size=0.3, stratify=final_data['label'], random_state=42)
    validation_data, test_data = train_test_split(temp_data, test_size=0.5, stratify=temp_data['label'], random_state=42)
    
    # Save the splits
    train_data.to_csv(TRAIN_PATH, index=False)
    validation_data.to_csv(VALIDATION_PATH, index=False)
    test_data.to_csv(TEST_PATH, index=False)
    
    print("Training, validation, and testing datasets created successfully!")
    print("Training set distribution:")
    print(train_data['label'].value_counts())
    print("Validation set distribution:")
    print(validation_data['label'].value_counts())
    print("Test set distribution:")
    print(test_data['label'].value_counts())

if __name__ == "__main__":
    create_final_dataset()
