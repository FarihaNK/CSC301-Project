// import React, { useState, useEffect, useRef } from "react";
// import "./ChatbotInterface.css";
// import logo from "../assets/logo.png";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatContainerRef = useRef(null);

//   const handleSendMessage = () => {
//     if (input.trim() === "") return;
    
//     const newMessages = [...messages, { type: "question", text: input }, { type: "answer", text: "Answer..." }];
//     setMessages(newMessages);
//     setInput("");
//   };

//   // Auto-scroll when messages change
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Medical History</li>
//             <li>MedAssistant</li>
//             <li>Appointments</li>
//             <li>Add Patient Profile</li>
//             <li>Settings</li>
//             <li>Logout</li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="content">
//         {/* Top Bar */}
//         <header className="top-bar">
//           <input type="text" placeholder="Search for anything..." className="search-bar" />
//           <div className="navigation">
//             <button>Dashboard</button>
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header>

//         {/* Chat Interface */}
//         <section className="chat-section">
//           <div className="chat-container">
//             {messages.map((msg, index) => (
//               <div key={index} className={msg.type === "question" ? "question" : "answer"}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <div className="chat-input-container">
//             <input
//               type="text"
//               placeholder="Ask your Medical Assistant..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             />
//             <button onClick={handleSendMessage}>Send</button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ChatbotInterface;


//VERSION 1.1: ATTEMPT TO INTEGRATE RAG QUERY BACKEND: 


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./ChatbotInterface.css";
// import logo from "../assets/logo.png";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatContainerRef = useRef(null);

//   // Send message and call the RAG query endpoint
//   const handleSendMessage = async () => {
//     if (input.trim() === "") return;
    
//     // Add the user's question to messages
//     const newMessages = [...messages, { type: "question", text: input }];
//     setMessages(newMessages);

//     try {
//       // Post the question to your backend
//       const response = await axios.post("http://localhost:5001/query", {
//         question: input
//       });
//       // Assume the response contains { answer: "..." }
//       const answer = response.data.answer;
//       // Append the answer to messages
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { type: "answer", text: answer }
//       ]);
//     } catch (error) {
//       console.error("Error querying RAG:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { type: "answer", text: "Error retrieving answer. Please try again." }
//       ]);
//     }
    
//     setInput("");
//   };

//   // Auto-scroll when messages change
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Medical History</li>
//             <li>MedAssistant</li>
//             <li>Appointments</li>
//             <li>Add Patient Profile</li>
//             <li>Settings</li>
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
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header>

//         {/* Chat Interface */}
//         <section className="chat-section">
//           <div className="chat-container" ref={chatContainerRef}>
//             {messages.map((msg, index) => (
//               <div key={index} className={msg.type === "question" ? "question" : "answer"}>
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <div className="chat-input-container">
//             <input
//               type="text"
//               placeholder="Ask your Medical Assistant..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             />
//             <button onClick={handleSendMessage}>Send</button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ChatbotInterface;


//VERSION 1.2 : ATTEMPT #2: 


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./ChatbotInterface.css";
// import logo from "../assets/logo.png";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const chatContainerRef = useRef(null);

//   // Function to send the user's query to the backend RAG endpoint
//   const handleSendMessage = async () => {
//     if (input.trim() === "") return;

//     // Add user's question to messages
//     const newMessages = [...messages, { type: "question", text: input }];
//     setMessages(newMessages);

//     try {
//       // POST the query to your Flask backend (ensure your server is running on localhost:5001)
//       const response = await axios.post("http://localhost:5001/query", {
//         question: input,
//       });
//       // Expecting response.data.answer to contain the answer from your RAG pipeline
//       const answer = response.data.answer;
//       // Append the answer to the messages list
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { type: "answer", text: answer },
//       ]);
//     } catch (error) {
//       console.error("Error querying RAG:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           type: "answer",
//           text: "Error retrieving answer. Please try again later.",
//         },
//       ]);
//     }

//     setInput("");
//   };

//   // Auto-scroll the chat container when messages update
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Medical History</li>
//             <li>MedAssistant</li>
//             <li>Appointments</li>
//             <li>Add Patient Profile</li>
//             <li>Settings</li>
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
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header>

//         {/* Chat Interface */}
//         <section className="chat-section">
//           <div className="chat-container" ref={chatContainerRef}>
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={msg.type === "question" ? "question" : "answer"}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <div className="chat-input-container">
//             <input
//               type="text"
//               placeholder="Ask your Medical Assistant..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) =>
//                 e.key === "Enter" && handleSendMessage()
//               }
//             />
//             <button onClick={handleSendMessage}>Send</button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ChatbotInterface;


