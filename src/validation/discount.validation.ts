import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
// Joi schema validation for the create discount request
export const discountSchema = Joi.object({
  cartAmount: Joi.number().min(0).required().label('Cart Amount').messages({
    'number.base': '"Cart Amount" must be a number.',
    'number.min': '"Cart Amount" must be a positive number.',
    'any.required': '"Cart Amount" is required.',
  }),

  discountPercentage: Joi.number().min(0).max(100).required().label('Discount Percentage').messages({
    'number.base': '"Discount Percentage" must be a number.',
    'number.min': '"Discount Percentage" must be at least 0%.',
    'number.max': '"Discount Percentage" must be at most 100%.',
    'any.required': '"Discount Percentage" is required.',
  }),

  validCountry: Joi.string()
    .valid('ALL', 'US', 'CA', 'US/UK', 'ROW') // Add more countries as needed
    .required()
    .label('Valid Country')
    .messages({
      'any.only': '"Valid Country" must be one of ["ALL", "US", "CA", "US/UK", "ROW"].',
      'any.required': '"Valid Country" is required.',
    }),

  displayOnSite: Joi.boolean().required().label('Display On Site').messages({
    'any.required': '"Display On Site" is required.',
  }),

  displayDiscount: Joi.number().min(0).required().label('Display Discount (Minimum Cart Amount)').messages({
    'number.base': '"Display Discount" must be a number.',
    'number.min': '"Display Discount" must be a positive number.',
    'any.required': '"Display Discount" is required.',
  }),

  startDate: Joi.date().iso().required().label('Start Date').messages({
    'date.base': '"Start Date" must be a valid ISO date.',
    'any.required': '"Start Date" is required.',
  }),

  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().label('End Date').messages({
    'date.base': '"End Date" must be a valid ISO date.',
    'date.greater': '"End Date" must be after the start date.',
    'any.required': '"End Date" is required.',
  }),
});

// Validation schema for first-order discount creation
const firstOrderDiscountSchema = Joi.object({
  discountPercentage: Joi.number().min(0).max(100).optional(),
  isActive: Joi.boolean().optional(),
  userIds: Joi.array().items(Joi.string()).min(1).required(),
});

// Middleware to validate request body
export const validateFirstOrderDiscount = (req: Request, res: Response, next: NextFunction) => {
  const { error } = firstOrderDiscountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details.map((err) => err.message),
    });
  }
  next();
};
