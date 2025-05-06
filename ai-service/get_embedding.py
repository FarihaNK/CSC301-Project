"""

"""
from transformers import AutoTokenizer, AutoModel # used by embedding function, to convert chunks of
import torch 

<<<<<<< HEAD
class HuggingFaceEmbeddings:
    # load tokenizer  & model from hugging Face
    def __init__(self, model_name: str):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name)

    def embed_text(self, text: str):
        """
         Converts a single text input into a dense vector representation (embedding).

          This function tokenizes the input text, converts the tokens into embeddings using a pre-trained model,
          and then aggregates these embeddings into a single vector using mean pooling. The result is a list
          of floating-point numbers representing the text.

          Args:
            text (str): The input text to be converted into an embedding. It should be a string.

         Returns:
            List[float]: A list of floating-point numbers representing the embedding of the input text.
            The length of the list corresponds to the size of the embedding vector used by the model.

         Example:
            >>> embeddings = HuggingFaceEmbeddings(model_name="distilbert-base-uncased")
            >>> vector = embeddings.embed_text("Hello, world!")
            >>> print(vector)
            [0.123, -0.456, 0.789, ...]  # Example output; the actual values will vary.
          """
        #Truncation: cut off extra text, Padding: padd text ensuring its the same length
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True) # returns pytorch tensors
        with torch.no_grad(): # disable gradiant not needed for making inferences.
            outputs = self.model(**inputs) # send to pretrained model
        # Mean pooling and convert to list
        # to.list ->convert tensor to python list
        return outputs.last_hidden_state.mean(dim=1).squeeze().tolist() # access hidden embeddings to get raw output
         # dim=1 (want 1 vector .avg)
         # squeeze: used to remove uncessary dimesnions ( i.e. a vector with 1 value in a 2d dimension gets squeezed to 1d)

    def embed_documents(self, texts: list[str]):
        return [self.embed_text(text) for text in texts]

    def embed_query(self, query: str):
        # Similar to embed_text, specifically for queries
        return self.embed_text(query)

def get_embedding_function():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
=======
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
>>>>>>> attempted-AI-integration
