import { NextFunction, Request, Response } from 'express';
import { Coupon } from '../model/coupon.model';

const updateExpiredCouponsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find all coupons with a status of 'ACTIVE' whose endDate is in the past
    const coupons = await Coupon.find({ status: 'ACTIVE', endDate: { $lt: new Date() } });

    if (coupons.length > 0) {
      // Update each coupon status to 'INACTIVE' if expired
      await Promise.all(
        coupons.map(async (coupon) => {
          await Coupon.findByIdAndUpdate(coupon._id, { status: 'INACTIVE' });
        })
      );

      console.log(`${coupons.length} coupons were set to inactive due to expiration.`);
    }
    next();
  } catch (error) {
    console.error('Error updating expired coupons:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default updateExpiredCouponsMiddleware;
