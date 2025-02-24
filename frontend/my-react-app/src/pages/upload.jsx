// import React, { useState } from "react";
// //import React, { useState } from 'react';
// import axios from 'axios';
// import "./upload.css";  // See CSS below
// import logo from "../assets/logo.png"; // Adjust path to your logo

// const Documents = () => {
//   // Start with an empty list of documents
//   const [documents, setDocuments] = useState([]);

//   // Modal visibility
//   const [showModal, setShowModal] = useState(false);

//   // Form fields for new document
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // Open/Close the modal
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     // Reset form fields
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//   };

//   // Handle file input
//   const handleFileChange = (e) => {
//     if (e.target.files?.[0]) {
//       setDocFile(e.target.files[0]);
//     }
//   };

//   // Add the new document to the table
//   const handleAddDocument = () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }
//     const newDoc = {
//       id: Date.now(),
//       name: docName,
//       type: docType,
//     };
//     setDocuments([...documents, newDoc]);
//     handleCloseModal(); // close modal + reset fields
//   };

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Patients</li>
//             <li>Schedule</li>
//             <li>MedAssistant</li>
//             <li>Personal Profile</li> {/* New Button */}
//             <li>Settings</li> {/* Settings Button */}
//             <li>Logout</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         {/* Top Bar */}
//         <header className="top-bar">
//           <input
//             type="text"
//             placeholder="Search for anything..."
//             className="search-bar"
//           />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Forms</button>

//             <button className="Doc">Document Upload</button>
//             <button>To-Do</button>
//           </div>
//         </header>

//       {/* === MAIN CONTENT WRAPPER === */}
//       <div className="main-content">
//         {/* CONTENT AREA */}
//         <div className="content-area">
//           {/* Heading row */}
//           <div className="documents-header">
//             <h2>Medical Documents</h2>
//             <button className="upload-button" onClick={handleOpenModal}>
//               Upload Document
//             </button>
//           </div>

//           {/* TABLE */}
//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Name</th>
//                   <th>Type</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {documents.length === 0 ? (
//                   /* If no docs, show a single row that says "No documents found" */
//                   <tr>
//                     <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
//                       No documents found.
//                     </td>
//                   </tr>
//                 ) : (
//                   documents.map((doc) => (
//                     <tr key={doc.id}>
//                       <td>
//                         <input type="checkbox" />
//                       </td>
//                       <td>{doc.name}</td>
//                       <td>{doc.type}</td>
//                       <td>
//                         <button className="view-btn">View</button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       </main>

//       {/* === MODAL OVERLAY === */}
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
//               <button className="add-btn" onClick={handleAddDocument}>
//                 Add
//               </button>
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Documents;










// import React, { useState } from "react";
// import axios from 'axios';
// import "./upload.css"; 
// import logo from "../assets/logo.png"; 

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');

//   // Open/Close modal
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//   };

//   // Handle file input
//   const handleFileChange = (e) => {
//     if (e.target.files?.[0]) {
//       setDocFile(e.target.files[0]);
//     }
//   };

//   // Upload document to Flask backend
//   const handleUpload = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }
    
//     const formData = new FormData();
//     formData.append('file', docFile);
    
//     try {
//       const response = await axios.post('http://localhost:5001/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log(response.data);
//       alert('File uploaded successfully');
      
//       const newDoc = {
//         id: Date.now(),
//         name: docName,
//         type: docType,
//       };
//       setDocuments([...documents, newDoc]);
//       handleCloseModal();
//     } catch (error) {
//       console.error(error);
//       alert('File upload failed');
//     }
//   };

//   // Handle question submission to backend
//   const handleQuery = async () => {
//     try {
//       const response = await axios.post('http://localhost:5001/query', {
//         question: question,
//       });
//       setAnswer(response.data.answer);
//     } catch (error) {
//       console.error(error);
//       alert('Query failed');
//     }
//   };

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Patients</li>
//             <li>Schedule</li>
//             <li>MedAssistant</li>
//             <li>Personal Profile</li>
//             <li>Settings</li>
//             <li>Logout</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         <header className="top-bar">
//           <input
//             type="text"
//             placeholder="Search for anything..."
//             className="search-bar"
//           />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Forms</button>
//             <button className="Doc">Document Upload</button>
//             <button>To-Do</button>
//           </div>
//         </header>

