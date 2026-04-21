import type { PredictResponse } from "../types";

interface Props { result: PredictResponse; }

export default function PredictResult({ result }: Props) {
  const copy = () => navigator.clipboard.writeText(`${result.predicted_price} ${result.currency}`);

  return (
    <div className="card" style={{ border: "1px solid white" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          background: "rgba(79,195,247,0.2)", border: "1px solid white",
          borderRadius: 14, padding: "12px 16px", fontSize: 28
        }}>💰</div>
        <div>
          <p style={{ fontSize: 12, color: "whit", marginBottom: 4 }}>PREȚ ESTIMAT</p>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#4fc3f7" }}>
            {result.predicted_price.toLocaleString("ro-RO")} {result.currency}
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {[
          { label: "Sursă", value: "Model ML" },
          { label: "Piață", value: "România" },
          { label: "Actualizat", value: "Azi" },
        ].map((item) => (
          <div key={item.label} style={{
            flex: "1 1 80px", background: "rgba(255,255,255,0.06)",
            borderRadius: 10, padding: "10px 12px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.1)"
          }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{item.value}</p>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={copy} style={{ width: "100%", marginBottom: 12 }}>
        📋 Copiază prețul
      </button>

      <div style={{ padding: 12, background: "rgba(76,175,80,0.15)", borderRadius: 10, border: "1px solid rgba(76,175,80,0.3)", fontSize: 13, color: "#a5d6a7", textAlign: "center" }}>
        ✅ Estimare generată cu succes
      </div>
    </div>
  );
}