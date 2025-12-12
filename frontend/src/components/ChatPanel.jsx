import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, Book } from "lucide-react";
import apiClient from "../utils/CustomFetch";

const ChatPanel = ({ onCitationClick, isPanelOpen }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Jay Swaminarayan. Ask me a spiritual question.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Hardcoded Filters for MVP (You can add dropdowns later)
  const filters = { chapter: "All", section: "All", vachanamrut_no: 0 };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };

    // --- 1. CAPTURE & CLEAN HISTORY ---
    // We create the history payload BEFORE updating the state with the new message
    // The backend needs to know what was said PREVIOUSLY to understand "this" or "it".
    const historyPayload = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Update UI immediately
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // --- 2. SEND HISTORY TO BACKEND ---
      const response = await apiClient.post("/ask", {
        question: userMsg.content,
        history: historyPayload, // <--- THE CRITICAL UPDATE
        ...filters,
      });

      const aiData = response.data; // { answer: "...", citations: [...] }

      const botMsg = {
        role: "assistant",
        content: aiData.answer,
        citations: aiData.citations,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error connecting to the Vachanamrut.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.container, width: isPanelOpen ? "50%" : "100%" }}>
      {/* Messages Area */}
      <div style={styles.messageList}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.messageRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {/* Avatar */}
            {msg.role === "assistant" && (
              <div style={styles.avatarBot}>
                <Bot size={18} color="#fff" />
              </div>
            )}

            {/* Bubble */}
            <div
              style={{
                ...styles.bubble,
                backgroundColor: msg.role === "user" ? "#4f46e5" : "#ffffff",
                color: msg.role === "user" ? "#fff" : "#1f2937",
                border: msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
              }}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>

              {/* Render Citations if they exist */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={styles.citationBlock}>
                  <small
                    style={{
                      opacity: 0.8,
                      display: "block",
                      marginBottom: "5px",
                    }}
                  >
                    References:
                  </small>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {msg.citations.map((cite, i) => (
                      <button
                        key={i}
                        style={styles.citeBtn}
                        onClick={() => onCitationClick(cite.metadata)}
                      >
                        <Book size={12} />
                        {cite.metadata.chapter} {cite.metadata.section}{" "}
                        {cite.metadata.vachanamrut_no}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ marginLeft: "50px", color: "#6b7280" }}>
            Thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={styles.sendBtn} disabled={loading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f3f4f6",
    transition: "width 0.3s ease",
  },
  messageList: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  messageRow: {
    display: "flex",
    gap: "10px",
    maxWidth: "100%",
  },
  avatarBot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#ea580c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bubble: {
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "80%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    lineHeight: "1.5",
  },
  citationBlock: {
    marginTop: "12px",
    paddingTop: "8px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
  },
  citeBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "1px solid rgba(0,0,0,0.2)", // Fixed border for visibility
    backgroundColor: "rgba(255,255,255,0.5)",
    color: "inherit",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  inputArea: {
    padding: "20px",
    backgroundColor: "#fff",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "16px",
  },
  sendBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0 20px",
    cursor: "pointer",
  },
};

export default ChatPanel;
