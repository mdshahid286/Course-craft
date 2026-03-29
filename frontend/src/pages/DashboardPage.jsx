import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Search, Laptop, BookOpen, PenTool, BookMarked, ArrowRight, Video, FileText, Code, Layers, Sparkles, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { listUserCourses } from '../services/api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTopic, setSearchTopic] = useState('');

  useEffect(() => {
    async function fetchRecent() {
      if (!currentUser) return;
      try {
        const all = await listUserCourses(currentUser.uid);
        // Sort by updatedAt or simply take last 2
        setCourses(all.slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch recent courses', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, [currentUser]);

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (searchTopic.trim()) {
      navigate('/build', { state: { initialQuery: searchTopic } });
    } else {
      navigate('/build');
    }
  };

  return (
    <div className="px-6 md:px-10 pb-12 w-full max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Modern, Clean Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
      >
        {/* Soft elegant background decorations */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 opacity-60 pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 max-w-xl">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-bold text-slate-900 mb-4 leading-[1.15] tracking-tight">
              What do you want to <span className="text-brand-blue">learn today?</span>
            </h2>
            <p className="text-slate-500 text-lg mb-8">
              Generate a complete course with interactive animations in seconds.
            </p>
            
            <form onSubmit={handleQuickCreate} className="flex items-center bg-white border border-slate-200 p-1.5 pl-6 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-brand-blue/20 focus-within:border-brand-blue transition-all">
              <Sparkles size={20} className="text-brand-blue mr-3" />
              <input 
                type="text" 
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="e.g. History of Rome..." 
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-900 font-medium placeholder-slate-400"
              />
              <button type="submit" className="bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 transition-colors ml-2 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                Generate <ArrowRight size={18} />
              </button>
            </form>
          </div>
          
          <div className="hidden lg:block relative">
             <div className="w-64 h-64 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-6 shadow-sm transform rotate-3 flex flex-col gap-4 group">
                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform"><BookMarked size={20}/></div>
                 <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                 <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                 <div className="mt-auto h-12 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center px-4"><div className="w-6 h-6 rounded-full bg-emerald-100 mr-2 animate-pulse"></div><div className="h-2 bg-slate-100 rounded-full w-full"></div></div>
             </div>
          </div>
        </div>
      </motion.section>

      {/* Grid containing Courses and Stats */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div className="md:col-span-3 lg:col-span-4 flex justify-between items-end mb-1 pt-4 px-1">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">Recent Courses</h3>
          </div>
          <Link to="/courses" className="text-brand-blue font-semibold text-sm flex items-center gap-1 hover:text-blue-700 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="md:col-span-2 flex items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl border-dashed">
            <Loader size={24} className="text-brand-blue animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="md:col-span-2 flex flex-col items-center justify-center p-10 bg-white border border-slate-200 rounded-3xl border-dashed text-center">
            <Sparkles size={32} className="text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium mb-4">No generated courses yet.</p>
            <Link to="/build" className="text-brand-blue font-bold hover:underline">Start Creating</Link>
          </div>
        ) : (
          courses.map((course, idx) => (
            <motion.div key={course.id} variants={itemVariants}>
              <Link to={`/course/${course.id}`} className="block bg-white border border-slate-200/60 p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 transition-all h-full group">
                <div className={`mb-5 w-12 h-12 rounded-[1rem] flex items-center justify-center group-hover:scale-110 transition-transform ${idx === 0 ? 'bg-blue-50 text-brand-blue' : 'bg-emerald-50 text-emerald-500'}`}>
                  {idx === 0 ? <Code size={22} strokeWidth={2.5}/> : <Laptop size={22} strokeWidth={2.5}/>}
                </div>
                <h4 className="font-display font-bold text-[1.1rem] text-slate-900 mb-3 leading-snug truncate">
                  {course.title || course.topic || 'Untitled'}
                </h4>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-brand-blue' : 'bg-emerald-500'}`} 
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-bold ${idx === 0 ? 'text-brand-blue' : 'text-emerald-500'}`}>
                    {course.progress || 0}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2 mt-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Video size={14}/> {course.modules?.length || 0} Chapters
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors ${idx === 0 ? 'group-hover:bg-brand-blue' : 'group-hover:bg-emerald-500'}`}>
                    <Play size={12} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}

        {/* Stats Card */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl border border-slate-200/60 p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col relative overflow-hidden group min-h-[220px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-1">Learning Activity</h3>
              <p className="text-slate-500 text-sm">Modules completed this week</p>
            </div>
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
              +342 XP
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between px-2 pt-6 mt-auto h-[100px]">
            {[
              { label: 'MON', h: '40%', color: 'bg-slate-200' },
              { label: 'TUE', h: '70%', color: 'bg-slate-200' },
              { label: 'WED', h: '50%', color: 'bg-brand-blue' },
              { label: 'THU', h: '95%', color: 'bg-slate-800' },
              { label: 'FRI', h: '60%', color: 'bg-slate-200' },
              { label: 'SAT', h: '30%', color: 'bg-slate-200' },
              { label: 'SUN', h: '45%', color: 'bg-slate-200' },
            ].map(bar => (
              <div key={bar.label} className="w-8 md:w-10 flex flex-col items-center gap-2 group/bar cursor-pointer">
                <div 
                  className={`w-full ${bar.color} rounded-t-md relative transition-all duration-300 group-hover/bar:bg-indigo-400`}
                  style={{ height: bar.h }}
                ></div>
                <span className="text-[10px] font-bold text-slate-400 group-hover/bar:text-slate-600 transition-colors">{bar.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small Domain Box */}
        <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-4 bg-white rounded-3xl border border-slate-200/60 p-8 flex flex-col mt-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[1.1rem] font-display font-bold text-slate-900">Explore Categories</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Laptop size={18} className="text-indigo-500" />, label: 'Machine Learning', bg: 'bg-indigo-50' },
              { icon: <BookMarked size={18} className="text-orange-500" />, label: 'System Design', bg: 'bg-orange-50' },
              { icon: <Layers size={18} className="text-blue-500" />, label: 'Microservices', bg: 'bg-blue-50' },
            ].map(({ icon, label, bg }) => (
              <Link to="/build" key={label} className="flex items-center justify-between border border-slate-100 px-5 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${bg}`}>{icon}</div>
                  <span className="font-semibold text-[15px] text-slate-700 group-hover:text-slate-900">{label}</span>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Clean Call to action */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
         <div className="absolute right-0 top-0 w-64 h-full bg-brand-blue blur-[100px] opacity-20 pointer-events-none"></div>

         <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
           <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Build faster with the API.</h2>
           <p className="text-slate-400 font-medium max-w-lg text-[15px]">Generate structured syllabi and Manim scripts directly from your own applications.</p>
         </div>
         <button className="relative z-10 bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 px-8 rounded-xl transition-all shadow-md">
           View Documentation
         </button>
      </motion.section>

    </div>
  );
}
