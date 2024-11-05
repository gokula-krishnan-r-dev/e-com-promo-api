import { Schema, model, Document } from 'mongoose';

export interface IUserCreditMapping extends Document {
  userId: any['_id']; // Reference to the User model
  firstName: string;
  lastName: string;
  email: string;
  creditId: any['_id']; // Reference to the Coupon model
  isUsed?: boolean; // Track if the coupon is used
  usedAt?: Date; // Date when the coupon was used
}
const UserCreditMappingSchema = new Schema<IUserCreditMapping>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    creditId: { type: Schema.Types.ObjectId, ref: 'credit', required: true },
    isUsed: { type: Boolean, default: false }, // Whether the coupon has been used
    usedAt: { type: Date, required: false }, // Optional date for coupon usage
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);
export const UserCreditMapping = model<IUserCreditMapping>('UserCreditMapping', UserCreditMappingSchema);
