# Travel Booking System - Backend API

Complete backend implementation for a Travel Booking System built with Node.js, Express, and MongoDB following the MVC architecture pattern.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (User/Admin)
- **Flight Management**: Full CRUD operations, search, and booking system
- **Hotel Management**: Full CRUD operations, search, and booking system
- **Shopping Cart**: Add flights/hotels to cart before checkout
- **Booking System**: Create and manage flight/hotel bookings
- **Payment System**: Demo payment processing with payment methods management
- **User Dashboard**: View bookings, manage profile, and payment methods
- **Admin Dashboard**: Manage flights, hotels, and view all bookings

## User Creds

- Admin user: `admin@travel.com` / `admin123`
- Regular user: `ann.pine@gmail.com` / `user123`

7. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Flight.js            # Flight schema
│   │   ├── Hotel.js             # Hotel schema
│   │   ├── Booking.js           # Booking schema
│   │   ├── Cart.js              # Cart schema
│   │   ├── PaymentMethod.js     # Payment method schema
│   │   └── Destination.js       # Destination schema
│   ├── controllers/
│   │   ├── authController.js    # Auth endpoints logic
│   │   ├── flightController.js  # Flight endpoints logic
│   │   ├── hotelController.js   # Hotel endpoints logic
│   │   ├── cartController.js    # Cart endpoints logic
│   │   ├── bookingController.js # Booking endpoints logic
│   │   └── paymentController.js # Payment endpoints logic
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── flightService.js     # Flight business logic
│   │   ├── hotelService.js      # Hotel business logic
│   │   ├── cartService.js       # Cart business logic
│   │   ├── bookingService.js    # Booking business logic
│   │   └── paymentService.js    # Payment business logic
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── flights.js           # Flight routes
│   │   ├── hotels.js            # Hotel routes
│   │   ├── cart.js              # Cart routes
│   │   ├── bookings.js          # Booking routes
│   │   └── payments.js          # Payment routes
│   ├── middleware/
│   │   ├── auth.js              # JWT & authorization middleware
│   │   └── error.js             # Error handling middleware
│   ├── utils/
│   │   └── seed.js              # Database seeding script
│   └── server.js                # Application entry point
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |
| PUT | `/update-profile` | Update user profile | Yes |
| PUT | `/change-password` | Change password | Yes |

### Flights (`/api/flights`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all flights | No |
| GET | `/search` | Search flights | No |
| GET | `/check-availability` | Check seat availability | No |
| GET | `/:id` | Get single flight | No |
| POST | `/` | Create flight | Yes (Admin) |
| PUT | `/:id` | Update flight | Yes (Admin) |
| DELETE | `/:id` | Delete flight | Yes (Admin) |

### Hotels (`/api/hotels`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all hotels | No |
| GET | `/search` | Search hotels | No |
| GET | `/check-availability` | Check room availability | No |
| GET | `/:id` | Get single hotel | No |
| POST | `/` | Create hotel | Yes (Admin) |
| PUT | `/:id` | Update hotel | Yes (Admin) |
| DELETE | `/:id` | Delete hotel | Yes (Admin) |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes |
| POST | `/flight` | Add flight to cart | Yes |
| POST | `/hotel` | Add hotel to cart | Yes |
| PUT | `/item/:itemId` | Update cart item | Yes |
| DELETE | `/item/:itemId` | Remove item from cart | Yes |
| DELETE | `/clear` | Clear cart | Yes |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/my-bookings` | Get user's bookings | Yes |
| GET | `/:id` | Get single booking | Yes |
| POST | `/flight` | Create flight booking | Yes |
| POST | `/hotel` | Create hotel booking | Yes |
| POST | `/checkout` | Checkout cart | Yes |
| PUT | `/:id/cancel` | Cancel booking | Yes |
| GET | `/` | Get all bookings | Yes (Admin) |
| PUT | `/:id/status` | Update booking status | Yes (Admin) |

### Payments (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get payment methods | Yes |
| GET | `/:id` | Get single payment method | Yes |
| POST | `/` | Add payment method | Yes |
| PUT | `/:id` | Update payment method | Yes |
| PUT | `/:id/set-default` | Set default payment method | Yes |
| DELETE | `/:id` | Delete payment method | Yes |
| POST | `/process` | Process payment (Demo) | Yes |

## 📝 API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890",
  "address": "123 Main St, City",
  "dateOfBirth": "1990-01-01"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Search Flights
```bash
GET /api/flights/search?from=ACC&to=LHR&date=2025-12-11&passengers=2&flightClass=Economy
```

### Add Flight to Cart
```bash
POST /api/cart/flight
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "flightId": "flight_id_here",
  "flightClass": "Economy",
  "passengers": 2
}
```

### Checkout Cart
```bash
POST /api/bookings/checkout
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "paymentMethodId": "payment_method_id_here"
}
```

### Create Hotel (Admin)
```bash
POST /api/hotels
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "hotelName": "Luxury Resort",
  "location": {
    "city": "Paris",
    "country": "France",
    "address": "123 Champs-Élysées"
  },
  "rating": 4.8,
  "roomTypes": [
    {
      "name": "Deluxe Room",
      "pricePerNight": 200,
      "maxGuests": 2,
      "availableRooms": 10,
      "totalRooms": 15
    }
  ]
}
```

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned after successful login/registration.

## 👥 User Roles

- **User**: Can search, book flights/hotels, manage cart, view their bookings
- **Admin**: Can create/update/delete flights and hotels, view all bookings

## 🗄️ Database Schema

### Users
- Authentication credentials
- Profile information
- Role (user/admin)

### Flights
- Flight details (number, airline, schedule)
- Multiple classes with pricing
- Seat availability tracking

### Hotels
- Hotel information and location
- Multiple room types
- Amenities and ratings

### Bookings
- Links users to flights/hotels
- Booking status tracking
- Payment information

### Cart
- Temporary storage for items before checkout
- Supports both flights and hotels

### Payment Methods
- User's saved payment cards
- Billing addresses
- Default payment selection

## 🔄 Booking Flow

1. User searches for flights/hotels
2. User adds items to cart
3. User reviews cart
4. User proceeds to checkout with payment method
5. System creates bookings and updates availability
6. User receives booking confirmations

## 🛡️ Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "success": false,
  "message": "Error description here"
}
```

## 📊 Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl commands
- React frontend

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Seed database
npm run seed

# Start production server
npm start
```