import Joi from 'joi';
import { Status } from '../enums/coupon.enum';

export const createCreditSchema = Joi.object({
  creditAmount: Joi.number().positive().required().messages({
    'number.base': 'Credit amount must be a number',
    'number.positive': 'Credit amount must be greater than zero',
    'any.required': 'Credit amount is required',
  }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional().messages({
    'date.min': 'End date cannot be before start date',
  }),
  userIds: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'User IDs must be an array',
    'any.required': 'User IDs are required',
  }),

  remarks: Joi.string().max(500).optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .required()
    .messages({
      'any.only': `Status must be one of: ${Object.values(Status).join(', ')}`,
      'any.required': 'Status is required',
    }),
  user: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
  }),
});

export const updateCreditSchema = Joi.object({
  creditAmount: Joi.number().positive().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  remarks: Joi.string().max(500).optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  user: Joi.string().optional(),
});
