import React, { useState } from "react";
import "./upload.css";  // See CSS below
import logo from "../assets/logo.png"; // Adjust path to your logo

const Documents = () => {
  // Start with an empty list of documents
  const [documents, setDocuments] = useState([]);

  // Modal visibility
  const [showModal, setShowModal] = useState(false);

  // Form fields for new document
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);

  // Open/Close the modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    // Reset form fields
    setDocName("");
    setDocType("");
    setDocFile(null);
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  // Add the new document to the table
  const handleAddDocument = () => {
    if (!docName || !docType || !docFile) {
      alert("Please enter a name, type, and choose a file.");
      return;
    }
    const newDoc = {
      id: Date.now(),
      name: docName,
      type: docType,
    };
    setDocuments([...documents, newDoc]);
    handleCloseModal(); // close modal + reset fields
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Patients</li>
            <li>Schedule</li>
            <li>MedAssistant</li>
            <li>Personal Profile</li> {/* New Button */}
            <li>Settings</li> {/* Settings Button */}
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        <header className="top-bar">
          <input
            type="text"
            placeholder="Search for anything..."
            className="search-bar"
          />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Forms</button>

            <button className="Doc">Document Upload</button>
            <button>To-Do</button>
          </div>
        </header>

      {/* === MAIN CONTENT WRAPPER === */}
      <div className="main-content">
        {/* CONTENT AREA */}
        <div className="content-area">
          {/* Heading row */}
          <div className="documents-header">
            <h2>Medical Documents</h2>
            <button className="upload-button" onClick={handleOpenModal}>
              Upload Document
            </button>
          </div>

          {/* TABLE */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  /* If no docs, show a single row that says "No documents found" */
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>{doc.name}</td>
                      <td>{doc.type}</td>
                      <td>
                        <button className="view-btn">View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </main>

      {/* === MODAL OVERLAY === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Upload Document</h2>

            {/* Document Name */}
            <label>Document Name</label>
            <input
              type="text"
              placeholder="Document Name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />

            {/* Document Type */}
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="Prescription">Prescription</option>
              <option value="Intake Form">Intake Form</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Ultrasound">Ultrasound</option>
            </select>

            {/* Document File */}
            <label>Select file</label>
            <input type="file" onChange={handleFileChange} />

            {/* Buttons */}
            <div className="modal-buttons">
              <button className="add-btn" onClick={handleAddDocument}>
                Add
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
