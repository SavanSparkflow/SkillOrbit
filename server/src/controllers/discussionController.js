import Discussion from '../models/Discussion.js';
import Course from '../models/Course.js';

// @desc    Get Discussions for a specific lesson
// @route   GET /api/discussions/lesson/:lessonId
// @access  Private
export const getLessonDiscussions = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const discussions = await Discussion.find({ lessonId })
      .populate('user', 'name avatar role')
      .populate('answers.user', 'name avatar role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      discussions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new discussion question
// @route   POST /api/discussions
// @access  Private
export const createDiscussion = async (req, res, next) => {
  try {
    const { courseId, lessonId, title, content } = req.body;

    const discussion = await Discussion.create({
      courseId,
      lessonId,
      user: req.user._id,
      title,
      content,
    });

    await discussion.populate('user', 'name avatar role');

    res.status(201).json({
      success: true,
      discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply / Add answer to a discussion
// @route   POST /api/discussions/:discussionId/answers
// @access  Private
export const addAnswer = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    const course = await Course.findById(discussion.courseId);
    const isInstructor =
      course?.instructor?.toString() === req.user._id.toString() ||
      req.user.role === 'admin' ||
      req.user.role === 'teacher';

    discussion.answers.push({
      user: req.user._id,
      content,
      isInstructorAnswer: isInstructor,
    });

    await discussion.save();
    await discussion.populate('user', 'name avatar role');
    await discussion.populate('answers.user', 'name avatar role');

    res.status(201).json({
      success: true,
      discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle upvote on discussion
// @route   POST /api/discussions/:discussionId/upvote
// @access  Private
export const toggleUpvoteDiscussion = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    const index = discussion.upvotes.indexOf(userId);
    if (index === -1) {
      discussion.upvotes.push(userId);
    } else {
      discussion.upvotes.splice(index, 1);
    }

    await discussion.save();
    await discussion.populate('user', 'name avatar role');
    await discussion.populate('answers.user', 'name avatar role');

    res.json({
      success: true,
      discussion,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle resolution status
// @route   PUT /api/discussions/:discussionId/resolve
// @access  Private
export const toggleResolve = async (req, res, next) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    discussion.isResolved = !discussion.isResolved;
    await discussion.save();
    await discussion.populate('user', 'name avatar role');
    await discussion.populate('answers.user', 'name avatar role');

    res.json({
      success: true,
      discussion,
    });
  } catch (error) {
    next(error);
  }
};
