import { useState } from "react";
import type { PredictRequest } from "../types";

interface Props {
  onSubmit: (data: PredictRequest) => void;
  loading: boolean;
}

const defaultForm: PredictRequest = {
  city: "Alba Iulia",
  floor: 0,
  max_floor: 8,
  neighborhood: "",
  rooms: 3,
  surface_m2: 70,
  year_built: 2018,
};

export default function PredictForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<PredictRequest>(defaultForm);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }));
  };

  const reset = () => setForm(defaultForm);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { label: "Oraș", name: "city", type: "text" },
        { label: "Cartier", name: "neighborhood", type: "text" },
        { label: "Număr camere", name: "rooms", type: "number" },
        { label: "Suprafață (mp)", name: "surface_m2", type: "number" },
        { label: "Etaj", name: "floor", type: "number" },
        { label: "Etaj maxim bloc", name: "max_floor", type: "number" },
        { label: "An construcție", name: "year_built", type: "number" },
      ].map((f) => (
        <label key={f.name} style={{ fontSize: 14, fontWeight: 600, color: "#444" }}>
          {f.label}
          <input
            name={f.name}
            type={f.type}
            value={(form as any)[f.name]}
            onChange={handle}
            style={{
              display: "block", width: "100%", padding: "9px 12px", marginTop: 4,
              borderRadius: 7, border: "1px solid #d0d7e3", fontSize: 15, background: "#fafbff"
            }}
          />
        </label>
      ))}

      {/* Butoane */}
      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          onClick={() => onSubmit(form)}
          disabled={loading}
          style={{
            flex: 2, padding: "12px", background: "#1565c0", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>
          {loading ? "⏳ Se calculează..." : "🔍 Estimează prețul"}
        </button>
        <button
          onClick={reset}
          style={{
            flex: 1, padding: "12px", background: "#f0f2f5", color: "#555",
            border: "1px solid #d0d7e3", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer"
          }}>
          🔄 Resetează
        </button>
      </div>
    </div>
  );
}