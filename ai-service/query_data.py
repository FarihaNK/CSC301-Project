# import argparse
# from langchain_chroma import Chroma
# from langchain.prompts import ChatPromptTemplate
# from langchain_ollama import OllamaLLM
# from get_embedding import get_embedding_function
# from langchain.schema.document import Document
# from docx import Document as DocxDocument
# import os

# CHROMA_PATH = "chroma"

# PROMPT_TEMPLATE = """
# You are a knowledgeable assistant. Use the provided context to answer the question thoroughly and accurately. Make sure to base your answer only on the information in the context, and clearly reference the specific document Name and page Number when available. When asked for general information, reference all the data that has been provided. If user query information is not present, let the user know right away.

# Context:
# {context}

# ---

# Based on the above context, answer the question: {question}

# Please include the source references in your response.
# """

# def main():
#     parser = argparse.ArgumentParser()
#     parser.add_argument("query_text", type=str, nargs='?', default=None, help="The query text.")
#     args = parser.parse_args()
#     if args.query_text:
#         # Call without an external vector_db (default instance will be created)
#         answer = query_rag(args.query_text)
#         print(answer)
#     else:
#         live_mode()

# def live_mode():
#     print("Entering live mode. Type 'exit' or 'quit' to stop.")
#     while True:
#         query_text = input("Enter your question: ")
#         if query_text.lower() in ['exit', 'quit']:
#             print("Exiting...")
#             break
#         answer = query_rag(query_text)
#         print(answer)

# def query_rag(query_text: str, vector_db=None):
#     """
#     Performs a similarity search on the given vector store (or a default one if not provided)
#     and generates an answer using the provided prompt template.
    
#     Parameters:
#       query_text (str): The query question.
#       vector_db (Chroma, optional): A pre-instantiated vector store. If None, a default
#           vector store using CHROMA_PATH is created.
    
#     Returns:
#       str: The generated answer with source references.
#     """
#     try:
#         embedding_function = get_embedding_function()
#         # If no vector_db is provided, create one using the default CHROMA_PATH
#         if vector_db is None:
#             vector_db = Chroma(
#                 persist_directory=CHROMA_PATH,
#                 embedding_function=embedding_function,
#             )

#         # Perform a similarity search (retrieve top-5 chunks)
#         results = vector_db.similarity_search_with_score(query_text, k=5)

#         # Build the context text from the retrieved document chunks
#         context_text = "\n\n---\n\n".join(
#             [f"Source {i+1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
#         )

#         # Prepare the prompt using the template
#         prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
#         prompt = prompt_template.format(context=context_text, question=query_text)

#         # Invoke the model to generate a response
#         model = OllamaLLM(model="Mistral")
#         response_text = model.invoke(prompt)

#         # Collect source references from document metadata
#         sources = []
#         for i, (doc, _score) in enumerate(results):
#             source_value = doc.metadata.get("source", f"Source {i+1}")
#             if source_value not in sources:
#                 sources.append(source_value)
#         formatted_sources = "\n".join(sources)

#         formatted_response = f"{response_text}\nSources used:\n{formatted_sources}"
#         return formatted_response

#     except Exception as e:
#         return f"An error occurred: {e}"

# if __name__ == "__main__":
#     main()



import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from get_embedding import get_embedding_function
from langchain.schema.document import Document
from docx import Document as DocxDocument
import os

CHROMA_PATH = "chroma"

# Updated prompt template with friendly tone and few-shot example.
PROMPT_TEMPLATE = """
You are a friendly and helpful assistant with a knack for synthesizing information. Use the context provided below to answer the question in a natural, conversational manner. 
Please do not simply copy the context verbatim; instead, interpret and summarize the key points.

Example:
Context: "The application experienced a brief downtime due to unexpected high traffic and network issues."
Question: "What happened to the application?"
Answer: "It appears the application was temporarily down because it encountered high traffic and some network issues."

Context:
{context}

---
Based on the above context, answer the question: {question}

Please include any source references if available.
"""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, nargs='?', default=None, help="The query text.")
    args = parser.parse_args()
    if args.query_text:
        # Call without an external vector_db (default instance will be created)
        answer = query_rag(args.query_text)
        print(answer)
    else:
        live_mode()

def live_mode():
    print("Entering live mode. Type 'exit' or 'quit' to stop.")
    while True:
        query_text = input("Enter your question: ")
        if query_text.lower() in ['exit', 'quit']:
            print("Exiting...")
            break
        answer = query_rag(query_text)
        print(answer)

def hybrid_search(query_text: str, vector_db, k=5):
    """
    Performs a hybrid search combining semantic (embedding-based) and keyword search.
    Adjust the weights as needed.
    """
    # Semantic search
    semantic_results = vector_db.similarity_search_with_score(query_text, k=k)
    
    # Try keyword search (if your vector store supports it). 
    # If not, catch the exception and use an empty list.
    try:
        keyword_results = vector_db.keyword_search_with_score(query_text, k=k)
    except Exception as e:
        print("Keyword search not available, falling back to semantic search only.")
        keyword_results = []
    
    # Combine results using a weighted approach.
    # Use id(doc) as a hashable key for each document.
    combined_dict = {}
    for doc, score in semantic_results:
        key = id(doc)
        combined_dict[key] = (doc, 0.7 * score)
    for doc, score in keyword_results:
        key = id(doc)
        if key in combined_dict:
            existing_doc, existing_score = combined_dict[key]
            combined_dict[key] = (existing_doc, existing_score + 0.3 * score)
        else:
            combined_dict[key] = (doc, 0.3 * score)
    
    # Sort the documents based on the combined weighted score (higher is better)
    combined_results = sorted(combined_dict.values(), key=lambda x: x[1], reverse=True)[:k]
    return combined_results

def query_rag(query_text: str, vector_db=None):
    """
    Performs a hybrid search on the vector store and generates an answer using the provided prompt template.
    
    Parameters:
      query_text (str): The query question.
      vector_db (Chroma, optional): A pre-instantiated vector store. If None, a default
          vector store using CHROMA_PATH is created.
    
    Returns:
      str: The generated answer with source references.
    """
    try:
        embedding_function = get_embedding_function()
        # If no vector_db is provided, create one using the default CHROMA_PATH.
        if vector_db is None:
            vector_db = Chroma(
                persist_directory=CHROMA_PATH,
                embedding_function=embedding_function,
            )
        
        # Use hybrid search instead of pure semantic search.
        results = hybrid_search(query_text, vector_db, k=5)

        # Build the context text from the retrieved document chunks.
        context_text = "\n\n---\n\n".join(
            [f"Source {i+1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
        )

        # Prepare the prompt using the updated template.
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        # Invoke the model to generate a response.
        model = OllamaLLM(model="Mistral")
        response_text = model.invoke(prompt)

        # Collect source references from document metadata.
        sources = []
        for i, (doc, _score) in enumerate(results):
            source_value = doc.metadata.get("source", f"Source {i+1}")
            if source_value not in sources:
                sources.append(source_value)
        formatted_sources = "\n".join(sources)

        formatted_response = f"{response_text}\nSources used:\n{formatted_sources}"
        return formatted_response

    except Exception as e:
        return f"An error occurred: {e}"

if __name__ == "__main__":
    main()
