import { useState } from "react";
import type { PredictRequest } from "../types";

interface Props {
  onSubmit: (data: PredictRequest) => void;
  loading: boolean;
}

export default function PredictForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<PredictRequest>({
    city: "",
    floor: 0,
    max_floor: 8,
    neighborhood: "",
    rooms: 3,
    surface_m2: 70,
    year_built: 2018,
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <label>Oraș
        <input name="city" type="text" value={form.city} onChange={handle} style={inp} />
      </label>
      <label>Cartier
        <input name="neighborhood" type="text" value={form.neighborhood} onChange={handle} style={inp} />
      </label>
      <label>Număr camere
        <input name="rooms" type="number" value={form.rooms} onChange={handle} style={inp} />
      </label>
      <label>Suprafață (mp)
        <input name="surface_m2" type="number" value={form.surface_m2} onChange={handle} style={inp} />
      </label>
      <label>Etaj
        <input name="floor" type="number" value={form.floor} onChange={handle} style={inp} />
      </label>
      <label>Etaj maxim al blocului
        <input name="max_floor" type="number" value={form.max_floor} onChange={handle} style={inp} />
      </label>
      <label>An construcție
        <input name="year_built" type="number" value={form.year_built} onChange={handle} style={inp} />
      </label>
      <button onClick={() => onSubmit(form)} disabled={loading}
        style={{ padding: "12px", background: "#1565c0", color: "#fff", border: "none", borderRadius: 8, fontSize: 16, cursor: "pointer" }}>
        {loading ? "Se calculează..." : "Estimează prețul"}
      </button>
    </div>
  );
}

const inp: React.CSSProperties = {
  display: "block", width: "100%", padding: 8, marginTop: 4,
  borderRadius: 6, border: "1px solid #ccc", fontSize: 15,
};