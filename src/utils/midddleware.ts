import { NextFunction, Request, Response } from 'express';
import { Coupon } from '../model/coupon.model';
import { Credit } from '../model/credit.model';

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
    }

    const credits = await Credit.find({ status: 'ACTIVE', endDate: { $lt: new Date() } });
    console.log(credits, 'credits');

    if (credits.length > 0) {
      // Update each coupon status to 'INACTIVE' if expired
      await Promise.all(
        credits.map(async (credit) => {
          await Credit.findByIdAndUpdate(credit._id, { status: 'INACTIVE' });
        })
      );
    }

    const creditsList = await Credit.find({ status: 'ACTIVE' });

    const amount = creditsList.map(async (credit: any) => {
      const creditAmount = credit.creditAmount;
      const usedAmount = credit.usedAmount;
      const remainingAmount = creditAmount <= usedAmount;
      if (remainingAmount) {
        console.log('Credit is expired', credit);

        await Credit.findByIdAndUpdate(credit._id, { status: 'INACTIVE' });
      }
    });

    console.log(`${amount.length} credits were set to inactive due to expiration.`);

    next();
  } catch (error) {
    console.error('Error updating expired coupons:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default updateExpiredCouponsMiddleware;
