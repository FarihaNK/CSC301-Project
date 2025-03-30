// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./upload.css";   // or "./DocUpload.css" - ensure your old CSS classes are here
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom
// import logo from "../assets/logo.png";

// const Documents = () => {
//   // ========== State Variables ==========

//   // Documents from server
//   const [documents, setDocuments] = useState([]);

//   // Modals
//   const [showModal, setShowModal] = useState(false);   // For "Upload Document" modal
//   const [previewModal, setPreviewModal] = useState(false); // For preview/zoom modal

//   // Form fields for upload
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // Preview data
//   const [previewUrl, setPreviewUrl] = useState(null); // For PDFs/images
//   const [textContent, setTextContent] = useState("");  // For text-based files

//   // Zoom
//   const [zoom, setZoom] = useState(1);

//   // ========== Fetch Documents on Page Load ==========
//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/documents");
//       setDocuments(response.data);
//     } catch (error) {
//       console.error("Error fetching documents:", error);
//     }
//   };

//   // ========== Upload Modal Logic ==========
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     resetPreviewState();
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//   };

//   // ========== File Selection & Immediate Preview ==========
//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setDocFile(file);
//     handlePreview(file);
//   };

//   const handlePreview = (file) => {
//     // Reset old states
//     setZoom(1);
//     setPreviewUrl(null);
//     setTextContent("");

//     if (file.type === "application/pdf") {
//       // PDF
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }
//     if (file.type.startsWith("text/")) {
//       // Text-based
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setTextContent(event.target.result);
//         setPreviewModal(true);
//       };
//       reader.readAsText(file);
//       return;
//     }
//     if (file.type.startsWith("image/")) {
//       // Image
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }
//     // Fallback => treat like PDF in iframe
//     const fallbackUrl = URL.createObjectURL(file);
//     setPreviewUrl(fallbackUrl);
//     setPreviewModal(true);
//   };

//   // ========== Zoom Controls ==========
//   const handleZoomIn = () => setZoom((prev) => prev + 0.1);
//   const handleZoomOut = () => setZoom((prev) => Math.max(0.1, prev - 0.1));

//   const resetPreviewState = () => {
//     setPreviewModal(false);
//     setPreviewUrl(null);
//     setTextContent("");
//     setZoom(1);
//   };

//   // ========== Upload to Backend ==========
//   const handleUploadDocument = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }
//     try {
//       const formData = new FormData();
//       formData.append("file", docFile);
//       formData.append("docName", docName);
//       formData.append("docType", docType);

//       await axios.post("http://localhost:5001/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("File uploaded successfully");
//       fetchDocuments();     // Refresh table
//       resetPreviewState();
//       setShowModal(false);  // Close upload modal
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("File upload failed");
//     }
//   };

//   // ========== View Document from Table ==========
//   const handleViewDocument = async (doc) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5001/files/${encodeURIComponent(doc.fileName)}`,
//         { responseType: "blob" }
//       );
//       const contentType = response.headers["content-type"] || "application/octet-stream";
//       const fetchedFile = new File([response.data], doc.fileName, { type: contentType });
//       handlePreview(fetchedFile);
//     } catch (error) {
//       console.error("Error fetching file:", error);
//       alert("Could not retrieve file.");
//     }
//   };

//   // ========== RENDER ==========
//   return (
//     <div className="dashboard">
//       {/* === MAIN CONTENT === */}
//       <main className="content">
//         {/* MAIN CONTENT WRAPPER */}
//         <div className="main-content">
//           {/* CONTENT AREA */}
//           <div className="content-area">
//             {/* Heading row */}
//             <div className="documents-header">
//               <h2>Medical Documents</h2>
//               <button className="upload-button" onClick={handleOpenModal}>
//                 Upload Document
//               </button>
//             </div>

//             {/* TABLE */}
//             <div className="table-container">
//               <table>
//                 <thead>
//                   <tr>
//                     <th></th>
//                     <th>Name</th>
//                     <th>Type</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {documents.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
//                         No documents found.
//                       </td>
//                     </tr>
//                   ) : (
//                     documents.map((doc) => (
//                       <tr key={doc.id}>
//                         <td>
//                           <input type="checkbox" />
//                         </td>
//                         {/* We use doc.userTitle for the "Name" column */}
//                         <td>{doc.userTitle}</td>
//                         <td>{doc.type}</td>
//                         <td>
//                           <button className="view-btn" onClick={() => handleViewDocument(doc)}>
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* === UPLOAD MODAL === */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>

//             {/* Document Name */}
//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="Document Name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />

//             {/* Document Type */}
//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>

