import { useState } from "react";
import { FaCommentDots } from "react-icons/fa";

import { apiUrl } from "../lib/api";
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! Ask me about products, orders, shipping, or accounts."
    }
  ]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch(apiUrl("/api/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply
        }
      ]);
    } catch (err) {
      console.error("Frontend chat error:", err);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Error contacting chatbot."
        }
      ]);
    }

    setInput("");
  };

  return (
    <>
      {/* Chat Button */}
      <button
          onClick={() => setOpen(!open)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "55px",
            height: "55px",
            borderRadius: "50%",
            background: "#111",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            color: "white"
          }}
        >
          <FaCommentDots size={22} />
        </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "320px",
            height: "420px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000
          }}
        >
          {/* Header */}
          <div style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
            <strong>ShaqaWear Assistant</strong>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {messages.map((m, i) => {
              const isUser = m.sender === "user";

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    marginBottom: "10px"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "10px 12px",
                      borderRadius: "16px",
                      background: isUser ? "#007bff" : "#ffffff",
                      color: isUser ? "white" : "black",
                      border: isUser ? "none" : "1px solid #ddd",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {/* text response */}
                    {typeof m.text === "string" && <div>{m.text}</div>}

                    {/* object response */}
                    {typeof m.text === "object" && m.text?.type === "text" && (
                      <div style={{ whiteSpace: "pre-wrap" }}>
                        {m.text.message}
                      </div>
                    )}

                    {/* product cards */}
                    {typeof m.text === "object" &&
                      m.text?.type === "products" && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                          }}
                        >
                          {m.text.items.map((p) => (
                            <div
                              key={p.id}
                              style={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px",
                                background: "#fafafa"
                              }}
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                style={{
                                  width: "100%",
                                  borderRadius: "10px",
                                  marginBottom: "8px"
                                }}
                              />

                              <strong>{p.name}</strong>
                              <div>${p.price}</div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#555"
                                }}
                              >
                                {p.description}
                              </div>

                              <a
                                href={`/product/${p.id}`}
                                style={{
                                  display: "inline-block",
                                  marginTop: "6px",
                                  color: "#007bff",
                                  fontSize: "12px"
                                }}
                              >
                                View Product
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: "8px",
              gap: "8px",
              background: "#fff"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "20px",
                outline: "none"
              }}
              placeholder="Ask something..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button onClick={sendMessage} style={{ 
                padding: "10px 14px",
                borderRadius: "20px",
                border: "none",
                background: "#007bff",
                color: "white",
                cursor: "pointer"
            }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}