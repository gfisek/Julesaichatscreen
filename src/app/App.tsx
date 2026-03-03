import { useState } from "react";
import { JulesWidget } from "./components/JulesWidget";

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #06111a 0%, #0a1e2e 100%)"
          : "linear-gradient(135deg, #e6f7f9 0%, #f0fbfc 100%)",
        transition: "background 0.4s ease",
      }}
    >
      <JulesWidget
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isDark={isDark}
        onDarkChange={setIsDark}
      />

      {/* Trigger — sadece widget kapalıyken görünür */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setIsOpen(true)}
            style={{
              padding: "14px 32px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1ba3b8, #4dc4ce)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(27,163,184,0.4)",
            }}
          >
            Jules'ı Aç
          </button>
        </div>
      )}
    </div>
  );
}
