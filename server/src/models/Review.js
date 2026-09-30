import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment review'],
      maxlength: [500, 'Review comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// One review per user per course
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

// Static method to calculate average rating of a course
reviewSchema.statics.calculateAverageRating = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Course').findByIdAndUpdate(courseId, {
      averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await mongoose.model('Course').findByIdAndUpdate(courseId, {
      averageRating: 5.0,
      totalReviews: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.course);
});

reviewSchema.post('remove', function () {
  this.constructor.calculateAverageRating(this.course);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
