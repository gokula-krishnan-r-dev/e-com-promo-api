import Discount from '../model/discount.model';
export class DiscountService {
  async createDiscount(couponData: any) {
    const newCoupon = new Discount(couponData);

    await newCoupon.save();
    return newCoupon;
  }
  async getDiscounts(queryParams: any) {
    const { sortBy, sortOrder, page, limit, search, startDate, endDate, ...filters } = queryParams;

    // Sort options based on query
    const sortOptions: { [key: string]: 1 | -1 } = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
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

    // Date range filtering using startDate and endDate
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter['startDate'] = {
        $gte: new Date(startDate), // Greater than or equal to the specified startDate
        $lte: new Date(endDate), // Less than or equal to the specified endDate
      };
    }

    // Combine filters, search conditions, and date filters
    const queryConditions = {
      ...filters,
      ...searchConditions,
      ...dateFilter,
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
