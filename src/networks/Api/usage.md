
# API Client Usage Examples

This *part* provides practical examples of how to use the API client.

## Usage Examples

### Authentication

#### Register New User

```typescript
import apiClient from '@/api/client';
import { RegisterData } from '@/api/types';

const handleRegister = async () => {
  try {
    const registerData: RegisterData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phoneNumber: '+1234567890',
      address: '123 Main St, City',
      dateOfBirth: '1990-01-01'
    };

    const response = await apiClient.auth.register(registerData);
    
    if (response.success) {
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('User registered:', response.data.user);
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

#### Login User

```typescript
import apiClient from '@/api/client';
import { LoginData } from '@/api/types';

const handleLogin = async (email: string, password: string) => {
  try {
    const loginData: LoginData = { email, password };
    const response = await apiClient.auth.login(loginData);
    
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Logged in:', response.data.user);
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### Get Current User

```typescript
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { User } from '@/api/types';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.auth.getCurrentUser();
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
};
```

### Flights

#### Search Flights

```typescript
import { useState } from 'react';
import apiClient from '@/api/client';
import { Flight, SearchFlightsParams } from '@/api/types';

const FlightSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const searchFlights = async () => {
    setLoading(true);
    try {
      const params: SearchFlightsParams = {
        from: 'ACC',
        to: 'LHR',
        date: '2025-12-11',
        passengers: 2,
        flightClass: 'Economy'
      };

      const response = await apiClient.flights.searchFlights(params);
      
      if (response.success) {
        setFlights(response.data);
        console.log(`Found ${response.count} flights`);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={searchFlights} disabled={loading}>
        Search Flights
      </button>
      
      {flights.map(flight => (
        <div key={flight._id}>
          <h3>{flight.airline} - {flight.flightNumber}</h3>
          <p>{flight.departureAirport} → {flight.arrivalAirport}</p>
          <p>Duration: {flight.flightDuration}</p>
        </div>
      ))}
    </div>
  );
};
```

#### Get All Flights

```typescript
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Flight } from '@/api/types';

const FlightList = () => {
  const [flights, setFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await apiClient.flights.getFlights();
        if (response.success) {
          setFlights(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch flights:', error);
      }
    };

    fetchFlights();
  }, []);

  return (
    <div>
      {flights.map(flight => (
        <div key={flight._id}>{flight.flightNumber}</div>
      ))}
    </div>
  );
};
```

#### Create Flight (Admin)

```typescript
import apiClient from '@/api/client';
import { CreateFlightData } from '@/api/types';

const createNewFlight = async () => {
  try {
    const flightData: CreateFlightData = {
      flightNumber: 'AA100',
      airline: 'American Airlines',
      airlineLogo: 'https://example.com/logo.png',
      departureAirport: 'JFK',
      arrivalAirport: 'LAX',
      departureTime: '10:00 AM',
      arrivalTime: '1:00 PM',
      date: '2025-12-25',
      flightDuration: '6h 00min',
      availableSeats: 150,
      totalSeats: 180,
      classes: [
        { name: 'Economy', price: 300, availableSeats: 120 },
        { name: 'Business', price: 800, availableSeats: 30 }
      ],
      gate: '5B'
    };

    const response = await apiClient.flights.createFlight(flightData);
    
    if (response.success) {
      console.log('Flight created:', response.data);
    }
  } catch (error) {
    console.error('Failed to create flight:', error);
  }
};
```

### Hotels

#### Search Hotels

```typescript
import apiClient from '@/api/client';
import { SearchHotelsParams } from '@/api/types';

const searchHotels = async () => {
  try {
    const params: SearchHotelsParams = {
      city: 'Dubai',
      checkInDate: '2025-12-20',
      checkOutDate: '2025-12-25',
      guests: 2,
      roomType: 'Deluxe Suite'
    };

    const response = await apiClient.hotels.searchHotels(params);
    
    if (response.success) {
      console.log('Hotels found:', response.data);
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

#### Get Hotel Details

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/api/client';
import { Hotel } from '@/api/types';

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!id) return;
      
      try {
        const response = await apiClient.hotels.getHotel(id);
        if (response.success) {
          setHotel(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch hotel:', error);
      }
    };

    fetchHotel();
  }, [id]);

  if (!hotel) return <div>Loading...</div>;

  return (
    <div>
      <h1>{hotel.hotelName}</h1>
      <p>{hotel.location.city}, {hotel.location.country}</p>
      <p>Rating: {hotel.rating}/5</p>
      <p>{hotel.description}</p>
      
      <h2>Room Types</h2>
      {hotel.roomTypes.map(room => (
        <div key={room.name}>
          <h3>{room.name}</h3>
          <p>${room.pricePerNight} per night</p>
          <p>Max guests: {room.maxGuests}</p>
          <p>Available rooms: {room.availableRooms}</p>
        </div>
      ))}
    </div>
  );
};
```

### Cart

#### Add Flight to Cart

```typescript
import apiClient from '@/api/client';
import { AddFlightToCartData } from '@/api/types';

const addToCart = async (flightId: string) => {
  try {
    const data: AddFlightToCartData = {
      flightId,
      flightClass: 'Economy',
      passengers: 2
    };

    const response = await apiClient.cart.addFlightToCart(data);
    
    if (response.success) {
      console.log('Added to cart:', response.data);
      console.log('Total price:', response.data.totalPrice);
    }
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

#### Add Hotel to Cart

```typescript
import apiClient from '@/api/client';
import { AddHotelToCartData } from '@/api/types';

const addHotelToCart = async (hotelId: string) => {
  try {
    const data: AddHotelToCartData = {
      hotelId,
      roomType: 'Deluxe Suite',
      checkInDate: '2025-12-20',
      checkOutDate: '2025-12-23',
      numberOfGuests: 2
    };

    const response = await apiClient.cart.addHotelToCart(data);
    
    if (response.success) {
      console.log('Hotel added to cart:', response.data);
    }
  } catch (error) {
    console.error('Failed to add hotel to cart:', error);
  }
};
```

#### View Cart

```typescript
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Cart } from '@/api/types';

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await apiClient.cart.getCart();
        if (response.success) {
          setCart(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await apiClient.cart.removeFromCart(itemId);
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  if (!cart) return <div>Loading cart...</div>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>Items: {cart.items.length}</p>
      <p>Total: ${cart.totalPrice}</p>

      {cart.items.map(item => (
        <div key={item._id}>
          <p>Type: {item.itemType}</p>
          <p>Price: ${item.price}</p>
          <button onClick={() => handleRemoveItem(item._id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
```

#### Clear Cart

```typescript
import apiClient from '@/api/client';

const clearCart = async () => {
  try {
    const response = await apiClient.cart.clearCart();
    if (response.success) {
      console.log('Cart cleared');
    }
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
};
```

### Bookings

#### Checkout Cart

```typescript
import apiClient from '@/api/client';
import { CheckoutCartData } from '@/api/types';

const handleCheckout = async (paymentMethodId: string) => {
  try {
    const data: CheckoutCartData = { paymentMethodId };
    const response = await apiClient.bookings.checkoutCart(data);
    
    if (response.success) {
      console.log(`Created ${response.count} bookings`);
      console.log('Bookings:', response.data);
      // Redirect to success page
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};
```

#### Get User Bookings

```typescript
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { Booking } from '@/api/types';

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'flight' | 'hotel'>('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const filters = filter !== 'all' ? { bookingType: filter } : {};
        const response = await apiClient.bookings.getMyBookings(filters);
        
        if (response.success) {
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, [filter]);

  return (
    <div>
      <h1>My Bookings</h1>
      
      <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
        <option value="all">All</option>
        <option value="flight">Flights</option>
        <option value="hotel">Hotels</option>
      </select>

      {bookings.map(booking => (
        <div key={booking._id}>
          <h3>{booking.bookingType.toUpperCase()}</h3>
          <p>Reference: {booking.bookingReference}</p>
          <p>Status: {booking.status}</p>
          <p>Total: ${booking.totalPrice}</p>
          
          {booking.bookingType === 'flight' && booking.flightDetails && (
            <div>
              <p>Flight: {booking.flightDetails.flightNumber}</p>
              <p>From: {booking.flightDetails.departureAirport}</p>
              <p>To: {booking.flightDetails.arrivalAirport}</p>
            </div>
          )}
          
          {booking.bookingType === 'hotel' && booking.hotelDetails && (
            <div>
              <p>Hotel: {booking.hotelDetails.hotelName}</p>
              <p>Room: {booking.hotelDetails.roomType}</p>
              <p>Nights: {booking.hotelDetails.numberOfNights}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

#### Cancel Booking

```typescript
import apiClient from '@/api/client';

const cancelBooking = async (bookingId: string) => {
  try {
    const response = await apiClient.bookings.cancelBooking(bookingId);
    
    if (response.success) {
      console.log('Booking cancelled:', response.data);
    }
  } catch (error) {
    console.error('Failed to cancel booking:', error);
  }
};
```

### Payment Methods

#### Add Payment Method

```typescript
import apiClient from '@/api/client';
import { AddPaymentMethodData } from '@/api/types';

const addPaymentMethod = async () => {
  try {
    const data: AddPaymentMethodData = {
      cardType: 'VISA',
      lastFourDigits: '1234',
      cardholderName: 'John Doe',
      expiryDate: '12/28',
      isDefault: true,
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA',
        postalCode: '10001'
      }
    };

    const response = await apiClient.payments.addPaymentMethod(data);
    
    if (response.success) {
      console.log('Payment method added:', response.data);
    }
  } catch (error) {
    console.error('Failed to add payment method:', error);
  }
};
```

#### Get Payment Methods

```typescript
import { useEffect, useState } from 'react';
import apiClient from '@/api/client';
import { PaymentMethod } from '@/api/types';

const PaymentMethods = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const response = await apiClient.payments.getPaymentMethods();
        if (response.success) {
          setMethods(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
      }
    };

    fetchMethods();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      const response = await apiClient.payments.setDefaultPaymentMethod(id);
      if (response.success) {
        // Refresh list
        const updatedResponse = await apiClient.payments.getPaymentMethods();
        setMethods(updatedResponse.data);
      }
    } catch (error) {
      console.error('Failed to set default:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.payments.deletePaymentMethod(id);
      setMethods(methods.filter(m => m._id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div>
      <h1>Payment Methods</h1>
      {methods.map(method => (
        <div key={method._id}>
          <p>{method.cardType} ending in {method.lastFourDigits}</p>
          <p>{method.cardholderName}</p>
          <p>Expires: {method.expiryDate}</p>
          {method.isDefault && <span>DEFAULT</span>}
          
          {!method.isDefault && (
            <button onClick={() => handleSetDefault(method._id)}>
              Set as Default
            </button>
          )}
          
          <button onClick={() => handleDelete(method._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Error Handling

All API calls should be wrapped in try-catch blocks:

```typescript
try {
  const response = await apiClient.flights.searchFlights(params);
  // Handle success
} catch (error: any) {
  if (error.response) {
    // Server responded with error
    console.error('Error:', error.response.data.message);
    
    // Handle specific error codes (مش لازم تعملها)
    switch (error.response.status) {
      case 400:
        // Bad request
        break;
      case 401:
        // Unauthorized - redirect to login
        break;
      case 404:
        // Not found
        break;
      case 500:
        // Server error
        break;
    }
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
  } else {
    // Other errors
    console.error('Error:', error.message);
  }
}
```

## Custom Hooks (Optional)

You can create custom React hooks for common operations:

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import apiClient from '@/api/client';
import { User } from '@/api/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await apiClient.auth.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.auth.login({ email, password });
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, logout, isAuthenticated: !!user };
};
```

## Notes

- Always check `response.success` before accessing `response.data`
- The JWT token is automatically included in all requests via the Axios interceptor
- All dates should be in ISO format or YYYY-MM-DD format
- Admin routes require a user with `role: 'admin'`