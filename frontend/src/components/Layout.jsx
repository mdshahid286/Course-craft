import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  Users,
  BarChart2,
  Settings,
  PlusCircle,
  LogOut,
  BookOpen,
  Search,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const MENU = [
  {
    section: 'MENU',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/courses',   label: 'My Courses',  icon: Library },
      { path: '/build',     label: 'Build Course', icon: PlusCircle },
      { path: '/community', label: 'Community',    icon: Users },
      { path: '/analytics', label: 'Analytics',    icon: BarChart2 },
    ],
  },
  {
    section: 'GENERAL',
    items: [
      { path: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="flex h-screen bg-app-bg font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-[220px] flex-shrink-0 bg-app-surface border-r border-app-border flex flex-col z-20">

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-app-border">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center shadow-brand">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-base font-display font-bold text-app-fg group-hover:text-brand-green transition-colors">
              CourseCraft
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
          {MENU.map(({ section, items }) => (
            <div key={section}>
              <p className="section-label">{section}</p>
              <div className="space-y-0.5">
                {items.map(({ path, label, icon: Icon }) => {
                  const active = pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={cn(
                        active ? 'nav-link-active' : 'nav-link'
                      )}
                    >
                      <Icon size={17} />
                      {label}
                      {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom CTA card */}
        <div className="mx-3 mb-3 p-4 rounded-2xl bg-brand-green text-white">
          <p className="text-xs font-semibold mb-1 opacity-90">Get the app</p>
          <p className="text-[11px] opacity-70 mb-3 leading-relaxed">
            Build courses on the go with our mobile app.
          </p>
          <button className="w-full text-xs font-bold bg-white text-brand-green rounded-lg py-2 hover:bg-brand-green-muted transition-colors">
            Download
          </button>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="w-full nav-link text-app-muted hover:text-rose-600 hover:bg-rose-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="h-16 bg-app-surface border-b border-app-border flex items-center px-6 gap-4 z-10 flex-shrink-0">
          {/* Search */}
          <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-2 bg-app-surface2 border border-app-border rounded-xl px-3 py-2 text-sm text-app-muted hover:border-app-border2 transition-colors cursor-pointer">
              <Search size={15} />
              <span className="font-medium">Search task</span>
              <span className="ml-auto text-xs bg-app-border px-1.5 py-0.5 rounded-md font-mono opacity-70">⌘F</span>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto">
            <button className="w-9 h-9 rounded-xl bg-app-surface2 border border-app-border flex items-center justify-center text-app-muted hover:text-app-fg hover:border-app-border2 transition-all">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </button>
            <button className="w-9 h-9 rounded-xl bg-app-surface2 border border-app-border flex items-center justify-center text-app-muted hover:text-app-fg hover:border-app-border2 transition-all relative">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-green rounded-full" />
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-app-border">
              <div className="w-9 h-9 rounded-full bg-brand-green-lighter text-brand-green font-bold text-sm flex items-center justify-center">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-app-fg leading-tight">
                  {currentUser?.displayName || 'User'}
                </p>
                <p className="text-xs text-app-muted leading-tight truncate max-w-[140px]">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-app-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