//         <div className="main-content">
//           <div className="documents-header">
//             <h2>Medical Documents</h2>
//             <button className="upload-button" onClick={handleOpenModal}>
//               Upload Document
//             </button>
//           </div>

//           <div className="table-container">
//             <table>
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Name</th>
//                   <th>Type</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {documents.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
//                       No documents found.
//                     </td>
//                   </tr>
//                 ) : (
//                   documents.map((doc) => (
//                     <tr key={doc.id}>
//                       <td>
//                         <input type="checkbox" />
//                       </td>
//                       <td>{doc.name}</td>
//                       <td>{doc.type}</td>
//                       <td>
//                         <button className="view-btn">View</button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div>
//             <h2>Ask a Question</h2>
//             <input 
//               type="text" 
//               value={question} 
//               onChange={(e) => setQuestion(e.target.value)} 
//               placeholder="Enter your question" 
//             />
//             <button onClick={handleQuery}>Submit</button>
//             {answer && <p>Answer: {answer}</p>}
//           </div>
//         </div>
//       </main>

//       {/* Modal Overlay */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>

//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="Document Name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />

//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>

//             <label>Select file</label>
//             <input type="file" onChange={handleFileChange} />

//             <div className="modal-buttons">
//               <button className="add-btn" onClick={handleUpload}>
//                 Add
//               </button>
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Documents;
//VERSION 3 FOR DOCUMENT PREVIEW:
// import React, { useState } from "react";
// import axios from 'axios';
// import "./upload.css";
// import logo from "../assets/logo.png";

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [previewModal, setPreviewModal] = useState(false);
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // We'll store raw text for text-based files in this state
//   const [textContent, setTextContent] = useState("");
//   // For PDF or other types (like images), we store an object URL
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//     setPreviewUrl(null);
//     setTextContent("");
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setDocFile(file);

//     // Check the MIME type
//     if (file.type === "application/pdf") {
//       // For PDFs, just create an object URL
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setTextContent(""); // No text reading for PDFs
//       setPreviewModal(true);

//     } else if (file.type.startsWith("text/")) {
//       // For text-based files, read them with FileReader
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setTextContent(event.target.result);
//         setPreviewUrl(""); // Not using an iframe for text
//         setPreviewModal(true);
//       };
//       reader.readAsText(file);

//     } else {
//       // For other types (images, etc.), show an iframe or an <img> if you prefer
//       // Here we use an iframe for consistency, but for images you might do <img>.
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setTextContent("");
//       setPreviewModal(true);
//     }
//   };

//   const handleUploadDocument = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', docFile);

//     try {
//       const response = await axios.post('http://localhost:5001/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       console.log('Upload response:', response.data);
//       alert('File uploaded successfully');

//       const newDoc = {
//         id: Date.now(),
//         name: docName,
//         type: docType,
//       };
//       setDocuments([...documents, newDoc]);
//       setPreviewModal(false);
//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('File upload failed');
//     }
//   };

//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//       </aside>

//       <main className="content">
//         <div className="documents-header">
//           <h2>Medical Documents</h2>
//           <button className="upload-button" onClick={handleOpenModal}>
//             Upload Document
//           </button>
//         </div>

//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Name</th>
//                 <th>Type</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
//                     No documents found.
//                   </td>
//                 </tr>
//               ) : (
//                 documents.map((doc) => (
//                   <tr key={doc.id}>
//                     <td>
//                       <input type="checkbox" />
//                     </td>
//                     <td>{doc.name}</td>
//                     <td>{doc.type}</td>
//                     <td>
//                       <button className="view-btn">View</button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* Upload Modal */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>

//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="Document Name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />

//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>

