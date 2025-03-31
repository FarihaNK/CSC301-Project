import os
import time
import requests
from docx import Document as DocxDocument
from langchain_chroma import Chroma

from langchain.schema import Document
from get_embedding import get_embedding_function
from populate_database import add_to_chroma  
from populate_database import get_database


SLACK_TOKEN = "blank"  # Slack Bot Token
SLACK_CHANNEL = "C08JR09HVD1"       # Slack channel ID
CHROMA_PATH = "./chroma_db"

db = get_database()

def send_slack_message(query):
    """
    Send a Slack message to the channel, requesting SME assistance.
    Return the Slack response JSON for further inspection.
    """
    headers = {
        "Authorization": f"Bearer {SLACK_TOKEN}",
        "Content-Type": "application/json; charset=utf-8"
    }
    payload = {
        "channel": SLACK_CHANNEL,
        "text": f"[Agentic RAG] New query received: '{query}'\n@SMEs Please reply with an answer."
    }
    response = requests.post(
        "https://slack.com/api/chat.postMessage",
        json=payload,
        headers=headers
    )
    resp_data = response.json()
    return resp_data

def wait_for_sme_response_via_thread(thread_ts, max_wait_s=150, poll_interval_s=5):
    """
    Wait for a human SME to reply in the *thread* corresponding to `thread_ts`.
    - Only accept messages posted by a real user (i.e., no 'bot_id').
    - Polls for up to `max_wait_s` seconds, checking every `poll_interval_s`.

    Returns the text of the first user message found, or None if none posted.
    """
    headers = {"Authorization": f"Bearer {SLACK_TOKEN}"}
    waited = 0

    while waited < max_wait_s:
        time.sleep(poll_interval_s)
        waited += poll_interval_s

        # Fetch all replies in the thread
        r = requests.get(
            "https://slack.com/api/conversations.replies",
            params={"channel": SLACK_CHANNEL, "ts": thread_ts},
            headers=headers
        )
        data = r.json()
        messages = data.get("messages", [])
    


        for msg in messages[1:]:
            # If it's from a bot, it has 'bot_id' => skip
            if "bot_id" in msg:
                continue
            # Otherwise, this is presumably from a real user
            # Return the text of that message
            return msg["text"]

    # no SME user answered in time
    return None

def store_sme_response(question, answer):
    """
    Store Q&A in Chroma so that future queries can retrieve it if relevant.
    We store it as a single chunk containing both question + answer.
    """
  
    doc = Document(page_content=f"Question: {question}\nAnswer: {answer}",
                   metadata={"source": "SME Response"})
    db.add_documents([doc])
   

    print("SME response stored + persisted.")

def escalate_to_sme(query_text):
    """
    1) Send Slack message (with question).
    2) Wait for a brand-new user message in that thread (not from bot).
    3) Store in Chroma. Return answer.
    """
    print(f"Escalating query to SME: {query_text}")
    # 1) post the question
    response_data = send_slack_message(query_text)
    #   bots post 'ts' to identify the thread
    thread_ts = response_data.get("ts")
    if not thread_ts:
        print("No 'ts' found in Slack response - cannot track thread.")
        return None

    # 2) wait for SME to reply in the same thread
    sme_answer = wait_for_sme_response_via_thread(thread_ts)
    print(f"Received SME response (raw): {sme_answer}")

    if sme_answer:
        # 3) Store Q&A in Chroma
        store_sme_response(query_text, sme_answer)
        return sme_answer
    else:
        print("No SME response found within wait window.")
        return None