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
NEW_DATASET_PATH = "../datasets/TwitterData/emotions.csv"
DISGUST_EXTRA_PATH = "../datasets/TwitterData/disgust_extra.json"

# Function to create the final dataset
def create_final_dataset():
    # Load datasets
    emotions_df = pd.read_csv(NEW_DATASET_PATH)
    disgust_extra_df = pd.read_json(DISGUST_EXTRA_PATH)

    # Keep only needed columns
    emotions_df = emotions_df[['text', 'label']]
    disgust_extra_df = disgust_extra_df[['text', 'label']]

    # Convert "disgust" to numerical label 2
    disgust_extra_df['label'] = 2

    # Select 5000 samples for each emotion (except disgust)
    final_data = []
    selected_labels = [0, 1, 3, 4, 5]
    for label in selected_labels:
        temp_df = emotions_df[emotions_df['label'] == label].sample(n=5000, random_state=42)
        final_data.append(temp_df)

    final_data = pd.concat(final_data, ignore_index=True)

    # Extract disgust samples (5000 for training, 1500 for validation, 1000 for testing)
    disgust_train = disgust_extra_df.sample(n=5000, random_state=42)
    disgust_remaining = disgust_extra_df.drop(disgust_train.index)
    disgust_validation = disgust_remaining.sample(n=1500, random_state=42)
    disgust_test = disgust_remaining.drop(disgust_validation.index)

    # Merge disgust data into training set
    final_data = pd.concat([final_data, disgust_train], ignore_index=True)

    # Save final dataset
    final_data.to_csv(FINAL_DATASET_PATH, index=False)
    print("Final dataset saved at", FINAL_DATASET_PATH)
    print("Final Label Distribution:")
    print(final_data['label'].value_counts())

    # Split into training, validation, and testing sets
    train_data = final_data

    validation_data_list = []
    test_data_list = []
    for label in selected_labels:
        val_samples = emotions_df[emotions_df['label'] == label].sample(n=1500, random_state=42)
        test_samples = emotions_df[emotions_df['label'] == label].sample(n=1000, random_state=42)
        validation_data_list.append(val_samples)
        test_data_list.append(test_samples)

    validation_data_list.append(disgust_validation)
    test_data_list.append(disgust_test)

    validation_data = pd.concat(validation_data_list, ignore_index=True)
    test_data = pd.concat(test_data_list, ignore_index=True)

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
