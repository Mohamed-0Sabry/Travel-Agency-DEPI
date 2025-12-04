// src/pages/HotelDetails.tsx
import React, { useEffect, useState } from "react";
import Loading from "@/Components/Loading";
import type { Hotel, RoomType } from "@/types/api.types";
import { useHotelStore } from "@/store/useHotelStore";
import axiosInstance from "@/networks/axiosInstance";
import BookingModal from "@/Components/BookingModal"; // we'll paste component below if you don't have it
import "@/styles/hotelDetails.css";
import { useCartStore } from "@/store/useCartStore";

interface HotelDetailsProps {
    hotelId: string;
    onBack: () => void;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ hotelId, onBack }) => {
    const hotels = useHotelStore((s) => s.hotels);
    const loadingHotels = useHotelStore((s) => s.isLoading);
    const hotelFromStore = hotels.find((h) => h._id === hotelId) || null;
    const [hotel, setHotel] = useState<Hotel | null>(hotelFromStore);
    const [showBooking, setShowBooking] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);


    const addHotelToCart = useCartStore((s) => s.addHotelToCart);
    const cartLoading = useCartStore((s) => s.isLoading); // Use cart loading state


    useEffect(() => {
        // Ensure hotels are loaded
        if (!hotels || hotels.length === 0) {
            useHotelStore.getState().getHotels();
        } else if (!hotel) {
            const found = hotels.find((h) => h._id === hotelId) || null;
            setHotel(found);
        }
    }, [hotels, hotel, hotelId]);

    useEffect(() => {
        if (!hotel && hotels.length > 0) {
            const found = hotels.find((h) => h._id === hotelId) || null;
            setHotel(found);
        }
    }, [hotels, hotelId, hotel]);

    if (loadingHotels) return <Loading />;
    if (!hotel)
        return (
            <div className="container py-5 text-center">
                <h3>Hotel not found</h3>
                <button className="btn btn-primary mt-3" onClick={onBack}>
                    Back to Hotels
                </button>
            </div>
        );

    const heroImg = (hotel.images && hotel.images[0]) || hotel.hotelLogo || "";
    const imageUrl = heroImg
        ? `${axiosInstance.defaults.baseURL}/uploads/${heroImg.replace(/\\/g, "/")}`
        : "/placeholder-hotel.jpg";

    const handleOpenBooking = (room: RoomType) => {
        setSelectedRoom(room);
        setShowBooking(true);
    };

    const handleCreateBooking = async (data: {
        roomType: string;
        checkInDate: string;
        checkOutDate: string;
        numberOfGuests: number;
    }) => {
        try {
            await addHotelToCart({
                hotelId: hotel._id,
                roomType: data.roomType,
                checkInDate: data.checkInDate,
                checkOutDate: data.checkOutDate,
                numberOfGuests: data.numberOfGuests,
            });
            alert("Hotel booking created successfully");
            setShowBooking(false);
        } catch (err) {
            console.error("Failed to create booking", err);
            alert("Failed to create booking. Please try again.");
        }
    };

    return (
        <div className="container py-5">
            <button className="btn btn-outline-secondary mb-4" onClick={onBack}>
                ← Back
            </button>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="position-relative">
                        <img src={imageUrl} alt={hotel.hotelName} className="w-100 hotel-hero-img shadow-lg" />
                        {hotel.status !== "active" && (
                            <div className="position-absolute top-0 start-0 m-3">
                                <span className="badge bg-warning">Inactive</span>
                            </div>
                        )}
                        {hotel.rating && (
                            <div className="position-absolute top-0 end-0 m-3">
                                <div className="bg-white py-1 px-3 rounded shadow-sm">
                                    <strong>{hotel.rating.toFixed(1)}</strong> <small className="text-muted">/5</small>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card border-0 shadow-sm mb-4 mt-4">
                        <div className="card-body p-4">
                            <h2 className="h3 mb-3">{hotel.hotelName}</h2>
                            <p className="text-muted mb-4">{hotel.description}</p>

                            {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="mb-4">
                                    <h5> Amenities </h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {hotel.amenities.map((a) => (
                                            <span key={a} className="badge bg-light text-dark border">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Room types */}
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h4 className="mb-4">Available Room Types</h4>

                            <div className="row g-3">
                                {hotel.roomTypes && hotel.roomTypes.length > 0 ? (
                                    hotel.roomTypes.map((room) => (
                                        <div key={room._id} className="col-md-6">
                                            <div className="p-3 border rounded d-flex align-items-start justify-content-between">
                                                <div>
                                                    <h6 className="mb-1">{room.name}</h6>
                                                    <p className="mb-1 small text-muted">{room.description}</p>
                                                    <div className="small text-muted">
                                                        Max guests: {room.maxGuests} • Available: {room.availableRooms}/{room.totalRooms}
                                                    </div>
                                                </div>

                                                <div className="text-end">
                                                    <div className="mb-2 fw-bold">${room.pricePerNight.toFixed(2)}<small className="text-muted">/night</small></div>
                                                    <button className="btn btn-primary btn-sm" onClick={() => handleOpenBooking(room)}>
                                                        Book
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No rooms available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* What's included */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="mb-4">What's Included</h4>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div className="feature-icon me-3">🛏️</div>
                                        <div>
                                            <h6 className="mb-1">Comfortable rooms</h6>
                                            <small className="text-muted">Well-appointed rooms with modern amenities</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <div className="feature-icon me-3">🍽️</div>
                                        <div>
                                            <h6 className="mb-1">Restaurant & Breakfast</h6>
                                            <small className="text-muted">On-site dining options available</small>
                                        </div>
                                    </div>
                                </div>
                                {/* Add more hotel-specific features as needed */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-4">
                            <h5 className="mb-3">ℹ️ Quick Facts</h5>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-3 pb-3 border-bottom">
                                    <small className="text-muted d-block">Location</small>
                                    <strong>{hotel.location.city}, {hotel.location.country}</strong>
                                </li>
                                <li className="mb-3 pb-3 border-bottom">
                                    <small className="text-muted d-block">Check-in / Check-out</small>
                                    <strong>{hotel.checkInTime} / {hotel.checkOutTime}</strong>
                                </li>
                                <li className="mb-3 pb-3 border-bottom">
                                    <small className="text-muted d-block">Rating</small>
                                    <strong>{hotel.rating} / 5</strong>
                                </li>
                                <li>
                                    <small className="text-muted d-block">Status</small>
                                    <strong>{hotel.status}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm bg-primary text-white">
                        <div className="card-body p-4">
                            <h5 className="mb-3">Need Help?</h5>
                            <p className="mb-3 small">Our travel experts are available 24/7 to assist you</p>
                            <button className="btn btn-light w-100">📞 Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>

            {showBooking && selectedRoom && (
                <BookingModal
                    show={showBooking}
                    hotel={hotel}
                    room={selectedRoom!}
                    onClose={() => setShowBooking(false)}
                    onConfirm={handleCreateBooking}
                    loading={cartLoading}
                />
            )}
        </div>
    );
};

export default HotelDetails;
