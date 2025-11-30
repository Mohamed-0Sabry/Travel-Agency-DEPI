require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Flight = require('../models/Flight');
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
    price: 850,
    origin: {
      city: "Accra",
      country: "Ghana"
    },
    destination: {
      city: "London",
      country: "United Kingdom"
    },
    offer: {
      isActive: true,
      oldPrice: 850,
      newPrice: 699,
      badge: "Hot Deal",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
    description: "Direct flight from Accra to London with premium service and comfortable seating.",
    rating: 4.5
  },
  {
    price: 1250,
    origin: {
      city: "Dubai",
      country: "UAE"
    },
    destination: {
      city: "Cairo",
      country: "Egypt"
    },
    offer: {
      isActive: false
    },
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800",
    description: "Experience luxury travel from Dubai to Cairo with world-class amenities.",
    rating: 4.7
  },
  {
    price: 2200,
    origin: {
      city: "New York",
      country: "USA"
    },
    destination: {
      city: "Tokyo",
      country: "Japan"
    },
    offer: {
      isActive: true,
      oldPrice: 2200,
      newPrice: 1899,
      badge: "Limited Offer",
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
    description: "Non-stop flight to Tokyo with entertainment system and gourmet meals.",
    rating: 4.8
  },
  {
    price: 1500,
    origin: {
      city: "Paris",
      country: "France"
    },
    destination: {
      city: "Rome",
      country: "Italy"
    },
    offer: {
      isActive: false
    },
    image: "https://images.unsplash.com/photo-1525624286412-4099c83c1bc8?w=800",
    description: "Quick and comfortable flight between two historic European capitals.",
    rating: 4.6
  },
  {
    price: 950,
    origin: {
      city: "Istanbul",
      country: "Turkey"
    },
    destination: {
      city: "Doha",
      country: "Qatar"
    },
    offer: {
      isActive: true,
      oldPrice: 950,
      newPrice: 799,
      badge: "Flash Sale",
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    },
    image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800",
    description: "Affordable and reliable service connecting Turkey and Qatar.",
    rating: 4.4
  },
  {
    price: 1800,
    origin: {
      city: "London",
      country: "United Kingdom"
    },
    destination: {
      city: "Bangkok",
      country: "Thailand"
    },
    offer: {
      isActive: false
    },
    image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800",
    description: "Long-haul flight with spacious seating and excellent in-flight service.",
    rating: 4.7
  },
  {
    price: 750,
    origin: {
      city: "Berlin",
      country: "Germany"
    },
    destination: {
      city: "Barcelona",
      country: "Spain"
    },
    offer: {
      isActive: true,
      oldPrice: 750,
      newPrice: 599,
      badge: "Weekend Special",
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    image: "https://images.unsplash.com/photo-1544016768-982d1554f0b9?w=800",
    description: "Explore the vibrant culture of Barcelona with our convenient flights.",
    rating: 4.5
  },
  {
    price: 3200,
    origin: {
      city: "Sydney",
      country: "Australia"
    },
    destination: {
      city: "Los Angeles",
      country: "USA"
    },
    offer: {
      isActive: false
    },
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
    description: "Premium trans-Pacific service with lie-flat seats and fine dining.",
    rating: 4.9
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