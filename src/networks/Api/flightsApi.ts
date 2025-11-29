import type { Flight } from "@/types/Flight";
import axiosInstance from "../axiosInstance";

const flightsApi = {
  getAll: () => axiosInstance.get("/flights"),
  getById: (id: string) => axiosInstance.get(`/flights/${id}`),
  getOffers: () => axiosInstance.get("/offers"),
  create: (data: Flight) => axiosInstance.post("/flights", data),
  update: (id: string, data: Flight) =>
    axiosInstance.put(`/flights/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/flights/${id}`),
};

export default flightsApi;
