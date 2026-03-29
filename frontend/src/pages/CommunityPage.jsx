import React, { useState } from 'react';
import {
  MessageSquare, Heart, Share2, MoreHorizontal,
  Plus, Search, TrendingUp, Users, Hash,
  Award, ChevronRight, Globe, Layers, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const CHANNELS = [
  { id: 'general',    name: 'General Discussion', icon: MessageSquare, count: 124 },
  { id: 'questions',  name: 'Q&A Help',          icon: Users,         count: 56 },
  { id: 'resources',  name: 'Learning Resources', icon: Layers,        count: 82 },
  { id: 'showcase',   name: 'Course Showcase',    icon: Award,         count: 142 },
  { id: 'updates',    name: 'Platform Updates',  icon: Sparkles,      count: 12 },
];

const POSTS = [
  {
    id: 1,
    author: 'David Kim',
    role: 'ML Specialist',
    avatar: 'DK',
    time: '2 hours ago',
    content: "Just finished building a complete course on Neural Networks and Deep Learning! The AI's explanation of backpropagation was spot on. Check it out in the showcase channel.",
    likes: 24,
    comments: 8,
    tags: ['MachineLearning', 'AI', 'Education'],
  },
  {
    id: 2,
    author: 'Sarah Chen',
    role: 'Course Architect',
    avatar: 'SC',
    time: '5 hours ago',
    content: "Does anyone have good Manim scripts for visualizing fluid dynamics? Trying to make an advanced physics course but hitting some hurdles with vector field animations.",
    likes: 12,
    comments: 15,
    tags: ['Physics', 'Manim', 'HelpNeeded'],
  },
  {
    id: 3,
    author: 'Alex Rivera',
    role: 'Self-taught Dev',
    avatar: 'AR',
    time: '1 day ago',
    content: "The new orbital mechanics course is mind-blowing. I finally understand Kepler's laws after 5 years of trying. This platform is a game changer.",
    likes: 42,
    comments: 3,
    tags: ['Space', 'Science', 'Review'],
  },
];

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [search, setSearch] = useState('');

  return (
    <div className="flex h-full overflow-hidden bg-app-bg">

      {/* ── Left Sidebar: Channels ── */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-app-border bg-app-surface">
        <div className="p-5 border-b border-app-border">
           <h2 className="text-sm font-bold text-app-fg uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} className="text-brand-green" /> Community
           </h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
           <p className="section-label">CHANNELS</p>
           {CHANNELS.map(ch => (
             <button
               key={ch.id}
               onClick={() => setActiveChannel(ch.id)}
               className={cn(
                 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
                 activeChannel === ch.id ? 'bg-brand-green-lighter text-brand-green' : 'text-app-muted hover:bg-app-surface2 hover:text-app-fg'
               )}
             >
               <ch.icon size={16} />
               {ch.name}
               <span className="ml-auto text-[10px] font-bold opacity-60 bg-app-border px-1.5 py-0.5 rounded-md">
                 {ch.count}
               </span>
             </button>
           ))}

           <div className="pt-6">
             <p className="section-label">TRENDING HASHTAGS</p>
             <div className="space-y-1 px-1">
               {['#QuantumPhysics', '#Web3Design', '#Mathematics', '#SyllabusGen'].map(tag => (
                 <button key={tag} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-app-muted hover:text-brand-green transition-colors">
                    <Hash size={12} /> {tag.split('#')[1]}
                 </button>
               ))}
             </div>
           </div>
        </div>
      </aside>

      {/* ── Main Feed ── */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-app-bg p-6 lg:p-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Search/Post Header */}
          <div className="card p-5">
             <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white font-bold flex-shrink-0">
                  U
                </div>
                <div className="flex-1 relative">
                   <input
                     type="text"
                     placeholder="Share something with the community..."
                     className="w-full bg-app-surface2 border border-app-border rounded-xl px-4 py-2.5 text-sm h-11 focus:border-brand-green outline-none transition-all pr-10"
                   />
                   <button className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-green">
                      <Plus size={18} />
                   </button>
                </div>
             </div>
             <div className="flex items-center gap-3 justify-end border-t border-app-border pt-4">
                <button className="btn-ghost text-xs gap-1.5"><Layers size={14} /> Media</button>
                <button className="btn-ghost text-xs gap-1.5"><Award size={14} /> Achievement</button>
                <button className="btn-brand text-xs px-5 h-8">Post</button>
             </div>
          </div>

          {/* Feed Filter */}
          <div className="flex items-center justify-between">
             <div className="flex gap-4">
                <button className="text-sm font-bold border-b-2 border-brand-green pb-1 text-app-fg">Newest</button>
                <button className="text-sm font-medium text-app-muted pb-1 border-b-2 border-transparent hover:text-app-fg transition-all">Popular</button>
             </div>
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-app-surface border border-app-border rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:border-brand-green transition-all"
                />
             </div>
          </div>

          {/* Posts list */}
          <div className="space-y-6">
            {POSTS.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-brand-green-lighter border border-brand-green/20 flex items-center justify-center text-brand-green font-bold text-sm">
                      {post.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-app-fg">{post.author}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-app-muted font-medium">
                        <span>{post.role}</span>
                        <span className="w-1 h-1 rounded-full bg-app-border" />
                        <span>{post.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-app-muted hover:text-app-fg">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <p className="text-sm text-app-fg leading-relaxed mb-4">
                  {post.content}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {post.tags.map(tag => (
                    <span key={tag} className="badge bg-app-surface2 border border-app-border text-app-muted text-[10px] py-0.5 px-2">
                       #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-app-border">
                   <button className="flex items-center gap-2 text-app-muted hover:text-rose-500 transition-colors text-xs font-semibold">
                      <Heart size={16} /> {post.likes}
                   </button>
                   <button className="flex items-center gap-2 text-app-muted hover:text-brand-green transition-colors text-xs font-semibold">
                      <MessageSquare size={16} /> {post.comments}
                   </button>
                   <button className="flex items-center gap-2 text-app-muted hover:text-app-fg transition-colors text-xs font-semibold ml-auto">
                      <Share2 size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Right Sidebar: Leaderboard ── */}
      <aside className="hidden xl:flex flex-col w-72 border-l border-app-border bg-app-surface p-6">
        <div className="bg-brand-green rounded-2xl p-5 text-white mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={60} /></div>
           <p className="text-xs font-semibold opacity-70 mb-1">Your Ranking</p>
           <h3 className="text-2xl font-bold mb-1">#42nd</h3>
           <p className="text-[10px] font-medium opacity-60">↑ Top 5% this month</p>
           <button className="w-full mt-4 bg-white/20 hover:bg-white/30 transition-all text-[11px] font-bold py-2 rounded-lg backdrop-blur-md">
              View Stats
           </button>
        </div>

        <div>
           <h3 className="text-xs font-bold text-app-fg uppercase tracking-widest mb-4">Top contributors</h3>
           <div className="space-y-4">
              {[
                { name: 'Sarah L.', score: 1240, color: 'bg-brand-green' },
                { name: 'Marcus D.', score: 980, color: 'bg-accent-blue' },
                { name: 'Elena G.', score: 850, color: 'bg-accent-purple' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                   <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold', c.color)}>
                     {i + 1}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-app-fg truncate">{c.name}</p>
                      <p className="text-[10px] text-app-muted">{c.score} points</p>
                   </div>
                   <ChevronRight size={14} className="text-app-muted" />
                </div>
              ))}
           </div>
           <button className="w-full btn-outline text-[11px] justify-center mt-6 py-2">
              Full Leaderboard
           </button>
        </div>
      </aside>
    </div>
  );
}
