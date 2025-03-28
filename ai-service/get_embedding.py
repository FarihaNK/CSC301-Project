"""

"""
from transformers import AutoTokenizer, AutoModel # used by embedding function, to convert chunks of
import torch 

from sentence_transformers import SentenceTransformer

class HuggingFaceEmbeddings:
    def __init__(self, model_name: str = "all-mpnet-base-v2"):
        # This loads a model optimized for sentence embeddings
        self.model = SentenceTransformer(model_name)

    def embed_text(self, text: str):
        """
        Converts a single text input into a dense vector representation.
        """
        # encode returns a NumPy array; convert it to a list if needed
        return self.model.encode(text, convert_to_numpy=True).tolist()

    def embed_documents(self, texts: list[str]):
        """
        Converts multiple text inputs into embeddings.
        """
        return self.model.encode(texts, convert_to_numpy=True).tolist()

    def embed_query(self, query: str):
        """
        Embeds a query using the same method as text embedding.
        """
        return self.embed_text(query)

def get_embedding_function():
    return HuggingFaceEmbeddings("all-mpnet-base-v2")
