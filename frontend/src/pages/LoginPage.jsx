import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-brand-peach selection:text-brand-blue">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-brand-darkBlue rounded-4xl flex items-center justify-center shadow-xl shadow-brand-darkBlue/25 mb-5 relative overflow-hidden">
            <div className="absolute top-0 w-full h-1/2 bg-white/10"></div>
            <Car size={36} className="text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-brand-text text-center">
            <span className="text-brand-blue">Playroom</span>Builder
          </h1>
          <p className="text-brand-muted font-medium mt-1 text-center">Sign in to your learning space</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-5xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10 border border-border/50">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Email</label>
              <div className="flex items-center bg-[#F7F4EE] rounded-2xl px-5 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-blue/30 transition-all">
                <Mail size={17} className="text-brand-muted flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent border-none outline-none text-brand-text font-medium placeholder-brand-muted/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-brand-muted tracking-widest uppercase mb-2">Password</label>
              <div className="flex items-center bg-[#F7F4EE] rounded-2xl px-5 py-4 gap-3 focus-within:ring-2 focus-within:ring-brand-blue/30 transition-all">
                <Lock size={17} className="text-brand-muted flex-shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent border-none outline-none text-brand-text font-medium placeholder-brand-muted/50"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <span className="text-xs font-bold text-brand-blue cursor-pointer hover:underline">Forgot password?</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-darkBlue disabled:opacity-60 text-white font-bold py-4 px-6 rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.35)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={17} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs font-bold text-brand-muted">or continue with</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-3 bg-[#F7F4EE] hover:bg-white border border-border text-brand-text font-bold py-4 px-6 rounded-full transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-brand-muted text-sm mt-6 font-medium">
          Don't have an account? <Link to="/" className="text-brand-blue font-bold hover:underline">Get started free</Link>
        </p>
      </div>
    </div>
  );
}
