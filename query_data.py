# import argparse
# from langchain_chroma import Chroma
# from langchain.prompts import ChatPromptTemplate
# from langchain_ollama import OllamaLLM
# from get_embedding import get_embedding_function
# from langchain.schema.document import Document
# from docx import Document as DocxDocument
# from populate_database import get_database
# import os
# import time

# # Import your SME escalation
# from agents import escalate_to_sme

# CHROMA_PATH = "./chroma_db"

# # PROMPT_TEMPLATE = """
# # You are a knowledgeable assistant. Use ONLY the context below to answer the user’s question. 
# # If the answer is not in the context, respond exactly with: NO_ANSWER_FOUND

# # Context:
# # {context}

# # ---

# # Question: {question}

# # Remember: if not in context => NO_ANSWER_FOUND
# # Include the source references in your final answer if found.
# # """


# PROMPT_TEMPLATE = """
# You are a knowledgeable assistant. Use ONLY the context below to answer the user’s question. 
# If the answer is found in context, provide a direct, factual answer. 
# If the answer is NOT found in the context, respond with exactly:
# NO_ANSWER_FOUND

# Do not add any extra commentary if you respond with NO_ANSWER_FOUND.

# Context:
# {context}

# ---

# Question: {question}

# Important: 
# - If you find relevant info, answer fully, referencing documents by name/page. 
# - If no relevant info, respond EXACTLY with NO_ANSWER_FOUND.
# """
# #embedding_function = get_embedding_function()
# db = get_database() #Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

# def main():
#     parser = argparse.ArgumentParser()
#     parser.add_argument("query_text", type=str, nargs='?', default=None, help="The query text.")
#     args = parser.parse_args()
#     if args.query_text:
#         # If a query is provided as an argument => one-shot mode
#         answer = query_rag(args.query_text, allow_escalation=False)
#         print(answer)
#     else:
#         # Otherwise, enter live mode with escalation prompts
#         live_mode()

# def live_mode():
#     print("Entering live mode. Type 'exit' or 'quit' to stop.")
#     while True:
#         query_text = input("Enter your question: ")
#         if query_text.lower() in ['exit', 'quit']:
#             print("Exiting...")
#             break
#         answer = query_rag(query_text, allow_escalation=True)
#         print(answer)

# def query_rag(query_text: str, allow_escalation: bool):
#     """
#     1) Search top-k in Chroma
#     2) Build context & call Ollama
#     3) If LLM says 'NO_ANSWER_FOUND', prompt user to escalate in live mode
#     """
#     try:
#         # 1) Prepare the DB
#         # 2) Search for top-k relevant chunks
#         results = db.similarity_search_with_score(query_text, k=5) #semantic Search used here. 

#         # Build the context from the top chunks
#         context_text = "\n\n---\n\n".join(
#             [f"Source {i + 1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
#         )

#         # 3) Prepare the prompt
#         prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
#         prompt = prompt_template.format(context=context_text, question=query_text)

#         # 4) Use Ollama to generate a response
#         model = OllamaLLM(model="llama3")
#         response_text = model.invoke(prompt).strip()

#         #if "NO_ANSWER_FOUND" in response_text:

#         lower_resp = response_text.lower() #To ensure that query escaleted to SME
#         if "no_answer_found" in lower_resp:
#             response_text = "NO_ANSWER_FOUND"

#         # 5) If we found some docs, let's build references
#         sources = []
#         for i, (doc, _score) in enumerate(results):
#             source_value = doc.metadata.get("source", f"Source {i + 1}")
#             if source_value not in sources:
#                 sources.append(source_value)

#         formatted_sources = "\n".join(sources)
#         if formatted_sources:
#             final_response = f"{response_text}\nSources used:\n{formatted_sources}"
#         else:
#             final_response = response_text

#         # 6) If LLM explicitly responded "NO_ANSWER_FOUND", see if user wants SME escalation (live mode)

#         if response_text == "NO_ANSWER_FOUND" and allow_escalation:
#             # ask user
#             choice = input("No info found in context. Escalate to SME? (yes/no): ").lower().strip()
#             if choice in ["yes", "y"]:
#                 sme_answer = escalate_to_sme(query_text)
#                 if sme_answer:
#                     return f"RESPONSE FROM SME: {sme_answer}\n(Stored for future queries)"
#                 else:
#                     return "No SME response received. Please try again later."

#         # otherwise, we just return the final LLM answer
#         return final_response

#     except Exception as e:
#         # Return error message
#         return f"An error occurred: {e}"

# if __name__ == "__main__":
#     main()

