import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Search, Filter, BookMarked, Clock, Star, PlusCircle, ChevronRight, Sparkles } from 'lucide-react';

const SAMPLE_COURSES = [
  { id: 1, title: 'Intro to 3D Design', category: 'Design', lessons: 12, progress: 65, color: '#36A8FA', rating: 4.8, duration: '6h 30m', status: 'in-progress' },
  { id: 2, title: 'Robotics Workshop', category: 'Tech & AI', lessons: 8, progress: 20, color: '#FA8771', rating: 4.6, duration: '4h 15m', status: 'in-progress' },
  { id: 3, title: 'Color Theory Pro', category: 'Digital Arts', lessons: 16, progress: 90, color: '#F6B45A', rating: 4.9, duration: '8h 00m', status: 'in-progress' },
  { id: 4, title: 'Machine Learning Basics', category: 'Tech & AI', lessons: 20, progress: 0, color: '#7C4DFF', rating: 4.7, duration: '10h 30m', status: 'not-started' },
  { id: 5, title: 'Narrative Design', category: 'Storytelling', lessons: 10, progress: 100, color: '#26A69A', rating: 5.0, duration: '5h 00m', status: 'completed' },
  { id: 6, title: 'Advanced Python', category: 'Tech & AI', lessons: 24, progress: 0, color: '#EC407A', rating: 4.5, duration: '12h 00m', status: 'not-started' },
];

const TABS = ['All', 'In Progress', 'Completed', 'Not Started'];
const CATEGORIES = ['All', 'Tech & AI', 'Design', 'Digital Arts', 'Storytelling'];

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = SAMPLE_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All'
      || (activeTab === 'In Progress' && course.status === 'in-progress')
      || (activeTab === 'Completed' && course.status === 'completed')
      || (activeTab === 'Not Started' && course.status === 'not-started');
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesTab && matchesCategory;
  });

  return (
    <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-extrabold tracking-tight text-brand-text mb-1">My Courses</h1>
          <p className="text-brand-muted font-medium">All your learning blocks in one place</p>
        </div>
        <Link to="/build" className="flex items-center gap-2 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold py-3.5 px-7 rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.35)] transition-all hover:-translate-y-0.5">
          <PlusCircle size={18} />
          New Course
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-border mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-[#F7F4EE] px-5 py-3 rounded-full">
          <Search size={17} className="text-brand-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-brand-text w-full text-sm font-medium placeholder-brand-muted/60"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-bold px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-brand-darkBlue text-white shadow-sm' : 'bg-[#F7F4EE] text-brand-muted hover:text-brand-text'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold px-6 py-3 rounded-full whitespace-nowrap transition-all ${activeTab === tab ? 'bg-brand-blue text-white shadow-[0_4px_14px_rgba(22,129,208,0.3)]' : 'bg-white text-brand-muted border border-border hover:border-brand-blue/30'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* AI Generate Prompt Banner */}
      <div className="bg-gradient-to-r from-brand-peach to-[#FDF5F0] rounded-4xl px-8 py-6 mb-8 flex items-center gap-5 border border-white shadow-sm">
        <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-lg text-brand-text">Discover something new</h3>
          <p className="text-brand-muted text-sm">Let AI build you a personalized course on any topic.</p>
        </div>
        <Link to="/build" className="flex-shrink-0 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold py-3 px-6 rounded-full text-sm transition-colors shadow-sm">
          Generate
        </Link>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-6">🎮</p>
          <h3 className="font-display font-bold text-2xl text-brand-text mb-2">No courses found</h3>
          <p className="text-brand-muted mb-6">Try a different filter or create a new course.</p>
          <Link to="/build" className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full">Generate a Course</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(course => (
            <Link key={course.id} to={`/course/${course.id}`} className="group block">
              <div className="bg-white p-7 rounded-5xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all border border-transparent hover:border-white/80 cursor-pointer">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-[1.1rem] flex items-center justify-center shadow-sm text-white transform group-hover:-translate-y-1 transition-transform" style={{ backgroundColor: course.color }}>
                    <BookMarked size={24} />
                  </div>
                  <div className="flex items-center gap-1 bg-[#F7F4EE] px-3 py-1.5 rounded-full">
                    <Star size={12} className="text-brand-yellow fill-brand-yellow" />
                    <span className="text-xs font-extrabold text-brand-text">{course.rating}</span>
                  </div>
                </div>
                
                <div className="mb-1">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: course.color }}>{course.category}</span>
                </div>
                <h3 className="font-display font-bold text-xl tracking-tight text-brand-text mb-4">{course.title}</h3>
                
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-brand-muted font-semibold">Progress</span>
                      <span className="text-xs font-extrabold" style={{ color: course.color }}>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#F0ECE6] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, backgroundColor: course.color }}></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-[#F0ECE6] pt-4">
                  <div className="flex items-center gap-4 text-brand-muted text-xs font-semibold">
                    <span className="flex items-center gap-1"><BookMarked size={12} />{course.lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${course.color}22`, color: course.color }}>
                    {course.status === 'completed'
                      ? <ChevronRight size={16} strokeWidth={3} />
                      : <Play size={13} fill="currentColor" />
                    }
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
