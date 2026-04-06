import { useState } from "react";
import type { PredictRequest } from "../types";

interface Props {
  onSubmit: (data: PredictRequest) => void;
  loading: boolean;
}

export default function PredictForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<PredictRequest>({
    suprafata: 0,
    camere: 1,
    oras: "",
    an_constructie: 2000,
    etaj: 0,
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <label>Suprafață (mp)
        <input name="suprafata" type="number" value={form.suprafata} onChange={handle} style={inp} />
      </label>
      <label>Număr camere
        <input name="camere" type="number" value={form.camere} onChange={handle} style={inp} />
      </label>
      <label>Oraș
        <input name="oras" type="text" value={form.oras} onChange={handle} style={inp} />
      </label>
      <label>An construcție
        <input name="an_constructie" type="number" value={form.an_constructie} onChange={handle} style={inp} />
      </label>
      <label>Etaj
        <input name="etaj" type="number" value={form.etaj} onChange={handle} style={inp} />
      </label>
      <button onClick={() => onSubmit(form)} disabled={loading}
        style={{ padding: "12px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}>
        {loading ? "Se calculează..." : "Estimează prețul"}
      </button>
    </div>
  );
}

const inp: React.CSSProperties = {
  display: "block", width: "100%", padding: 8, marginTop: 4,
  borderRadius: 6, border: "1px solid #ccc", fontSize: 15,
};