# # import time
# # import requests
# # from langchain.schema import Document
# # from populate_database import get_database
# # from get_embedding import get_embedding_function

# # SLACK_TOKEN = "BLANK"
# # SLACK_CHANNEL = "C08JR09HVD1"

# # # Because we are using the default L2 distance, 
# # # distances for relevant docs can easily be in the range 2..15 or more.
# # DISTANCE_THRESHOLD = 10.0

# # db = get_database()

# # def send_slack_message(query):
# #     headers = {
# #         "Authorization": f"Bearer {SLACK_TOKEN}",
# #         "Content-Type": "application/json; charset=utf-8"
# #     }
# #     payload = {
# #         "channel": SLACK_CHANNEL,
# #         "text": f"[Agentic RAG] New query received: '{query}'\n@SMEs Please reply with an answer."
# #     }
# #     response = requests.post("https://slack.com/api/chat.postMessage", json=payload, headers=headers)
# #     return response.json()

# # def wait_for_sme_response_via_thread(thread_ts, max_wait_s=150, poll_interval_s=5):
# #     headers = {"Authorization": f"Bearer {SLACK_TOKEN}"}
# #     waited = 0
# #     while waited < max_wait_s:
# #         time.sleep(poll_interval_s)
# #         waited += poll_interval_s

# #         r = requests.get(
# #             "https://slack.com/api/conversations.replies",
# #             params={"channel": SLACK_CHANNEL, "ts": thread_ts},
# #             headers=headers
# #         )
# #         data = r.json()
# #         messages = data.get("messages", [])
# #         # Skip the first message (the question we posted)
# #         for msg in messages[1:]:
# #             if "bot_id" not in msg:
# #                 return msg["text"]
# #     return None

# # def store_sme_response(question, answer):
# #     doc = Document(
# #         page_content=f"Question: {question}\nAnswer: {answer}",
# #         metadata={"source": "SME Response"}
# #     )
# #     db.add_documents([doc])
# #     print("SME response stored + persisted.")

# # def escalate_to_sme(query_text):
# #     print(f"Escalating query to SME: {query_text}")
# #     response_data = send_slack_message(query_text)
# #     thread_ts = response_data.get("ts")
# #     if not thread_ts:
# #         print("No 'ts' found in Slack response - cannot track thread.")
# #         return None

# #     sme_answer = wait_for_sme_response_via_thread(thread_ts)
# #     print(f"Received SME response (raw): {sme_answer}")
# #     if sme_answer:
# #         store_sme_response(query_text, sme_answer)
# #         return sme_answer
# #     else:
# #         print("No SME response found within wait window.")
# #         return None

# # def semantic_search(query, threshold=DISTANCE_THRESHOLD, k=3):
# #     """
# #     Using default L2 distance from Chroma's similarity_search_with_score().
# #     The range can be fairly large, so we set threshold=10.0.
# #     """
# #     results = db.similarity_search_with_score(query, k=k)

# #     print("\n[DEBUG] Distances from similarity_search_with_score():")
# #     for doc, distance in results:
# #         snippet = doc.page_content.replace("\n", " ")[:60]
# #         print(f" - Distance={distance:.4f} | Doc snippet='{snippet}...'")

# #     # Filter for distances less than our threshold => "close enough"
# #     filtered = [(doc, dist) for doc, dist in results if dist < threshold]
# #     return filtered

# # if __name__ == "__main__":
# #     print("Entering live mode. Type 'exit' or 'quit' to stop.")
# #     while True:
# #         query = input("Enter your question: ").strip()
# #         if query.lower() in ["exit", "quit"]:
# #             break

# #         # Attempt a semantic search
# #         results = semantic_search(query, DISTANCE_THRESHOLD)

# #         if results:
# #             # Sort by ascending distance => best match is first
# #             best_doc, best_distance = sorted(results, key=lambda x: x[1])[0]
# #             print(f"\nFound relevant doc with distance={best_distance:.4f}:")
# #             print(best_doc.page_content)
# #             print()
# #         else:
# #             print("No info found in context. Escalate to SME? (yes/no): ", end="")
# #             choice = input().strip().lower()
# #             if choice == "yes":
# #                 answer = escalate_to_sme(query)
# #                 if answer:
# #                     print(f"\nRESPONSE FROM SME: {answer}\n(Stored for future queries)")
# #                 else:
# #                     print("No SME response received. Please try again later.")





# import argparse
# from langchain_chroma import Chroma
# from langchain.prompts import ChatPromptTemplate
# from langchain_ollama import OllamaLLM
# from langchain.schema.document import Document
# from populate_database_text import get_database as get_text_database
# from populate_database_images import get_image_database
# from agents import escalate_to_sme
# import os
# import time

