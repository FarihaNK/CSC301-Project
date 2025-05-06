import React, { useState, useEffect, useRef } from "react";
import flaskApi from "../api"; // Axios helper
import "./ChatbotInterface.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const ChatbotInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [showEscalate, setShowEscalate] = useState(false);
  const chatContainerRef = useRef(null);

  // Send the user's query to the Flask /query endpoint
  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    // Append user's question to messages
    setMessages((prev) => [...prev, { type: "question", text: input }]);
    const currentQuery = input;
    setLastQuery(currentQuery);
    setInput(""); // clear input

    try {
      setIsLoading(true);
      const response = await flaskApi.post("/query", {
        question: currentQuery,
      });
      const answer = response.data.answer;
      setMessages((prev) => [...prev, { type: "answer", text: answer }]);

      // If answer indicates no info was found, show the escalate modal.
      if (answer.trim().toUpperCase().includes("NO_ANSWER_FOUND")) {
        setShowEscalate(true);
      } else {
        setShowEscalate(false);
      }
    } catch (error) {
      console.error("Error querying RAG:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "Error retrieving answer. Please try again later.",
        },
      ]);
      setShowEscalate(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for escalation: calls the /escalate endpoint with the last query.
  const handleEscalate = async () => {
    try {
      setIsLoading(true);
      const response = await flaskApi.post("/escalate", {
        query: lastQuery,
      });
      const escalatedAnswer =
        response.data.escalated_answer || response.data.error;
      // Append SME answer message.
      setMessages((prev) => [
        ...prev,
        { type: "answer", text: `RESPONSE FROM SME: ${escalatedAnswer}` },
      ]);
      setShowEscalate(false);
    } catch (error) {
      console.error("Error escalating to SME:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "Error escalating to SME. Please try again later.",
        },
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
      

      {/* Main Content */}
      <main className="content">
        {/* Top Bar */}
        

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

          {/* Chat Input */}
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

      {/* Escalation Modal */}
      {showEscalate && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Escalate Query</h2>
            <p>
              No answer was found. Would you like to escalate your query to an
              SME?
            </p>
            <div className="modal-buttons">
              <button
                className="yes-button"
                onClick={handleEscalate}
                disabled={isLoading}
              >
                Yes
              </button>
              <button
                className="no-button"
                onClick={() => setShowEscalate(false)}
                disabled={isLoading}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotInterface;