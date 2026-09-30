import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    lastWatchedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    isCourseCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    certificateId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one progress doc per user per course
progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
