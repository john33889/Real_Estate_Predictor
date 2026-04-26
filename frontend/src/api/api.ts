import axios from "axios";
import type { PredictRequest, PredictResponse, MarketStat } from "../types";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

export const predictPrice = (data: PredictRequest) =>
  API.post<PredictResponse>("/predict", data);

export const getMarketStats = () =>
  API.get<MarketStat[]>("/market-stats");