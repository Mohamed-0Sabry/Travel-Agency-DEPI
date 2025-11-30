const Joi = require('joi');

function handleFlightValidation(flightData) {
  const schema = Joi.object({
    price: Joi.number().min(50).max(10000).required(),
    
    origin: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    
    destination: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    
    image: Joi.string().required(),
    
    offer: Joi.object({
      isActive: Joi.boolean().default(false),
      oldPrice: Joi.number().min(0),
      newPrice: Joi.number().min(0),
      badge: Joi.string().default('Hot Offer'),
      expiresAt: Joi.date().greater('now')
    }).optional(),

    description: Joi.string().max(500).required(),
    
    rating: Joi.number().min(0).max(5).default(0)
  });

  const { error, value } = schema.validate(flightData, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return { valid: false, errors };
  }

  return { valid: true, value };
}

module.exports = { handleFlightValidation };