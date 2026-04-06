import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
      
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🏘️</div>
        <h1 style={{ fontSize: "2.8rem", fontWeight: 800, color: "#1565c0", marginBottom: 12 }}>
          RealEstate Predictor AI
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555", maxWidth: 520 }}>
          Estimează prețul corect de piață pentru orice locuință din România — bazat pe date reale și machine learning.
        </p>
      </div>

      {/* Butoane */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
        <button onClick={() => navigate("/predict")} style={{
          padding: "14px 36px", fontSize: 16, fontWeight: 700,
          background: "#1565c0", color: "#fff", border: "none",
          borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 12px rgba(21,101,192,0.3)"
        }}>
          🔍 Estimează prețul
        </button>
        <button onClick={() => navigate("/dashboard")} style={{
          padding: "14px 36px", fontSize: 16, fontWeight: 700,
          background: "#2e7d32", color: "#fff", border: "none",
          borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 12px rgba(46,125,50,0.3)"
        }}>
          📊 Dashboard piață
        </button>
      </div>

      {/* Cards info */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { icon: "🤖", title: "AI & ML", desc: "Model antrenat pe mii de anunțuri imobiliare reale din România" },
          { icon: "⚡", title: "Rapid", desc: "Estimare instantanee cu interval de încredere și context de piață" },
          { icon: "📍", title: "Localizat", desc: "Date specifice per oraș: București, Cluj, Timișoara și altele" },
        ].map((c) => (
          <div key={c.title} style={{
            background: "#fff", borderRadius: 12, padding: "24px 28px",
            width: 220, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
            <h3 style={{ marginBottom: 6, color: "#1565c0" }}>{c.title}</h3>
            <p style={{ fontSize: 14, color: "#666" }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}