# # Unified prompt template – note the added Image Context section.
# PROMPT_TEMPLATE = """
# You are a knowledgeable assistant. Use ONLY the context below to answer the user’s question. 
# If the answer is found in context, provide a direct, factual answer. 
# If the answer is NOT found in the context, respond with exactly:
# NO_ANSWER_FOUND

# Do not add any extra commentary if you respond with NO_ANSWER_FOUND.

# {context}

# ---
# Question: {question}

# Important: 
# - If you find relevant info, answer fully and reference the documents by name/path.
# - If no relevant info, respond EXACTLY with NO_ANSWER_FOUND.
# """

# # Instantiate your two databases:
# text_db = get_text_database()        # MPNet-based text DB (chroma_db)
# image_db = get_image_database()       # CLIP-based image DB (chroma_db_images)

# def main():
#     parser = argparse.ArgumentParser()
#     parser.add_argument("query_text", type=str, nargs="?", default=None, help="The query text.")
#     args = parser.parse_args()
    
#     if args.query_text:
#         # One-shot mode:
#         answer = query_rag(args.query_text, allow_escalation=True)
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
#         answer = query_rag(query_text, allow_escalation=True)
#         print(answer)

# def query_rag(query_text: str, allow_escalation: bool):
#     """
#     1) Searches both the text and image databases for the query.
#     2) Builds a combined context (with separate sections).
#     3) Invokes the LLM using the prompt template.
#     4) If no answer is found, optionally escalates to an SME.
#     """
#     try:
#         # 1) Search each database
#         text_results = text_db.similarity_search_with_score(query_text, k=5)
#         image_results = image_db.similarity_search_with_score(query_text, k=5)
        
#         # 2) Build context sections
#         text_context = ""
#         if text_results:
#             text_context = "Text Context:\n" + "\n\n---\n\n".join(
#                 [f"Text Source {i+1}: {doc.page_content}" for i, (doc, _) in enumerate(text_results)]
#             )
        
#         image_context = ""
#         if image_results:
#             image_context = "Image Context:\n" + "\n\n---\n\n".join(
#                 [f"Image Source {i+1}: {doc.metadata.get('source', 'Unknown')}" for i, (doc, _) in enumerate(image_results)]
#             )
        
#         # Combine the contexts; if one is empty, only include the other.
#         combined_context = ""
#         if text_context:
#             combined_context += text_context + "\n\n"
#         if image_context:
#             combined_context += image_context + "\n\n"
#         if not combined_context:
#             combined_context = "No relevant context found."
        
#         # 3) Build the prompt
#         prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
#         prompt = prompt_template.format(context=combined_context, question=query_text)
        
#         # 4) Call the LLM
#         model = OllamaLLM(model="llama3")
#         response_text = model.invoke(prompt).strip()
#         if "no_answer_found" in response_text.lower():
#             response_text = "NO_ANSWER_FOUND"
        
#         # 5) Build references from both sources
#         text_sources = []
#         for i, (doc, _) in enumerate(text_results):
#             src = doc.metadata.get("source", f"Text Source {i+1}")
#             if src not in text_sources:
#                 text_sources.append(src)
#         image_sources = []
#         for i, (doc, _) in enumerate(image_results):
#             src = doc.metadata.get("source", f"Image Source {i+1}")
#             if src not in image_sources:
#                 image_sources.append(src)
        
#         refs = ""
#         if text_sources:
#             refs += "Text Sources:\n" + "\n".join(text_sources) + "\n"
#         if image_sources:
#             refs += "Image Sources:\n" + "\n".join(image_sources)
        
#         final_response = f"{response_text}\nSources used:\n{refs}" if refs else response_text
        
#         # 6) If no answer was found and escalation is enabled, offer SME escalation.
#         if response_text == "NO_ANSWER_FOUND" and allow_escalation:
#             choice = input("No info found in context. Escalate to SME? (yes/no): ").lower().strip()
#             if choice in ["yes", "y"]:
#                 sme_answer = escalate_to_sme(query_text)
#                 if sme_answer:
#                     return f"RESPONSE FROM SME: {sme_answer}\n(Stored for future queries)"
#                 else:
#                     return "No SME response received. Please try again later."
        
#         return final_response

#     except Exception as e:
#         return f"An error occurred: {e}"

# if __name__ == "__main__":
#     main()


#MOST CURRENT STABLE VERSION MARCH 26 @ 6:57 PM 

