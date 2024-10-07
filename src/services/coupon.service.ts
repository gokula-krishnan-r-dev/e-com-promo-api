import { CouponGenerationType } from '../enums/coupon.enum';
import { Coupon } from '../model/coupon.model';
import ProductModel from '../model/product.model';
import { generateCouponCode } from '../utils/coupon.utils';

export class CouponService {
  async createCoupon(couponData: any) {
    const { couponType, couponGenerationType, couponCode, ...rest } = couponData;
    console.log(couponData);

    let generatedCouponCode = couponCode;
    if (couponGenerationType === CouponGenerationType.AUTOMATIC) {
      generatedCouponCode = generateCouponCode();
    }

    const newCoupon = new Coupon({
      couponType,
      couponGenerationType,
      couponCode: generatedCouponCode,
      ...rest,
    });

    await newCoupon.save();
    return newCoupon;
  }

  async updateCoupon(couponId: string, couponData: any) {
    return Coupon.findByIdAndUpdate(couponId, couponData, { new: true });
  }

  async deleteCoupon(couponId: string) {
    return Coupon.findByIdAndDelete(couponId);
  }

  async getProducts() {
    return ProductModel.find();
  }

  async addProducts(product: any) {
    return ProductModel.create(product);
  }
}
