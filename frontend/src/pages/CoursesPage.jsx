import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, Search, Filter, BookMarked, Clock, Star, 
  PlusCircle, ChevronRight, Sparkles, Code, Loader,
  Terminal, Activity, Cpu, Shield, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { listUserCourses } from '../services/api';
import { cn } from '../lib/utils';

const TABS = ['All_Units', 'In_Flux', 'Locked', 'Standby'];
const CATEGORIES = ['All', 'AI_Neural', 'Physics_CS', 'Engineering', 'Digital_Arts'];

export default function CoursesPage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All_Units');
  const [activeCategory, setActiveCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userCourses = await listUserCourses(currentUser.uid);
        const mapped = userCourses.map(c => {
          const lessonCount = c.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
          return {
            id: c.id,
            title: c.title || c.topic || 'UNTITLED_UNIT',
            category: c.category || 'AI_Neural',
            lessons: lessonCount,
            progress: c.progress || 0,
            color: c.color || '#3B82F6',
            rating: c.rating || 5.0,
            duration: c.duration || '2H_30M',
            status: c.status || (c.progress === 100 ? 'Locked' : c.progress > 0 ? 'In_Flux' : 'Standby')
          };
        });
        setCourses(mapped);
      } catch (err) {
        console.error('Core_Fetch_Failed:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [currentUser]);

  const filtered = courses.filter(course => {
    const titleMatch = course.title || '';
    const matchesSearch = titleMatch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All_Units'
      || (activeTab === 'In_Flux' && course.status === 'In_Flux')
      || (activeTab === 'Locked' && course.status === 'Locked')
      || (activeTab === 'Standby' && course.status === 'Standby');
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesTab && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32 text-center w-full min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
        <div className="relative">
           <div className="w-20 h-20 rounded-full border border-white/5" />
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full border-t-2 border-brand-blue shadow-[0_0_20px_rgba(59,130,246,0.5)]"
           />
           <Activity size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-blue animate-pulse" />
        </div>
        <h2 className="text-xl font-mono font-black text-white italic uppercase tracking-widest">Synchronizing_Archive...</h2>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-14 py-12 max-w-7xl mx-auto w-full min-h-screen font-sans bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 text-brand-blue font-mono text-[9px] font-black uppercase tracking-[0.4em] mb-4 italic bg-brand-blue/5 border border-brand-blue/20 w-fit px-4 py-1 rounded-lg">
             <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" /> SYSTEM_REGISTRY
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white mb-3 italic uppercase leading-none underline decoration-brand-blue/30 underline-offset-8">Unit_Inventory</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest italic opacity-60">Listing all active and locked heuristic units.</p>
        </div>
        <Link to="/build" className="flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black font-black py-4 px-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all uppercase italic tracking-tighter text-sm group">
          <PlusCircle size={18} /> INITIALIZE_NEW <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      {/* Tactical Filters */}
      <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-4 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-4 mb-12 relative z-10 hover:border-white/10 transition-colors">
        <div className="flex-1 flex items-center gap-4 bg-zinc-900/50 border border-white/5 px-6 py-4 rounded-2xl focus-within:border-brand-blue/30 transition-all">
          <Search size={20} className="text-zinc-700 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search_Registry (e.g. Suborbital)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white font-mono w-full text-sm placeholder-zinc-700 uppercase italic tracking-tighter"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-[10px] font-black font-mono px-6 py-4 rounded-xl whitespace-nowrap transition-all uppercase tracking-widest italic border",
                activeCategory === cat ? 'bg-brand-blue border-brand-blue text-white shadow-[0_4px_15px_rgba(59,130,246,0.3)]' : 'bg-transparent border-white/5 text-zinc-500 hover:text-white hover:bg-white/5'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Tabs */}
      <div className="flex gap-8 mb-12 overflow-x-auto no-scrollbar border-b border-white/5 pb-px relative z-10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "text-[11px] font-black font-mono px-2 py-5 whitespace-nowrap transition-all relative italic uppercase tracking-[0.2em]",
              activeTab === tab ? 'text-brand-blue' : 'text-zinc-600 hover:text-zinc-400'
            )}
          >
            {tab}
            {activeTab === tab && (
               <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue shadow-[0_0_10px_brand-blue]" />
            )}
          </button>
        ))}
      </div>

      {/* Global Inventory Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-32 bg-black/20 rounded-[3rem] border border-dashed border-white/5 relative z-10 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-grid-white opacity-[0.01]" />
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
               <Terminal size={32} className="text-zinc-700 group-hover:text-brand-blue" />
            </div>
            <h3 className="font-display font-black text-2xl text-white mb-3 italic uppercase tracking-tighter leading-none">Registry_Empty_</h3>
            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-10 italic">No units matches the current filter sequence.</p>
            <Link to="/build" className="text-brand-blue font-black hover:text-white transition-colors uppercase italic tracking-widest text-xs">Initialize_First_Project_ {">"}</Link>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {filtered.map((course, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                key={course.id}
              >
                <Link to={`/course/${course.id}`} className="group block h-full">
                  <div className="tech-card bg-zinc-900/40 p-10 h-full flex flex-col group hover:border-brand-blue/30 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity"><Activity size={60} className="text-brand-blue" /></div>
                    
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shadow-inner group-hover:bg-brand-blue group-hover:text-white transition-all">
                        <BookMarked size={24} className={course.progress > 0 ? "text-brand-blue group-hover:text-white" : "text-zinc-700 group-hover:text-white"} />
                      </div>
                      <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-xl">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-mono font-black text-white italic">{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-[9px] font-mono font-black text-brand-blue uppercase tracking-[0.3em] italic">{course.category}</span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-white mb-8 italic tracking-tighter uppercase leading-none group-hover:text-brand-blue transition-colors line-clamp-2">{course.title}</h3>
                    
                    <div className="mt-auto">
                      {course.progress > 0 && (
                        <div className="mb-8">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[9px] text-zinc-600 font-mono font-black uppercase tracking-widest italic">Sync_Fidelity</span>
                            <span className="text-[10px] font-mono font-black text-brand-blue italic">{course.progress}%</span>
                          </div>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden border border-white/5 relative">
                            <div className="h-full bg-brand-blue shadow-[0_0_10px_brand-blue] transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-white/5 pt-6 group/footer">
                        <div className="flex items-center gap-6 text-zinc-600 text-[9px] font-mono font-black uppercase tracking-widest italic">
                          <span className="flex items-center gap-2 group-hover/footer:text-zinc-400 transition-colors"><Cpu size={14}/> {course.lessons} SEC</span>
                          <span className="flex items-center gap-2 group-hover/footer:text-zinc-400 transition-colors"><Clock size={14}/> {course.duration}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-700 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">
                          {course.status === 'Locked'
                            ? <Shield size={18} />
                            : <Play size={14} fill="currentColor" className="ml-1" />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