//             {/* Document File */}
//             <label>Select file</label>
//             <input type="file" onChange={handleFileChange} />

//             {/* Buttons */}
//             <div className="modal-buttons">
//               {/* Use "Add" label but call handleUploadDocument */}
//               <button className="add-btn" onClick={handleUploadDocument}>
//                 Add
//               </button>
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* === PREVIEW MODAL (with Zoom) === */}
//       {previewModal && (
//         <div className="modal-overlay">
//           <div
//             className="modal-content"
//             style={{
//               maxWidth: "90vw",
//               maxHeight: "90vh",
//               width: "90vw",
//               height: "90vh",
//               backgroundColor: "#fff",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <h2>Document Preview</h2>

//             {/* Zoom Controls */}
//             <div style={{ marginBottom: "1rem" }}>
//               <button onClick={handleZoomOut} style={{ marginRight: "0.5rem" }}>
//                 Zoom Out
//               </button>
//               <button onClick={handleZoomIn}>Zoom In</button>
//               <span style={{ marginLeft: "1rem" }}>
//                 Current Zoom: {Math.round(zoom * 100)}%
//               </span>
//             </div>

//             <div
//               style={{
//                 flex: 1,
//                 overflow: "auto",
//                 backgroundColor: "#fff",
//                 color: "#000",
//                 border: "1px solid #000",
//                 padding: "1rem",
//                 position: "relative",
//               }}
//             >
//               {/* If it's text => <pre> with bigger font */}
//               {textContent && (
//                 <pre
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     wordWrap: "break-word",
//                     color: "#000",
//                     backgroundColor: "#fff",
//                     fontSize: `${14 * zoom}px`,
//                     transformOrigin: "top left",
//                   }}
//                 >
//                   {textContent}
//                 </pre>
//               )}

//               {/* If it's an image => <img> with scaled width */}
//               {previewUrl && docFile?.type?.startsWith("image/") && !textContent && (
//                 <img
//                   src={previewUrl}
//                   alt="Preview"
//                   style={{
//                     transform: `scale(${zoom})`,
//                     transformOrigin: "top left",
//                     maxWidth: "100%",
//                     maxHeight: "auto",
//                     display: "block",
//                   }}
//                 />
//               )}

//               {/* If it's a PDF => <iframe> with transform */}
//               {previewUrl && docFile?.type === "application/pdf" && (
//                 <div
//                   style={{
//                     transform: `scale(${zoom})`,
//                     transformOrigin: "top left",
//                     width: `${100 / zoom}%`,
//                     height: `${100 / zoom}%`,
//                   }}
//                 >
//                   <iframe
//                     src={previewUrl}
//                     title="File Preview"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       backgroundColor: "#fff",
//                       border: "none",
//                     }}
//                   />
//                 </div>
//               )}

//               {/* Fallback => treat it like PDF in an iframe */}
//               {previewUrl &&
//                 !docFile?.type?.startsWith("image/") &&
//                 docFile?.type !== "application/pdf" &&
//                 !textContent && (
//                   <div
//                     style={{
//                       transform: `scale(${zoom})`,
//                       transformOrigin: "top left",
//                       width: `${100 / zoom}%`,
//                       height: `${100 / zoom}%`,
//                     }}
//                   >
//                     <iframe
//                       src={previewUrl}
//                       title="File Preview"
//                       style={{
//                         width: "100%",
//                         height: "100%",
//                         backgroundColor: "#fff",
//                         border: "none",
//                       }}
//                     />
//                   </div>
//               )}
//             </div>

//             <div className="modal-buttons" style={{ marginTop: "1rem" }}>
//               {/* Only show "Add" (upload) button if we have a docFile in memory */}
//               {docFile && (
//                 <button className="add-btn" onClick={handleUploadDocument}>
//                   Add
//                 </button>
//               )}
//               <button className="cancel-btn" onClick={() => resetPreviewState()}>
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Documents;


