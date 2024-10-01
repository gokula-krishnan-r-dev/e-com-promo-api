import { Schema, model, Document } from 'mongoose';
import { ValidCountry } from '../enums/coupon.enum';

// Interface representing the Discount document
interface IDiscount extends Document {
  cartAmount: number;
  discountPercentage: number;
  validCountry: ValidCountry; // Enum of valid countries
  displayOnSite: boolean;
  displayDiscount: number; // Minimum cart amount for discount display
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Mongoose Schema for Discount
const discountSchema = new Schema<IDiscount>(
  {
    cartAmount: {
      type: Number,
      required: [true, 'Cart amount is required.'],
      min: [0, 'Cart amount must be at least 0.'],
    },
    discountPercentage: {
      type: Number,
      required: [true, 'Discount percentage is required.'],
      min: [0, 'Discount percentage must be at least 0%.'],
      max: [100, 'Discount percentage must be at most 100%.'],
    },
    validCountry: {
      type: String,
      enum: ['ALL', 'INDIA', 'USA', 'CANADA'], // Enum for valid countries
      required: [true, 'Valid country is required.'],
    },
    displayOnSite: {
      type: Boolean,
      required: [true, 'Display on site is required.'],
    },
    displayDiscount: {
      type: Number,
      required: [true, 'Display discount (minimum cart amount) is required.'],
      min: [0, 'Display discount must be at least 0.'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required.'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required.'],
      validate: {
        validator: function (value: Date) {
          // Ensure end date is after start date
          return value > this.startDate;
        },
        message: 'End date must be after the start date.',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Discount model
const Discount = model<IDiscount>('Discount', discountSchema);
export default Discount;
