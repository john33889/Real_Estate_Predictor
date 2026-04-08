import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictForm from "../components/PredictForm";
import PredictResult from "../components/PredictResult";
import { predictPrice } from "../api/api";
import type { PredictRequest, PredictResponse } from "../types";

export default function PredictPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: PredictRequest) => {
    setLoading(true);
    setError("");
    try {
      const res = await predictPrice(data);
      setResult(res.data);
    } catch {
      setError("Eroare la conectarea cu serverul.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={() => navigate("/")} style={{
        marginBottom: 24, background: "none", border: "1px solid #d0d7e3",
        borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#555",
        fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6
      }}>
        ← Înapoi acasă
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#1565c0" }}>🔍 Estimează prețul locuinței</h1>
        <p style={{ color: "#666", marginTop: 6 }}>
          Completează detaliile locuinței și obții o estimare bazată pe date reale de piață.
        </p>
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        <div className="card" style={{ flex: "1 1 380px" }}>
          <h3 style={{ marginBottom: 20, color: "#333", borderBottom: "2px solid #e3e8f0", paddingBottom: 12 }}>
            📋 Detalii locuință
          </h3>
          <PredictForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div style={{ marginTop: 16, padding: 12, background: "#fff3f3", border: "1px solid #ffcccc", borderRadius: 8, color: "#c62828", fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 20 }}>
          {loading && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
              <p style={{ color: "#666" }}>Se calculează estimarea...</p>
            </div>
          )}
          {!loading && !result && (
            <div className="card" style={{ textAlign: "center", padding: 48, color: "#aaa" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
              <p>Completează formularul și apasă <b>Estimează prețul</b></p>
            </div>
          )}
          {result && <PredictResult result={result} />}

          <div className="card" style={{ background: "#f0f7ff", border: "1px solid #bbdefb" }}>
            <h3 style={{ color: "#1565c0", marginBottom: 12 }}>ℹ️ Cum funcționează?</h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
              Modelul AI a fost antrenat pe mii de anunțuri reale din România. Estimarea ia în calcul suprafața, etajul, cartierul, anul construcției și prețurile curente de piață.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}