// API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
}

// User Types
export interface User {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: Date | string;
    avatarUrl?: string;
    hasPhoneVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UpdateProfileData {
    name?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

// Flight Types
export interface FlightClass {
    name: 'Economy' | 'Business' | 'First Class';
    price: number;
    availableSeats: number;
    _id?: string;
}

export interface Flight {
    _id: string;
    flightNumber: string;
    airline: string;
    airlineLogo?: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    date: Date | string;
    flightDuration: string;
    availableSeats: number;
    totalSeats: number;
    classes: FlightClass[];
    status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled' | 'delayed';
    gate?: string;
    createdAt?: string;
    updatedAt?: string;
    image?: string
}

export interface SearchFlightsParams {
    from: string;
    to: string;
    date?: string;
    passengers?: number;
    flightClass?: 'Economy' | 'Business' | 'First Class';
}

export interface CheckFlightAvailabilityParams {
    flightId: string;
    flightClass: string;
    numberOfSeats: number;
}

export interface CreateFlightData {
    flightNumber: string;
    airline: string;
    airlineLogo?: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
    flightDuration: string;
    availableSeats: number;
    totalSeats: number;
    classes: Omit<FlightClass, '_id'>[];
    gate?: string;
    status?: string;
}

// Hotel Types
export interface RoomType {
    name: string;
    description?: string;
    pricePerNight: number;
    maxGuests: number;
    availableRooms: number;
    totalRooms: number;
    amenities?: string[];
    _id?: string;
}

export interface HotelLocation {
    city: string;
    country: string;
    address: string;
}

export interface Hotel {
    _id: string;
    hotelName: string;
    hotelLogo?: string;
    location: HotelLocation;
    description?: string;
    rating: number;
    amenities?: string[];
    images?: string[];
    roomTypes: RoomType[];
    checkInTime: string;
    checkOutTime: string;
    status: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
}

export interface SearchHotelsParams {
    city: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    roomType?: string;
}

export interface CheckHotelAvailabilityParams {
    hotelId: string;
    roomType: string;
    numberOfRooms: number;
}

export interface CreateHotelData {
    hotelName: string;
    hotelLogo?: string;
    location: HotelLocation;
    description?: string;
    rating?: number;
    amenities?: string[];
    images?: string[];
    roomTypes: Omit<RoomType, '_id'>[];
    checkInTime?: string;
    checkOutTime?: string;
}

// Cart Types
export interface CartItem {
    _id: string;
    itemType: 'flight' | 'hotel';
    flight?: Flight;
    flightClass?: 'Economy' | 'Business' | 'First Class';
    passengers?: number;
    hotel?: Hotel;
    roomType?: string;
    checkInDate?: Date | string;
    checkOutDate?: Date | string;
    numberOfGuests?: number;
    numberOfNights?: number;
    price: number;
    addedAt: Date | string;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    totalPrice: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddFlightToCartData {
    flightId: string;
    flightClass: 'Economy' | 'Business' | 'First Class';
    passengers: number;
}

export interface AddHotelToCartData {
    hotelId: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
}

export interface UpdateCartItemData {
    passengers?: number;
    numberOfGuests?: number;
}

// Booking Types
export interface FlightDetails {
    flightNumber: string;
    airline: string;
    airlineLogo?: string;
    departureTime: string;
    arrivalTime: string;
    departureAirport: string;
    arrivalAirport: string;
    date: Date | string;
    flightDuration: string;
    gate?: string;
    seat?: string;
    class: string;
}

export interface HotelDetails {
    hotelName: string;
    hotelLogo?: string;
    checkInDate: Date | string;
    checkOutDate: Date | string;
    checkInTime: string;
    checkOutTime: string;
    roomNumber: string;
    roomType: string;
    numberOfGuests: number;
    numberOfNights: number;
    pricePerNight: number;
}

export interface Booking {
    _id: string;
    user: User | string;
    bookingType: 'flight' | 'hotel';
    flight?: Flight;
    flightDetails?: FlightDetails;
    hotel?: Hotel;
    hotelDetails?: HotelDetails;
    bookingReference: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
    paymentMethod?: PaymentMethod | string;
    ticketUrl?: string;
    confirmationUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateFlightBookingData {
    flightId: string;
    flightClass: 'Economy' | 'Business' | 'First Class';
    passengers: number;
    seat?: string;
    paymentMethodId: string;
}

export interface CreateHotelBookingData {
    hotelId: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    paymentMethodId: string;
}

export interface CheckoutCartData {
    paymentMethodId: string;
}

export interface UpdateBookingStatusData {
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Payment Types
export interface BillingAddress {
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

export interface PaymentMethod {
    _id: string;
    user: string;
    cardType: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
    lastFourDigits: string;
    cardholderName: string;
    expiryDate: string;
    isDefault: boolean;
    billingAddress: BillingAddress;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddPaymentMethodData {
    cardType: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
    lastFourDigits: string;
    cardholderName: string;
    expiryDate: string;
    isDefault?: boolean;
    billingAddress: BillingAddress;
}

export interface UpdatePaymentMethodData {
    cardholderName?: string;
    expiryDate?: string;
    isDefault?: boolean;
    billingAddress?: BillingAddress;
}

export interface ProcessPaymentData {
    paymentMethodId: string;
    amount: number;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    amount: number;
    paymentMethod: {
        cardType: string;
        lastFourDigits: string;
    };
    timestamp: Date | string;
}

// Destination Types
export interface Destination {
    _id: string;
    name: string;
    country: string;
    price: number;
    rating: number;
    img: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}