import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, Home, BookOpen, Users, BarChart2, Settings, 
  Bell, User, Code, Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// Inline Sparkles Icon to guarantee it works
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden selection:bg-brand-blue selection:text-white font-sans text-slate-900">
      
      {/* Sidebar - Clean, Bright, Professional Modern UI */}
      <aside className="w-[280px] flex-shrink-0 bg-white flex flex-col pt-8 pb-6 px-5 z-20 hidden md:flex border-r border-slate-200 relative">

        {/* Logo Area */}
        <div className="flex flex-col mb-10 pl-2">
          <Link to="/dashboard" className="flex items-center gap-3 group w-fit">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-sm relative overflow-hidden transition-all group-hover:scale-105 group-hover:shadow-md">
              <Car size={22} className="text-white relative z-10" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-slate-900">
              CourseCraft
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 relative z-10">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 pl-2">Overview</div>
          
          {[{ path: '/dashboard', icon: Home, label: 'Dashboard' },
            { path: '/courses', icon: BookOpen, label: 'My Courses' },
            { path: '/community', icon: Users, label: 'Community' },
            { path: '/analytics', icon: BarChart2, label: 'Analytics' },
          ].map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/dashboard');
            const NavIcon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group ${
                  isActive 
                    ? 'text-brand-blue bg-blue-50/80 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <NavIcon size={18} className={isActive ? "text-brand-blue" : "text-slate-400 group-hover:text-slate-600 transition-colors"} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[15px]">{item.label}</span>
              </Link>
            );
          })}

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4 pl-2">Account</div>
          <Link to="/settings" className={`relative flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group ${pathname.startsWith('/settings') ? 'text-brand-blue bg-blue-50/80 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
             <Settings size={18} className={pathname.startsWith('/settings') ? "text-brand-blue" : "text-slate-400"} strokeWidth={pathname.startsWith('/settings') ? 2.5 : 2} />
             <span className="text-[15px]">Settings</span>
          </Link>

        </nav>

        {/* Create New Button */}
        <div className="mt-auto relative z-10 pt-4">
          <Link to="/build" className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 font-semibold text-sm">
            <SparklesIcon /> Create New
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative min-h-0 flex flex-col bg-[#FAFAFA]">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-xl px-8 py-5 flex items-center justify-between border-b border-slate-200/60">
          <div className="flex md:hidden items-center text-slate-900">
            <Link to="/dashboard"><div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center"><Car size={20} className="text-white"/></div></Link>
          </div>
          
          <div className="hidden md:flex font-display font-medium text-lg text-slate-400">
             <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm shadow-sm">
                <Layers size={14} className="text-brand-blue"/> <span className="text-slate-700 font-semibold">Workspace</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
              <Bell size={18} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
            </button>
            <Link to="/settings" className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center cursor-pointer border border-indigo-200 hover:scale-105 transition-transform text-indigo-700">
              {currentUser?.email ? (
                <span className="font-bold text-sm">{currentUser.email.charAt(0).toUpperCase()}</span>
              ) : (
                <User size={18} />
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 relative z-10 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
