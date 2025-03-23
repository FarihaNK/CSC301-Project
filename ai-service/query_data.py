# import argparse
# # from langchain_chroma import Chroma
# # from langchain.vectorstores import Chroma
# from langchain_chroma import Chroma

# from langchain.prompts import ChatPromptTemplate
# #from langchain_community.llms.ollama import Ollama
# #from langchain.llms import Ollama
# from langchain_ollama import OllamaLLM



# from get_embedding import get_embedding_function
# from langchain.schema.document import Document
# from docx import Document as DocxDocument
# import os

# CHROMA_PATH = "chroma"

# PROMPT_TEMPLATE = """
# You are a knowledgeable assistant. Use the provided context to answer the question thoroughly and accurately. Make sure to base your answer only on the information in the context, and clearly reference the specific document Name and page Number when available. When asked for general information, reference all the data that has been provided. If user query information is not present, Let the User know right away.

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
#         # If a query is provided as an argument, process it once
#         query_rag(args.query_text)
#     else:
#         # Otherwise, enter live mode
#         live_mode()


# def live_mode():
#     print("Entering live mode. Type 'exit' or 'quit' to stop.")
#     while True:
#         query_text = input("Enter your question: ")
#         if query_text.lower() in ['exit', 'quit']:  # ensures all lowercase
#             print("Exiting...")
#             break
#         query_rag(query_text)

# """
# def read_text_file(file_path):
#     try:
#         with open(file_path, 'r', encoding='utf-8') as file:
#             return file.read()
#     except UnicodeDecodeError:
#         with open(file_path, 'r', encoding='iso-8859-1') as file:
#             return file.read()


# def load_txt_files(data_path):
#     txt_documents = []
#     for filename in os.listdir(data_path):
#         if filename.endswith(".txt"):
#             content = read_text_file(os.path.join(data_path, filename))
#             doc_id = f"{filename}"
#             txt_documents.append(Document(page_content=content, metadata={"source": doc_id}))
#     return txt_documents


# def load_docx_files(data_path):
#     docx_documents = []
#     for filename in os.listdir(data_path):
#         if filename.endswith(".docx"):
#             doc = DocxDocument(os.path.join(data_path, filename))
#             content = "\n".join([para.text for para in doc.paragraphs])
#             doc_id = f"{filename}"
#             docx_documents.append(Document(page_content=content, metadata={"source": doc_id}))
#     return docx_documents
#     """


# def query_rag(query_text: str):
#     try:
#         # Prepare the DB.
#         embedding_function = get_embedding_function()
#         db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

#         # Search the DB.
#         results = db.similarity_search_with_score(query_text, k=5)
#         #checks 5 most similar chunks to answer data .

#         # Create context text with source labels
#         context_text = "\n\n---\n\n".join(
#             [f"Source {i + 1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
#         )
#         prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE) # pass tempelate over
#         prompt = prompt_template.format(context=context_text, question=query_text) #langchain function 

#         # Use the model to generate a response
#         #model = Ollama(model="mistral")
#         model = OllamaLLM(model="Mistral")  # 

#         response_text = model.invoke(prompt)

#         # Extract and format the source identifiers
#         sources = []
#         for i, (doc, _score) in enumerate(results):
#             # doc.metadata.get(key, default_value)
#             # if "source" doesn't exist, it defaults to e.g. "Source 1", "Source 2", etc.
#             source_value = doc.metadata.get("source", f"Source {i + 1}")
#             if source_value not in sources:
#                 sources.append(source_value)

#         formatted_sources = "\n".join(sources)
#         formatted_response = f"RESPONSE: {response_text}\nSources used:\n{formatted_sources}"
#         print("")
#         print("")
#         print(formatted_response)
#     except Exception as e:
#         print(f"An error occurred: {e}")


# if __name__ == "__main__":
#     main()


#VERSION 2: ATTEMPTING TO FIX RESPONSE THING: 


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
# You are a knowledgeable assistant. Use the provided context to answer the question thoroughly and accurately. Make sure to base your answer only on the information in the context, and clearly reference the specific document Name and page Number when available. When asked for general information, reference all the data that has been provided. If user query information is not present, Let the User know right away.

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
#         # If a query is provided as an argument, process it once
#         answer = query_rag(args.query_text)
#         print(answer)
#     else:
#         # Otherwise, enter live mode
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

# def query_rag(query_text: str):
#     """
#     Returns a string containing the answer from the RAG pipeline 
#     plus any source references. 
#     """
#     try:
#         # 1) Prepare the DB
#         embedding_function = get_embedding_function()
#         db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

#         # 2) Search the DB for top-k relevant chunks
#         results = db.similarity_search_with_score(query_text, k=5)

#         # 3) Build the context from the top-k chunks
#         context_text = "\n\n---\n\n".join(
#             [f"Source {i + 1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
#         )

#         # 4) Prepare the prompt
#         prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
#         prompt = prompt_template.format(context=context_text, question=query_text)

#         # 5) Use Ollama to generate a response
#         model = OllamaLLM(model="Mistral")
#         response_text = model.invoke(prompt)

#         # 6) Extract the "sources used" from the metadata
#         sources = []
#         for i, (doc, _score) in enumerate(results):
#             source_value = doc.metadata.get("source", f"Source {i + 1}")
#             if source_value not in sources:
#                 sources.append(source_value)

#         formatted_sources = "\n".join(sources)
#         formatted_response = f" {response_text}\nSources used:\n{formatted_sources}"

#         # 7) Return the final response (NOT print)
#         return formatted_response

#     except Exception as e:
#         # Return error message so it shows up in the chatbot
#         return f"An error occurred: {e}"

# if __name__ == "__main__":
#     main()




#################################################################




import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from get_embedding import get_embedding_function
from langchain.schema.document import Document
from docx import Document as DocxDocument
import os

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
You are a knowledgeable assistant. Use the provided context to answer the question thoroughly and accurately. Make sure to base your answer only on the information in the context, and clearly reference the specific document Name and page Number when available. When asked for general information, reference all the data that has been provided. If user query information is not present, let the user know right away.

Context:
{context}

---

Based on the above context, answer the question: {question}

Please include the source references in your response.
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

def query_rag(query_text: str, vector_db=None):
    """
    Performs a similarity search on the given vector store (or a default one if not provided)
    and generates an answer using the provided prompt template.
    
    Parameters:
      query_text (str): The query question.
      vector_db (Chroma, optional): A pre-instantiated vector store. If None, a default
          vector store using CHROMA_PATH is created.
    
    Returns:
      str: The generated answer with source references.
    """
    try:
        embedding_function = get_embedding_function()
        # If no vector_db is provided, create one using the default CHROMA_PATH
        if vector_db is None:
            vector_db = Chroma(
                persist_directory=CHROMA_PATH,
                embedding_function=embedding_function,
            )

        # Perform a similarity search (retrieve top-5 chunks)
        results = vector_db.similarity_search_with_score(query_text, k=5)

        # Build the context text from the retrieved document chunks
        context_text = "\n\n---\n\n".join(
            [f"Source {i+1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
        )

        # Prepare the prompt using the template
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        # Invoke the model to generate a response
        model = OllamaLLM(model="Mistral")
        response_text = model.invoke(prompt)

        # Collect source references from document metadata
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
