import type { PredictResponse } from "../types";

interface Props { result: PredictResponse; }

export default function PredictResult({ result }: Props) {
  return (
    <div className="card" style={{ border: "2px solid #1565c0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#1565c0", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 24 }}>💰</div>
        <div>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>Preț estimat</p>
          <h2 style={{ color: "#1565c0", fontSize: "2rem" }}>
            {result.predicted_price.toLocaleString("ro-RO")} {result.currency}
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "🤖 Sursă", value: "Model ML" },
          { label: "📍 Piață", value: "România" },
          { label: "📅 Actualizat", value: "Azi" },
        ].map((item) => (
          <div key={item.label} style={{
            flex: "1 1 100px", background: "#f8f9ff", borderRadius: 8,
            padding: "10px 14px", textAlign: "center"
          }}>
            <p style={{ fontSize: 12, color: "#888" }}>{item.label}</p>
            <p style={{ fontWeight: 600, color: "#333", marginTop: 4 }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, background: "#e8f5e9", borderRadius: 8, fontSize: 13, color: "#2e7d32" }}>
        ✅ Estimarea a fost generată cu succes pe baza datelor introduse.
      </div>
    </div>
  );
}