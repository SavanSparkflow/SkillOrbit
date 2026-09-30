import React from 'react';
import Badge from '../../components/common/Badge';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <Badge variant="indigo">Legal & Data Protection</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
          <p>
            When you create an account on SkillOrbit LMS, enroll in courses, or make a payment, we collect personal information including your name, email address, password hash, and payment records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How We Use Your Information</h2>
          <p>
            We use your data to provide access to purchased video courses, generate verified completion certificates, track lecture progress, and provide customer support. We never sell your personal information to third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Payment Security</h2>
          <p>
            All payment transactions are handled through compliant 256-Bit SSL payment gateways (Razorpay / Stripe). SkillOrbit does not store full credit/debit card details on our local database servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">4. Cookies & Local Storage</h2>
          <p>
            We use HTTP-only secure JWT cookies and browser local storage to keep you safely logged in and maintain your active cart state.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
