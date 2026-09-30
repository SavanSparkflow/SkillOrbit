import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../common/RatingStars';
import Badge from '../common/Badge';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { Users, Clock, ShoppingCart, PlayCircle, CheckCircle2 } from 'lucide-react';

const CourseCard = ({ course }) => {
  const { addToCart, items } = useCartStore();
  const { user } = useAuthStore();

  const isEnrolled = user?.enrolledCourses?.some(
    (c) => (c._id || c).toString() === course._id.toString()
  );

  const isInCart = items.some((item) => item._id === course._id);

  const formatPrice = (price) => {
    if (price === 0) return 'FREE';
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/90 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 hover:border-indigo-500/40 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div>
        {/* Course Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
          <img
            src={
              course.thumbnail ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
            }
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant="indigo" className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-md shadow-sm">
              {course.category}
            </Badge>
            {course.price === 0 && (
              <Badge variant="emerald" className="bg-emerald-50 dark:bg-emerald-950/80 shadow-sm">
                100% Free
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/90 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md shadow-sm">
              {course.level}
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 text-left">
          <div className="flex items-center gap-2 mb-2">
            <RatingStars
              rating={course.averageRating || 5.0}
              totalReviews={course.totalReviews || 0}
            />
          </div>

          <Link to={`/courses/${course._id}`}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 line-clamp-2 transition-colors mb-2">
              {course.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {course.subtitle || course.description}
          </p>

          {/* Instructor line */}
          <div className="flex items-center gap-2 mb-4">
            <img
              src={
                course.instructor?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
              }
              alt={course.instructor?.name || 'Instructor'}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
              {course.instructor?.name || 'SkillOrbit Expert'}
            </span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              {(course.enrollmentCount || 0).toLocaleString()} students
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              {course.chapters?.length || 2} Sections
            </span>
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              {formatPrice(course.price)}
            </span>
            {course.originalPrice > course.price && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                ₹{course.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {isEnrolled ? (
            <Link
              to={`/learn/${course._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Continue
            </Link>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to={`/courses/${course._id}`}
                className="text-xs font-semibold px-3 py-2 rounded-xl bg-indigo-500/10 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 dark:border-indigo-500/30 transition-all"
              >
                Details
              </Link>
              {(!user || user.role === 'student') && (
                <button
                  onClick={() => {
                    if (!user) {
                      window.location.href = '/login';
                      return;
                    }
                    addToCart(course);
                  }}
                  disabled={isInCart}
                  className={`p-2 rounded-xl border transition-all ${
                    isInCart
                      ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/40 shadow-sm'
                  }`}
                  title={isInCart ? 'In Cart' : 'Add to Cart'}
                >
                  {isInCart ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
