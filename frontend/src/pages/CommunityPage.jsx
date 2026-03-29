import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MessageSquare, Heart, Share2, TrendingUp, 
  Users, Award, Zap, ChevronRight, User, Terminal,
  Globe, Shield, Activity, Send, Paperclip
} from 'lucide-react';
import { cn } from '../lib/utils';

// MOCK DATA FOR FEED (LinkedIn Style)
const FEED_POSTS = [
  {
    id: 1,
    author: { name: 'Sarah_Chen', role: 'System Architect', avatar: 'SC' },
    timeAgo: '2h',
    title: 'Deployment Successful: Quantum_Computing_Module_v1.2',
    content: 'Just finalized the Manim render cluster for the Bell State inequalities. The fidelity in the Bloch Sphere visualization is exceeding expectations 0x42.',
    metrics: { likes: 342, comments: 45, shares: 12 },
    tags: ['#Quantum_Logic', '#Manim_Render', '#System_Design']
  },
  {
    id: 2,
    author: { name: 'Alex_Rivera', role: 'Logic Engineer', avatar: 'AR' },
    timeAgo: '5h',
    title: 'Heuristic Request: Asymmetric_Cryptography_Prompting',
    content: 'Input parameters are yielding generic syllabi for RSA-2048 implementations. Seeking advanced prompt templates for higher mathematical rigor in Lesson_03.',
    metrics: { likes: 128, comments: 23, shares: 5 },
    tags: ['#Prompt_Engineering', '#Crypto_Logic', '#Debug']
  }
];

// MOCK DATA FOR CHAT (Telegram Style)
const CHANNELS = [
  { id: 'dev-cluster', name: 'Dev_Cluster_01', members: '4.2k', activity: 'High', icon: Terminal, lastMsg: 'Syllabus build 0x99 completed' },
  { id: 'math-logic', name: 'Math_Logic_Gate', members: '1.8k', activity: 'Medium', icon: Shield, lastMsg: 'Calculus III visuals pending...' },
  { id: 'manim-ops', name: 'Manim_Ops', members: '800', activity: 'High', icon: Activity, lastMsg: 'New 4K Render Engine live' }
];

