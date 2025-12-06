import axiosInstance from '../axiosInstance';
import type {
  ApiResponse,
  AuthResponse,
  RegisterData,
  LoginData,
  UpdateProfileData,
  ChangePasswordData,
  User,
  Flight,
  Hotel,
  SearchHotelsParams,
  CheckHotelAvailabilityParams,
  CreateHotelData,
  Cart,
  AddFlightToCartData,
  AddHotelToCartData,
  UpdateCartItemData,
  Booking,
  CreateFlightBookingData,
  CreateHotelBookingData,
  CheckoutCartData,
  UpdateBookingStatusData,
  PaymentMethod,
  AddPaymentMethodData,
  UpdatePaymentMethodData,
  ProcessPaymentData,
  PaymentResponse,
} from '@/types/api.types';

// AUTH API
export const authAPI = {
  // Register new user
  register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.put('/auth/update-profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.put('/auth/change-password', data);
    return response.data;
  },
};

const flightAPI = {
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

// HOTEL API
export const hotelAPI = {
  // Get all hotels
  getHotels: async (filters?: Record<string, string>): Promise<ApiResponse<Hotel[]>> => {
    const response = await axiosInstance.get('/hotels', { params: filters });
    return response.data;
  },

  // Get single hotel
  getHotel: async (id: string): Promise<ApiResponse<Hotel>> => {
    const response = await axiosInstance.get(`/hotels/${id}`);
    return response.data;
  },

  // Search hotels
  searchHotels: async (params: SearchHotelsParams): Promise<ApiResponse<Hotel[]>> => {
    const response = await axiosInstance.get('/hotels/search', { params });
    return response.data;
  },

  // Check hotel availability
  checkAvailability: async (params: CheckHotelAvailabilityParams): Promise<ApiResponse<{
    available: boolean;
    availableRooms: number;
    pricePerNight: number;
    maxGuests: number;
  }>> => {
    const response = await axiosInstance.get('/hotels/check-availability', { params });
    return response.data;
  },

  // Create hotel (Admin)
  createHotel: async (data: CreateHotelData): Promise<ApiResponse<Hotel>> => {
    const response = await axiosInstance.post('/hotels', data);
    return response.data;
  },

  // Update hotel (Admin)
  updateHotel: async (id: string, data: Partial<CreateHotelData>): Promise<ApiResponse<Hotel>> => {
    const response = await axiosInstance.put(`/hotels/${id}`, data);
    return response.data;
  },

  // Delete hotel (Admin)
  deleteHotel: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/hotels/${id}`);
    return response.data;
  },
};

// CART API
export const cartAPI = {
  // Get user's cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  // Add flight to cart
  addFlightToCart: async (data: AddFlightToCartData): Promise<ApiResponse<Cart>> => {
    const response = await axiosInstance.post('/cart/flight', data);
    return response.data;
  },

  // Add hotel to cart
  addHotelToCart: async (data: AddHotelToCartData): Promise<ApiResponse<Cart>> => {
    const response = await axiosInstance.post('/cart/hotel', data);
    return response.data;
  },

  // Update cart item
  updateCartItem: async (itemId: string, data: UpdateCartItemData): Promise<ApiResponse<Cart>> => {
    const response = await axiosInstance.put(`/cart/item/${itemId}`, data);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<ApiResponse<Cart>> => {
    const response = await axiosInstance.delete(`/cart/item/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<Cart>> => {
    const response = await axiosInstance.delete('/cart/clear');
    return response.data;
  },
};

// BOOKING API
export const bookingAPI = {
  // Create flight booking
  createFlightBooking: async (data: CreateFlightBookingData): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.post('/bookings/flight', data);
    return response.data;
  },

  // Create hotel booking
  createHotelBooking: async (data: CreateHotelBookingData): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.post('/bookings/hotel', data);
    return response.data;
  },

  // Checkout cart
  checkoutCart: async (data: CheckoutCartData): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.post('/bookings/checkout', data);
    return response.data;
  },

  // Get user's bookings
  getMyBookings: async (filters?: Record<string, string>): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.get('/bookings/my-bookings', { params: filters });
    return response.data;
  },

  // Get single booking
  getBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Get all bookings (Admin)
  getAllBookings: async (filters?: Record<string, string>): Promise<ApiResponse<Booking[]>> => {
    const response = await axiosInstance.get('/bookings', { params: filters });
    return response.data;
  },

  // Update booking status (Admin)
  updateBookingStatus: async (id: string, data: UpdateBookingStatusData): Promise<ApiResponse<Booking>> => {
    const response = await axiosInstance.put(`/bookings/${id}/status`, data);
    return response.data;
  },
};

// PAYMENT API
export const paymentAPI = {
  // Get payment methods
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    const response = await axiosInstance.get('/payments');
    return response.data;
  },

  // Get single payment method
  getPaymentMethod: async (id: string): Promise<ApiResponse<PaymentMethod>> => {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  },

  // Add payment method
  addPaymentMethod: async (data: AddPaymentMethodData): Promise<ApiResponse<PaymentMethod>> => {
    const response = await axiosInstance.post('/payments', data);
    return response.data;
  },

  // Update payment method
  updatePaymentMethod: async (id: string, data: UpdatePaymentMethodData): Promise<ApiResponse<PaymentMethod>> => {
    const response = await axiosInstance.put(`/payments/${id}`, data);
    return response.data;
  },

  // Set default payment method
  setDefaultPaymentMethod: async (id: string): Promise<ApiResponse<PaymentMethod>> => {
    const response = await axiosInstance.put(`/payments/${id}/set-default`);
    return response.data;
  },

  // Delete payment method
  deletePaymentMethod: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await axiosInstance.delete(`/payments/${id}`);
    return response.data;
  },

  // Process payment (Demo)
  processPayment: async (data: ProcessPaymentData): Promise<ApiResponse<PaymentResponse>> => {
    const response = await axiosInstance.post('/payments/process', data);
    return response.data;
  },
};

// Combined API client
const apiClient = {
  auth: authAPI,
  flights: flightAPI,
  hotels: hotelAPI,
  cart: cartAPI,
  bookings: bookingAPI,
  payments: paymentAPI,
};

export default apiClient;