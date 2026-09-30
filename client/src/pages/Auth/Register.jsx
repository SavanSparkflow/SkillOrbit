import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Logo from '../../components/common/Logo';
import { Mail, Lock, User, Sparkles, GraduationCap } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // student or teacher
  const navigate = useNavigate();

  const { register, loading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password, role);
    if (res.success) {
      if (role === 'teacher') navigate('/teacher');
      else navigate('/dashboard');
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
            Create Free Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join thousands of developers leveling up their tech careers
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'student'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              I'm a Student
            </button>
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'teacher'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              I'm an Instructor
            </button>
          </div>

          <Input
            label="Full Name"
            id="name"
            placeholder="Savan Kotadiya"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            label="Password (min 6 characters)"
            id="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Button
            type="submit"
            variant="emerald"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Create Account & Get Started
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
