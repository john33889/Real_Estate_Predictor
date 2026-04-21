import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", position: "relative", zIndex: 1 }}>

      {/* Badge */}
      <div style={{
        display: "inline-block", marginBottom: 24,
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20,
        padding: "6px 20px", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.9)"
      }}>
        PROIECT SOFTWARE · MI204
      </div>

      {/* Title */}
      <h1 style={{ fontSize: "3.5rem", fontWeight: 900, textAlign: "center", marginBottom: 16, lineHeight: 1.15,
        background: "linear-gradient(135deg, #fff 30%, #90caf9 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
      }}>
        RealEstate<br />Predictor AI
      </h1>

      <p style={{ fontSize: "1.15rem", textAlign: "center", maxWidth: 520, marginBottom: 40, lineHeight: 1.8, color: "rgba(255,255,255,0.7)" }}>
        Estimează prețul corect de piață pentru orice locuință din România — bazat pe date reale și machine learning.
      </p>

      {/* Butoane */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
        <button className="btn-white" onClick={() => navigate("/predict")}>
          🔍 Estimează prețul
        </button>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          📊 Dashboard piață
        </button>
        <button className="btn-primary" onClick={() => navigate("/about")}>
          👥 Despre echipă
        </button>
      </div>

      {/* Glass cards info */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
        {[
          { icon: "🤖", title: "AI & ML", desc: "Model CatBoost antrenat pe mii de anunțuri reale din România" },
          { icon: "⚡", title: "Rapid", desc: "Estimare instantanee bazată pe date actualizate de piață" },
          { icon: "📍", title: "Localizat", desc: "Date specifice per oraș, cartier și tip de proprietate" },
        ].map((c) => (
          <div key={c.title} className="card" style={{ flex: "1 1 220px", textAlign: "center", padding: "28px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{c.icon}</div>
            <h3 style={{ marginBottom: 8, fontSize: "1rem" }}>{c.title}</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="card-blue" style={{ marginTop: 48, textAlign: "center", maxWidth: 500, padding: "36px 40px" }}>
        <h2 style={{ marginBottom: 8, fontSize: "1.4rem" }}>Gata să estimezi?</h2>
        <p style={{ marginBottom: 20, fontSize: 14 }}>Încearcă acum — fără înregistrare</p>
        <button className="btn-white" onClick={() => navigate("/predict")}>
          Începe estimarea →
        </button>
      </div>
    </div>
  );
}