import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    position: {
      type: Number,
      default: 1,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chapter = mongoose.model('Chapter', chapterSchema);
export default Chapter;
