import sys
import os
import json
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import conversational_llm  # Import chat system
import math 
# Ensure FastAPI can find `backend/`
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Load book metadata
BOOKS_DATA_PATH = "../recommendation_engine/datasets/BookData_1/books_data.csv"
books_df = pd.read_csv(BOOKS_DATA_PATH)

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend is running!"}



def sanitize_json(data):
    """Recursively removes NaN and Infinity values from JSON to ensure safe serialization."""
    if isinstance(data, dict):
        return {k: sanitize_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_json(v) for v in data]
    elif isinstance(data, float):
        return None if math.isnan(data) or math.isinf(data) else data
    return data



@app.post("/chat")
def chat(user_input: dict):
    """
    Process user messages, return AI responses, and trigger book recommendations if needed.
    If books are recommended, it also fetches their images from books_data.csv.
    """
    user_message = user_input.get("user_message", "").strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Missing user_message")

    response_json = json.loads(conversational_llm.handle_user_message(user_message))

    # If there are books, enrich them with images
    if "books" in response_json:
        response_json["books"] = add_book_images(response_json["books"])

    # 🔍 Sanitize JSON before returning
    response_json = sanitize_json(response_json)

    # 🚀 Print final JSON before returning (DEBUG)
    print("\n✅ Final Response JSON:\n", json.dumps(response_json, indent=2))

    return response_json




def add_book_images(books):
    """
    Enrich recommended books with their image URLs from books_data.csv.
    """
    for category in ["emotional", "thematic"]:
        if category in books:
            for book in books[category]:
                title = book["title"].strip().lower()
                book_row = books_df[books_df["Title"].str.strip().str.lower() == title]

                if not book_row.empty:
                    book["image"] = book_row.iloc[0].get("image", None)  # Add image URL
                else:
                    book["image"] = None  # Default to None if no image found

    return books


### 📚 Fetch Book Details (After Recommendation)
@app.get("/book-details/{title}")
def get_book_details(title: str):
    """
    Fetches metadata (description, authors, image, categories, etc.) for a book.
    """
    book_row = books_df[books_df["Title"].str.strip().str.lower() == title.strip().lower()]
    
    if book_row.empty:
        raise HTTPException(status_code=404, detail="Book not found")
    
    book_data = book_row.iloc[0].to_dict()
    
    return {
        "title": book_data.get("Title", "Unknown"),
        "description": book_data.get("description", "No description available"),
        "authors": book_data.get("authors", "Unknown"),
        "image": book_data.get("image", None),
        "categories": book_data.get("categories", "Uncategorized"),
        "published_date": book_data.get("publishedDate", "Unknown")
    }


### 🔄 Clear Chat History
@app.post("/reset-chat")
def reset_chat():
    """
    Clears the conversation history, allowing users to start fresh.
    """
    conversational_llm.reset_chat_history()  # ✅ Call function to reset chat history
    return {"message": "Chat history cleared!"}

