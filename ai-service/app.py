# #VERSION 5: PERSISTANT DATA: ENSURE IT STAYS AFTER UPLOADING THE DOCS AND REFRESHING THE PAGE.
# import os
# import time
# import json

# import jwt
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from werkzeug.utils import safe_join
# from populate_database import main as populate_database
# from query_data import query_rag as query_data

# app = Flask(__name__)
# CORS(app)

# SAMPLEDATA_FOLDER = 'sampledata'
# DOCS_FILE = 'docs_list.json'
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)



# # Set the same secret as in your Node.js service
# JWT_SECRET = "your_jwt_secret"  # Replace with your actual secret

# def get_logged_in_user():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header:
#         return None, jsonify({"error": "No token provided"}), 401

#     # Expecting header format: "Bearer <token>"
#     parts = auth_header.split(" ")
#     if len(parts) != 2 or parts[0] != "Bearer":
#         return None, jsonify({"error": "Invalid token format"}), 401

#     token = parts[1]
#     try:
#         # Decode the token; adjust the algorithm if needed
#         payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
#         return payload, None, None  # payload should contain 'id' and 'role'
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


# @app.route('/upload', methods=['POST'])
# def upload_file():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     # Now you have the logged in user's info
#     # For example, you can access user_info['id'] and user_info['role']
#     user_id = user_info.get("id")
#     print(f"User ID from token: {user_id}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     # (Optional) You could use the user_id to store the file in a user-specific folder
#     filepath = os.path.join(SAMPLEDATA_FOLDER, f"{user_id}_{file.filename}")
#     file.save(filepath)

#     # Continue with your file processing...
#     populate_database(SAMPLEDATA_FOLDER)

#     # Update docs list, etc.
#     docs = load_docs()
#     newDoc = {
#         "id": int(time.time() * 1000),
#         "userTitle": request.form.get('docName', file.filename),
#         "type": request.form.get('docType', ''),
#         "fileName": file.filename
#     }
#     docs.append(newDoc)
#     save_docs(docs)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# @app.route('/documents', methods=['GET'])
# def get_documents():
#     docs = load_docs()
#     return jsonify(docs)

# @app.route('/files/<path:filename>', methods=['GET'])
# def get_file(filename):
#     safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
#     if not os.path.exists(safe_path):
#         return jsonify({"error": "File not found"}), 404
#     return send_file(safe_path, as_attachment=False)


# @app.route('/query', methods=['POST'])
# def query():
#     # Get the user info from the JWT
#     user_info, error_response, status = get_user_from_token()
#     if error_response:
#         return error_response, status

#     # Now you have the user info, such as user_info['id']
#     user_id = user_info.get("id")
    
#     # Use the user_id to restrict your data path
#     # For example, if your base data folder is "ai-service/sampledata",
#     # you can build the path like:
#     import os
#     base_data_path = os.path.join("ai-service", "sampledata")
#     user_data_path = os.path.join(base_data_path, user_id)
#     user_data_path = os.path.join(user_data_path, "chromaDB")
    
#     # Now your RAG solution can use user_data_path to look for files
#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400
    
#     # Pass the user_data_path to your query function so it only looks in that folder
#     answer = query_data(question, user_data_path)  # Modify query_data to accept the data path if needed
#     return jsonify({"answer": answer})


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)


#VERSION 6: RESTRICTING ACCESS: 



# import os
# import time
# import json
# import ssl

# import jwt
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from werkzeug.utils import safe_join
# from populate_database import main as populate_database
# from query_data import query_rag as query_data
# from pymongo import MongoClient



# #MONGO_URI = os.environ.get("MONGO_URI", "your_default_mongo_uri_here")
# MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://User:dbUserPassword@cluster0.tgco9.mongodb.net/patient_service_db?retryWrites=true&w=majority&appName=Cluster0")

