import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add the user's message to the chat
    setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    setInput("");
    setIsLoading(true);

    // Send the request to the server
    fetch("http://localhost:8000/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmedInput }),
    })
      .then((res) => res.json())
      .then((data) => {
        // If the server returns { response: "some text" }
        const responseText = data.response || "No response received.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: responseText },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching LLM response:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Chat Interface</h2>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <strong>{msg.role === "user" ? "You: " : "Assistant: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Type a message..."
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