//             <label>Select File</label>
//             <input type="file" onChange={handleFileChange} />

//             <div className="modal-buttons">
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Preview Modal */}
//       {previewModal && (
//         <div className="modal-overlay">
//           <div
//             className="modal-content"
//             style={{
//               maxWidth: '90vw',
//               maxHeight: '90vh',
//               width: '90vw',
//               height: '90vh',
//               backgroundColor: '#fff',
//               display: 'flex',
//               flexDirection: 'column',
//             }}
//           >
//             <h2>Document Preview</h2>

//             {/* Preview Area */}
//             <div
//               style={{
//                 flex: 1,
//                 overflow: 'auto',
//                 backgroundColor: '#fff',
//                 color: '#000',
//                 border: '1px solid #000',
//                 padding: '1rem',
//               }}
//             >
//               {/* If it's a PDF or image or other, we show an iframe */}
//               {previewUrl && !textContent && (
//                 <iframe
//                   src={previewUrl}
//                   title="File Preview"
//                   style={{ width: '100%', height: '100%', backgroundColor: '#fff', color: '#000' }}
//                 />
//               )}

//               {/* If it's text-based, we show the text in a <pre> */}
//               {textContent && (
//                 <pre
//                   style={{
//                     whiteSpace: 'pre-wrap',
//                     wordWrap: 'break-word',
//                     color: '#000',
//                     backgroundColor: '#fff',
//                     fontSize: '14px',
//                   }}
//                 >
//                   {textContent}
//                 </pre>
//               )}
//             </div>

//             <div className="modal-buttons" style={{ marginTop: '1rem' }}>
//               <button className="add-btn" onClick={handleUploadDocument}>
//                 Upload
//               </button>
//               <button className="cancel-btn" onClick={() => setPreviewModal(false)}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Documents;
//Version 4: trying to get upload button to work : 


// import React, { useState } from "react";
// import axios from "axios";
// import "./upload.css";
// import logo from "../assets/logo.png";

// const Documents = () => {
//   // Documents table
//   const [documents, setDocuments] = useState([]);

//   // Modal toggles
//   const [showModal, setShowModal] = useState(false);      // For "Upload Document" form
//   const [previewModal, setPreviewModal] = useState(false); // For previewing files

//   // Form data for uploading
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // Preview data
//   const [previewUrl, setPreviewUrl] = useState(null); // For PDFs, images, etc. (iframe)
//   const [textContent, setTextContent] = useState("");  // For text-based files

//   // ==============================
//   // UPLOAD MODAL
//   // ==============================
//   const handleOpenModal = () => setShowModal(true);

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//     setPreviewUrl(null);
//     setTextContent("");
//   };

//   // Handle user picking a file from <input type="file" />
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setDocFile(file);
//     // Immediately show preview
//     handlePreview(file);
//   };

//   // ==============================
//   // PREVIEW LOGIC (PDF, TEXT, etc.)
//   // ==============================
//   const handlePreview = (file) => {
//     // Reset old preview states
//     setPreviewUrl(null);
//     setTextContent("");

//     // If PDF
//     if (file.type === "application/pdf") {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }

//     // If text-based (txt, c, cpp, etc.)
//     if (file.type.startsWith("text/")) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setTextContent(event.target.result);
//         setPreviewModal(true);
//       };
//       reader.readAsText(file);
//       return;
//     }

//     // Otherwise (images, etc.), show in iframe
//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//     setPreviewModal(true);
//   };

//   // ==============================
//   // UPLOAD THE FILE TO BACKEND
//   // ==============================
//   const handleUploadDocument = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", docFile);

//     try {
//       const response = await axios.post("http://localhost:5001/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       console.log("Upload response:", response.data);
//       alert("File uploaded successfully");

//       // Add the new doc to our table
//       setDocuments([...documents, { id: Date.now(), name: docName, type: docType }]);

//       // Close preview modal
//       setPreviewModal(false);
//       // Also close upload modal if you want
//       setShowModal(false);

//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("File upload failed");
//     }
//   };