# #client = MongoClient(MONGO_URI)
# #db = client["your_database_name"] 
# #client = MongoClient(MONGO_URI, ssl_cert_reqs=ssl.CERT_NONE) 
# client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)

# db = client["patient_service_db"]

# app = Flask(__name__)
# CORS(app)

# SAMPLEDATA_FOLDER = 'sampledata'
# DOCS_FILE = 'docs_list.json'
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# # Set the same secret as in your Node.js service
# JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!@"  # Replace with your actual secret


# def get_patients():
#     # Adjust collection name if needed
#     patients = list(db.users.find({"role": "patient"}, {"name": 1, "email": 1}))
#     for patient in patients:
#         # Convert ObjectId to string if needed
#         patient["_id"] = str(patient["_id"])
#     return patients


# @app.route('/patients', methods=['GET'])
# def get_patients_endpoint():
#     try:
#         patients = get_patients()  # Calls the function defined above
#         return jsonify(patients)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/test_token', methods=['GET'])
# def test_token():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status
#     return jsonify(user_info)

# def get_logged_in_user():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header:
#         return None, jsonify({"error": "No token provided"}), 401

#     # Expecting header format: "Bearer <token>"
#     parts = auth_header.split(" ")
#     if len(parts) != 2 or parts[0] != "Bearer":
#         return None, jsonify({"error": "Invalid token format"}), 401

#     token = parts[1]
#     try:
#         # Decode the token; adjust the algorithm if needed
#         payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
#         return payload, None, None  # payload should contain 'id' and 'role'
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

# # @app.route('/upload', methods=['POST'])
# # def upload_file():
# #     user_info, error_response, status = get_logged_in_user()
# #     if error_response:
# #         return error_response, status

# #     user_id = user_info.get("id")
# #     user_role = user_info.get("role")
# #     print(f"User ID from token: {user_id}, Role: {user_role}")

# #     file = request.files.get('file')
# #     if not file:
# #         return jsonify({'error': 'No file provided'}), 400

# #     # Determine base folder: for patients, use user-specific folder; for others, use a common folder
# #     if user_role == "patient":
# #         target_folder = os.path.join(SAMPLEDATA_FOLDER, user_id)
# #     else:
# #         # For example, for doctors, use a common folder like "doctors"
# #         target_folder = os.path.join(SAMPLEDATA_FOLDER, "doctors")

# #     # Create the target folder if it doesn't exist
# #     if not os.path.exists(target_folder):
# #         os.makedirs(target_folder, exist_ok=True)
# #         print(f"Created folder: {target_folder}")

# #     # Save the file in the target folder
# #     filepath = os.path.join(target_folder, file.filename)
# #     file.save(filepath)

# #     # Process the uploaded file(s) as needed
# #     populate_database(SAMPLEDATA_FOLDER)

# #     # Update persistent docs list
# #     docs = []
# #     if os.path.exists(DOCS_FILE):
# #         with open(DOCS_FILE, 'r') as f:
# #             docs = json.load(f)
# #     newDoc = {
# #         "id": int(time.time() * 1000),
# #         "userTitle": request.form.get('docName', file.filename),
# #         "type": request.form.get('docType', ''),
# #         "fileName": file.filename
# #     }
# #     docs.append(newDoc)
# #     with open(DOCS_FILE, 'w') as f:
# #         json.dump(docs, f)

# #     return jsonify({'message': 'File uploaded and processed successfully'})



# @app.route('/upload', methods=['POST'])
# def upload_file():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
    
#     # Get the patientId from the form data
#     selected_patient = request.form.get("patientId")

#     print(f"User ID: {user_id}, Role: {user_role}, Selected Patient: {selected_patient}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     # If doctor selected a patient in the dropdown, store in that patient’s folder.
#     if user_role == "doctor" and selected_patient:
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient)
#     # If the user is a patient themselves, store in their own folder
#     elif user_role == "patient":
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, user_id)
#     else:
#         # Otherwise, treat as administrative or fallback
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, "doctors")

