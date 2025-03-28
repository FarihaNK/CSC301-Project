import os
import time
import json
import jwt
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import safe_join
from pymongo import MongoClient
from get_embedding import get_embedding_function
from langchain_chroma import Chroma
import ssl

# import functions from our helper modules
from populate_database import populate_patient_vector_db  
from query_data import query_rag  # modified to include agentic fallback

# mongoDB setup
MONGO_URI = os.environ.get(
    "MONGO_URI",
    "mongodb+srv://User:dbUserPassword@cluster0.tgco9.mongodb.net/patient_service_db?retryWrites=true&w=majority&appName=Cluster0"
)
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["patient_service_db"]

app = Flask(__name__)
CORS(app)

SAMPLEDATA_FOLDER = 'sampledata'
DOCS_FILE = 'docs_list.json'
os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!@"

# ------------------------------
# Helper Functions
# ------------------------------
def get_logged_in_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({"error": "No token provided"}), 401
    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        return None, jsonify({"error": "Invalid token format"}), 401
    token = parts[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({"error": "Invalid token"}), 401

def load_docs():
    if os.path.exists(DOCS_FILE):
        with open(DOCS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_docs(docs):
    with open(DOCS_FILE, 'w') as f:
        json.dump(docs, f)

def get_patients():
    patients = list(db.users.find({"role": "patient"}, {"name": 1, "email": 1}))
    for patient in patients:
        patient["_id"] = str(patient["_id"])
    return patients

# ------------------------------
# endpoints
# ------------------------------

@app.route('/patients', methods=['GET'])
def get_patients_endpoint():
    try:
        patients = get_patients()
        return jsonify(patients)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test_token', methods=['GET'])
def test_token():
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status
    return jsonify(user_info)

# upload endpoint ( doctors)
@app.route('/upload', methods=['POST'])
def upload_file():
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status

    user_role = user_info.get("role")
    user_id = user_info.get("id")
    print(f"Logged-in User ID: {user_id}, Role: {user_role}")

    if user_role != "doctor":
        return jsonify({"error": "Only doctors can upload documents"}), 403

    selected_patient_id = request.form.get("patientId")
    if not selected_patient_id:
        return jsonify({"error": "No patient selected"}), 400
    print(f"Doctor {user_id} is uploading for Patient ID: {selected_patient_id}")

    target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient_id)
    if not os.path.exists(target_folder):
        os.makedirs(target_folder, exist_ok=True)
        print(f"Created folder: {target_folder}")

    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    filepath = os.path.join(target_folder, file.filename)
    file.save(filepath)

    # update the patient specific vector DB:
    populate_patient_vector_db(target_folder)  # This will update sampledata/<patientId>/chromaDB

    # update docs_list.json with relative path info:
    docs = load_docs()
    newDoc = {
        "id": int(time.time() * 1000),
        "userTitle": request.form.get('docName', file.filename),
        "type": request.form.get('docType', ''),
        "fileName": f"{selected_patient_id}/{file.filename}"
    }
    docs.append(newDoc)
    save_docs(docs)

    return jsonify({'message': 'File uploaded and processed successfully'})

# document endpoint
@app.route('/documents', methods=['GET'])
def get_documents():
    docs = load_docs()
    return jsonify(docs)

# file serving endpoint
@app.route('/files/<path:filename>', methods=['GET'])
def get_file(filename):
    safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
    if not os.path.exists(safe_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(safe_path, as_attachment=False)

# patient documents endpoint (for patients to view only their own docs)
@app.route('/patient-documents', methods=['GET'])
def get_patient_documents():
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status

    user_id = user_info.get("id")
    user_role = user_info.get("role")
    if user_role != "patient":
        return jsonify({"error": "Only patients can view their documents"}), 403

    # load docs metadata and filter by folder and check physical existence.
    all_docs = load_docs()
    patient_docs = []
    for doc in all_docs:
        path_parts = doc["fileName"].split("/")
        if len(path_parts) >= 2:
            folder_id = path_parts[0]
            if folder_id == user_id:
                safe_path = os.path.join(SAMPLEDATA_FOLDER, doc["fileName"])
                if os.path.exists(safe_path):
                    patient_docs.append(doc)
    return jsonify(patient_docs)






#STABLE QUERY_RAG FUNCTION
# ------------------------------
# Existing Query (RAG) endpoint
# ------------------------------
@app.route('/query', methods=['POST'])
def query_endpoint():
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status

    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    user_role = user_info.get("role")
    user_id = user_info.get("id")

    from langchain_chroma import Chroma
    from get_embedding import get_embedding_function

    # For patients: only search within their own vector DB.
    if user_role == "patient":
        vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
        try:
            vector_db = Chroma(
                persist_directory=vector_db_path,
                embedding_function=get_embedding_function(),
            )
            answer = query_rag(question, vector_db, allow_escalation=False)
            return jsonify({"answer": answer})
        except Exception as e:
            return jsonify({"error": f"Error querying your vector DB: {e}"}), 500

    # For doctors:
    elif user_role == "doctor":
        print("JWT TOKEN VALID: I AM A DOCTOR")
        selected_patient = request.args.get("patientId")
        # If a specific patient is selected:
        if selected_patient:
            vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
            try:
                vector_db = Chroma(
                    persist_directory=vector_db_path,
                    embedding_function=get_embedding_function(),
                )
                answer = query_rag(question, vector_db, allow_escalation=False)
                return jsonify({"answer": answer})
            except Exception as e:
                return jsonify({"error": f"Error querying vector DB for patient {selected_patient}: {e}"}), 500
        else:
            # Combined search across all subfolders
            valid_answers = []
            for root, dirs, files in os.walk(SAMPLEDATA_FOLDER):
                if "chromaDB" in dirs:
                    vector_db_path = os.path.join(root, "chromaDB")
                    relative_path = os.path.relpath(root, SAMPLEDATA_FOLDER)
                    try:
                        vector_db = Chroma(
                            persist_directory=vector_db_path,
                            embedding_function=get_embedding_function(),
                        )
                        ans = query_rag(question, vector_db, allow_escalation=False)
                        # Only add if the answer is valid (does not equal "NO_ANSWER_FOUND")
                        if "NO_ANSWER_FOUND" not in ans.strip(): #not (ans.contains("NO_ANSWER_FOUND")):
                            valid_answers.append(f"**Answer from {relative_path}**:\n{ans}")
                    except Exception as e:
                        error_msg = f"Error querying DB in {relative_path}: {e}"
                        print(error_msg)
            if  valid_answers is None:
                valid_answers.append("NO_ANSWER_FOUND")
            if valid_answers:
                final_answer = "\n\n".join(valid_answers)
                return jsonify({"answer": final_answer})
            else:
                # Only escalate if no valid answer found from any data source.
                from agents import escalate_to_sme
                sme_answer = escalate_to_sme(question)
                if sme_answer:
                    # Store SME response in Administrative DB.
                    admin_db_path = os.path.join(SAMPLEDATA_FOLDER, "Adminstrative", "chromaDB")
                    if not os.path.exists(admin_db_path):
                        os.makedirs(admin_db_path, exist_ok=True)
                    admin_db = Chroma(
                        persist_directory=admin_db_path,
                        embedding_function=get_embedding_function(),
                    )
                    from langchain.schema import Document
                    doc = Document(
                        page_content=f"Question: {question}\nAnswer: {sme_answer}",
                        metadata={"source": "SME Response"}
                    )
                    admin_db.add_documents([doc])
                    return jsonify({"answer": f"RESPONSE FROM SME: {sme_answer}"})
                else:
                    return jsonify({"answer": "NO_ANSWER_FOUND"}), 404
    else:
        return jsonify({"error": "User role not allowed"}), 403

# ------------------------------
# New Agentic Query endpoint
# ------------------------------
@app.route('/agentic_query', methods=['POST'])
def agentic_query_endpoint():
    """
    This endpoint is for the new agentic workflow.
    It first tries to query the patient/doctor-specific vector DB as before.
    If no results are found (as handled in query_data.query_rag), it falls back to the agentic workflow
    (which uses the Slack/agents setup in agents.py).
    """
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status

    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "No question provided"}), 400

    user_role = user_info.get("role")
    user_id = user_info.get("id")
    
    from langchain_chroma import Chroma
    from get_embedding import get_embedding_function

    vector_db = None  # default is None; query_data.query_rag will create a default if needed
    if user_role == "patient":
        vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
        try:
            vector_db = Chroma(
                persist_directory=vector_db_path,
                embedding_function=get_embedding_function(),
            )
        except Exception as e:
            return jsonify({"error": f"Error initializing vector DB for patient: {e}"}), 500
    elif user_role == "doctor":
        selected_patient = request.args.get("patientId")
        if selected_patient:
            vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
            try:
                vector_db = Chroma(
                    persist_directory=vector_db_path,
                    embedding_function=get_embedding_function(),
                )
            except Exception as e:
                return jsonify({"error": f"Error initializing vector DB for patient {selected_patient}: {e}"}), 500
        # If no patient specified, vector_db remains None and query_data will use the global default.
    else:
        return jsonify({"error": "User role not allowed"}), 403

    # Call the query function which now includes agentic fallback logic.
    answer = query_rag(question, vector_db)
    return jsonify({"answer": answer})

