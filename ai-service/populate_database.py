<<<<<<< HEAD
# import argparse
# import os
# import time
# import shutil
# import warnings
# from langchain_community.document_loaders import PyPDFDirectoryLoader
# from langchain_community.document_loaders import PyPDFLoader
# from langchain.schema.document import Document
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from get_embedding import get_embedding_function
# from docx import Document as DocxDocument
# from langchain.vectorstores import Chroma
# from pptx import Presentation
# import pandas as pd


# # Suppress specific warnings
# warnings.filterwarnings("ignore", message="Cannot parse header or footer so it will be ignored")
# warnings.filterwarnings("ignore", message="Data Validation extension is not supported and will be removed")
# warnings.filterwarnings("ignore", message="Conditional Formatting extension is not supported and will be removed")
# warnings.filterwarnings("ignore", message="Unknown extension is not supported and will be removed")
# warnings.filterwarnings("ignore", message="Slicer List extension is not supported and will be removed")

# CHROMA_PATH =  "./chroma" #"/Users/fahd/Music/medAssist(RAG)/chroma"
# #CHROMA_PATH= "chroma"
# # CHROMA_PATH = "./chroma_db"  # or any path you own
# # db = Chroma(
# #     persist_directory=CHROMA_PATH,
# #     embedding_function=get_embedding_function(),
# # )
# DATA_PATH = "./sampledata"#"/Users/fahd/Music/medAssist(RAG)/sampledata" 
# #"/Users/FahadBhutta/Documents/docs_directory/B/BOA"

# def main():
#     parser = argparse.ArgumentParser() # command line functionality
#     parser.add_argument("--reset", action="store_true", help="Reset the database.")
#     args = parser.parse_args()
#     if args.reset:
#         print("Clearing Database")
#         clear_database()

#     print("Loading documents")
#     documents = load_documents(DATA_PATH)
#     print(f"Loaded {len(documents)} documents")
#     chunks = split_documents(documents)
#     print(f"Split into {len(chunks)} chunks")
#     add_to_chroma(chunks)


# def load_documents(data_path):
#     all_documents = []
#     print("Loading PDF documents")
#     pdf_documents = load_pdfs_recursive(data_path)
#     print("loading documents")
#     all_documents.extend(pdf_documents)
#     print(f"Loaded {len(pdf_documents)} PDF documents")

#     print("Loading TXT documents")
#     txt_documents = load_txt_files_recursive(data_path)
#     all_documents.extend(txt_documents)
#     print(f"Loaded {len(txt_documents)} TXT documents")

#     print("Loading DOCX documents")
#     docx_documents = load_docx_files_recursive(data_path)
#     all_documents.extend(docx_documents)
#     print(f"Loaded {len(docx_documents)} DOCX documents")

#     print("Loading PPTX documents")
#     pptx_documents = load_pptx_files_recursive(data_path)
#     #all_documents.extend(pptx_documents)
#    # print(f"Loaded {len(pptx_documents)} PPTX documents")

#     print("Loading Excel documents")
#     #excel_documents = load_excel_files_recursive(data_path)
#     #all_documents.extend(excel_documents)
#     #print(f"Loaded {len(excel_documents)} Excel documents")

#     return all_documents


# # def load_pdfs_recursive(directory):
# #     pdf_documents = []
# #     for root, _, files in os.walk(directory):
# #         for file in files:
# #             if file.endswith(".pdf"):
# #                 file_path = os.path.join(root, file)
# #                 try:
# #                     pdf_loader = PyPDFDirectoryLoader(file_path)  # Updated to handle single files
# #                     pdf_documents.extend(pdf_loader.load())
# #                 except PermissionError as e:
# #                     print(f"Permission error accessing PDF file {file_path}: {e}")
# #                 except Exception as e:
# #                     print(f"Error loading PDF file {file_path}: {e}")
# #     return pdf_documents

# def load_pdfs_recursive(directory):
#     """Recursively load text from all PDFs in 'directory' and return a list of Document objects."""
#     pdf_documents = []
    
#     for root, _, files in os.walk(directory):
#         for file in files:
#             # Check if it's a PDF
#             if file.lower().endswith(".pdf"):
#                 file_path = os.path.join(root, file)
                
#                 # Use PyPDFLoader for each file
#                 loader = PyPDFLoader(file_path)
                
#                 try:
#                     # load() returns a list of Document objects
#                     docs = loader.load()
#                     pdf_documents.extend(docs)
#                 except Exception as e:
#                     print(f"Error loading PDF file {file_path}: {e}")

    
#     return pdf_documents


# # def load_pdfs_recursive(directory):
# #     pdf_documents = []
# #     encodings = ['iso-8859-1', 'latin-1']  # List of encodings to try
# #     for root, _, files in os.walk(directory):
# #         for file in files:
# #             if file.endswith(".pdf"):
# #                 file_path = os.path.join(root, file)
# #                 content = ""
# #                 for encoding in encodings:
# #                     try:
# #                         with open(file_path, 'r', encoding=encoding) as f:  # Changed variable name to 'f'
# #                             content = f.read()
# #                         break  # If successful, exit the loop
# #                     except (UnicodeDecodeError, IOError) as e:
# #                         print(f"Failed to read {file_path} with encoding {encoding}: {e}")
# #                 else:
# #                     print(f"Failed to decode {file_path} with all attempted encodings")
# #                     continue
# #                 pdf_documents.append(Document(page_content=content, metadata={"source": file_path, "title": os.path.splitext(file)[0]})) # removes .txt
# #     return pdf_documents

# def load_txt_files_recursive(directory):
#     txt_documents = []
#     encodings = ['iso-8859-1', 'latin-1']  # List of encodings to try
#     for root, _, files in os.walk(directory):
#         for file in files:
#             if file.endswith(".txt"):
#                 file_path = os.path.join(root, file)
#                 content = ""
#                 for encoding in encodings:
#                     try:
#                         with open(file_path, 'r', encoding=encoding) as f:  # Changed variable name to 'f'
#                             content = f.read()
#                         break  # If successful, exit the loop
#                     except (UnicodeDecodeError, IOError) as e:
#                         print(f"Failed to read {file_path} with encoding {encoding}: {e}")
#                 else:
#                     print(f"Failed to decode {file_path} with all attempted encodings")
#                     continue
#                 txt_documents.append(Document(page_content=content, metadata={"source": file_path, "title": os.path.splitext(file)[0]})) # removes .txt
#     return txt_documents

# def load_docx_files_recursive(directory):
#     docx_documents = []
#     for root, _, files in os.walk(directory):
#         for file in files:
#             if file.endswith(".docx"):
#                 file_path = os.path.join(root, file)
#                 try:
#                     doc = DocxDocument(file_path)
#                     content = "\n".join([para.text for para in doc.paragraphs])
#                     docx_documents.append(Document(page_content=content, metadata={"source": file_path, "title": os.path.splitext(file)[0]}))
#                 except PermissionError as e:
#                     print(f"Permission error accessing DOCX file {file_path}: {e}")
#                 except Exception as e:
#                     print(f"Error loading DOCX file {file_path}: {e}")
#     return docx_documents

# def load_pptx_files_recursive(directory):
#     pptx_documents = []
#     for root, _, files in os.walk(directory):
#         for file in files:
#             if file.endswith(".pptx"):
#                 file_path = os.path.join(root, file)
#                 try:
#                     prs = Presentation(file_path)
#                     text = []
#                     for slide in prs.slides:
#                         for shape in slide.shapes:
#                             if shape.has_text_frame:
#                                 text.append(shape.text)
#                     pptx_documents.append(Document(page_content='\n'.join(text), metadata={"source": file_path, "title": os.path.splitext(file)[0]}))
#                 except PermissionError as e:
#                     print(f"Permission error accessing PPTX file {file_path}: {e}")
#                 except Exception as e:
#                     print(f"Error loading PPTX file {file_path}: {e}")
#     return pptx_documents

