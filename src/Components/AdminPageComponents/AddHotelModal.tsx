import React, { useState } from "react";
import apiClient from "@/networks/Api/client";
import Modal from "../Modal";
import type { RoomType } from "@/types/api.types";

interface AddHotelModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddHotelModal: React.FC<AddHotelModalProps> = ({
  show,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelLogo: "",
    locationCity: "",
    locationCountry: "",
    locationAddress: "",
    description: "",
    rating: "4.5",
    amenities: "",
    images: [] as string[],
    checkInTime: "14:00",
    checkOutTime: "12:00",
  });

  const [roomTypes, setRoomTypes] = useState<Omit<RoomType, "_id">[]>([
    {
      name: "Standard Room",
      description: "",
      pricePerNight: 0,
      maxGuests: 2,
      availableRooms: 0,
      totalRooms: 0,
      amenities: [],
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Logo size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setFormData((prev) => ({ ...prev, hotelLogo: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFiles = 5;
    if (files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    const newPreviews: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        processed++;
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        processed++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        newPreviews.push(base64String);
        processed++;

        if (processed === files.length) {
          setImagesPreviews(newPreviews);
          setFormData((prev) => ({
            ...prev,
            images: Array.from(files).map((f) => f.name),
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRoomTypeChange = (
    index: number,
    field: keyof Omit<RoomType, "_id">,
    value: string | number
  ) => {
    setRoomTypes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRoomType = () => {
    setRoomTypes((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        pricePerNight: 0,
        maxGuests: 2,
        availableRooms: 0,
        totalRooms: 0,
        amenities: [],
      },
    ]);
  };

  const removeRoomType = (index: number) => {
    if (roomTypes.length > 1) {
      setRoomTypes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add hotel basic info
      formDataToSend.append("hotelName", formData.hotelName);
      formDataToSend.append("location.city", formData.locationCity);
      formDataToSend.append("location.country", formData.locationCountry);
      formDataToSend.append("location.address", formData.locationAddress);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("checkInTime", formData.checkInTime);
      formDataToSend.append("checkOutTime", formData.checkOutTime);

      // Add amenities as string (will be parsed by backend)
      if (formData.amenities) {
        formDataToSend.append("amenities", formData.amenities);
      }

      // Add hotel logo file
      const logoInput = document.querySelector(
        'input[name="hotelLogo"]'
      ) as HTMLInputElement;
      if (logoInput && logoInput.files?.[0]) {
        formDataToSend.append("hotelLogo", logoInput.files[0]);
      }

      // Add hotel images files
      const imagesInput = document.querySelector(
        'input[name="images"]'
      ) as HTMLInputElement;
      if (imagesInput && imagesInput.files) {
        Array.from(imagesInput.files).forEach((file) => {
          formDataToSend.append("images", file);
        });
      }

      // Add room types
      roomTypes.forEach((rt, index) => {
        formDataToSend.append(`roomTypes.${index}.name`, rt.name);
        formDataToSend.append(`roomTypes.${index}.description`, rt.description);
        formDataToSend.append(
          `roomTypes.${index}.pricePerNight`,
          rt.pricePerNight.toString()
        );
        formDataToSend.append(
          `roomTypes.${index}.maxGuests`,
          rt.maxGuests.toString()
        );
        formDataToSend.append(
          `roomTypes.${index}.availableRooms`,
          rt.availableRooms.toString()
        );
        formDataToSend.append(
          `roomTypes.${index}.totalRooms`,
          rt.totalRooms.toString()
        );

        if (Array.isArray(rt.amenities)) {
          rt.amenities.forEach((amenity, amIndex) => {
            formDataToSend.append(
              `roomTypes.${index}.amenities.${amIndex}`,
              amenity
            );
          });
        }
      });

      await apiClient.hotels.createHotel(formDataToSend);
      alert("Hotel added successfully!");
      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding hotel:", error);
      let errorMessage = "Failed to add hotel";
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        typeof (error as Record<string, unknown>).response === "object" &&
        (error as Record<string, unknown>).response
      ) {
        const response = (error as Record<string, unknown>).response as Record<
          string,
          unknown
        >;
        if (response.data && typeof response.data === "object") {
          const data = response.data as Record<string, unknown>;
          if (typeof data.message === "string") {
            errorMessage = data.message;
          }
        }
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hotelName: "",
      hotelLogo: "",
      locationCity: "",
      locationCountry: "",
      locationAddress: "",
      description: "",
      rating: "4.5",
      amenities: "",
      images: [],
      checkInTime: "14:00",
      checkOutTime: "12:00",
    });
    setRoomTypes([
      {
        name: "Standard Room",
        description: "",
        pricePerNight: 0,
        maxGuests: 2,
        availableRooms: 0,
        totalRooms: 0,
        amenities: [],
      },
    ]);
    setLogoPreview("");
    setImagesPreviews([]);
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Add New Hotel"
      size="xl"
      scrollable={true}
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Basic Info */}
          <div className="col-12">
            <h6 className="fw-bold mb-3">Basic Information</h6>
          </div>

          <div className="col-md-8">
            <label className="form-label">Hotel Name *</label>
            <input
              type="text"
              className="form-control"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              required
              placeholder="Grand Plaza Hotel & Resort"
            />
            <small className="text-muted">Enter the official hotel name</small>
          </div>

          <div className="col-md-4">
            <label className="form-label">Rating *</label>
            <input
              type="number"
              className="form-control"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              min="0"
              max="5"
              step="0.1"
              placeholder="4.5"
            />
            <small className="text-muted">Star rating (0-5)</small>
          </div>

          <div className="col-12">
            <label className="form-label">Hotel Logo</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            <small className="text-muted">
              Upload hotel logo (optional, max 5MB)
            </small>
            {logoPreview && (
              <div className="mt-2">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{
                    maxWidth: "120px",
                    maxHeight: "120px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    padding: "5px",
                  }}
                />
              </div>
            )}
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Luxury 5-star hotel in the heart of the city, featuring world-class amenities, spa services, fine dining restaurants, and breathtaking views..."
            />
            <small className="text-muted">
              Provide detailed hotel description and highlights
            </small>
          </div>

          {/* Location */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Location Details</h6>
          </div>

          <div className="col-md-4">
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-control"
              name="locationCity"
              value={formData.locationCity}
              onChange={handleChange}
              required
              placeholder="Cairo"
            />
            <small className="text-muted">Hotel city</small>
          </div>

          <div className="col-md-4">
            <label className="form-label">Country *</label>
            <input
              type="text"
              className="form-control"
              name="locationCountry"
              value={formData.locationCountry}
              onChange={handleChange}
              required
              placeholder="Egypt"
            />
            <small className="text-muted">Hotel country</small>
          </div>

          <div className="col-md-4">
            <label className="form-label">Street Address *</label>
            <input
              type="text"
              className="form-control"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleChange}
              required
              placeholder="123 Nile Corniche Street"
            />
            <small className="text-muted">Full street address</small>
          </div>

          {/* Amenities & Images */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Amenities & Images</h6>
          </div>

          <div className="col-12">
            <label className="form-label">Hotel Amenities</label>
            <input
              type="text"
              className="form-control"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Free WiFi, Swimming Pool, Fitness Center, Spa, Restaurant, Room Service, Airport Shuttle"
            />
            <small className="text-muted">Separate amenities with commas</small>
          </div>

          <div className="col-12">
            <label className="form-label">Hotel Images</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleImagesUpload}
            />
            <small className="text-muted">
              Upload up to 5 images (max 5MB each)
            </small>
            {imagesPreviews.length > 0 && (
              <div className="mt-2 d-flex gap-2 flex-wrap">
                {imagesPreviews.map((preview, idx) => (
                  <img
                    key={idx}
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Check-in/out Times */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Check-in & Check-out</h6>
          </div>

          <div className="col-md-6">
            <label className="form-label">Check-in Time *</label>
            <input
              type="time"
              className="form-control"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleChange}
              required
            />
            <small className="text-muted">Standard check-in time</small>
          </div>

          <div className="col-md-6">
            <label className="form-label">Check-out Time *</label>
            <input
              type="time"
              className="form-control"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleChange}
              required
            />
            <small className="text-muted">Standard check-out time</small>
          </div>

          {/* Room Types */}
          <div className="col-12 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Room Types & Pricing</h6>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addRoomType}
              >
                <i className="ri-add-line me-1"></i>Add Room Type
              </button>
            </div>
          </div>

          {roomTypes.map((room, index) => (
            <div key={index} className="col-12">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Room Type {index + 1}</h6>
                    {roomTypes.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeRoomType(index)}
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    )}
                  </div>

                  <div className="row g-2">
                    <div className="col-md-6">
                      <label className="form-label small">Room Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={room.name}
                        onChange={(e) =>
                          handleRoomTypeChange(index, "name", e.target.value)
                        }
                        required
                        placeholder="Deluxe Ocean View Suite"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small">Description</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={room.description}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Spacious room with king bed and ocean view"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Price/Night (€) *
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={room.pricePerNight}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            index,
                            "pricePerNight",
                            parseFloat(e.target.value)
                          )
                        }
                        required
                        min="0"
                        step="0.01"
                        placeholder="150.00"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">Max Guests *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={room.maxGuests}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            index,
                            "maxGuests",
                            parseInt(e.target.value)
                          )
                        }
                        required
                        min="1"
                        placeholder="2"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">
                        Available Rooms *
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={room.availableRooms}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            index,
                            "availableRooms",
                            parseInt(e.target.value)
                          )
                        }
                        required
                        min="0"
                        placeholder="10"
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small">Total Rooms *</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={room.totalRooms}
                        onChange={(e) =>
                          handleRoomTypeChange(
                            index,
                            "totalRooms",
                            parseInt(e.target.value)
                          )
                        }
                        required
                        min="0"
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="col-12 mt-4 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="ri-add-line me-2"></i>
                  Add Hotel
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddHotelModal;
