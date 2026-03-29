import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Heart, Share2, TrendingUp, Users, Award, Zap, ChevronRight, User } from 'lucide-react';

const MOCK_POSTS = [
  {
    id: 1,
    author: { name: 'Sarah Chen', role: 'Machine Learning Engineer', avatar: 'S' },
    timeAgo: '2 hours ago',
    title: 'Just finished building a 10-module Quantum Computing course!',
    content: 'The new Manim integration is absolutely mind-blowing. I was able to generate complex visual representations of quantum superposition states in seconds. Highly recommend checking out my syllabus.',
    likes: 342,
    comments: 45,
    tags: ['Quantum Computing', 'Physics', 'Showcase']
  },
  {
    id: 2,
    author: { name: 'Alex Rivera', role: 'Full Stack Student', avatar: 'A' },
    timeAgo: '5 hours ago',
    title: 'How do you handle prompt optimization for advanced math?',
    content: 'Whenever I try to generate Calculus III content, the AI gets a bit generic. What specific prompt templates are you all using to ensure rigorous mathematical proofs in the generated lessons?',
    likes: 128,
    comments: 23,
    tags: ['Prompt Engineering', 'Mathematics', 'Help']
  },
  {
    id: 3,
    author: { name: 'Dr. Emily Watson', role: 'Professor of Neuroscience', avatar: 'E' },
    timeAgo: '1 day ago',
    title: 'My top 5 tips for structuring medical learning paths',
    content: 'I have been using CourseCraft to augment my university lectures. The key is to start with high-level structural prompts before diving into specific anatomical mechanics...',
    likes: 890,
    comments: 112,
    tags: ['Neuroscience', 'Best Practices', 'Education']
  }
];

const LEADERBOARD = [
  { rank: 1, name: 'David Kim', points: 12500, courses: 42, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
  { rank: 2, name: 'Sarah Chen', points: 10800, courses: 35, icon: Zap, color: 'text-slate-400', bg: 'bg-slate-100' },
  { rank: 3, name: 'Michael Ross', points: 9200, courses: 28, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-50' }
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Trending');

  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 mb-2">Community Hall</h1>
          <p className="text-slate-500 font-medium text-lg">Connect, share, and learn with thousands of AI educators.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.2)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
          <MessageSquare size={18} />
          New Discussion
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Main Feed */}
        <div className="flex-1">
          {/* Tabs & Search */}
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3 mb-8">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-r border-slate-100 pr-3">
              {['Trending', 'Recent', 'Following'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[14px] font-bold px-5 py-2.5 rounded-xl whitespace-nowrap transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl focus-within:border-brand-blue/30 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="bg-transparent border-none outline-none text-slate-900 w-full text-[14px] font-medium placeholder-slate-400"
              />
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {MOCK_POSTS.map((post, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                key={post.id} 
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-blue to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {post.author.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">{post.author.name}</h4>
                      <p className="text-[13px] font-medium text-slate-500">{post.author.role} • {post.timeAgo}</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-display font-bold text-xl text-slate-900 mb-3 leading-snug tracking-tight">{post.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">{post.content}</p>
                
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-5 border-t border-slate-100 text-slate-500 font-semibold mb-1">
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                    <Heart size={18} /> <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                    <MessageSquare size={18} /> <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-slate-900 transition-colors ml-auto">
                    <Share2 size={18} /> <span>Share</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-[350px] space-y-8 relative z-10 w-full">
          
          {/* Top Creators Leaderboard */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                <Award className="text-brand-blue" /> Top Creators
              </h3>
              <button className="text-brand-blue text-sm font-bold hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              {LEADERBOARD.map((user, i) => {
                 const Icon = user.icon;
                 return (
                  <div key={user.rank} className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${user.bg} ${user.color}`}>
                      #{user.rank}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors text-sm">{user.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{user.courses} courses created</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 text-sm">{user.points.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Points</p>
                    </div>
                  </div>
                 )
              })}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="font-display font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-500" /> Trending Topics
             </h3>
             <div className="flex flex-wrap gap-2">
                {['#PromptEngineering', '#ManimRenders', '#Web3Security', '#AdvancedCalculus', '#UIUXPatterns'].map(tag => (
                  <span key={tag} className="bg-blue-50/50 hover:bg-blue-100 text-brand-blue border border-blue-100 px-3 py-1.5 rounded-xl text-sm font-bold cursor-pointer transition-colors block">
                    {tag}
                  </span>
                ))}
             </div>
          </div>

        </aside>
      </div>

    </div>
  );
}