#     if not os.path.exists(target_folder):
#         os.makedirs(target_folder, exist_ok=True)
#         print(f"Created folder: {target_folder}")

#     filepath = os.path.join(target_folder, file.filename)
#     file.save(filepath)

#     # Continue with your existing logic
#     populate_database(SAMPLEDATA_FOLDER)
#     docs = []
#     if os.path.exists(DOCS_FILE):
#         with open(DOCS_FILE, 'r') as f:
#             docs = json.load(f)

#     newDoc = {
#         "id": int(time.time() * 1000),
#         "userTitle": request.form.get('docName', file.filename),
#         "type": request.form.get('docType', ''),
#         "fileName": file.filename
#     }
#     docs.append(newDoc)
#     with open(DOCS_FILE, 'w') as f:
#         json.dump(docs, f)

#     return jsonify({'message': 'File uploaded and processed successfully'})


# @app.route('/documents', methods=['GET'])
# def get_documents():
#     docs = load_docs()
#     return jsonify(docs)

# @app.route('/files/<path:filename>', methods=['GET'])
# def get_file(filename):
#     safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
#     if not os.path.exists(safe_path):
#         return jsonify({"error": "File not found"}), 404
#     return send_file(safe_path, as_attachment=False)

# @app.route('/query', methods=['POST'])
# def query():
#     # Get the user info from the token
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     # Build the path for this user.
#     # For example, assume your base folder is "ai-service/sampledata", then:
#     base_data_path = os.path.join("ai-service", "sampledata")
#     user_data_path = os.path.join(base_data_path, user_id, "chromaDB")
    
#     # Now get the question from the request
#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400

#     # Call your RAG query function with the restricted data path
#     answer = query_data(question, user_data_path)  # Ensure query_data accepts a data path
#     return jsonify({"answer": answer})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)



# import os
# import time
# import json
# import jwt
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from werkzeug.utils import safe_join
# from pymongo import MongoClient
# import ssl
# from populate_database import main as populate_database
# from query_data import query_rag as query_data

# # Load MongoDB URI from environment variable or default
# MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://User:dbUserPassword@cluster0.tgco9.mongodb.net/patient_service_db?retryWrites=true&w=majority&appName=Cluster0")
# # For local development, disable certificate verification (WARNING: do not use in production)
# client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
# db = client["patient_service_db"]

# app = Flask(__name__)
# CORS(app)

# SAMPLEDATA_FOLDER = 'sampledata'
# DOCS_FILE = 'docs_list.json'
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# # Use the same JWT secret as in your Node.js auth service
# JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!@"

# def get_patients():
#     # Query for users with role "patient"
#     patients = list(db.users.find({"role": "patient"}, {"name": 1, "email": 1}))
#     for patient in patients:
#         patient["_id"] = str(patient["_id"])
#     return patients

# @app.route('/patients', methods=['GET'])
# def get_patients_endpoint():
#     try:
#         patients = get_patients()
#         return jsonify(patients)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# def get_logged_in_user():
#     auth_header = request.headers.get('Authorization')
#     if not auth_header:
#         return None, jsonify({"error": "No token provided"}), 401

#     # Expect header format: "Bearer <token>"
#     parts = auth_header.split(" ")
#     if len(parts) != 2 or parts[0] != "Bearer":
#         return None, jsonify({"error": "Invalid token format"}), 401

#     token = parts[1]
#     try:
#         payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
#         return payload, None, None  # Expect payload to include 'id' and 'role'
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


# VERSION: WORKS FOR PATIENT DATA UPLOAD. 
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     # Get the logged-in user's info from JWT
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_role = user_info.get("role")
#     user_id = user_info.get("id")
#     print(f"Logged-in User ID: {user_id}, Role: {user_role}")

#     # Only doctors can upload documents
#     if user_role != "doctor":
#         return jsonify({"error": "Only doctors can upload documents"}), 403

