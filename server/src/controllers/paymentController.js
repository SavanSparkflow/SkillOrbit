import crypto from 'crypto';
import { getRazorpayInstance } from '../config/razorpay.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Progress from '../models/Progress.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { courseIds, discountPercent = 0 } = req.body;

    if (!courseIds || !courseIds.length) {
      return res.status(400).json({ success: false, message: 'No courses selected' });
    }

    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ success: false, message: 'One or more invalid courses' });
    }

    const subtotal = courses.reduce((sum, c) => sum + (c.price || 0), 0);
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const finalAmount = Math.max(0, subtotal - discountAmount);

    // If free (₹0), bypass Razorpay and direct enroll
    if (finalAmount === 0) {
      return res.json({
        success: true,
        isFree: true,
        amount: 0,
        currency: 'INR',
      });
    }

    const razorpay = getRazorpayInstance();
    const options = {
      amount: finalAmount * 100, // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${req.user._id.toString().substring(0, 6)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      isFree: false,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
      order: razorpayOrder,
      amount: finalAmount,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature and Enroll Student
// @route   POST /api/payments/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseIds,
      totalAmount,
    } = req.body;

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'sample_razorpay_secret_key_2026';
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isAuthentic =
      generatedSignature === razorpay_signature ||
      process.env.NODE_ENV === 'development'; // allow sandbox dev

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature',
      });
    }

    // Process enrollment
    const courses = await Course.find({ _id: { $in: courseIds } });
    const user = await User.findById(req.user._id);

    const items = courses.map((course) => ({
      course: course._id,
      price: course.price,
    }));

    // Save completed order
    const order = await Order.create({
      user: user._id,
      items,
      totalAmount: totalAmount || courses.reduce((sum, c) => sum + c.price, 0),
      paymentMethod: 'razorpay',
      paymentStatus: 'completed',
      transactionId: razorpay_payment_id || 'RZP_' + Date.now(),
    });

    // Enroll user in all bought courses
    for (const course of courses) {
      if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        course.enrollmentCount += 1;
        await course.save();

        // Initialize progress
        await Progress.findOneAndUpdate(
          { studentId: user._id, courseId: course._id },
          {
            studentId: user._id,
            courseId: course._id,
            completedLessons: [],
            isCourseCompleted: false,
          },
          { upsert: true, new: true }
        );
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Razorpay payment verified! You are now enrolled.',
      order,
    });
  } catch (error) {
    next(error);
  }
};
