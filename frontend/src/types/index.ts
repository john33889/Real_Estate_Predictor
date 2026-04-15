export interface PredictRequest {
  city: string;
  floor: number;
  max_floor: number;
  neighborhood: string;
  rooms: number;
  surface_m2: number;
  year_built: number;
}

export interface PredictResponse {
  predicted_price: number;
  currency: string;
}

export interface MarketStat {
  oras: string;
  pret_mediu: number;
  nr_anunturi: number;
}