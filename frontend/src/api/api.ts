import axios from "axios";
import type { PredictRequest, PredictResponse, MarketStat } from "../types";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.0.127:80800",
});

export const predictPrice = (data: PredictRequest) =>
  API.post<PredictResponse>("/predict", data);

export const getMarketStats = () =>
  API.get<MarketStat[]>("/market-stats");