import { useState } from "react";
import type { PredictRequest } from "../types";

interface Props {
  onSubmit: (data: PredictRequest) => void;
  loading: boolean;
}

interface FormState {
  city: string;
  neighborhood: string;
  rooms: string;
  surface_m2: string;
  floor: string;
  max_floor: string;
  year_built: string;
}

const emptyForm: FormState = {
  city: "",
  neighborhood: "",
  rooms: "",
  surface_m2: "",
  floor: "",
  max_floor: "",
  year_built: "",
};

export default function PredictForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => setForm(emptyForm);

  const submit = () => {
    const data: PredictRequest = {
      city: form.city,
      neighborhood: form.neighborhood,
      rooms: Number(form.rooms) || 0,
      surface_m2: Number(form.surface_m2) || 0,
      floor: Number(form.floor) || 0,
      max_floor: Number(form.max_floor) || 0,
      year_built: Number(form.year_built) || 0,
    };
    onSubmit(data);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { label: "Oraș", name: "city", type: "text", placeholder: "ex: București" },
        { label: "Cartier", name: "neighborhood", type: "text", placeholder: "ex: Pipera" },
        { label: "Număr camere", name: "rooms", type: "number", placeholder: "ex: 3" },
        { label: "Suprafață (mp)", name: "surface_m2", type: "number", placeholder: "ex: 70" },
        { label: "Etaj", name: "floor", type: "number", placeholder: "ex: 2" },
        { label: "Etaj maxim bloc", name: "max_floor", type: "number", placeholder: "ex: 8" },
        { label: "An construcție", name: "year_built", type: "number", placeholder: "ex: 2020" },
      ].map((f) => (
        <label key={f.name} style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
          {f.label}
          <input
            name={f.name}
            type={f.type}
            value={(form as any)[f.name]}
            onChange={handle}
            placeholder={f.placeholder}
          />
        </label>
      ))}

      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
        <button
          onClick={submit}
          disabled={loading}
          className="btn-white"
          style={{ flex: 2 }}
        >
          {loading ? "⏳ Se calculează..." : "🔍 Estimează prețul"}
        </button>
        <button
          onClick={reset}
          className="btn-primary"
          style={{ flex: 1 }}
        >
          🔄 Resetează
        </button>
      </div>
    </div>
  );
}