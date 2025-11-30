import type { Flight } from "@/types/Flight";
import axiosInstance from "../axiosInstance";

const flightsApi = {
  getAll: async (): Promise<Flight[]> => {
    const res = await axiosInstance.get("/flights");
    return res.data.data ?? [];
  },

  getById: async (id: string): Promise<Flight> => {
    const res = await axiosInstance.get(`/flights/${id}`);
    return res.data.data;
  },

  search: async (): Promise<Flight[]> => {
    const res = await axiosInstance.get("/flights/search");
    return res.data.data ?? [];
  },

  getOffers: async (): Promise<Flight[]> => {
    const res = await axiosInstance.get("/flights/offers");
    return res.data.data ?? [];
  },

  getPopular: async (): Promise<Flight[]> => {
    const res = await axiosInstance.get("/flights/popular");
    return res.data.data ?? [];
  },

  getByDestination: async (): Promise<Flight[]> => {
    const res = await axiosInstance.get("/flights/by-destination");
    return res.data.data ?? [];
  },

  getByOrigin: async (): Promise<Flight[]> => {
    const res = await axiosInstance.get("/flights/by-origin");
    return res.data.data ?? [];
  },

  create: async (data: Partial<Flight>): Promise<Flight> => {
    const res = await axiosInstance.post("/flights", data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Flight>): Promise<Flight> => {
    const res = await axiosInstance.put(`/flights/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/flights/${id}`);
  },

  updateRating: async (id: string, rating: number): Promise<Flight> => {
    const res = await axiosInstance.put(`/flights/${id}/rating`, { rating });
    return res.data.data;
  },

  toggleOffer: async (id: string, payload?: { isActive?: boolean; newPrice?: number; oldPrice?: number }): Promise<Flight> => {
    const res = await axiosInstance.put(`/flights/${id}/offer`, payload);
    return res.data.data;
  }
};

export default flightsApi;
