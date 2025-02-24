# # from flask import Flask, request, jsonify
# # import os

# # # Import these from your local modules:
# # from populate_database import populate_database
# # from query_data import query_data

# # app = Flask(__name__)

# # # Adjust these folders as needed:
# # UPLOAD_FOLDER = 'uploads'
# # SAMPLEDATA_FOLDER = 'sampledata'

# # # Create folders if they don't exist
# # os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# # os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# # @app.route('/upload', methods=['POST'])
# # def upload_file():
# #     # 1) Receive the file from the POST request
# #     file = request.files.get('file')
# #     if not file:
# #         return jsonify({'error': 'No file provided'}), 400

# #     # 2) Save the file to SAMPLEDATA_FOLDER
# #     filepath = os.path.join(SAMPLEDATA_FOLDER, file.filename)
# #     file.save(filepath)

# #     # 3) Populate the database with the uploaded file(s)
# #     populate_database(SAMPLEDATA_FOLDER)

# #     return jsonify({'message': 'File uploaded and processed successfully'})

# # @app.route('/query', methods=['POST'])
# # def query():
# #     # 1) Extract JSON from the request body
# #     data = request.json
# #     question = data.get('question')
# #     if not question:
# #         return jsonify({'error': 'No question provided'}), 400

# #     # 2) Generate the answer using your RAG pipeline
# #     answer = query_data(question)

# #     return jsonify({'answer': answer})

# # if __name__ == '__main__':
# #     # 3) Run the Flask server
# #     app.run(host='0.0.0.0', port=5001, debug=True)
# from flask import Flask, request, jsonify
# import os
# # Make sure the filename is spelled exactly "populate_database.py" 
# # and inside it you have `def populate_database(...)`
# from populate_database import main
# from query_data import main

# app = Flask(__name__)

# UPLOAD_FOLDER = 'uploads'
# SAMPLEDATA_FOLDER = 'sampledata'

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     filepath = os.path.join(SAMPLEDATA_FOLDER, file.filename)
#     file.save(filepath)

#     # This will call `populate_database(...)` from populate_database.py
#     populate_database(SAMPLEDATA_FOLDER)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# @app.route('/query', methods=['POST'])
# def query():
#     data = request.json
#     question = data.get('question')
#     if not question:
#         return jsonify({'error': 'No question provided'}), 400

#     answer = query_data(question)
#     return jsonify({'answer': answer})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)
# from flask import Flask, request, jsonify
# import os
# from flask_cors import CORS  # Import CORS

# # Import these from your local modules:
# from populate_database import main as populate_database

# from query_data import query_rag as query_data


# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# # Adjust these folders as needed:
# UPLOAD_FOLDER = 'uploads'
# SAMPLEDATA_FOLDER = 'sampledata'

# # Create folders if they don't exist
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     # 1) Receive the file from the POST request
#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     # 2) Save the file to SAMPLEDATA_FOLDER
#     filepath = os.path.join(SAMPLEDATA_FOLDER, file.filename)
#     file.save(filepath)

#     # 3) Populate the database with the uploaded file(s)
#     populate_database(SAMPLEDATA_FOLDER)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# @app.route('/query', methods=['POST'])
# def query():
#     # 1) Extract JSON from the request body
#     data = request.json
#     question = data.get('question')
#     if not question:
#         return jsonify({'error': 'No question provided'}), 400

#     # 2) Generate the answer using your RAG pipeline
#     answer = query_data(question)

#     return jsonify({'answer': answer})

# if __name__ == '__main__':
#     # 3) Run the Flask server
#     app.run(host='0.0.0.0', port=5001, debug=True)


#VERSION 1: BASIC UPLOAD FEATURE WORKS SORTA. 
# from flask import Flask, request, jsonify
# import os
# from flask_cors import CORS
# from populate_database import main as populate_database
# from query_data import query_rag as query_data

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# UPLOAD_FOLDER = 'uploads'
# SAMPLEDATA_FOLDER = 'sampledata'

# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     filepath = os.path.join(SAMPLEDATA_FOLDER, file.filename)
#     file.save(filepath)

#     # Call populate_database with correct argument
#     populate_database(SAMPLEDATA_FOLDER)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# @app.route('/query', methods=['POST'])
# def query():
#     data = request.json
#     question = data.get('question')
#     if not question:
#         return jsonify({'error': 'No question provided'}), 400

#     answer = query_data(question)
#     return jsonify({'answer': answer})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)


#VERSION 2: GET THE VIEW BUTTON TO GET THE ACTUAL DOCUMENT: 
# from flask import Flask, request, jsonify, send_file
# import os
# from flask_cors import CORS
# from werkzeug.utils import safe_join
# from populate_database import main as populate_database
# from query_data import query_rag as query_data

# app = Flask(__name__)
# CORS(app)

# SAMPLEDATA_FOLDER = 'sampledata'
# os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     file = request.files.get('file')
#     if not file:
#         return jsonify({'error': 'No file provided'}), 400

#     filepath = os.path.join(SAMPLEDATA_FOLDER, file.filename)
#     file.save(filepath)

#     # If you need to call populate_database:
#     populate_database(SAMPLEDATA_FOLDER)

#     return jsonify({'message': 'File uploaded and processed successfully'})

# @app.route('/files/<path:filename>', methods=['GET'])
# def get_file(filename):
#     """
#     Returns the requested file from the sampledata folder.
#     GET /files/<filename>
#     """
#     safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
#     if not os.path.exists(safe_path):
#         return jsonify({"error": "File not found"}), 404
    
#     return send_file(safe_path, as_attachment=False)

# @app.route('/query', methods=['POST'])
# def query():
#     data = request.json
#     question = data.get('question')
#     if not question:
#         return jsonify({'error': 'No question provided'}), 400

#     answer = query_data(question)
#     return jsonify({'answer': answer})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)


#VERSION 5: PERSISTANT DATA: ENSURE IT STAYS AFTER UPLOADING THE DOCS AND REFRESHING THE PAGE.



import os
import time
import json
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import safe_join
from populate_database import main as populate_database
from query_data import query_rag as query_data

app = Flask(__name__)
CORS(app)

SAMPLEDATA_FOLDER = 'sampledata'
DOCS_FILE = 'docs_list.json'
os.makedirs(SAMPLEDATA_FOLDER, exist_ok=True)

def load_docs():
    if os.path.exists(DOCS_FILE):
        with open(DOCS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_docs(docs):
    with open(DOCS_FILE, 'w') as f:
        json.dump(docs, f)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file provided'}), 400

    # Save the file to SAMPLEDATA_FOLDER
    filepath = os.path.join(SAMPLEDATA_FOLDER, file.filename)
    file.save(filepath)

    # Optionally, process the file (populate database) if needed:
    populate_database(SAMPLEDATA_FOLDER)

    # Read extra form fields for a user-friendly title and type
    userTitle = request.form.get('docName', file.filename)
    docType = request.form.get('docType', '')

    # Update our persistent docs list
    docs = load_docs()
    newDoc = {
        "id": int(time.time() * 1000),
        "userTitle": userTitle,
        "type": docType,
        "fileName": file.filename
    }
    docs.append(newDoc)
    save_docs(docs)

    return jsonify({'message': 'File uploaded and processed successfully'})

@app.route('/documents', methods=['GET'])
def get_documents():
    docs = load_docs()
    return jsonify(docs)

@app.route('/files/<path:filename>', methods=['GET'])
def get_file(filename):
    safe_path = safe_join(SAMPLEDATA_FOLDER, filename)
    if not os.path.exists(safe_path):
        return jsonify({"error": "File not found"}), 404
    return send_file(safe_path, as_attachment=False)

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    question = data.get('question')
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    answer = query_data(question)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
