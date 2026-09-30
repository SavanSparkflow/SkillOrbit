import Chapter from '../models/Chapter.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

// @desc    Add a chapter to a course
// @route   POST /api/chapters
// @access  Private (Teacher, Admin)
export const createChapter = async (req, res, next) => {
  try {
    const { title, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add chapters to this course',
      });
    }

    const position = course.chapters.length + 1;

    const chapter = await Chapter.create({
      title,
      courseId,
      position,
      lessons: [],
    });

    course.chapters.push(chapter._id);
    await course.save();

    res.status(201).json({
      success: true,
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chapter
// @route   PUT /api/chapters/:id
// @access  Private (Teacher, Admin)
export const updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
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
        message: 'Not authorized to modify this chapter',
      });
    }

    chapter.title = req.body.title || chapter.title;
    if (req.body.position !== undefined) chapter.position = req.body.position;

    await chapter.save();

    res.json({
      success: true,
      chapter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chapter and its lessons
// @route   DELETE /api/chapters/:id
// @access  Private (Teacher, Admin)
export const deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
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
        message: 'Not authorized to delete this chapter',
      });
    }

    // Delete lessons inside this chapter
    await Lesson.deleteMany({ chapterId: chapter._id });

    // Remove chapter reference from course
    course.chapters = course.chapters.filter(
      (cId) => cId.toString() !== chapter._id.toString()
    );
    await course.save();

    await Chapter.findByIdAndDelete(chapter._id);

    res.json({
      success: true,
      message: 'Chapter and associated lessons deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
