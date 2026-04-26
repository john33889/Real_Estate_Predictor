import Papa from "papaparse";

export interface RealEstateRow {
  price: number;
  surface_m2: number;
  rooms: number;
  floor: number;
  max_floor: number;
  neighborhood: string;
  city: string;
  year_built: number;
  url: string;
  price_per_m2: number;
}

let cachedData: RealEstateRow[] | null = null;

export async function loadCsvData(): Promise<RealEstateRow[]> {
  if (cachedData) return cachedData;

  const response = await fetch("/imobiliare_data.csv");
  const text = await response.text();

  return new Promise((resolve) => {
    Papa.parse<any>(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows: RealEstateRow[] = result.data
          .filter((r) => r.price && r.surface_m2 && r.city && r.neighborhood && r.url)
          .map((r) => ({
            price: Number(r.price),
            surface_m2: Number(r.surface_m2),
            rooms: Number(r.rooms) || 1,
            floor: Number(r.floor) || 0,
            max_floor: Number(r.max_floor) || 4,
            neighborhood: String(r.neighborhood),
            city: String(r.city),
            year_built: Number(r.year_built) || 2020,
            url: String(r.url),
            price_per_m2: Number(r.price_per_m2) || 0,
          }));
        cachedData = rows;
        resolve(rows);
      },
    });
  });
}

interface SearchCriteria {
  city: string;
  neighborhood: string;
  rooms: number;
  surface_m2: number;
}

export function findSimilarProperties(
  data: RealEstateRow[],
  criteria: SearchCriteria,
  limit: number = 4
): RealEstateRow[] {
  const cityLower = criteria.city.toLowerCase().trim();
  const neighborhoodLower = criteria.neighborhood.toLowerCase().trim();

  // Calculează un scor de similaritate pentru fiecare anunț
  const scored = data.map((row) => {
    let score = 0;

    // +50 pentru același oraș
    if (row.city.toLowerCase() === cityLower) score += 50;
    else if (row.city.toLowerCase().includes(cityLower) || cityLower.includes(row.city.toLowerCase())) score += 20;

    // +30 pentru același cartier
    if (neighborhoodLower && row.neighborhood.toLowerCase() === neighborhoodLower) score += 30;
    else if (neighborhoodLower && row.neighborhood.toLowerCase().includes(neighborhoodLower)) score += 15;

    // +20 pentru același număr de camere
    if (row.rooms === criteria.rooms) score += 20;
    else if (Math.abs(row.rooms - criteria.rooms) === 1) score += 8;

    // +20 pentru suprafață apropiată (±10%)
    const surfaceDiff = Math.abs(row.surface_m2 - criteria.surface_m2) / criteria.surface_m2;
    if (surfaceDiff <= 0.1) score += 20;
    else if (surfaceDiff <= 0.25) score += 10;

    return { row, score };
  });

  return scored
    .filter((s) => s.score > 20) // exclude rezultate slabe
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.row);
}