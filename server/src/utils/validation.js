import Joi from 'joi';

/**
 * Vendor validation schema
 */
export const vendorValidation = Joi.object({
  name: Joi.string().required().trim().min(2).max(100)
    .messages({
      'string.empty': 'Vendor name is required',
      'string.min': 'Vendor name must be at least 2 characters',
      'string.max': 'Vendor name must not exceed 100 characters'
    }),
  contactPerson: Joi.string().required().trim().min(2).max(100)
    .messages({
      'string.empty': 'Contact person name is required'
    }),
  email: Joi.string().email().allow('').optional()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  phone: Joi.string().required().trim().min(10).max(15)
    .pattern(/^[+]?[0-9]{10,15}$/)
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  whatsappNumber: Joi.string().trim().min(10).max(15)
    .pattern(/^[+]?[0-9]{10,15}$/)
    .allow('').optional(),
  address: Joi.object({
    street: Joi.string().trim().allow('').optional(),
    city: Joi.string().trim().allow('').optional(),
    state: Joi.string().trim().allow('').optional(),
    pincode: Joi.string().trim().allow('').optional(),
    country: Joi.string().trim().default('India').optional()
  }).optional(),
  jobWorkType: Joi.array().items(
    Joi.string().valid('Knitting', 'Dyeing', 'Printing', 'Stitching', 'Finishing')
  ).min(1).required()
    .messages({
      'array.min': 'At least one job work type is required',
      'any.only': 'Invalid job work type'
    }),
  gstin: Joi.string().trim().length(15).uppercase()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .allow('').optional()
    .messages({
      'string.length': 'GSTIN must be 15 characters',
      'string.pattern.base': 'Invalid GSTIN format'
    }),
  pan: Joi.string().trim().length(10).uppercase()
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .allow('').optional()
    .messages({
      'string.length': 'PAN must be 10 characters',
      'string.pattern.base': 'Invalid PAN format'
    }),
  bankDetails: Joi.object({
    accountNumber: Joi.string().trim().allow('').optional(),
    ifscCode: Joi.string().trim().allow('').optional(),
    bankName: Joi.string().trim().allow('').optional(),
    branch: Joi.string().trim().allow('').optional()
  }).optional(),
  isActive: Joi.boolean().default(true),
  rating: Joi.number().min(0).max(5).default(0).optional()
});

/**
 * User registration validation schema
 */
export const userRegistrationValidation = Joi.object({
  name: Joi.string().required().trim().min(2).max(100)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters'
    }),
  email: Joi.string().email().required().lowercase().trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  password: Joi.string().required().min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    }),
  role: Joi.string().valid('Admin', 'Supervisor', 'Vendor').default('Supervisor')
    .messages({
      'any.only': 'Invalid role. Must be Admin, Supervisor, or Vendor'
    }),
  phone: Joi.string().trim().allow('').optional(),
  vendorId: Joi.string().when('role', {
    is: 'Vendor',
    then: Joi.required().messages({
      'any.required': 'Vendor ID is required for vendor users'
    }),
    otherwise: Joi.allow(null).optional()
  })
});

/**
 * Login validation schema
 */
export const loginValidation = Joi.object({
  email: Joi.string().email().required().lowercase().trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

/**
 * Validation middleware
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }

    req.body = value;
    next();
  };
};

export default {
  vendorValidation,
  userRegistrationValidation,
  loginValidation,
  validate
};

