import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

const links = [
  { path: "/", label: "🏠 Acasă" },
  { path: "/predict", label: "🔍 Estimează" },
  { path: "/dashboard", label: "📊 Dashboard" },
  { path: "/about", label: "👥 Echipă" },
];
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", height: 60, background: "#1565c0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100,
    }}>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>
        RealEstate Predictor AI
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        {links.map((l) => (
          <button key={l.path} onClick={() => navigate(l.path)} style={{
            padding: "8px 18px", border: "none", borderRadius: 6, cursor: "pointer",
            fontSize: 14, fontWeight: 600,
            background: location.pathname === l.path ? "#fff" : "transparent",
            color: location.pathname === l.path ? "#1565c0" : "#fff",
          }}>
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
