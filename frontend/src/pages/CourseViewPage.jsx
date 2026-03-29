import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Play, BookOpen, CheckCircle, Circle, StickyNote, 
  ChevronLeft, ChevronRight, Clock, Star, Lock, 
  FileText, Loader, AlertCircle, Sparkles, Layers,
  Terminal, Activity, Cpu, Shield, ArrowUpRight,
  Video, ExternalLink, Share2, Target, Brain
} from 'lucide-react';
import { loadCourse, loadNotes, storeNotes, storeCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { generateAnimation } from '../services/geminiService';
import ManimPlayer from '../components/ManimPlayer';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = ['Lesson_Log', 'Unit_Registry', 'Neuro_Notes'];

export default function CourseViewPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('Lesson_Log');
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    async function init() {
      if (!currentUser) return;
      try {
        const data = await loadCourse(currentUser.uid, courseId);
        if (data) {
          setCourse(data);
          const first = data.modules?.[0]?.topics?.[0];
          if (first) {
            setActiveTopicId(first.id);
            const topicNotes = await loadNotes(currentUser.uid, first.id);
            setNotes(topicNotes);
          }
        }
      } catch (err) {
        console.error('Core_Fetch_Failed:', err);
      }
    }
    init();
  }, [courseId, currentUser]);

  const allTopics = course?.modules?.flatMap(m => m.topics) || [];
  const activeTopic = allTopics.find(t => t.id === activeTopicId);
  const activeTopicIndex = allTopics.findIndex(t => t.id === activeTopicId);

  const handleTopicChange = useCallback(async (topicId) => {
    setActiveTopicId(topicId);
    if (!currentUser) return;
    const topicNotes = await loadNotes(currentUser.uid, topicId);
    setNotes(topicNotes);
  }, [currentUser]);

  const handleGenerateAnimation = async (topic) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationStep('Neural_Heuristics: Structuring_Manim_Sequence...');
    try {
      const result = await generateAnimation(topic.name, topic.videoPrompt);
      const updatedCourse = { ...course };
      updatedCourse.modules.forEach(m => {
        m.topics.forEach(t => {
          if (t.id === topic.id) t.animation = result;
        });
      });
      setCourse(updatedCourse);
      await storeCourse(currentUser?.uid, courseId, updatedCourse);
    } catch (err) {
      console.error('Simulation_Render_Failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addNote = async () => {
    if (!noteInput.trim() || !currentUser) return;
    const updated = [{ 
      id: Date.now(), 
      topicId: activeTopicId, 
      text: noteInput, 
      timestamp: `SYSTEM_LOG_${new Date().toLocaleTimeString()}` 
    }, ...notes];
    setNotes(updated);
    await storeNotes(currentUser.uid, activeTopicId, updated);
    setNoteInput('');
  };

  if (!course) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-10 py-32 text-center px-6 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10">
           <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full mx-auto mb-10 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)] animate-pulse">
              <AlertCircle size={48} />
           </div>
           <h2 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter mb-4">Registry_Error: Missing_Unit</h2>
           <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest max-w-sm mx-auto mb-10 italic">Sector is empty or transmission is corrupt. Unit_ID: {courseId}</p>
           <Link to="/build" className="bg-brand-blue hover:bg-brand-darkBlue text-white font-black py-4 px-10 rounded-2xl italic transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] uppercase tracking-tighter flex items-center gap-3">Initialize_Terminal <Terminal size={18}/></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-background text-foreground relative overflow-hidden font-sans">
      <div className="absolute inset-y-0 left-0 w-1 bg-brand-blue/20" />
      
      {/* Main OS Viewport */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative custom-scrollbar">
        <div className="p-8 md:p-14 max-w-[1200px] mx-auto">
          
          {/* Breadcrumb Registry */}
          <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-[0.2em] mb-12 bg-black/40 border border-white/5 w-fit px-6 py-2.5 rounded-xl italic">
            <Link to="/dashboard" className="hover:text-brand-blue transition-colors">OS_ROOT</Link>
            <ChevronRight size={12} className="opacity-30" />
            <Link to="/courses" className="hover:text-brand-blue transition-colors">Library_Grid</Link>
            <ChevronRight size={12} className="opacity-30" />
            <span className="text-white truncate max-w-[200px] italic">{course.title}</span>
          </div>

          {/* Simulation / Visualizer Area */}
          <div className="mb-14 group">
            <AnimatePresence mode="wait">
              {activeTopic?.animation ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] bg-black relative"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-indigo-500 to-cyan-500 z-20" />
                  <ManimPlayer animation={activeTopic.animation} />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-video bg-zinc-900 border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl flex flex-col items-center justify-center text-center p-12 group/sim"
                >
                  <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 rounded-full blur-[100px] group-hover/sim:bg-brand-blue/10 transition-all duration-1000" />
                  
                  {isGenerating ? (
                    <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
                       <div className="relative">
                          <div className="w-24 h-24 rounded-full border border-white/5" />
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-t-2 border-brand-blue shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                          />
                          <Activity size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-blue animate-pulse" />
                       </div>
                       <div className="space-y-4 w-full">
                          <p className="text-white font-mono font-bold tracking-[0.2em] uppercase text-[10px] italic">{generationStep}</p>
                          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden border border-white/5 relative">
                             <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-white to-brand-blue animate-[shimmer_2s_infinite] w-[200px]" />
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-20 h-20 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                      >
                        <Layers size={36} className="text-brand-blue" />
                      </motion.div>
                      <h3 className="text-white font-display font-black text-3xl mb-4 italic tracking-tighter uppercase leading-none underline decoration-brand-blue/30 underline-offset-8">Simulation_Standby_</h3>
                      <p className="text-zinc-500 font-mono text-[11px] max-w-sm mb-12 uppercase tracking-widest leading-relaxed italic">{"> "}Computational logic for {activeTopic?.name} pending render. Launch Manim compiler v2.0.</p>
                      <button 
                        onClick={() => handleGenerateAnimation(activeTopic)}
                        className="bg-white hover:bg-zinc-200 text-black font-black py-4 px-12 rounded-2xl transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase italic tracking-tighter text-sm group/btn"
                      >
                        <Terminal size={18} /> Initialize_Compiler <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* OS Navigation Tabs */}
          <div className="flex gap-4 p-1.5 bg-black/60 border border-white/5 rounded-2xl shadow-2xl mb-12 w-fit relative z-20">
            <div className="absolute inset-0 bg-brand-blue/5 rounded-2xl blur-md pointer-events-none" />
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative italic outline-none",
                  activeTab === tab ? "bg-brand-blue text-white shadow-[0_4px_15px_rgba(59,130,246,0.5)]" : "text-zinc-600 hover:text-white"
                )}>
                {tab}
              </button>
            ))}
          </div>

          {/* Dynamic Layer Rendering */}
          <div className="bg-black/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.4)] border border-white/5 relative z-10 transition-all duration-500 hover:border-white/10">
            <div className="absolute inset-0 bg-grid-white opacity-[0.01] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {activeTab === 'Lesson_Log' && activeTopic && (
                <motion.div 
                  key="lesson"
                  initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="flex items-center gap-4 mb-4 text-[9px] font-mono font-black text-brand-blue bg-brand-blue/5 px-4 py-1 rounded-lg w-fit italic tracking-[0.3em]">
                     <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" /> SECTOR_READY_0X0{activeTopicIndex + 1}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-12 leading-[0.9] tracking-tighter uppercase italic">{activeTopic.name}</h1>
                  
                  <div className="prose prose-invert prose-lg max-w-none text-zinc-400 font-medium leading-[1.8] mb-20 prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-headings:italic prose-a:text-brand-blue prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/5 prose-code:text-brand-blue font-sans selection:bg-brand-blue/40 selection:text-white">
                    <ReactMarkdown>{activeTopic.explanation}</ReactMarkdown>
                  </div>

                  {/* YouTube Integration Section */}
                  {activeTopic.youtubeSuggestions?.length > 0 && (
                     <div className="mb-20">
                        <h4 className="flex items-center gap-3 text-white font-black italic uppercase tracking-tighter text-xl mb-8">
                           <Video className="text-red-500" /> Linked_External_Docs_
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {activeTopic.youtubeSuggestions.map((video, idx) => (
                              <a 
                                key={idx} 
                                href={`https://www.youtube.com/watch?v=${video.id}`} 
                                target="_blank" rel="noreferrer"
                                className="tech-card bg-zinc-900 border-white/5 p-6 flex items-center gap-6 group/yt hover:border-red-500/30 transition-all"
                              >
                                 <div className="relative w-32 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl flex-shrink-0 group-hover/yt:scale-105 transition-transform">
                                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-60 group-hover/yt:opacity-100" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       <Play size={20} className="text-white fill-white transition-opacity group-hover/yt:opacity-0" />
                                       <ExternalLink size={20} className="text-white opacity-0 group-hover/yt:opacity-100" />
                                    </div>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest mb-1 italic">RESOURCE_{idx+1}</p>
                                    <h5 className="text-sm font-bold text-white truncate leading-tight mb-2 group-hover/yt:text-red-400 transition-colors uppercase italic tracking-tighter">{video.title}</h5>
                                    <p className="text-[9px] font-mono text-zinc-600 truncate uppercase tracking-widest italic">{video.channel}</p>
                                 </div>
                              </a>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Sequential Flux Control */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-12 mt-16 gap-6 relative">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
                     
                     <button 
                       disabled={activeTopicIndex <= 0}
                       onClick={() => handleTopicChange(allTopics[activeTopicIndex - 1].id)}
                       className="w-full sm:w-auto flex items-center justify-center gap-4 text-zinc-500 font-black italic hover:text-white bg-transparent border border-white/5 px-8 py-5 rounded-2xl disabled:opacity-30 transition-all hover:bg-white/5 uppercase tracking-tighter text-xs"
                     >
                       <ChevronLeft size={18} /> BACK_SECTOR_0{activeTopicIndex}
                     </button>
                     <button 
                       disabled={activeTopicIndex >= allTopics.length - 1}
                       onClick={() => handleTopicChange(allTopics[activeTopicIndex + 1].id)}
                       className="w-full sm:w-auto flex items-center justify-center gap-4 text-white font-black hover:bg-brand-darkBlue bg-brand-blue px-10 py-5 rounded-2xl disabled:opacity-30 transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] uppercase italic tracking-tighter text-sm group/next"
                     >
                       NEXT_SECTOR_0{activeTopicIndex + 2} <ChevronRight size={18} className="group-hover:translate-x-1" />
                     </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'Unit_Registry' && (
                <motion.div 
                  key="curriculum"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="space-y-14 max-w-4xl mx-auto"
                >
                  {course.modules?.map((mod, mi) => (
                    <div key={mod.id || mi} className="relative pl-12 border-l-2 border-white/5 py-2 group/mod">
                      <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-black border-4 border-brand-blue shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover/mod:scale-125 transition-transform" />
                      <h3 className="text-zinc-600 uppercase font-black tracking-[0.2em] text-[10px] mb-10 flex flex-col md:flex-row md:items-center gap-4 italic">
                         <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-lg border border-brand-blue/20">MODULE_0{mi + 1}</span>
                         <span className="text-2xl font-display font-black text-white not-italic tracking-tighter group-hover/mod:text-brand-blue transition-colors px-1">{mod.title}</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {mod.topics?.map((topic, ti) => (
                          <button 
                            key={topic.id}
                            onClick={() => { handleTopicChange(topic.id); setActiveTab('Lesson_Log'); }}
                            className={cn(
                              "relative p-8 rounded-[2.5rem] border text-left transition-all group/item overflow-hidden",
                              topic.id === activeTopicId 
                                ? 'border-brand-blue bg-brand-blue/5 shadow-[0_4px_30px_rgba(59,130,246,0.1)]' 
                                : 'border-white/5 bg-zinc-900/40 hover:border-brand-blue/30 hover:bg-zinc-900/60'
                            )}
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover/item:opacity-20 transition-opacity"><Activity size={40} className="text-brand-blue" /></div>
                            <div className="flex items-start justify-between mb-8">
                               <span className="text-[10px] font-mono font-bold text-zinc-700 tracking-[0.3em] uppercase group-hover/item:text-brand-blue">Topic_ID_{mi}_{ti}</span>
                               {topic.id === activeTopicId && <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]" />}
                            </div>
                            <p className={cn(
                              "font-display font-black text-xl italic tracking-tighter uppercase leading-tight mb-4",
                              topic.id === activeTopicId ? 'text-white' : 'text-zinc-500 group-hover:text-white transition-colors'
                            )}>{topic.name}</p>
                            <p className="text-[11px] font-mono text-zinc-600 font-bold uppercase leading-relaxed tracking-tighter truncate opacity-40 group-hover/item:opacity-100">{topic.explanation.slice(0, 100)}...</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'Neuro_Notes' && (
                <motion.div 
                  key="notes"
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                  className="max-w-4xl mx-auto"
                >
                   <div className="mb-14 tech-card p-12 bg-black/60 group focus-within:border-brand-blue/40 border-indigo-500/10">
                      <div className="flex items-center justify-between mb-10">
                        <h4 className="flex items-center gap-4 text-white font-black italic uppercase tracking-tighter text-2xl"><Brain size={32} className="text-brand-blue animate-glow-pulse"/> Internal_Notes_Log</h4>
                        <span className="text-[9px] font-mono font-black text-zinc-600 uppercase tracking-widest italic tracking-tighter">Topic: {activeTopic?.name}</span>
                      </div>
                      <textarea 
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        placeholder="Initialize log sequence... (System ready)"
                        className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-8 text-white font-mono outline-none focus:border-brand-blue/30 focus:shadow-[inset_0_0_20px_rgba(59,130,246,0.05)] resize-none mb-8 placeholder-zinc-700 transition-all text-sm leading-relaxed custom-scrollbar"
                      />
                      <div className="flex justify-between items-center">
                         <div className="flex gap-4 opacity-40 group-focus-within:opacity-100 transition-opacity">
                            <Shield size={18} className="text-zinc-600" />
                            <Cpu size={18} className="text-zinc-600" />
                         </div>
                         <button onClick={addNote} className="bg-brand-blue hover:bg-brand-darkBlue text-white font-black py-4 px-12 rounded-2xl italic shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all uppercase tracking-widest text-xs">Commit_To_Memory</button>
                      </div>
                   </div>
                   
                   <div className="space-y-8">
                      {notes.map(note => (
                        <div key={note.id} className="tech-card p-10 bg-black/20 group hover:border-brand-blue/20 transition-all relative">
                          <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity"><Activity size={40} className="text-brand-blue" /></div>
                          <div className={cn("absolute inset-y-0 left-0 w-1 transition-colors", note.topicId === activeTopicId ? 'bg-brand-blue' : 'bg-white/5' )}></div>
                          <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-8 italic">{note.text}</p>
                          <div className="flex items-center justify-between mt-auto">
                             <p className="text-[9px] font-mono font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg italic border border-white/5">{note.timestamp}</p>
                             <Share2 size={16} className="text-zinc-800 hover:text-white transition-colors cursor-pointer" />
                          </div>
                        </div>
                      ))}
                      {notes.length === 0 && (
                         <div className="text-center py-32 border border-dashed border-white/5 rounded-[3rem] bg-black/20 group hover:border-white/10 transition-colors">
                            <Terminal size={40} className="text-zinc-800 mx-auto mb-6 group-hover:text-brand-blue transition-colors" />
                            <p className="text-zinc-600 font-mono font-bold text-[10px] uppercase tracking-widest italic">Cognitive log empty. Awaiting synchronization.</p>
                         </div>
                      )}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* OS Intelligence Sidebar (Hidden on Mobile) */}
      <aside className="w-full lg:w-[450px] border-l border-white/5 bg-black/40 p-10 overflow-y-auto hidden lg:flex flex-col gap-10 shadow-2xl z-20 relative custom-scrollbar">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-brand-blue/5 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 bg-zinc-900/60 border border-white/5 rounded-[3rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group hover:border-brand-blue/20 transition-all duration-700">
           <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                 <Rocket size={28} className="text-brand-blue fill-brand-blue/10" />
              </div>
              <div className="flex flex-col items-end">
                 <div className="text-[10px] font-mono font-black text-brand-blue uppercase tracking-widest">ACTIVE_UNIT</div>
                 <div className="text-[8px] font-mono text-zinc-700 uppercase mt-1">ID: {courseId.slice(0, 8)}...</div>
              </div>
           </div>
           <h2 className="text-3xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter uppercase italic">{course.title}</h2>
           <p className="text-zinc-500 font-mono text-[11px] leading-relaxed mb-10 italic uppercase tracking-tighter">{course.description}</p>
           
           <div className="space-y-6 pt-10 border-t border-white/5">
              <h4 className="text-zinc-600 font-mono font-black text-[9px] uppercase tracking-[0.3em] italic flex items-center gap-2">
                 <Target size={14} className="text-brand-blue/40" /> Unit_Objective_Array
              </h4>
              <div className="space-y-4">
                {course.outcomes?.map((o, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 group/obj hover:border-brand-blue/20 transition-all"
                  >
                    <span className="text-brand-blue font-black mt-0.5 text-[9px] uppercase bg-brand-blue/10 border border-brand-blue/20 px-2 py-1 rounded italic flex-shrink-0 h-fit">X{i+1}</span>
                    <p className="text-[11px] font-mono text-zinc-400 leading-relaxed uppercase tracking-tighter group-hover/obj:text-zinc-200 transition-colors">{o}</p>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>

        <div className="relative z-10 bg-black/40 border border-white/5 rounded-[3rem] p-10 shadow-xl flex-1 hover:border-white/10 transition-colors">
           <div className="flex items-center justify-between mb-10">
              <h4 className="text-zinc-600 font-mono font-black text-[9px] uppercase tracking-[0.3em] italic">System_Archive_Indices</h4>
              <Layers size={16} className="text-zinc-800" />
           </div>
           <div className="space-y-8">
              {course.modules?.map((m, i) => (
                <div key={i} className="flex gap-6 items-start group/nav cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-mono font-black text-zinc-600 group-hover/nav:border-brand-blue group-hover/nav:text-brand-blue group-hover/nav:bg-brand-blue/10 group-hover/nav:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex-shrink-0 mt-0.5 italic">#{i+1}</div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-bold text-sm mb-1 uppercase tracking-tighter truncate italic group-hover/nav:text-white transition-colors",
                      course.modules.indexOf(course.modules.find(mod => mod.topics.some(t => t.id === activeTopicId))) === i ? 'text-white' : 'text-zinc-500'
                    )}>{m.title}</p>
                    <div className="flex items-center gap-3">
                       <span className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">{m.topics?.length} SECTORS</span>
                       {course.modules.indexOf(course.modules.find(mod => mod.topics.some(t => t.id === activeTopicId))) === i && <div className="w-1 h-1 bg-brand-blue rounded-full animate-pulse shadow-[0_0_5px_brand-blue]" />}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Tactical Info Footer Card */}
        <div className="relative z-10 mt-auto bg-brand-blue p-8 rounded-[2.5rem] overflow-hidden group">
           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
           <div className="absolute top-0 right-0 p-6 opacity-20"><Activity size={60} className="text-white" /></div>
           <div className="relative z-10">
              <p className="text-blue-100 font-mono text-[9px] uppercase tracking-[0.2em] mb-3 italic">Sync_Status: Optimized</p>
              <h5 className="text-white font-display font-black text-xl italic tracking-tighter uppercase mb-6">Unit_Fidelity_Lock</h5>
              <div className="h-1 bg-white/20 rounded-full overflow-hidden border border-white/10 mb-4">
                 <div className="h-full bg-white w-3/4 shadow-[0_0_10px_white]" />
              </div>
              <p className="text-[10px] font-mono font-bold text-blue-100 uppercase tracking-[0.1em] text-right italic">75%_COHERENCE</p>
           </div>
        </div>
      </aside>
    </div>
  );
}
