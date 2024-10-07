import express from 'express';
import CoupenController from '../../controllers/coupon.controller';
const CouponRoute = express.Router();

// CouponRoute.post('/', validateRequest(validateCreateCoupon), CoupenController.createCoupon);
CouponRoute.post('/', CoupenController.createCoupon);
CouponRoute.get('/', CoupenController.getCoupons);
CouponRoute.get('/user', CoupenController.getUserCoupons);
CouponRoute.get('/products', CoupenController.getProducts);
CouponRoute.post('/products', CoupenController.addProducts);
CouponRoute.get('/:couponId', CoupenController.getCouponById);
CouponRoute.put('/:couponId', CoupenController.updateCoupon);
CouponRoute.delete('/:couponId', CoupenController.deleteCoupon);

export default CouponRoute;