# import argparse
# from langchain_chroma import Chroma
# from langchain.prompts import ChatPromptTemplate
# from langchain_ollama import OllamaLLM
# from langchain.schema.document import Document
# from populate_database_text import get_database as get_text_database  # Your existing text DB
# from populate_database_images import get_image_database             # Your image DB (CLIP-based)
# from agents import escalate_to_sme
# import os
# import time

# # Unified prompt template with placeholders for both text and image context.
# PROMPT_TEMPLATE = """
# You are a knowledgeable assistant. Use ONLY the context below to answer the users question. 
# If the answer is found in context, provide a direct, factual answer. 
# If the answer is NOT found in the context, respond with exactly:
# NO_ANSWER_FOUND

# {context}

# ---
# Question: {question}

# Important: 
# - If you find relevant info, answer fully and reference the documents by name/path.
# - If no relevant info, respond EXACTLY with NO_ANSWER_FOUND.
# """

# # Instantiate the two databases:
# text_db = get_text_database()        # MPNet-based text DB (./chroma_db)
# image_db = get_image_database()       # CLIP-based image DB (./chroma_db_images)

# def main():
#     parser = argparse.ArgumentParser()
#     parser.add_argument("query_text", type=str, nargs="?", default=None, help="The query text.")
#     args = parser.parse_args()
    
#     if args.query_text:
#         # One-shot mode:
#         answer = query_rag(args.query_text, allow_escalation=True)
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
#         answer = query_rag(query_text, allow_escalation=True)
#         print(answer)

# def query_rag(query_text: str, allow_escalation: bool):
#     """
#     1) Searches both text and image databases.
#     2) Builds a combined context with separate sections.
#     3) Invokes the LLM with the prompt.
#     4) If no answer is found, offers escalation.
#     """
#     try:
#         # Search text DB and image DB
#         text_results = text_db.similarity_search_with_score(query_text, k=3)
#         image_results = image_db.similarity_search_with_score(query_text, k=5)
        
#         # Build text context
#         text_context = ""
#         if text_results:
#             text_context = "Text Context:\n" + "\n\n---\n\n".join(
#                 [f"Text Source {i+1}: {doc.page_content}" for i, (doc, _) in enumerate(text_results)]
#             )
        
#         # Build image context (using metadata's source and title)
#         image_context = ""
#         if image_results:
#             image_context = "Image Context:\n" + "\n\n---\n\n".join(
#                 [f"Image Source {i+1}: {doc.metadata.get('source', 'Unknown')} (Title: {doc.metadata.get('title','')})" 
#                  for i, (doc, _) in enumerate(image_results)]
#             )
        
#         # Combine contexts
#         combined_context = ""
#         if text_context:
#             combined_context += text_context + "\n\n"
#         if image_context:
#             combined_context += image_context + "\n\n"
#         if not combined_context:
#             combined_context = "No relevant context found."
        
#         # Build and invoke the prompt
#         prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
#         prompt = prompt_template.format(context=combined_context, question=query_text)
#         model = OllamaLLM(model="llama3")
#         response_text = model.invoke(prompt).strip()
#         if "no_answer_found" in response_text.lower():
#             response_text = "NO_ANSWER_FOUND"
        
#         # Collect references from both databases
#         text_sources = []
#         for i, (doc, _) in enumerate(text_results):
#             src = doc.metadata.get("source", f"Text Source {i+1}")
#             if src not in text_sources:
#                 text_sources.append(src)
#         image_sources = []
#         for i, (doc, _) in enumerate(image_results):
#             src = doc.metadata.get("source", f"Image Source {i+1}")
#             if src not in image_sources:
#                 image_sources.append(src)
        
#         refs = ""
#         if text_sources:
#             refs += "Text Sources:\n" + "\n".join(text_sources) + "\n"
#         if image_sources:
#             refs += "Image Sources:\n" + "\n".join(image_sources)
        
#         final_response = f"{response_text}\nSources used:\n{refs}" if refs else response_text
        
#         # If no answer was found, allow SME escalation.
#         if response_text == "NO_ANSWER_FOUND" and allow_escalation:
#             choice = input("No info found in context. Escalate to SME? (yes/no): ").lower().strip()
#             if choice in ["yes", "y"]:
#                 sme_answer = escalate_to_sme(query_text)
#                 if sme_answer:
#                     return f"RESPONSE FROM SME: {sme_answer}\n(Stored for future queries)"
#                 else:
#                     return "No SME response received. Please try again later."
        
#         return final_response

#     except Exception as e:
#         return f"An error occurred: {e}"

# if __name__ == "__main__":
#     main()


import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from langchain.schema.document import Document
from populate_database_text import get_database as get_text_database  # Your existing text DB
from populate_database_images import get_image_database             # Your image DB (CLIP-based)
from agents import escalate_to_sme
import os
import time

