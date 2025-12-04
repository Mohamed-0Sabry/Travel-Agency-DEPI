/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/networks/Api/client";
import type { Hotel, SearchHotelsParams } from "@/types/api.types";
import { create } from "zustand";

interface HotelState {
    hotels: Hotel[];
    selectedHotel: Hotel | null;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    getHotels: (filters?: Record<string, string>) => Promise<void>;
    getHotel: (id: string) => Promise<void>;
    searchHotels: (params: SearchHotelsParams) => Promise<void>;
    clearSelectedHotel: () => void;
    clearError: () => void;
  }
  
  export const useHotelStore = create<HotelState>((set) => ({
    hotels: [],
    selectedHotel: null,
    isLoading: false,
    error: null,
  
    getHotels: async (filters) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.hotels.getHotels(filters);
        set({ hotels: response.data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to fetch hotels',
          isLoading: false,
        });
      }
    },
  
    getHotel: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.hotels.getHotel(id);
        set({ selectedHotel: response.data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to fetch hotel',
          isLoading: false,
        });
      }
    },
  
    searchHotels: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.hotels.searchHotels(params);
        set({ hotels: response.data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to search hotels',
          isLoading: false,
        });
      }
    },
  
    clearSelectedHotel: () => set({ selectedHotel: null }),
    clearError: () => set({ error: null }),
  }));
  