//VERSION 1.3 : ATTMEPTING TO IMPROVE CHAT INTERFACE GUI: 


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatbotInterface.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // track AI processing
  const chatContainerRef = useRef(null);

  // Send the user's query to the backend RAG endpoint
  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    // Add user's question to messages
    const newMessages = [...messages, { type: "question", text: input }];
    setMessages(newMessages);

    // Clear the input right away
    setInput("");

    try {
      // Indicate loading state
      setIsLoading(true);

      // POST the query to your Flask backend
      const response = await axios.post("http://localhost:5001/query", {
        question: input,
      });

      // The server should return { answer: "...some text..." }
      const answer = response.data.answer;

      // Append the answer to the messages list
      setMessages((prev) => [...prev, { type: "answer", text: answer }]);
    } catch (error) {
      console.error("Error querying RAG:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "Error retrieving answer. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <nav className="menu">
          <ul>
            <li>Medical History</li>
            <li>MedAssistant</li>
            <li>Appointments</li>
            <li>Add Patient Profile</li>
            <li>Settings</li>
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
            <Link to="/docUpload">
              <button>Document Upload</button>
            </Link>
            <button className="Medications">To-Do</button>
          </div>
        </header>

        {/* Chat Interface */}
        <section className="chat-section">
          {/* Chat messages */}
          <div className="chat-container" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "question" ? "question" : "answer"}
              >
                {msg.text}
              </div>
            ))}

            {/* Optional: Show a "Loading..." message if isLoading */}
            {isLoading && (
              <div className="answer" style={{ fontStyle: "italic" }}>
                Loading...
              </div>
            )}
          </div>

          {/* Input + Send Button */}
          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Ask your Medical Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading} // disable input while AI is generating
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatbotInterface;


//VERSION 2.3 removing the sidebar and top bar into its seperate jsx and css: 


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Layout from "./Layout"; // Shared layout component
// import "./upload.css";

// const Documents = () => {
//   // Document upload states & logic
//   const [documents, setDocuments] = useState([]);
//   const [showModal, setShowModal] = useState(false); // Upload form modal
//   const [previewModal, setPreviewModal] = useState(false); // File preview modal

//   const [docName, setDocName] = useState("");
//   const [docType, setDocType] = useState("");
//   const [docFile, setDocFile] = useState(null);

//   const [previewUrl, setPreviewUrl] = useState(null); // For PDFs/images
//   const [textContent, setTextContent] = useState("");  // For text-based files
//   const [zoom, setZoom] = useState(1);

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

//   const handleOpenModal = () => setShowModal(true);

//   const handleCloseModal = () => {
//     setShowModal(false);
//     resetPreviewState();
//     setDocName("");
//     setDocType("");
//     setDocFile(null);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setDocFile(file);
//     handlePreview(file);
//   };

//   const handlePreview = (file) => {
//     setZoom(1);
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
//     if (file.type.startsWith("image/")) {
//       const url = URL.createObjectURL(file);
//       setPreviewUrl(url);
//       setPreviewModal(true);
//       return;
//     }
//     // Fallback for other types
//     const fallbackUrl = URL.createObjectURL(file);
//     setPreviewUrl(fallbackUrl);
//     setPreviewModal(true);
//   };

//   const handleZoomIn = () => setZoom((prev) => prev + 0.1);
//   const handleZoomOut = () => setZoom((prev) => Math.max(0.1, prev - 0.1));
//   const resetPreviewState = () => {
//     setPreviewModal(false);
//     setPreviewUrl(null);
//     setTextContent("");
//     setZoom(1);
//   };

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
//       fetchDocuments();
//       resetPreviewState();
//       setShowModal(false);
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("File upload failed");
//     }
//   };

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

//   return (
//     <Layout activePage="upload" onChangePage={() => {}}>
//       <div className="main-content">
//         <div className="content-area">
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
//                       <td>{doc.userTitle}</td>
//                       <td>{doc.type}</td>
//                       <td>
//                         <button className="view-btn" onClick={() => handleViewDocument(doc)}>
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

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
//                   style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
//                 />
//               )}
//               {textContent && (
//                 <pre
//                   style={{
//                     whiteSpace: "pre-wrap",
//                     wordWrap: "break-word",
//                     color: "#000",
//                     backgroundColor: "#fff",
//                     fontSize: `${14 * zoom}px`,
//                   }}
//                 >
//                   {textContent}
//                 </pre>
//               )}
//             </div>
//             <div className="modal-buttons" style={{ marginTop: "1rem" }}>
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
//     </Layout>
//   );
// };

// export default Documents;


//VERSION 2.4:  updated jsx for chatbotinterface 


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Layout from "./Layout";
// import "./ChatbotInterface.css";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContainerRef = useRef(null);

//   const handleSendMessage = async () => {
//     if (input.trim() === "" || isLoading) return;

//     const newMessages = [...messages, { type: "question", text: input }];
//     setMessages(newMessages);
//     const currentQuery = input;
//     setInput("");

