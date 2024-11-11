import { Request, Response } from 'express';
import { createCreditSchema, updateCreditSchema } from '../validators/credit.validator';
import { Credit } from '../model/credit.model';
import { UserCreditMapping } from '../model/credit.mapping.model';
import { fetchById } from './firstOrderDiscount.controller';
import { responseJson } from '../utils/responseJson';
import { MongoClient } from 'mongodb';
import { uri } from '../routes/v1/user.route';
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
    if (value.user === 'ALL') {
      const client = new MongoClient(uri);

      try {
        // Connect to the MongoDB cluster
        await client.connect();
        const role = 'user';
        // Access the specific database and collection
        const database = client.db('big_one'); // replace with your database name
        const collection = database.collection('users'); // replace with your collection name
        const data = await collection.find({ role }).toArray();

        const final: any = data.map((item) => {
          return item._id;
        });

        const credit = new Credit(value); // value already validated
        console.log(credit, 'credit');

        await assignCouponToUsers(final, credit._id);
        await credit.save();

        return responseJson(res, 201, 'Coupon created successfully', final);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        // Close the connection
        await client.close();
      }
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
    const {
      sortBy = 'startDate', // Default sorting field
      sortOrder = 'desc', // Default sorting order
      page = 1,
      limit = 10,
      firstName,
      lastName,
      validUpTo,
      status,
      startDate,
      endDate,
      ...filters
    } = req.query;

    // Construct a dynamic filter object
    const queryFilters: any = {};

    if (firstName) {
      queryFilters.firstName = { $regex: new RegExp(firstName as string, 'i') }; // Case-insensitive search for firstName
    }

    if (lastName) {
      queryFilters.lastName = { $regex: new RegExp(lastName as string, 'i') }; // Case-insensitive search for lastName
    }

    // if (validUpTo) {
    //   queryFilters.validUpTo = { $lte: new Date(validUpTo as any) }; // Filter for validUpTo dates
    // }

    if (status) {
      queryFilters.status = status; // Filter by status
    }

    if (validUpTo) {
      queryFilters.endDate = { $gte: new Date(validUpTo as any) }; // Filter by startDate and endDate
    }

    // Include any additional filters dynamically
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryFilters[key] = filters[key]; // Add dynamic filters
      }
    });

    // Fetch credits based on the dynamic filter
    const credits = await UserCreditMapping.find(queryFilters)
      .populate('creditId') // Populate creditId details
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 }) // Sort based on query params
      .skip((Number(page) - 1) * Number(limit)) // Pagination: Skip items based on current page
      .limit(Number(limit)); // Limit results based on page size

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

    // Get the total number of credits for pagination
    const totalCredit = await UserCreditMapping.countDocuments(queryFilters);

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
    const credit = await UserCreditMapping.findByIdAndDelete(req.params.id);
    if (!credit) {
      return res.status(404).json({ message: 'Credit not found' });
    }
    return res.status(200).json({ message: 'Credit deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete credit' });
  }
};
