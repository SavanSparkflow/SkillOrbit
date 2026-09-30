import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { login, loading, error } = useAuthStore();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate(redirect);
    }
  };

  const handleQuickDemo = async (role) => {
    if (role === 'teacher') {
      setEmail('teacher@skillorbit.com');
      setPassword('password123');
      const res = await login('teacher@skillorbit.com', 'password123');
      if (res.success) navigate('/teacher');
    } else {
      setEmail('student@skillorbit.com');
      setPassword('password123');
      const res = await login('student@skillorbit.com', 'password123');
      if (res.success) navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="glow-primary top-10 left-1/3 w-80 h-80"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl relative z-10 space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to SkillOrbit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Continue where you left off in your learning journey
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Quick Demo Logins for Fast Testing */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-center">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">🚀 Quick Demo Logins:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleQuickDemo('student')}
            >
              Demo Student
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickDemo('teacher')}
            >
              Demo Teacher
            </Button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
