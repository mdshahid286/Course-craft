import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, Search, Laptop, BookOpen, PenTool, BookMarked, 
  ArrowRight, Video, FileText, Code, Layers, Sparkles, 
  Loader, Activity, Cpu, Rocket, Terminal, Target,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { listUserCourses } from '../services/api';
import { cn } from '../lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTopic, setSearchTopic] = useState('');

  useEffect(() => {
    async function fetchRecent() {
      if (!currentUser) return;
      try {
        const all = await listUserCourses(currentUser.uid);
        // Sort and limit
        setCourses(all.slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch recent courses', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, [currentUser]);

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (searchTopic.trim()) {
      navigate('/build', { state: { initialQuery: searchTopic } });
    } else {
      navigate('/build');
    }
  };

  return (
    <div className="px-6 md:px-10 pb-12 w-full max-w-[1400px] mx-auto flex flex-col gap-10 font-sans">
      
      {/* Space Hero Section / OS Interface Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-black border border-white/10 rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden group"
      >
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 hover:opacity-100 transition-opacity duration-1000">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px]" />
           <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYSTEM_OS_READY_0X42
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase italic">
              Project <span className="text-brand-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">Knowledge_Core</span>
            </h2>
            
            <p className="text-zinc-500 text-lg md:text-xl mb-12 font-mono max-w-lg leading-relaxed">
              {"> "}Enter your query to initialize high-fidelity curriculum generation. 
            </p>
            
            <form onSubmit={handleQuickCreate} className="flex flex-col sm:flex-row items-stretch gap-4">
              <div className="flex-1 flex items-center bg-zinc-900/80 backdrop-blur-md border border-white/10 p-2 pl-6 rounded-2xl focus-within:border-brand-blue/50 transition-all group/input">
                <Sparkles size={20} className="text-zinc-600 group-focus-within/input:text-brand-blue transition-colors mr-3" />
                <input 
                  type="text" 
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  placeholder="Query (e.g. Asymmetric Cryptography)..." 
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-white font-mono placeholder-zinc-700"
                />
              </div>
              <button type="submit" className="bg-white hover:bg-zinc-100 text-black font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase italic">
                Initiate <ArrowRight size={20} className="group-hover:translate-x-1" />
              </button>
            </form>
          </div>
          
          <div className="hidden lg:block relative perspective-1000 group">
             <div className="w-80 h-96 bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-6 rotate-y-6 group-hover:rotate-0 transition-all duration-700 flex flex-col gap-8 relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-blue/5 pointer-events-none" />
                 <div className="flex justify-between items-center">
                    <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400"><BookMarked size={24}/></div>
                    <Cpu size={24} className="text-zinc-700 animate-orbit" />
                 </div>
                 <div className="space-y-4">
                    <div className="h-2.5 bg-zinc-800 rounded-full w-full" />
                    <div className="h-2.5 bg-zinc-800 rounded-full w-3/4" />
                    <div className="h-2 bg-zinc-800/50 rounded-full w-4/5" />
                 </div>
                 <div className="mt-auto p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-blue group-hover:scale-110 transition-transform" />
                    <div className="h-2 bg-zinc-800 rounded-full w-full" />
                 </div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Main OS Body */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        <div className="md:col-span-3 lg:col-span-4 flex justify-between items-end mb-2 px-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase underline decoration-brand-blue/30 underline-offset-8">Unit_Manifest</h3>
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.3em]">Projected Registry // Sorted by Access_Time</span>
          </div>
          <Link to="/courses" className="text-zinc-500 font-mono font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors border border-white/5 px-4 py-2 rounded-lg bg-white/5">
            ALL_RESOURCES <ArrowUpRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="md:col-span-4 flex items-center justify-center p-32 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] border-dashed">
            <Loader size={32} className="text-brand-blue animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="md:col-span-4 flex flex-col items-center justify-center p-20 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] border-dashed text-center">
            <Terminal size={40} className="text-zinc-800 mb-6" />
            <p className="text-zinc-500 font-mono mb-8 italic uppercase tracking-widest text-sm">Registry is empty. No systems detected.</p>
            <Link to="/build" className="text-brand-blue font-black hover:underline uppercase tracking-tighter flex items-center gap-2">Initialize First_Unit <Rocket size={16}/></Link>
          </div>
        ) : (
          courses.map((course, idx) => (
            <motion.div key={course.id} variants={itemVariants} className="h-full">
              <Link to={`/course/${course.id}`} className="tech-card h-full group flex flex-col p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-40 transition-opacity"><Terminal size={32} /></div>
                
                <div className={cn(
                  "mb-6 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative z-10",
                  idx % 2 === 0 ? 'bg-brand-blue/10 border border-brand-blue/20 text-brand-blue' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                )}>
                  {idx % 2 === 0 ? <Code size={24} strokeWidth={2.5}/> : <Laptop size={24} strokeWidth={2.5}/>}
                </div>
                
                <h4 className="font-display font-black text-2xl text-white mb-6 leading-tight tracking-tighter uppercase italic group-hover:text-brand-blue transition-colors">
                  {course.title || course.topic || 'System_Untitled'}
                </h4>
                
                <div className="space-y-4 mb-8 mt-auto">
                   <div className="flex justify-between items-center text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                      <span>Sync_Status</span>
                      <span className={cn(idx % 2 === 0 ? 'text-brand-blue' : 'text-indigo-400')}>{course.progress || 0}%</span>
                   </div>
                   <div className="h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress || 0}%` }}
                        className={cn("h-full rounded-full transition-all", idx % 2 === 0 ? 'bg-brand-blue' : 'bg-indigo-400')}
                      />
                   </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14}/> {course.modules?.length || 0} SECTORS
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 group-hover:bg-brand-blue group-hover:text-white flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}

        {/* Global Progress Hub */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 tech-card flex flex-col min-h-[300px] relative">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={120} /></div>
          
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-1">Telemetry_Feed</h3>
              <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">Unit activity analysis // Last 168 Hours</p>
            </div>
            <div className="bg-brand-blue/10 border border-brand-blue/20 text-brand-blue px-3 py-1 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase">
              +1.2k_XP
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-2 pt-10 h-[120px] relative z-10">
            {[
              { label: 'MN', h: '40%', active: false },
              { label: 'TU', h: '70%', active: false },
              { label: 'WD', h: '50%', active: true },
              { label: 'TH', h: '95%', active: true },
              { label: 'FR', h: '60%', active: false },
              { label: 'SA', h: '30%', active: false },
              { label: 'SU', h: '45%', active: false },
            ].map(bar => (
              <div key={bar.label} className="w-10 flex flex-col items-center gap-3 group/bar cursor-pointer">
                <div 
                  className={cn(
                    "w-full rounded-t-xl relative transition-all duration-500 group-hover/bar:bg-brand-blue group-hover/bar:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
                    bar.active ? 'bg-brand-blue bg-opacity-80' : 'bg-zinc-800'
                  )}
                  style={{ height: bar.h }}
                >
                   {bar.active && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />}
                </div>
                <span className="text-[9px] font-mono font-black text-zinc-600 group-hover/bar:text-white transition-colors uppercase tracking-tighter">{bar.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Intelligence Box */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4 tech-card bg-gradient-to-r from-zinc-900 to-black p-10 flex flex-col md:flex-row items-center gap-12 mt-4 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
          
          <div className="flex-1">
            <h3 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-4">
               <Cpu size={32} className="text-indigo-400" /> System_Optimization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Rocket size={18} />, label: 'Neural Flow', status: 'Optimal', col: 'text-brand-blue' },
                { icon: <Target size={18} />, label: 'Objective Sync', status: 'Synced', col: 'text-emerald-400' },
                { icon: <Activity size={18} />, label: 'Latency', status: '12ms', col: 'text-amber-400' },
                { icon: <Terminal size={18} />, label: 'Shell', status: 'Native', col: 'text-zinc-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-black/50 border border-white/5 p-5 rounded-2xl group/stat hover:border-white/10 transition-colors">
                  <div className={cn("mb-3", stat.col)}>{stat.icon}</div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-white font-black text-sm uppercase tracking-tighter italic">{stat.status}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer System Broadcaster */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-brand-blue text-white rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between shadow-[0_40px_100px_rgba(59,130,246,0.2)] relative overflow-hidden group"
      >
         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
         <div className="absolute right-[-10%] top-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[100px]" />

         <div className="relative z-10 text-center md:text-left mb-10 md:mb-0 max-w-xl">
           <h2 className="text-4xl md:text-5xl font-display font-black mb-4 uppercase italic tracking-tighter leading-none">Access the <br /> Protocol_Docs_</h2>
           <p className="text-blue-100/70 font-mono text-xs uppercase tracking-widest leading-relaxed">Integrated deployment instructions for system architects and developers.</p>
         </div>
         
         <button className="relative z-10 bg-white hover:bg-zinc-100 text-black font-black py-5 px-10 rounded-2xl transition-all shadow-xl uppercase italic text-sm tracking-tighter flex items-center gap-3">
           Secure_Entry <Terminal size={18} />
         </button>
      </motion.section>

    </div>
  );
}
