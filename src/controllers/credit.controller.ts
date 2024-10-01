import { Request, Response } from 'express';
import { createCreditSchema, updateCreditSchema } from '../validators/credit.validator';
import { Credit } from '../model/credit.model';

export const createCredit = async (req: Request, res: Response) => {
  try {
    // Validate request body using Joi schema
    const { error, value } = createCreditSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const credit = new Credit(value); // value already validated

    await credit.save();
    return res.status(201).json({ message: 'Credit created successfully', credit });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: 'Failed to create credit' });
  }
};

export const getCredit = async (_req: Request, res: Response) => {
  try {
    const credits = await Credit.find();
    return res.status(200).json({ credits });
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
