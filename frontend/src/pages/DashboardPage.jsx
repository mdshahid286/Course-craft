import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, ArrowUpRight, BookOpen, Target, Zap,
  Clock, TrendingUp, Sparkles, ChevronRight,
  Rocket, BarChart2, CheckCircle, Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { listUserCourses } from '../services/api';
import { cn } from '../lib/utils';

const WEEK_BARS = [
  { day: 'S', h: 35 },
  { day: 'M', h: 65 },
  { day: 'T', h: 48 },
  { day: 'W', h: 90, active: true },
  { day: 'T', h: 72, active: true },
  { day: 'F', h: 55 },
  { day: 'S', h: 28 },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 14 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: i * 0.07 } }),
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    async function fetch() {
      console.log('DashboardPage Debug - currentUser:', currentUser);
      if (!currentUser) {
        console.log('DashboardPage Debug - No current user, returning');
        setLoading(false);
        return;
      }
      try {
        console.log('DashboardPage Debug - Fetching courses for user:', currentUser.uid);
        const all = await listUserCourses(currentUser.uid);
        console.log('DashboardPage Debug - Courses fetched:', all);
        setCourses(all.slice(0, 3));
      } catch (e) {
        console.error('DashboardPage Debug - Error fetching courses:', e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [currentUser]);

  const handleCreate = (e) => {
    e.preventDefault();
    navigate('/build', topic.trim() ? { state: { initialQuery: topic } } : {});
  };

  const firstName = currentUser?.displayName?.split(' ')[0] || 'there';

  const STATS = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      accent: 'bg-brand-green text-white',
      note: 'In your library',
      primary: true,
    },
    {
      label: 'Completed',
      value: courses.filter(c => c.progress === 100).length,
      icon: CheckCircle,
      accent: 'bg-app-surface2',
      note: 'Finished courses',
    },
    {
      label: 'In Progress',
      value: courses.filter(c => c.progress > 0 && c.progress < 100).length,
      icon: Zap,
      accent: 'bg-app-surface2',
      note: 'Keep going!',
    },
    {
      label: 'Study Streak',
      value: '7 Days',
      icon: TrendingUp,
      accent: 'bg-app-surface2',
      note: 'Personal best',
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-8">

      {/* ── Page header ── */}
      <motion.div
        initial="hidden" animate="show" variants={FADE_UP} custom={0}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display font-bold text-app-fg">
            Dashboard
          </h1>
          <p className="text-sm text-app-muted mt-0.5">
            Welcome back, {firstName} 👋 — plan, build and track your courses.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Link to="/build" className="btn-brand text-sm">
            <Plus size={16} /> Add Course
          </Link>
          <Link to="/courses" className="btn-outline text-sm">
            Import Data
          </Link>
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial="hidden" animate="show" variants={FADE_UP} custom={i + 1}
              className={cn(
                'stat-card relative overflow-hidden',
                stat.primary && 'bg-brand-green text-white border-brand-green'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <p className={cn('text-sm font-medium', stat.primary ? 'text-white/80' : 'text-app-muted')}>
                  {stat.label}
                </p>
                <button className={cn(
                  'w-7 h-7 rounded-full border flex items-center justify-center transition-colors',
                  stat.primary
                    ? 'border-white/20 text-white/70 hover:bg-white/10'
                    : 'border-app-border text-app-muted hover:bg-app-surface2'
                )}>
                  <ArrowUpRight size={13} />
                </button>
              </div>
              <p className={cn('text-3xl font-display font-bold mb-1', stat.primary ? 'text-white' : 'text-app-fg')}>
                {stat.value}
              </p>
              <p className={cn('text-xs', stat.primary ? 'text-brand-green-muted' : 'text-app-muted')}>
                {stat.primary && <span className="inline-flex items-center gap-1 text-green-300 font-medium mr-1">↑ Active</span>}
                {stat.note}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Middle row ─ Analytics + Quick Create ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Project Analytics chart */}
        <motion.div
          initial="hidden" animate="show" variants={FADE_UP} custom={5}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-app-fg">Study Analytics</h2>
              <p className="text-xs text-app-muted mt-0.5">Weekly learning hours</p>
            </div>
            <div className="flex gap-1.5 p-1 bg-app-surface2 border border-app-border rounded-xl">
              {['Week', 'Month', 'Year'].map(t => (
                <button key={t} className={cn(
                  'text-xs font-medium px-3 py-1.5 rounded-lg transition-all',
                  t === 'Week' ? 'bg-app-surface shadow-card text-app-fg' : 'text-app-muted hover:text-app-fg'
                )}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end justify-between gap-3 h-36 px-2">
            {WEEK_BARS.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.h}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: 'backOut' }}
                    className={cn(
                      'w-full rounded-t-lg transition-all group-hover:opacity-80',
                      bar.active
                        ? 'bg-brand-green shadow-brand'
                        : 'bg-gray-100 group-hover:bg-brand-green/20',
                      'relative overflow-hidden'
                    )}
                  >
                    {bar.active && (
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark/20 to-transparent" />
                    )}
                    {/* Striped pattern for inactive */}
                    {!bar.active && (
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, #9CA3AF 0, #9CA3AF 1px, transparent 0, transparent 50%)',
                          backgroundSize: '6px 6px'
                        }}
                      />
                    )}
                  </motion.div>
                </div>
                <span className="text-xs text-app-muted font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Create Panel */}
        <motion.div
          initial="hidden" animate="show" variants={FADE_UP} custom={6}
          className="card p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-brand-green" />
            <h2 className="text-base font-semibold text-app-fg">AI Course Builder</h2>
          </div>
          <p className="text-xs text-app-muted mb-5">Enter a topic and we'll generate a full course with lessons, quizzes, and videos.</p>

          <form onSubmit={handleCreate} className="flex-1 flex flex-col gap-3">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Quantum Computing Basics"
              className="input text-sm"
            />
            <button type="submit" className="btn-brand justify-center w-full text-sm">
              <Rocket size={15} /> Generate Course
            </button>
          </form>

          {/* Suggestions */}
          <div className="mt-5 pt-5 border-t border-app-border">
            <p className="text-xs text-app-muted mb-2 font-medium">Trending topics</p>
            <div className="flex flex-wrap gap-1.5">
              {['Machine Learning', 'Web3', 'Python', 'Calculus'].map(s => (
                <button
                  key={s}
                  onClick={() => setTopic(s)}
                  className="badge bg-app-surface2 border border-app-border text-app-muted hover:bg-brand-green-lighter hover:text-brand-green hover:border-brand-green/20 transition-all text-[11px] font-medium px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom row ─ Recent courses + Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent courses */}
        <motion.div
          initial="hidden" animate="show" variants={FADE_UP} custom={7}
          className="lg:col-span-2 card overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-app-border">
            <h2 className="text-base font-semibold text-app-fg">Recent Courses</h2>
            <Link to="/courses" className="btn-ghost text-xs gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-app-muted">
              <Loader size={20} className="animate-spin text-brand-green" />
              <span className="text-sm">Loading courses...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-green-lighter flex items-center justify-center mb-2">
                <BookOpen size={26} className="text-brand-green" />
              </div>
              <p className="font-semibold text-app-fg">No courses yet</p>
              <p className="text-sm text-app-muted max-w-xs">Start by building your first AI-powered course in seconds.</p>
              <Link to="/build" className="btn-brand text-sm mt-2">
                <Plus size={15} /> Create First Course
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-app-border">
              {courses.map((course, i) => (
                <Link
                  key={course.id || i}
                  to={`/course/${course.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-app-surface2 transition-colors group"
                >
                  {/* Color avatar */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm',
                    ['bg-brand-green', 'bg-accent-blue', 'bg-accent-purple'][i % 3]
                  )}>
                    {(course.title || course.topic || 'C')[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-app-fg truncate group-hover:text-brand-green transition-colors">
                      {course.title || course.topic || 'Untitled Course'}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 progress-track max-w-[120px]">
                        <div className="progress-fill" style={{ width: `${course.progress || 0}%` }} />
                      </div>
                      <span className="text-xs text-app-muted">{course.progress || 0}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'badge',
                      course.progress === 100 ? 'badge-green' : course.progress > 0 ? 'badge-blue' : 'badge-amber'
                    )}>
                      {course.progress === 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'New'}
                    </span>
                    <ChevronRight size={15} className="text-app-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Project Progress ring + stats */}
        <motion.div
          initial="hidden" animate="show" variants={FADE_UP} custom={8}
          className="space-y-4"
        >
          {/* Progress ring card */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-app-fg mb-4">Overall Progress</h2>

            {/* SVG ring */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  <motion.circle
                    cx="60" cy="60" r="50"
                    fill="none" stroke="#16663A" strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - 0.41) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-display font-bold text-app-fg">41%</span>
                  <span className="text-xs text-app-muted">Overall</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { label: 'Completed', color: 'bg-brand-green', pct: 41 },
                { label: 'In Progress', color: 'bg-accent-blue', pct: 35 },
                { label: 'Not Started', color: 'bg-gray-200', pct: 24, stripe: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <div className={cn('w-2.5 h-2.5 rounded-sm flex-shrink-0', item.color)} />
                  <span className="text-app-muted flex-1">{item.label}</span>
                  <span className="font-semibold text-app-fg">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="card p-5 bg-brand-green text-white">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 size={16} className="text-white/80" />
              <p className="text-sm font-semibold">This Week</p>
            </div>
            <p className="text-3xl font-bold mb-1">4.2 hrs</p>
            <p className="text-xs text-brand-green-muted">↑ 18% from last week</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-brand-green-muted">Streak</span>
              <span className="text-sm font-bold text-white">🔥 7 days</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
