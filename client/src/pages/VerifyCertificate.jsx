import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import Loading from '../components/common/Loading';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import QRCode from 'qrcode';
import {
  Award,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/progress/verify-certificate/${certificateId}`);
        setCertData(res.data.certificate);

        // Generate QR code for this URL
        const currentUrl = window.location.href;
        const qr = await QRCode.toDataURL(currentUrl, {
          width: 180,
          margin: 1,
          color: { dark: '#4f46e5', light: '#ffffff' },
        });
        setQrDataUrl(qr);
      } catch (err) {
        setError(err.response?.data?.message || 'Certificate not found or invalid');
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [certificateId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loading text="Verifying Certificate Authenticity..." fullScreen />;

  if (error || !certData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-md w-full text-center space-y-4 rounded-3xl border border-rose-500/30 bg-slate-900/90 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Certificate Not Found</h2>
          <p className="text-xs text-slate-400">
            {error || 'The certificate ID does not match any verified credentials in the SkillOrbit ledger.'}
          </p>
          <Link to="/">
            <Button variant="primary" size="sm">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { student, course, completedAt } = certData;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SkillOrbit
        </Link>
        <Badge variant="emerald" className="px-3 py-1 text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" /> Official Authenticated Credential
        </Badge>
      </div>

      {/* Main Certificate Verification Card */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Verification Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30 flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                SkillOrbit Masterclass Certificate
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">Verified Credential</h1>
              <p className="text-xs text-slate-400">Credential ID: <span className="font-mono text-slate-200">{certificateId}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied' : 'Share Link'}
            </button>
          </div>
        </div>

        {/* Student & Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="text-xs text-slate-400">Awarded To:</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                {student?.name || 'Verified Student'}
              </h2>
              <span className="text-xs text-slate-500">{student?.email}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400">Course Mastered:</span>
              <h3 className="text-lg sm:text-xl font-bold text-indigo-300 mt-0.5">
                {course?.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {course?.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Issue Date
                </span>
                <p className="text-xs font-bold text-white mt-1">
                  {new Date(completedAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <User className="w-3 h-3" /> Lead Instructor
                </span>
                <p className="text-xs font-bold text-white mt-1 truncate">
                  {course?.instructor?.name || 'Prof. Aarav Mehta'}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code & Direct Verification */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-center">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Verification QR"
                className="w-36 h-36 rounded-xl p-2 bg-white shadow-lg"
              />
            )}
            <span className="text-[11px] text-slate-400">Scan QR Code to independently verify on any mobile browser.</span>
          </div>
        </div>

        {/* Security & Ledger Footer */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Digital Signature verified on SkillOrbit Secure Credential Ledger.</span>
          </div>
          <Link
            to={`/courses/${course?._id}`}
            className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            Explore Masterclass <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
