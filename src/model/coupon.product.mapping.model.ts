import mongoose, { Schema, Document } from 'mongoose';
import { ValidProducts } from '../enums/coupon.enum';

// Interface for ProductCouponMapping
export interface IProductCouponMapping extends Document {
  couponId: mongoose.Types.ObjectId;
  validOnProducts: ValidProducts;
  productIds?: mongoose.Types.ObjectId[]; // Array of product IDs when validOnProducts is SINGLE_PRODUCT
  categories?: mongoose.Types.ObjectId[]; // For category-based coupons
  isUsed: boolean;
}

// Updated schema for handling array of product IDs
const productCouponMappingSchema = new Schema<IProductCouponMapping>({
  couponId: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  validOnProducts: {
    type: String,
    enum: Object.values(ValidProducts),
    required: true,
  },
  productIds: {
    type: [Schema.Types.ObjectId],
    ref: 'Product',
    required: function (this: IProductCouponMapping) {
      return this.validOnProducts === ValidProducts.SPECIFIC_PRODUCT;
    },
  },
  categories: {
    type: [Schema.Types.ObjectId],
    ref: 'Category',
    required: function (this: IProductCouponMapping) {
      return this.validOnProducts === ValidProducts.SPECIFIC_CATEGORY;
    },
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

// Export the model
const ProductCouponMapping = mongoose.model<IProductCouponMapping>('ProductCouponMapping', productCouponMappingSchema);

export default ProductCouponMapping;