//   // ==============================
//   // VIEWING A DOCUMENT FROM THE TABLE
//   // ==============================
//   const handleViewDocument = (doc) => {
//     // 1) In a real app, you'd fetch the actual file from the server by doc name or ID.
//     // 2) Then you'd call handlePreview(fetchedFile).
//     // For now, we show a "placeholder" text file so the preview can open.

//     // Example: if doc.type === 'Blood Test' and doc.name is 'myFile.pdf',
//     // you'd do an axios GET to your server: /files/myFile.pdf
//     // Then create a Blob or object URL from the response.

//     // Mocking a text-based file:
//     const mockFileContent = `Placeholder preview for: ${doc.name}\nType: ${doc.type}\n(Implement real file retrieval here)`;

//     // Create a text file "on the fly"
//     const fileBlob = new Blob([mockFileContent], { type: "text/plain" });
//     const file = new File([fileBlob], doc.name, { type: "text/plain" });
//     handlePreview(file);
//   };

//   // ==============================
//   // RENDER
//   // ==============================
//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         <div className="documents-header">
//           <h2>Medical Documents</h2>
//           <button className="upload-button" onClick={handleOpenModal}>
//             Upload Document
//           </button>
//         </div>

//         {/* Documents Table */}
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Name</th>
//                 <th>Type</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
//                     No documents found.
//                   </td>
//                 </tr>
//               ) : (
//                 documents.map((doc) => (
//                   <tr key={doc.id}>
//                     <td>
//                       <input type="checkbox" />
//                     </td>
//                     <td>{doc.name}</td>
//                     <td>{doc.type}</td>
//                     <td>
//                       <button className="view-btn" onClick={() => handleViewDocument(doc)}>
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* ============ UPLOAD MODAL ============ */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>

//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="Document Name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />

//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>

//             <label>Select File</label>
//             <input type="file" onChange={handleFileChange} />

//             <div className="modal-buttons">
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ PREVIEW MODAL (FOR BOTH UPLOAD & VIEW) ============ */}
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

//             {/* Preview Area */}
//             <div
//               style={{
//                 flex: 1,
//                 overflow: "auto",
//                 backgroundColor: "#fff",
//                 color: "#000",
//                 border: "1px solid #000",
//                 padding: "1rem",
//               }}
//             >
//               {/* PDF or Image or other => iFrame */}
//               {previewUrl && !textContent && (
//                 <iframe
//                   src={previewUrl}
//                   title="File Preview"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "#fff",
//                     color: "#000",
//                   }}
//                 />
//               )}

//               {/* Text-based => <pre> */}
//               {textContent && (
//                 <pre
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     wordWrap: "break-word",
//                     color: "#000",
//                     backgroundColor: "#fff",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {textContent}
//                 </pre>
//               )}
//             </div>

//             {/* Bottom Buttons */}
//             <div className="modal-buttons" style={{ marginTop: "1rem" }}>
//               {docFile && (
//                 <button className="add-btn" onClick={handleUploadDocument}>
//                   Upload
//                 </button>
//               )}
//               <button className="cancel-btn" onClick={() => setPreviewModal(false)}>
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


//VERSION 6: TRYING TO GET THE VIEW BUTTON TO WORK 
// import React, { useState } from "react";
// import axios from "axios";
// import "./upload.css";
// import logo from "../assets/logo.png";

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [previewModal, setPreviewModal] = useState(false);

//   // Form fields
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // Preview data
//   const [previewUrl, setPreviewUrl] = useState(null); // for PDFs/images
//   const [textContent, setTextContent] = useState("");  // for text-based

//   // ========== 1) OPEN/CLOSE UPLOAD MODAL ==========
//   const handleOpenModal = () => setShowModal(true);

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//     setPreviewUrl(null);
//     setTextContent("");
//   };

//   // ========== 2) FILE PICK + IMMEDIATE PREVIEW ==========
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setDocFile(file);
//     handlePreview(file);
//   };

//   const handlePreview = (file) => {
//     // Clear old states
//     setPreviewUrl(null);
//     setTextContent("");

