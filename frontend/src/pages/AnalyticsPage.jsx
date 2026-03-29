import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, Activity, Clock, Target, ArrowUpRight, 
  Zap, RefreshCcw, FileText, CheckCircle, Cpu, 
  Terminal, Shield, Layers, Brain
} from 'lucide-react';
import { cn } from '../lib/utils';

// MOCKED STATS FROM DB
const KPIS = [
  { label: 'Neural Activity', value: '142.5h', icon: Brain, trend: '+12% flux', color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
  { label: 'Units Complete', value: '18', icon: CheckCircle, trend: '+2 logic_cycles', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Retention Rank', value: '92%', icon: Target, trend: 'S-Tier accuracy', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { label: 'Uptime Streak', value: '14 Days', icon: Zap, trend: 'Personal_Best!', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const SKILL_MAP = [
  { area: 'Machine Learning', score: 85, latency: '4ms' },
  { area: 'Algorithms', score: 60, latency: '12ms' },
  { area: 'System Design', score: 90, latency: '2ms' },
  { area: 'Mathematics', score: 75, latency: '8ms' },
  { area: 'Core Protocols', score: 40, latency: '24ms' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="px-6 md:px-10 py-10 max-w-7xl mx-auto w-full min-h-screen font-sans selection:bg-brand-blue/30 selection:text-white">
      
      {/* OS Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-brand-blue/5 border border-brand-blue/20 rounded-lg text-brand-blue text-[10px] font-mono font-bold uppercase tracking-widest">
             <Activity size={12} className="animate-pulse" /> Telemetry_V2.0
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white mb-2 uppercase italic leading-none">
            Neuro<span className="text-brand-blue">_Insights</span>
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] font-medium italic">Integrated Cognitive Performance Analysis // Stream_Active</p>
        </div>
        
        <div className="flex bg-black border border-white/10 rounded-xl p-1 shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue/5 pointer-events-none group-hover:bg-brand-blue/10 transition-colors" />
          {['T-7D', 'T-30D', 'T-INF'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-5 py-2.5 text-[10px] font-mono font-black uppercase tracking-widest rounded-lg transition-all relative z-10",
                timeRange === range ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-zinc-600 hover:text-white'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 relative z-10">
        {KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={kpi.label}
              className="tech-card h-full p-8 flex flex-col justify-between group overflow-hidden"
            >
              <div className={cn("absolute -right-4 -top-4 w-28 h-28 rounded-full opacity-0 group-hover:opacity-10 shadow-[0_0_40px_currentColor] blur-[30px] transition-all duration-700 pointer-events-none", kpi.color)} />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">{kpi.label}</div>
                   <div className="text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-tighter mt-1">S_BLOCK_ID_{100 + i}</div>
                </div>
              </div>
              
              <div className="relative z-10 mt-auto">
                <h3 className="font-display font-black text-4xl text-white mb-3 tracking-tighter group-hover:text-glow transition-all">{kpi.value}</h3>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-[0.1em] bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-lg w-fit group-hover:bg-emerald-500/10 transition-colors">
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> {kpi.trend}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        
        {/* Activity Stream Visualizer */}
        <div className="lg:col-span-2 space-y-10">
          
          <div className="tech-card p-10 bg-black/40 backdrop-blur-xl group">
             <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
             <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                   <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-1 flex items-center gap-3">
                      <Activity className="text-brand-blue" /> Study_Power_Output
                   </h3>
                   <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest italic">Temporal Activity Monitoring // 48Hz Sampling</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-white transition-colors group-hover:border-brand-blue/30"><RefreshCcw size={16} /></button>
                </div>
             </div>
             
             <div className="h-72 flex items-end gap-3 md:gap-5 relative pt-12">
                <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-56 pointer-events-none opacity-[0.05]">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="border-t border-white w-full"></div>
                   ))}
                </div>
                
                {/* Visualizer Bars */}
                {[45, 65, 35, 85, 55, 98, 75, 88, 50, 68].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col justify-end items-center group/bar relative z-10">
                      <div className="absolute -top-12 opacity-0 group-hover/bar:opacity-100 transition-all scale-75 group-hover/bar:scale-100 bg-brand-blue text-white text-[10px] font-mono font-black italic px-3 py-1.5 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.5)] pointer-events-none whitespace-nowrap z-20">
                         {h}MW_PWR
                      </div>
                      
                      <div className="w-full relative group-hover/bar:scale-x-110 transition-transform cursor-crosshair">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                           className="bg-brand-blue/10 border-t border-x border-brand-blue/40 rounded-t-lg relative overflow-hidden group-hover/bar:bg-brand-blue group-hover/bar:border-brand-blue shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300"
                         >
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 via-transparent to-white/20 opacity-40"></div>
                            <div className="absolute top-0 left-0 w-full h-px bg-white/40 shadow-[0_0_10px_white]"></div>
                         </motion.div>
                      </div>
                      
                      <div className="text-[8px] font-mono font-black text-zinc-700 group-hover/bar:text-brand-blue transition-colors mt-6 uppercase tracking-widest rotate-[-45deg] md:rotate-0">
                         ID_{i + 1}
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="tech-card bg-indigo-500/5 group border-indigo-500/20">
             <div className="absolute right-0 bottom-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Brain size={160} className="text-indigo-400" /></div>
             
             <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover:scale-105 transition-transform duration-500">
                   <Layers size={40} className="text-indigo-400 animate-glow-pulse" />
                </div>
                <div className="flex-1">
                   <h3 className="text-3xl font-display font-black text-white italic tracking-tighter uppercase mb-4 flex items-center gap-3 underline decoration-indigo-500/30 underline-offset-8 decoration-4">Knowledge_Gap_Report</h3>
                   <p className="text-zinc-500 font-mono text-[11px] mb-8 leading-relaxed max-w-2xl">
                      {"> "}Heuristic analysis detected a coherence drop in <span className="text-white px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded italic font-bold tracking-tight">Asymmetric_Logic_Flow</span>. 
                      Predictive score: 54%. Generating remediative logic recommended.
                   </p>
                   <button className="bg-white hover:bg-zinc-200 text-black font-black py-4 px-10 rounded-2xl text-[11px] uppercase tracking-tighter transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-3 italic group">
                      Initialize_Refresher <ArrowUpRight size={18} className="group-hover:translate-x-1" />
                   </button>
                </div>
             </div>
          </div>

        </div>

        {/* Tactical Intel Cluster */}
        <aside className="space-y-10 relative">
           <div className="tech-card border-brand-blue/20">
              <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-10 flex items-center gap-3">
                 <Shield size={20} className="text-brand-blue" /> Proficiency_Matrix
              </h3>
              
              <div className="space-y-8 relative z-10">
                 {SKILL_MAP.map(skill => (
                   <div key={skill.area} className="group/item">
                     <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-col">
                           <span className="text-[11px] font-black text-zinc-300 uppercase italic tracking-tighter group-hover/item:text-brand-blue transition-colors">{skill.area}</span>
                           <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-0.5">LATENCY: {skill.latency}</span>
                        </div>
                        <span className="text-[10px] font-mono font-black text-brand-blue">{skill.score}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-zinc-900 border border-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.score}%` }}
                          transition={{ duration: 1.2, ease: "backOut" }}
                          className={cn(
                             "h-full rounded-full transition-all shadow-[0_0_10px_currentColor]",
                             skill.score < 50 ? 'bg-rose-500 text-rose-500' : skill.score < 80 ? 'bg-amber-400 text-amber-400' : 'bg-brand-blue text-brand-blue'
                          )}
                        />
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="tech-card bg-brand-blue group border-white/10 shadow-[0_30px_60px_rgba(59,130,246,0.3)]">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-25 transition-opacity duration-1000 rotate-12 scale-150"><Terminal size={140} className="text-white" /></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center mb-8 backdrop-blur-xl shadow-inner">
                   <FileText size={24} className="text-white fill-white/10" />
                </div>
                
                <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">Manifest_Generator</h3>
                <p className="text-blue-100/60 font-mono text-[10px] uppercase tracking-widest mb-10 leading-relaxed font-bold">Transmit cognitive records and generated syllabi to persistent PDF format.</p>
                
                <button className="w-full bg-white hover:bg-zinc-100 text-black font-black py-4 rounded-xl shadow-2xl transition-all uppercase tracking-widest text-[11px] italic group flex items-center justify-center gap-3">
                   SECURE_EXPORT <Cpu size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
}
