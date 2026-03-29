import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb, BookOpen, Clock, FileText, X, AlertCircle } from 'lucide-react';
import { createCourse, storeCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Converts the backend course schema (modules[].lessons[]) to the shape
 * CourseViewPage expects (modules[].topics[], plus flat field names).
 */
function normalizeCourse(raw) {
  return {
    ...raw,
    // backend uses `learning_objectives`; UI reads `outcomes`
    outcomes: raw.outcomes || raw.learning_objectives || [],
    modules: (raw.modules || []).map(mod => ({
      ...mod,
      topics: (mod.topics || mod.lessons || []).map(item => ({
        id: item.id,
        name: item.name || item.title || 'Untitled',
        explanation: item.explanation || item.content?.explanation || '',
        videoPrompt:
          item.videoPrompt ||
          (item.videoScript?.scenes || []).map(s => s.narration).join(' ') ||
          '',
        animation: item.animation || null,
      })),
    })),
  };
}

const SUGGESTIONS = [
  'Quantum Computing Basics',
  'Machine Learning with Python',
  'Web3 and Blockchain',
  'UI/UX Design Fundamentals',
  'Calculus for Engineers',
  'Neural Networks',
];

const STEPS = [
  { label: 'Analyzing request...', icon: Lightbulb },
  { label: 'Drafting syllabus...', icon: BookOpen },
  { label: 'Writing detailed content...', icon: Sparkles },
  { label: 'Generating visualizations...', icon: Clock },
  { label: 'Finalizing course...', icon: FileText },
];

export default function CourseBuilderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState(location.state?.initialQuery || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [courseId, setCourseId] = useState(null);

  const { currentUser } = useAuth();

  const performGeneration = async (q) => {
    if (!q.trim()) return;
    setIsGenerating(true);
    setCurrentStep(0);
    setDone(false);
    setError(null);
    setCourseId(null);

    try {
      const { courseId, course } = await createCourse(q, 'Beginner', currentUser?.uid);
      const normalized = normalizeCourse({ ...course, id: courseId });
      // Redundant storeCourse removed - Backend handles persistence now.
      setCourseId(courseId);
      setCurrentStep(STEPS.length - 1);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Course generation failed. Check your connection.');
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => performGeneration(query);

  // Handle auto-generation if query is passed from dashboard
  useEffect(() => {
    if (location.state?.initialQuery && !isGenerating && !done && !error) {
      performGeneration(location.state.initialQuery);
    }
  }, [location.state, currentUser]);

  // Advance the UI step indicator while the API call is running
  useEffect(() => {
    let t;
    if (isGenerating && !done && !error) {
      t = setInterval(() => {
        setCurrentStep(s => Math.min(s + 1, STEPS.length - 1));
      }, 4000); // ~20 seconds for full generation
    }
    return () => clearInterval(t);
  }, [isGenerating, done, error]);

  const handleViewCourse = () => {
    if (courseId) navigate(`/course/${courseId}`);
  };

  const handleReset = () => {
    setIsGenerating(false);
    setDone(false);
    setError(null);
    setQuery('');
    setCurrentStep(0);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col relative bg-[#FAFAFA]">
      
      {!isGenerating ? (
        /* ── Input Screen ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
          <div className="text-center mb-10 max-w-2xl">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm border border-blue-100">
              <Sparkles size={28} className="text-brand-blue" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 mb-4">
              What do you want to learn?
            </h1>
            <p className="text-slate-500 text-lg">
              Our AI will build a complete, structured course for you with interactive visuals.
            </p>
          </div>

          <div className="w-full max-w-2xl mb-8">
            <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-2.5 flex gap-2 items-center border border-slate-200 focus-within:border-brand-blue focus-within:ring-4 focus-within:ring-brand-blue/10 transition-all">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Introduction to Machine Learning..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder-slate-400 px-5 py-3 font-medium"
              />
              <button
                onClick={handleGenerate}
                disabled={!query.trim()}
                className="bg-brand-blue hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-brand-blue text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 transition-all shadow-md"
              >
                Generate <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            <span className="text-slate-400 text-sm font-semibold self-center mr-1">Try:</span>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="bg-white border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Generating / Error / Done Screen ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10">
          <div className="w-full max-w-md text-center bg-white border border-slate-200 p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            
            {/* Error State */}
            {error && (
              <div className="relative z-10">
                <div className="w-16 h-16 bg-red-50 rounded-full mx-auto mb-6 flex items-center justify-center border border-red-100">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Generation Failed</h2>
                <p className="text-slate-500 mb-6 font-medium">"{query}"</p>
                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm mb-8 text-left break-words">
                  {error}
                </div>
                <button onClick={handleReset} className="bg-white border border-slate-300 text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors shadow-sm w-full">
                  Try Again
                </button>
              </div>
            )}

            {/* Generating State */}
            {!error && !done && (
              <div className="relative z-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-blue animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={28} className="text-brand-blue animate-pulse" />
                  </div>
                </div>
                
                <h2 className="text-xl font-display font-bold text-slate-900 mb-8">Building Course...</h2>

                <div className="space-y-3 text-left">
                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === currentStep;
                    const isDone = i < currentStep;
                    return (
                      <div key={i} className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-50 border border-blue-100' : 'bg-transparent'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isDone ? 'bg-green-100 text-green-600' : isActive ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {isDone ? '✓' : <Icon size={14} />}
                        </div>
                        <span className={`font-medium text-[15px] ${isActive ? 'text-brand-blue' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Done State */}
            {!error && done && (
              <div className="relative z-10">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center text-green-600 text-3xl font-bold">
                  ✓
                </div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Course Ready!</h2>
                <p className="text-slate-500 mb-8 font-medium">"{query}" has been generated successfully.</p>
                
                <div className="flex flex-col gap-3">
                  <button onClick={handleViewCourse} className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                    Start Learning <ArrowRight size={18} />
                  </button>
                  <button onClick={handleReset} className="bg-white border border-slate-200 text-slate-600 font-bold py-3.5 px-6 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                     Create Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
