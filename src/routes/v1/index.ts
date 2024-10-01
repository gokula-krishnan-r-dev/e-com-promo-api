import CouponRoute from './coupon.route';

import express from 'express';
import discountRoute from './discount.route';
import CreditRoute from './credit.route';

const router = express.Router();

router.use('/coupons', CouponRoute);
router.use('/discounts', discountRoute);
router.use('/credits', CreditRoute);

export default router;
