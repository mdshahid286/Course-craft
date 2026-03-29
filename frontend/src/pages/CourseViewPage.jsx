import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, BookOpen, CheckCircle, Circle, StickyNote, ChevronLeft, ChevronRight, Clock, Star, Lock, FileText, Loader, AlertCircle, Sparkles, Layers } from 'lucide-react';
import { loadCourse, loadNotes, storeNotes, storeCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { generateAnimation } from '../services/geminiService';
import ManimPlayer from '../components/ManimPlayer';
import ReactMarkdown from 'react-markdown';

const TABS = ['Lesson', 'Curriculum', 'Notes'];

export default function CourseViewPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('Lesson');
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const { currentUser } = useAuth();

  // Load course from localStorage or Firestore
  useEffect(() => {
    async function init() {
      const data = await loadCourse(currentUser?.uid, courseId);
      if (data) {
        setCourse(data);
        // Set first topic as active
        const first = data.modules?.[0]?.topics?.[0];
        if (first) {
          setActiveTopicId(first.id);
          const topicNotes = await loadNotes(currentUser?.uid, first.id);
          setNotes(topicNotes);
        }
      }
    }
    init();
  }, [courseId, currentUser]);

  const allTopics = course?.modules?.flatMap(m => m.topics) || [];
  const activeTopic = allTopics.find(t => t.id === activeTopicId);
  const activeTopicIndex = allTopics.findIndex(t => t.id === activeTopicId);

  const handleTopicChange = useCallback(async (topicId) => {
    setActiveTopicId(topicId);
    const topicNotes = await loadNotes(currentUser?.uid, topicId);
    setNotes(topicNotes);
  }, [currentUser]);

  const handleGenerateAnimation = async (topic) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationStep('Neural engine structuring manim script...');
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
      console.error('Animation generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addNote = async () => {
    if (!noteInput.trim()) return;
    const updated = [{ id: Date.now(), topicId: activeTopicId, text: noteInput, timestamp: 'System Log - Just now' }, ...notes];
    setNotes(updated);
    await storeNotes(currentUser?.uid, activeTopicId, updated);
    setNoteInput('');
  };

  if (!course) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
        <AlertCircle size={48} className="text-slate-400" />
        <h2 className="text-2xl font-display font-bold text-slate-900">Course Not Found</h2>
        <p className="text-slate-500">The requested learning path is empty or corrupted.</p>
        <Link to="/build" className="mt-4 bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] min-h-0 bg-[#FAFAFA] text-slate-900">
      
      {/* Main Reading Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mb-8 bg-white border border-slate-200 shadow-sm w-fit px-4 py-1.5 rounded-full">
            <Link to="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
            <ChevronRight size={14} className="opacity-50" />
            <Link to="/courses" className="hover:text-slate-900 transition-colors">Courses</Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px]">{course.title}</span>
          </div>

          {/* Animation Area */}
          <div className="mb-10">
            {activeTopic?.animation ? (
              <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white">
                <ManimPlayer animation={activeTopic.animation} />
              </div>
            ) : (
              <div className="aspect-video bg-white border border-slate-200 rounded-[2rem] overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center text-center p-8 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-[80px] group-hover:bg-brand-blue/10 transition-all duration-1000"></div>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-5 relative z-10 w-full max-w-md">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border border-slate-100"></div>
                      <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-brand-blue animate-spin drop-shadow-sm" />
                      <div className="absolute inset-2 w-16 h-16 rounded-full border-2 border-transparent border-b-indigo-400 animate-spin" style={{ animationDirection: 'reverse' }} />
                    </div>
                    <p className="text-slate-700 font-mono font-bold tracking-widest uppercase text-xs animate-pulse text-center">{generationStep}</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                       <div className="h-full bg-gradient-to-r from-brand-blue to-indigo-500 animate-[pulse_2s_infinite]" style={{ width: '80%' }} />
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                      <Layers size={32} className="text-brand-blue" />
                    </div>
                    <h3 className="text-slate-900 font-display font-bold text-3xl mb-3 tracking-tight">Manim Simulation Available</h3>
                    <p className="text-slate-500 text-sm max-w-sm mb-10 leading-relaxed font-medium">This computational logic block can be visualized using our Manim rendering cluster. Initialize compiler sequence to view.</p>
                    <button 
                      onClick={() => handleGenerateAnimation(activeTopic)}
                      className="bg-slate-900 hover:bg-black text-white font-bold py-4 px-10 rounded-xl transition-all flex items-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
                    >
                      <Play size={18} fill="currentColor" /> Initialize Compiler
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <div className="flex gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm mb-8 w-fit">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Layer */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
            {activeTab === 'Lesson' && activeTopic && (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-8 leading-[1.15] tracking-tight">{activeTopic.name}</h1>
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed mb-16 prose-headings:text-slate-900 prose-a:text-brand-blue prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200 prose-code:text-brand-blue">
                  <ReactMarkdown>{activeTopic.explanation}</ReactMarkdown>
                </div>

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-10 mt-12 gap-4">
                   <button 
                     disabled={activeTopicIndex <= 0}
                     onClick={() => handleTopicChange(allTopics[activeTopicIndex - 1].id)}
                     className="w-full sm:w-auto flex items-center justify-center gap-3 text-slate-500 font-bold hover:text-slate-900 bg-white border border-slate-200 px-6 py-4 rounded-2xl disabled:opacity-30 transition-all hover:bg-slate-50 shadow-sm"
                   >
                     <ChevronLeft /> Previous Lesson
                   </button>
                   <button 
                     disabled={activeTopicIndex >= allTopics.length - 1}
                     onClick={() => handleTopicChange(allTopics[activeTopicIndex + 1].id)}
                     className="w-full sm:w-auto flex items-center justify-center gap-3 text-white font-bold hover:bg-blue-600 bg-brand-blue px-6 py-4 rounded-2xl disabled:opacity-30 transition-all shadow-md"
                   >
                     Next Lesson <ChevronRight />
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'Curriculum' && (
              <div className="space-y-10 max-w-4xl mx-auto">
                {course.modules?.map((mod, mi) => (
                  <div key={mod.id || mi} className="relative pl-10 border-l-2 border-slate-100">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-brand-blue shadow-sm" />
                    <h3 className="text-slate-400 uppercase font-bold tracking-widest text-xs mb-6 flex items-center gap-3">
                       <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">Module 0{mi + 1}</span>
                       <span className="text-slate-900">{mod.title}</span>
                    </h3>
                    
                    <div className="space-y-4">
                      {mod.topics?.map(topic => (
                        <button 
                          key={topic.id}
                          onClick={() => { handleTopicChange(topic.id); setActiveTab('Lesson'); }}
                          className={`w-full p-6 rounded-2xl border text-left transition-all group ${topic.id === activeTopicId ? 'border-brand-blue bg-blue-50/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)]' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                             <p className={`font-bold text-lg tracking-tight ${topic.id === activeTopicId ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900 transition-colors'}`}>{topic.name}</p>
                             {topic.id === activeTopicId && <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse"></span>}
                          </div>
                          <p className={`text-sm leading-relaxed ${topic.id === activeTopicId ? 'text-slate-600' : 'text-slate-500'}`}>{topic.explanation.slice(0, 120)}...</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="max-w-3xl mx-auto">
                 <div className="mb-12 bg-slate-50 border border-slate-200 p-8 rounded-[2rem]">
                    <h4 className="flex items-center gap-2 text-slate-900 font-bold mb-6 text-lg"><FileText size={20} className="text-brand-blue"/> Lesson Notes</h4>
                    <textarea 
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder="Write down your thoughts or key takeaways..."
                      className="w-full h-40 bg-white rounded-2xl p-6 text-slate-900 border border-slate-200 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 resize-none mb-6 placeholder-slate-400 transition-all text-base leading-relaxed shadow-inner"
                    />
                    <button onClick={addNote} className="bg-slate-900 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-black transition-colors shadow-md">Save Note</button>
                 </div>
                 
                 <div className="space-y-6">
                    {notes.map(note => (
                      <div key={note.id} className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-slate-300 transition-all">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 group-hover:bg-brand-blue transition-colors"></div>
                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{note.text}</p>
                        <p className="text-xs text-slate-400 mt-5 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg w-fit border border-slate-100">{note.timestamp}</p>
                      </div>
                    ))}
                    {notes.length === 0 && (
                       <div className="text-center py-20 border border-dashed border-slate-300 rounded-[2rem] bg-slate-50">
                          <p className="text-slate-500 font-medium text-sm">No notes saved for this lesson yet.</p>
                       </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info Panel */}
      <aside className="w-full lg:w-[400px] border-l border-slate-200 bg-white p-8 overflow-y-auto hidden lg:flex flex-col gap-8 shadow-sm z-10 relative">
        <div className="absolute top-0 right-0 w-full h-64 bg-blue-50/50 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
           <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <BookOpen size={24} className="text-brand-blue" />
           </div>
           <h2 className="text-2xl font-display font-black text-slate-900 mb-4 leading-tight tracking-tight">{course.title}</h2>
           <p className="text-slate-500 text-sm leading-relaxed mb-8">{course.description}</p>
           
           <div className="space-y-4">
              <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest">Outcomes</h4>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 space-y-3">
                {course.outcomes?.map((o, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-600 font-medium items-start">
                    <span className="text-brand-blue font-bold mt-0.5 text-[10px] uppercase bg-blue-100 px-1.5 py-0.5 rounded">0{i+1}</span>
                    <p className="leading-snug">{o}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="relative z-10 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1">
           <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Directory Index</h4>
           <div className="space-y-6">
              {course.modules?.map((m, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:border-brand-blue group-hover:text-brand-blue group-hover:bg-blue-50 transition-all flex-shrink-0 mt-0.5">{i+1}</div>
                  <div>
                    <p className="text-slate-700 font-bold text-sm mb-1 group-hover:text-slate-900 transition-colors">{m.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{m.topics?.length} Modules</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </aside>
    </div>
  );
}
