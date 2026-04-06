import type { PredictResponse } from "../types";

interface Props {
  result: PredictResponse;
}

export default function PredictResult({ result }: Props) {
  return (
    <div style={{ marginTop: 24, padding: 24, background: "#f0f7ff", borderRadius: 12, maxWidth: 400 }}>
      <h2 style={{ color: "#1976d2" }}>
        💰 {result.pret_estimat.toLocaleString("ro-RO")} €
      </h2>
      <p>Interval: <b>{result.interval_min.toLocaleString("ro-RO")} €</b> – <b>{result.interval_max.toLocaleString("ro-RO")} €</b></p>
      <p style={{ color: "#555" }}>{result.context}</p>
    </div>
  );
}