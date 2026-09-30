import Lesson from '../models/Lesson.js';
import Chapter from '../models/Chapter.js';
import Course from '../models/Course.js';

// @desc    Add a lesson to a chapter
// @route   POST /api/chapters/:chapterId/lessons
// @access  Private (Teacher, Admin)
export const createLesson = async (req, res, next) => {
  try {
    const { chapterId } = req.params;
    const { title, description, videoUrl, duration, isFreePreview, resources } = req.body;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const course = await Course.findById(chapter.courseId);
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course',
      });
    }

    const position = chapter.lessons.length + 1;

    const lesson = await Lesson.create({
      title,
      description: description || '',
      chapterId: chapter._id,
      courseId: course._id,
      videoUrl,
      duration: duration || 300,
      position,
      isFreePreview: isFreePreview || false,
      resources: resources || [],
    });

    chapter.lessons.push(lesson._id);
    await chapter.save();

    res.status(201).json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Teacher, Admin)
export const updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.courseId);
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this lesson',
      });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Teacher, Admin)
export const deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const course = await Course.findById(lesson.courseId);
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lesson',
      });
    }

    // Remove from chapter
    const chapter = await Chapter.findById(lesson.chapterId);
    if (chapter) {
      chapter.lessons = chapter.lessons.filter(
        (lId) => lId.toString() !== lesson._id.toString()
      );
      await chapter.save();
    }

    await Lesson.findByIdAndDelete(lesson._id);

    res.json({
      success: true,
      message: 'Lesson removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
