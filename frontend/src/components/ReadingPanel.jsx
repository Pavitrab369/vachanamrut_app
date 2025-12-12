import React, { useState, useEffect } from "react";
import { X, BookOpen, Loader } from "lucide-react";
import apiClient from "../utils/CustomFetch";
const ReadingPanel = ({ citation, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Whenever the 'citation' prop changes, fetch new data
  useEffect(() => {
    if (!citation) return;

    const fetchText = async () => {
      setLoading(true);
      setError(null);
      try {
        // We use the proxy we set up in vite.config.js
        // citation object has: { chapter, section, vachanamrut_no }
        const { chapter, section, vachanamrut_no } = citation;

        // Handle empty section logic (send empty string if missing)
        const secParam = section || "";

        const response = await apiClient.get("/vachanamrut", {
          params: {
            chapter: chapter,
            section: secParam,
            number: vachanamrut_no,
          },
        });

        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not load scripture text.");
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [citation]);

  if (!citation) return null;

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BookOpen size={20} color="#4f46e5" />
          <h3 style={{ margin: 0 }}>
            {citation.chapter} {citation.section} {citation.vachanamrut_no}
          </h3>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {loading && (
          <div style={styles.center}>
            <Loader className="spin" /> Loading...
          </div>
        )}

        {error && <div style={{ color: "red" }}>{error}</div>}

        {data && !loading && (
          <>
            <h2 style={styles.title}>{data.title_en}</h2>
            <div style={styles.textBlock}>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.8" }}>
                {data.text_en}
              </p>
            </div>

            <hr style={{ margin: "20px 0", opacity: 0.3 }} />

            {/* Gujarati Fallback */}
            <h3 style={styles.subTitle}>{data.title_gu}</h3>
            <p
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                fontFamily: "Github",
              }}
            >
              {data.text_gu}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Simple Inline CSS for the Panel
const styles = {
  panel: {
    width: "50%", // Takes up half the screen
    height: "100%",
    borderLeft: "1px solid #e5e7eb",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-4px 0 15px rgba(0,0,0,0.05)",
    position: "absolute", // Overlay on mobile, split on desktop
    right: 0,
    top: 0,
    zIndex: 10,
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    gap: "10px",
  },
  title: {
    marginTop: 0,
    color: "#111827",
  },
  subTitle: {
    color: "#4b5563",
  },
  textBlock: {
    fontSize: "16px",
    color: "#374151",
  },
};

export default ReadingPanel;
