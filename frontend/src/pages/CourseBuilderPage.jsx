import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Lightbulb, BookOpen, Clock, 
  FileText, X, AlertCircle, Rocket, Terminal, Cpu,
  Activity, Zap, Shield, ChevronRight, Layers, Target,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

/**
 * Converts the backend course schema to UI expectations.
 */
function normalizeCourse(raw) {
  return {
    ...raw,
    outcomes: raw.outcomes || raw.learning_objectives || [],
    modules: (raw.modules || []).map(mod => ({
      ...mod,
      topics: (mod.topics || mod.lessons || []).map(item => ({
        id: item.id,
        name: item.name || item.title || 'Untitled',
        explanation: item.explanation || item.content?.explanation || '',
        videoPrompt:
          item.videoPrompt ||
          (item.videoScript?.scenes || []).map(s => s.narration).join(' ') ||
          '',
        animation: item.animation || null,
        youtubeSuggestions: item.youtubeSuggestions || [] 
      })),
    })),
  };
}

const SUGGESTIONS = [
  'Quantum_Computing_Basics',
  'Neural_Flow_Architectures',
  'Cryptographic_Heuristics',
  'Fluid_Dynamics_Simulations',
  'Advanced_Calculus_III',
  'Suborbital_Mechanics',
];

const STEPS = [
  { label: 'Initializing_Heuristics', icon: Lightbulb, color: 'text-amber-400' },
  { label: 'Architecting_Syllabus', icon: BookOpen, color: 'text-indigo-400' },
  { label: 'Generating_Sectors', icon: Cpu, color: 'text-brand-blue' },
  { label: 'Rendering_Simulations', icon: Activity, color: 'text-cyan-400' },
  { label: 'Fetching_External_Docs', icon: Video, color: 'text-red-400' },
  { label: 'Finalizing_Units', icon: Shield, color: 'text-emerald-400' },
];

