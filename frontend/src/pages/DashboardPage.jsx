import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Search, Laptop, BookOpen, PenTool, BookMarked, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="px-6 md:px-10 pb-12 w-full max-w-6xl mx-auto flex flex-col gap-10 pt-6">
      
      {/* Hero Prompt Box */}
      <section className="bg-gradient-to-r from-brand-peach to-[#FCF1E8] rounded-5xl p-10 md:p-14 text-center shadow-[0_8px_30px_rgba(255,138,101,0.08)] relative overflow-hidden border border-white/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold text-[#36322C] mb-8 leading-[1.1] tracking-tight relative z-10">
          Ready to build<br/>something <span className="text-brand-blue">magical</span>?
        </h2>
        
        <div className="max-w-2xl mx-auto flex items-center bg-white p-2 pl-6 rounded-full shadow-lg shadow-black/5 relative z-10">
          <input 
            type="text" 
            placeholder="What are we learning today?" 
            className="flex-1 bg-transparent border-none outline-none text-lg text-brand-text placeholder-brand-muted/70"
          />
          <Link to="/build" className="bg-brand-blue hover:bg-brand-darkBlue text-white font-bold py-3.5 px-8 rounded-full flex items-center gap-2 transition-colors shadow-md">
            <Search size={18} strokeWidth={3} />
            <span>Start</span>
          </Link>
        </div>
      </section>

      {/* Active Projects */}
      <section>
        <div className="flex justify-between items-end mb-6 px-1">
          <div>
            <h3 className="text-2xl font-display font-bold text-brand-text mb-1 tracking-tight">Active Projects</h3>
            <p className="text-brand-muted text-sm font-medium">Pick up where you left off blocks</p>
          </div>
          <Link to="/courses" className="text-brand-blue font-bold text-sm tracking-wide flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/course/1" className="group block bg-white p-7 rounded-5xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all">
            <div className="w-16 h-16 bg-[#36A8FA] rounded-[1.25rem] flex items-center justify-center shadow-sm text-white mb-6 transform group-hover:-translate-y-1 transition-transform">
              <BookMarked size={28} />
            </div>
            <h4 className="font-display font-bold text-xl mb-4 tracking-tight">Intro to 3D Design</h4>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-2.5 bg-brand-tan rounded-full overflow-hidden">
                <div className="h-full bg-[#36A8FA] rounded-full w-[65%]"></div>
              </div>
              <span className="text-xs font-bold text-[#36A8FA]">65%</span>
            </div>
            <div className="flex justify-between items-center border-t border-brand-tan pt-4">
              <span className="text-xs font-extrabold text-brand-muted tracking-widest uppercase">12 Lessons</span>
              <div className="w-8 h-8 rounded-full bg-brand-yellow/30 text-[#D97706] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Play size={14} fill="currentColor" />
              </div>
            </div>
          </Link>

          <Link to="/course/2" className="group block bg-white p-7 rounded-5xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all">
            <div className="w-16 h-16 bg-[#FA8771] rounded-[1.25rem] flex items-center justify-center shadow-sm text-white mb-6 transform group-hover:-translate-y-1 transition-transform">
              <BookOpen size={28} />
            </div>
            <h4 className="font-display font-bold text-xl mb-4 tracking-tight">Robotics Workshop</h4>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-2.5 bg-brand-tan rounded-full overflow-hidden">
                <div className="h-full bg-[#A54737] rounded-full w-[20%]"></div>
              </div>
              <span className="text-xs font-bold text-[#A54737]">20%</span>
            </div>
            <div className="flex justify-between items-center border-t border-brand-tan pt-4">
              <span className="text-xs font-extrabold text-brand-muted tracking-widest uppercase">8 Lessons</span>
              <div className="w-8 h-8 rounded-full bg-brand-yellow/30 text-[#D97706] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Play size={14} fill="currentColor" />
              </div>
            </div>
          </Link>

          <Link to="/course/3" className="group block bg-white p-7 rounded-5xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all">
            <div className="w-16 h-16 bg-[#F6B45A] rounded-[1.25rem] flex items-center justify-center shadow-sm text-[#7D5A27] mb-6 transform group-hover:-translate-y-1 transition-transform">
              <PenTool size={28} />
            </div>
            <h4 className="font-display font-bold text-xl mb-4 tracking-tight">Color Theory Pro</h4>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-2.5 bg-brand-tan rounded-full overflow-hidden">
                <div className="h-full bg-[#7D5A27] rounded-full w-[90%]"></div>
              </div>
              <span className="text-xs font-bold text-[#7D5A27]">90%</span>
            </div>
            <div className="flex justify-between items-center border-t border-brand-tan pt-4">
              <span className="text-xs font-extrabold text-brand-muted tracking-widest uppercase">16 Lessons</span>
              <div className="w-8 h-8 rounded-full bg-brand-yellow/30 text-[#D97706] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Play size={14} fill="currentColor" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Lower Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        
        {/* My Stats */}
        <section className="bg-sidebar rounded-5xl p-8 shadow-sm flex flex-col relative overflow-hidden min-h-[260px]">
          <div className="absolute top-4 right-1/2 translate-x-1/2 flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm text-[10px] font-bold tracking-wider text-brand-muted gap-4">
            <span>© 2024 Tactile Playroom</span>
            <span className="w-px h-3 bg-brand-muted/30"></span>
            <span className="text-brand-blue cursor-pointer">Support</span>
            <span className="cursor-pointer">Privacy</span>
          </div>
          
          <div className="mt-8 mb-4">
            <h3 className="text-2xl font-display font-bold text-brand-text mb-1 tracking-tight">My Stats</h3>
            <p className="text-brand-muted text-sm font-medium">Weekly growth visualization</p>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-4 pb-2 pt-4 mt-auto">
            {[
              { label: 'MON', h: 'h-12', color: 'bg-[#F6B45A]', op: 'opacity-50' },
              { label: 'TUE', h: 'h-24', color: 'bg-[#36A8FA]', op: 'opacity-50' },
              { label: 'WED', h: 'h-16', color: 'bg-[#FA8771]', op: 'opacity-50' },
              { label: 'THU', h: 'h-32', color: 'bg-brand-blue', op: '' },
              { label: 'FRI', h: 'h-20', color: 'bg-[#F6B45A]', op: 'opacity-60' },
            ].map(bar => (
              <div key={bar.label} className="w-12 flex flex-col items-center gap-2">
                <div className={`w-full ${bar.h} ${bar.color} rounded-md rounded-b-none ${bar.op} transition-all hover:opacity-100`}></div>
                <span className="text-[10px] font-bold text-brand-muted mt-2">{bar.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Domains */}
        <section className="bg-sidebar rounded-5xl p-8 shadow-sm flex flex-col">
          <h3 className="text-2xl font-display font-bold text-brand-text mb-6 tracking-tight">Popular Domains</h3>
          
          <div className="space-y-4">
            {[
              { icon: <Laptop size={20} className="text-brand-blue" />, label: 'Tech & AI' },
              { icon: <PenTool size={20} className="text-[#D97706]" />, label: 'Digital Arts' },
              { icon: <BookOpen size={20} className="text-[#E11D48]" />, label: 'Storytelling' },
            ].map(({ icon, label }) => (
              <Link to="/courses" key={label} className="flex items-center justify-between bg-white px-5 py-4 rounded-3xl shadow-sm cursor-pointer hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  {icon}
                  <span className="font-bold text-sm">{label}</span>
                </div>
                <ArrowRight size={16} className="text-brand-muted group-hover:text-brand-blue transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Upsell Banner */}
      <section className="bg-brand-darkBlue rounded-4xl p-10 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-brand-darkBlue/20 overflow-hidden relative">
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-blue/30 rounded-full blur-3xl"></div>
         <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
           <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white mb-2 tracking-tight">Ready to expand your playroom?</h2>
           <p className="text-white/70 font-medium">Join 50k+ builders creating future knowledge blocks.</p>
         </div>
         <button className="relative z-10 bg-white hover:bg-white/90 text-brand-darkBlue font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:-translate-y-1">
           Upgrade Pro
         </button>
      </section>

    </div>
  );
}
