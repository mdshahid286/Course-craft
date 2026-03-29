import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, User, ArrowRight, Quote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
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
    
    if (mode === 'signup' && !name.trim()) {
      return setError('Please enter your name.');
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Please enable Email/Password authentication in your Firebase Console -> Authentication -> Sign-in method.');
      } else {
        setError(err.message || 'Failed to authenticate.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError('Failed to sign in with Google.');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans selection:bg-brand-blue selection:text-white text-slate-900">
      
      {/* Left side: Premium Marketing Panel */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-blue/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer w-fit">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(22,129,208,0.3)]">
              <Car size={20} className="text-white" />
            </div>
            <span className="text-xl font-display font-black tracking-tight text-white group-hover:text-brand-blue transition-colors">
              CourseCraft
            </span>
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 my-auto"
        >
          <Quote className="text-blue-400/40 w-12 h-12 mb-6" />
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6 leading-[1.15]">
            Generate<br/>world-class courses<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">in seconds.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Join thousands of educators and learners building interactive curriculum with the power of generative AI and computational visualizations.
          </p>
          
          <div className="mt-12 flex items-center gap-4">
             <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex justify-center items-center text-xs">AI</div>
                <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900 flex justify-center items-center text-xs">ML</div>
                <div className="w-10 h-10 rounded-full bg-blue-900 border-2 border-slate-900 flex justify-center items-center text-xs">XR</div>
             </div>
             <div className="text-sm text-slate-400 font-medium">Over 500k+ courses generated.</div>
          </div>
        </motion.div>
        
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © {new Date().getFullYear()} CourseCraft AI.
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-20 relative bg-white">
        
        <div className="absolute top-8 left-6 md:hidden">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
             <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center"><Car size={16} className="text-white"/></div>
             <span className="font-bold text-slate-900">CourseCraft</span>
          </button>
        </div>

        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-500 font-medium text-[15px]">
              {mode === 'login' ? 'Enter your details to access your workspace.' : 'Start generating interactive courses today.'}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 mb-6 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex gap-3 items-start">
               <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
               <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none font-medium shadow-sm" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none font-medium shadow-sm" 
                  placeholder="name@company.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                 <label className="text-sm font-bold text-slate-700">Password</label>
                 {mode === 'login' && <a href="#" className="text-sm font-semibold text-brand-blue hover:text-blue-700 transition-colors">Forgot password?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none font-medium shadow-sm" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 mb-8 relative flex items-center">
             <div className="flex-grow border-t border-slate-200"></div>
             <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-wider">or sign in with</span>
             <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button 
             onClick={handleGoogleSignIn}
             disabled={loading}
             className="w-full flex justify-center items-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-sm disabled:opacity-70"
          >
             <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
             Google
          </button>

          <p className="mt-8 text-center text-[15px] font-medium text-slate-600">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={toggleMode} 
              className="font-bold text-brand-blue hover:text-blue-700 transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
