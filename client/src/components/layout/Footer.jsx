import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ShieldCheck,
  Award,
  BookCheck,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <Logo />
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering developers and creators worldwide with industry-vetted tech education, hands-on projects, interactive coding workflows, and verified certifications.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all shadow-sm"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all shadow-sm"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500 transition-all shadow-sm"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Explore Courses
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/courses?category=Web Development" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Web Development (MERN)
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Data Science & AI" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Data Science & GenAI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=UI/UX Design" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  UI/UX Design & Figma
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Cloud & DevOps" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cloud & DevOps Bootcamp
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-emerald-600 dark:text-emerald-400">
                  View All Courses →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Account */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform & Role
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/teacher" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Teach on SkillOrbit
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Create Student Account
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal Policies (Payment Gateway Required) */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Secure Checkout (256-Bit SSL)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <Award className="w-4 h-4 text-amber-500" />
              Verified Digital Certificate
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <BookCheck className="w-4 h-4 text-indigo-500" />
              Lifetime Access Guaranteed
            </span>
          </div>

          <p>© {new Date().getFullYear()} SkillOrbit LMS Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
