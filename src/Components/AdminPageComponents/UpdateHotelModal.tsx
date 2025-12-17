/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { hotelAPI } from "@/networks/Api/client";
import Modal from "../Modal";

interface UpdateHotelModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hotel: any;
}

const UpdateHotelModal: React.FC<UpdateHotelModalProps> = ({
  show,
  onClose,
  onSuccess,
  hotel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [hasNewLogo, setHasNewLogo] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    hotelLogo: "",
    city: "",
    country: "",
    address: "",
    description: "",
    rating: "4.5",
    amenities: "",
    status: "active" as "active" | "inactive",
    roomTypes: [] as any[],
  });

  useEffect(() => {
    if (hotel && show) {
      console.log('Loading hotel data:', hotel);
      
      setFormData({
        hotelName: hotel.hotelName || "",
        hotelLogo: hotel.hotelLogo || "",
        city: hotel.location?.city || "",
        country: hotel.location?.country || "",
        address: hotel.location?.address || "",
        description: hotel.description || "",
        rating: hotel.rating?.toString() || "4.5",
        amenities: hotel.amenities?.join(", ") || "",
        status: hotel.status || "active",
        roomTypes: hotel.roomTypes || [],
      });

      // Set existing logo preview
      if (hotel.hotelLogo) {
        const logoUrl = `http://localhost:5000/api/uploads/${hotel.hotelLogo}`;
        console.log('Setting existing logo preview:', logoUrl);
        setLogoPreview(logoUrl);
      } else {
        setLogoPreview("");
      }
      
      // Reset new logo state
      setNewLogoFile(null);
      setHasNewLogo(false);
    }
  }, [hotel, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      e.target.value = ''; // Reset input
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log('Preview created for new logo');
      setLogoPreview(base64String);
      setNewLogoFile(file);
      setHasNewLogo(true);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    console.log('Removing logo preview');
    setLogoPreview("");
    setNewLogoFile(null);
    setHasNewLogo(false);
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRoomTypeChange = (index: number, field: string, value: any) => {
    const updatedRoomTypes = [...formData.roomTypes];
    updatedRoomTypes[index] = {
      ...updatedRoomTypes[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      roomTypes: updatedRoomTypes,
    }));
  };

  const addRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: [
        ...prev.roomTypes,
        {
          name: "",
          description: "",
          pricePerNight: 0,
          maxGuests: 2,
          availableRooms: 0,
          totalRooms: 0,
          amenities: [],
        },
      ],
    }));
  };

  const removeRoomType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      console.log('=== PREPARING UPDATE REQUEST ===');
      console.log('Has new logo file:', hasNewLogo);
      console.log('New logo file:', newLogoFile);
      console.log('Existing logo:', formData.hotelLogo);

      // Handle hotel logo - CRITICAL SECTION
      if (hasNewLogo && newLogoFile) {
        // User uploaded a NEW logo
        console.log('Appending NEW logo file:', newLogoFile.name);
        formDataToSend.append("hotelLogo", newLogoFile);
      } else if (formData.hotelLogo) {
        // Keep EXISTING logo (send filename so backend knows to keep it)
        console.log('Keeping EXISTING logo:', formData.hotelLogo);
        formDataToSend.append("hotelLogo", formData.hotelLogo);
      }
      // If neither condition is true, no logo will be sent (logo will be removed)

      // Add basic hotel data
      formDataToSend.append("hotelName", formData.hotelName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("rating", formData.rating);
      formDataToSend.append("status", formData.status);

      // Add location data as individual fields
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("address", formData.address);

      // Add amenities
      if (formData.amenities) {
        const amenitiesArray = formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a);
        formDataToSend.append("amenities", JSON.stringify(amenitiesArray));
      }

      // Add room types
      if (formData.roomTypes.length > 0) {
        formDataToSend.append("roomTypes", JSON.stringify(formData.roomTypes));
      }

      // Debug: Log all FormData entries
      console.log('=== FORMDATA CONTENTS ===');
      for (const pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], '→ FILE:', pair[1].name, pair[1].size, 'bytes');
        } else {
          console.log(pair[0], '→', pair[1]);
        }
      }
      console.log('=========================');

      console.log('Sending update request for hotel ID:', hotel._id);
      
      const response = await hotelAPI.updateHotel(hotel._id, formDataToSend);
      
      console.log('✅ Update successful:', response);
      
      alert("Hotel updated successfully!");
      
      // Call success callback and close modal
      await onSuccess();
      onClose();
      
    } catch (error: any) {
      console.error('❌ Update failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error
        || error.message 
        || "Failed to update hotel";
      
      alert(`Update failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Update Hotel"
      size="lg"
      scrollable={true}
    >
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Basic Info */}
          <div className="col-12">
            <h6 className="fw-bold mb-3">Basic Information</h6>
          </div>

          <div className="col-md-6">
            <label className="form-label">Hotel Name *</label>
            <input
              type="text"
              className="form-control"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              required
              placeholder="Grand Hotel"
            />
          </div>

          <div className="col-md-6">
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
          </div>

          <div className="col-12">
            <label className="form-label">Hotel Logo</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            <small className="text-muted d-block mt-1">
              {hasNewLogo 
                ? "New logo selected. Click 'Update Hotel' to save." 
                : "Upload a new logo to replace the existing one (max 5MB)"}
            </small>
            
            {logoPreview && (
              <div className="mt-3 position-relative d-inline-block">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "2px solid #dee2e6"
                  }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute"
                  style={{ top: "5px", right: "5px" }}
                  onClick={handleRemoveLogo}
                  title="Remove logo"
                >
                  <i className="ri-close-line"></i>
                </button>
                <div className="mt-2">
                  <small className={`badge ${hasNewLogo ? 'bg-success' : 'bg-secondary'}`}>
                    {hasNewLogo ? 'New Logo (Not Saved Yet)' : 'Current Logo'}
                  </small>
                </div>
              </div>
            )}
            
            {!logoPreview && (
              <div className="mt-2 text-muted">
                <i className="ri-image-line me-2"></i>
                No logo uploaded
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
              placeholder="Luxurious hotel in the heart of the city..."
            />
          </div>

          {/* Location */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Location</h6>
          </div>

          <div className="col-md-6">
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-control"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Cairo"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Country *</label>
            <input
              type="text"
              className="form-control"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              placeholder="Egypt"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Address *</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="123 Main Street"
            />
          </div>

          {/* Hotel Details */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Hotel Details</h6>
          </div>

          <div className="col-md-6">
            <label className="form-label">Status *</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Amenities</label>
            <input
              type="text"
              className="form-control"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Pool, Gym, Spa"
            />
            <small className="text-muted">Separate with commas</small>
          </div>

          {/* Room Types */}
          <div className="col-12 mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Room Types</h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={addRoomType}
              >
                <i className="ri-add-line me-1"></i>Add Room Type
              </button>
            </div>

            {formData.roomTypes.length === 0 && (
              <div className="alert alert-info">
                <i className="ri-information-line me-2"></i>
                No room types added yet. Click "Add Room Type" to add rooms.
              </div>
            )}

            {formData.roomTypes.map((room, index) => (
              <div key={index} className="card mb-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Room Type {index + 1}</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeRoomType(index)}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Room Type Name (e.g., Deluxe Suite)"
                      value={room.name}
                      onChange={(e) =>
                        handleRoomTypeChange(index, "name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Price Per Night"
                      value={room.pricePerNight}
                      onChange={(e) =>
                        handleRoomTypeChange(
                          index,
                          "pricePerNight",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Max Guests"
                      value={room.maxGuests}
                      onChange={(e) =>
                        handleRoomTypeChange(
                          index,
                          "maxGuests",
                          parseInt(e.target.value) || 1
                        )
                      }
                      required
                      min="1"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Available Rooms"
                      value={room.availableRooms}
                      onChange={(e) =>
                        handleRoomTypeChange(
                          index,
                          "availableRooms",
                          parseInt(e.target.value) || 0
                        )
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Total Rooms"
                      value={room.totalRooms}
                      onChange={(e) =>
                        handleRoomTypeChange(
                          index,
                          "totalRooms",
                          parseInt(e.target.value) || 0
                        )
                      }
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control form-control-sm"
                      placeholder="Room Description (optional)"
                      value={room.description || ''}
                      onChange={(e) =>
                        handleRoomTypeChange(index, "description", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
                  Updating...
                </>
              ) : (
                <>
                  <i className="ri-save-line me-2"></i>
                  Update Hotel
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateHotelModal;