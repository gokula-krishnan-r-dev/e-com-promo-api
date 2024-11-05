import { Request, Response } from 'express';
import firstOrderDiscountService from '../services/firstOrderDiscount.service';

import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://mahendrakumara:OWBwvJMulburUhtN@cluster0.gqgye.mongodb.net/'; // replace 'your_database' with your database name

export const fetchById = async (id: string) => {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Access the specific database and collection
    const database = client.db('big_one'); // replace with your database name
    const collection = database.collection('users'); // replace with your collection name
    const role = 'user';
    const data = await collection.findOne({ _id: new ObjectId(id), role });
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    // Close the connection
    await client.close();
  }
};
export class FirstOrderDiscountController {
  // Create a first-order discount for a user

  async createDiscount(req: Request, res: Response) {
    try {
      const { isActive, discountPercentage, userIds } = req.body;

      // Ensure userIds are unique
      const uniqueUserIds = Array.from(new Set(userIds));
      if (!Array.isArray(uniqueUserIds) || uniqueUserIds.length === 0) {
        return res.status(400).json({
          message: 'User IDs are required and should be an array.',
        });
      }

      // Process each userId and attempt to create a discount for them
      const results = await Promise.allSettled(
        uniqueUserIds.map(async (userId: string) => {
          try {
            // Fetch user details
            const user = await fetchById(userId);
            if (!user) {
              return { userId, success: false, message: 'User not found' };
            }

            const { firstName, lastName, email } = user;

            // Create the discount
            await firstOrderDiscountService.createFirstOrderDiscount({
              discountPercentage,
              isActive,
              userId,
              firstName,
              lastName,
              email,
            });

            return { userId, success: true, message: 'Discount created successfully' };
          } catch (err) {
            console.error(`Error processing user ID ${userId}:`, err);
            return { userId, success: false, message: 'Error creating discount' };
          }
        })
      );

      // Format the results for response
      const formattedResults = results.map((result) => {
        if (result.status === 'fulfilled') return result.value;
        return { success: false, message: 'Unknown error', ...result.reason };
      });

      res.status(201).json({
        message: 'Discount creation process completed',
        results: formattedResults,
      });
    } catch (error) {
      console.error('Error creating first-order discount:', error);
      res.status(500).json({
        message: 'Failed to create first-order discount',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get available discount for a user
  async getDiscount(req: Request, res: Response) {
    try {
      const discount = await firstOrderDiscountService.getFirstOrder();
      const totalCount = await firstOrderDiscountService.countDiscounts();
      res.status(200).json({
        message: 'First-order discount retrieved successfully',
        discount,
        pagination: {
          totalPages: totalCount,
        },
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

  async updateFirstOrderDiscount(req: Request, res: Response) {
    try {
      const { discountId } = req.params;
      const { isActive, discountPercentage } = req.body;

      const updatedDiscount = await firstOrderDiscountService.updateFirstOrderDiscount(discountId, {
        isActive,
        discountPercentage,
      });

      res.status(200).json({
        message: 'First-order discount updated successfully',
        discount: updatedDiscount,
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to update first-order discount',
        error: error.message,
      });
    }
  }

  async deleteFirstOrderDiscount(req: Request, res: Response) {
    try {
      const { discountId } = req.params;

      await firstOrderDiscountService.deleteFirstOrderDiscount(discountId);

      res.status(200).json({
        message: 'First-order discount deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to delete first-order discount',
        error: error.message,
      });
    }
  }

  async fetchByid(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const discount = await firstOrderDiscountService.fetchById(id);

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
}

export default new FirstOrderDiscountController();
