import { Request, Response } from 'express';
import { createCreditSchema, updateCreditSchema } from '../validators/credit.validator';
import { Credit } from '../model/credit.model';
import { UserCreditMapping } from '../model/credit.mapping.model';
const assignCouponToUsers = async (userIds: string[], creditId: any) => {
  try {
    // Create mappings for each userId with the same couponId
    const mappings = userIds.map((userId) => ({
      userId,
      creditId,
      isUsed: false,
    }));

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
    const { sortBy, sortOrder, page, limit, search, startDate, endDate, ...filters } = req.query;

    const credits = await Credit.find();
    const totalCredit = await Credit.countDocuments();
    return res.status(200).json({
      data: credits,
      message: 'Credits retrieved successfully',
      pagination: {
        totalItems: totalCredit,
        currentPage: page,
        totalPages: Math.ceil(totalCredit / Number(limit) || 1),
        pageSize: limit,
      },
    });
  } catch (error) {
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
