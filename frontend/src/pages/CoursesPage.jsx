import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Search, Filter, BookMarked, Clock, Star, PlusCircle, ChevronRight, Sparkles, Code, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { listUserCourses } from '../services/api';

const TABS = ['All', 'In Progress', 'Completed', 'Not Started'];
const CATEGORIES = ['All', 'Tech & AI', 'Physics & CS', 'Engineering', 'Digital Arts'];

export default function CoursesPage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userCourses = await listUserCourses(currentUser.uid);
        
        // Map backend structure to UI expectations
        const mapped = userCourses.map(c => {
          const lessonCount = c.modules?.reduce((acc, m) => acc + (m.topics?.length || 0), 0) || 0;
          return {
            id: c.id,
            title: c.title || c.topic || 'Untitled Course',
            category: c.category || 'Tech & AI', // Default or fallback
            lessons: lessonCount,
            progress: c.progress || 0,
            color: c.color || '#3B82F6',
            rating: c.rating || 5.0,
            duration: c.duration || '2h 30m',
            status: c.status || (c.progress === 100 ? 'completed' : c.progress > 0 ? 'in-progress' : 'not-started')
          };
        });
        setCourses(mapped);
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [currentUser]);

  const filtered = courses.filter(course => {
    const titleMatch = course.title || '';
    const matchesSearch = titleMatch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All'
      || (activeTab === 'In Progress' && course.status === 'in-progress')
      || (activeTab === 'Completed' && course.status === 'completed')
      || (activeTab === 'Not Started' && course.status === 'not-started');
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesTab && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32 text-center w-full min-h-screen">
        <Loader size={48} className="text-brand-blue animate-spin" />
        <h2 className="text-xl font-display font-medium text-slate-700">Loading your courses...</h2>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto w-full min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 mb-2">My Courses</h1>
          <p className="text-slate-500 font-medium text-lg">Your generated learning paths.</p>
        </div>
        <Link to="/build" className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all">
          <PlusCircle size={18} />
          New Course
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 mb-8">
        
        <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl focus-within:border-brand-blue/30 focus-within:bg-white transition-all">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-900 w-full text-[15px] placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[13px] font-semibold px-4 py-3 rounded-xl whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar border-b border-slate-200 pb-px">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold px-4 py-3 whitespace-nowrap transition-all border-b-2 ${activeTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
             <Code size={24} className="text-slate-400" />
          </div>
          <h3 className="font-display font-bold text-xl text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your filters or create a new one.</p>
          <Link to="/build" className="text-brand-blue font-bold hover:underline">Generate Content</Link>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((course, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={course.id}
              >
                <Link to={`/course/${course.id}`} className="group block h-full">
                  <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer h-full flex flex-col">
                    
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform" style={{ backgroundColor: `${course.color}15` }}>
                        <BookMarked size={20} style={{ color: course.color }} />
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{course.rating}</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-[11px] font-bold uppercase" style={{ color: course.color }}>{course.category}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-4 leading-snug">{course.title}</h3>
                    
                    <div className="mt-auto">
                      {course.progress > 0 && (
                        <div className="mb-5">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Progress</span>
                            <span className="text-[11px] font-bold" style={{ color: course.color }}>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, backgroundColor: course.color }}></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-3 text-slate-500 text-[13px] font-medium">
                          <span className="flex items-center gap-1.5"><BookMarked size={14}/>{course.lessons} chapters</span>
                          <span className="flex items-center gap-1.5"><Clock size={14}/>{course.duration}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                          {course.status === 'completed'
                            ? <ChevronRight size={16} strokeWidth={2.5} />
                            : <Play size={12} fill="currentColor" className="ml-0.5" />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
