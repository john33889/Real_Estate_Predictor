import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, CartesianGrid, Area, AreaChart } from "recharts";
import { loadCsvData, type RealEstateRow } from "../utils/csvData";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<RealEstateRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedRooms, setSelectedRooms] = useState<number | "all">("all");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");

  useEffect(() => {
    loadCsvData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const allCities = useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach((r) => { map[r.city] = (map[r.city] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (selectedCity !== "all" && r.city !== selectedCity) return false;
      if (selectedRooms !== "all" && r.rooms !== selectedRooms) return false;
      if (priceMin && r.price < Number(priceMin)) return false;
      if (priceMax && r.price > Number(priceMax)) return false;
      return true;
    });
  }, [data, selectedCity, selectedRooms, priceMin, priceMax]);

  const stats = useMemo(() => {
    if (filtered.length === 0) return null;

    const totalListings = filtered.length;
    const avgPrice = Math.round(filtered.reduce((s, r) => s + r.price, 0) / totalListings);
    const ppm = filtered.filter((r) => r.price_per_m2 > 0);
    const avgPricePerM2 = ppm.length > 0 ? Math.round(ppm.reduce((s, r) => s + r.price_per_m2, 0) / ppm.length) : 0;
    const avgSurface = Math.round(filtered.reduce((s, r) => s + r.surface_m2, 0) / totalListings);

    const cityMap: Record<string, { total: number; sumPrice: number }> = {};
    filtered.forEach((r) => {
      if (!cityMap[r.city]) cityMap[r.city] = { total: 0, sumPrice: 0 };
      cityMap[r.city].total++;
      cityMap[r.city].sumPrice += r.price;
    });
    const topCities = Object.entries(cityMap)
      .map(([city, v]) => ({ city, listings: v.total, avgPrice: Math.round(v.sumPrice / v.total) }))
      .sort((a, b) => b.listings - a.listings)
      .slice(0, 8);

    const roomDist: Record<number, number> = {};
    filtered.forEach((r) => { roomDist[r.rooms] = (roomDist[r.rooms] || 0) + 1; });
    const roomsData = Object.entries(roomDist)
      .map(([rooms, count]) => ({ name: `${rooms} ${Number(rooms) === 1 ? "cameră" : "camere"}`, value: count }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name))
      .slice(0, 6);

    // EVOLUȚIA prețurilor pe ani de construcție
    const yearMap: Record<number, { sumPrice: number; sumPpm: number; count: number; countPpm: number }> = {};
    filtered.forEach((r) => {
      if (r.year_built < 1950 || r.year_built > 2030) return;
      if (!yearMap[r.year_built]) yearMap[r.year_built] = { sumPrice: 0, sumPpm: 0, count: 0, countPpm: 0 };
      yearMap[r.year_built].sumPrice += r.price;
      yearMap[r.year_built].count++;
      if (r.price_per_m2 > 0) {
        yearMap[r.year_built].sumPpm += r.price_per_m2;
        yearMap[r.year_built].countPpm++;
      }
    });

    const priceByYear = Object.entries(yearMap)
      .filter(([_, v]) => v.count >= 3) // ignoră anii cu mai puțin de 3 anunțuri
      .map(([year, v]) => ({
        year: Number(year),
        avgPrice: Math.round(v.sumPrice / v.count),
        avgPricePerM2: v.countPpm > 0 ? Math.round(v.sumPpm / v.countPpm) : 0,
        listings: v.count,
      }))
      .sort((a, b) => a.year - b.year);

    return { totalListings, avgPrice, avgPricePerM2, avgSurface, topCities, roomsData, priceByYear };
  }, [filtered]);

  const resetFilters = () => {
    setSelectedCity("all");
    setSelectedRooms("all");
    setPriceMin("");
    setPriceMax("");
  };

  const hasFilters = selectedCity !== "all" || selectedRooms !== "all" || priceMin || priceMax;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", position: "relative", zIndex: 1 }}>
      <button className="btn-back" onClick={() => navigate("/")}>← Înapoi acasă</button>

      <h1 style={{ color: "#fff", marginBottom: 8 }}>📊 Dashboard piață imobiliară</h1>
      <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 28 }}>
        Filtrează datele pentru a obține insights personalizate din baza de anunțuri.
      </p>

      {loading && (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p>Se încarcă datele...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* PANOU FILTRE */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                🎛️ Filtre
                {hasFilters && (
                  <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(249,217,118,0.2)", border: "1px solid rgba(249,217,118,0.4)", borderRadius: 12, color: "#f9d976", fontWeight: 600 }}>
                    ACTIVE
                  </span>
                )}
              </h3>
              {hasFilters && (
                <button onClick={resetFilters} style={{
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit"
                }}>
                  ✕ Resetează
                </button>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              <div>
                <label>Oraș</label>
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  <option value="all">Toate orașele</option>
                  {allCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Număr camere</label>
                <select value={selectedRooms} onChange={(e) => setSelectedRooms(e.target.value === "all" ? "all" : Number(e.target.value))}>
                  <option value="all">Toate</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? "cameră" : "camere"}</option>)}
                </select>
              </div>
              <div>
                <label>Preț minim (€)</label>
                <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="ex: 50000" />
              </div>
              <div>
                <label>Preț maxim (€)</label>
                <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="ex: 200000" />
              </div>
            </div>
          </div>

          {!stats ? (
            <div className="card" style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>Niciun anunț nu corespunde filtrelor selectate.</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  { icon: "🏠", label: "Anunțuri afișate", value: stats.totalListings.toLocaleString("ro-RO") },
                  { icon: "💰", label: "Preț mediu", value: `${stats.avgPrice.toLocaleString("ro-RO")} €` },
                  { icon: "📐", label: "Preț mediu / m²", value: `${stats.avgPricePerM2.toLocaleString("ro-RO")} €` },
                  { icon: "📏", label: "Suprafață medie", value: `${stats.avgSurface} m²` },
                ].map((s) => (
                  <div key={s.label} className="card" style={{ padding: 20 }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 4, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</p>
                    <p className="gold-accent" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* GRAFIC EVOLUȚIE PE ANI */}
              {stats.priceByYear.length >= 3 && (
                <div className="card" style={{ marginBottom: 28 }}>
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ color: "#fff", marginBottom: 4 }}>📈 Evoluția prețului mediu pe anul construcției</h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                      Cum variază prețul mediu în funcție de anul în care a fost construită locuința — de la {stats.priceByYear[0].year} până la {stats.priceByYear[stats.priceByYear.length - 1].year}
                    </p>
                  </div>
                  <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                      <AreaChart data={stats.priceByYear} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                        <defs>
                          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f9d976" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#0a8050" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="year" stroke="rgba(255,255,255,0.6)" style={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ background: "rgba(15, 61, 46, 0.95)", border: "1px solid rgba(249,217,118,0.4)", borderRadius: 10, color: "#fff" }}
                          formatter={(value: any, name: any) => {
                            if (name === "avgPrice") return [`${value.toLocaleString("ro-RO")} €`, "Preț mediu"];
                            if (name === "listings") return [value, "Anunțuri"];
                            return [value, name];
                          }}
                          labelFormatter={(label) => `Anul construcției: ${label}`}
                          cursor={{ stroke: "rgba(249,217,118,0.4)", strokeWidth: 2 }}
                        />
                        <Area type="monotone" dataKey="avgPrice" stroke="#f9d976" strokeWidth={3} fill="url(#priceGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Top Orașe */}
              {selectedCity === "all" && (
                <div className="card" style={{ marginBottom: 28 }}>
                  <h3 style={{ color: "#fff", marginBottom: 16 }}>🏙️ Top orașe — preț mediu</h3>
                  <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={stats.topCities} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <XAxis dataKey="city" stroke="rgba(255,255,255,0.6)" style={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ background: "rgba(15, 61, 46, 0.95)", border: "1px solid rgba(249,217,118,0.4)", borderRadius: 10, color: "#fff" }}
                         formatter={(value: any) => [`${value.toLocaleString("ro-RO")} €`, "Preț mediu"]}
                          cursor={{ fill: "rgba(249,217,118,0.1)" }}
                        />
                        <Bar dataKey="avgPrice" radius={[8, 8, 0, 0]}>
                          {stats.topCities.map((_, i) => (
                            <Cell key={i} fill={`url(#goldGradient${i})`} />
                          ))}
                        </Bar>
                        <defs>
                          {stats.topCities.map((_, i) => (
                            <linearGradient key={i} id={`goldGradient${i}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f9d976" stopOpacity={0.95} />
                              <stop offset="100%" stopColor="#d4a017" stopOpacity={0.7} />
                            </linearGradient>
                          ))}
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Tabel */}
              <div className="card" style={{ marginBottom: 28 }}>
                <h3 style={{ color: "#fff", marginBottom: 16 }}>📍 Detaliu pe orașe</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                        <th style={th}>Oraș</th>
                        <th style={th}>Anunțuri</th>
                        <th style={th}>Preț mediu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topCities.map((c, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <td style={td}>{c.city}</td>
                          <td style={td}>{c.listings.toLocaleString("ro-RO")}</td>
                          <td style={{ ...td, color: "#f9d976", fontWeight: 700 }}>{c.avgPrice.toLocaleString("ro-RO")} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Distribuție camere */}
              {selectedRooms === "all" && (
                <div className="card">
                  <h3 style={{ color: "#fff", marginBottom: 16 }}>🛋️ Distribuție pe număr de camere</h3>
                  <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer>
                      <BarChart data={stats.roomsData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" style={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ background: "rgba(15, 61, 46, 0.95)", border: "1px solid rgba(0,214,143,0.4)", borderRadius: 10, color: "#fff" }}
                         formatter={(value: any) => [value.toLocaleString("ro-RO"), "Anunțuri"]}
                          cursor={{ fill: "rgba(0,214,143,0.1)" }}
                        />
                        <Bar dataKey="value" fill="rgba(0,214,143,0.7)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "12px 16px", textAlign: "left", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "12px 16px", color: "#fff", fontSize: 14 };