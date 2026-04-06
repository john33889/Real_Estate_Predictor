import { useState } from "react";
import PredictForm from "../components/PredictForm";
import PredictResult from "../components/PredictResult";
import { predictPrice } from "../api/api";
import type { PredictRequest, PredictResponse } from "../types";

export default function PredictPage() {
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
      setError("Eroare la conectarea cu serverul. Verifică că backend-ul rulează.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>🏠 Estimează prețul locuinței</h1>
      <PredictForm onSubmit={handleSubmit} loading={loading} />
      {error && <p style={{ color: "red", marginTop: 16 }}>{error}</p>}
      {result && <PredictResult result={result} />}
    </div>
  );
}