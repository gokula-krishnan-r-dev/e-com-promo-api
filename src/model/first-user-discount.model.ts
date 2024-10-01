import { Schema, model, Document } from 'mongoose';

// Interface representing the First Order Discount document
interface IFirstOrderDiscount extends Document {
  discountPercentage: number;
  isApplied?: boolean;
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
