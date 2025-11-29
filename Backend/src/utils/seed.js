require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Flight = require('../models/FlightsModified');
const Hotel = require('../models/Hotel');

// Sample data
const destinations = [
  { name: "Cairo", country: "Egypt", price: 200, rating: 4.5, img: "src/assets/images/Cairo.jpg" },
  { name: "Berlin", country: "Germany", price: 1200, rating: 4.7, img: "src/assets/images/Germany.jpg" },
  { name: "Doha", country: "Qatar", price: 800, rating: 4.6, img: "src/assets/images/Doha.jpg" },
  { name: "Tokyo", country: "Japan", price: 1800, rating: 4.9, img: "src/assets/images/Tokyo.jpg" },
  { name: "Paris", country: "France", price: 1500, rating: 4.8, img: "src/assets/images/flight-img-1.png" },
  { name: "Istanbul", country: "Turkey", price: 700, rating: 4.4, img: "src/assets/images/Istanbul.jpg" },
  { name: "New York", country: "USA", price: 2200, rating: 4.7, img: "src/assets/images/NewYork.jpg" },
  { name: "Dubai", country: "UAE", price: 950, rating: 4.6, img: "src/assets/images/Dubai.jpg" },
  { name: "Rome", country: "Italy", price: 1300, rating: 4.5, img: "src/assets/images/Rome.jpg" },
  { name: "Bangkok", country: "Thailand", price: 1100, rating: 4.3, img: "src/assets/images/Bangok.jpg" }
];

const flights = [
  {
    flightNumber: "IN230",
    airline: "United Airlines",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/United_Airlines_Logo.svg/1024px-United_Airlines_Logo.svg.png",
    departureAirport: "ACC",
    arrivalAirport: "LHR",
    departureTime: "11:00 PM",
    arrivalTime: "6:00 AM",
    date: new Date("2025-12-11"),
    flightDuration: "7h 40min",
    availableSeats: 120,
    totalSeats: 180,
    classes: [
      { name: "Economy", price: 850, availableSeats: 90 },
      { name: "Business", price: 1800, availableSeats: 20 },
      { name: "First Class", price: 3200, availableSeats: 10 }
    ],
    gate: "2B",
    status: "scheduled"
  },
  {
    flightNumber: "EK142",
    airline: "Emirates",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Emirates_logo.svg",
    departureAirport: "DXB",
    arrivalAirport: "CAI",
    departureTime: "10:00 AM",
    arrivalTime: "1:00 PM",
    date: new Date("2025-12-15"),
    flightDuration: "3h 10min",
    availableSeats: 100,
    totalSeats: 150,
    classes: [
      { name: "Economy", price: 650, availableSeats: 70 },
      { name: "Business", price: 1250, availableSeats: 25 },
      { name: "First Class", price: 2500, availableSeats: 5 }
    ],
    gate: "12B",
    status: "scheduled"
  },
  {
    flightNumber: "BA456",
    airline: "British Airways",
    airlineLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/British_Airways_Logo.svg/1200px-British_Airways_Logo.svg.png",
    departureAirport: "LHR",
    arrivalAirport: "JFK",
    departureTime: "2:00 PM",
    arrivalTime: "5:00 PM",
    date: new Date("2025-12-20"),
    flightDuration: "8h 00min",
    availableSeats: 140,
    totalSeats: 200,
    classes: [
      { name: "Economy", price: 1200, availableSeats: 110 },
      { name: "Business", price: 2800, availableSeats: 20 },
      { name: "First Class", price: 5000, availableSeats: 10 }
    ],
    gate: "5A",
    status: "scheduled"
  }
];

