import React, { useState, useEffect, useRef } from "react";
import flaskApi from "./api"; // Import the Axios helper we created
import "./ChatbotInterface.css";
import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';

const ChatbotInterface2 = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Send the user's query to the Flask /query endpoint
  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    // Append user's question to messages
    setMessages(prev => [...prev, { type: "question", text: input }]);
    const currentInput = input; // capture current input before clearing
    setInput(""); // Clear the input immediately

    try {
      setIsLoading(true);
      
      // POST the query using flaskApi which automatically attaches the JWT token
      const response = await flaskApi.post("/query", {
        question: currentInput
      });
      
      // Extract the answer from the response
      const answer = response.data.answer;
      setMessages(prev => [...prev, { type: "answer", text: answer }]);
    } catch (error) {
      console.error("Error querying RAG:", error);
      setMessages(prev => [
        ...prev,
        {
          type: "answer",
          text: "Error retrieving answer. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the bottom when messages update
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
          <div className="chat-container" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.type === "question" ? "question" : "answer"}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="answer" style={{ fontStyle: "italic" }}>
                Loading...
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Ask your Medical Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
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

export default ChatbotInterface2;

