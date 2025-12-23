// src/App.js
import React from "react";
import "./App.css";
import ChatWidget from "./chatWidget";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Legal AI Chatbot</h1>
        <p>Ask questions about legal procedures and get instant answers.</p>
      </header>

      <main>
        <ChatWidget />
      </main>
    </div>
  );
}

export default App;
