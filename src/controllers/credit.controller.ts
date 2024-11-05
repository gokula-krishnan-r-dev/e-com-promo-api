import { Request, Response } from 'express';
import { createCreditSchema, updateCreditSchema } from '../validators/credit.validator';
import { Credit } from '../model/credit.model';
import { UserCreditMapping } from '../model/credit.mapping.model';
import { fetchById } from './firstOrderDiscount.controller';
const assignCouponToUsers = async (userIds: string[], creditId: any) => {
  try {
    const mappings = await Promise.all(
      userIds.map(async (userId) => {
        const user = await fetchById(userId);

        if (!user) {
          return { userId, success: false, message: 'User not found' };
        }

        return {
          userId,
          creditId,
          isUsed: false,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
      })
    );

    // Bulk insert all mappings
    await UserCreditMapping.insertMany(mappings);
    console.log('Coupon assigned to users successfully');
  } catch (error) {
    console.error('Error assigning coupon to users:', error);
  }
};

export const createCredit = async (req: Request, res: Response) => {
  try {
    // Validate request body using Joi schema
    const { error, value } = createCreditSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const credit = new Credit(value); // value already validated

    await assignCouponToUsers(value.userIds, credit._id);

    await credit.save();
    return res.status(201).json({ message: 'Credit created successfully', credit });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: 'Failed to create credit' });
  }
};

export const getCredit = async (req: Request, res: Response) => {
  try {
    const { sortBy, sortOrder, page = 1, limit = 10, search, startDate, endDate, ...filters } = req.query;

    // Fetch all credits and populate creditId details
    const credits = await UserCreditMapping.find({}).populate('creditId');

    // Group credits by userId and format creditId as an array
    const groupedCredits = credits.reduce((acc, credit) => {
      const userId = credit.userId.toString();

      // Check if this userId is already in the accumulator
      if (!acc[userId]) {
        acc[userId] = {
          _id: credit.userId,
          firstName: credit.firstName,
          lastName: credit.lastName,
          email: credit.email,
          creditId: [], // Initialize creditId as an array
          isUsed: credit.isUsed,
        };
      }

      // Push each creditId details into the user's creditId array
      acc[userId].creditId.push(credit.creditId);

      return acc;
    }, {});

    // Convert the grouped credits object to an array
    const data = Object.values(groupedCredits);

    // Get the total number of credits
    const totalCredit = await Credit.countDocuments();

    return res.status(200).json({
      data,
      message: 'Credits retrieved successfully',
      pagination: {
        totalItems: totalCredit,
        currentPage: Number(page),
        totalPages: Math.ceil(totalCredit / Number(limit)),
        pageSize: Number(limit),
      },
    });
  } catch (error) {
    console.log(error, 'error');

    return res.status(500).json({ error: 'Failed to retrieve credits' });
  }
};

export const getCreditById = async (req: Request, res: Response) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    return res.status(200).json({ credit });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve credit' });
  }
};

export const updateCredit = async (req: Request, res: Response) => {
  try {
    // Validate request body using Joi schema
    const { error, value } = updateCreditSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const credit = await Credit.findByIdAndUpdate(req.params.id, value, { new: true, runValidators: true });
    if (!credit) {
      return res.status(404).json({ message: 'Credit not found' });
    }

    return res.status(200).json({ message: 'Credit updated successfully', credit });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update credit' });
  }
};

export const deleteCredit = async (req: Request, res: Response) => {
  try {
    const credit = await Credit.findByIdAndDelete(req.params.id);
    if (!credit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    return res.status(200).json({ message: 'Credit deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete credit' });
  }
};
