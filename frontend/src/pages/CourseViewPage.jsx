import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play, CheckCircle, BookOpen, Clock, FileText,
  Video, MessageSquare, ChevronRight, ChevronLeft,
  MoreVertical, Share2, Star, Download, PlayCircle, Loader, Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { getCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function CourseViewPage() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [tab, setTab] = useState('content'); // content, notes, resources

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getCourse(courseId, currentUser?.uid);
        setCourse(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetch(courseId);
  }, [courseId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader size={32} className="animate-spin text-brand-green" />
      <p className="text-sm font-medium text-app-muted">Loading course syllabus...</p>
    </div>
  );

  if (!course) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
        <Rocket size={32} className="text-rose-500" />
      </div>
      <h2 className="text-xl font-semibold text-app-fg">Course not found</h2>
      <p className="text-sm text-app-muted mb-6">The course you're looking for doesn't exist or has been removed.</p>
      <Link to="/courses" className="btn-brand">Go back to library</Link>
    </div>
  );

  const currentModule = course.modules?.[activeModule];
  const currentLesson = currentModule?.topics?.[activeLesson] || currentModule?.lessons?.[activeLesson];

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-app-bg">

      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-80 border-r border-app-border bg-app-surface flex flex-col h-full z-10">
        <div className="p-5 border-b border-app-border">
          <div className="flex items-center gap-2 mb-2">
             <Link to="/courses" className="text-app-muted hover:text-app-fg transition-colors">
               <ChevronLeft size={16} />
             </Link>
             <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green">Course Curriculum</span>
          </div>
          <h2 className="text-base font-bold text-app-fg line-clamp-2 leading-snug">
            {course.title || course.topic}
          </h2>
          <div className="flex items-center gap-3 mt-3">
             <div className="flex-1 progress-track">
                <div className="progress-fill" style={{ width: `${course.progress || 0}%` }} />
             </div>
             <span className="text-[10px] font-bold text-app-muted">{course.progress || 0}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {course.modules?.map((mod, mi) => (
            <div key={mi} className="space-y-1">
              <button
                onClick={() => setActiveModule(mi)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all',
                  activeModule === mi ? 'bg-brand-green-lighter text-brand-green' : 'text-app-fg hover:bg-app-surface2'
                )}
              >
                <div className={cn(
                  'w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold',
                  activeModule === mi ? 'bg-brand-green text-white' : 'bg-app-surface2 border border-app-border text-app-muted'
                )}>
                  {mi + 1}
                </div>
                <span className="text-xs font-bold truncate pr-2">{mod.title || mod.name}</span>
                <ChevronRight size={14} className={cn('ml-auto opacity-50', activeModule === mi && 'rotate-90')} />
              </button>

              <AnimatePresence>
                {activeModule === mi && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-0.5 ml-4 pl-4 border-l-2 border-app-border"
                  >
                    {(mod.topics || mod.lessons || []).map((topic, ti) => (
                      <button
                        key={ti}
                        onClick={() => setActiveLesson(ti)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-all',
                          activeLesson === ti ? 'bg-app-surface2 text-brand-green font-semibold' : 'text-app-muted hover:text-app-fg'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0',
                          activeLesson === ti ? 'bg-brand-green text-white shadow-brand' : 'bg-app-border text-transparent'
                        )}>
                          {activeLesson === ti && <Play size={8} fill="currentColor" />}
                        </div>
                        <span className="truncate">{topic.name || topic.title}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-app-border bg-app-surface2">
           <button className="w-full btn-brand text-xs justify-center gap-2">
             <CheckCircle size={14} /> Mark Module as Done
           </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar controls */}
        <div className="h-14 bg-app-surface border-b border-app-border flex items-center px-6 gap-4">
           <div className="flex items-center gap-2 text-xs font-semibold text-app-muted">
              <span>{currentModule?.title || 'Module'}</span>
              <ChevronRight size={12} />
              <span className="text-app-fg">{currentLesson?.name || 'Lesson'}</span>
           </div>
           <div className="ml-auto flex items-center gap-2">
              <button className="btn-ghost text-xs p-2 h-9 w-9 border border-app-border">
                 <MoreVertical size={14} />
              </button>
              <button className="btn-ghost text-xs p-2 h-9 w-9 border border-app-border">
                 <Share2 size={14} />
              </button>
              <button className="btn-outline text-xs px-3 h-9 gap-2">
                 <Star size={14} /> Rate
              </button>
           </div>
        </div>

        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-app-bg">
          <div className="max-w-4xl mx-auto space-y-10">

            {/* Video Placeholder or Manim Animation Player */}
            <div className="aspect-video bg-app-surface border border-app-border rounded-3xl shadow-modal overflow-hidden group relative">
               <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <PlayCircle size={64} className="text-white opacity-40 group-hover:opacity-80 transition-all cursor-pointer group-hover:scale-110" />
                  <div className="absolute bottom-6 left-6 right-6">
                     <p className="text-white font-semibold text-lg drop-shadow-lg">{currentLesson?.name}</p>
                     <p className="text-white/60 text-xs">AI-Engine Render v2.0</p>
                  </div>
               </div>
               <div className="absolute top-4 right-4 flex gap-2">
                  <span className="badge bg-black/40 text-white border-0 backdrop-blur-md">8:24</span>
                  <span className="badge bg-brand-green text-white border-0">HD</span>
               </div>
            </div>

            {/* Content Tabs */}
            <div>
              <div className="flex gap-8 border-b border-app-border mb-6">
                {[
                  { id: 'content', icon: FileText, label: 'Explanations' },
                  { id: 'notes',   icon: MessageSquare, label: 'Notes' },
                  { id: 'resources', icon: Video, label: 'YouTube Resources' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      'flex items-center gap-2 pb-4 text-sm font-medium transition-all relative',
                      tab === t.id ? 'text-brand-green' : 'text-app-muted hover:text-app-fg'
                    )}
                  >
                    <t.icon size={16} />
                    {t.label}
                    {tab === t.id && (
                      <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[300px]">
                {tab === 'content' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-slate max-w-none text-app-fg">
                    <ReactMarkdown className="markdown-content">
                      {currentLesson?.explanation || 'No content generated for this lesson yet.'}
                    </ReactMarkdown>
                  </motion.div>
                )}

                {tab === 'notes' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="card p-5 bg-app-surface2 border-brand-green/20">
                      <p className="text-xs font-semibold text-brand-green mb-2 uppercase tracking-wider">AI Insight</p>
                      <p className="text-sm text-app-fg leading-relaxed">
                        The key principle here is understanding the relationship between the observer and the observed system. In quantum mechanics, this is fundamental.
                      </p>
                    </div>
                    <textarea
                      placeholder="Type your notes here... (Automatic cloud sync)"
                      className="w-full bg-app-surface border border-app-border rounded-2xl p-5 text-sm outline-none focus:border-brand-green transition-all shadow-sm resize-none h-44"
                    />
                    <div className="flex justify-end">
                       <button className="btn-brand text-xs">Save Notes</button>
                    </div>
                  </motion.div>
                )}

                {tab === 'resources' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(currentLesson?.youtubeSuggestions || []).map((vid, i) => (
                      <a
                        key={i}
                        href={vid.url}
                        target="_blank"
                        rel="noreferrer"
                        className="card-hover p-4 flex gap-4 no-underline"
                      >
                        <div className="w-24 h-16 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden relative group">
                           <img src={vid.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                           <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={16} className="text-white fill-white" />
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-app-fg truncate mb-1">{vid.title}</p>
                          <p className="text-[10px] text-app-muted line-clamp-2 leading-relaxed">{vid.channel}</p>
                        </div>
                      </a>
                    ))}
                    {(!currentLesson?.youtubeSuggestions || currentLesson.youtubeSuggestions.length === 0) && (
                      <div className="col-span-2 py-12 text-center border-2 border-dashed border-app-border rounded-3xl">
                        <Video size={32} className="mx-auto text-app-muted mb-3 opacity-30" />
                        <p className="text-sm text-app-muted">No external resources found for this lesson.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Navigation footer */}
            <div className="flex items-center justify-between py-10 border-t border-app-border">
              <button className="btn-outline text-sm px-6">
                <ChevronLeft size={16} /> Previous Lesson
              </button>
              <button className="btn-brand text-sm px-8">
                Next Lesson <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Menu (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
         <button className="w-14 h-14 bg-brand-green rounded-full shadow-brand-lg flex items-center justify-center text-white">
            <BookOpen size={24} />
         </button>
      </div>
    </div>
  );
}
