import React from 'react';
import {
  TrendingUp, Users, Clock, Star,
  ArrowUpRight, BarChart2, Zap, Target,
  Calendar, ChevronRight, Activity, Brain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const STATS = [
  { label: 'Weekly Study Time', value: '12.4 hrs', change: '+18%', icon: Clock, color: 'text-brand-green', bg: 'bg-brand-green-lighter' },
  { label: 'Courses Completed', value: '4', change: '+1', icon: Target, color: 'text-accent-blue', bg: 'bg-blue-50' },
  { label: 'Average Quiz Score', value: '92%', change: '+3%', icon: Brain, color: 'text-accent-purple', bg: 'bg-purple-50' },
  { label: 'Learning Streak', value: '14 Days', change: 'Personal Best', icon: Zap, color: 'text-accent-amber', bg: 'bg-amber-50' },
];

const WEEK_DATA = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.3 },
  { day: 'Wed', hours: 0.8 },
  { day: 'Thu', hours: 3.2, active: true },
  { day: 'Fri', hours: 2.1 },
  { day: 'Sat', hours: 1.2 },
  { day: 'Sun', hours: 0.5 },
];

const SKILLS = [
  { name: 'Quantum Physics', level: 85, color: 'bg-brand-green' },
  { name: 'Machine Learning', level: 72, color: 'bg-accent-blue' },
  { name: 'Linear Algebra', level: 94, color: 'bg-accent-purple' },
  { name: 'Orbital Mechanics', level: 56, color: 'bg-accent-amber' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-app-fg">Learning Analytics</h1>
          <p className="text-sm text-app-muted mt-0.5">Track your progress, skills, and learning goals.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm py-2">
            <Calendar size={15} /> Last 7 Days
          </button>
          <button className="btn-brand text-sm py-2">
             Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <button className="text-app-muted hover:text-app-fg transition-colors">
                <ArrowUpRight size={16} />
              </button>
            </div>
            <p className="text-sm font-medium text-app-muted mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-display font-bold text-app-fg">{stat.value}</p>
              <span className={cn('text-xs font-semibold mb-1', stat.change.startsWith('+') ? 'text-brand-green' : 'text-app-muted')}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Study Activity Chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-semibold text-app-fg">Study Activity</h2>
              <p className="text-xs text-app-muted mt-0.5">Daily hours spent learning</p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-4 h-48 px-2">
            {WEEK_DATA.map((bar, i) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(bar.hours / 4) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: 'circOut' }}
                    className={cn(
                      'w-full rounded-t-lg transition-all relative overflow-hidden',
                      bar.active ? 'bg-brand-green shadow-brand' : 'bg-gray-100 group-hover:bg-brand-green/20'
                    )}
                  >
                    {!bar.active && (
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
                          backgroundSize: '8px 8px'
                        }}
                      />
                    )}
                  </motion.div>
                </div>
                <span className="text-xs font-medium text-app-muted">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Matrix */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-app-fg mb-1">Skill Matrix</h2>
          <p className="text-xs text-app-muted mb-6">Mastery across top subjects</p>

          <div className="space-y-6">
            {SKILLS.map(skill => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-app-fg">{skill.name}</span>
                  <span className="text-xs font-bold text-app-muted">{skill.level}%</span>
                </div>
                <div className="progress-track h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={cn('h-full rounded-full', skill.color)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-app-border">
            <button className="w-full btn-outline text-xs justify-center py-2.5">
              View Detailed Breakdown
            </button>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-app-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-app-fg">Recent Milestones</h2>
          <button className="btn-ghost text-xs">View History</button>
        </div>
        <div className="divide-y divide-app-border">
          {[
            { title: 'Passed Final Exam', sub: 'Quantum Cryptography', time: '2 hours ago', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
            { title: '7-Day Streak Achieved', sub: 'Consistent Learning', time: '1 day ago', icon: Zap, color: 'text-brand-green', bg: 'bg-brand-green-lighter' },
            { title: 'New Course Started', sub: 'Neural Networks & Deep Learning', time: '2 days ago', icon: BarChart2, color: 'text-accent-blue', bg: 'bg-blue-50' },
            { title: 'Mastery Level Reached', sub: 'Fluid Dynamics Phase 1', time: '3 days ago', icon: Target, color: 'text-accent-purple', bg: 'bg-purple-50' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-5 hover:bg-app-surface2 transition-colors cursor-pointer group">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>
                <item.icon size={18} className={item.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-app-fg">{item.title}</p>
                <p className="text-xs text-app-muted mt-0.5">{item.sub}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-app-muted">{item.time}</p>
                <ChevronRight size={14} className="ml-auto mt-1 text-app-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
