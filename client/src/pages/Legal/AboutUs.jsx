import React from 'react';
import Badge from '../../components/common/Badge';
import { Award, Users, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <Badge variant="indigo">Our Mission & Story</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About SkillOrbit LMS
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Democratizing high-tier software engineering and product design education across India and the globe.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Empowering 100,000+ Aspiring Engineers</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Founded with a goal to bridge the divide between theoretical computer science and production-grade software development, SkillOrbit offers curated, project-first courses in MERN Stack, AI & Deep Learning, Cloud DevOps, and Figma Design Systems.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Every single lesson is recorded with hands-on source code, real deployment workflows (AWS, Render, Vercel), and verified digital certificates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Project-Based Learning</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Build actual SaaS products, video streaming engines, and AI agents rather than shallow hello-world apps.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Elite Instructors</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Learn directly from Senior Principals, Ex-MNC Architects, and seasoned product designers.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-amber-500 dark:text-amber-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Lifetime Credibility</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Instant digital credentials verifiable with distinct Certificate IDs for LinkedIn and resume showcasing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