const hotels = [
  {
    hotelName: "Kempinski Hotel",
    hotelLogo: "https://example.com/hotel-logo-1.png",
    location: {
      city: "Cairo",
      country: "Egypt",
      address: "Nile City Towers, 2005 C Corniche El Nil"
    },
    description: "Luxury 5-star hotel on the Nile with stunning views",
    rating: 4.8,
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Gym", "Room Service"],
    images: ["https://example.com/hotel1.jpg"],
    roomTypes: [
      {
        name: "Deluxe Suite",
        description: "Spacious suite with city view",
        pricePerNight: 180,
        maxGuests: 2,
        availableRooms: 10,
        totalRooms: 15,
        amenities: ["King Bed", "City View", "Mini Bar", "Balcony"]
      },
      {
        name: "Executive Suite",
        description: "Luxurious suite with Nile view",
        pricePerNight: 280,
        maxGuests: 3,
        availableRooms: 5,
        totalRooms: 8,
        amenities: ["King Bed", "Nile View", "Living Room", "Jacuzzi"]
      }
    ],
    checkInTime: "2:00 PM",
    checkOutTime: "12:00 PM",
    status: "active"
  },
  {
    hotelName: "Marriott Resort",
    hotelLogo: "https://example.com/hotel-logo-2.png",
    location: {
      city: "Dubai",
      country: "UAE",
      address: "Palm Jumeirah, Dubai"
    },
    description: "Beachfront resort with world-class amenities",
    rating: 4.9,
    amenities: ["Private Beach", "Multiple Pools", "Spa", "Multiple Restaurants", "Water Sports"],
    images: ["https://example.com/hotel2.jpg"],
    roomTypes: [
      {
        name: "Ocean View",
        description: "Room with stunning ocean views",
        pricePerNight: 250,
        maxGuests: 2,
        availableRooms: 15,
        totalRooms: 20,
        amenities: ["Queen Bed", "Ocean View", "Balcony", "Mini Bar"]
      },
      {
        name: "Presidential Suite",
        description: "Ultimate luxury with private pool",
        pricePerNight: 850,
        maxGuests: 4,
        availableRooms: 2,
        totalRooms: 3,
        amenities: ["2 Bedrooms", "Private Pool", "Butler Service", "Sea View"]
      }
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    status: "active"
  },
  {
    hotelName: "Grand Hyatt Tokyo",
    hotelLogo: "https://example.com/hotel-logo-3.png",
    location: {
      city: "Tokyo",
      country: "Japan",
      address: "6-10-3 Roppongi, Minato-ku"
    },
    description: "Contemporary luxury in the heart of Tokyo",
    rating: 4.7,
    amenities: ["Free WiFi", "Multiple Restaurants", "Spa", "Fitness Center", "Concierge"],
    images: ["https://example.com/hotel3.jpg"],
    roomTypes: [
      {
        name: "City View Room",
        description: "Modern room with Tokyo city views",
        pricePerNight: 320,
        maxGuests: 2,
        availableRooms: 20,
        totalRooms: 30,
        amenities: ["Double Bed", "City View", "Work Desk", "Smart TV"]
      },
      {
        name: "Club Suite",
        description: "Spacious suite with lounge access",
        pricePerNight: 550,
        maxGuests: 3,
        availableRooms: 8,
        totalRooms: 12,
        amenities: ["King Bed", "Living Area", "Club Lounge Access", "Skyline View"]
      }
    ],
    checkInTime: "3:00 PM",
    checkOutTime: "12:00 PM",
    status: "active"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Destination.deleteMany();
    await Flight.deleteMany();
    await Hotel.deleteMany();

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@travel.com",
      password: "admin123",
      role: "admin",
      phoneNumber: "+1234567890",
      address: "123 Admin Street, Admin City"
    });

    // Create regular user
    const user = await User.create({
      name: "Ann Pine",
      email: "ann.pine@gmail.com",
      password: "user123",
      role: "user",
      phoneNumber: "+233 034 3456 578",
      address: "PR 12 East Legon, Accra, Ghana",
      dateOfBirth: new Date("1996-02-24"),
      avatarUrl: "src/assets/images/PP.png",
      hasPhoneVerified: true
    });

    
    console.log('Created users');

    // Insert destinations
    await Destination.insertMany(destinations);
    console.log('Inserted destinations');

    // Insert flights
    await Flight.insertMany(flights);
    console.log('Inserted flights');

    // Insert hotels
    await Hotel.insertMany(hotels);
    console.log('Inserted hotels');

    console.log('\n=== Database seeded successfully! ===\n');
    console.log('Admin credentials:');
    console.log('Email: admin@travel.com');
    console.log('Password: admin123\n');
    console.log('User credentials:');
    console.log('Email: ann.pine@gmail.com');
    console.log('Password: user123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();