//     if (file.type === "application/pdf") {
//       // PDF => iframe
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }

//     if (file.type.startsWith("text/")) {
//       // text => read with FileReader
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setTextContent(event.target.result);
//         setPreviewModal(true);
//       };
//       reader.readAsText(file);
//       return;
//     }

//     // Otherwise (image, doc, etc.)
//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//     setPreviewModal(true);
//   };

//   // ========== 3) UPLOAD FILE TO BACKEND ==========
//   const handleUploadDocument = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", docFile);

//     try {
//       await axios.post("http://localhost:5001/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("File uploaded successfully");

//       // Save actual filename + user-chosen docName
//       const newDoc = {
//         id: Date.now(),
//         userTitle: docName,    // user-chosen name
//         type: docType,
//         fileName: docFile.name // actual file saved on disk
//       };
//       setDocuments([...documents, newDoc]);

//       setPreviewModal(false);
//       setShowModal(false);

//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("File upload failed");
//     }
//   };

//   // ========== 4) VIEW FILE FROM TABLE ==========
//   const handleViewDocument = async (doc) => {
//     try {
//       // GET /files/<filename> from server
//       const response = await axios.get(
//         `http://localhost:5001/files/${encodeURIComponent(doc.fileName)}`,
//         { responseType: "blob" }
//       );
//       const contentType = response.headers["content-type"] || "application/octet-stream";

//       // Convert blob -> File
//       const fetchedFile = new File([response.data], doc.fileName, { type: contentType });

//       // Now we can preview it
//       handlePreview(fetchedFile);

//     } catch (error) {
//       console.error("Error fetching file:", error);
//       alert("Could not retrieve file.");
//     }
//   };

//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//       </aside>

//       <main className="content">
//         <div className="documents-header">
//           <h2>Medical Documents</h2>
//           <button className="upload-button" onClick={handleOpenModal}>
//             Upload Document
//           </button>
//         </div>

//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>Name (User Title)</th>
//                 <th>Type</th>
//                 <th>FileName (Saved on Disk)</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
//                     No documents found.
//                   </td>
//                 </tr>
//               ) : (
//                 documents.map((doc) => (
//                   <tr key={doc.id}>
//                     <td><input type="checkbox" /></td>
//                     <td>{doc.userTitle}</td>
//                     <td>{doc.type}</td>
//                     <td>{doc.fileName}</td>
//                     <td>
//                       <button className="view-btn" onClick={() => handleViewDocument(doc)}>
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* Upload Modal */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>

//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="User-friendly name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />

//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>

//             <label>Select File</label>
//             <input type="file" onChange={handleFileChange} />

//             <div className="modal-buttons">
//               <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Preview Modal */}
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

//             <div
//               style={{
//                 flex: 1,
//                 overflow: "auto",
//                 backgroundColor: "#fff",
//                 color: "#000",
//                 border: "1px solid #000",
//                 padding: "1rem",
//               }}
//             >
//               {/* If PDF/Image => iframe */}
//               {previewUrl && !textContent && (
//                 <iframe
//                   src={previewUrl}
//                   title="File Preview"
//                   style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
//                 />
//               )}
//               {/* If text => <pre> */}
//               {textContent && (
//                 <pre
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     wordWrap: "break-word",
//                     color: "#000",
//                     backgroundColor: "#fff",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {textContent}
//                 </pre>
//               )}
//             </div>

//             <div className="modal-buttons" style={{ marginTop: "1rem" }}>
//               {docFile && (
//                 <button className="add-btn" onClick={handleUploadDocument}>
//                   Upload
//                 </button>
//               )}
//               <button className="cancel-btn" onClick={() => setPreviewModal(false)}>
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


//VERSION 7: PERSISTANT STORAGE IMPLEMENTATION: 



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./upload.css";
// import logo from "../assets/logo.png";

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false);      // For upload form
//   const [previewModal, setPreviewModal] = useState(false); // For file preview

