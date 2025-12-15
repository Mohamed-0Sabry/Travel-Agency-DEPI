/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import apiClient from "@/networks/Api/client";
import Modal from "../Modal";

interface UpdateFlightModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flight: any;
}

const UpdateFlightModal: React.FC<UpdateFlightModalProps> = ({
  show,
  onClose,
  onSuccess,
  flight,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    price: "",
    originCity: "",
    originCountry: "",
    destinationCity: "",
    destinationCountry: "",
    image: "",
    description: "",
    rating: "4.5",
    offerActive: false,
    offerOldPrice: "",
    offerNewPrice: "",
    offerBadge: "",
  });

  useEffect(() => {
    if (flight && show) {
      setFormData({
        price: flight.price?.toString() || "",
        originCity: flight.origin?.city || "",
        originCountry: flight.origin?.country || "",
        destinationCity: flight.destination?.city || "",
        destinationCountry: flight.destination?.country || "",
        image: flight.image || "",
        description: flight.description || "",
        rating: flight.rating?.toString() || "4.5",
        offerActive: flight.offer?.isActive || false,
        offerOldPrice: flight.offer?.oldPrice?.toString() || "",
        offerNewPrice: flight.offer?.newPrice?.toString() || "",
        offerBadge: flight.offer?.badge || "",
      });
      
      // Set existing image preview
      if (flight.image) {
        setImagePreview(`http://localhost:5000/api/uploads/${flight.image}`);
      }
      setNewImageFile(null);
    }
  }, [flight, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setNewImageFile(file);
        setFormData((prev) => ({ ...prev, image: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Always add image - either new file or existing filename
      if (newImageFile) {
        formDataToSend.append("image", newImageFile);
      } else {
        formDataToSend.append("image", formData.image);
      }

      // Add flight data
      formDataToSend.append("price", formData.price);
      formDataToSend.append("origin.city", formData.originCity);
      formDataToSend.append("origin.country", formData.originCountry);
      formDataToSend.append("destination.city", formData.destinationCity);
      formDataToSend.append("destination.country", formData.destinationCountry);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("rating", formData.rating);

      // Simple offer handling - automatically active if checkbox is checked
      formDataToSend.append("offer.isActive", formData.offerActive.toString());
      
      if (formData.offerActive) {
        if (formData.offerOldPrice) {
          formDataToSend.append("offer.oldPrice", formData.offerOldPrice);
        }
        if (formData.offerNewPrice) {
          formDataToSend.append("offer.newPrice", formData.offerNewPrice);
        }
        if (formData.offerBadge) {
          formDataToSend.append("offer.badge", formData.offerBadge);
        }
      }

      await apiClient.flights.update(flight._id, formDataToSend);
      alert("Flight updated successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating flight:", error);
      alert(error.response?.data?.message || "Failed to update flight");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Update Flight"
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
            <label className="form-label">Price (€) *</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="299.99"
            />
            <small className="text-muted">Enter the base ticket price</small>
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
            <small className="text-muted">Rating from 0 to 5</small>
          </div>
          <div className="col-12">
            <label className="form-label">Flight Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <small className="text-muted">
              Upload a new image to replace the existing one (max 5MB, JPG/PNG)
            </small>
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          </div>
          <div className="col-12">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Direct flight with in-flight entertainment, meals included, and spacious seating..."
            />
            <small className="text-muted">
              Provide detailed flight information and amenities
            </small>
          </div>

          {/* Origin */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Origin Airport</h6>
          </div>
          <div className="col-md-6">
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-control"
              name="originCity"
              value={formData.originCity}
              onChange={handleChange}
              required
              placeholder="Cairo"
            />
            <small className="text-muted">Departure city</small>
          </div>
          <div className="col-md-6">
            <label className="form-label">Country *</label>
            <input
              type="text"
              className="form-control"
              name="originCountry"
              value={formData.originCountry}
              onChange={handleChange}
              required
              placeholder="Egypt"
            />
            <small className="text-muted">Departure country</small>
          </div>

          {/* Destination */}
          <div className="col-12 mt-4">
            <h6 className="fw-bold mb-3">Destination Airport</h6>
          </div>
          <div className="col-md-6">
            <label className="form-label">City *</label>
            <input
              type="text"
              className="form-control"
              name="destinationCity"
              value={formData.destinationCity}
              onChange={handleChange}
              required
              placeholder="Paris"
            />
            <small className="text-muted">Arrival city</small>
          </div>
          <div className="col-md-6">
            <label className="form-label">Country *</label>
            <input
              type="text"
              className="form-control"
              name="destinationCountry"
              value={formData.destinationCountry}
              onChange={handleChange}
              required
              placeholder="France"
            />
            <small className="text-muted">Arrival country</small>
          </div>

          {/* Offer Section */}
          <div className="col-12 mt-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="offerActive"
                checked={formData.offerActive}
                onChange={handleChange}
                id="offerActiveCheck"
              />
              <label
                className="form-check-label fw-bold"
                htmlFor="offerActiveCheck"
              >
                Add Special Offer / Discount
              </label>
            </div>
          </div>
          {formData.offerActive && (
            <>
              <div className="col-md-4">
                <label className="form-label">Original Price (€)</label>
                <input
                  type="number"
                  className="form-control"
                  name="offerOldPrice"
                  value={formData.offerOldPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="399.99"
                />
                <small className="text-muted">Price before discount</small>
              </div>
              <div className="col-md-4">
                <label className="form-label">Discounted Price (€)</label>
                <input
                  type="number"
                  className="form-control"
                  name="offerNewPrice"
                  value={formData.offerNewPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="299.99"
                />
                <small className="text-muted">New offer price</small>
              </div>
              <div className="col-md-4">
                <label className="form-label">Offer Badge</label>
                <input
                  type="text"
                  className="form-control"
                  name="offerBadge"
                  value={formData.offerBadge}
                  onChange={handleChange}
                  placeholder="25% OFF"
                />
                <small className="text-muted">
                  Badge text (e.g., "Summer Sale")
                </small>
              </div>
            </>
          )}

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
                  Update Flight
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateFlightModal;