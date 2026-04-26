import { useNavigate } from "react-router-dom";

const members = [
  { rol: "Data Engineer", nume: "Adi", modul: "Scraper + Data Cleaning", icon: "🗄️", desc: "Responsabil de extragerea automată a anunțurilor imobiliare și transformarea datelor brute într-un set curat, structurat și pregătit pentru antrenarea modelului." },
{ rol: "Backend Architect", nume: "Sorin", modul: "API Service", icon: "⚙️", desc: "Proiectează și implementează serviciul care expune predicțiile către aplicație, validează cererile primite și orchestrează comunicarea între componentele sistemului." },
  { rol: "Frontend & UX", nume: "Bogdan", modul: "Interfață Web", icon: "🎨", desc: "Realizează interfața utilizatorului final, integrează datele de piață în vizualizări interactive și asigură o experiență fluentă pe toate dispozitivele." },
  { rol: "AI/ML Specialist", nume: "Radu", modul: "Prediction Engine", icon: "🤖", desc: "Construiește, antrenează și optimizează modelul de predicție, evaluând performanța acestuia și calibrându-l pe baza datelor reale colectate din piață." },
];
export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <button className="btn-back" onClick={() => navigate("/")}>← Înapoi acasă</button>

      <h1 className="gold-accent" style={{ marginBottom: 8, fontSize: "2.2rem" }}>👥 Despre echipă</h1>
      <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 40 }}>
        Proiect software în echipă · MI204 · 4 membri, 4 module independente.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20, marginBottom: 40 }}>
        {members.map((m) => (
          <div key={m.rol} className="card" style={{ display: "flex", gap: 18, alignItems: "flex-start", padding: 24 }}>
            <div style={{
              fontSize: 38,
              background: "linear-gradient(135deg, rgba(249,217,118,0.2) 0%, rgba(212,160,23,0.15) 100%)",
              border: "1px solid rgba(249,217,118,0.35)",
              borderRadius: 14,
              padding: "14px 16px",
              flexShrink: 0
            }}>{m.icon}</div>
            <div style={{ flex: 1 }}>
              <p className="gold-accent" style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 4 }}>
                {m.rol.toUpperCase()}
              </p>
              <h3 style={{ color: "#fff", fontSize: "1.3rem", marginBottom: 6 }}>{m.nume}</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 10, fontStyle: "italic" }}>
                Modul: {m.modul}
              </p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.65 }}>
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Card obiectiv în temă verde+auriu */}
      <div className="card" style={{
        background: "linear-gradient(135deg, rgba(0,214,143,0.15) 0%, rgba(249,217,118,0.12) 100%)",
        border: "1px solid rgba(249,217,118,0.4)",
        textAlign: "center",
        padding: "40px 32px"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
        <h2 className="gold-accent" style={{ marginBottom: 12, fontSize: "1.6rem" }}>
          Obiectivul proiectului
        </h2>
        <p style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.8, maxWidth: 700, margin: "0 auto", fontSize: 15 }}>
          Estimarea prețului corect de piață pentru locuințe din România prin <b style={{ color: "#f9d976" }}>colectare automată de anunțuri</b>, <b style={{ color: "#f9d976" }}>analiză AI</b> și o <b style={{ color: "#f9d976" }}>aplicație web ușor de folosit</b>.
        </p>
      </div>
    </div>
  );
}