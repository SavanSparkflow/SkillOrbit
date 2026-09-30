import Coupon from '../models/Coupon.js';

// @desc    Validate a Coupon Code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, courseId, courseIds } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    }).populate('courseId', 'title thumbnail');

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    // Check usage limit
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    // Check specific course applicability
    if (coupon.courseId) {
      const targetCourseId = coupon.courseId._id ? coupon.courseId._id.toString() : coupon.courseId.toString();
      const courseTitle = coupon.courseId.title || 'this specific course';

      const allCourseIds = [
        ...(courseId ? [courseId.toString()] : []),
        ...((courseIds || []).map((id) => (id._id || id).toString())),
      ];

      if (allCourseIds.length > 0 && !allCourseIds.includes(targetCourseId)) {
        return res.status(400).json({
          success: false,
          message: `This coupon is only valid for "${courseTitle}". Please add this course to your cart to use this coupon.`,
        });
      }
    }

    const courseTitle = coupon.courseId?.title;
    const message = courseTitle
      ? `Coupon applied! ${coupon.discountPercentage}% OFF on "${courseTitle}"`
      : `Coupon applied successfully! ${coupon.discountPercentage}% OFF on all courses`;

    res.json({
      success: true,
      message,
      coupon: {
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        courseId: coupon.courseId?._id || coupon.courseId || null,
        courseTitle: courseTitle || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons created by teacher/admin
// @route   GET /api/coupons
// @access  Private (Teacher, Admin)
export const getMyCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ createdBy: req.user._id })
      .populate('courseId', 'title thumbnail')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Coupon
// @route   POST /api/coupons
// @access  Private (Teacher, Admin)
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercentage, courseId, expiresAt, maxUses } = req.body;

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountPercentage: Number(discountPercentage),
      courseId: courseId || null,
      createdBy: req.user._id,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: Number(maxUses) || 100,
    });

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Coupon
// @route   DELETE /api/coupons/:couponId
// @access  Private (Teacher, Admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    const { couponId } = req.params;
    await Coupon.findByIdAndDelete(couponId);
    res.json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
