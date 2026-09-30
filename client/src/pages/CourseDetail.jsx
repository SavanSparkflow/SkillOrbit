import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import CurriculumTree from '../components/courses/CurriculumTree';
import RatingStars from '../components/common/RatingStars';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import VideoPlayer from '../components/courses/VideoPlayer';
import {
  CheckCircle,
  PlayCircle,
  Clock,
  Users,
  Globe,
  Award,
  BookOpen,
  ShoppingCart,
  Star,
  Share2,
  Lock,
} from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const { addToCart, items } = useCartStore();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  
  // New review form
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const [courseRes, reviewsRes] = await Promise.all([
          apiClient.get(`/courses/${id}`),
          apiClient.get(`/courses/${id}/reviews`),
        ]);
        setCourse(courseRes.data.course);
        setReviews(reviewsRes.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  if (loading) return <Loading text="Loading course details..." fullScreen />;
  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Course Not Found</h2>
        <Link to="/courses">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses?.some(
    (c) => (c._id || c).toString() === course._id.toString()
  );
  const isInCart = items.some((item) => item._id === course._id);

  // Direct Enroll (For Free or Instant)
  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (course.price > 0) {
      addToCart(course);
      navigate('/checkout');
      return;
    }

    try {
      setEnrolling(true);
      await apiClient.post(`/courses/${course._id}/enroll`);
      await fetchUser();
      navigate(`/learn/${course._id}`);
    } catch (err) {
      alert(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    try {
      setSubmittingReview(true);
      const res = await apiClient.post(`/courses/${course._id}/reviews`, {
        rating: ratingInput,
        comment: commentInput,
      });
      setReviews([res.data.review, ...reviews.filter(r => r._id !== res.data.review._id)]);
      setCommentInput('');
    } catch (err) {
      alert(err.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const totalLessons = (course.chapters || []).reduce(
    (acc, ch) => acc + (ch.lessons?.length || 0),
    0
  );

  return (
    <div className="space-y-12 pb-24 text-left">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-100/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 pt-10 pb-12 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Course Intro */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="indigo">{course.category}</Badge>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm">
                  {course.level}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {course.language}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.subtitle || course.description}
              </p>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
                <RatingStars
                  rating={course.averageRating}
                  totalReviews={course.totalReviews}
                  size="md"
                />
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  {(course.enrollmentCount || 0).toLocaleString()} Enrolled Students
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {course.chapters?.length || 0} Modules • {totalLessons} Lessons
                </span>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-200 dark:border-slate-800/60">
                <img
                  src={course.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={course.instructor?.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Created & Instructed by</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {course.instructor?.name || 'SkillOrbit Master Instructor'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sticky Enrollment Card */}
            <div className="lg:col-span-4">
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 shadow-2xl space-y-6 sticky top-24">
                {/* Course Video Preview Thumbnail */}
                <div
                  onClick={() => {
                    const firstPreview = course.chapters
                      ?.flatMap((ch) => ch.lessons)
                      ?.find((l) => l?.isFreePreview);
                    if (firstPreview) setPreviewLesson(firstPreview);
                  }}
                  className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 cursor-pointer group border border-slate-800 shadow-sm"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 text-white">
                    <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold">Preview Course Lessons</span>
                  </div>
                </div>

                {/* Price block */}
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {course.price === 0 ? 'FREE' : `₹${course.price.toLocaleString()}`}
                    </span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {course.originalPrice > course.price && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Save {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {user?.role === 'teacher' || user?.role === 'admin' ? (
                    <div className="space-y-2">
                      {course.instructor?._id === user?._id || user?.role === 'admin' ? (
                        <Link to={`/teacher/curriculum/${course._id}`} className="block">
                          <Button variant="primary" size="lg" className="w-full">
                            Manage Course Curriculum
                          </Button>
                        </Link>
                      ) : null}
                      <Link to={`/learn/${course._id}`} className="block">
                        <Button variant="secondary" size="md" className="w-full">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          View in Learning Room
                        </Button>
                      </Link>
                    </div>
                  ) : isEnrolled ? (
                    <Link to={`/learn/${course._id}`} className="block">
                      <Button variant="emerald" size="lg" className="w-full shadow-emerald-500/25">
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Go to Learning Room
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        size="lg"
                        loading={enrolling}
                        onClick={handleEnroll}
                        className="w-full shadow-indigo-500/25"
                      >
                        {course.price === 0 ? 'Enroll Now (Free)' : 'Buy Now / Enroll'}
                      </Button>

                      {course.price > 0 && (
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={() => {
                            if (!user) {
                              navigate('/login');
                              return;
                            }
                            addToCart(course);
                          }}
                          disabled={isInCart}
                          className="w-full"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {isInCart ? 'Already in Cart' : 'Add to Cart'}
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Benefits checklist */}
                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">This course includes:</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Full HD on-demand video streaming</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Full lifetime access to updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Downloadable code snippets & cheatsheets</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Certificate of Completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT: OUTCOMES, SYLLABUS, REVIEWS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Learning Outcomes */}
          {course.learningOutcomes?.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">What You'll Master</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Course Overview</h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {course.description}
            </div>
          </div>

          {/* Course Curriculum Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Course Curriculum</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {course.chapters?.length || 0} sections • {totalLessons} lessons
              </span>
            </div>

            <CurriculumTree
              chapters={course.chapters || []}
              isEnrolled={isEnrolled}
              onSelectLesson={(lesson) => setPreviewLesson(lesson)}
            />
          </div>

          {/* Instructor Bio */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">About the Instructor</h3>
            <div className="flex items-start gap-4">
              <img
                src={course.instructor?.avatar}
                alt={course.instructor?.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-base text-slate-900 dark:text-white">{course.instructor?.name}</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{course.instructor?.headline || 'Senior Software Engineer'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                  {course.instructor?.bio || 'Experienced engineering lead and creator committed to empowering next-generation developers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Student Reviews & Form */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Student Feedback & Reviews</h3>
              <RatingStars rating={course.averageRating} totalReviews={course.totalReviews} />
            </div>

            {/* If enrolled, show review submission form */}
            {isEnrolled && (
              <form
                onSubmit={handleReviewSubmit}
                className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-3 shadow-sm"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Leave Your Rating & Review</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= ratingInput
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows="3"
                  placeholder="Write your honest feedback about this course..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
                <Button type="submit" size="sm" loading={submittingReview}>
                  Submit Review
                </Button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                          alt={rev.user?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.user?.name}</span>
                      </div>
                      <RatingStars rating={rev.rating} showScore={false} />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Free Lesson Video Preview Modal */}
      <Modal
        isOpen={!!previewLesson}
        onClose={() => setPreviewLesson(null)}
        title={previewLesson ? `Preview: ${previewLesson.title}` : 'Video Preview'}
        maxWidth="max-w-4xl"
      >
        {previewLesson && (
          <div className="space-y-4">
            <VideoPlayer
              src={previewLesson.videoUrl}
              title={previewLesson.title}
              autoPlay
            />
            <p className="text-xs text-slate-600 dark:text-slate-300">{previewLesson.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CourseDetail;
