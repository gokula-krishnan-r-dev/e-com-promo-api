import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';
const discountService = new DiscountService();
import Joi from 'joi';
import Discount from '../model/discount.model';
// API Controller for creating a discount
const createDiscount = async (req: Request, res: Response) => {
  try {
    const { cartAmount, discountPercentage, validCountry, displayOnSite, displayDiscount, startDate, endDate } = req.body;

    // Create the discount using a service
    const discount = await discountService.createDiscount({
      cartAmount,
      discountPercentage,
      validCountry,
      displayOnSite,
      displayDiscount,
      startDate,
      endDate,
    });

    // Return success response
    return res.status(201).json({
      message: 'Discount created successfully',
      discount,
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    return res.status(500).json({
      message: 'Failed to create discount',
      error: error.message || 'Internal Server Error',
    });
  }
};

const getDiscounts = async (req: Request, res: Response) => {
  try {
    // Get query params
    const { sortBy, sortOrder, page, limit, search, startDate, endDate, ...filters } = req.query;

    // Get discounts using a service
    const { discounts, total } = await discountService.getDiscounts({
      sortBy,
      sortOrder,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
      ...filters,
    });

    const discountsCount = await Discount.countDocuments();

    // Return success response
    return res.status(200).json({
      discounts,
      total,
      pagination: {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        totalPages: Math.ceil(discountsCount / parseInt(limit as string, 10)),
      },
    });
  } catch (error) {
    console.error('Error getting discounts:', error);
    return res.status(500).json({
      message: 'Failed to get discounts',
      error: error.message || 'Internal Server Error',
    });
  }
};

const getDiscountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get discount by ID using a service
    const discount = await discountService.getDiscountById(id);

    // Return success response
    return res.status(200).json({
      discount,
    });
  } catch (error) {
    console.error('Error getting discount by ID:', error);
    return res.status(500).json({
      message: 'Failed to get discount by ID',
      error: error.message || 'Internal Server Error',
    });
  }
};

const updateDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cartAmount, discountPercentage, validCountry, displayOnSite, displayDiscount, startDate, endDate } = req.body;

    // Update the discount using a service
    const discount = await discountService.updateDiscount(id, {
      cartAmount,
      discountPercentage,
      validCountry,
      displayOnSite,
      displayDiscount,
      startDate,
      endDate,
    });

    // Return success response
    return res.status(200).json({
      message: 'Discount updated successfully',
      discount,
      code: 201,
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    return res.status(500).json({
      message: 'Failed to update discount',
      error: error.message || 'Internal Server Error',
    });
  }
};

// delete
export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate coupon ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        code: 'INVALID_ID_FORMAT',
        message: 'Invalid coupon ID format. It must be a valid 24-character MongoDB ObjectID.',
      });
    }

    // Check if the coupon exists
    const existingCoupon = await Discount.findById(id);

    if (!existingCoupon) {
      return res.status(404).json({
        code: 'COUPON_NOT_FOUND',
        message: 'Coupon not found. Please provide a valid coupon ID.',
      });
    }

    // Delete the coupon
    await discountService.deleteDiscount(id);

    return res.status(200).json({
      code: 'COUPON_DELETED_SUCCESSFULLY',
      message: `Coupon with ID ${id} was deleted successfully.`,
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

export default { createDiscount, getDiscounts, getDiscountById, updateDiscount, deleteDiscount };
