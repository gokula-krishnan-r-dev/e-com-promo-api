import { FilterQuery } from 'mongoose';
import Discount from '../model/discount.model';

export class DiscountService {
  async createDiscount(couponData: any) {
    const newCoupon = new Discount(couponData);
    await newCoupon.save();
    return newCoupon;
  }

  async getDiscounts(queryParams: any) {
    const {
      sortBy = 'startDate',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      ...filters
    } = queryParams;

    const sortOptions: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    // Initialize search conditions
    const searchConditions: FilterQuery<any> = {};

    if (search) {
      // Handle numeric search for cartAmount and discountPercentage
      const searchNumeric = parseFloat(search);
      searchConditions.$or = [
        { validCountry: { $regex: search, $options: 'i' } },
        ...(isNaN(searchNumeric) ? [] : [{ cartAmount: searchNumeric }, { discountPercentage: searchNumeric }]),
      ];
    }

    // Date range filter
    const dateFilter: FilterQuery<any> = {};
    if (startDate && endDate) {
      dateFilter['startDate'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Combine all conditions into the query
    const queryConditions: FilterQuery<any> = {
      ...filters,
      ...searchConditions,
      ...dateFilter,
    };

    // Fetch discounts and count total documents for pagination
    const discounts = await Discount.find(queryConditions).sort(sortOptions).skip(skip).limit(limit).exec();

    const total = await Discount.countDocuments(queryConditions);

    return {
      discounts,
      total,
      page,
      limit,
    };
  }

  async getDiscountById(discountId: string) {
    return Discount.findById(discountId);
  }

  async updateDiscount(id: string, discountData: any) {
    return Discount.findByIdAndUpdate(id, discountData, { new: true });
  }

  async deleteDiscount(id: string) {
    return Discount.findByIdAndDelete(id);
  }
}
