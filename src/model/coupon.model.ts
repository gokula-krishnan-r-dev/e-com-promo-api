import { Schema, model, Document } from 'mongoose';
import { CouponType, DiscountType, ValidCountry, ValidProducts, Status, CouponUseType } from '../enums/coupon.enum';

export interface ICoupon extends Document {
  couponType: CouponType;
  couponCode?: string;
  discountType: DiscountType;
  discountValue: number;
  minimumPurchase: number;
  startDate?: Date;
  endDate?: Date;
  useType?: CouponUseType;
  validForCountry?: ValidCountry;
  validOnProducts?: ValidProducts;
  productId?: string[]; // If applicable
  moduleId?: string[]; // If applicable
  birthdayMonth?: string; // If applicable
  anniversaryMonth?: string; // If applicable
  displayOnSite?: boolean;
  description: string;
  status: Status;
}

const CouponSchema = new Schema<ICoupon>(
  {
    couponType: { type: String, enum: CouponType, required: true },
    couponCode: { type: String, required: false, unique: true },
    discountType: { type: String, enum: DiscountType, required: true },
    discountValue: { type: Number, required: true },
    minimumPurchase: { type: Number, required: true, default: 0 },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    useType: { type: String, enum: CouponUseType, required: false },
    validForCountry: { type: String, enum: ValidCountry, required: false },
    validOnProducts: { type: String, enum: ValidProducts, required: false },
    productId: [{ type: Schema.Types.ObjectId, ref: 'Product' }], // Optional for specific product
    moduleId: [{ type: Schema.Types.ObjectId, ref: 'Module' }], // Optional for specific module
    displayOnSite: { type: Boolean, required: false },
    description: { type: String, required: false },
    status: { type: String, enum: Status, required: true },
    birthdayMonth: {
      type: String,
      required: function (this: ICoupon) {
        return this.couponType === 'BIRTHDAY';
      },
    },
    anniversaryMonth: {
      type: String,
      required: function (this: ICoupon) {
        return this.couponType === 'ANNIVERSARY';
      },
    },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>('Coupon', CouponSchema);
