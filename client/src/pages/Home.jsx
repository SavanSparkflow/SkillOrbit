import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import CourseCard from '../components/courses/CourseCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Sparkles,
  ArrowRight,
  Code2,
  BrainCircuit,
  Layout,
  Cloud,
  Shield,
  Award,
  Users,
  Video,
  CheckCircle,
  Star,
  Play,
  Zap,
} from 'lucide-react';

const categories = [
  { name: 'Web Development', icon: Code2, count: '18 Courses', color: 'from-blue-500 to-indigo-600' },
  { name: 'Data Science & AI', icon: BrainCircuit, count: '12 Courses', color: 'from-purple-500 to-pink-600' },
  { name: 'UI/UX Design', icon: Layout, count: '9 Courses', color: 'from-amber-500 to-orange-600' },
  { name: 'Cloud & DevOps', icon: Cloud, count: '10 Courses', color: 'from-emerald-500 to-teal-600' },
  { name: 'Cybersecurity', icon: Shield, count: '7 Courses', color: 'from-rose-500 to-red-600' },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 45,
    totalStudents: 12500,
    totalInstructors: 85,
    satisfactionRate: '99.4%',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, statsRes] = await Promise.all([
          apiClient.get('/courses?limit=6&sort=popular'),
          apiClient.get('/stats/overview'),
        ]);
        setCourses(courseRes.data.courses || []);
        if (statsRes.data?.stats) setStats(statsRes.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        {/* Glowing backdrop spheres */}
        <div className="glow-primary top-10 left-1/4 w-96 h-96"></div>
        <div className="glow-primary top-40 right-10 w-80 h-80 bg-emerald-500/20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold animate-pulse-slow shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Next-Gen MERN & AI Tech Learning Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Master In-Demand Skills. <br />
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 dark:from-indigo-400 dark:via-indigo-200 dark:to-emerald-400 bg-clip-text text-transparent">
                  Build Real Production SaaS.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Step-by-step practical video courses taught by industry veterans. Learn Full Stack MERN, Generative AI, Cloud DevOps, and Figma Design with verified digital certificates and lifetime community support.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/courses">
                  <Button size="lg" variant="primary" className="shadow-indigo-500/30">
                    Browse All Courses
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="secondary">
                    Start Learning for Free
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="student" />
                    <img className="w-7 h-7 rounded-full border border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="student" />
                    <img className="w-7 h-7 rounded-full border border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="student" />
                  </div>
                  <span>Join <strong className="text-slate-900 dark:text-white">12,500+</strong> students</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">4.9 / 5.0</span>
                  <span className="text-slate-500 dark:text-slate-400">(2,400+ Reviews)</span>
                </div>
              </div>
            </div>

            {/* Right Video / Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-indigo-500/40 via-emerald-500/20 to-purple-500/40 shadow-2xl">
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000"
                    alt="LMS Preview"
                    className="w-full h-full object-cover opacity-80"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                        ● LIVE PREVIEW
                      </span>
                      <span className="text-xs text-slate-300 font-medium">Interactive Learning Room</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      Build Fullstack LMS with MERN & HLS Video Stream
                    </h4>
                    <Link to="/courses">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                        <Play className="w-3.5 h-3.5 fill-indigo-400" />
                        Watch Course Demo
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 shadow-sm">
          <div className="text-center p-4 border-r border-slate-200 dark:border-slate-800/80 last:border-0">
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
              {(stats.totalStudents || 12500).toLocaleString()}+
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Enrolled Students</p>
          </div>
          <div className="text-center p-4 border-r border-slate-200 dark:border-slate-800/80 last:border-0">
            <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-1">
              {stats.totalCourses || 45}+
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Master Courses</p>
          </div>
          <div className="text-center p-4 border-r border-slate-200 dark:border-slate-800/80 last:border-0">
            <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">
              {stats.totalInstructors || 85}+
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Expert Mentors</p>
          </div>
          <div className="text-center p-4">
            <h3 className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mb-1">
              {stats.satisfactionRate || '99.4%'}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Satisfaction Score</p>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-left">
          <div>
            <Badge variant="indigo" className="mb-2">Top Categories</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Popular Tracks
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 inline-flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="group glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:border-indigo-500/50 transition-all text-left flex flex-col justify-between"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mb-1">
                    {cat.name}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{cat.count}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. POPULAR COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-left">
          <div>
            <Badge variant="emerald" className="mb-2">Top Rated</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trending & Featured Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 inline-flex items-center gap-1"
          >
            View Full Library <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE SKILLORBIT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 relative overflow-hidden shadow-sm">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="indigo" className="mb-3">Why Us</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Engineered for Real-World Tech Mastery
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              Unlike generic tutorial websites, SkillOrbit gives you hands-on SaaS codebases, interactive checklists, and industry-standard architecture blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Full HD Video & Free Previews</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Stream buffer-free lessons with custom playback speeds, chapter navigation, and downloadable cheat sheets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Verified Digital Certificates</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Earn verifiable PDF certificates upon course completion that you can attach to LinkedIn and your resume.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Lifetime Course Access</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                One-time enrollment unlocks all future curriculum updates and project additions forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS & STUDENT REVIEWS (Social Proof) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <Badge variant="emerald">Student Success Stories</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Loved by 12,500+ Engineers & Designers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Read how SkillOrbit transformed careers with practical project-driven courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 space-y-4 text-left flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "The MERN Stack course is literally a goldmine. The explanation of JWT in cookies, MongoDB modeling, and live streaming gave me the exact confidence to clear my Senior Fullstack interview!"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                alt="Priya Sharma"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Priya Sharma</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Frontend Engineer @ TCS</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 space-y-4 text-left flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "Figma Design Systems શીખવા માટે SkillOrbit સૌથી બેસ્ટ પ્લેટફોર્મ છે. Auto Layout અને Tokens નો ઉપયોગ કરીને મેં મારી આખી એજન્સીની ડિઝાઇન સિસ્ટમ રિવેમ્પ કરી દીધી."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
                alt="Savan Kotadiya"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Savan Kotadiya</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Product Designer @ Freelance</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 space-y-4 text-left flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center text-amber-500 gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                "The verified digital certificate was instantly shareable on LinkedIn. The MCQ quizzes at the end of each module helped validate my knowledge before taking on client projects."
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"
                alt="Ananya Desai"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ananya Desai</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Fullstack Web Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/30 p-8 sm:p-14 text-center shadow-2xl">
          <div className="glow-primary top-0 right-1/4 w-80 h-80"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Accelerate Your Tech Career?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Join thousands of developers leveling up their skills with SkillOrbit today. Sign up in under 60 seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="emerald">
                  Create Free Student Account
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="glassDark">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
