import { Request, Response } from 'express';
import firstOrderDiscountService from '../services/firstOrderDiscount.service';

export class FirstOrderDiscountController {
  // Create a first-order discount for a user
  async createDiscount(req: Request, res: Response) {
    try {
      const { isActive, discountPercentage } = req.body;

      const discount = await firstOrderDiscountService.createFirstOrderDiscount({
        discountPercentage,
        isActive,
      });

      res.status(201).json({
        message: 'First-order discount created successfully',
        discount,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to create first-order discount',
        error: error.message,
      });
    }
  }

  // Get available discount for a user
  async getDiscount(req: Request, res: Response) {
    try {
      const discount = await firstOrderDiscountService.getDiscount();

      res.status(200).json({
        message: 'First-order discount retrieved successfully',
        discount,
      });
    } catch (error) {
      res.status(404).json({
        message: 'Failed to retrieve first-order discount',
        error: error.message,
      });
    }
  }

  // Apply the first-order discount for a user
  async applyDiscount(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const discount = await firstOrderDiscountService.applyDiscount(userId);

      res.status(200).json({
        message: 'First-order discount applied successfully',
        discount,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to apply first-order discount',
        error: error.message,
      });
    }
  }

  async updateDiscount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { discountPercentage } = req.body;

      const discount = await firstOrderDiscountService.updateDiscount(id, {
        discountPercentage,
      });

      res.status(200).json({
        message: 'First-order discount updated successfully',
        discount,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to update first-order discount',
        error: error.message,
      });
    }
  }
}

export default new FirstOrderDiscountController();