//   // Form fields for upload
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // Preview data
//   const [previewUrl, setPreviewUrl] = useState(null); // For PDFs/images (iframe)
//   const [textContent, setTextContent] = useState("");  // For text-based files

//   // On mount, fetch persistent document list from backend
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

//   // ==============================
//   // UPLOAD MODAL HANDLERS
//   // ==============================
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//     setPreviewUrl(null);
//     setTextContent("");
//   };

//   // ==============================
//   // FILE PICK & PREVIEW
//   // ==============================
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setDocFile(file);
//     handlePreview(file);
//   };

//   const handlePreview = (file) => {
//     // Clear previous preview
//     setPreviewUrl(null);
//     setTextContent("");

//     if (file.type === "application/pdf") {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }
//     if (file.type.startsWith("text/")) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setTextContent(event.target.result);
//         setPreviewModal(true);
//       };
//       reader.readAsText(file);
//       return;
//     }
//     // For images and other types, show in an iframe
//     const url = URL.createObjectURL(file);
//     setPreviewUrl(url);
//     setPreviewModal(true);
//   };

//   // ==============================
//   // UPLOAD FILE TO BACKEND
//   // ==============================
//   const handleUploadDocument = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", docFile);
//     formData.append("docName", docName);
//     formData.append("docType", docType);

//     try {
//       await axios.post("http://localhost:5001/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("File uploaded successfully");
//       // Refresh document list from backend
//       fetchDocuments();
//       setPreviewModal(false);
//       setShowModal(false);
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("File upload failed");
//     }
//   };

//   // ==============================
//   // VIEW DOCUMENT FROM THE TABLE
//   // ==============================
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

//   // ==============================
//   // RENDER
//   // ==============================
//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         <div className="documents-header">
//           <h2>Medical Documents</h2>
//           <button className="upload-button" onClick={handleOpenModal}>
//             Upload Document
//           </button>
//         </div>

//         {/* Documents Table */}
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>User Title</th>
//                 <th>Type</th>
//                 <th>Filename</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
//                     No documents found.
//                   </td>
//                 </tr>
//               ) : (
//                 documents.map((doc) => (
//                   <tr key={doc.id}>
//                     <td><input type="checkbox" /></td>
//                     <td>{doc.userTitle}</td>
//                     <td>{doc.type}</td>
//                     <td>{doc.fileName}</td>
//                     <td>
//                       <button className="view-btn" onClick={() => handleViewDocument(doc)}>
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* UPLOAD MODAL */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>
//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="User-friendly name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />
//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>
//             <label>Select File</label>
//             <input type="file" onChange={handleFileChange} />
//             <div className="modal-buttons">
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PREVIEW MODAL */}
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
//             <div
//               style={{
//                 flex: 1,
//                 overflow: "auto",
//                 backgroundColor: "#fff",
//                 color: "#000",
//                 border: "1px solid #000",
//                 padding: "1rem",
//               }}
//             >
//               {previewUrl && !textContent && (
//                 <iframe
//                   src={previewUrl}
//                   title="File Preview"
//                   style={{
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "#fff",
//                   }}
//                 />
//               )}
//               {textContent && (
//                 <pre
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     wordWrap: "break-word",
//                     color: "#000",
//                     backgroundColor: "#fff",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {textContent}
//                 </pre>
//               )}
//             </div>
//             <div className="modal-buttons" style={{ marginTop: "1rem" }}>
//               {docFile && (
//                 <button className="add-btn" onClick={handleUploadDocument}>
//                   Upload
//                 </button>
//               )}
//               <button className="cancel-btn" onClick={() => setPreviewModal(false)}>
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


//VERSION 9: ZOOM/OUT FEATURE: 


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./upload.css";
// import logo from "../assets/logo.png";

// const Documents = () => {
//   const [documents, setDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false);      // For upload form
//   const [previewModal, setPreviewModal] = useState(false); // For file preview

//   // Form fields for upload
//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   // Preview data
//   const [previewUrl, setPreviewUrl] = useState(null); // For PDFs/images (iframe)
//   const [textContent, setTextContent] = useState("");  // For text-based files

