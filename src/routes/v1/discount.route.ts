import express from 'express';

import { validateRequest } from '../../validation/validation';
import discountController from '../../controllers/discount.controller';
import { discountSchema, validateFirstOrderDiscount } from '../../validation/discount.validation';
import firstOrderDiscountController from '../../controllers/firstOrderDiscount.controller';
const discountRoute = express.Router();

discountRoute.post('/', validateRequest(discountSchema), discountController.createDiscount);
discountRoute.put('/:id', validateRequest(discountSchema), discountController.updateDiscount);
discountRoute.post('/first-order-discounts', validateFirstOrderDiscount, firstOrderDiscountController.createDiscount);
discountRoute.put('/first-order-discounts/:id', validateFirstOrderDiscount, firstOrderDiscountController.updateDiscount);
// Get available first-order discount for a user
discountRoute.get('/', discountController.getDiscounts);
discountRoute.get('/first-order-discounts', firstOrderDiscountController.getDiscount);
discountRoute.get('/:id', discountController.getDiscountById);

// Apply the first-order discount
discountRoute.post('/apply/:userId', firstOrderDiscountController.applyDiscount);

// discountRoute.get('/', CoupenController.getCoupons);
// discountRoute.put('/:couponId', CoupenController.updateCoupon);
// discountRoute.delete('/:couponId', CoupenController.deleteCoupon);

export default discountRoute;
