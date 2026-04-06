import type { PredictResponse } from "../types";

interface Props {
  result: PredictResponse;
}

export default function PredictResult({ result }: Props) {
  return (
    <div style={{ marginTop: 24, padding: 24, background: "#f0f7ff", borderRadius: 12, maxWidth: 400 }}>
      <h2 style={{ color: "#1565c0" }}>
        💰 {result.predicted_price.toLocaleString("ro-RO")} {result.currency}
      </h2>
      <p style={{ color: "#555", marginTop: 8 }}>Estimare generată de modelul AI.</p>
    </div>
  );
}