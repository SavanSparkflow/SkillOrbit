import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import {
  BookOpen,
  PlayCircle,
  Award,
  CheckCircle,
  Clock,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const Dashboard = () => {
  const { user, fetchUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnrolled = async () => {
      try {
        setLoading(true);
        await fetchUser();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEnrolled();
  }, [fetchUser]);

  if (loading) return <Loading text="Loading your dashboard..." fullScreen />;

  const courses = user?.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
      {/* 1. WELCOME BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-indigo-950/40 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Welcome back, {user?.name}!
                </h1>
                <Badge variant="emerald" className="capitalize">{user?.role}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {user?.headline || 'Continuous tech learner at SkillOrbit'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/courses">
              <Button variant="primary" size="md">
                Browse New Courses <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enrolled Courses</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Active</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Learning Status</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Digital PDF</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verified Certificates</p>
          </div>
        </div>
      </div>

      {/* 3. ENROLLED COURSES LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Enrolled Courses</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pick up right where you left off</p>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="indigo">{course.category}</Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <img
                        src={course.instructor?.avatar}
                        alt={course.instructor?.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>{course.instructor?.name || 'SkillOrbit Expert'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link to={`/learn/${course._id}`} className="block">
                    <Button variant="emerald" size="sm" className="w-full">
                      <PlayCircle className="w-4 h-4 mr-1.5" />
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">You haven't enrolled in any courses yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Explore our tech catalog and enroll in high quality courses to start learning.
            </p>
            <Link to="/courses">
              <Button variant="primary" size="sm">
                Explore Courses
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
