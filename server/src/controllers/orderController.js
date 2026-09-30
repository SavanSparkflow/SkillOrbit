import Order from '../models/Order.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

// @desc    Create checkout order & enroll user
// @route   POST /api/orders/checkout
// @access  Private
export const createCheckoutOrder = async (req, res, next) => {
  try {
    const { courseIds, paymentMethod = 'razorpay' } = req.body;

    if (!courseIds || !courseIds.length) {
      return res.status(400).json({ success: false, message: 'No courses provided for checkout' });
    }

    const courses = await Course.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ success: false, message: 'One or more invalid courses in checkout' });
    }

    const user = await User.findById(req.user._id);

    const items = courses.map((course) => ({
      course: course._id,
      price: course.price,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    const order = await Order.create({
      user: user._id,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: 'completed',
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

    res.status(201).json({
      success: true,
      message: 'Checkout successful! You are now enrolled.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user order history
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.course', 'title thumbnail price category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
