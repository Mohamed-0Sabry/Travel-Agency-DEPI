require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const Cart = require('../models/Cart');
const PaymentMethod = require('../models/PaymentMethod');
const { faker } = require('@faker-js/faker');

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate 20+ random hotels
const generateHotels = (count = 20) => {
  const hotels = [];
  for (let i = 0; i < count; i++) {
    const city = faker.location.city();
    const country = faker.location.country();
    const roomCount = faker.number.int({ min: 2, max: 5 });
    const roomTypes = Array.from({ length: roomCount }).map(() => ({
      name: faker.commerce.productAdjective() + " Room",
      description: faker.lorem.sentence(),
      pricePerNight: faker.number.int({ min: 80, max: 500 }),
      maxGuests: faker.number.int({ min: 1, max: 4 }),
      availableRooms: faker.number.int({ min: 5, max: 20 }),
      totalRooms: faker.number.int({ min: 10, max: 25 }),
      amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "TV", "Room Service"].sort(() => 0.5 - Math.random()).slice(0, 3)
    }));

    hotels.push({
      hotelName: faker.company.name() + " Hotel",
      hotelLogo: `Backend/src/uploads/Hotel-1.jpg`,
      location: {
        city,
        country,
        address: faker.location.streetAddress()
      },
      description: faker.lorem.paragraph(),
      rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
      amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar"].sort(() => 0.5 - Math.random()).slice(0, 4),
      images: Array.from({ length: 3 }).map((_, idx) => `Backend/src/uploads/Hotel-2.jpg`),
      roomTypes,
      checkInTime: "2:00 PM",
      checkOutTime: "12:00 PM",
      status: "active"
    });
  }
  return hotels;
};

// Create payment methods for a user
const createPaymentMethods = async (userId) => {
    const paymentMethods = [
        {
            user: userId,
            cardType: 'VISA',
            lastFourDigits: '1234',
            cardholderName: 'Ann Pine',
            expiryDate: '12/28',
            isDefault: true,
            billingAddress: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                postalCode: faker.location.zipCode()
            }
        },
        {
            user: userId,
            cardType: 'MASTERCARD',
            lastFourDigits: '5678',
            cardholderName: 'Ann Pine',
            expiryDate: '09/27',
            isDefault: false,
            billingAddress: {
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                country: faker.location.country(),
                postalCode: faker.location.zipCode()
            }
        }
    ];
    return await PaymentMethod.create(paymentMethods);
};

// Create a cart with items for a user
const createCart = async (userId, hotels) => {
    const items = [];
    const hotel1 = getRandomElement(hotels);
    const roomType1 = getRandomElement(hotel1.roomTypes);
    const checkIn1 = faker.date.soon({ days: 10 });
    const checkOut1 = new Date(checkIn1);
    checkOut1.setDate(checkOut1.getDate() + faker.number.int({ min: 2, max: 5 }));
    const nights1 = (checkOut1 - checkIn1) / (1000 * 60 * 60 * 24);

    items.push({
        itemType: 'hotel',
        hotel: hotel1._id,
        roomType: roomType1.name,
        checkInDate: checkIn1,
        checkOutDate: checkOut1,
        numberOfGuests: faker.number.int({ min: 1, max: roomType1.maxGuests }),
        numberOfNights: nights1,
        price: roomType1.pricePerNight * nights1
    });

    return await Cart.create({
        user: userId,
        items: items
    });
};

// Create bookings for a user
const createBookings = async (userId, hotels, paymentMethods) => {
    const bookings = [];
    const numBookings = faker.number.int({ min: 2, max: 4 });

    for (let i = 0; i < numBookings; i++) {
        const hotel = getRandomElement(hotels);
        const roomType = getRandomElement(hotel.roomTypes);
        const paymentMethod = getRandomElement(paymentMethods);
        
        // Create a mix of past and future bookings
        const isInThePast = Math.random() > 0.5;
        let checkInDate, checkOutDate, status;

        if (isInThePast) {
            checkInDate = faker.date.past({ years: 1 });
            checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + faker.number.int({ min: 1, max: 7 }));
            status = 'completed';
        } else {
            checkInDate = faker.date.future({ years: 1 });
            checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + faker.number.int({ min: 1, max: 7 }));
            status = 'confirmed';
        }

        const numberOfNights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
        const totalPrice = roomType.pricePerNight * numberOfNights;

        bookings.push({
            user: userId,
            bookingType: 'hotel',
            hotel: hotel._id,
            hotelDetails: {
                hotelName: hotel.hotelName,
                hotelLogo: hotel.hotelLogo,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                checkInTime: hotel.checkInTime,
                checkOutTime: hotel.checkOutTime,
                roomType: roomType.name,
                numberOfGuests: faker.number.int({ min: 1, max: roomType.maxGuests }),
                numberOfNights: numberOfNights,
                pricePerNight: roomType.pricePerNight
            },
            totalPrice: totalPrice,
            status: status,
            paymentStatus: 'paid',
            paymentMethod: paymentMethod._id
        });
    }
    return await Booking.create(bookings);
};


const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Hotel.deleteMany({});
    await Booking.deleteMany({});
    await Cart.deleteMany({});
    await PaymentMethod.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@travel.com",
      password: "admin123",
      role: "admin",
      phoneNumber: "+1234567890",
      address: "123 Admin Street, Admin City"
    });

    const user = await User.create({
      name: "Ann Pine",
      email: "ann.pine@gmail.com",
      password: "user123",
      role: "user",
      phoneNumber: "+233 034 3456 578",
      address: "PR 12 East Legon, Accra, Ghana",
      dateOfBirth: new Date("1996-02-24"),
      avatarUrl: "https://via.placeholder.com/150?text=Avatar",
      hasPhoneVerified: true
    });
    console.log('Created users');

    // Insert generated hotels and store them
    const hotelsData = generateHotels(25);
    const createdHotels = await Hotel.insertMany(hotelsData);
    console.log(`Inserted ${createdHotels.length} hotels`);

    // Create payment methods for the user
    const paymentMethods = await createPaymentMethods(user._id);
    console.log(`Created ${paymentMethods.length} payment methods for Ann Pine`);

    // Create a cart for the user
    await createCart(user._id, createdHotels);
    console.log('Created a cart for Ann Pine');

    // Create bookings for the user
    const bookings = await createBookings(user._id, createdHotels, paymentMethods);
    console.log(`Created ${bookings.length} bookings for Ann Pine`);


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