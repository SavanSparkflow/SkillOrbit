import Review from '../models/Review.js';
import Course from '../models/Course.js';

// @desc    Get reviews for a course
// @route   GET /api/courses/:courseId/reviews
// @access  Public
export const getCourseReviews = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to a course
// @route   POST /api/courses/:courseId/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();

      const populatedReview = await Review.findById(alreadyReviewed._id).populate(
        'user',
        'name avatar'
      );

      return res.json({
        success: true,
        message: 'Review updated successfully',
        review: populatedReview,
      });
    }

    const review = await Review.create({
      user: req.user._id,
      course: courseId,
      rating: Number(rating),
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};
