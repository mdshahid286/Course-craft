import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Activity, Clock, Target, ArrowUpRight, Zap, RefreshCcw, FileText, CheckCircle } from 'lucide-react';

const KPIS = [
  { label: 'Total Learning Hours', value: '42.5h', icon: Clock, trend: '+12% this week', color: 'text-brand-blue', bg: 'bg-blue-50' },
  { label: 'Courses Completed', value: '8', icon: CheckCircle, trend: '+2 this month', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Avg. Quiz Score', value: '92%', icon: Target, trend: '+4% improvement', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Current Streak', value: '14 Days', icon: Zap, trend: 'Personal best!', color: 'text-amber-500', bg: 'bg-amber-50' },
];

const SKILL_RADAR = [
  { area: 'Machine Learning', score: 85 },
  { area: 'Algorithms', score: 60 },
  { area: 'System Design', score: 90 },
  { area: 'Mathematics', score: 75 },
  { area: 'Web3 / Cryptography', score: 40 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 mb-2">Learning Analytics</h1>
          <p className="text-slate-500 font-medium text-lg">AI-driven insights into your study habits and knowledge retention.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {['Last 7 Days', 'Last 30 Days', 'All Time'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              key={kpi.label}
              className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${kpi.bg} opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none blur-[20px]`}></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center border border-white/50 shadow-sm ${kpi.bg} ${kpi.color}`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-display font-black text-3xl text-slate-900 mb-2">{kpi.value}</h3>
                <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md border border-emerald-100">
                  <ArrowUpRight size={14} /> {kpi.trend}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Area (Mocked with CSS bars) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Activity className="text-brand-blue" /> Study Activity
              </h3>
              <button className="text-slate-400 hover:text-slate-900 transition-colors"><RefreshCcw size={18} /></button>
            </div>
            
            <div className="h-64 flex items-end gap-2 md:gap-4 relative pt-10">
              <div className="absolute top-0 left-0 w-full flex flex-col justify-between h-full pointer-events-none opacity-20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-t border-slate-400 w-full"></div>
                ))}
              </div>
              
              {/* Fake Data Bars */}
              {[40, 60, 30, 80, 50, 95, 70, 85, 45, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center group relative z-10">
                   <div 
                     className="w-full bg-brand-blue rounded-t-xl transition-all duration-1000 group-hover:bg-indigo-500 cursor-pointer shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] relative overflow-hidden" 
                     style={{ height: `${h}%` }}
                   >
                     <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                   </div>
                   <div className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-widest text-center rotate-45 md:rotate-0 origin-left max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                     Day {i + 1}
                   </div>
                   
                   {/* Tooltip */}
                   <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap">
                      {h} Mins
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
             
             <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-amber-50 to-transparent pointer-events-none"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
               <div className="w-24 h-24 bg-amber-100 rounded-[2rem] flex items-center justify-center flex-shrink-0 border border-amber-200 shadow-sm shadow-amber-100">
                 <Sparkles size={40} className="text-amber-500" />
               </div>
               <div>
                 <h3 className="font-display font-bold text-2xl text-slate-900 mb-3 tracking-tight">AI Knowledge Gap Analysis</h3>
                 <p className="text-slate-600 mb-5 leading-relaxed text-sm">Based on your recent quizzes, our AI has identified a drop in retention regarding <span className="font-bold text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded">Asymmetric Cryptography</span>. We recommend generating a targeted refresher module.</p>
                 <button className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2">
                   Generate Refresher <ArrowUpRight size={16} />
                 </button>
               </div>
             </div>
          </div>

        </div>

        {/* Sidebar Analytics */}
        <aside className="space-y-8">
           
           <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="font-display font-bold text-xl text-slate-900 mb-8 flex items-center gap-2">
                <Target className="text-rose-500" /> Skill Distribution
             </h3>
             
             <div className="space-y-6">
                {SKILL_RADAR.map(skill => (
                  <div key={skill.area}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-slate-700">{skill.area}</span>
                      <span className="text-xs font-bold text-slate-400">{skill.score}% proficiency</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${skill.score}%` }}
                         transition={{ duration: 1, ease: 'easeOut' }}
                         className={`h-full rounded-full ${skill.score < 50 ? 'bg-rose-500' : skill.score < 80 ? 'bg-amber-500' : 'bg-brand-blue shadow-[inset_0_2px_5px_rgba(255,255,255,0.3)]'}`}
                       ></motion.div>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-gradient-to-br from-brand-blue to-indigo-600 rounded-[2rem] p-8 shadow-lg text-white border border-white/10 relative overflow-hidden">
             
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] pointer-events-none"></div>
             
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
               <FileText size={24} className="text-white" />
             </div>
             
             <h3 className="font-display font-bold text-2xl mb-3 tracking-tight text-white drop-shadow-sm">Export Detailed Report</h3>
             <p className="text-blue-100 text-sm mb-8 leading-relaxed font-medium">Download a comprehensive PDF outlining your learning milestones, quiz transcripts, and generated curriculum.</p>
             
             <button className="w-full bg-white hover:bg-slate-50 text-brand-blue font-black py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all uppercase tracking-widest text-[13px]">
               Download PDF
             </button>
           </div>
        </aside>

      </div>
    </div>
  );
}
