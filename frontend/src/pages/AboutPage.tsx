import { useNavigate } from "react-router-dom";

const members = [
  { rol: "Data Engineer", nume: "Adi", modul: "Scraper + Data Cleaning", icon: "🗄️", desc: "Colectează și curăță anunțurile imobiliare din multiple surse." },
  { rol: "Backend Architect", nume: "Sorin", modul: "API + Database", icon: "⚙️", desc: "Construiește API-ul REST cu FastAPI și gestionează baza de date." },
  { rol: "Frontend & UX", nume: "Bogdan", modul: "Interfață Web", icon: "🎨", desc: "Dezvoltă interfața utilizator cu React și TypeScript." },
  { rol: "AI/ML Specialist", nume: "Radu", modul: "Prediction Engine", icon: "🤖", desc: "Antrenează și optimizează modelul CatBoost de predicție a prețurilor." },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={() => navigate("/")} style={{
        marginBottom: 24, background: "none", border: "1px solid white",
        borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#555",
        fontSize: 14, fontWeight: 600
      }}>
        ← Înapoi acasă
      </button>

      <h1 style={{ color: "#1565c0", marginBottom: 8 }}>👥 Despre echipă</h1>
      <p style={{ color: "white", marginBottom: 40 }}>
        Proiect software în echipă 
      </p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 48 }}>
        {members.map((m) => (
          <div key={m.rol} className="card" style={{ flex: "1 1 360px", display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: 36, background: "white", borderRadius: 12, padding: "12px 14px" }}>{m.icon}</div>
            <div>
              <p style={{ fontSize: 12, color: "#1565c0", fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>{m.rol}</p>
              <h3 style={{ marginBottom: 4, color: "white" }}>{m.nume}</h3>
              <p style={{ fontSize: 13, color: "white", marginBottom: 6 }}>Modul: {m.modul}</p>
              <p style={{ fontSize: 14, color: "white", lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ background: "linear-gradient(135deg, #1565c0, #0d47a1)", color: "#fff", textAlign: "center" }}>
        <h2 style={{ marginBottom: 8 }}>🏆 Obiectivul proiectului</h2>
        <p style={{ opacity: 0.85, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
          Estimarea prețului corect de piață pentru locuințe din România prin colectare automată de anunțuri. 
        </p>
      </div>
    </div>
  );
}