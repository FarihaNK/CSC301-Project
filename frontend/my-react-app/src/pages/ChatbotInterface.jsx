import React, { useState } from "react";
import "./ChatbotInterface.css";
import logo from "../assets/logo.png";

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    const newMessages = [...messages, { type: "question", text: input }, { type: "answer", text: "Answer..." }];
    setMessages(newMessages);
    setInput("");
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
          <input type="text" placeholder="Search for anything..." className="search-bar" />
          <div className="navigation">
            <button>Dashboard</button>
            <button>Insights</button>
            <button>Reports</button>
            <button className="Medications">Medications</button>
          </div>
        </header>

        {/* Chat Interface */}
        <section className="chat-section">
          <div className="chat-container">
            {messages.map((msg, index) => (
              <div key={index} className={msg.type === "question" ? "question" : "answer"}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Ask your Medical Assistant..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatbotInterface;
