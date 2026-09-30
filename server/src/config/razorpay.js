import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

export const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'sample_razorpay_secret_key_2026',
  });
};