#     # Get the selected patient from the form data
#     selected_patient_id = request.form.get("patientId")
#     if not selected_patient_id:
#         return jsonify({"error": "No patient selected"}), 400

#     print(f"Doctor (ID: {user_id}) is uploading for Patient ID: {selected_patient_id}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     # Save file in the selected patient's folder (existing directories are named after patient IDs)
#     target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient_id)
#     if not os.path.exists(target_folder):
#         os.makedirs(target_folder, exist_ok=True)
#         print(f"Created folder: {target_folder}")

#     filepath = os.path.join(target_folder, file.filename)
#     file.save(filepath)

#     # Process file(s) as needed (e.g., extract text and update vector store)
#     populate_database(SAMPLEDATA_FOLDER)

#     # Update docs_list.json
#     docs = load_docs()
#     newDoc = {
#         "id": int(time.time() * 1000),
#         "userTitle": request.form.get('docName', file.filename),
#         "type": request.form.get('docType', ''),
#         "fileName": file.filename
#     }
#     docs.append(newDoc)
#     save_docs(docs)

#     return jsonify({'message': 'File uploaded and processed successfully'})



#STABLE VERSION : 10:56 AM SUNDAY 
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_role = user_info.get("role")
#     user_id = user_info.get("id")
#     print(f"Logged-in User ID: {user_id}, Role: {user_role}")

#     # Only doctors can upload documents
#     if user_role != "doctor":
#         return jsonify({"error": "Only doctors can upload documents"}), 403

#     # Get the selected patient from the form data
#     selected_patient_id = request.form.get("patientId")
#     print(f"Selected patient ID from form: {selected_patient_id}")

#     # If no patient is selected (empty string) treat as "administrative"
#     if not selected_patient_id or selected_patient_id.strip() == "":
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, "administrative")
#     else:
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient_id)

#     # Create the target folder if it doesn't exist
#     if not os.path.exists(target_folder):
#         os.makedirs(target_folder, exist_ok=True)
#         print(f"Created folder: {target_folder}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     filepath = os.path.join(target_folder, file.filename)
#     file.save(filepath)

#     # Continue with your file processing logic
#     populate_database(SAMPLEDATA_FOLDER)

#     # Update persistent docs list
#     docs = []
#     if os.path.exists(DOCS_FILE):
#         with open(DOCS_FILE, 'r') as f:
#             docs = json.load(f)
#     # newDoc = {
#     #     "id": int(time.time() * 1000),
#     #     "userTitle": request.form.get('docName', file.filename),
#     #     "type": request.form.get('docType', ''),
#     #     "fileName": file.filename
#     # }


#     newDoc = {
#     "id": int(time.time() * 1000),
#     "userTitle": request.form.get('docName', file.filename),
#     "type": request.form.get('docType', ''),
#     # If you physically saved the file to sampledata/<patientId>/<filename>:
#     "fileName": f"{selected_patient_id}/{file.filename}"
#     # or if you want to store the full path with "sampledata" included:
#     # "fileName": f"sampledata/{selected_patient_id}/{file.filename}"
# }
#     docs.append(newDoc)
#     with open(DOCS_FILE, 'w') as f:
#         json.dump(docs, f)

#     return jsonify({'message': 'File uploaded and processed successfully'})




# @app.route('/upload', methods=['POST'])
# def upload_file():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_role = user_info.get("role")
#     user_id = user_info.get("id")
#     print(f"Logged-in User ID: {user_id}, Role: {user_role}")

#     # Only doctors can upload documents
#     if user_role != "doctor":
#         return jsonify({"error": "Only doctors can upload documents"}), 403

#     # Get the selected patient from the form data
#     selected_patient_id = request.form.get("patientId")
#     print(f"Selected patient ID from form: {selected_patient_id}")

