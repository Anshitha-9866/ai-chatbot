// chatWidget.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  // create a session id once per browser tab
  useEffect(() => {
    const existing = window.sessionStorage.getItem("chat_session_id");
    if (existing) {
      setSessionId(existing);
    } else {
      const id = Math.random().toString(36).slice(2, 10);
      window.sessionStorage.setItem("chat_session_id", id);
      setSessionId(id);
    }
  }, []);

  const sendMessage = async () => {
    setErrorText("");

    const trimmed = message.trim();
    if (!trimmed) {
      setErrorText("Please type a question before sending.");
      return;
    }
    if (trimmed.length > 500) {
      setErrorText("Message is too long. Please keep it under 500 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/send/",
        {
          message: trimmed,
          sessionId: sessionId,
        }
      );

      const data = response.data;
      setChatHistory(data.history || []);
      setMessage("");
    } catch (error) {
      console.error("Error connecting to server:", error);
      setErrorText(
        "Could not reach the server. Please check your internet and that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "2rem auto",
        borderRadius: "12px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        padding: "16px",
        backgroundColor: "#ffffff",
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>Legal AI Chatbot</h3>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "12px" }}>
        Ask about FIR, bail, legal aid, or case status. This chatbot gives general
        information, not personal legal advice.
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "10px",
          height: "260px",
          overflowY: "auto",
          marginBottom: "10px",
          backgroundColor: "#f9fafb",
        }}
      >
        {chatHistory.length === 0 && (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            Start the conversation by saying “hi” or asking “How to file an FIR?”.
          </p>
        )}

        {chatHistory.map((chat, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <p style={{ margin: 0 }}>
              <strong>You:</strong> {chat.user}
            </p>
            <p style={{ margin: 0 }}>
              <strong>Bot:</strong> {chat.bot}
            </p>
            <hr style={{ borderColor: "#e5e7eb", margin: "6px 0" }} />
          </div>
        ))}

        {loading && (
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>Bot is typing…</p>
        )}
      </div>

      {errorText && (
        <p style={{ color: "#b91c1c", fontSize: "0.8rem", marginBottom: "8px" }}>
          {errorText}
        </p>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            fontSize: "0.9rem",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: loading ? "#9ca3af" : "#1d4ed8",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;
