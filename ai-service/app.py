# #######################################################################################

# #THIS IS A STABLE VERSION: PATIENT RAG WORKS , DOCTOR RAG DOES NOT. 

# import os
# import time
# import json
# import jwt
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from werkzeug.utils import safe_join
# from pymongo import MongoClient
# import ssl
# from populate_database import populate_patient_vector_db  # Make sure this is implemented!
# from query_data import query_rag as query_data
# from get_embedding import get_embedding_function  # Used for vector store embeddings

# # MongoDB setup
# MONGO_URI = os.environ.get(
#     "MONGO_URI",
#     "mongodb+srv://User:dbUserPassword@cluster0.tgco9.mongodb.net/patient_service_db?retryWrites=true&w=majority&appName=Cluster0"
# )
# client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
# db = client["patient_service_db"]

# app = Flask(__name__)
# CORS(app)

# SAMPLEDATA_FOLDER = 'sampledata'
# DOCS_FILE = 'docs_list.json'
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!@"

# # ------------------------------
# # Helper Functions
# # ------------------------------
# def get_logged_in_user():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header:
#         return None, jsonify({"error": "No token provided"}), 401
#     parts = auth_header.split(" ")
#     if len(parts) != 2 or parts[0] != "Bearer":
#         return None, jsonify({"error": "Invalid token format"}), 401
#     token = parts[1]
#     try:
#         payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
#         return payload, None, None
#     except jwt.ExpiredSignatureError:
#         return None, jsonify({"error": "Token expired"}), 401
#     except jwt.InvalidTokenError:
#         return None, jsonify({"error": "Invalid token"}), 401

# def load_docs():
#     if os.path.exists(DOCS_FILE):
#         with open(DOCS_FILE, 'r') as f:
#             return json.load(f)
#     return []

# def save_docs(docs):
#     with open(DOCS_FILE, 'w') as f:
#         json.dump(docs, f)

# def get_patients():
#     patients = list(db.users.find({"role": "patient"}, {"name": 1, "email": 1}))
#     for patient in patients:
#         patient["_id"] = str(patient["_id"])
#     return patients

# # ------------------------------
# # Endpoints
# # ------------------------------

# @app.route('/patients', methods=['GET'])
# def get_patients_endpoint():
#     try:
#         patients = get_patients()
#         return jsonify(patients)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/test_token', methods=['GET'])
# def test_token():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status
#     return jsonify(user_info)

# # Upload endpoint (only for doctors)
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_role = user_info.get("role")
#     user_id = user_info.get("id")
#     print(f"Logged-in User ID: {user_id}, Role: {user_role}")

#     if user_role != "doctor":
#         return jsonify({"error": "Only doctors can upload documents"}), 403

#     selected_patient_id = request.form.get("patientId")
#     if not selected_patient_id:
#         return jsonify({"error": "No patient selected"}), 400
#     print(f"Doctor {user_id} is uploading for Patient ID: {selected_patient_id}")

#     target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient_id)
#     if not os.path.exists(target_folder):
#         os.makedirs(target_folder, exist_ok=True)
#         print(f"Created folder: {target_folder}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     filepath = os.path.join(target_folder, file.filename)
#     file.save(filepath)

#     # Update the patient-specific vector DB for this patient:
#     populate_patient_vector_db(target_folder)  # This should update sampledata/<patientId>/chromaDB

#     # Update docs_list.json with relative path info:
#     docs = load_docs()
#     newDoc = {
#         "id": int(time.time() * 1000),
#         "userTitle": request.form.get('docName', file.filename),
#         "type": request.form.get('docType', ''),
#         "fileName": f"{selected_patient_id}/{file.filename}"
#     }
#     docs.append(newDoc)
#     save_docs(docs)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# # Documents endpoint (for general listing, admin use)
# @app.route('/documents', methods=['GET'])
# def get_documents():
#     docs = load_docs()
#     return jsonify(docs)

