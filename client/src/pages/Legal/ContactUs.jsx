import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <Badge variant="indigo">Support & Inquiries</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Contact Our Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Have questions about our courses, billing, or enterprise team training? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Contact Information</h3>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Email Us</p>
                  <p className="text-slate-500 dark:text-slate-400">support@skillorbit.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Call / WhatsApp Support</p>
                  <p className="text-slate-500 dark:text-slate-400">+91 98765 43210 (Mon - Sat, 9am - 7pm IST)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Headquarters</p>
                  <p className="text-slate-500 dark:text-slate-400">SkillOrbit EdTech Hub, Science City Road, Ahmedabad, Gujarat, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 shadow-sm">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Thank you for reaching out. Our support engineering team will reply to {email} within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Full Name"
                  placeholder="Savan Kotadiya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    How can we help you?
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Tell us more about your query..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 rounded-xl p-3 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <Button type="submit" variant="emerald" size="md" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