import React, { useState, useEffect } from "react";
import flaskApi from "../api"; // Axios instance with JWT auto-attachment
import "./upload.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Documents = () => {
  // State variables for documents, modals, etc.
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [zoom, setZoom] = useState(1);

  // New state to hold patients list and selected patient
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
    fetchPatients(); // Fetch patients list when component mounts
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await flaskApi.get("/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // Fetch patients from your backend
  const fetchPatients = async () => {
    try {
      const response = await flaskApi.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Modal control functions
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    resetPreviewState();
    setDocName("");
    setDocType("");
    setDocFile(null);
    setSelectedPatient(""); // Reset selection
  };

  // File handling and preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFile(file);
    handlePreview(file);
  };

  const handlePreview = (file) => {
    setZoom(1);
    setPreviewUrl(null);
    setTextContent("");

    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewModal(true);
      return;
    }
    if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTextContent(event.target.result);
        setPreviewModal(true);
      };
      reader.readAsText(file);
      return;
    }
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewModal(true);
      return;
    }
    const fallbackUrl = URL.createObjectURL(file);
    setPreviewUrl(fallbackUrl);
    setPreviewModal(true);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => prev + 0.1);
  const handleZoomOut = () => setZoom((prev) => Math.max(0.1, prev - 0.1));
  const resetPreviewState = () => {
    setPreviewModal(false);
    setPreviewUrl(null);
    setTextContent("");
    setZoom(1);
  };

  // Upload document function
  const handleUploadDocument = async () => {
    if (!docName || !docType || !docFile) {
      alert("Please enter a name, type, and choose a file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", docFile);
      formData.append("docName", docName);
      formData.append("docType", docType);
      // Append selected patient id (if any)
      formData.append("patientId", selectedPatient);

      await flaskApi.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully");
      fetchDocuments();     // Refresh document list
      resetPreviewState();
      setShowModal(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed");
    }
  };

  // View document function remains the same
  const handleViewDocument = async (doc) => {
    try {
      const response = await flaskApi.get(
        `/files/${encodeURIComponent(doc.fileName)}`,
        { responseType: "blob" }
      );
      const contentType = response.headers["content-type"] || "application/octet-stream";
      const fetchedFile = new File([response.data], doc.fileName, { type: contentType });
      handlePreview(fetchedFile);
    } catch (error) {
      console.error("Error fetching file:", error);
      alert("Could not retrieve file.");
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        

        {/* Document Interface */}
        <section className="chat-section">
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
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => (
                    <tr key={doc.id}>
                      <td><input type="checkbox" /></td>
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
          <button className="upload-button" onClick={handleOpenModal}>
            Upload Document
          </button>
        </section>
      </main>

      {/* Upload Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Upload Document</h2>
            <label>Document Name</label>
            <input
              type="text"
              placeholder="Document Name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
            <label>Document Type</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)}>
              <option value="">Select Type</option>
              <option value="Prescription">Prescription</option>
              <option value="Intake Form">Intake Form</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Ultrasound">Ultrasound</option>
            </select>
            {/* New dropdown for assigning document to a patient */}
            <label>Assign To</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Administrative</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} ({patient.email})
                </option>
              ))}
            </select>
            <label>Select file</label>
            <input type="file" onChange={handleFileChange} />
            <div className="modal-buttons">
              <button className="add-btn" onClick={handleUploadDocument}>
                Add
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              width: "90vw",
              height: "90vh",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2>Document Preview</h2>
            <div style={{ marginBottom: "1rem" }}>
              <button onClick={handleZoomOut} style={{ marginRight: "0.5rem" }}>
                Zoom Out
              </button>
              <button onClick={handleZoomIn}>Zoom In</button>
              <span style={{ marginLeft: "1rem" }}>
                Current Zoom: {Math.round(zoom * 100)}%
              </span>
            </div>
            <div
              style={{
                flex: 1,
                overflow: "auto",
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #000",
                padding: "1rem",
                position: "relative",
              }}
            >
              {textContent && (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    color: "#000",
                    backgroundColor: "#fff",
                    fontSize: `${14 * zoom}px`,
                    transformOrigin: "top left",
                  }}
                >
                  {textContent}
                </pre>
              )}
              {previewUrl && docFile?.type?.startsWith("image/") && !textContent && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    maxWidth: "100%",
                    maxHeight: "auto",
                    display: "block",
                  }}
                />
              )}
              {previewUrl && docFile?.type === "application/pdf" && (
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`,
                  }}
                >
                  <iframe
                    src={previewUrl}
                    title="File Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#fff",
                      border: "none",
                    }}
                  />
                </div>
              )}
              {previewUrl &&
                !docFile?.type?.startsWith("image/") &&
                docFile?.type !== "application/pdf" &&
                !textContent && (
                  <div
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      width: `${100 / zoom}%`,
                      height: `${100 / zoom}%`,
                    }}
                  >
                    <iframe
                      src={previewUrl}
                      title="File Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff",
                        border: "none",
                      }}
                    />
                  </div>
              )}
            </div>
            <div className="modal-buttons" style={{ marginTop: "1rem" }}>
              {docFile && (
                <button className="add-btn" onClick={handleUploadDocument}>
                  Add
                </button>
              )}
              <button className="cancel-btn" onClick={() => resetPreviewState()}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;

