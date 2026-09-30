import Progress from '../models/Progress.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';

// @desc    Get progress of a course for current user
// @route   GET /api/progress/:courseId
// @access  Private
export const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    let progress = await Progress.findOne({
      studentId: req.user._id,
      courseId,
    });

    if (!progress) {
      // Find course to get first lesson
      const course = await Course.findById(courseId).populate({
        path: 'chapters',
        populate: { path: 'lessons' },
      });

      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }

      const firstLesson = course.chapters?.[0]?.lessons?.[0]?._id || null;

      progress = await Progress.create({
        studentId: req.user._id,
        courseId,
        completedLessons: [],
        lastWatchedLesson: firstLesson,
        isCourseCompleted: false,
      });
    }

    // Count total lessons in course
    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progress.completedLessons.length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.json({
      success: true,
      progress,
      totalLessons,
      completedCount,
      progressPercent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle lesson completion status
// @route   POST /api/progress/:courseId/toggle-lesson
// @access  Private
export const toggleLessonCompletion = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;

    let progress = await Progress.findOne({
      studentId: req.user._id,
      courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        studentId: req.user._id,
        courseId,
        completedLessons: [],
        lastWatchedLesson: lessonId,
        isCourseCompleted: false,
      });
    }

    const isCompleted = progress.completedLessons.some(
      (lId) => lId.toString() === lessonId
    );

    if (isCompleted) {
      // Mark incomplete
      progress.completedLessons = progress.completedLessons.filter(
        (lId) => lId.toString() !== lessonId
      );
      progress.isCourseCompleted = false;
      progress.completedAt = null;
    } else {
      // Mark complete
      progress.completedLessons.push(lessonId);
      progress.lastWatchedLesson = lessonId;

      // Check if all lessons are now complete
      const totalLessons = await Lesson.countDocuments({ courseId });
      if (
        totalLessons > 0 &&
        progress.completedLessons.length >= totalLessons
      ) {
        progress.isCourseCompleted = true;
        progress.completedAt = new Date();
        progress.certificateId =
          'SKILLORBIT-CERT-' +
          Math.random().toString(36).substring(2, 9).toUpperCase();
      }
    }

    await progress.save();

    const totalLessons = await Lesson.countDocuments({ courseId });
    const completedCount = progress.completedLessons.length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.json({
      success: true,
      progress,
      totalLessons,
      completedCount,
      progressPercent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update last watched lesson position
// @route   PUT /api/progress/:courseId/last-watched
// @access  Private
export const updateLastWatchedLesson = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { lessonId } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { studentId: req.user._id, courseId },
      { lastWatchedLesson: lessonId },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify public certificate by certificateId
// @route   GET /api/progress/verify-certificate/:certificateId
// @access  Public
export const verifyCertificate = async (req, res, next) => {
  try {
    const { certificateId } = req.params;

    const progress = await Progress.findOne({ certificateId })
      .populate('studentId', 'name email avatar')
      .populate({
        path: 'courseId',
        select: 'title subtitle thumbnail category level instructor',
        populate: { path: 'instructor', select: 'name avatar title' },
      });

    if (!progress || !progress.isCourseCompleted) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Certificate not found or course is not completed',
      });
    }

    res.json({
      success: true,
      verified: true,
      certificate: {
        certificateId: progress.certificateId,
        student: progress.studentId,
        course: progress.courseId,
        completedAt: progress.completedAt,
        issuedAt: progress.completedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