//   // Zoom state
//   const [zoom, setZoom] = useState(1);

//   // On mount, fetch persistent document list from backend
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

//   // ==============================
//   // UPLOAD MODAL
//   // ==============================
//   const handleOpenModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     resetPreviewState();
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//   };

//   // ==============================
//   // FILE PICK & PREVIEW
//   // ==============================
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setDocFile(file);
//     handlePreview(file);
//   };

//   const handlePreview = (file) => {
//     // Reset zoom and old states
//     setZoom(1);
//     setPreviewUrl(null);
//     setTextContent("");

//     // If PDF
//     if (file.type === "application/pdf") {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }

//     // If text-based (e.g. .txt, .c, .cpp)
//     if (file.type.startsWith("text/")) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setTextContent(event.target.result);
//         setPreviewModal(true);
//       };
//       reader.readAsText(file);
//       return;
//     }

//     // Otherwise (images, etc.), show in an iframe or <img>
//     // We'll check if it's an image by file.type.startsWith("image/")
//     if (file.type.startsWith("image/")) {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }

//     // Fallback: treat it like a PDF/other in an iframe
//     const fallbackUrl = URL.createObjectURL(file);
//     setPreviewUrl(fallbackUrl);
//     setPreviewModal(true);
//   };

//   // ==============================
//   // ZOOM CONTROLS
//   // ==============================
//   const handleZoomIn = () => {
//     setZoom((prev) => prev + 0.1);
//   };
//   const handleZoomOut = () => {
//     setZoom((prev) => Math.max(0.1, prev - 0.1));
//   };
//   const resetPreviewState = () => {
//     setPreviewModal(false);
//     setPreviewUrl(null);
//     setTextContent("");
//     setZoom(1);
//   };

//   // ==============================
//   // UPLOAD FILE TO BACKEND
//   // ==============================
//   const handleUploadDocument = async () => {
//     if (!docName || !docType || !docFile) {
//       alert("Please enter a name, type, and choose a file.");
//       return;
//     }
//     const formData = new FormData();
//     formData.append("file", docFile);
//     formData.append("docName", docName);
//     formData.append("docType", docType);

//     try {
//       await axios.post("http://localhost:5001/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("File uploaded successfully");
//       // Refresh document list from backend
//       fetchDocuments();
//       resetPreviewState();
//       setShowModal(false);
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("File upload failed");
//     }
//   };

//   // ==============================
//   // VIEW DOCUMENT FROM THE TABLE
//   // ==============================
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

//   // ==============================
//   // RENDER
//   // ==============================
//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         <div className="documents-header">
//           <h2>Medical Documents</h2>
//           <button className="upload-button" onClick={handleOpenModal}>
//             Upload Document
//           </button>
//         </div>

//         {/* Documents Table */}
//         <div className="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th></th>
//                 <th>User Title</th>
//                 <th>Type</th>
//                 <th>Filename</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {documents.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
//                     No documents found.
//                   </td>
//                 </tr>
//               ) : (
//                 documents.map((doc) => (
//                   <tr key={doc.id}>
//                     <td>
//                       <input type="checkbox" />
//                     </td>
//                     <td>{doc.userTitle}</td>
//                     <td>{doc.type}</td>
//                     <td>{doc.fileName}</td>
//                     <td>
//                       <button className="view-btn" onClick={() => handleViewDocument(doc)}>
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </main>

//       {/* UPLOAD MODAL */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h2>Upload Document</h2>

//             <label>Document Name</label>
//             <input
//               type="text"
//               placeholder="User-friendly name"
//               value={docName}
//               onChange={(e) => setDocName(e.target.value)}
//             />
//             <label>Document Type</label>
//             <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//               <option value="">Select Type</option>
//               <option value="Prescription">Prescription</option>
//               <option value="Intake Form">Intake Form</option>
//               <option value="Blood Test">Blood Test</option>
//               <option value="Ultrasound">Ultrasound</option>
//             </select>
//             <label>Select File</label>
//             <input type="file" onChange={handleFileChange} />
//             <div className="modal-buttons">
//               <button className="cancel-btn" onClick={handleCloseModal}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* PREVIEW MODAL (with Zoom) */}
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
//               <button onClick={handleZoomIn}>
//                 Zoom In
//               </button>
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

