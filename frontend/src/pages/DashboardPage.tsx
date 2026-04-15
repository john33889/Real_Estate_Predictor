import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMarketStats } from "../api/api";
import type { MarketStat } from "../types";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<MarketStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMarketStats()
      .then((res) => setStats(res.data))
      .catch(() => setError("Backend-ul nu este pornit încă."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={() => navigate("/")} style={{
        marginBottom: 24, background: "none", border: "1px solid #d0d7e3",
        borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#555",
        fontSize: 14, fontWeight: 600
      }}>
        ← Înapoi acasă
      </button>

      <h1 style={{ color: "#1565c0", marginBottom: 8 }}>📊 Dashboard piață imobiliară</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Statistici actualizate din baza de date a proiectului.</p>

      {loading && <p style={{ color: "#888" }}>Se încarcă datele...</p>}
      {error && (
        <div style={{ padding: 16, background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 8, color: "#f57f17" }}>
          ⚠️ {error}
        </div>
      )}
      {!loading && !error && (
        <div className="card">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ background: "#1565c0", color: "#fff" }}>
                <th style={th}>Oraș</th>
                <th style={th}>Preț mediu (€)</th>
                <th style={th}>Nr. anunțuri</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f8f9ff" : "#fff" }}>
                  <td style={td}>{s.oras}</td>
                  <td style={td}>{s.pret_mediu.toLocaleString("ro-RO")} €</td>
                  <td style={td}>{s.nr_anunturi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "12px 20px", textAlign: "left", fontWeight: 600 };
const td: React.CSSProperties = { padding: "12px 20px", borderBottom: "1px solid #e3e8f0" };