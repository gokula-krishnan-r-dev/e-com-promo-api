import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service';
import { validationResult } from 'express-validator';
import { Coupon } from '../model/coupon.model';
import Joi from 'joi';
import { FilterQuery } from 'mongoose';
import { couponSchema } from '../validation/coupon.validation';
import { responseJson } from '../utils/responseJson';
const couponService = new CouponService();

export const createCoupon = async (req: Request, res: Response) => {
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return responseJson(res, 400, 'Validation failed', null, errors.array());
  }

  const { couponCode, couponGenerationType } = req.body;

  try {
    // Check if the coupon code already exists (only for manual coupon generation)
    const existingCoupon = await Coupon.findOne({ couponCode });
    if (existingCoupon) {
      return responseJson(res, 400, 'Coupon code already exists. Please choose a different code.');
    }

    // If validation passes, create the coupon
    const coupon = await couponService.createCoupon(req.body);
    return responseJson(res, 201, 'Coupon created successfully', coupon);
  } catch (error) {
    console.error(error);
    return responseJson(res, 500, 'Failed to create coupon', null, error.message || 'Internal Server Error');
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { couponId } = req.params;

    // Validate the request body using Joi
    const { error, value: couponData } = couponSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map((err) => err.message),
      });
    }

    // Check if the coupon exists
    const existingCoupon = await Coupon.findById(couponId);
    console.log(existingCoupon);

    if (!existingCoupon) {
      return res.status(404).json({
        message: 'Coupon not found.',
      });
    }

    // Update the coupon
    const updatedCoupon = await couponService.updateCoupon(couponId, couponData);
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update coupon',
      error: error.message || 'Internal Server Error',
    });
  }
};

// Joi validation schema for the search query
const validateCouponSearch = Joi.object({
  couponCode: Joi.string().optional(),
  couponType: Joi.string().valid('GENERAL', 'BIRTHDAY', 'ANNIVERSARY').optional(),
  validForCountry: Joi.string().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE').optional(),
  useType: Joi.string().valid('ONE_TIME', 'MULTIPLE').optional(),
  filter: Joi.string()
    .valid('FLAT_DISCOUNT_NO_MIN', 'FLAT_DISCOUNT_WITH_MIN', 'FREE_SHIPPING', 'BIRTHDAY', 'ANNIVERSARY')
    .optional(),
  sortBy: Joi.string().valid('createdAt', 'discountValue', 'startDate').default('createdAt').optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc').optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

// Helper function to build the filter query
const buildFilterQuery = (filters: any): FilterQuery<any> => {
  const query: FilterQuery<any> = {};

  if (filters.couponCode) {
    query.couponCode = { $regex: filters.couponCode, $options: 'i' }; // Case-insensitive search
  }
  if (filters.couponType) {
    query.couponType = filters.couponType;
  }
  if (filters.validForCountry) {
    query.validForCountry = filters.validForCountry;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.useType) {
    query.useType = filters.useType;
  }

  // Apply specific filter cases
  switch (filters.filter) {
    case 'FLAT_DISCOUNT_NO_MIN':
      query.discountType = 'FLAT';
      query.minimumPurchase = { $exists: false };
      break;
    case 'FLAT_DISCOUNT_WITH_MIN':
      query.discountType = 'FLAT';
      query.minimumPurchase = { $gt: 0 };
      break;
    case 'FREE_SHIPPING':
      query.couponType = 'GENERAL';
      query.couponGenerationType = 'AUTOMATIC'; // For example, a free shipping coupon
      break;
    case 'BIRTHDAY':
      query.couponType = 'BIRTHDAY';
      break;
    case 'ANNIVERSARY':
      query.couponType = 'ANNIVERSARY';
      break;
  }

  return query;
};

// GET method for fetching coupons with search and filters
export const getCoupons = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Validate query params
    const { error, value: filters } = validateCouponSearch.validate(req.query);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid search query',
        details: error.details.map((err) => err.message),
      });
    }

    // Extract pagination and sorting info
    const page = Number(filters.page);
    const limit = Number(filters.limit);
    const sortBy = filters.sortBy;
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    // Ensure limit and page are valid numbers
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: 'Invalid pagination values' });
    }

    const query = buildFilterQuery(filters);

    // Pagination and sorting
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder };

    // Fetch the coupons based on the query, with pagination and sorting
    const coupons = await Coupon.find(query).skip(skip).limit(limit).sort(sort);

    // Fetch the total count for pagination
    const totalCoupons = await Coupon.countDocuments(query);

    // Return the result with pagination info
    return res.status(200).json({
      status: 'success',
      data: coupons,
      pagination: {
        totalItems: totalCoupons,
        currentPage: page,
        totalPages: Math.ceil(totalCoupons / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Server error while fetching coupons',
    });
  }
};

// Delete coupon by ID
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { couponId } = req.params;

    // Validate coupon ID format
    if (!couponId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        code: 'INVALID_ID_FORMAT',
        message: 'Invalid coupon ID format. It must be a valid 24-character MongoDB ObjectID.',
      });
    }

    // Check if the coupon exists
    const existingCoupon = await Coupon.findById(couponId);

    if (!existingCoupon) {
      return res.status(404).json({
        code: 'COUPON_NOT_FOUND',
        message: 'Coupon not found. Please provide a valid coupon ID.',
      });
    }

    // Delete the coupon
    await couponService.deleteCoupon(couponId);

    return res.status(200).json({
      code: 'COUPON_DELETED_SUCCESSFULLY',
      message: `Coupon with ID ${couponId} was deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);

    // Handle specific errors if necessary
    if (error.name === 'CastError') {
      return res.status(400).json({
        code: 'INVALID_ID',
        message: 'The provided coupon ID is invalid.',
      });
    }

    // General error handling
    return res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred while attempting to delete the coupon.',
      details: error.message || 'Internal Server Error',
    });
  }
};

export const getCouponById = async (req: Request, res: Response) => {
  try {
    const { couponId } = req.params;

    // Validate coupon ID format
    if (!couponId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        code: 'INVALID_ID_FORMAT',
        message: 'Invalid coupon ID format. It must be a valid 24-character MongoDB ObjectID.',
      });
    }

    // Check if the coupon exists
    const existingCoupon = await Coupon.findById(couponId);

    if (!existingCoupon) {
      return res.status(404).json({
        code: 'COUPON_NOT_FOUND',
        message: 'Coupon not found. Please provide a valid coupon ID.',
      });
    }

    return res.status(200).json(existingCoupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);

    // Handle specific errors if necessary
    if (error.name === 'CastError') {
      return res.status(400).json({
        code: 'INVALID_ID',
        message: 'The provided coupon ID is invalid.',
      });
    }

    // General error handling
    return res.status(500).json({
      code: 'SERVER_ERROR',
      message: 'An unexpected error occurred while attempting to fetch the coupon.',
      details: error.message || 'Internal Server Error',
    });
  }
};

export default {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getCouponById,
};
