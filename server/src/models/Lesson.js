import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    duration: {
      type: Number, // Duration in seconds (e.g., 600 for 10 mins)
      default: 0,
    },
    position: {
      type: Number,
      default: 1,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: { type: String },
        url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
