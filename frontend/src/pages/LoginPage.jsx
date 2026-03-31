import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, ArrowRight, AlertCircle, Rocket, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURES = [
  'AI-generated course outlines in seconds',
  'Interactive quizzes & progress tracking',
  'Manim-powered math visualizations',
  'Curated YouTube resource integration',
];

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup' && !name.trim()) return setError('Please enter your full name.');
    setLoading(true);
    console.log('LoginPage Debug - Attempting login/signup');
    try {
      if (mode === 'signup') await signup(email, password, name);
      else await login(email, password);
      console.log('LoginPage Debug - Authentication successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.log('LoginPage Debug - Authentication error:', err);
      const map = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Try again.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password sign-in is not enabled.',
      };
      setError(map[err.code] || err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    console.log('LoginPage Debug - Attempting Google sign-in');
    try {
      await loginWithGoogle();
      console.log('LoginPage Debug - Google sign-in successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.log('LoginPage Debug - Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-brand-green flex-col justify-between p-12 relative overflow-hidden">
        {/* Background subtle pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-10 w-48 h-48 bg-brand-green-dark/30 rounded-full blur-2xl" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">CourseCraft</span>
          </div>
        </div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 my-auto"
        >
          <p className="text-brand-green-muted text-sm font-medium mb-6 uppercase tracking-wider">AI-Powered Learning</p>
          <h1 className="text-4xl xl:text-5xl font-display font-bold text-white mb-6 leading-[1.15]">
            Generate world-class courses <span className="text-brand-green-muted">in seconds.</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-md mb-10">
            Join thousands of educators and learners building interactive courses with AI-powered curriculum generation.
          </p>

          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={12} className="text-white" />
                </div>
                <p className="text-white/80 text-sm">{f}</p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#16663A', '#2563EB', '#7C3AED', '#D97706'].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-brand-green flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: c }}
                >
                  {['AI', 'ML', 'XR', 'CS'][i]}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-sm font-medium">500k+ courses generated</p>
          </div>
        </motion.div>

        <div className="relative z-10 text-white/30 text-sm">
          © {new Date().getFullYear()} CourseCraft AI
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-16 relative bg-app-surface">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center">
            <BookOpen size={17} className="text-white" />
          </div>
          <span className="text-lg font-display font-bold text-app-fg">CourseCraft</span>
        </div>

        <div className="w-full max-w-md mx-auto">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-app-fg mb-1.5">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm text-app-muted">
              {mode === 'login'
                ? 'Sign in to access your learning workspace.'
                : 'Start building AI-powered courses today.'}
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-3 p-4 mb-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm"
              >
                <AlertCircle size={17} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-app-surface border border-app-border hover:bg-app-surface2 text-app-fg font-semibold py-3 rounded-xl transition-all shadow-card mb-6 text-sm disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-app-border" />
            <span className="text-xs text-app-muted font-medium">or continue with email</span>
            <div className="flex-1 border-t border-app-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-app-fg mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input pl-10"
                      placeholder="Jane Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-app-fg mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input pl-10"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-app-fg">Password</label>
                {mode === 'login' && (
                  <a href="#" className="text-xs font-medium text-brand-green hover:text-brand-green-dark transition-colors">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brand justify-center py-3 text-sm mt-1 shadow-brand"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-6 text-center text-sm text-app-muted">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setPassword(''); }}
              className="font-semibold text-brand-green hover:text-brand-green-dark transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
