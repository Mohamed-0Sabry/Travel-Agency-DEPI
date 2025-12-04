/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/networks/Api/client";
import type { User, RegisterData, LoginData, UpdateProfileData, ChangePasswordData } from "@/types/api.types";
import { create } from "zustand";
import { persist } from 'zustand/middleware';


interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
    // Actions
    register: (data: RegisterData) => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    changePassword: (data: ChangePasswordData) => Promise<void>;
    clearError: () => void;
  }
  
  export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
  
        register: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.auth.register(data);
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Registration failed',
              isLoading: false,
            });
            throw error;
          }
        },
  
        login: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.auth.login(data);
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Login failed',
              isLoading: false,
            });
            throw error;
          }
        },
  
        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        },
  
        getCurrentUser: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.auth.getCurrentUser();
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to fetch user',
              isLoading: false,
              isAuthenticated: false,
            });
            throw error;
          }
        },
  
        updateProfile: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await apiClient.auth.updateProfile(data);
            set({
              user: response.data,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to update profile',
              isLoading: false,
            });
            throw error;
          }
        },
  
        changePassword: async (data) => {
          set({ isLoading: true, error: null });
          try {
            await apiClient.auth.changePassword(data);
            set({ isLoading: false });
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to change password',
              isLoading: false,
            });
            throw error;
          }
        },
  
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  );
  