#     # If no patient is selected (empty string), treat as "administrative"
#     if not selected_patient_id or selected_patient_id.strip() == "":
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, "administrative")
#     else:
#         target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient_id)

#     # Create the target folder if it doesn't exist
#     if not os.path.exists(target_folder):
#         os.makedirs(target_folder, exist_ok=True)
#         print(f"Created folder: {target_folder}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     # Save the file in the target folder
#     filepath = os.path.join(target_folder, file.filename)
#     file.save(filepath)

#     # Process file(s) as needed (e.g., update your vector store)
#     populate_database(SAMPLEDATA_FOLDER)

#     # Compute the relative folder path (relative to SAMPLEDATA_FOLDER)
#     relative_folder = os.path.relpath(target_folder, SAMPLEDATA_FOLDER)
    
#     # Update docs list with the relative file path (e.g., "selected_patient_id/filename" or "administrative/filename")
#     docs = []
#     if os.path.exists(DOCS_FILE):
#         with open(DOCS_FILE, 'r') as f:
#             docs = json.load(f)
#     newDoc = {
#         "id": int(time.time() * 1000),
#         "userTitle": request.form.get('docName', file.filename),
#         "type": request.form.get('docType', ''),
#         "fileName": f"{relative_folder}/{file.filename}"
#     }
#     docs.append(newDoc)
#     with open(DOCS_FILE, 'w') as f:
#         json.dump(docs, f)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# @app.route('/documents', methods=['GET'])
# def get_documents():
#     docs = load_docs()
#     return jsonify(docs)

# @app.route('/files/<path:filename>', methods=['GET'])
# def get_file(filename):
#     safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
#     if not os.path.exists(safe_path):
#         return jsonify({"error": "File not found"}), 404
#     return send_file(safe_path, as_attachment=False)

# @app.route('/query', methods=['POST'])
# def query():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     base_data_path = os.path.join("ai-service", "sampledata")
#     user_data_path = os.path.join(base_data_path, user_id, "chromaDB")
    
#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400
    
#     answer = query_data(question, user_data_path)
#     return jsonify({"answer": answer})

# @app.route('/test_token', methods=['GET'])
# def test_token():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status
#     return jsonify(user_info)




# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     all_docs = load_docs()
#     patient_docs = []
#     for doc in all_docs:
#         # Assume doc["fileName"] is stored with the folder, e.g. "sampledata/<patientId>/filename.ext"
#         # Split by "/" and use the second element (index 1) as the folder name (patient's ID).
#         path_parts = doc["fileName"].split("/")
#         if len(path_parts) >= 2:
#             folder_id = path_parts[1]
#             if folder_id == user_id:
#                 patient_docs.append(doc)

#     return jsonify(patient_docs)




# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     # Get the logged-in user's info
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
    
#     # Only allow patients to access their own documents
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     # Build the path to the patient’s folder
#     patient_folder = os.path.join(SAMPLEDATA_FOLDER, user_id)
    
#     # If the folder doesn't exist, return an empty list
#     if not os.path.exists(patient_folder):
#         return jsonify([])

#     # List all files in the patient folder
#     try:
#         file_list = os.listdir(patient_folder)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     # Build a list of document objects (you can expand this if needed)
#     docs = []
#     for f in file_list:
#         docs.append({
#             "fileName": f,
#             "path": f"{user_id}/{f}"  # relative path that your front end can use to view/download the file
#         })

#     return jsonify(docs)


# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     # Get logged-in user info from the token
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
    
#     # Only patients should be able to view their documents
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     # Build the path to the patient’s folder
#     patient_folder = os.path.join(SAMPLEDATA_FOLDER, user_id)
    
#     # If the folder doesn't exist, return an empty list
#     if not os.path.exists(patient_folder):
#         return jsonify([])

#     try:
#         file_list = os.listdir(patient_folder)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     # Build a list of document objects. You can add more metadata if needed.
#     docs = []
#     for filename in file_list:
#         docs.append({
#             "fileName": filename,
#             "path": f"{user_id}/{filename}"  # relative path for fetching the file
#         })

