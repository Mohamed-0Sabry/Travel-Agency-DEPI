import React, { useEffect, useMemo, useState } from "react";
import Modal from "@/Components/Modal";
import type { Hotel, RoomType } from "@/types/api.types";
import { differenceInCalendarDays, parseISO } from "date-fns";

interface Props {
    show: boolean;
    hotel: Hotel;
    room: RoomType;
    loading?: boolean;
    onClose: () => void;
    onConfirm: (payload: {
        roomType: string;
        checkInDate: string;
        checkOutDate: string;
        numberOfGuests: number;
    }) => Promise<void>;
}

const BookingModal: React.FC<Props> = ({
    show,
    hotel,
    room,
    loading = false,
    onClose,
    onConfirm,
}) => {
    const todayStr = new Date().toISOString().slice(0, 10);

    const [checkInDate, setCheckInDate] = useState<string>(todayStr);
    const [checkOutDate, setCheckOutDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    });
    const [guests, setGuests] = useState<number>(Math.min(1, room.maxGuests || 1));

    useEffect(() => {
        if (show) {
            setCheckInDate(todayStr);
            const nextDay = new Date();
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOutDate(nextDay.toISOString().slice(0, 10));
            setGuests(Math.min(1, room.maxGuests || 1));
        }
    }, [show, room._id]);

    const nights = useMemo(() => {
        try {
            const a = parseISO(checkInDate);
            const b = parseISO(checkOutDate);
            const diff = differenceInCalendarDays(b, a);
            return diff > 0 ? diff : 0;
        } catch {
            return 0;
        }
    }, [checkInDate, checkOutDate]);

    const totalPrice = (room.pricePerNight || 0) * Math.max(1, nights);

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (guests <= 0 || guests > (room.maxGuests || 1)) {
            alert(`Please choose guests (1 - ${room.maxGuests || 1})`);
            return;
        }
        if (nights <= 0) {
            alert("Check-out date must be after check-in date");
            return;
        }

        await onConfirm({
            roomType: room.name,
            checkInDate,
            checkOutDate,
            numberOfGuests: guests,
        });
    };

    return (
        <Modal
            id="booking-modal"
            title={`Book ${hotel.hotelName} — ${room.name}`}
            show={show}
            onClose={onClose}
            size="lg"
            centered
            animationDuration={220}
        >
            <form onSubmit={handleConfirm}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Check-in</label>
                        <input
                            type="date"
                            className="form-control"
                            value={checkInDate}
                            min={todayStr}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Check-out</label>
                        <input
                            type="date"
                            className="form-control"
                            value={checkOutDate}
                            min={checkInDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Guests</label>
                        <input
                            type="number"
                            className="form-control"
                            value={guests}
                            min={1}
                            max={room.maxGuests || 1}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            required
                        />
                        <div className="small text-muted">Max {room.maxGuests || 1} guests</div>
                    </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <div className="small text-muted">Price per night</div>
                        <div className="fw-bold">${(room.pricePerNight || 0).toFixed(2)}</div>
                    </div>

                    <div className="text-end">
                        <div className="small text-muted">Nights</div>
                        <div className="fw-bold">{nights}</div>
                        <div className="small text-muted mt-2">Total</div>
                        <div className="fw-bold">${totalPrice.toFixed(2)}</div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Add to Cart'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default BookingModal;
