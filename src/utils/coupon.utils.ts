export const generateCouponCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let couponCode = '';
  for (let i = 0; i < 8; i++) {
    couponCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return couponCode;
};
