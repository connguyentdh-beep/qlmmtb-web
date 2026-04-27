export default function LanguageSwitcher({ language, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        border: "1px solid #d1d5db",
        borderRadius: 12,
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <button
        onClick={() => onChange("vi")}
        style={{
          border: "none",
          padding: "10px 14px",
          cursor: "pointer",
          background: language === "vi" ? "#2563eb" : "#ffffff",
          color: language === "vi" ? "#ffffff" : "#111827",
          fontWeight: 600,
        }}
      >
        VI
      </button>

      <button
        onClick={() => onChange("en")}
        style={{
          border: "none",
          padding: "10px 14px",
          cursor: "pointer",
          background: language === "en" ? "#2563eb" : "#ffffff",
          color: language === "en" ? "#ffffff" : "#111827",
          fontWeight: 600,
        }}
      >
        EN
      </button>
    </div>
  );
}