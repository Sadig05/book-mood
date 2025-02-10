import pytest
from llm_extract import extract_emotions

# Mock Gemini API response
mock_emotions = {
    "anger": 0.0, "disgust": 0.0, "fear": 0.8,
    "happiness": 0.0, "sadness": 0.1, "surprise": 0.1
}

@pytest.fixture
def mock_gemini(monkeypatch):
    """Mock Gemini API call to avoid quota issues."""
    def mock_extract_emotions(_):
        return mock_emotions
    monkeypatch.setattr("llm_extract.extract_emotions", mock_extract_emotions)

def test_emotion_extraction_basic(mock_gemini):
    """Test basic query for emotion extraction."""
    query = "I want a book that is thrilling and scary."
    emotions = extract_emotions(query)
    assert emotions == mock_emotions, "Emotion extraction should return mocked data"

def test_empty_input(mock_gemini):
    """Test an empty query."""
    emotions = extract_emotions("")
    assert all(value == 0.0 for value in emotions.values()), "All scores should be zero for an empty input"

def test_unrelated_input(mock_gemini):
    """Test an unrelated query."""
    query = "Tell me about the history of mathematics."
    emotions = extract_emotions(query)
    assert all(value == 0.0 for value in emotions.values()), "All scores should be zero for an unrelated query"

if __name__ == "__main__":
    pytest.main()
