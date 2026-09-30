import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    subtitle: {
      type: String,
      default: '',
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    },
    promoVideoUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0, // 0 = Free
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'Data Science & AI',
        'UI/UX Design',
        'Cloud & DevOps',
        'Cybersecurity',
        'Business & Marketing',
      ],
      default: 'Web Development',
    },
    level: {
      type: String,
      enum: ['All Levels', 'Beginner', 'Intermediate', 'Advanced'],
      default: 'All Levels',
    },
    language: {
      type: String,
      default: 'Gujarati / English',
    },
    learningOutcomes: [
      {
        type: String,
      },
    ],
    requirements: [
      {
        type: String,
      },
    ],
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
      },
    ],
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 5.0,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating total duration in minutes or lessons
courseSchema.virtual('totalLessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'courseId',
  count: true,
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