# # File serving endpoint
# @app.route('/files/<path:filename>', methods=['GET'])
# def get_file(filename):
#     safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
#     if not os.path.exists(safe_path):
#         return jsonify({"error": "File not found"}), 404
#     return send_file(safe_path, as_attachment=False)




# # # Query (RAG) endpoint
# # @app.route('/query', methods=['POST'])
# # def query():
# #     user_info, error_response, status = get_logged_in_user()
# #     if error_response:
# #         return error_response, status

# #     user_id = user_info.get("id")
# #     user_role = user_info.get("role")
    
# #     if user_role == "patient":
# #         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
# #     elif user_role == "doctor":
# #         selected_patient = request.args.get("patientId")
# #         if not selected_patient:
# #             return jsonify({"error": "Doctor must specify a patient ID"}), 400
# #         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
# #     else:
# #         return jsonify({"error": "User role not allowed"}), 403

# #     from langchain_chroma import Chroma
# #     vector_db = Chroma(
# #         persist_directory=vector_db_path,
# #         embedding_function=get_embedding_function(),
# #     )

# #     data = request.json
# #     question = data.get("question")
# #     if not question:
# #         return jsonify({"error": "No question provided"}), 400

# #     answer = query_data(question, vector_db)
# #     return jsonify({"answer": answer})

# # Patient documents endpoint (for patients to view only their own docs)
# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     # Load docs metadata and filter by folder and check physical existence.
#     all_docs = load_docs()
#     patient_docs = []
#     for doc in all_docs:
#         path_parts = doc["fileName"].split("/")
#         if len(path_parts) >= 2:
#             folder_id = path_parts[0]
#             if folder_id == user_id:
#                 safe_path = os.path.join(SAMPLEDATA_FOLDER, doc["fileName"])
#                 if os.path.exists(safe_path):
#                     patient_docs.append(doc)
#     return jsonify(patient_docs)



# @app.route('/query', methods=['POST'])
# def query():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400

#     user_role = user_info.get("role")
#     user_id = user_info.get("id")

#     from langchain_chroma import Chroma

#     # If a patient is querying, use only their own vector DB.
#     if user_role == "patient":
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
#         try:
#             vector_db = Chroma(
#                 persist_directory=vector_db_path,
#                 embedding_function=get_embedding_function(),
#             )
#             answer = query_data(question, vector_db)
#             return jsonify({"answer": answer})
#         except Exception as e:
#             return jsonify({"error": f"Error querying your vector DB: {e}"}), 500

#     # If a doctor is querying, they might either provide a patientId...
#     elif user_role == "doctor":
#         print("JWT TOKEN VALID: I AM A DOCTOR ")
#         selected_patient = request.args.get("patientId")
#         if selected_patient:
#             vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
#             try:
#                 vector_db = Chroma(
#                     persist_directory=vector_db_path,
#                     embedding_function=get_embedding_function(),
#                 )
#                 answer = query_data(question, vector_db)
#                 return jsonify({"answer": answer})
#             except Exception as e:
#                 return jsonify({"error": f"Error querying vector DB for patient {selected_patient}: {e}"}), 500
#         else:
#             # Otherwise, search through all patient directories that contain a chromaDB folder.
#             results = {}
#             for root, dirs, _ in os.walk(SAMPLEDATA_FOLDER):
#                 # Look for a "chromaDB" folder in the current directory.
#                 if "chromaDB" in dirs:
#                     # Assume that the current folder is the patient folder
#                     patient_dir = os.path.basename(root)
#                     vector_db_path = os.path.join(root, "chromaDB")
#                     try:
#                         vector_db = Chroma(
#                             persist_directory=vector_db_path,
#                             embedding_function=get_embedding_function(),
#                         )
#                         # Run the query for this vector DB.
#                         ans = query_data(question, vector_db)
#                         results[patient_dir] = ans
#                     except Exception as e:
#                         print(f"Error querying vector DB for {patient_dir}: {e}")
#                         results[patient_dir] = f"Error: {e}"
#             return jsonify(results)
#     else:
#         return jsonify({"error": "User role not allowed"}), 403




# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)




#TESTING CODE: 



import os
import time
import json
import jwt
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import safe_join
from pymongo import MongoClient
import ssl
from populate_database import populate_patient_vector_db  # Make sure this is implemented!
from query_data import query_rag as query_data
from get_embedding import get_embedding_function  # Used for vector store embeddings

# MongoDB setup
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
# Endpoints
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

# Upload endpoint (only for doctors)
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

    # Update the patient-specific vector DB for this patient:
    populate_patient_vector_db(target_folder)  # This should update sampledata/<patientId>/chromaDB

    # Update docs_list.json with relative path info:
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

# Documents endpoint (for general listing, admin use)
@app.route('/documents', methods=['GET'])
def get_documents():
    docs = load_docs()
    return jsonify(docs)

# File serving endpoint
@app.route('/files/<path:filename>', methods=['GET'])
def get_file(filename):
    safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
    if not os.path.exists(safe_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(safe_path, as_attachment=False)

# Patient documents endpoint (for patients to view only their own docs)
@app.route('/patient-documents', methods=['GET'])
def get_patient_documents():
    user_info, error_response, status = get_logged_in_user()
    if error_response:
        return error_response, status

    user_id = user_info.get("id")
    user_role = user_info.get("role")
    if user_role != "patient":
        return jsonify({"error": "Only patients can view their documents"}), 403

    # Load docs metadata and filter by folder and check physical existence.
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

# ------------------------------
# Query (RAG) endpoint
# ------------------------------
@app.route('/query', methods=['POST'])
def query():
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

    # If a patient is querying, use only their own vector DB.
    if user_role == "patient":
        vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
        try:
            vector_db = Chroma(
                persist_directory=vector_db_path,
                embedding_function=get_embedding_function(),
            )
            answer = query_data(question, vector_db)
            return jsonify({"answer": answer})
        except Exception as e:
            return jsonify({"error": f"Error querying your vector DB: {e}"}), 500

    # If a doctor is querying, they might provide a patientId...
    elif user_role == "doctor":
        print("JWT TOKEN VALID: I AM A DOCTOR")
        selected_patient = request.args.get("patientId")
        if selected_patient:
            vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
            try:
                vector_db = Chroma(
                    persist_directory=vector_db_path,
                    embedding_function=get_embedding_function(),
                )
                answer = query_data(question, vector_db)
                return jsonify({"answer": answer})
            except Exception as e:
                return jsonify({"error": f"Error querying vector DB for patient {selected_patient}: {e}"}), 500
        else:
            # Otherwise, search all subfolders for "chromaDB" and combine results
            combined_responses = []
            for root, dirs, files in os.walk(SAMPLEDATA_FOLDER):
                if "chromaDB" in dirs:
                    # Build path to that DB
                    vector_db_path = os.path.join(root, "chromaDB")
                    # Label the folder (relative path) so we know where the answer came from
                    relative_path = os.path.relpath(root, SAMPLEDATA_FOLDER)

                    try:
                        vector_db = Chroma(
                            persist_directory=vector_db_path,
                            embedding_function=get_embedding_function(),
                        )
                        ans = query_data(question, vector_db)
                        combined_responses.append(f"**Answer from {relative_path}**:\n{ans}")
                    except Exception as e:
                        error_msg = f"Error querying DB in {relative_path}: {e}"
                        print(error_msg)
                        combined_responses.append(error_msg)

            if not combined_responses:
                # No subfolders found containing chromaDB
                return jsonify({"answer": "No patient vector databases found"}), 404

            # Combine all responses into one string
            final_answer = "\n\n".join(combined_responses)
            return jsonify({"answer": final_answer})

    else:
        return jsonify({"error": "User role not allowed"}), 403

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
