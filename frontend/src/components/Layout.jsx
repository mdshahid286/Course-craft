import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Rocket, 
  LayoutDashboard, 
  Library, 
  Users, 
  BarChart2, 
  Settings, 
  PlusCircle, 
  LogOut,
  ChevronRight,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard_OS', icon: LayoutDashboard },
  { path: '/courses', label: 'Library_Grid', icon: Library },
  { path: '/build', label: 'System_Build', icon: PlusCircle },
  { path: '/community', label: 'Creator_Hall', icon: Users },
  { path: '/analytics', label: 'Neuro_Insights', icon: BarChart2 },
  { path: '/settings', label: 'Core_Configs', icon: Settings },
];

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-[#09090B] text-foreground font-sans overflow-hidden">
      
      {/* Space Backdrop inside Layout */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-grid-white" />

      {/* Sidebar - Robotic/Vertical Tech Style */}
      <aside className="w-72 bg-black border-r border-[#27272A] p-6 flex flex-col z-20 relative">
        <div className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
          <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
            <Rocket size={18} className="text-white fill-white/20" />
          </div>
          <div>
            <span className="text-xl font-display font-black tracking-tighter text-white uppercase italic group-hover:text-brand-blue transition-colors">
              Orbit<span className="text-brand-blue font-bold not-italic">Engine</span>
            </span>
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">
               <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
               V2.0_Core_Operational
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all relative overflow-hidden italic",
                  isActive 
                    ? "bg-brand-blue text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-blue -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={16} className={cn(isActive ? "text-white" : "text-zinc-600 group-hover:text-brand-blue transition-colors")} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </div>

        {/* User Status Widget */}
        <div className="mt-8 p-6 bg-[#121214] border border-[#27272A] rounded-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity"><Activity size={24} className="text-brand-blue" /></div>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                 <Cpu size={18} className="text-brand-blue" />
              </div>
              <div>
                 <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Unit_ID</p>
                 <p className="text-xs font-black tracking-tight uppercase">User_Core</p>
              </div>
           </div>
           
           <button 
             onClick={logout}
             className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/80 hover:text-red-400 border border-red-500/10 rounded-xl text-[10px] font-mono font-bold uppercase transition-all"
           >
             <LogOut size={14} /> Terminate_Session
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-background relative z-10 custom-scrollbar">
        {/* Top Floating Stats Bar */}
        <header className="fixed top-0 right-0 left-72 h-14 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center px-10 justify-between z-30">
           <div className="flex items-center gap-6 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-blue rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Stream_Active: 1.2 GB/s</span>
              <span className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full" /> Render_Clock: 4.2 GHZ</span>
           </div>
           
           <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group cursor-pointer hover:border-brand-blue transition-colors">
              <Terminal size={14} className="text-zinc-600 group-hover:text-brand-blue" />
           </div>
        </header>

        <div className="pt-20">
          {children}
        </div>
      </main>
    </div>
  );
}
