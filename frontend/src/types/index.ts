export interface PredictRequest {
  suprafata: number;
  camere: number;
  oras: string;
  an_constructie: number;
  etaj: number;
}

export interface PredictResponse {
  pret_estimat: number;
  interval_min: number;
  interval_max: number;
  context: string;
}

export interface MarketStat {
  oras: string;
  pret_mediu: number;
  nr_anunturi: number;
}