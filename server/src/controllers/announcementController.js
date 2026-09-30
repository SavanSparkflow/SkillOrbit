import Announcement from '../models/Announcement.js';

// @desc    Get Announcements for a course
// @route   GET /api/announcements/course/:courseId
// @access  Public / Protected
export const getCourseAnnouncements = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const announcements = await Announcement.find({ courseId })
      .populate('instructor', 'name avatar role')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Course Announcement
// @route   POST /api/announcements
// @access  Private (Teacher, Admin)
export const createAnnouncement = async (req, res, next) => {
  try {
    const { courseId, title, content, isPinned } = req.body;

    const announcement = await Announcement.create({
      courseId,
      instructor: req.user._id,
      title,
      content,
      isPinned: !!isPinned,
    });

    await announcement.populate('instructor', 'name avatar role');

    res.status(201).json({
      success: true,
      announcement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an Announcement
// @route   DELETE /api/announcements/:announcementId
// @access  Private (Teacher, Admin)
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { announcementId } = req.params;
    await Announcement.findByIdAndDelete(announcementId);
    res.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
