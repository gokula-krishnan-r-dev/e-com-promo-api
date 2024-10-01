import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Middleware to validate request body using Joi schema with custom error handling
export const validateRequest = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // Validate request body

    if (error) {
      // Format validation errors
      const validationErrors = error.details.map((err) => ({
        field: err.path.join('.'), // Field that caused the error
        message: err.message, // Error message
        suggestion: `Please provide a valid value for ${err.path.join('.')}.`, // Suggestion for fixing
      }));

      // Return a custom structured error response
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        validationErrors, // Detailed error information
        hint: 'Ensure all required fields are correctly filled and adhere to the validation rules.',
        timestamp: new Date().toISOString(), // Add a timestamp for debugging/logging purposes
      });
    }

    // If validation passes, move to the next middleware/controller
    next();
  };
};
