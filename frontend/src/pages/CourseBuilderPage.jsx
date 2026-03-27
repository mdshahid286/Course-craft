import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb, BookOpen, Clock, FileText, X, AlertCircle } from 'lucide-react';
import { createCourse, storeCourse } from '../services/api';

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
  'Neural Networks & Deep Learning',
];

const STEPS = [
  { label: 'Understanding your topic...', icon: Lightbulb },
  { label: 'Structuring the curriculum...', icon: BookOpen },
  { label: 'Generating lesson content with AI...', icon: Sparkles },
  { label: 'Preparing video animations...', icon: Clock },
  { label: 'Finalising your course...', icon: FileText },
];

export default function CourseBuilderPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  const [courseId, setCourseId] = useState(null);

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

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setIsGenerating(true);
    setCurrentStep(0);
    setDone(false);
    setError(null);
    setCourseId(null);

    try {
      // Call the backend — it handles Gemini with the server-side API key
      const { courseId, course } = await createCourse(query, 'Beginner');
      // Normalize backend schema → UI schema before caching
      const normalized = normalizeCourse({ ...course, id: courseId });
      storeCourse(courseId, normalized);
      setCourseId(courseId);
      setCurrentStep(STEPS.length - 1);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Course generation failed. Check your API key.');
      setIsGenerating(false);
    }
  };

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
    <div className="min-h-full flex flex-col">
      {!isGenerating ? (
        /* ── Input Screen ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center mb-12 max-w-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-cyan-400 rounded-4xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-brand-blue/30">
              <Sparkles size={36} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight text-brand-text mb-4 leading-tight">
              Build a Course<br /><span className="text-brand-blue">with AI</span>
            </h1>
            <p className="text-brand-muted text-xl font-medium">
              Describe a topic and get a full course with notes, quizzes, and animated explainer videos — instantly.
            </p>
          </div>

          <div className="w-full max-w-2xl mb-6">
            <div className="bg-white rounded-4xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-3 flex gap-3 items-center border border-border/50">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Introduction to Machine Learning..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-brand-text placeholder-brand-muted/50 px-4 py-2 font-medium"
              />
              <button
                onClick={handleGenerate}
                disabled={!query.trim()}
                className="bg-brand-blue hover:bg-brand-darkBlue disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-3xl flex items-center gap-2 transition-all shadow-[0_4px_14px_rgba(22,129,208,0.4)] hover:-translate-y-0.5"
              >
                Generate <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            <span className="text-brand-muted text-sm font-semibold self-center">Try:</span>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="bg-white border border-border text-brand-text text-sm font-semibold px-4 py-2 rounded-full hover:border-brand-blue/40 hover:text-brand-blue transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Generating / Error / Done Screen ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="w-full max-w-xl text-center">

            {/* Error State */}
            {error && (
              <div>
                <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                  <AlertCircle size={44} className="text-red-500" />
                </div>
                <h2 className="text-3xl font-display font-bold text-brand-text mb-3">Something went wrong</h2>
                <p className="text-brand-muted mb-2 font-medium">"{query}"</p>
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-5 text-sm mb-8 text-left font-mono">{error}</div>
                <p className="text-brand-muted text-sm mb-8">Make sure the backend is running: <code className="bg-[#F7F4EE] px-2 py-1 rounded font-mono text-xs">cd backend && node index.js</code></p>
                <button onClick={handleReset} className="bg-brand-blue text-white font-bold py-4 px-10 rounded-full">
                  Try Again
                </button>
              </div>
            )}

            {/* Generating State */}
            {!error && !done && (
              <>
                <div className="relative w-28 h-28 mx-auto mb-10">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-blue/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-blue animate-spin"></div>
                  <div className="absolute inset-3 rounded-full bg-gradient-to-br from-brand-blue to-cyan-400 flex items-center justify-center shadow-lg">
                    <Sparkles size={32} className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-brand-text mb-2">Building your course...</h2>
                <p className="text-brand-muted mb-10 font-medium">"{query}" — this usually takes 15–30 seconds</p>

                <div className="space-y-3 text-left">
                  {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === currentStep;
                    const isDone = i < currentStep;
                    return (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${isActive ? 'bg-white shadow-md border border-border' : isDone ? 'bg-[#F0FDF4]' : 'bg-[#F7F4EE] opacity-40'}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-brand-blue text-white' : 'bg-white text-brand-muted'}`}>
                          {isDone ? '✓' : <Icon size={16} />}
                        </div>
                        <span className={`font-semibold ${isActive ? 'text-brand-text' : isDone ? 'text-green-700' : 'text-brand-muted'}`}>{step.label}</span>
                        {isActive && <div className="ml-auto w-5 h-5 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Done State */}
            {!error && done && (
              <div>
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-8 flex items-center justify-center shadow-xl shadow-green-500/30 text-4xl">
                  ✓
                </div>
                <h2 className="text-4xl font-display font-black text-brand-text mb-3">Course Ready!</h2>
                <p className="text-brand-muted text-xl mb-2 font-medium">"{query}"</p>
                <p className="text-brand-muted mb-10 text-sm">AI-generated notes, quizzes & animated explainers</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={handleViewCourse} className="bg-brand-blue hover:bg-brand-darkBlue text-white font-bold py-4 px-10 rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.4)] transition-all hover:-translate-y-0.5 flex items-center gap-2">
                    View Course <ArrowRight size={18} />
                  </button>
                  <button onClick={handleReset} className="bg-white border border-border text-brand-muted font-bold py-4 px-10 rounded-full hover:border-brand-blue/30 hover:text-brand-blue transition-all flex items-center gap-2">
                    <X size={16} /> Build Another
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