//     try {
//       setIsLoading(true);
//       const response = await axios.post("http://localhost:5001/query", {
//         question: currentQuery,
//       });
//       const answer = response.data.answer;
//       setMessages((prev) => [...prev, { type: "answer", text: answer }]);
//     } catch (error) {
//       console.error("Error querying RAG:", error);
//       setMessages((prev) => [
//         ...prev,
//         { type: "answer", text: "Error retrieving answer. Please try again later." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <Layout activePage="chatbot" onChangePage={() => {}}>
//       <section className="chat-section">
//         <div className="chat-container" ref={chatContainerRef}>
//           {messages.map((msg, index) => (
//             <div key={index} className={msg.type === "question" ? "question" : "answer"}>
//               {msg.text}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="answer" style={{ fontStyle: "italic" }}>
//               Loading...
//             </div>
//           )}
//         </div>
//         <div className="chat-input-container">
//           <input
//             type="text"
//             placeholder="Ask your Medical Assistant..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             disabled={isLoading}
//           />
//           <button onClick={handleSendMessage} disabled={isLoading}>
//             {isLoading ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default ChatbotInterface;


// //VERSION 2.1 : removing sidebar code into its own page. 

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import Layout from "./Layout";
// import "./ChatbotInterface.css";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContainerRef = useRef(null);

//   const handleSendMessage = async () => {
//     if (input.trim() === "" || isLoading) return;

//     const newMessages = [...messages, { type: "question", text: input }];
//     setMessages(newMessages);
//     const currentQuery = input;
//     setInput("");

//     try {
//       setIsLoading(true);
//       const response = await axios.post("http://localhost:5001/query", {
//         question: currentQuery,
//       });
//       const answer = response.data.answer;
//       setMessages((prev) => [...prev, { type: "answer", text: answer }]);
//     } catch (error) {
//       console.error("Error querying RAG:", error);
//       setMessages((prev) => [
//         ...prev,
//         { type: "answer", text: "Error retrieving answer. Please try again later." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <Layout activePage="chatbot" onChangePage={() => {}}>
//       <section className="chat-section">
//         <div className="chat-container" ref={chatContainerRef}>
//           {messages.map((msg, index) => (
//             <div key={index} className={msg.type === "question" ? "question" : "answer"}>
//               {msg.text}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="answer" style={{ fontStyle: "italic" }}>
//               Loading...
//             </div>
//           )}
//         </div>
//         <div className="chat-input-container">
//           <input
//             type="text"
//             placeholder="Ask your Medical Assistant..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             disabled={isLoading}
//           />
//           <button onClick={handleSendMessage} disabled={isLoading}>
//             {isLoading ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </section>
//     </Layout>
//   );
// };

// export default ChatbotInterface;


//VERSION 5:idk anymore. 


// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./ChatbotInterface.css";
// import logo from "../assets/logo.png";

// const ChatbotInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContainerRef = useRef(null);

//   const handleSendMessage = async () => {
//     if (input.trim() === "" || isLoading) return;
//     const newMessages = [...messages, { type: "question", text: input }];
//     setMessages(newMessages);
//     setInput("");
//     try {
//       setIsLoading(true);
//       const response = await axios.post("http://localhost:5001/query", {
//         question: input,
//       });
//       const answer = response.data.answer;
//       setMessages((prev) => [...prev, { type: "answer", text: answer }]);
//     } catch (error) {
//       console.error("Error querying RAG:", error);
//       setMessages((prev) => [
//         ...prev,
//         { type: "answer", text: "Error retrieving answer. Please try again." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="logo">
//           <img src={logo} alt="Logo" />
//         </div>
//         <nav className="menu">
//           <ul>
//             <li>Medical History</li>
//             <li>MedAssistant</li>
//             <li>Appointments</li>
//             <li>Add Patient Profile</li>
//             <li>Settings</li>
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
//             <button>Insights</button>
//             <button>Reports</button>
//             <button className="Medications">Medications</button>
//           </div>
//         </header>

//         {/* Chat Interface */}
//         <section className="chat-section">
//           <div className="chat-container" ref={chatContainerRef}>
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={msg.type === "question" ? "question" : "answer"}
//               >
//                 {msg.text}
//               </div>
//             ))}
//             {isLoading && (
//               <div className="answer" style={{ fontStyle: "italic" }}>
//                 Loading...
//               </div>
//             )}
//           </div>
//           <div className="chat-input-container">
//             <input
//               type="text"
//               placeholder="Ask your Medical Assistant..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) =>
//                 e.key === "Enter" && handleSendMessage()
//               }
//               disabled={isLoading}
//             />
//             <button onClick={handleSendMessage} disabled={isLoading}>
//               {isLoading ? "Sending..." : "Send"}
//             </button>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ChatbotInterface;