//               {/* If it's a PDF or other => <iframe> with transform */}
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

//               {/* For fallback: If it's not text, not an image, not pdf, treat like PDF */}
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
//               {docFile && (
//                 <button className="add-btn" onClick={handleUploadDocument}>
//                   Upload
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



//VERSION 10: ALL FIXED UP 



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./upload.css";   // or "./DocUpload.css" - ensure your old CSS classes are here
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
//       {/* === SIDEBAR === */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Patients</li>
//             <li>Schedule</li>
//             <li>MedAssistant</li>
//             <li>Personal Profile</li>
//             <li>Settings</li>
//             <li>Logout</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* === MAIN CONTENT === */}
//       <main className="content">
//         {/* TOP BAR */}
//         <header className="top-bar">
//           <input
//             type="text"
//             placeholder="Search for anything..."
//             className="search-bar"
//           />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Forms</button>
//             <button className="Doc">Document Upload</button>
//             <button>To-Do</button>
//           </div>
//         </header>

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



//VERSION 10.2: ALL FIXED UP ATTEMPT 2: 

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./upload.css";
import logo from "../assets/logo.png";

const Documents = () => {
  // Documents from server
  const [documents, setDocuments] = useState([]);

  // Modals
  const [showModal, setShowModal] = useState(false); // Upload form modal
  const [previewModal, setPreviewModal] = useState(false); // File preview modal

  // Form fields for upload
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);

  // Preview data
  const [previewUrl, setPreviewUrl] = useState(null); // For PDFs/images
  const [textContent, setTextContent] = useState("");  // For text-based files

  // Zoom
  const [zoom, setZoom] = useState(1);

  // ========== Fetch Documents on Page Load ==========
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5001/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  // ========== Upload Modal Logic ==========
  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
    resetPreviewState();
    setDocName("");
    setDocType("");
    setDocFile(null);
  };

  // ========== File Selection & Preview ==========
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocFile(file);
    handlePreview(file);
  };

  const handlePreview = (file) => {
    // Reset old states
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
    // Fallback => treat like PDF in iframe
    const fallbackUrl = URL.createObjectURL(file);
    setPreviewUrl(fallbackUrl);
    setPreviewModal(true);
  };

  // ========== Zoom Controls ==========
  const handleZoomIn = () => setZoom((prev) => prev + 0.1);
  const handleZoomOut = () => setZoom((prev) => Math.max(0.1, prev - 0.1));

  const resetPreviewState = () => {
    setPreviewModal(false);
    setPreviewUrl(null);
    setTextContent("");
    setZoom(1);
  };

  // ========== Upload to Backend ==========
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

      await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully");
      fetchDocuments(); // Refresh table
      resetPreviewState();
      setShowModal(false); // Close upload modal
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed");
    }
  };

  // ========== View Document from Table ==========
  const handleViewDocument = async (doc) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/files/${encodeURIComponent(doc.fileName)}`,
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

  // ========== Render ==========
  return (
    <div className="dashboard">
      {/* === SIDEBAR === */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Patients</li>
            <li>Schedule</li>
            <li>MedAssistant</li>
            <li>Personal Profile</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="content">
        {/* SINGLE TOP-BAR DEFINITION => no margin at top */}
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

        <div className="main-content">
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
        </div>
      </main>

      {/* === UPLOAD MODAL === */}
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

      {/* === PREVIEW MODAL (with Zoom) === */}
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

            {/* Zoom Controls */}
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
              {/* If it's text => <pre> with bigger font */}
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

              {/* If it's an image => <img> with scaled width */}
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

              {/* If it's a PDF => <iframe> with transform */}
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

              {/* Fallback => treat it like PDF in an iframe */}
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
