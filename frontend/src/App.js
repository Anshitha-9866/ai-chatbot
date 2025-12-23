import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setChat([...chat, { sender: "user", text: message }]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      setChat((prevChat) => [
        ...prevChat,
        { sender: "bot", text: data.response },
      ]);
    } catch (error) {
      setChat((prevChat) => [
        ...prevChat,
        { sender: "bot", text: "Error connecting to server" },
      ]);
    }

    setMessage("");
  };

  return (
    <div className="App">
      <h2>⚖️ Legal AI Chatbot</h2>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-msg" : "bot-msg"}
          >
            <b>{msg.sender === "user" ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={message}
          placeholder="Ask a legal question..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
