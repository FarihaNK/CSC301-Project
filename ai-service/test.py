import os
from langchain.document_loaders import PyPDFLoader

pdf_path = "/Users/fahd/Music/Tel_Automation_chatbot/sampledata/pdfs/.pdf"
print("Exists?", os.path.exists(pdf_path))

# loader = PyPDFLoader(pdf_path)
# docs = loader.load()
# print(f"Number of pages loaded: {len(docs)}