# ------------------------------
# Escalation endpoint (SME escalation)
# ------------------------------
@app.route('/escalate', methods=['POST'])
def escalate():
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status
    # Patients are NOT allowed to escalate.
    if user_info.get("role") == "patient":
        return jsonify({"error": "Patients are not allowed to escalate."}), 403
    data = request.json
    query = data.get("query")
    if not query:
        return jsonify({"error": "No query provided"}), 400
    try:
        from agents import escalate_to_sme
        escalated_answer = escalate_to_sme(query)
        if escalated_answer:
            # Store SME response in Administrative DB.
            admin_db_path = os.path.join(SAMPLEDATA_FOLDER, "Adminstrative", "chromaDB")
            if not os.path.exists(admin_db_path):
                os.makedirs(admin_db_path, exist_ok=True)
            admin_db = Chroma(
                persist_directory=admin_db_path,
                embedding_function=get_embedding_function(),
            )
            from langchain.schema import Document
            doc = Document(
                page_content=f"Question: {query}\nAnswer: {escalated_answer}",
                metadata={"source": "SME Response"}
            )
            admin_db.add_documents([doc])
            return jsonify({"escalated_answer": escalated_answer})
        else:
            return jsonify({"error": "No SME response received."}), 500
    except Exception as e:
        print("Error in /escalate:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
