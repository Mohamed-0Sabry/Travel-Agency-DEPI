import type { Flight } from "@/types/Flight";
import { create } from "zustand";
import flightsApi from "@/networks/Api/flightsApi";
import axios from "axios";
interface FlightStore {
  flights: Flight[];
  activeOffers: Flight[];
  loading: boolean;
  error: string | null;
  setFlights: (data: Flight[]) => void;
  addFlight: (data: Flight) => void;
  updateFlight: (id: string, data: Flight) => void;
  deleteFlight: (id: string) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  fetchFlights: () => Promise<void>;
  fetchOffers: () => Promise<void>;
}
const useFlightStore = create<FlightStore>((set) => ({
  flights: [],
  activeOffers: [],
  loading: false,
  error: null,

  setFlights: (data: Flight[]) => set({ flights: data }),
  addFlight: (data: Flight) =>
    set((state) => ({ flights: [...state.flights, data] })),
  updateFlight: (id: string, data: Partial<Flight>) =>
    set((state) => ({
      flights: state.flights.map((flight) =>
        flight._id === id ? { ...flight, ...data } : flight
      ),
    })),

  deleteFlight: (id: string) =>
    set((state) => ({
      flights: state.flights.filter((flight) => flight._id !== id),
    })),
  setLoading: (value: boolean) => set({ loading: value }),
  setError: (value: string | null) => set({ error: value }),
  fetchFlights: async () => {
    set({ loading: true, error: null });
    try {
      const response = await flightsApi.getAll();
      set({ flights: response });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({ error: err.response?.data?.message || "Something went wrong" });
      }
    }
    set({ loading: false });
  },
  fetchOffers: async () => {
    set({ loading: true, error: null });
    try {
      const offers = await flightsApi.getOffers();
      set({ activeOffers: offers });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        set({ error: err.response?.data?.message || "Something went wrong" });
      }
    }
    set({ loading: false });
  },
}));

export default useFlightStore;