export default function CommunityPage() {
  const [view, setView] = useState('Feed'); // 'Feed' or 'Cluster'
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0].id);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-background text-foreground font-sans overflow-hidden py-10 px-6 md:px-10 max-w-[1500px] mx-auto w-full">
      
      {/* Sidebar - Cluster Switcher */}
      <aside className="w-80 hidden lg:flex flex-col gap-8 pr-8 border-r border-white/5 relative z-10">
        <div className="flex bg-black border border-white/10 rounded-2xl p-1.5 shadow-2xl">
          {['Feed', 'Cluster'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "flex-1 py-3 text-[10px] font-mono font-black uppercase tracking-widest rounded-xl transition-all relative z-10",
                view === v ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-zinc-600 hover:text-white'
              )}
            >
              System_{v}
            </button>
          ))}
        </div>

        {view === 'Cluster' ? (
           <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pt-2">
              <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-2 mb-6">Active_Nodes</h4>
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 group",
                    activeChannel === ch.id 
                      ? 'bg-brand-blue/10 border-brand-blue/20 shadow-[0_4px_15px_rgba(59,130,246,0.1)]' 
                      : 'bg-black/40 border-white/5 hover:border-white/10'
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", activeChannel === ch.id ? 'bg-brand-blue text-white' : 'bg-zinc-900 text-zinc-600')}>
                    <ch.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className={cn("font-display font-black text-sm uppercase italic tracking-tighter truncate", activeChannel === ch.id ? 'text-white' : 'text-zinc-400')}>{ch.name}</h5>
                    <p className="text-[9px] font-mono text-zinc-600 truncate uppercase mt-0.5">{ch.members} UNITS_SYNCED</p>
                  </div>
                </button>
              ))}
           </div>
        ) : (
          <div className="space-y-6">
             <div className="tech-card p-6 border-brand-blue/20">
                <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Award size={14} className="text-brand-blue" /> Unit_Ranks
                </h4>
                <div className="space-y-5">
                   {['David_Kim', 'Sarah_Chen', 'Dr_Watson'].map((u, i) => (
                      <div key={u} className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center font-mono text-[10px] text-zinc-500">#{i+1}</div>
                         <span className="text-xs font-black text-zinc-300 uppercase italic tracking-tighter truncate">{u}</span>
                      </div>
                   ))}
                </div>
                <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-mono font-bold text-zinc-500 hover:text-white uppercase transition-all tracking-widest italic outline-none">Expand_Registry</button>
             </div>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <main className="flex-1 lg:pl-8 overflow-y-auto no-scrollbar relative z-10 custom-scrollbar">
        
        <AnimatePresence mode="wait">
          {view === 'Feed' ? (
            <motion.div 
              key="feed"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-10"
            >
              {/* Post Composer */}
              <div className="tech-card p-8 bg-black/40 group focus-within:border-brand-blue/50">
                 <div className="flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                       <User size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                       <textarea 
                         placeholder="Initialize_Discussion (Markdown_Active)..." 
                         className="w-full bg-transparent border-none outline-none text-lg text-white font-mono placeholder-zinc-700 resize-none h-20 pt-2"
                       />
                       <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                          <div className="flex gap-4">
                             <button className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-600 hover:text-brand-blue transition-colors outline-none"><Terminal size={18} /></button>
                             <button className="p-2.5 bg-zinc-900 border border-white/5 rounded-xl text-zinc-600 hover:text-brand-blue transition-colors outline-none"><Paperclip size={18} /></button>
                          </div>
                          <button className="bg-brand-blue hover:bg-brand-darkBlue text-white font-black px-8 py-3 rounded-2xl text-[11px] uppercase tracking-widest italic transition-all shadow-xl flex items-center gap-3 group/btn">
                             BROADCAST <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Feed List (LinkedIn / Twitter Style) */}
              <div className="space-y-8">
                 {FEED_POSTS.map(post => (
                   <div key={post.id} className="tech-card p-10 bg-black/40 group hover:bg-black/60 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                               {post.author.avatar}
                            </div>
                            <div>
                               <h4 className="font-display font-black text-base text-white uppercase italic tracking-tighter flex items-center gap-2 group-hover:text-brand-blue transition-colors">
                                  {post.author.name}
                                  <Shield size={14} className="text-brand-blue/40" />
                               </h4>
                               <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{post.author.role} // T-{post.timeAgo}</p>
                            </div>
                         </div>
                      </div>
                      
                      <h3 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase mb-4 leading-tight group-hover:text-glow transition-all underline decoration-brand-blue/20 underline-offset-8 decoration-2">
                         {post.title}
                      </h3>
                      <p className="text-zinc-500 font-mono text-[13px] mb-8 leading-relaxed max-w-3xl">
                         {"> "}{post.content}
                      </p>
                      
                      <div className="flex gap-3 mb-10 overflow-hidden">
                         {post.tags.map(t => (
                           <span key={t} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 group-hover:border-white/10 transition-colors uppercase tracking-tight">{t}</span>
                         ))}
                      </div>

                      <div className="flex items-center gap-8 pt-8 border-t border-white/5 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-600">
                         <button className="flex items-center gap-2 hover:text-red-500 transition-colors outline-none"><Heart size={16} /> SYNC_{post.metrics.likes}</button>
                         <button className="flex items-center gap-2 hover:text-brand-blue transition-colors outline-none"><MessageSquare size={16} /> LOG_{post.metrics.comments}</button>
                         <button className="flex items-center gap-2 hover:text-indigo-400 transition-colors outline-none"><Share2 size={16} /> ROUTE_{post.metrics.shares}</button>
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="cluster"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="h-full flex flex-col tech-card p-0 bg-transparent border-none overflow-hidden"
            >
               {/* Cluster Header */}
               <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-between mb-6">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex items-center justify-center text-brand-blue shadow-inner">
                        <Terminal size={24} />
                     </div>
                     <div>
                        <h4 className="text-2xl font-display font-black text-white italic tracking-tighter uppercase">Cluster_Session: {CHANNELS.find(c => c.id === activeChannel).name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase tracking-widest mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Channel_Operational: High_Prio
                        </div>
                     </div>
                  </div>
                  <Users size={24} className="text-zinc-700" />
               </div>

               {/* Mock Chat Stream */}
               <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar p-6 bg-black/20 border border-white/5 rounded-3xl relative mb-6 custom-scrollbar">
                  <div className="absolute inset-0 bg-grid-white opacity-[0.01] pointer-events-none" />
                  
                  <div className="flex flex-col gap-8 relative z-10">
                     {[1,2,3].map(i => (
                        <div key={i} className={cn("flex flex-col gap-2 max-w-[80%]", i % 2 === 0 ? 'self-end items-end' : 'self-start items-start')}>
                           <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-widest">Unit_0{i}_Node</span>
                              <span className="text-[8px] font-mono text-zinc-700 uppercase">{12+i}:0{i}_UTC</span>
                           </div>
                           <div className={cn("p-6 rounded-3xl font-mono text-[13px] leading-relaxed", i % 2 === 0 ? 'bg-brand-blue text-white rounded-tr-sm italic font-bold shadow-xl shadow-brand-blue/10 border-none' : 'bg-zinc-900 text-zinc-400 rounded-tl-sm border border-white/5 group hover:border-white/10 transition-colors')}>
                              {i % 2 === 0 
                                ? "{ System_Status: 'Optimized', Syllabus_Version: '2.5.1', Priority: 'CRITICAL' }" 
                                : `[Protocol_Update]: Initializing Manim cluster for ${i}x deep_learning visualization. Expected latency: 12ms.`
                              }
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Chat Input */}
               <div className="p-6 bg-black/60 border border-white/5 rounded-2xl flex gap-6 items-center focus-within:border-brand-blue/30 transition-all">
                  <button className="text-zinc-600 hover:text-brand-blue transition-colors outline-none"><Paperclip size={20}/></button>
                  <input 
                    type="text" 
                    placeholder="Input_Stream_Signal..." 
                    className="flex-1 bg-transparent border-none outline-none text-[15px] font-mono text-white placeholder-zinc-700"
                  />
                  <div className="flex items-center gap-4">
                     <TrendingUp size={20} className="text-zinc-800" />
                     <button className="bg-brand-blue hover:bg-brand-darkBlue text-white p-3 rounded-xl shadow-xl shadow-brand-blue/20 transition-all outline-none">
                        <Send size={20} />
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
