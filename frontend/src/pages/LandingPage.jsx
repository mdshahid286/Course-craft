import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Rocket, Sparkles, Video, BookOpen, Layers, 
  Zap, ArrowRight, PlayCircle, Code, ChevronRight, CheckCircle2,
  Cpu, Terminal, Globe, Shield, Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.3], [0.9, 1]);
  const mockupRotateX = useTransform(scrollYProgress, [0, 0.3], [10, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background font-sans selection:bg-brand-blue/40 selection:text-white overflow-hidden text-foreground">
      
      {/* Space Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      {/* Navbar - Techy & Glassy */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
               <Rocket size={20} className="text-white fill-white/20" />
            </div>
            <span className="text-2xl font-display font-black tracking-tighter text-white uppercase italic">
              Orbit<span className="text-brand-blue font-bold not-italic">Engine</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest hidden md:block">
              Auth_Gateway
            </Link>
            <Link to="/login" className="text-[13px] font-black bg-brand-blue text-white px-8 py-3 rounded-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2 uppercase tracking-tighter group italic">
              Initialize System <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 md:pt-60 overflow-hidden">
        <motion.div style={{ y: heroY }} className="max-w-6xl mx-auto px-6 text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-brand-blue text-xs font-black uppercase tracking-[0.2em] mb-12 backdrop-blur-md"
          >
            <Cpu size={14} className="animate-pulse" /> AI Rendering Cluster: ACTIVE
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl lg:text-[7rem] font-display font-black tracking-tighter text-white mb-10 leading-[0.9] uppercase italic"
          >
            Teach at the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-indigo-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              Speed of Light.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg md:text-2xl text-zinc-400 font-medium max-w-3xl mx-auto mb-16 leading-relaxed font-mono"
          >
            {"> "}The first AI-native course builder for the space-age. Generate syllabi, cinematic Manim animations, and interactive labs in seconds.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login" className="w-full sm:w-auto px-12 py-5 bg-white text-black font-black rounded-2xl text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3 group hover:scale-105 italic uppercase">
              Start Building <Terminal size={20} />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-transparent border border-white/10 text-white font-black rounded-2xl text-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3 group italic uppercase">
              <PlayCircle size={22} className="text-brand-blue" /> System Overview
            </button>
          </motion.div>
        </motion.div>

        {/* Cinematic Mockup */}
        <div className="w-full mt-32 px-6 relative z-10">
          <motion.div 
            style={{ 
              scale: mockupScale,
              rotateX: mockupRotateX,
              perspective: "2000px"
            }}
            className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="h-10 bg-zinc-900 flex items-center px-6 gap-2 border-b border-white/5">
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
               <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
               <div className="ml-auto flex items-center gap-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Status: Core_Operational</span>
               </div>
            </div>
            
            <div className="p-8 md:p-16 h-[500px] flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <div className="absolute inset-0 bg-brand-blue/5 pointer-events-none" />
                
                {/* Floating Tech Widgets */}
                <div className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10">
                   <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className="bg-black/80 border border-brand-blue/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.1)] relative group overflow-hidden"
                   >
                     <div className="absolute top-0 right-0 p-4 opacity-20"><Activity size={40} className="text-brand-blue" /></div>
                     <h4 className="text-brand-blue font-mono font-bold text-sm mb-4">LOG_GENERATION_SEQUENCE</h4>
                     <div className="space-y-4 font-mono text-xs">
                        <p className="text-zinc-500">{"> "}Building semantic architecture...</p>
                        <p className="text-emerald-400">{"> "}Course outline projected.</p>
                        <p className="text-zinc-500">{"> "}Initializing Manim render cluster...</p>
                        <p className="text-brand-blue font-bold flex items-center gap-2">Generating Module_01 [#######---] 72%</p>
                     </div>
                   </motion.div>

                   <motion.div 
                     animate={{ y: [0, 10, 0] }}
                     transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                     className="bg-black/80 border border-indigo-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.1)]"
                   >
                     <h4 className="text-indigo-400 font-mono font-bold text-sm mb-6 uppercase flex items-center justify-between">
                        Neural_Network_Syllabus
                        <Shield size={16} />
                     </h4>
                     <div className="space-y-4">
                        <div className="h-2 bg-zinc-800 rounded-full w-full" />
                        <div className="h-2 bg-zinc-800 rounded-full w-3/4" />
                        <div className="h-2 bg-zinc-800 rounded-full w-4/5" />
                        <div className="grid grid-cols-3 gap-2 mt-8">
                           <div className="h-20 bg-indigo-500/10 rounded-xl border border-indigo-500/20" />
                           <div className="h-20 bg-indigo-500/10 rounded-xl border border-indigo-500/20" />
                           <div className="h-20 bg-indigo-500/10 rounded-xl border border-indigo-500/20" />
                        </div>
                     </div>
                   </motion.div>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid - Space Themed */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div className="md:col-span-2 tech-card group">
               <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-40 transition-opacity duration-700">
                  <Globe size={180} className="text-brand-blue" />
               </div>
               <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex items-center justify-center mb-8">
                     <Video size={28} className="text-brand-blue" />
                  </div>
                  <h3 className="text-4xl font-display font-black text-white italic mb-6">Manim Engine V2</h3>
                  <p className="text-zinc-400 text-xl font-medium max-w-md leading-relaxed">
                     Hardware-accelerated educational rendering. Turn abstract concepts into cinematic motion graphics with a single command.
                  </p>
                  <div className="mt-auto pt-10 flex gap-4 overflow-hidden">
                     {['#Vector_Math', '#Fluid_Dynamics', '#Neural_Flow'].map(t => (
                       <span key={t} className="px-4 py-2 border border-white/5 bg-white/5 rounded-lg text-[10px] font-mono text-zinc-500">{t}</span>
                     ))}
                  </div>
               </div>
            </motion.div>

            <motion.div className="tech-card flex flex-col justify-between">
               <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                  <Layers size={24} className="text-indigo-400" />
               </div>
               <div>
                  <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter italic">Deep_Syllabus</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                     Pedagogically sound curricula architected by 2.0-grade reasoning models. Every lesson objective is targeted and measurable.
                  </p>
               </div>
            </motion.div>

            <motion.div className="tech-card flex flex-col justify-between">
               <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                  <PlayCircle size={24} className="text-cyan-400" />
               </div>
               <div>
                  <h4 className="text-2xl font-bold mb-4 uppercase tracking-tighter italic">Instant_Playback</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">
                     Stream AI generated content instantly. No more months of post-production. The curriculum evolves as you build it.
                  </p>
               </div>
            </motion.div>

            <motion.div className="md:col-span-2 tech-card bg-brand-blue group overflow-hidden">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl group-hover:bg-black/50 transition-colors" />
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1">
                     <h3 className="text-4xl font-display font-black text-white uppercase italic mb-6 leading-tight tracking-tighter">Connect with the <br /> creator_cluster</h3>
                     <p className="text-blue-100/60 font-medium mb-8">Join David Kim, Sarah Chen, and 12k+ other system architects building the next generation of courses.</p>
                     <button className="bg-white text-black font-black px-10 py-4 rounded-2xl italic uppercase group flex items-center gap-3">
                        Enter_Hall <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                  <div className="hidden md:flex gap-4">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                           <Globe size={40} className="text-white/20" />
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer - Techy */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Rocket size={16} className="text-brand-blue" />
               </div>
               <span className="font-display font-black tracking-tighter uppercase italic text-xl">OrbitEngine</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest text-center">
               © 2026 Space_Logic_Systems // All units operational
            </div>
            <div className="flex gap-8 font-mono text-[11px] text-zinc-400 uppercase">
               <a href="#" className="hover:text-brand-blue transition-colors tracking-tighter underline underline-offset-4 decoration-brand-blue/30">Manifesto_01</a>
               <a href="#" className="hover:text-brand-blue transition-colors tracking-tighter underline underline-offset-4 decoration-brand-blue/30">Protocol_Docs</a>
            </div>
         </div>
      </footer>

    </div>
  );
}
