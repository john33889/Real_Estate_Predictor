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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <button className="btn-back" onClick={() => navigate("/")}>← Înapoi acasă</button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: "#fff", marginBottom: 8 }}>🔍 Estimează prețul locuinței</h1>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>
          Completează detaliile locuinței și obții o estimare bazată pe date reale de piață.
        </p>
      </div>

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        {/* Stânga: formular */}
        <div className="card" style={{ flex: "1 1 380px" }}>
          <h3 style={{ color: "#fff", marginBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 14 }}>
            📋 Detalii locuință
          </h3>
          <PredictForm onSubmit={handleSubmit} loading={loading} />
          {error && (
            <div style={{ marginTop: 16, padding: 12, background: "rgba(244,67,54,0.15)", border: "1px solid rgba(244,67,54,0.4)", borderRadius: 10, color: "#ef9a9a", fontSize: 14 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Dreapta: rezultat */}
        <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: 20 }}>
          {loading && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>Se calculează estimarea...</p>
            </div>
          )}
          {!loading && !result && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
              <p style={{ color: "rgba(255,255,255,0.5)" }}>
                Completează formularul și apasă <b style={{ color: "#fff" }}>Estimează prețul</b>
              </p>
            </div>
          )}
          {result && <PredictResult result={result} />}

          <div className="card-blue" style={{ padding: 24 }}>
            <h3 style={{ color: "#fff", marginBottom: 10 }}>ℹ️ Cum funcționează?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              Modelul AI a fost antrenat pe mii de anunțuri reale din România. Estimarea ia în calcul suprafața, etajul, cartierul, anul construcției și prețurile curente de piață.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}