import FirstOrderDiscount from '../model/first-user-discount.model';

export class FirstOrderDiscountService {
  // Create a new first-order discount for a user
  async createFirstOrderDiscount(discountData: {
    discountPercentage: number;
    isActive: boolean;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    const newDiscount = new FirstOrderDiscount(discountData);
    return newDiscount.save();
  }

  // Get discount details for a user (if not applied yet)
  async getFirstOrder() {
    const discount = await FirstOrderDiscount.find().sort({ createdAt: -1 });
    if (!discount) {
      throw new Error('No available first-order discount for this user.');
    }
    return discount;
  }

  async countDiscounts() {
    return FirstOrderDiscount.countDocuments();
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

  async updateFirstOrderDiscount(id, discountData: any) {
    const discount = await FirstOrderDiscount.findOneAndUpdate(id, discountData, { new: true });

    if (!discount) {
      throw new Error('No available first-order discount to update.');
    }

    return discount;
  }

  async deleteFirstOrderDiscount(id) {
    const discount = await FirstOrderDiscount.findOneAndDelete(id);

    if (!discount) {
      throw new Error('No available first-order discount to delete.');
    }

    return discount;
  }

  async fetchById(id) {
    const discount = await FirstOrderDiscount.findById(id);

    if (!discount) {
      throw new Error('No available first-order discount to fetch.');
    }

    return discount;
  }
}

export default new FirstOrderDiscountService();
