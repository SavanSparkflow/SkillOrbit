import React from 'react';
import Badge from '../../components/common/Badge';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-2">
        <Badge variant="indigo">Payment Gateway Policy</Badge>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Refund & Cancellation Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: September 2026</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. 7-Day Money-Back Guarantee</h2>
          <p>
            We want you to be 100% satisfied with your learning experience on SkillOrbit. If you are not satisfied with a purchased course, you may request a full refund within 7 days of purchase, provided you have watched less than 25% of the course content and have not claimed a completion certificate.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How to Request a Refund</h2>
          <p>
            To request a refund, please email our support team at <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">support@skillorbit.com</strong> with your registered email ID, Course Name, and Transaction ID. Refunds are typically processed within 3 to 5 business days back to your original payment method (Bank / UPI / Card).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Cancellation & Account Deletion</h2>
          <p>
            You may close or delete your SkillOrbit account at any time from your account settings. Deleting your account will revoke access to all enrolled courses and associated certificates.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;
