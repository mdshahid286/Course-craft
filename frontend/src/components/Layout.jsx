import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Car, Home, BookOpen, Users, BarChart2, Settings, 
  Bell, User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-brand-peach selection:text-brand-blue">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar flex flex-col pt-8 pb-6 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex border-r border-black/5">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-10">
          <Link to="/">
            <div className="w-16 h-16 bg-brand-darkBlue rounded-[20px] flex items-center justify-center shadow-lg shadow-brand-darkBlue/20 mb-3 relative overflow-hidden transition-transform hover:scale-105">
              <div className="absolute top-0 w-full h-1/2 bg-white/10 rounded-t-[20px]"></div>
              <Car size={28} className="text-white relative z-10" />
            </div>
          </Link>
          <h1 className="text-xl font-display font-bold text-center leading-tight tracking-tight">
            Playroom<br/>
            <span className="text-[10px] tracking-widest text-brand-blue uppercase">COURSE BUILDER</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-2">
          {[{ path: '/', icon: Home, label: 'HOME' },
            { path: '/courses', icon: BookOpen, label: 'COURSES' },
            { path: '/students', icon: Users, label: 'STUDENTS' },
            { path: '/insights', icon: BarChart2, label: 'INSIGHTS' },
            { path: '/settings', icon: Settings, label: 'SETTINGS' }
          ].map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
            const NavIcon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-full font-bold transition-all ${
                  isActive 
                    ? 'bg-white text-brand-blue shadow-sm ring-1 ring-black/5' 
                    : 'text-brand-muted hover:text-brand-text hover:bg-white/50'
                }`}
              >
                <NavIcon size={18} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Create New Button */}
        <div className="px-2 mt-auto">
          <Link to="/build" className="w-full flex justify-center py-4 bg-gradient-to-r from-brand-blue to-cyan-500 hover:to-cyan-400 text-white rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.4)] transition-transform hover:-translate-y-0.5 font-bold text-sm tracking-wider">
            CREATE NEW
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative min-h-0 flex flex-col bg-[#FCF9F2]">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-[#FCF9F2] px-6 md:px-10 py-5 flex items-center justify-between shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex md:hidden items-center text-brand-blue">
            <Link to="/"><Car size={32} /></Link>
          </div>
          <div className="hidden md:flex font-display font-bold text-2xl tracking-tight text-brand-text cursor-pointer">
            <Link to="/"><span className="text-brand-blue">Playroom</span>Builder</Link>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 font-semibold text-brand-muted">
            <Link to="/" className={`transition-colors py-1 border-b-2 ${pathname === '/' ? 'border-brand-darkBlue text-brand-darkBlue' : 'border-transparent hover:text-brand-text'}`}>Home</Link>
            <Link to="/courses" className={`transition-colors py-1 border-b-2 ${pathname.startsWith('/courses') ? 'border-brand-darkBlue text-brand-darkBlue' : 'border-transparent hover:text-brand-text'}`}>Courses</Link>
            <Link to="/insights" className={`transition-colors py-1 border-b-2 ${pathname.startsWith('/insights') ? 'border-brand-darkBlue text-brand-darkBlue' : 'border-transparent hover:text-brand-text'}`}>Insights</Link>
          </nav>
          
          <div className="flex items-center gap-5">
            <button className="text-brand-blue hover:text-brand-darkBlue transition-colors tooltip group relative">
              <Bell size={20} className="fill-brand-blue" />
              <span className="absolute -bottom-10 right-0 bg-brand-text text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Notifications</span>
            </button>
            <Link to="/settings" className="w-9 h-9 rounded-full bg-brand-darkBlue overflow-hidden flex items-center justify-center shadow-sm cursor-pointer border border-black/5 hover:ring-2 hover:ring-brand-blue/50 transition-all">
              {currentUser ? (
                <span className="text-white font-bold text-sm">{currentUser.email.charAt(0).toUpperCase()}</span>
              ) : (
                <User size={20} className="text-brand-peach mt-1" />
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
