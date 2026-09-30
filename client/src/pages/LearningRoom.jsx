import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuthStore } from '../store/authStore';
import VideoPlayer from '../components/courses/VideoPlayer';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import CodePlayground from '../components/courses/CodePlayground';
import LessonDiscussions from '../components/courses/LessonDiscussions';
import CourseAnnouncements from '../components/courses/CourseAnnouncements';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  Award,
  Download,
  FileText,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  BookOpen,
  Check,
  X,
  RotateCcw,
  Code2,
  Megaphone,
} from 'lucide-react';

const LearningRoom = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, quiz, resources, notes
  const [notes, setNotes] = useState('');

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        setLoading(true);
        const [courseRes, progressRes, quizRes] = await Promise.all([
          apiClient.get(`/courses/${courseId}`),
          apiClient.get(`/progress/${courseId}`),
          apiClient.get(`/quizzes/course/${courseId}`).catch(() => ({ data: { quizzes: [] } })),
        ]);

        const courseData = courseRes.data.course;
        const progressData = progressRes.data;
        const quizData = quizRes.data.quizzes || [];

        setCourse(courseData);
        setProgress(progressData);
        setQuizzes(quizData);

        // Find initial lesson (either last watched or first lesson of first chapter)
        const allLessons = (courseData.chapters || []).flatMap((ch) => ch.lessons || []);
        let initialLesson = allLessons.find(
          (l) => l._id === progressData.progress?.lastWatchedLesson
        );
        if (!initialLesson && allLessons.length > 0) {
          initialLesson = allLessons[0];
        }

        setCurrentLesson(initialLesson || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId]);

  // Handle switching lesson
  const handleSelectLesson = async (lesson) => {
    setCurrentLesson(lesson);
    setQuizResult(null);
    setSelectedAnswers({});
    try {
      await apiClient.put(`/progress/${courseId}/last-watched`, {
        lessonId: lesson._id,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Lesson Complete
  const handleToggleComplete = async (lessonId) => {
    try {
      const res = await apiClient.post(`/progress/${courseId}/toggle-lesson`, {
        lessonId,
      });
      setProgress(res.data);

      if (res.data.progress?.isCourseCompleted) {
        // Trigger confetti celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      alert(err.message || 'Failed to update progress');
    }
  };

  // Submit Quiz Answers
  const handleSubmitQuiz = async (quizId) => {
    const activeQuiz = quizzes.find((q) => q._id === quizId);
    if (!activeQuiz) return;

    const answersArray = activeQuiz.questions.map((_, idx) =>
      selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
    );

    try {
      setSubmittingQuiz(true);
      const res = await apiClient.post(`/quizzes/${quizId}/submit`, {
        selectedAnswers: answersArray,
      });
      setQuizResult(res.data);

      if (res.data.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      alert(err.message || 'Quiz submission failed');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Generate & Download PDF Certificate with verification QR Code
  const downloadCertificate = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const certId =
      progress?.progress?.certificateId ||
      'SKILLORBIT-CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Generate Verification URL QR Code
    const verifyUrl = `${window.location.origin}/verify-certificate/${certId}`;
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
      });
    } catch (e) {
      console.error(e);
    }

    // Dark Background
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 297, 210, 'F');

    // Gradient Borders / Accent Frame
    doc.setDrawColor(79, 70, 229); // indigo-600
    doc.setLineWidth(3);
    doc.roundedRect(10, 10, 277, 190, 4, 4, 'S');

    doc.setDrawColor(16, 185, 129); // emerald-500
    doc.setLineWidth(1);
    doc.roundedRect(15, 15, 267, 180, 2, 2, 'S');

    // Header Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text('SKILLORBIT ACADEMY', 148.5, 38, { align: 'center' });

    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('VERIFIED CERTIFICATE OF COMPLETION', 148.5, 48, { align: 'center' });

    // Body text
    doc.setFontSize(14);
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text('This is to proudly certify that', 148.5, 75, { align: 'center' });

    // Student Name
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(56, 189, 248); // sky-400
    doc.text(user?.name || 'Valued Student', 148.5, 92, { align: 'center' });

    // Course Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('has successfully completed the comprehensive masterclass:', 148.5, 108, {
      align: 'center',
    });

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(course?.title || 'Full Stack Masterclass', 148.5, 122, {
      align: 'center',
      maxWidth: 240,
    });

    // Verification ID & Date (Left)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`Certificate ID: ${certId}`, 25, 165);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 25, 172);

    // QR Code Verification (Center)
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', 136, 142, 25, 25);
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Scan to Verify Online', 148.5, 172, { align: 'center' });
    }

    // Instructor Signature (Right)
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('Prof. Aarav Mehta', 240, 165, { align: 'center' });
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Program Director', 240, 172, { align: 'center' });

    doc.save(`SkillOrbit_Certificate_${course?.title?.substring(0, 15)}.pdf`);
  };

  if (loading) return <Loading text="Entering Classroom..." fullScreen />;
  if (!course) return null;

  const isCurrentLessonCompleted = progress?.progress?.completedLessons?.includes(
    currentLesson?._id
  );

  const completedCount = progress?.progress?.completedLessons?.length || 0;
  const totalLessons = progress?.totalLessons || 1;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const allLessons = (course?.chapters || []).flatMap((ch) => ch.lessons || []);
  const currentIdx = allLessons.findIndex((l) => l._id === currentLesson?._id);
  const nextLesson =
    currentIdx >= 0 && currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  const currentChapter = (course?.chapters || []).find((ch) =>
    (ch.lessons || []).some((l) => l._id === currentLesson?._id)
  );

  // Prioritize Lesson-specific Quiz, then Chapter-level Quiz
  const currentQuiz =
    quizzes.find((q) => q.lessonId === currentLesson?._id) ||
    quizzes.find((q) => q.chapterId === currentChapter?._id && !q.lessonId) ||
    null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-left">
      {/* 1. TOP LMS NAVIGATION HEADER */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              {course.category}
            </span>
            <h2 className="text-sm font-bold text-white truncate max-w-sm sm:max-w-md md:max-w-xl">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Progress & Certificate */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <span>{progressPercent}% Completed</span>
              <span className="text-slate-500">({completedCount}/{totalLessons})</span>
            </div>
            <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {progressPercent === 100 ? (
            <Button
              variant="emerald"
              size="sm"
              onClick={downloadCertificate}
              className="shadow-emerald-500/30 animate-bounce"
            >
              <Award className="w-4 h-4 mr-1.5" />
              Download Certificate
            </Button>
          ) : (
            <span className="text-xs text-slate-400 hidden md:flex items-center gap-1">
              <Award className="w-4 h-4 text-slate-600" />
              Cert at 100%
            </span>
          )}
        </div>
      </header>

      {/* 2. MAIN LMS SPLIT LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Video Player, Quiz & Lesson Details */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {currentLesson ? (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Custom Video Player with Autoplay next and shortcuts */}
              <VideoPlayer
                key={currentLesson._id}
                src={currentLesson.videoUrl}
                title={currentLesson.title}
                nextLesson={nextLesson}
                onPlayNext={() => {
                  if (nextLesson) handleSelectLesson(nextLesson);
                }}
                onEnded={() => {
                  if (!isCurrentLessonCompleted) {
                    handleToggleComplete(currentLesson._id);
                  }
                }}
                autoPlay
              />

              {/* Lesson Action Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <Badge variant="indigo" className="mb-1.5">
                    Lesson {currentLesson.position || 1}
                  </Badge>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {currentLesson.title}
                  </h1>
                </div>

                <Button
                  variant={isCurrentLessonCompleted ? 'emerald' : 'primary'}
                  size="md"
                  onClick={() => handleToggleComplete(currentLesson._id)}
                  className="flex-shrink-0"
                >
                  {isCurrentLessonCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </div>

              {/* Tabs: Overview, Quiz MCQ, Playground, Q&A, Announcements, Resources, Notes */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex-shrink-0 ${
                      activeTab === 'overview'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Lesson Overview
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      activeTab === 'quiz'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-indigo-400 hover:text-indigo-300'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    Lesson MCQ Quiz ({currentQuiz?.questions?.length || 0})
                  </button>

                  <button
                    onClick={() => setActiveTab('playground')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      activeTab === 'playground'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    Code Editor
                  </button>

                  <button
                    onClick={() => setActiveTab('discussions')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      activeTab === 'discussions'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    Q&A Discussion
                  </button>

                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      activeTab === 'announcements'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                    Announcements
                  </button>

                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex-shrink-0 ${
                      activeTab === 'resources'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Resources ({currentLesson.resources?.length || 0})
                  </button>

                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex-shrink-0 ${
                      activeTab === 'notes'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    My Notes
                  </button>
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                    <p>{currentLesson.description || 'In this lesson, we explore the core concepts step-by-step with practical hands-on examples.'}</p>
                  </div>
                )}

                {/* TAB 2: INTERACTIVE MCQ QUIZ ASSESSMENT */}
                {activeTab === 'quiz' && (
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-6">
                    {currentQuiz && currentQuiz.questions?.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div>
                            <Badge variant="indigo" className="mb-1">Assessment Test</Badge>
                            <h3 className="text-base font-bold text-white">
                              {currentQuiz?.title || 'Chapter Assessment & Concept Check'}
                            </h3>
                          </div>
                          <span className="text-xs text-slate-400">
                            Passing Score: {currentQuiz?.passingScore || 70}%
                          </span>
                        </div>

                        {/* Quiz Questions List */}
                        <div className="space-y-6">
                          {currentQuiz.questions.map((q, qIndex) => {
                            const isReviewing = !!quizResult;
                            const reviewItem = quizResult?.review?.[qIndex];

                            return (
                              <div
                                key={qIndex}
                                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                                    {qIndex + 1}. {q.question}
                                  </h4>
                                  {isReviewing && (
                                    <span>
                                      {reviewItem?.isCorrect ? (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                          <Check className="w-3.5 h-3.5" /> Correct
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                                          <X className="w-3.5 h-3.5" /> Incorrect
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>

                                {/* Options Radio List */}
                                <div className="space-y-2">
                                  {q.options.map((opt, optIndex) => {
                                    const isSelected = selectedAnswers[qIndex] === optIndex;
                                    const isCorrectAnswer = isReviewing && q.correctAnswerIndex === optIndex;

                                    return (
                                      <label
                                        key={optIndex}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                          isCorrectAnswer
                                            ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200'
                                            : isSelected
                                            ? 'border-indigo-500 bg-indigo-950/40 text-white font-medium'
                                            : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                                        }`}
                                      >
                                        <input
                                          type="radio"
                                          name={`question_${qIndex}`}
                                          checked={isSelected}
                                          disabled={isReviewing}
                                          onChange={() =>
                                            setSelectedAnswers((prev) => ({
                                              ...prev,
                                              [qIndex]: optIndex,
                                            }))
                                          }
                                          className="text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                                        />
                                        <span>{opt}</span>
                                      </label>
                                    );
                                  })}
                                </div>

                                {/* Explanation if reviewed */}
                                {isReviewing && q.explanation && (
                                  <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/60 mt-2">
                                    💡 <strong className="text-slate-300">Explanation:</strong> {q.explanation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Quiz Result Summary or Submit Button */}
                        {quizResult ? (
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                              <p className="text-xs text-slate-400">Your Score:</p>
                              <h4
                                className={`text-2xl font-extrabold ${
                                  quizResult.passed ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {quizResult.scorePercent}%{' '}
                                <span className="text-xs font-semibold">
                                  ({quizResult.correctCount}/{quizResult.totalQuestions} Correct)
                                </span>
                              </h4>
                              <p className="text-xs text-slate-300 mt-0.5">
                                {quizResult.passed
                                  ? '🎉 Excellent work! You passed the chapter assessment.'
                                  : 'Keep reviewing the chapter lectures and retry the assessment.'}
                              </p>
                            </div>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setQuizResult(null);
                                setSelectedAnswers({});
                              }}
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retry Quiz
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end pt-2">
                            <Button
                              variant="emerald"
                              size="md"
                              loading={submittingQuiz}
                              onClick={() => handleSubmitQuiz(currentQuiz?._id)}
                            >
                              Submit Quiz Answers
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-10 space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                          <HelpCircle className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-white">No MCQ Quiz for this Lesson</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          The instructor has not added practice MCQs for this lesson yet. Practice questions can be configured per-lesson from the Teacher Curriculum Portal.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: CODE PLAYGROUND */}
                {activeTab === 'playground' && <CodePlayground />}

                {/* TAB 4: LESSON DISCUSSIONS & Q&A */}
                {activeTab === 'discussions' && (
                  <LessonDiscussions courseId={courseId} lessonId={currentLesson?._id} />
                )}

                {/* TAB 5: ANNOUNCEMENTS */}
                {activeTab === 'announcements' && (
                  <CourseAnnouncements courseId={courseId} isInstructor={course?.instructor?._id === user?._id} />
                )}

                {/* TAB 6: RESOURCES */}
                {activeTab === 'resources' && (
                  <div className="space-y-2">
                    {currentLesson.resources?.length > 0 ? (
                      currentLesson.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 hover:border-indigo-500/50 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            {res.title}
                          </span>
                          <Download className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No external files attached for this lesson.</p>
                    )}
                  </div>
                )}

                {/* TAB 7: NOTES */}
                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <textarea
                      rows="4"
                      placeholder="Type your personal learning notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-900 text-xs text-slate-200 rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-[11px] text-slate-500">Notes are saved locally in your active session.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p>No lessons available yet in this course.</p>
            </div>
          )}
        </div>

        {/* Right Side: Chapter & Lesson Syllabus Checklist Sidebar */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/60 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Course Curriculum
            </h3>
            <span className="text-[11px] text-slate-400">
              {completedCount} / {totalLessons} Done
            </span>
          </div>

          <div className="space-y-3">
            {(course.chapters || []).map((chapter, chIdx) => (
              <div
                key={chapter._id || chIdx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden"
              >
                <div className="p-3 bg-slate-900/80 font-semibold text-xs text-slate-200 flex items-center justify-between">
                  <span>{chapter.title}</span>
                  <span className="text-[10px] text-slate-500">{chapter.lessons?.length || 0} Lessons</span>
                </div>

                <div className="divide-y divide-slate-800/60">
                  {(chapter.lessons || []).map((lesson) => {
                    const isSelected = currentLesson?._id === lesson._id;
                    const isDone = progress?.progress?.completedLessons?.includes(lesson._id);

                    return (
                      <div
                        key={lesson._id}
                        onClick={() => handleSelectLesson(lesson)}
                        className={`flex items-center justify-between p-3 text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-950/80 text-white font-semibold border-l-4 border-indigo-500'
                            : 'hover:bg-slate-900/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 line-clamp-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleComplete(lesson._id);
                            }}
                            className="text-slate-400 hover:text-emerald-400 transition-colors"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </button>
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <span className="text-[10px] text-slate-500 flex-shrink-0 ml-2">
                          {Math.floor((lesson.duration || 300) / 60)}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningRoom;