# def load_excel_files_recursive(directory):
#     excel_documents = []
#     for root, _, files in os.walk(directory):
#         for file in files:
#             if file.endswith(".xlsx") or file.endswith(".xls"):
#                 file_path = os.path.join(root, file)
#                 try:
#                     if file.endswith(".xls"):
#                         df = pd.read_excel(file_path, engine='xlrd')
#                     else:
#                         df = pd.read_excel(file_path, engine='openpyxl')
#                     content = df.to_string()
#                     excel_documents.append(Document(page_content=content, metadata={"source": file_path, "title": os.path.splitext(file)[0]}))
#                 except PermissionError as e:
#                     print(f"Permission error accessing Excel file {file_path}: {e}")
#                 except Exception as e:
#                     print(f"Error loading Excel file {file_path}: {e}")
#     return excel_documents


# def split_documents(documents: list[Document]):
#     print("Splitting documents")
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=1000,
#         chunk_overlap=10,
#         # used to help mantian context of data chunks.
#         # (if chunk is split in middle of a sentence
#         # the two chunks mantain context with the help of the overlap)
#         length_function=len,
#         is_separator_regex=False # not using regex character splitting
#     )
#     chunks = text_splitter.split_documents(documents) # split documents into smaller chunks
#     # chunks[Documents]^
#     for i, doc in enumerate(documents):
#         doc_title = doc.metadata.get("title", "No Title")
#         #Metedata: {  "source": "/path/to/document.pdf","title": "Document Title"}
#         num_chunks = len([chunk for chunk in chunks if chunk.metadata['source'] == doc.metadata['source']])
#         print(f"Document '{doc_title}' split into {num_chunks} chunks")
#     print(f"Split into {len(chunks)} chunks")
#     return chunks

# def add_to_chroma(chunks: list[Document]):
#     start_time = time.time()
#     print("Adding chunks to Chroma")

#     db = Chroma(persist_directory=CHROMA_PATH, embedding_function=get_embedding_function())
#     chunks_with_ids = calculate_chunk_ids(chunks)

#     existing_items = db.get(include=[]) # gets ids as a list
#     existing_ids = set(existing_items["ids"]) # removes duplicate ids
#     print(f"Number of existing data chunks in DB: {len(existing_ids)}")
#     #  smaller batch size to manage resource usage
#     batch_size = 100
#     total_chunks = len(chunks_with_ids)

#     for i in range(0, total_chunks, batch_size):
#         batch = chunks_with_ids[i:i + batch_size]
#         new_chunks = [chunk for chunk in batch if chunk.metadata["id"] not in existing_ids] # add new data chunks
#         if new_chunks:
#             print(f" Adding new Chunks of Data: {len(new_chunks)}")
#             new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
#             db.add_documents(new_chunks, ids=new_chunk_ids)
#         else:
#             print("No new documents to add in this batch")

#         print(f"Progress: {min(i + batch_size, total_chunks)} / {total_chunks} chunks processed")

#     elapsed_time = time.time() - start_time # testing purposes
#     print(f"Finished adding chunks to Chroma in {elapsed_time:.2f} seconds")

# def calculate_chunk_ids(chunks):
#     last_page_id = None
#     current_chunk_index = 0

#     for chunk in chunks:
#         source = chunk.metadata.get("source")
#         page = chunk.metadata.get("page")
#         current_page_id = f"{source}:{page}"

#         if current_page_id == last_page_id:
#             current_chunk_index += 1
#         else:
#             current_chunk_index = 0
#         chunk_id = f"{current_page_id}:{current_chunk_index}"
#         last_page_id = current_page_id
#         chunk.metadata["id"] = chunk_id
#     return chunks

# def clear_database():
#     if os.path.exists(CHROMA_PATH):
#         print("Clearing Database")
#         shutil.rmtree(CHROMA_PATH)
#         print("Database cleared")
#     else:
#         print("Database directory does not exist")

# if __name__ == "__main__":
#     main()
=======
>>>>>>> attempted-AI-integration

