import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", fontFamily: "Segoe UI, sans-serif" }}>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 60%, #1a237e 100%)",
        color: "#fff", padding: "100px 40px", textAlign: "center"
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 18px", fontSize: 13, marginBottom: 20, letterSpacing: 1 }}>
            PROIECT SOFTWARE · MI204
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            RealEstate Predictor AI
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.85, marginBottom: 36, lineHeight: 1.7 }}>
            Estimează prețul corect de piață pentru orice locuință din România — bazat pe date reale și machine learning.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/predict")} style={{
              padding: "14px 36px", fontSize: 16, fontWeight: 700,
              background: "#fff", color: "#1565c0", border: "none",
              borderRadius: 10, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
            }}>
              🔍 Estimează prețul
            </button>
            <button onClick={() => navigate("/dashboard")} style={{
              padding: "14px 36px", fontSize: 16, fontWeight: 700,
              background: "transparent", color: "#fff",
              border: "2px solid rgba(255,255,255,0.6)",
              borderRadius: 10, cursor: "pointer"
            }}>
              📊 Dashboard piață
            </button>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div style={{ background: "#fff", padding: "64px 24px", textAlign: "center", borderTop: "1px solid #e3e8f0" }}>
        <h2 style={{ marginBottom: 12, color: "#1a1a2e" }}>Gata să estimezi?</h2>
        <p style={{ color: "#888", marginBottom: 24 }}>Încearcă acum — fără înregistrare</p>
        <button onClick={() => navigate("/predict")} style={{
          padding: "14px 40px", fontSize: 16, fontWeight: 700,
          background: "#1565c0", color: "#fff", border: "none",
          borderRadius: 10, cursor: "pointer"
        }}>
          Începe estimarea →
        </button>
      </div>

    </div>
  );
}