# Unified prompt template with placeholders for both text and image context.
PROMPT_TEMPLATE = """
You are a knowledgeable assistant. Use ONLY the context below to answer the users question. 
If the answer is found in context, provide a direct, factual answer. 
If the answer is NOT found in the context, respond with exactly:
NO_ANSWER_FOUND

{context}

---
Question: {question}

Important: 
- If you find relevant info, answer fully and reference the documents by name/path.
- If no relevant info, respond EXACTLY with NO_ANSWER_FOUND.
"""

# Instantiate the two databases:
text_db = get_text_database()        # MPNet-based text DB (./chroma_db)
image_db = get_image_database()       # CLIP-based image DB (./chroma_db_images)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, nargs="?", default=None, help="The query text.")
    args = parser.parse_args()
    
    if args.query_text:
        # One-shot mode:
        answer = query_rag(args.query_text, allow_escalation=True)
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
        answer = query_rag(query_text, allow_escalation=True)
        print(answer)

def query_rag(query_text: str, allow_escalation: bool):
    """
    1) Searches both text and image databases.
    2) Builds a combined context with separate sections.
    3) Invokes the LLM with the prompt.
    4) If no answer is found, offers escalation.
    """
    try:
        # Retrieve from text DB and image DB
        text_results = text_db.similarity_search_with_score(query_text, k=5)
        image_results = image_db.similarity_search_with_score(query_text, k=5)
        
        # Set a simple similarity threshold (adjust as needed)
        SIMILARITY_THRESHOLD = 0.7
        
        # Filter results based on similarity score
        filtered_text_results = [(doc, score) for doc, score in text_results if score >= SIMILARITY_THRESHOLD]
        filtered_image_results = [(doc, score) for doc, score in image_results if score >= SIMILARITY_THRESHOLD]
        
        # Build text context from filtered results
        text_context = ""
        if filtered_text_results:
            text_context = "Text Context:\n" + "\n\n---\n\n".join(
                [f"Text Source {i+1}: {doc.page_content}" for i, (doc, _) in enumerate(filtered_text_results)]
            )
        
        # Build image context using metadata (if any)
        image_context = ""
        if filtered_image_results:
            image_context = "Image Context:\n" + "\n\n---\n\n".join(
                [f"Image Source {i+1}: {doc.metadata.get('source', 'Unknown')} (Title: {doc.metadata.get('title','')})" 
                 for i, (doc, _) in enumerate(filtered_image_results)]
            )
        
        # Combine contexts
        combined_context = ""
        if text_context:
            combined_context += text_context + "\n\n"
        if image_context:
            combined_context += image_context + "\n\n"
        if not combined_context:
            combined_context = "No relevant context found."
        
        # (Optional) Debug: print the final prompt to inspect context
        # print("Final Prompt:\n", PROMPT_TEMPLATE.format(context=combined_context, question=query_text))
        
        # Build the prompt using the combined context
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=combined_context, question=query_text)
        
        # Invoke the LLM
        model = OllamaLLM(model="llama3")
        response_text = model.invoke(prompt).strip()
        if "no_answer_found" in response_text.lower():
            response_text = "NO_ANSWER_FOUND"
        
        # Collect references from both databases for transparency
        text_sources = []
        for i, (doc, _) in enumerate(filtered_text_results):
            src = doc.metadata.get("source", f"Text Source {i+1}")
            if src not in text_sources:
                text_sources.append(src)
        image_sources = []
        for i, (doc, _) in enumerate(filtered_image_results):
            src = doc.metadata.get("source", f"Image Source {i+1}")
            if src not in image_sources:
                image_sources.append(src)
        
        refs = ""
        if text_sources:
            refs += "Text Sources:\n" + "\n".join(text_sources) + "\n"
        if image_sources:
            refs += "Image Sources:\n" + "\n".join(image_sources)
        
        final_response = f"{response_text}\nSources used:\n{refs}" if refs else response_text
        
        # If no answer was found, allow escalation.
        if response_text == "NO_ANSWER_FOUND" and allow_escalation:
            choice = input("No info found in context. Escalate to SME? (yes/no): ").lower().strip()
            if choice in ["yes", "y"]:
                sme_answer = escalate_to_sme(query_text)
                if sme_answer:
                    return f"RESPONSE FROM SME: {sme_answer}\n(Stored for future queries)"
                else:
                    return "No SME response received. Please try again later."
        
        return final_response

    except Exception as e:
        return f"An error occurred: {e}"

if __name__ == "__main__":
    main()
