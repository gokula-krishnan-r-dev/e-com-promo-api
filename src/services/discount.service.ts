import Discount from '../model/discount.model';
export class DiscountService {
  async createDiscount(couponData: any) {
    const newCoupon = new Discount(couponData);

    await newCoupon.save();
    return newCoupon;
  }
  async getDiscounts(queryParams: any) {
    const { sortBy, sortOrder, page, limit, search, ...filters } = queryParams;

    // Sort options based on query
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (page - 1) * limit;

    // Build search conditions using $or operator to search multiple fields
    const searchConditions = search
      ? {
          $or: [
            { cartAmount: { $regex: search, $options: 'i' } }, // If searching in cartAmount
            { discountPercentage: { $regex: search, $options: 'i' } }, // Searching discountPercentage
            { validForCountry: { $regex: search, $options: 'i' } }, // Searching in validForCountry
          ],
        }
      : {};

    // Combine filters with search conditions
    const queryConditions = {
      ...filters,
      ...searchConditions,
    };

    // Fetch the discounts from the database
    const discounts = await Discount.find(queryConditions).sort(sortOptions).skip(skip).limit(limit).exec();

    // Count total matching documents for pagination
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
}
