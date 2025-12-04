/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/networks/Api/client";
import type { Booking, CreateFlightBookingData, CreateHotelBookingData, CheckoutCartData } from "@/types/api.types";
import { create } from "zustand";

interface BookingState {
    bookings: Booking[];
    selectedBooking: Booking | null;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    getMyBookings: (filters?: Record<string, string>) => Promise<void>;
    getBooking: (id: string) => Promise<void>;
    createFlightBooking: (data: CreateFlightBookingData) => Promise<void>;
    createHotelBooking: (data: CreateHotelBookingData) => Promise<void>;
    checkoutCart: (data: CheckoutCartData) => Promise<void>;
    cancelBooking: (id: string) => Promise<void>;
    clearSelectedBooking: () => void;
    clearError: () => void;
  }
  
  export const useBookingStore = create<BookingState>((set) => ({
    bookings: [],
    selectedBooking: null,
    isLoading: false,
    error: null,
  
    getMyBookings: async (filters) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.bookings.getMyBookings(filters);
        set({ bookings: response.data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to fetch bookings',
          isLoading: false,
        });
      }
    },
  
    getBooking: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.bookings.getBooking(id);
        set({ selectedBooking: response.data, isLoading: false });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to fetch booking',
          isLoading: false,
        });
      }
    },
  
    createFlightBooking: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.bookings.createFlightBooking(data);
        set((state) => ({
          bookings: [response.data, ...state.bookings],
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to create flight booking',
          isLoading: false,
        });
        throw error;
      }
    },
  
    createHotelBooking: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.bookings.createHotelBooking(data);
        set((state) => ({
          bookings: [response.data, ...state.bookings],
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to create hotel booking',
          isLoading: false,
        });
        throw error;
      }
    },
  
    checkoutCart: async (data) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.bookings.checkoutCart(data);
        set((state) => ({
          bookings: [...response.data, ...state.bookings],
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to checkout cart',
          isLoading: false,
        });
        throw error;
      }
    },
  
    cancelBooking: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.bookings.cancelBooking(id);
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking._id === id ? response.data : booking
          ),
          selectedBooking:
            state.selectedBooking?._id === id
              ? response.data
              : state.selectedBooking,
          isLoading: false,
        }));
      } catch (error: any) {
        set({
          error: error.response?.data?.message || 'Failed to cancel booking',
          isLoading: false,
        });
        throw error;
      }
    },
  
    clearSelectedBooking: () => set({ selectedBooking: null }),
    clearError: () => set({ error: null }),
  }));
  