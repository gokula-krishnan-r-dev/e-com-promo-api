import { Schema, model, Document } from 'mongoose';

// Interface representing the First Order Discount document
interface IFirstOrderDiscount extends Document {
  discountPercentage: number;
  isApplied?: boolean;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mailDate: Date;
  isUsered?: boolean;
}

// Mongoose Schema for First Order Discount
const firstOrderDiscountSchema = new Schema<IFirstOrderDiscount>(
  {
    discountPercentage: {
      type: Number,
      required: true, // Only this field is required
      min: 0,
      max: 100,
    },
    userId: {
      type: String,
      required: true, // Only this field is required
      unique: false,
    },
    isUsered: {
      type: Boolean,
      default: false, // Default to false if not provided
    },
    firstName: {
      type: String,
      required: true, // Only this field is required
    },
    lastName: {
      type: String,
      required: true, // Only this field is required
    },
    mailDate: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      required: true, // Only this field is required
    },
    isApplied: {
      type: Boolean,
      default: false, // Default to false if not provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create and export the FirstOrderDiscount model
const FirstOrderDiscount = model<IFirstOrderDiscount>('FirstOrderDiscount', firstOrderDiscountSchema);
export default FirstOrderDiscount;
