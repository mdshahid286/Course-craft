import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, BookOpen, CheckCircle, Circle, StickyNote, ChevronLeft, ChevronRight, Clock, Star, Lock, FileText, Loader, AlertCircle, Sparkles } from 'lucide-react';
import { loadCourse, loadNotes, storeNotes, storeCourse } from '../services/api';
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

  // Load course from localStorage
  useEffect(() => {
    const data = loadCourse(courseId);
    if (data) {
      setCourse(data);
      // Set first topic as active
      const first = data.modules?.[0]?.topics?.[0];
      if (first) {
        setActiveTopicId(first.id);
        setNotes(loadNotes(first.id));
      }
    }
  }, [courseId]);

  const allTopics = course?.modules?.flatMap(m => m.topics) || [];
  const activeTopic = allTopics.find(t => t.id === activeTopicId);
  const activeTopicIndex = allTopics.findIndex(t => t.id === activeTopicId);

  const handleTopicChange = useCallback((topicId) => {
    setActiveTopicId(topicId);
    setNotes(loadNotes(topicId));
  }, []);

  const handleGenerateAnimation = async (topic) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setGenerationStep('AI is reasoning about the animation...');
    try {
      const result = await generateAnimation(topic.name, topic.videoPrompt);
      
      const updatedCourse = { ...course };
      updatedCourse.modules.forEach(m => {
        m.topics.forEach(t => {
          if (t.id === topic.id) t.animation = result;
        });
      });
      setCourse(updatedCourse);
      storeCourse(courseId, updatedCourse);
    } catch (err) {
      console.error('Animation generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addNote = () => {
    if (!noteInput.trim()) return;
    const updated = [{ id: Date.now(), topicId: activeTopicId, text: noteInput, timestamp: 'Just now' }, ...notes];
    setNotes(updated);
    storeNotes(activeTopicId, updated);
    setNoteInput('');
  };

  if (!course) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center px-6 text-brand-text">
        <AlertCircle size={48} className="text-brand-muted" />
        <h2 className="text-2xl font-display font-bold">Course not found</h2>
        <p className="text-brand-muted">Try generating a new course from the builder.</p>
        <Link to="/build" className="mt-2 bg-brand-blue text-white font-bold py-3 px-8 rounded-full no-underline">Start Builder</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-0 bg-[#FDFCFA]">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm text-brand-muted font-semibold mb-6">
            <Link to="/courses" className="hover:text-brand-blue transition-colors text-brand-muted no-underline">Platform</Link>
            <ChevronRight size={14} />
            <span className="text-brand-text truncate max-w-[200px]">{course.title}</span>
          </div>

          {/* Animation Area */}
          <div className="mb-8">
            {activeTopic?.animation ? (
              <ManimPlayer animation={activeTopic.animation} />
            ) : (
              <div className="aspect-video bg-brand-darkBlue rounded-5xl overflow-hidden relative shadow-2xl flex flex-col items-center justify-center text-center p-8 border border-white/10">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-brand-blue animate-spin" />
                    <p className="text-brand-blue font-bold tracking-widest uppercase text-xs">{generationStep}</p>
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-blue animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-brand-blue/20 flex items-center justify-center mb-6 border border-white/10">
                      <Sparkles size={32} className="text-brand-blue" />
                    </div>
                    <h3 className="text-white font-display font-bold text-2xl mb-3">Simulate Animation</h3>
                    <p className="text-white/50 text-sm max-w-sm mb-8">This concept can be explained with a mathematical animation. Generate the simulation to visualize it.</p>
                    <button 
                      onClick={() => handleGenerateAnimation(activeTopic)}
                      className="bg-brand-blue hover:bg-brand-darkBlue text-white font-bold py-4 px-10 rounded-full transition-all flex items-center gap-2 shadow-lg shadow-brand-blue/20"
                    >
                      <Play size={18} fill="currentColor" /> Generate Simulation
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <div className="flex gap-1 bg-white p-1.5 rounded-full shadow-sm border border-border mb-8 w-fit">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === tab ? 'bg-brand-blue text-white shadow-md' : 'text-brand-muted hover:text-brand-text'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-5xl p-8 md:p-10 shadow-sm border border-border">
            {activeTab === 'Lesson' && activeTopic && (
              <div className="max-w-4xl">
                <h1 className="text-4xl font-display font-black text-brand-text mb-4 leading-tight">{activeTopic.name}</h1>
                <div className="prose prose-lg max-w-none text-brand-text/80 leading-relaxed mb-10">
                  <ReactMarkdown>{activeTopic.explanation}</ReactMarkdown>
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between border-t border-border pt-8 mt-12">
                   <button 
                     disabled={activeTopicIndex <= 0}
                     onClick={() => handleTopicChange(allTopics[activeTopicIndex - 1].id)}
                     className="flex items-center gap-3 text-brand-text font-bold hover:text-brand-blue disabled:opacity-30 transition-colors"
                   >
                     <ChevronLeft /> Previous Topic
                   </button>
                   <button 
                     disabled={activeTopicIndex >= allTopics.length - 1}
                     onClick={() => handleTopicChange(allTopics[activeTopicIndex + 1].id)}
                     className="flex items-center gap-3 text-brand-text font-bold hover:text-brand-blue disabled:opacity-30 transition-colors"
                   >
                     Next Topic <ChevronRight />
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'Curriculum' && (
              <div className="space-y-8">
                {course.modules?.map((mod, mi) => (
                  <div key={mod.id || mi} className="relative pl-8 border-l-2 border-brand-blue/10">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-brand-blue" />
                    <h3 className="text-brand-muted uppercase tracking-widest font-black text-xs mb-4">Module {mi + 1}: {mod.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mod.topics?.map(topic => (
                        <button 
                          key={topic.id}
                          onClick={() => { handleTopicChange(topic.id); setActiveTab('Lesson'); }}
                          className={`p-6 rounded-3xl border text-left transition-all ${topic.id === activeTopicId ? 'border-brand-blue bg-brand-blue/5 shadow-md' : 'border-border bg-sidebar hover:border-brand-blue/30'}`}
                        >
                          <p className={`font-bold mb-1 ${topic.id === activeTopicId ? 'text-brand-blue' : 'text-brand-text'}`}>{topic.name}</p>
                          <p className="text-xs text-brand-muted line-clamp-2">{topic.explanation.slice(0, 100)}...</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Notes' && (
              <div className="max-w-2xl">
                 <div className="mb-10">
                    <h4 className="text-brand-text font-bold mb-4">Personal Notes</h4>
                    <textarea 
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder="Capture your thoughts on this topic..."
                      className="w-full h-32 bg-sidebar rounded-3xl p-6 text-brand-text border-none outline-none focus:ring-2 ring-brand-blue/20 resize-none mb-4"
                    />
                    <button onClick={addNote} className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full">Save Note</button>
                 </div>
                 <div className="space-y-4">
                    {notes.map(note => (
                      <div key={note.id} className="p-6 bg-sidebar rounded-3xl border border-border">
                        <p className="text-brand-text font-medium leading-relaxed">{note.text}</p>
                        <p className="text-[10px] text-brand-muted mt-3 font-bold uppercase tracking-widest">{note.timestamp}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overview */}
      <aside className="w-full lg:w-96 bg-[#FDFCFA] lg:border-l border-border p-8 overflow-y-auto hidden lg:block">
        <div className="bg-white rounded-5xl p-8 border border-border shadow-sm mb-6">
           <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="text-brand-blue" />
           </div>
           <h2 className="text-2xl font-display font-black text-brand-text mb-4 leading-tight">{course.title}</h2>
           <p className="text-brand-muted text-sm leading-relaxed mb-6">{course.description}</p>
           
           <div className="space-y-3">
              <h4 className="text-brand-text font-bold text-xs uppercase tracking-widest">Learning Outcomes</h4>
              {course.outcomes?.map((o, i) => (
                <div key={i} className="flex gap-3 text-sm text-brand-muted font-medium">
                  <span className="text-brand-blue">0{i+1}</span>
                  <p>{o}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white rounded-5xl p-8 border border-border shadow-sm">
           <h4 className="text-brand-text font-bold text-xs uppercase tracking-widest mb-6">Course Modules</h4>
           <div className="space-y-6">
              {course.modules?.map((m, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-sidebar flex items-center justify-center text-xs font-bold text-brand-muted">{i+1}</div>
                  <div>
                    <p className="text-brand-text font-bold text-sm mb-1">{m.title}</p>
                    <p className="text-xs text-brand-muted">{m.topics?.length} Topics</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </aside>
    </div>
  );
}
