

import argparse
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from get_embedding import get_embedding_function
from langchain.schema.document import Document
from docx import Document as DocxDocument
from populate_database import get_database
import os
import time

# Import your SME escalation
from agents import escalate_to_sme

CHROMA_PATH = "/Users/fahd/Music/Tel_Automation_chatbot copy/chroma_db"

# PROMPT_TEMPLATE = """
# You are a knowledgeable assistant. Use ONLY the context below to answer the user’s question. 
# If the answer is not in the context, respond exactly with: NO_ANSWER_FOUND

# Context:
# {context}

# ---

# Question: {question}

# Remember: if not in context => NO_ANSWER_FOUND
# Include the source references in your final answer if found.
# """


PROMPT_TEMPLATE = """
You are a knowledgeable assistant. Use ONLY the context below to answer the user’s question. 
If the answer is found in context, provide a direct, factual answer. 
If the answer is NOT found in the context, respond with exactly:
NO_ANSWER_FOUND

Do not add any extra commentary if you respond with NO_ANSWER_FOUND.

Context:
{context}

---

Question: {question}

Important: 
- If you find relevant info, answer fully, referencing documents by name/page. 
- If no relevant info, respond EXACTLY with NO_ANSWER_FOUND.
"""
#embedding_function = get_embedding_function()
db = get_database() #Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, nargs='?', default=None, help="The query text.")
    args = parser.parse_args()
    if args.query_text:
        # If a query is provided as an argument => one-shot mode
        answer = query_rag(args.query_text, allow_escalation=False)
        print(answer)
    else:
        # Otherwise, enter live mode with escalation prompts
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
    1) Search top-k in Chroma
    2) Build context & call Ollama
    3) If LLM says 'NO_ANSWER_FOUND', prompt user to escalate in live mode
    """
    try:
        # 1) Prepare the DB
        # 2) Search for top-k relevant chunks
        results = db.similarity_search_with_score(query_text, k=5) #semantic Search used here. 

        # Build the context from the top chunks
        context_text = "\n\n---\n\n".join(
            [f"Source {i + 1}: {doc.page_content}" for i, (doc, _score) in enumerate(results)]
        )

        # 3) Prepare the prompt
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=query_text)

        # 4) Use Ollama to generate a response
        model = OllamaLLM(model="Mistral")
        response_text = model.invoke(prompt).strip()

        #if "NO_ANSWER_FOUND" in response_text:

        lower_resp = response_text.lower() #To ensure that query escaleted to SME
        if "no_answer_found" in lower_resp:
            response_text = "NO_ANSWER_FOUND"

        # 5) If we found some docs, let's build references
        sources = []
        for i, (doc, _score) in enumerate(results):
            source_value = doc.metadata.get("source", f"Source {i + 1}")
            if source_value not in sources:
                sources.append(source_value)

        formatted_sources = "\n".join(sources)
        if formatted_sources:
            final_response = f"{response_text}\nSources used:\n{formatted_sources}"
        else:
            final_response = response_text

        # 6) If LLM explicitly responded "NO_ANSWER_FOUND", see if user wants SME escalation (live mode)

        if response_text == "NO_ANSWER_FOUND" and allow_escalation:
            # ask user
            choice = input("No info found in context. Escalate to SME? (yes/no): ").lower().strip()
            if choice in ["yes", "y"]:
                sme_answer = escalate_to_sme(query_text)
                if sme_answer:
                    return f"RESPONSE FROM SME: {sme_answer}\n(Stored for future queries)"
                else:
                    return "No SME response received. Please try again later."

        # otherwise, we just return the final LLM answer
        return final_response

    except Exception as e:
        # Return error message
        return f"An error occurred: {e}"

if __name__ == "__main__":
    main()
