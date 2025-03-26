# """
# populate_database_images.py

# Populates a *separate* Chroma DB that stores image embeddings,
# using CLIP for cross-modal retrieval.
# """
# import argparse
# import os
# import shutil
# from langchain.schema.document import Document
# from langchain_chroma import Chroma
# from get_embedding import CLIPEmbeddings  # We'll use your CLIP class
# from PIL import Image

# CHROMA_IMAGES_PATH = "./chroma_db_images"

# def main(data_path):
#     parser = argparse.ArgumentParser()
#     parser.add_argument("--reset", action="store_true", help="Reset the image database.")
#     args = parser.parse_args()

#     if args.reset:
#         print("Clearing Image Database...")
#         clear_image_database()

#     print("Loading IMAGE documents...")
#     image_docs = load_image_files_recursive(data_path)
#     print(f"Loaded {len(image_docs)} images.")

#     # We do NOT chunk images. We store each image as a single Document.
#     add_images_to_chroma(image_docs)
#     print(f"Added {len(image_docs)} images to the CLIP-based Chroma DB.")

# # def load_image_files_recursive(directory):
# #     exts = [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"]
# #     image_docs = []
# #     for root, _, files in os.walk(directory):
# #         for file in files:
# #             if any(file.lower().endswith(ext) for ext in exts):
# #                 file_path = os.path.join(root, file)
# #                 # We'll store minimal text, but the main retrieval is from CLIP’s image embedding.
# #                 doc = Document(
# #                     page_content=f"Image file: {file_path}",
# #                     metadata={"source": file_path, "title": os.path.splitext(file)[0]}
# #                 )
# #                 image_docs.append(doc)
# #     return image_docs


# def load_image_files_recursive(directory):
#     """
#     Recursively load image files and add a description from the file name.
#     E.g., if the file is named 'orange_cat.jpg', the description will be 'orange cat'.
#     """
#     exts = [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"]
#     image_docs = []
#     for root, _, files in os.walk(directory):
#         for file in files:
#             if any(file.lower().endswith(ext) for ext in exts):
#                 file_path = os.path.join(root, file)
#                 # Derive a description from the file name:
#                 base = os.path.splitext(file)[0]
#                 description = base.replace("_", " ").replace("-", " ")
#                 # Include both the file path and description in the text content.
#                 text_content = f"Image file: {file_path}. Description: {description}"
#                 doc = Document(
#                     page_content=text_content,
#                     metadata={"source": file_path, "title": description}
#                 )
#                 image_docs.append(doc)
#     return image_docs


# def get_image_database():
#     """
#     Returns a separate Chroma instance for images,
#     using the CLIP embedding function.
#     """
#     return Chroma(
#         persist_directory=CHROMA_IMAGES_PATH,
#         embedding_function=CLIPEmbeddings(model_name="openai/clip-vit-base-patch32")
#     )

# def add_images_to_chroma(image_docs):
#     db = get_image_database()
#     # We can pass them directly; no chunking needed.
#     db.add_documents(image_docs)

# def clear_image_database():
#     if os.path.exists(CHROMA_IMAGES_PATH):
#         shutil.rmtree(CHROMA_IMAGES_PATH)

# if __name__ == "__main__":
#     data_path = "./sampledata"
#     main(data_path)




"""
populate_database_images.py

Populates a separate Chroma DB that stores image embeddings using CLIP.
Each image document includes a description derived from the file name.
"""
import argparse
import os
import shutil
from langchain.schema.document import Document
from langchain_chroma import Chroma
from get_embedding import CLIPEmbeddings  # Ensure your get_embedding.py includes CLIPEmbeddings
from PIL import Image

CHROMA_IMAGES_PATH = "./chroma_db_images"

def main(data_path):
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset the image database.")
    args = parser.parse_args()

    if args.reset:
        print("Clearing Image Database...")
        clear_image_database()

    print("Loading IMAGE documents...")
    image_docs = load_image_files_recursive(data_path)
    print(f"Loaded {len(image_docs)} images.")

    add_images_to_chroma(image_docs)
    print(f"Added {len(image_docs)} images to the CLIP-based Chroma DB.")

def load_image_files_recursive(directory):
    """
    Recursively load image files and add a richer description based on the file name.
    For example, a file named 'orange_cat.jpg' will yield a description: 'orange cat'.
    """
    exts = [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tiff"]
    image_docs = []
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.lower().endswith(ext) for ext in exts):
                file_path = os.path.join(root, file)
                # Derive a description from the file name
                base = os.path.splitext(file)[0]
                description = base.replace("_", " ").replace("-", " ")
                # Build a richer content string including both the file path and description.
                text_content = f"Image file: {file_path}. Description: {description}."
                doc = Document(
                    page_content=text_content,
                    metadata={"source": file_path, "title": description}
                )
                image_docs.append(doc)
    return image_docs

def get_image_database():
    """
    Returns a separate Chroma instance for images using the CLIP embedding function.
    """
    return Chroma(
        persist_directory=CHROMA_IMAGES_PATH,
        embedding_function=CLIPEmbeddings(model_name="openai/clip-vit-base-patch32")
    )

def add_images_to_chroma(image_docs):
    db = get_image_database()
    db.add_documents(image_docs)

def clear_image_database():
    if os.path.exists(CHROMA_IMAGES_PATH):
        shutil.rmtree(CHROMA_IMAGES_PATH)
        print("Image database cleared.")

if __name__ == "__main__":
    data_path = "./sampledata"
    main(data_path)
