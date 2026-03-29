import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, BookOpen, PlusCircle, ChevronRight,
  Star, Clock, Loader, Filter, BarChart2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { listUserCourses } from '../services/api';
import { cn } from '../lib/utils';

const TABS = ['All', 'In Progress', 'Completed', 'New'];
const CATEGORIES = ['All Topics', 'AI & ML', 'Computer Science', 'Mathematics', 'Engineering', 'Arts'];

const CARD_COLORS = [
  'bg-brand-green text-white',
  'bg-accent-blue text-white',
  'bg-accent-purple text-white',
  'bg-accent-amber text-white',
];

export default function CoursesPage() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const [category, setCategory] = useState('All Topics');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      if (!currentUser) { setLoading(false); return; }
      try {
        const data = await listUserCourses(currentUser.uid);
        setCourses(data.map(c => ({
          id: c.id,
          title: c.title || c.topic || 'Untitled Course',
          category: c.category || 'AI & ML',
          modules: c.modules?.length || 0,
          progress: c.progress || 0,
          rating: c.rating || 4.8,
          duration: c.duration || '2h 30m',
          status: c.progress === 100 ? 'Completed' : c.progress > 0 ? 'In Progress' : 'New',
        })));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch();
  }, [currentUser]);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'All' || c.status === tab;
    const matchCat = category === 'All Topics' || c.category === category;
    return matchSearch && matchTab && matchCat;
  });

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-app-fg">My Courses</h1>
          <p className="text-sm text-app-muted mt-0.5">Browse and manage your learning library</p>
        </div>
        <Link to="/build" className="btn-brand text-sm self-start sm:self-auto">
          <PlusCircle size={16} /> New Course
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2.5 bg-app-surface2 border border-app-border rounded-xl px-3.5 py-2.5 focus-within:border-brand-green/40 focus-within:ring-2 focus-within:ring-brand-green/10 transition-all">
          <Search size={16} className="text-app-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-app-fg placeholder:text-app-muted w-full font-medium"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter size={15} className="text-app-muted flex-shrink-0 ml-1" />
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'whitespace-nowrap text-xs font-semibold px-3.5 py-2 rounded-lg transition-all',
                category === cat
                  ? 'bg-brand-green text-white shadow-brand'
                  : 'bg-app-surface2 border border-app-border text-app-muted hover:border-app-border2 hover:text-app-fg'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-app-surface2 border border-app-border p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'text-sm font-medium px-4 py-1.5 rounded-lg transition-all',
              tab === t
                ? 'bg-app-surface text-app-fg shadow-card font-semibold'
                : 'text-app-muted hover:text-app-fg'
            )}
          >
            {t}
            {t !== 'All' && (
              <span className={cn(
                'ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold',
                tab === t ? 'bg-brand-green text-white' : 'bg-app-border text-app-muted'
              )}>
                {courses.filter(c => c.status === t).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-app-muted">
          <Loader size={22} className="animate-spin text-brand-green" />
          <span className="text-sm font-medium">Loading your courses...</span>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-green-lighter flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-brand-green" />
              </div>
              <h3 className="text-lg font-semibold text-app-fg mb-1">No courses found</h3>
              <p className="text-sm text-app-muted mb-5 max-w-xs">
                {search ? `No results for "${search}"` : 'You haven\'t created any courses yet. Get started!'}
              </p>
              <Link to="/build" className="btn-brand text-sm">
                <PlusCircle size={15} /> Create Course
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((course, i) => (
                <motion.div
                  layout key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                >
                  <Link to={`/course/${course.id}`} className="card-hover flex flex-col p-5 group h-full block">
                    {/* Colored top accent */}
                    <div className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-lg font-bold shadow-sm',
                      CARD_COLORS[i % CARD_COLORS.length]
                    )}>
                      {course.title[0].toUpperCase()}
                    </div>

                    <div className="mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-app-muted">
                        {course.category}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-app-fg mb-3 leading-snug group-hover:text-brand-green transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Meta row */}
                    <div className="flex items-center gap-3 text-xs text-app-muted mb-4">
                      <span className="flex items-center gap-1">
                        <BarChart2 size={13} /> {course.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        {course.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Progress */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-app-muted">Progress</span>
                          <span className="text-xs font-semibold text-brand-green">{course.progress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-app-border">
                      <span className={cn(
                        'badge',
                        course.status === 'Completed' ? 'badge-green' :
                        course.status === 'In Progress' ? 'badge-blue' : 'badge-amber'
                      )}>
                        {course.status === 'In Progress' && <Zap size={10} />}
                        {course.status}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-app-surface2 border border-app-border flex items-center justify-center text-app-muted group-hover:bg-brand-green group-hover:border-brand-green group-hover:text-white transition-all">
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
