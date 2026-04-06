import { useEffect, useState } from "react";
import { getMarketStats } from "../api/api";
import type { MarketStat } from "../types";

export default function DashboardPage() {
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
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>📊 Dashboard piață imobiliară</h1>
      {loading && <p>Se încarcă datele...</p>}
      {error && <p style={{ color: "orange" }}>{error}</p>}
      {!loading && !error && (
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 600 }}>
          <thead>
            <tr style={{ background: "#1976d2", color: "#fff" }}>
              <th style={th}>Oraș</th>
              <th style={th}>Preț mediu (€)</th>
              <th style={th}>Nr. anunțuri</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#f5f5f5" : "#fff" }}>
                <td style={td}>{s.oras}</td>
                <td style={td}>{s.pret_mediu.toLocaleString("ro-RO")} €</td>
                <td style={td}>{s.nr_anunturi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 16px", textAlign: "left" };
const td: React.CSSProperties = { padding: "10px 16px", borderBottom: "1px solid #ddd" };