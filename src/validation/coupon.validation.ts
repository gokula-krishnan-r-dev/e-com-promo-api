import Joi from 'joi';

// Coupon Creation Validation Schema using Joi
export const validateCreateCoupon = Joi.object({
  couponType: Joi.string().valid('GENERAL', 'BIRTHDAY', 'ANNIVERSARY').required().messages({
    'any.only': 'Invalid coupon type. Must be GENERAL, BIRTHDAY, or ANNIVERSARY.',
    'any.required': 'Coupon type is required.',
  }),

  couponGenerationType: Joi.string().valid('AUTOMATIC', 'MANUAL').required().messages({
    'any.only': 'Invalid coupon generation type. Must be AUTOMATIC or MANUAL.',
    'any.required': 'Coupon generation type is required.',
  }),

  couponCode: Joi.when('couponGenerationType', {
    is: 'MANUAL',
    then: Joi.string().min(6).max(12).required().messages({
      'string.empty': 'Coupon code is required for manual generation.',
      'string.min': 'Coupon code must be at least 6 characters long.',
      'string.max': 'Coupon code must be at most 12 characters long.',
    }),
    otherwise: Joi.optional(),
  }),

  discountType: Joi.string().valid('FLAT', 'PERCENTAGE').required().messages({
    'any.only': 'Invalid discount type. Must be FLAT or PERCENTAGE.',
    'any.required': 'Discount type is required.',
  }),

  discountValue: Joi.number()
    .required()
    .messages({
      'number.base': 'Discount value must be a number.',
      'any.required': 'Discount value is required.',
    })
    .when('discountType', {
      is: 'PERCENTAGE',
      then: Joi.number().min(0).max(100).messages({
        'number.min': 'Percentage discount must be at least 0.',
        'number.max': 'Percentage discount must be at most 100.',
      }),
    }),

  minimumPurchase: Joi.number().required().messages({
    'number.base': 'Minimum purchase must be a number.',
    'any.required': 'Minimum purchase is required.',
  }),

  startDate: Joi.date().iso().required().messages({
    'any.required': 'Start date is required.',
    'date.iso': 'Start date must be a valid ISO 8601 date.',
  }),

  endDate: Joi.date().iso().required().greater(Joi.ref('startDate')).messages({
    'any.required': 'End date is required.',
    'date.iso': 'End date must be a valid ISO 8601 date.',
    'date.greater': 'End date must be after start date.',
  }),

  useType: Joi.string().valid('ONE_TIME', 'MULTIPLE').required().messages({
    'any.only': 'Invalid use type. Must be ONE_TIME or MULTIPLE.',
    'any.required': 'Use type is required.',
  }),

  validForCountry: Joi.string().valid('ALL', 'INDIA').required().messages({
    'any.only': 'Invalid country. Must be ALL or INDIA.',
    'any.required': 'Valid country is required.',
  }),

  validOnProducts: Joi.string().valid('ALL_PRODUCTS', 'SPECIFIC_CATEGORY', 'SPECIFIC_PRODUCT').required().messages({
    'any.only': 'Invalid product type. Must be ALL_PRODUCTS, SPECIFIC_CATEGORY, or SPECIFIC_PRODUCT.',
    'any.required': 'Product type is required.',
  }),

  displayOnSite: Joi.boolean().required().messages({
    'boolean.base': 'Display on site must be a boolean.',
    'any.required': 'Display on site is required.',
  }),

  description: Joi.string().required().messages({
    'string.empty': 'Description is required.',
    'any.required': 'Description is required.',
  }),

  status: Joi.string().valid('ACTIVE', 'INACTIVE').required().messages({
    'any.only': 'Invalid status. Must be ACTIVE or INACTIVE.',
    'any.required': 'Status is required.',
  }),

  birthdayMonth: Joi.when('couponType', {
    is: 'BIRTHDAY',
    then: Joi.string()
      .valid(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      )
      .required()
      .messages({
        'any.only': 'Invalid birthday month. Must be a valid month name.',
        'any.required': 'Birthday month is required for BIRTHDAY coupons.',
      }),
    otherwise: Joi.optional(),
  }),

  anniversaryMonth: Joi.when('couponType', {
    is: 'ANNIVERSARY',
    then: Joi.string()
      .valid(
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      )
      .required()
      .messages({
        'any.only': 'Invalid anniversary month. Must be a valid month name.',
        'any.required': 'Anniversary month is required for ANNIVERSARY coupons.',
      }),
    otherwise: Joi.optional(),
  }),

  anniversaryYear: Joi.when('couponType', {
    is: 'ANNIVERSARY',
    then: Joi.number().integer().min(1000).max(9999).required().messages({
      'number.base': 'Anniversary year must be a number.',
      'number.min': 'Anniversary year must be a 4-digit year.',
      'number.max': 'Anniversary year must be a 4-digit year.',
      'any.required': 'Anniversary year is required for ANNIVERSARY coupons.',
    }),
    otherwise: Joi.optional(),
  }),
});

// Coupon Joi schema for both creating and updating coupons
export const couponSchema = Joi.object({
  couponCode: Joi.string().optional().messages({
    'any.required': 'Coupon code is required.',
    'string.empty': 'Coupon code cannot be empty.',
  }),
  couponGenerationType: Joi.string().valid('MANUAL', 'AUTOMATIC').optional().messages({
    'any.required': 'Coupon generation type is required.',
    'any.only': 'Coupon generation type must be MANUAL or AUTOMATIC.',
  }),
  couponType: Joi.string().valid('GENERAL', 'BIRTHDAY', 'ANNIVERSARY').optional().messages({
    'any.required': 'Coupon type is required.',
    'any.only': 'Coupon type must be GENERAL, BIRTHDAY, or ANNIVERSARY.',
  }),
  discountType: Joi.string().valid('PERCENTAGE', 'FLAT').optional(),
  discountValue: Joi.number().greater(0).optional().messages({
    'number.greater': 'Discount value must be greater than 0.',
    'any.required': 'Discount value is required.',
  }),
  minimumPurchase: Joi.number().min(0).optional(),
  startDate: Joi.date().iso().optional().messages({
    'date.iso': 'Start date must be in ISO format.',
    'any.required': 'Start date is required.',
  }),
  endDate: Joi.date().iso().optional().messages({
    'date.iso': 'End date must be in ISO format.',
    'any.required': 'End date is required.',
  }),
  validForCountry: Joi.string().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').default('ACTIVE'),
  useType: Joi.string().valid('ONE_TIME', 'MULTIPLE').default('ONE_TIME'),
});
