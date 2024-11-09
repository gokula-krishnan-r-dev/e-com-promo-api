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
  user: Joi.string().required().messages({
    'string.base': 'User ID must be a string',
    'any.required': 'User ID is required',
  }),
  userIds: Joi.array()
    .items(Joi.string())
    .when('user', {
      is: 'ALL',
      then: Joi.optional(),
      otherwise: Joi.array().min(1).required().messages({
        'array.min': "Select at least one user when User is not 'ALL'.",
        'any.required': "User IDs are required when User is not 'ALL'.",
      }),
    }),
  remarks: Joi.string().max(500).optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .required()
    .messages({
      'any.only': `Status must be one of: ${Object.values(Status).join(', ')}`,
      'any.required': 'Status is required',
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
