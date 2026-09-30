import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BookOpen,
  Users,
  IndianRupee,
  Star,
  PlusCircle,
  Edit,
  Layers,
  Trash2,
  ExternalLink,
  Tag,
  TrendingUp,
  Plus,
  Calendar,
  Check,
} from 'lucide-react';
import getMediaUrl from '../../utils/mediaUrl';

const TeacherDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Coupon Creation Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(20);
  const [maxUses, setMaxUses] = useState(100);
  const [targetCourseId, setTargetCourseId] = useState('');
  const [creatingCoupon, setCreatingCoupon] = useState(false);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, couponsRes] = await Promise.all([
        apiClient.get('/stats/teacher'),
        apiClient.get('/courses/teacher/my-courses'),
        apiClient.get('/coupons').catch(() => ({ data: { coupons: [] } })),
      ]);
      setStats(statsRes.data.stats);
      setCourses(coursesRes.data.courses || []);
      setCoupons(couponsRes.data.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course and all its lessons?')) return;
    try {
      await apiClient.delete(`/courses/${courseId}`);
      fetchTeacherData();
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    try {
      setCreatingCoupon(true);
      const res = await apiClient.post('/coupons', {
        code: newCode.trim().toUpperCase(),
        discountPercentage: Number(discountPercent),
        maxUses: Number(maxUses),
        courseId: targetCourseId || null,
      });
      setCoupons([res.data.coupon, ...coupons]);
      setNewCode('');
      setDiscountPercent(20);
      setTargetCourseId('');
      setCouponModalOpen(false);
      fetchTeacherData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setCreatingCoupon(false);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      await apiClient.delete(`/coupons/${couponId}`);
      setCoupons(coupons.filter((c) => c._id !== couponId));
    } catch (err) {
      alert(err.message || 'Failed to delete coupon');
    }
  };

  // Mock Trend Data for Charts based on earnings/courses
  const revenueChartData = [
    { month: 'Apr', revenue: Math.round((stats?.totalEarnings || 15000) * 0.2), students: 12 },
    { month: 'May', revenue: Math.round((stats?.totalEarnings || 15000) * 0.35), students: 28 },
    { month: 'Jun', revenue: Math.round((stats?.totalEarnings || 15000) * 0.5), students: 45 },
    { month: 'Jul', revenue: Math.round((stats?.totalEarnings || 15000) * 0.68), students: 60 },
    { month: 'Aug', revenue: Math.round((stats?.totalEarnings || 15000) * 0.82), students: 85 },
    { month: 'Sep', revenue: stats?.totalEarnings || 15000, students: stats?.totalStudents || 110 },
  ];

  if (loading) return <Loading text="Loading Teacher Portal..." fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="indigo" className="mb-1.5">Instructor Portal</Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Teacher Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage courses, student curriculum, and live revenue analytics.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="md" onClick={() => setCouponModalOpen(true)}>
            <Tag className="w-4 h-4 mr-1.5 text-indigo-500" />
            + New Promo Code
          </Button>

          <Link to="/teacher/create-course">
            <Button variant="emerald" size="md">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats?.totalCourses || 0}</h3>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Students</span>
            <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {(stats?.totalStudents || 0).toLocaleString()}
          </h3>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Revenue</span>
            <IndianRupee className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            ₹{(stats?.totalEarnings || 0).toLocaleString()}
          </h3>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.averageRating || 5.0} / 5.0
          </h3>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Area Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">Revenue Analytics</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Earnings Growth</h3>
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
              <TrendingUp className="w-3.5 h-3.5" /> +24% Growth
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Enrollment Bar Chart */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Student Engagement</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enrollment Velocity</h3>
            </div>
            <span className="text-xs text-slate-400">Total: {stats?.totalStudents || 0} Students</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  formatter={(val) => [`${val} Students`, 'New Enrollees']}
                />
                <Bar dataKey="students" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Promo Code & Coupons Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" />
            Promo Codes & Discounts ({coupons.length})
          </h2>
          <Button variant="secondary" size="sm" onClick={() => setCouponModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Coupon
          </Button>
        </div>

        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {coupons.map((cp) => (
              <div
                key={cp._id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-2 flex flex-col justify-between shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-extrabold text-xs border border-indigo-200 dark:border-indigo-800">
                    {cp.code}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    {cp.discountPercentage}% OFF
                  </span>
                </div>

                <div className="pt-1">
                  {cp.courseId ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium border border-indigo-500/20 truncate max-w-full" title={cp.courseId.title}>
                      <BookOpen className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">{cp.courseId.title || 'Specific Course'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-500/20">
                      ✨ All Courses
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 pt-1">
                  <p>Used: {cp.usedCount || 0} / {cp.maxUses || 100} times</p>
                  <p className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Expires: {new Date(cp.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDeleteCoupon(cp._id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-center text-xs text-slate-500">
            No active coupon codes created yet. Create a promo code (e.g. WELCOME50) to boost course sales!
          </div>
        )}
      </div>

      {/* Courses Table / Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Published Courses</h2>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/60 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={
                        getMediaUrl(course.thumbnail) ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
                      }
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="indigo" className="bg-slate-950/80 backdrop-blur-md shadow-sm border border-slate-700/50">
                        {course.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>{(course.enrollmentCount || 0).toLocaleString()} Students</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {course.price === 0 ? 'FREE' : `₹${course.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 grid grid-cols-2 gap-3 mt-auto">
                  <Link
                    to={`/teacher/curriculum/${course._id}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-200 dark:border-indigo-500/30 transition-all shadow-sm active:scale-95"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Curriculum
                  </Link>

                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-200 dark:border-rose-500/20 transition-all shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No courses created yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Get started by creating your first tech course and uploading your curriculum.
            </p>
            <Link to="/teacher/create-course">
              <Button variant="emerald" size="sm">
                Create First Course
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      <Modal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        title="Create New Discount Coupon"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-left">
          <Input
            label="Coupon Code *"
            placeholder="e.g. DIWALI50 or MERN30"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Applicable Course *
            </label>
            <select
              value={targetCourseId}
              onChange={(e) => setTargetCourseId(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="">✨ All My Courses (Universal Discount)</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  🎯 {c.title} (₹{c.price === 0 ? 'FREE' : c.price})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Discount Percentage (%) *"
              type="number"
              min={1}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              required
            />
            <Input
              label="Max Usage Limit"
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setCouponModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="emerald" size="sm" loading={creatingCoupon}>
              Create Coupon
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherDashboard;
