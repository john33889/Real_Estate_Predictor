import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "10vh", fontFamily: "sans-serif" }}>
      <h1>🏠 RealEstate Predictor AI</h1>
      <p>Estimează prețul corect de piață pentru orice locuință din România.</p>
      <div style={{ marginTop: 32, display: "flex", gap: 16, justifyContent: "center" }}>
        <button onClick={() => navigate("/predict")}
          style={{ padding: "12px 28px", fontSize: 16, cursor: "pointer", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8 }}>
          Estimează preț
        </button>
        <button onClick={() => navigate("/dashboard")}
          style={{ padding: "12px 28px", fontSize: 16, cursor: "pointer", background: "#388e3c", color: "#fff", border: "none", borderRadius: 8 }}>
          Dashboard piață
        </button>
      </div>
    </div>
  );
}