#     return jsonify(docs)


#FALLBACK VERSION
# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     patient_folder = os.path.join(SAMPLEDATA_FOLDER, user_id)
#     print(f"Looking for files in folder: {patient_folder}")
#     if not os.path.exists(patient_folder):
#         print("Folder does not exist.")
#         return jsonify([])

#     try:
#         file_list = os.listdir(patient_folder)
#         print("Files found:", file_list)
#     except Exception as e:
#         print("Error listing folder:", e)
#         return jsonify({"error": str(e)}), 500

#     docs = []
#     for filename in file_list:
#         docs.append({
#             "fileName": filename,
#             "path": f"{user_id}/{filename}"
#         })
#     print("Returning documents:", docs)
#     return jsonify(docs)




# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")

#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     # Load the full docs list from docs_list.json
#     all_docs = load_docs()  # each doc has { id, userTitle, type, fileName }

#     patient_docs = []
#     for doc in all_docs:
#         # doc["fileName"] might be "67df7c0b107ef371acb55ecb/test.pdf"
#         # Split on "/" to see if the first segment is user_id
#         path_parts = doc["fileName"].split("/")
#         if len(path_parts) >= 2:
#             folder_id = path_parts[0]  # e.g. "67df7c0b107ef371acb55ecb"
#             if folder_id == user_id:
#                 patient_docs.append(doc)
#         else:
#             # If doc["fileName"] has no "/", it doesn't belong to any patient folder
#             # You can ignore it or handle it as "administrative"
#             pass

#     return jsonify(patient_docs)



#STABLE VERSION WORKS FOR UPLOADING : DNE RAG/CHROMADB:

# @app.route('/patient-documents', methods=['GET'])
# def get_patient_documents():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")

#     # Only allow patients to view their documents
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     # Load the doc list from docs_list.json
#     all_docs = load_docs()  # e.g. [{"fileName": "abc123/test.pdf", "userTitle": "...", ...}, ...]

#     patient_docs = []
#     for doc in all_docs:
#         # We expect doc["fileName"] to look like "<patientId>/<filename.ext>"
#         path_parts = doc["fileName"].split("/")
#         if len(path_parts) >= 2:
#             folder_id = path_parts[0]  # e.g. "67df7c0b107ef371acb55ecb"
#             if folder_id == user_id:
#                 # Check if the file physically exists
#                 safe_path = os.path.join(SAMPLEDATA_FOLDER, doc["fileName"])
#                 if os.path.exists(safe_path):
#                     # File is still on disk, so include it
#                     patient_docs.append(doc)
#                 else:
#                     # File was deleted from the folder - skip it
#                     pass
#         else:
#             # doc["fileName"] doesn't have a "/", so it's not in a patient folder
#             # You can decide to skip it or treat it as "administrative"
#             pass

#     return jsonify(patient_docs)


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)





# import os
# import time
# import json
# import jwt
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# from werkzeug.utils import safe_join
# from pymongo import MongoClient
# from populate_database import populate_patient_vector_db  # New per-patient DB population function
# from query_data import query_rag as query_data
# from get_embedding import get_embedding_function  # used for vector store

# # Load MongoDB URI from environment variable or default
# MONGO_URI = os.environ.get(
#     "MONGO_URI",
#     "mongodb+srv://User:dbUserPassword@cluster0.tgco9.mongodb.net/patient_service_db?retryWrites=true&w=majority&appName=Cluster0"
# )
# # For local development, disable certificate verification (WARNING: do not use in production)
# client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
# db = client["patient_service_db"]

# app = Flask(__name__)
# CORS(app)

# SAMPLEDATA_FOLDER = 'sampledata'
# DOCS_FILE = 'docs_list.json'
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# # Use the same JWT secret as in your Node.js auth service
# JWT_SECRET = "superlongrandomstringwithlettersnumberssymbols123!@"


