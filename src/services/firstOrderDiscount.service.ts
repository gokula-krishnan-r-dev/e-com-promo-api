import FirstOrderDiscount from '../model/first-user-discount.model';

export class FirstOrderDiscountService {
  // Create a new first-order discount for a user
  async createFirstOrderDiscount(discountData: { discountPercentage: number; isActive: boolean }) {
    const existingDiscount = await FirstOrderDiscount.findOne({});

    if (existingDiscount) {
      const updatedDiscount = await FirstOrderDiscount.findOneAndUpdate({ _id: existingDiscount._id }, discountData, {
        new: true,
      });
      updatedDiscount.save();

      return updatedDiscount;
    }
    const newDiscount = new FirstOrderDiscount(discountData);
    return newDiscount.save();
  }

  // Get discount details for a user (if not applied yet)
  async getDiscount() {
    const discount = await FirstOrderDiscount.find().sort({ createdAt: -1 });
    if (!discount) {
      throw new Error('No available first-order discount for this user.');
    }
    return discount;
  }

  // Mark the discount as applied
  async applyDiscount(userId: string) {
    const discount = await FirstOrderDiscount.findOneAndUpdate(
      { userId, isApplied: false },
      { isApplied: true },
      { new: true }
    );

    if (!discount) {
      throw new Error('No available first-order discount to apply.');
    }

    return discount;
  }

  async updateDiscount(id, discountData: { discountPercentage: number }) {
    const discount = await FirstOrderDiscount.findOneAndUpdate(id, discountData, { new: true });

    if (!discount) {
      throw new Error('No available first-order discount to update.');
    }

    return discount;
  }
}

export default new FirstOrderDiscountService();
