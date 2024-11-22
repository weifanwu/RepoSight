// components/ApiKeyPopup.tsx
import React, { useState } from "react";
import { useTree } from "@/context/treeContext";

const ApiKeyPopup: React.FC = () => {
  const { setApiKey } = useTree();
  const [key, setKey] = useState("");

  const handleSave = () => {
    setApiKey(key); // Save the key to context
    setKey(""); // Clear the input
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", textAlign: "center", width: "300px" }}>
        <h3>Enter OpenAI API Key</h3>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Your OpenAI API Key"
          style={{ width: "100%", padding: "8px", margin: "10px 0" }}
        />
        <button onClick={handleSave} style={{ padding: "8px 12px", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Save Key
        </button>
      </div>
    </div>
  );
};

export default ApiKeyPopup;
