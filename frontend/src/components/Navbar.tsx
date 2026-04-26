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
      padding: "0 40px", height: 64,
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>
        🏘️ RealEstate Predictor AI
      </span>
      <div style={{ display: "flex", gap: 6 }}>
        {links.map((l) => (
          <button key={l.path} onClick={() => navigate(l.path)} style={{
            padding: "8px 18px", border: "none", borderRadius: 10, cursor: "pointer",
            fontSize: 14, fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s",
            background: location.pathname === l.path
              ? "rgba(255,255,255,0.2)"
              : "transparent",
            color: "#fff",
            backdropFilter: location.pathname === l.path ? "blur(10px)" : "none",
            boxShadow: location.pathname === l.path
              ? "0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "none",
          }}>
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}