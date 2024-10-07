import { Schema, model, Document } from 'mongoose';
import { ICoupon } from './coupon.model'; // Import your Coupon interface

export interface IUserCouponMapping extends Document {
  userId: any['_id']; // Reference to the User model
  couponId: ICoupon['_id']; // Reference to the Coupon model
  isUsed?: boolean; // Track if the coupon is used
  usedAt?: Date; // Date when the coupon was used
}
const UserCouponMappingSchema = new Schema<IUserCouponMapping>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    isUsed: { type: Boolean, default: false }, // Whether the coupon has been used
    usedAt: { type: Date, required: false }, // Optional date for coupon usage
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);
export const UserCouponMapping = model<IUserCouponMapping>('UserCouponMapping', UserCouponMappingSchema);
