import { useEffect, useState } from "react";
import type { PredictResponse } from "../types";

interface Props { result: PredictResponse; }

export default function PredictResult({ result }: Props) {
  const [showSuccess, setShowSuccess] = useState(true);

  useEffect(() => {
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, [result]);

  const copy = () => navigator.clipboard.writeText(`${result.predicted_price} ${result.currency}`);

  return (
    <div className="card" style={{ border: "1px solid rgba(249,217,118,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          background: "rgba(249,217,118,0.2)", border: "1px solid rgba(249,217,118,0.4)",
          borderRadius: 14, padding: "12px 16px", fontSize: 28
        }}>💰</div>
        <div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>PREȚ ESTIMAT</p>
          <h2 className="gold-accent" style={{ fontSize: "2.2rem", fontWeight: 900 }}>
            {result.predicted_price.toLocaleString("ro-RO")} {result.currency}
          </h2>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {[
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

   

      {showSuccess && (
        <div style={{
          padding: 12, background: "rgba(0, 214, 143, 0.18)",
          borderRadius: 10, border: "1px solid rgba(0, 214, 143, 0.4)",
          fontSize: 13, color: "#7fffc7", textAlign: "center",
          animation: "fadeOut 4s ease-in-out forwards"
        }}>
       
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 0; transform: translateY(-4px); }
          10% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}