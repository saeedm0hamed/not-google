import re
import nltk
from nltk.corpus import stopwords
import Stemmer

# Download stopwords if not already present
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Initialize Porter Stemmer
stemmer = Stemmer.Stemmer('porter')
stop_words = set(stopwords.words('english'))

def preprocess(text: str) -> list[str]:
    """
    Preprocessing pipeline:
    1. Case folding: .lower()
    2. Remove punctuation: [^a-zA-Z0-9\s]
    3. Tokenize: split on whitespace and commas
    4. Stop word removal
    5. Stemming
    """
    if not text:
        return []

    # 1. Case folding
    text = text.lower()

    # 2. Remove punctuation (keeping spaces for tokenization)
    # We replace commas with spaces first to handle "word1,word2"
    text = text.replace(',', ' ')
    text = re.sub(r'[^a-z0-9\s]', '', text)

    # 3. Tokenize
    tokens = text.split()

    # 4. Stop word removal
    tokens = [t for t in tokens if t not in stop_words]

    # 5. Stemming
    stemmed_tokens = stemmer.stemWords(tokens)

    return stemmed_tokens

def get_token_positions(tokens: list[str]) -> dict[str, list[int]]:
    """
    Returns a dictionary mapping each unique token to its positions in the original list.
    """
    positions = {}
    for i, token in enumerate(tokens):
        if token not in positions:
            positions[token] = []
        positions[token].append(i)
    return positions
