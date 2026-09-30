import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address',
      });
    }

    // Role can only be student or teacher from public registration
    const userRole = role === 'teacher' ? 'teacher' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          headline: user.headline,
          enrolledCourses: user.enrolledCourses,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          headline: user.headline,
          enrolledCourses: user.enrolledCourses,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      select: 'title subtitle thumbnail category level averageRating totalReviews instructor',
      populate: {
        path: 'instructor',
        select: 'name avatar',
      },
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.avatar = req.body.avatar || user.avatar;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.headline = req.body.headline !== undefined ? req.body.headline : user.headline;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          headline: updatedUser.headline,
          enrolledCourses: updatedUser.enrolledCourses,
        },
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};
