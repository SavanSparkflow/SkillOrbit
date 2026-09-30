import Quiz from '../models/Quiz.js';
import Course from '../models/Course.js';

// @desc    Get Quizzes for a course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getCourseQuizzes = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ courseId });

    res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Quiz for a specific lesson
// @route   GET /api/quizzes/lesson/:lessonId
// @access  Private
export const getLessonQuiz = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ lessonId });

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a Quiz
// @route   POST /api/quizzes
// @access  Private (Teacher, Admin)
export const createQuiz = async (req, res, next) => {
  try {
    const { title, courseId, chapterId, lessonId, passingScore, questions } = req.body;

    const quiz = await Quiz.create({
      title,
      courseId,
      chapterId: chapterId || null,
      lessonId: lessonId || null,
      passingScore: passingScore || 70,
      questions,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a Quiz
// @route   PUT /api/quizzes/:quizId
// @access  Private (Teacher, Admin)
export const updateQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { title, passingScore, questions, lessonId, chapterId } = req.body;

    let quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const updateData = {
      title,
      passingScore: passingScore || 70,
      questions,
    };
    if (lessonId !== undefined) updateData.lessonId = lessonId;
    if (chapterId !== undefined) updateData.chapterId = chapterId;

    quiz = await Quiz.findByIdAndUpdate(quizId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a Quiz
// @route   DELETE /api/quizzes/:quizId
// @access  Private (Teacher, Admin)
export const deleteQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(quizId);

    res.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Quiz Answers & Calculate Score
// @route   POST /api/quizzes/:quizId/submit
// @access  Private
export const submitQuiz = async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { selectedAnswers } = req.body; // Array of selected option indices [0, 2, 1...]

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    const review = quiz.questions.map((q, idx) => {
      const selected = selectedAnswers[idx];
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount += 1;

      return {
        question: q.question,
        selected,
        correctAnswer: q.correctAnswerIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePercent >= (quiz.passingScore || 70);

    res.json({
      success: true,
      scorePercent,
      correctCount,
      totalQuestions,
      passed,
      review,
    });
  } catch (error) {
    next(error);
  }
};
