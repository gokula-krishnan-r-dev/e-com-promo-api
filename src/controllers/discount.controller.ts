import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';
const discountService = new DiscountService();
import Joi from 'joi';
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
    const { sortBy, sortOrder, page, limit, search, ...filters } = req.query;

    // Get discounts using a service
    const { discounts, total } = await discountService.getDiscounts({
      sortBy,
      sortOrder,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string,
      ...filters,
    });

    // Return success response
    return res.status(200).json({
      discounts,
      total,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
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

export default { createDiscount, getDiscounts, getDiscountById, updateDiscount };
