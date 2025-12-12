import React, { useState } from "react";
import ChatPanel from "./components/ChatPanel";
import ReadingPanel from "./components/ReadingPanel";

function App() {
  // State: Which Vachanamrut to show? (null = panel closed)
  const [activeCitation, setActiveCitation] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Left Side: Chat */}
      <ChatPanel
        onCitationClick={(citation) => setActiveCitation(citation)}
        isPanelOpen={!!activeCitation}
      />

      {/* Right Side: Reading (Conditionally rendered) */}
      {activeCitation && (
        <ReadingPanel
          citation={activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      )}
    </div>
  );
}

export default App;