# def get_patients():
#     patients = list(db.users.find({"role": "patient"}, {"name": 1, "email": 1}))
#     for patient in patients:
#         patient["_id"] = str(patient["_id"])
#     return patients

# @app.route('/patients', methods=['GET'])
# def get_patients_endpoint():
#     try:
#         patients = get_patients()  # This function should query db.users for patients
#         return jsonify(patients)
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    


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
#         return payload, None, None  # Expected payload: { "id": ..., "role": ... }
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

# # ---------------------------
# # Upload Endpoint (for Doctors)
# # ---------------------------
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_role = user_info.get("role")
#     user_id = user_info.get("id")
#     print(f"Logged-in User ID: {user_id}, Role: {user_role}")

#     # Only doctors can upload documents
#     if user_role != "doctor":
#         return jsonify({"error": "Only doctors can upload documents"}), 403

#     # Get the selected patient from the form data (must be provided)
#     selected_patient_id = request.form.get("patientId")
#     if not selected_patient_id:
#         return jsonify({"error": "No patient selected"}), 400

#     print(f"Doctor {user_id} is uploading for Patient ID: {selected_patient_id}")

#     # Save file in the selected patient's folder
#     target_folder = os.path.join(SAMPLEDATA_FOLDER, selected_patient_id)
#     if not os.path.exists(target_folder):
#         os.makedirs(target_folder, exist_ok=True)
#         print(f"Created folder: {target_folder}")

#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     filepath = os.path.join(target_folder, file.filename)
#     file.save(filepath)

#     # Update the patient-specific vector DB.
#     # This function should populate (or update) the Chroma DB in: sampledata/<patientId>/chromaDB
#     populate_patient_vector_db(target_folder)

#     # Update docs_list.json with metadata.
#     # We store the relative file path as "<patientId>/<filename>"
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

# # ---------------------------
# # Documents Endpoint (for Admin/General Listing)
# # ---------------------------
# @app.route('/documents', methods=['GET'])
# def get_documents():
#     docs = load_docs()
#     return jsonify(docs)

# # ---------------------------
# # File Serving Endpoint
# # ---------------------------
# @app.route('/files/<path:filename>', methods=['GET'])
# def get_file(filename):
#     safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
#     if not os.path.exists(safe_path):
#         return jsonify({"error": "File not found"}), 404
#     return send_file(safe_path, as_attachment=False)

# # ---------------------------
# # Query (RAG) Endpoint
# # ---------------------------
# @app.route('/query', methods=['POST'])
# def query():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
    
#     # For patients, use their own vector DB inside their folder.
#     if user_role == "patient":
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
#     # For doctors, expect a patientId as a query parameter to specify which patient's vector DB to query.
#     elif user_role == "doctor":
#         selected_patient = request.args.get("patientId")
#         if not selected_patient:
#             return jsonify({"error": "Doctor must specify a patient ID"}), 400
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
#     else:
#         return jsonify({"error": "User role not allowed"}), 403

#     # Instantiate the vector DB from the appropriate patient folder.
#     from langchain_chroma import Chroma
#     vector_db = Chroma(
#         persist_directory=vector_db_path,
#         embedding_function=get_embedding_function(),
#     )

#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400

#     # Run the RAG query using the patient's (or selected patient's) vector store.
#     answer = query_data(question, vector_db)
#     return jsonify({"answer": answer})

# # ---------------------------
# # Test Token Endpoint
# # ---------------------------
# @app.route('/test_token', methods=['GET'])
# def test_token():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status
#     return jsonify(user_info)

# # ---------------------------
# # Patient Documents Endpoint (For Patients to View Their Files)
# # ---------------------------
# @app.route('/patient-documents', methods=['GET'])

# def get_patient_documents():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")

#     # Only allow patients to view their documents
#     if user_role != "patient":
#         return jsonify({"error": "Only patients can view their documents"}), 403

