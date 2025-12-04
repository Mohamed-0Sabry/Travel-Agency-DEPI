/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/networks/Api/client";
import type { Cart, AddFlightToCartData, AddHotelToCartData } from "@/types/api.types";
import { create } from "zustand";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  getCart: () => Promise<void>;
  addFlightToCart: (data: AddFlightToCartData) => Promise<void>;
  addHotelToCart: (data: AddHotelToCartData) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  isLoading: false,
  error: null,

  getCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.cart.getCart();
      set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch cart',
        isLoading: false,
      });
    }
  },

  addFlightToCart: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.cart.addFlightToCart(data);
      set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add flight to cart',
        isLoading: false,
      });
      throw error;
    }
  },

  addHotelToCart: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.cart.addHotelToCart(data);
      set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add hotel to cart',
        isLoading: false,
      });
      throw error;
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.cart.removeFromCart(itemId);
      set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to remove item from cart',
        isLoading: false,
      });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.cart.clearCart();
      set({ cart: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to clear cart',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