export default function CourseBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.initialQuery || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [courseId, setCourseId] = useState(null);

  const { currentUser } = useAuth();

  const performGeneration = async (q) => {
    if (!q.trim()) return;
    setIsGenerating(true);
    setCurrentStep(0);
    setDone(false);
    setError(null);
    setCourseId(null);

    try {
      // API call to backend
      const { courseId, course } = await createCourse(q, 'Beginner', currentUser?.uid);
      setCourseId(courseId);
      setCurrentStep(STEPS.length - 1);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Transmission failed. Signal lost in deep space.');
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => performGeneration(query);

  useEffect(() => {
    if (location.state?.initialQuery && !isGenerating && !done && !error) {
      performGeneration(location.state.initialQuery);
    }
  }, [location.state, currentUser]);

  useEffect(() => {
    let t;
    if (isGenerating && !done && !error) {
      t = setInterval(() => {
        setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      }, 4000); 
    }
    return () => clearInterval(t);
  }, [isGenerating, done, error]);

  const handleViewCourse = () => {
    if (courseId) navigate(`/course/${courseId}`);
  };

  const handleReset = () => {
    setIsGenerating(false);
    setDone(false);
    setError(null);
    setQuery('');
    setCurrentStep(0);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col relative bg-background overflow-hidden py-10 px-6">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-grid-white opacity-[0.03]" />
      </div>

      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-4xl mx-auto w-full"
          >
            <div className="text-center mb-16 relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 bg-brand-blue/10 border border-brand-blue/30 rounded-3xl mx-auto mb-10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
                <Rocket size={40} className="text-brand-blue fill-brand-blue/20" />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-white mb-6 uppercase italic leading-none underline decoration-brand-blue/30 underline-offset-8">
                Initialize <span className="text-brand-blue">Build_Sequence</span>
              </h1>
              <p className="text-zinc-500 text-lg font-mono uppercase tracking-widest italic flex items-center justify-center gap-3">
                 <Terminal size={18} /> Enter Parameters for Unit_Generation
              </p>
            </div>

            <div className="w-full max-w-3xl mb-12 relative group/form">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue to-indigo-600 rounded-[2rem] blur opacity-20 group-hover/form:opacity-40 transition-opacity" />
              <div className="relative bg-zinc-900/80 backdrop-blur-3xl rounded-[2rem] p-3 flex flex-col md:flex-row gap-4 border border-white/10 shadow-2xl focus-within:border-brand-blue/50">
                <div className="flex-1 flex items-center px-6 py-2">
                   <Target size={24} className="text-zinc-600 mr-4" />
                   <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                    placeholder="Subject_ID (e.g. History of Spaceflight)..."
                    className="flex-1 bg-transparent border-none outline-none text-xl text-white font-mono placeholder-zinc-700 uppercase"
                  />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!query.trim()}
                  className="bg-brand-blue hover:bg-brand-darkBlue disabled:opacity-30 text-white font-black py-5 px-10 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] group italic uppercase text-lg"
                >
                  START_LINK <ArrowRight size={22} className="group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
              <span className="text-zinc-600 text-[10px] font-mono font-bold uppercase tracking-[0.3em] self-center mr-2">Preset_Heuristics:</span>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="bg-zinc-900/50 border border-white/5 text-zinc-500 text-[11px] font-mono font-black py-2.5 px-6 rounded-xl hover:bg-brand-blue/10 hover:text-brand-blue hover:border-brand-blue/20 transition-all uppercase tracking-tighter italic outline-none"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center relative z-10 w-full"
          >
            <div className="w-full max-w-2xl bg-black border border-white/10 p-12 md:p-16 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
               <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
               <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12 scale-150"><Cpu size={140} className="text-brand-blue" /></div>
               
               {/* Error State */}
               {error && (
                 <div className="relative z-10 text-center">
                   <div className="w-24 h-24 bg-rose-500/10 rounded-full mx-auto mb-10 flex items-center justify-center border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                     <AlertCircle size={40} className="text-rose-500" />
                   </div>
                   <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Transmission_Failed_</h2>
                   <p className="text-zinc-600 font-mono text-xs mb-10 uppercase tracking-widest leading-relaxed">Signal lost in sector: 0xDEADBEEF. Heuristic engine offline.</p>
                   <div className="bg-rose-500/5 border border-rose-500/10 text-rose-500 font-mono rounded-2xl p-6 text-[11px] mb-12 text-left italic border-l-4">
                      {error}
                   </div>
                   <button onClick={handleReset} className="w-full bg-white text-black font-black py-5 rounded-2xl text-sm uppercase italic tracking-widest hover:bg-zinc-200 transition-colors outline-none">
                     RETRY_HANDSHAKE
                   </button>
                 </div>
               )}

               {/* Generating State */}
               {!error && !done && (
                 <div className="relative z-10">
                   <div className="flex flex-col md:flex-row items-center gap-12 mb-16 px-4">
                      <div className="relative flex-shrink-0">
                         <div className="w-32 h-32 rounded-full border border-white/5" />
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-0 rounded-full border-t-4 border-brand-blue shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                         />
                         <div className="absolute inset-0 flex items-center justify-center">
                           <Activity size={40} className="text-brand-blue animate-pulse" />
                         </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <h2 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-3 leading-none underline decoration-brand-blue/30 underline-offset-8">Unit_Composition_Active</h2>
                         <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest italic">{"> "}Allocating memory blocks for: {query}</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                     {STEPS.map((step, i) => {
                       const Icon = step.icon;
                       const isActive = i === currentStep;
                       const isDone = i < currentStep;
                       return (
                         <div key={i} className={cn(
                           "flex items-center gap-6 p-5 rounded-2xl transition-all duration-500",
                           isActive ? 'bg-brand-blue/10 border border-brand-blue/20 translate-x-3 shadow-lg' : 'bg-transparent border border-transparent'
                         )}>
                           <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                             isDone ? 'bg-emerald-500/20 text-emerald-500' : isActive ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-900 text-zinc-700'
                           )}>
                             {isDone ? '✓' : <Icon size={18} />}
                           </div>
                           <div className="flex-1">
                              <span className={cn(
                                "text-[11px] font-mono font-black uppercase tracking-widest",
                                isActive ? 'text-brand-blue' : isDone ? 'text-zinc-400' : 'text-zinc-700'
                              )}>{step.label}</span>
                              {isActive && (
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ duration: 4, ease: "linear" }}
                                  className="h-px bg-brand-blue/40 mt-2" 
                                />
                              )}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}

               {/* Done State */}
               {!error && done && (
                 <div className="relative z-10 text-center">
                   <motion.div 
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="w-28 h-28 bg-emerald-500/10 rounded-full mx-auto mb-10 flex items-center justify-center text-emerald-500 text-5xl font-black italic border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                   >
                     ✓
                   </motion.div>
                   <h2 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter mb-4 leading-none">Sync_Complete_0X42</h2>
                   <p className="text-zinc-500 font-mono text-xs mb-12 uppercase tracking-widest leading-relaxed italic">Unit ID: {courseId} successfully projected to persistent registry.</p>
                   
                   <div className="flex flex-col sm:flex-row gap-5">
                     <button onClick={handleViewCourse} className="flex-1 bg-white hover:bg-zinc-200 text-black font-black py-5 px-8 rounded-2xl italic uppercase tracking-tighter transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group/view text-sm">
                       ACCESS_UNIT <ArrowRight size={20} className="group-hover:translate-x-1" />
                     </button>
                     <button onClick={handleReset} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 font-black py-5 px-8 rounded-2xl italic uppercase tracking-tighter transition-all border border-white/5 flex items-center justify-center gap-3 group/new text-sm outline-none">
                        NEW_INIT <PlusCircle size={18} />
                     </button>
                   </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PlusCircle = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);
