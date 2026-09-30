import Course from '../models/Course.js';
import Chapter from '../models/Chapter.js';
import Lesson from '../models/Lesson.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

// @desc    Get all courses with search, filter, and pagination
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      price,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isPublished: true };

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price filter (free vs paid)
    if (price === 'free') {
      query.price = 0;
    } else if (price === 'paid') {
      query.price = { $gt: 0 };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { enrollmentCount: -1 };
    } else if (sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar bio headline')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID (with chapters, lessons, instructor)
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio headline')
      .populate({
        path: 'chapters',
        options: { sort: { position: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { position: 1 } },
        },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Teacher, Admin)
export const createCourse = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      thumbnail,
      promoVideoUrl,
      price,
      originalPrice,
      category,
      level,
      language,
      learningOutcomes,
      requirements,
      isPublished,
    } = req.body;

    const course = await Course.create({
      title,
      subtitle,
      description,
      thumbnail: thumbnail || undefined,
      promoVideoUrl,
      price: price ? Number(price) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : (price ? Number(price) * 1.5 : 0),
      category: category || 'Web Development',
      level: level || 'All Levels',
      language: language || 'Gujarati / English',
      learningOutcomes: learningOutcomes || [],
      requirements: requirements || [],
      instructor: req.user._id,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private (Teacher owner, Admin)
export const updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course',
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('instructor', 'name avatar');

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course and its chapters/lessons
// @route   DELETE /api/courses/:id
// @access  Private (Teacher owner, Admin)
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course',
      });
    }

    // Delete associated lessons and chapters
    await Lesson.deleteMany({ courseId: course._id });
    await Chapter.deleteMany({ courseId: course._id });
    await Progress.deleteMany({ courseId: course._id });
    await Course.findByIdAndDelete(course._id);

    res.json({
      success: true,
      message: 'Course and related lessons removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses created by current logged-in teacher
// @route   GET /api/courses/teacher/my-courses
// @access  Private (Teacher, Admin)
export const getTeacherCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('chapters')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Direct enroll in a course (for free course or instant enrollment)
// @route   POST /api/courses/:id/enroll
// @access  Private
export const enrollInCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'chapters',
      populate: { path: 'lessons' },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already enrolled
    const isEnrolled = user.enrolledCourses.some(
      (cId) => cId.toString() === course._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course',
      });
    }

    // Add course to user's enrolledCourses
    user.enrolledCourses.push(course._id);
    await user.save();

    // Increment course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    // Initialize progress
    const firstLesson = course.chapters?.[0]?.lessons?.[0]?._id || null;
    await Progress.create({
      studentId: user._id,
      courseId: course._id,
      completedLessons: [],
      lastWatchedLesson: firstLesson,
      isCourseCompleted: false,
    });

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course!',
      courseId: course._id,
    });
  } catch (error) {
    next(error);
  }
};
