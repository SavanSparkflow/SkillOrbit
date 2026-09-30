import React from 'react';
import Badge from '../../components/common/Badge';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <Badge variant="indigo">Terms & Conditions</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using SkillOrbit, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Course License & Intellectual Property</h2>
          <p>
            When you enroll in a course on SkillOrbit, you receive a personal, non-exclusive, non-transferable license to view and learn from the video materials for educational purposes. Recording, downloading for redistribution, or sharing account access is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. User Conduct</h2>
          <p>
            You agree to interact respectfully in all course comment sections and discussions. Spamming, abusive language, or piracy attempts will result in instant account termination without refund.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