#     # Load the doc list from docs_list.json
#     all_docs = load_docs()  # e.g. [{"fileName": "abc123/test.pdf", "userTitle": "...", ...}, ...]

#     patient_docs = []
#     for doc in all_docs:
#         # We expect doc["fileName"] to look like "<patientId>/<filename.ext>"
#         path_parts = doc["fileName"].split("/")
#         if len(path_parts) >= 2:
#             folder_id = path_parts[0]  # e.g. "67df7c0b107ef371acb55ecb"
#             if folder_id == user_id:
#                 # Check if the file physically exists
#                 safe_path = os.path.join(SAMPLEDATA_FOLDER, doc["fileName"])
#                 if os.path.exists(safe_path):
#                     # File is still on disk, so include it
#                     patient_docs.append(doc)
#                 else:
#                     # File was deleted from the folder - skip it
#                     pass
#         else:
#             # doc["fileName"] doesn't have a "/", so it's not in a patient folder
#             # You can decide to skip it or treat it as "administrative"
#             pass

#     return jsonify(patient_docs)


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)






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

# # Query (RAG) endpoint
# @app.route('/query', methods=['POST'])
# def query():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
    
#     if user_role == "patient":
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
#     elif user_role == "doctor":
#         selected_patient = request.args.get("patientId")
#         if not selected_patient:
#             return jsonify({"error": "Doctor must specify a patient ID"}), 400
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
#     else:
#         return jsonify({"error": "User role not allowed"}), 403

#     from langchain_chroma import Chroma
#     vector_db = Chroma(
#         persist_directory=vector_db_path,
#         embedding_function=get_embedding_function(),
#     )

#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400

#     answer = query_data(question, vector_db)
#     return jsonify({"answer": answer})

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

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)







#########################



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




# # Query (RAG) endpoint
# @app.route('/query', methods=['POST'])
# def query():
#     user_info, error_response, status = get_logged_in_user()
#     if error_response:
#         return error_response, status

#     user_id = user_info.get("id")
#     user_role = user_info.get("role")
    
#     if user_role == "patient":
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, user_id, "chromaDB")
#     elif user_role == "doctor":
#         selected_patient = request.args.get("patientId")
#         if not selected_patient:
#             return jsonify({"error": "Doctor must specify a patient ID"}), 400
#         vector_db_path = os.path.join(SAMPLEDATA_FOLDER, selected_patient, "chromaDB")
#     else:
#         return jsonify({"error": "User role not allowed"}), 403

#     from langchain_chroma import Chroma
#     vector_db = Chroma(
#         persist_directory=vector_db_path,
#         embedding_function=get_embedding_function(),
#     )

#     data = request.json
#     question = data.get("question")
#     if not question:
#         return jsonify({"error": "No question provided"}), 400

#     answer = query_data(question, vector_db)
#     return jsonify({"answer": answer})

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

    # If a doctor is querying, they might either provide a patientId...
    elif user_role == "doctor":
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
            # Otherwise, search through all patient directories that contain a chromaDB folder.
            results = {}
            for root, dirs, _ in os.walk(SAMPLEDATA_FOLDER):
                # Look for a "chromaDB" folder in the current directory.
                if "chromaDB" in dirs:
                    # Assume that the current folder is the patient folder
                    patient_dir = os.path.basename(root)
                    vector_db_path = os.path.join(root, "chromaDB")
                    try:
                        vector_db = Chroma(
                            persist_directory=vector_db_path,
                            embedding_function=get_embedding_function(),
                        )
                        # Run the query for this vector DB.
                        ans = query_data(question, vector_db)
                        results[patient_dir] = ans
                    except Exception as e:
                        print(f"Error querying vector DB for {patient_dir}: {e}")
                        results[patient_dir] = f"Error: {e}"
            return jsonify(results)
    else:
        return jsonify({"error": "User role not allowed"}), 403




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
