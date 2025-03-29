import React, { useState, useEffect } from "react";
import flaskApi from "../api"; // Your Axios instance that attaches JWT automatically
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./patient_document_view.css"; // Matching CSS file
import "./patient-documents.css";


function PatientDocumentView() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  // Fetch the patient's documents on mount
  useEffect(() => {
    fetchPatientDocuments();
  }, []);

  const fetchPatientDocuments = async () => {
    try {
      // Example: a dedicated endpoint that returns only the current patient's docs
      const response = await flaskApi.get("/patient-documents");
      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching patient documents:", err);
      setError("Failed to load documents. Please try again later.");
    }
  };

  // For viewing/downloading a document
  const handleViewDocument = async (doc) => {
    try {
      // Adjust if your endpoint is different, e.g. GET /files/<filename>
      const response = await flaskApi.get(`/files/${encodeURIComponent(doc.fileName)}`, {
        responseType: "blob"
      });
      const contentType = response.headers["content-type"] || "application/octet-stream";
      const blobFile = new File([response.data], doc.fileName, { type: contentType });

      // Create a temporary URL to open or download
      const url = URL.createObjectURL(blobFile);
      window.open(url, "_blank"); // Opens in a new tab
    } catch (err) {
      console.error("Error viewing document:", err);
      setError("Could not open the file.");
    }
  };

  return (
    <div className="dashboard">
      {/* === SIDEBAR === */}
     

      {/* === MAIN CONTENT === */}
      <main className="content">
        {/* TOP BAR */}
        

        {/* MAIN CONTENT WRAPPER */}
        <div className="main-content">
          <h2 className="patient-docs-title">My Documents</h2>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#888" }}>
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.userTitle}</td>
                      <td>{doc.type}</td>
                      <td>
                        <button className="view-btn" onClick={() => handleViewDocument(doc)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDocumentView;
