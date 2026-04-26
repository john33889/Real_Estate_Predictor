import type { RealEstateRow } from "../utils/csvData";

interface Props {
  properties: RealEstateRow[];
}

export default function SimilarProperties({ properties }: Props) {
  if (properties.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
          Nu am găsit anunțuri similare în baza de date pentru această căutare.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
        <span style={{ fontSize: 22 }}>🏘️</span>
        <div>
          <h3 style={{ color: "#fff", fontSize: "1.05rem", marginBottom: 2 }}>Anunțuri similare reale</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
            {properties.length} {properties.length === 1 ? "rezultat găsit" : "rezultate găsite"} în baza de date
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {properties.map((p, i) => (
          <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{
            display: "block",
            padding: 14,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            textDecoration: "none",
            transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, marginBottom: 8 }}>
              <div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                  📍 {p.neighborhood}, {p.city}
                </p>
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                  {p.rooms} {p.rooms === 1 ? "cameră" : "camere"} · {p.surface_m2} mp · etaj {p.floor}/{p.max_floor} · construit {p.year_built}
                </p>
              </div>
              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <p className="gold-accent" style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                  {p.price.toLocaleString("ro-RO")} €
                </p>
                {p.price_per_m2 > 0 && (
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                    {p.price_per_m2.toLocaleString("ro-RO")} €/mp
                  </p>
                )}
              </div>
            </div>
            <p style={{ fontSize: 11, color: "rgba(249,217,118,0.85)", fontWeight: 600 }}>
              🔗 Vezi anunțul pe imobiliare.ro →
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}