import argparse
import os
import time
import shutil
import warnings
<<<<<<< HEAD
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema.document import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from get_embedding import get_embedding_function
from docx import Document as DocxDocument
#from langchain.vectorstores import Chroma
from langchain_chroma import Chroma
from pptx import Presentation
import pandas as pd

# Suppress specific warnings
warnings.filterwarnings("ignore", message="Cannot parse header or footer so it will be ignored")
warnings.filterwarnings("ignore", message="Data Validation extension is not supported and will be removed")
warnings.filterwarnings("ignore", message="Conditional Formatting extension is not supported and will be removed")
warnings.filterwarnings("ignore", message="Unknown extension is not supported and will be removed")
warnings.filterwarnings("ignore", message="Slicer List extension is not supported and will be removed")

CHROMA_PATH = "./chroma"

def main(data_path):
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the database.")
    args = parser.parse_args()

    if args.reset:
        print("Clearing Database")
        clear_database()

    print("Loading documents")
    documents = load_documents(data_path)
    print(f"Loaded {len(documents)} documents")
    chunks = split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    add_to_chroma(chunks)
    print(f"added {len(chunks)} into Chroma DB Sucessfully :)")

def load_documents(data_path):
    all_documents = []

    print("Loading PDF documents")
    pdf_documents = load_pdfs_recursive(data_path)
    all_documents.extend(pdf_documents)
    print(f"Loaded {len(pdf_documents)} PDF documents")

    print("Loading TXT documents")
    txt_documents = load_txt_files_recursive(data_path)
    all_documents.extend(txt_documents)
    print(f"Loaded {len(txt_documents)} TXT documents")

    print("Loading DOCX documents")
    docx_documents = load_docx_files_recursive(data_path)
    all_documents.extend(docx_documents)
    print(f"Loaded {len(docx_documents)} DOCX documents")

    print("Loading PPTX documents")
    pptx_documents = load_pptx_files_recursive(data_path)
    all_documents.extend(pptx_documents)
    print(f"Loaded {len(pptx_documents)} PPTX documents")

    return all_documents
=======
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from get_embedding import get_embedding_function
from docx import Document as DocxDocument
from pptx import Presentation
import pandas as pd
from langchain_chroma import Chroma

#  suppress warnings 
warnings.filterwarnings("ignore")

CHROMA_PATH = "./chroma"  # not used in per-patient function
DATA_PATH = "./sampledata"

# -----------------------
# loader functions for each file type:
# -----------------------
>>>>>>> attempted-AI-integration

def load_pdfs_recursive(directory):
    pdf_documents = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".pdf"):
                file_path = os.path.join(root, file)
                loader = PyPDFLoader(file_path)
                try:
<<<<<<< HEAD
                    docs = loader.load()
=======
                    docs = loader.load()  # returns list of Document objects
>>>>>>> attempted-AI-integration
                    pdf_documents.extend(docs)
                except Exception as e:
                    print(f"Error loading PDF file {file_path}: {e}")
    return pdf_documents

def load_txt_files_recursive(directory):
    txt_documents = []
<<<<<<< HEAD
    encodings = ['iso-8859-1', 'latin-1']
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".txt"):
=======
    encodings = ['utf-8', 'iso-8859-1', 'latin-1']
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(".txt"):
>>>>>>> attempted-AI-integration
                file_path = os.path.join(root, file)
                content = ""
                for encoding in encodings:
                    try:
                        with open(file_path, 'r', encoding=encoding) as f:
                            content = f.read()
                        break
<<<<<<< HEAD
                    except (UnicodeDecodeError, IOError) as e:
                        print(f"Failed to read {file_path} with encoding {encoding}: {e}")
                txt_documents.append(Document(page_content=content, metadata={"source": file_path, "title": os.path.splitext(file)[0]}))
=======
                    except Exception as e:
                        print(f"Error reading TXT file {file_path} with encoding {encoding}: {e}")
                txt_documents.append(Document(page_content=content, metadata={
                    "source": file_path,
                    "title": os.path.splitext(file)[0]
                }))
                print(txt_documents)
