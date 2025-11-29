const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const flightSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [50, "Price must be at least 50"],
      max: [10000, "Price must be at most 10000"],
    },

    origin: {
      city: { type: String, required: [true, "Origin city is required"] },
      country: { type: String, required: [true, "Origin country is required"] },
    },

    destination: {
      city: { type: String, required: [true, "Destination city is required"] },
      country: {
        type: String,
        required: [true, "Destination country is required"],
      },
    },

    offer: {
      isActive: { type: Boolean, default: false },
      oldPrice: { type: Number, min: [0, "Old price cannot be negative"] },
      newPrice: {
        type: Number,
        min: [0, "New price cannot be negative"],
        validate: {
          validator: function (value) {
            return !this.offer.isActive || value < this.offer.oldPrice;
          },
          message:
            "New price must be lower than old price when offer is active",
        },
      },
      badge: { type: String, default: "Hot Offer" },
      expiresAt: {
        type: Date,
        validate: {
          validator: function (value) {
            return !value || value > new Date();
          },
          message: "Expiration date must be in the future",
        },
      },
    },
    image: {
      type: String,
      required: [true, "Flight image is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot be more than 5"],
      default: 0,
    },
  },
  { timestamps: true }
);

const Flights = mongoose.model("Flight", flightSchema);

function handleFlightValidation(flightData) {
  const schema = Joi.object({
    price: Joi.number().min(50).max(10000).required(),
    origin: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    destination: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    image: Joi.string().required(),
    offer: Joi.object({
      isActive: Joi.boolean().default(false),
      oldPrice: Joi.number().min(0),
      newPrice: Joi.number().min(0),
      badge: Joi.string().default("Hot Offer"),
      expiresAt: Joi.date().greater("now"),
    }).optional(),

    description: Joi.string().max(500).required(),
    rating: Joi.number().min(0).max(5).default(0),
  });

  const { error, value } = schema.validate(flightData, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return { valid: false, errors };
  }

  return { valid: true, value };
}

module.exports = { Flights, handleFlightValidation };
