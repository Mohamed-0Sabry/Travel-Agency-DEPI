/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/networks/Api/client";
import type { PaymentMethod, AddPaymentMethodData, UpdatePaymentMethodData, ProcessPaymentData, PaymentResponse } from "@/types/api.types";
import { create } from "zustand";

interface PaymentState {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: PaymentMethod | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    getPaymentMethods: () => Promise<void>;
    getPaymentMethod: (id: string) => Promise<void>;
    addPaymentMethod: (data: AddPaymentMethodData) => Promise<void>;
    updatePaymentMethod: (id: string, data: UpdatePaymentMethodData) => Promise<void>;
    setDefaultPaymentMethod: (id: string) => Promise<void>;
    deletePaymentMethod: (id: string) => Promise<void>;
    processPayment: (data: ProcessPaymentData) => Promise<PaymentResponse>;
    clearSelectedPaymentMethod: () => void;
    clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
    paymentMethods: [],
    selectedPaymentMethod: null,
    isLoading: false,
    error: null,

    getPaymentMethods: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.payments.getPaymentMethods();
            set({ paymentMethods: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch payment methods',
                isLoading: false,
            });
        }
    },

    getPaymentMethod: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.payments.getPaymentMethod(id);
            set({ selectedPaymentMethod: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch payment method',
                isLoading: false,
            });
        }
    },

    addPaymentMethod: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.payments.addPaymentMethod(data);
            set((state) => ({
                paymentMethods: [...state.paymentMethods, response.data],
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to add payment method',
                isLoading: false,
            });
            throw error;
        }
    },

    updatePaymentMethod: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.payments.updatePaymentMethod(id, data);
            set((state) => ({
                paymentMethods: state.paymentMethods.map((pm) =>
                    pm._id === id ? response.data : pm
                ),
                selectedPaymentMethod:
                    state.selectedPaymentMethod?._id === id
                        ? response.data
                        : state.selectedPaymentMethod,
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update payment method',
                isLoading: false,
            });
            throw error;
        }
    },

    setDefaultPaymentMethod: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.payments.setDefaultPaymentMethod(id);
            const updatedPaymentMethod = response?.data;
            set((state) => ({
                paymentMethods: state.paymentMethods.map((pm) =>
                    pm._id === updatedPaymentMethod._id
                        ? updatedPaymentMethod
                        : { ...pm, isDefault: false }
                ),
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to set default payment method',
                isLoading: false,
            });
            throw error;
        }
    },

    deletePaymentMethod: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.payments.deletePaymentMethod(id);
            set((state) => ({
                paymentMethods: state.paymentMethods.filter((pm) => pm._id !== id),
                selectedPaymentMethod:
                    state.selectedPaymentMethod?._id === id
                        ? null
                        : state.selectedPaymentMethod,
                isLoading: false,
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete payment method',
                isLoading: false,
            });
            throw error;
        }
    },

    processPayment: async (data: ProcessPaymentData): Promise<PaymentResponse> => {
        set({ isLoading: true, error: null });
        try {
          // apiClient.payments.processPayment returns ApiResponse<PaymentResponse>
          const response = await apiClient.payments.processPayment(data);
          const paymentResult: PaymentResponse = response.data;
      
          set({ isLoading: false });
      
          // return the server truth so caller can show receipt etc.
          return paymentResult;
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to process payment',
            isLoading: false,
          });
          throw error; // preserve current behavior so callers can handle it
        }
      },
      

    clearSelectedPaymentMethod: () => set({ selectedPaymentMethod: null }),
    clearError: () => set({ error: null }),
}));