>>>>>>> attempted-AI-integration
    return txt_documents

def load_docx_files_recursive(directory):
    docx_documents = []
    for root, _, files in os.walk(directory):
        for file in files:
<<<<<<< HEAD
            if file.endswith(".docx"):
=======
            if file.lower().endswith(".docx"):
>>>>>>> attempted-AI-integration
                file_path = os.path.join(root, file)
                try:
                    doc = DocxDocument(file_path)
                    content = "\n".join([para.text for para in doc.paragraphs])
<<<<<<< HEAD
                    docx_documents.append(Document(page_content=content, metadata={"source": file_path, "title": os.path.splitext(file)[0]}))
=======
                    docx_documents.append(Document(page_content=content, metadata={
                        "source": file_path,
                        "title": os.path.splitext(file)[0]
                    }))
>>>>>>> attempted-AI-integration
                except Exception as e:
                    print(f"Error loading DOCX file {file_path}: {e}")
    return docx_documents

def load_pptx_files_recursive(directory):
    pptx_documents = []
    for root, _, files in os.walk(directory):
        for file in files:
<<<<<<< HEAD
            if file.endswith(".pptx"):
                file_path = os.path.join(root, file)
                try:
                    prs = Presentation(file_path)
                    text = []
                    for slide in prs.slides:
                        for shape in slide.shapes:
                            if shape.has_text_frame:
                                text.append(shape.text)
                    pptx_documents.append(Document(page_content='\n'.join(text), metadata={"source": file_path, "title": os.path.splitext(file)[0]}))
=======
            if file.lower().endswith(".pptx"):
                file_path = os.path.join(root, file)
                try:
                    prs = Presentation(file_path)
                    content = []
                    for slide in prs.slides:
                        for shape in slide.shapes:
                            if hasattr(shape, "text") and shape.text:
                                content.append(shape.text)
                    pptx_documents.append(Document(page_content="\n".join(content), metadata={
                        "source": file_path,
                        "title": os.path.splitext(file)[0]
                    }))
>>>>>>> attempted-AI-integration
                except Exception as e:
                    print(f"Error loading PPTX file {file_path}: {e}")
    return pptx_documents

<<<<<<< HEAD
def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=10,
        length_function=len,
        is_separator_regex=False
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

def add_to_chroma(chunks):
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=get_embedding_function())
    chunks_with_ids = calculate_chunk_ids(chunks)
    db.add_documents(chunks_with_ids)

def calculate_chunk_ids(chunks):
    for chunk in chunks:
        chunk.metadata["id"] = f'{chunk.metadata.get("source")}'
    return chunks

def clear_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print("Database cleared")

if __name__ == "__main__":
    main(DATA_PATH="./sampledata")
=======
def load_excel_files_recursive(directory):
    excel_documents = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith((".xlsx", ".xls")):
                file_path = os.path.join(root, file)
                try:
                    df = pd.read_excel(file_path)
                    content = df.to_string(index=False)
                    excel_documents.append(Document(page_content=content, metadata={
                        "source": file_path,
                        "title": os.path.splitext(file)[0]
                    }))
                except Exception as e:
                    print(f"Error loading Excel file {file_path}: {e}")
    return excel_documents
def get_database():
    return Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function()  # MPNet-based
    )
def load_documents(data_path):
    """Load documents from all supported file types in the directory."""
    all_documents = []
    print("Loading PDF documents")
    pdf_docs = load_pdfs_recursive(data_path)
    all_documents.extend(pdf_docs)
    print(f"Loaded {len(pdf_docs)} PDF documents")

    print("Loading TXT documents")
    txt_docs = load_txt_files_recursive(data_path)
    all_documents.extend(txt_docs)
    print(f"Loaded {len(txt_docs)} TXT documents")

    print("Loading DOCX documents")
    docx_docs = load_docx_files_recursive(data_path)
    all_documents.extend(docx_docs)
    print(f"Loaded {len(docx_docs)} DOCX documents")

    print("Loading PPTX documents")
    pptx_docs = load_pptx_files_recursive(data_path)
    all_documents.extend(pptx_docs)
    print(f"Loaded {len(pptx_docs)} PPTX documents")

    print("Loading Excel documents")
    excel_docs = load_excel_files_recursive(data_path)
    all_documents.extend(excel_docs)
    print(f"Loaded {len(excel_docs)} Excel documents")

    return all_documents

# -----------------------
#  Contextual Chunking Function (Word-based with overlap)
# -----------------------

def contextual_split_documents(documents, max_words=150, overlap_words=20):
    """Split documents into chunks based on word counts, preserving full words and with overlap."""
    new_chunks = []
    for doc in documents:
        words = doc.page_content.split()
        if len(words) <= max_words:
            new_chunks.append(doc)
            continue
        start = 0
        while start < len(words):
            end = start + max_words
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)
            new_doc = Document(page_content=chunk_text, metadata=doc.metadata.copy())
            new_chunks.append(new_doc)
            if end >= len(words):
                break
            start = end - overlap_words  
    return new_chunks

# -----------------------
# New Function: populate_patient_vector_db
# -----------------------

def populate_patient_vector_db(patient_folder):
    """
    Populate the vector database for a single patient.
    Expects patient_folder to be the path to the patient's directory,
    e.g. "sampledata/<patientId>".
    This function will:
      - Load documents from patient_folder.
      - Use contextual chunking.
      - Create (or update) a Chroma vector store in patient_folder/chromaDB.
    """
    print(f"Populating vector DB for patient folder: {patient_folder}")
    
    #  where the vector DB will be stored:
    vector_db_folder = os.path.join(patient_folder, "chromaDB")
    if not os.path.exists(vector_db_folder):
        os.makedirs(vector_db_folder, exist_ok=True)
        print(f"Created vector DB folder: {vector_db_folder}")
    
    # load all documents from the patient folder.
    documents = load_documents(patient_folder)
    print(f"Loaded {len(documents)} documents from {patient_folder}")
    
    # no documents found, you might choose to initialize an empty DB:
    if not documents:
        print("No documents found; initializing an empty vector store.")
        # init empty Chroma store:
        vector_db = Chroma(
            persist_directory=vector_db_folder,
            embedding_function=get_embedding_function(),
        )

        return
    
    # split documents using contextual chunking.
    chunks = contextual_split_documents(documents, max_words=150, overlap_words=20)
    print(f"Split into {len(chunks)} chunks")
    
    # init the Chroma vector store for this patient.
    vector_db = Chroma(
        persist_directory=vector_db_folder,
        embedding_function=get_embedding_function(),
    )
    
  
    for chunk in chunks:
        chunk.metadata["id"] = str(time.time())
    
    vector_db.add_documents(chunks)
    print("Finished adding chunks to patient vector DB.")

# -----------------------
# Add to Chroma using global approach (if needed)
# -----------------------

def add_to_chroma(chunks):
    print("Adding chunks to global Chroma DB")
    vector_db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=get_embedding_function(),
    )
    for chunk in chunks:
        chunk.metadata["id"] = str(time.time())
    vector_db.add_documents(chunks)
    print("Finished adding chunks to global Chroma DB")

def clear_database():
    if os.path.exists(CHROMA_PATH):
        print("Clearing Database")
        shutil.rmtree(CHROMA_PATH)
        print("Database cleared")
    else:
        print("Database directory does not exist")

def main(data_path):
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the database.")
    args = parser.parse_args()
    if args.reset:
        clear_database()

    print("Loading documents from", data_path)
    documents = load_documents(data_path)
    print(f"Loaded {len(documents)} documents")
    
    chunks = contextual_split_documents(documents, max_words=150, overlap_words=20)
    print(f"Split into {len(chunks)} chunks")
    
    add_to_chroma(chunks)
    print("Done populating global vector database.")

if __name__ == "__main__":
    main(DATA_PATH)
>>>>>>> attempted-AI-integration
