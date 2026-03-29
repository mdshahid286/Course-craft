import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Lightbulb, BookOpen, Clock,
  FileText, AlertCircle, Rocket, Cpu, Activity,
  Zap, Shield, ChevronRight, Video, CheckCircle,
  PlusCircle, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCourse } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

function normalizeCourse(raw) {
  return {
    ...raw,
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
        youtubeSuggestions: item.youtubeSuggestions || [],
      })),
    })),
  };
}

const SUGGESTIONS = [
  'Quantum Computing',
  'Neural Networks',
  'Cryptography',
  'Fluid Dynamics',
  'Advanced Calculus',
  'Orbital Mechanics',
];

const STEPS = [
  { label: 'Analyzing topic', icon: Lightbulb, color: 'text-amber-500' },
  { label: 'Building syllabus', icon: BookOpen, color: 'text-blue-500' },
  { label: 'Generating content', icon: Cpu, color: 'text-brand-green' },
  { label: 'Creating visuals', icon: Activity, color: 'text-cyan-500' },
  { label: 'Adding resources', icon: Video, color: 'text-red-500' },
  { label: 'Finalizing course', icon: Shield, color: 'text-emerald-500' },
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
      const { courseId } = await createCourse(q, 'Beginner', currentUser?.uid);
      setCourseId(courseId);
      setCurrentStep(STEPS.length - 1);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Course generation failed. Please try again.');
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (location.state?.initialQuery && !isGenerating && !done && !error) {
      performGeneration(location.state.initialQuery);
    }
  }, [location.state, currentUser]);

  useEffect(() => {
    let t;
    if (isGenerating && !done && !error) {
      t = setInterval(() => setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)), 4000);
    }
    return () => clearInterval(t);
  }, [isGenerating, done, error]);

  const handleReset = () => {
    setIsGenerating(false);
    setDone(false);
    setError(null);
    setQuery('');
    setCurrentStep(0);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-app-fg">Course Builder</h1>
        <p className="text-sm text-app-muted mt-0.5">
          Enter a topic and our AI will generate a complete, structured course for you.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* ── INPUT STATE ── */}
        {!isGenerating ? (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main input card */}
            <div className="lg:col-span-2 card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-green-lighter rounded-xl flex items-center justify-center">
                  <Sparkles size={20} className="text-brand-green" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-app-fg">AI Course Generator</h2>
                  <p className="text-xs text-app-muted">Powered by Gemini 2.0 Flash</p>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-app-fg mb-2">
                  Course Topic
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && performGeneration(query)}
                      placeholder="e.g. History of Spaceflight, Machine Learning..."
                      className="input pl-10 h-12 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => performGeneration(query)}
                    disabled={!query.trim()}
                    className="btn-brand px-6 h-12 text-sm"
                  >
                    Generate <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-xs font-medium text-app-muted mb-2.5">Popular topics</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className={cn(
                        'text-xs font-medium px-3 py-1.5 rounded-lg border transition-all',
                        query === s
                          ? 'bg-brand-green-lighter border-brand-green/30 text-brand-green'
                          : 'bg-app-surface2 border-app-border text-app-muted hover:border-app-border2 hover:text-app-fg'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side info card */}
            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-app-fg mb-4">What you'll get</h3>
                <div className="space-y-3">
                  {[
                    { icon: BookOpen, label: 'Structured modules & lessons', color: 'text-brand-green' },
                    { icon: FileText, label: 'Detailed lesson explanations', color: 'text-blue-500' },
                    { icon: Video, label: 'YouTube resources curated', color: 'text-red-500' },
                    { icon: Activity, label: 'Manim animation scripts', color: 'text-purple-500' },
                    { icon: Zap, label: 'Interactive quizzes', color: 'text-amber-500' },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={cn('w-7 h-7 rounded-lg bg-app-surface2 flex items-center justify-center', color)}>
                        <Icon size={14} />
                      </div>
                      <span className="text-sm text-app-muted">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5 bg-brand-green text-white">
                <p className="text-xs text-brand-green-muted mb-1 font-medium">Average time</p>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-white/80" />
                  <span className="text-2xl font-bold">~30 sec</span>
                </div>
                <p className="text-xs text-brand-green-muted mt-2 leading-relaxed">
                  Full course with modules, explanations, videos & quizzes
                </p>
              </div>
            </div>
          </motion.div>

        ) : (
        /* ── GENERATING STATE ── */
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card p-8 md:p-10">
              {/* Error */}
              {error && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl mx-auto mb-5 flex items-center justify-center border border-rose-100">
                    <AlertCircle size={32} className="text-rose-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-app-fg mb-2">Generation Failed</h2>
                  <p className="text-sm text-app-muted mb-5 max-w-sm mx-auto">{error}</p>
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-4 text-xs mb-6 text-left">
                    {error}
                  </div>
                  <button onClick={handleReset} className="btn-brand w-full justify-center">
                    Try Again
                  </button>
                </div>
              )}

              {/* Generating */}
              {!error && !done && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <div className="w-14 h-14 rounded-full border-4 border-app-surface2" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 rounded-full border-4 border-t-brand-green border-transparent"
                      />
                      <Sparkles size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-green" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-app-fg">Building your course</h2>
                      <p className="text-sm text-app-muted">"{query}" — please wait a moment...</p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {STEPS.map((step, i) => {
                      const Icon = step.icon;
                      const isActive = i === currentStep;
                      const isDone = i < currentStep;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'flex items-center gap-4 p-3.5 rounded-xl transition-all duration-400',
                            isActive ? 'bg-brand-green-lighter border border-brand-green/20' : 'hover:bg-app-surface2'
                          )}
                        >
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all',
                            isDone ? 'bg-brand-green text-white' :
                            isActive ? 'bg-brand-green text-white shadow-brand' :
                            'bg-app-surface2 border border-app-border text-app-muted'
                          )}>
                            {isDone ? <CheckCircle size={15} /> : <Icon size={15} />}
                          </div>
                          <span className={cn(
                            'text-sm font-medium transition-colors',
                            isActive ? 'text-brand-green' : isDone ? 'text-app-fg' : 'text-app-muted'
                          )}>
                            {step.label}
                          </span>
                          {isActive && (
                            <div className="ml-auto flex gap-1">
                              {[0, 1, 2].map(d => (
                                <motion.div
                                  key={d}
                                  animate={{ opacity: [0.3, 1, 0.3] }}
                                  transition={{ duration: 1.2, repeat: Infinity, delay: d * 0.3 }}
                                  className="w-1.5 h-1.5 rounded-full bg-brand-green"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Done */}
              {!error && done && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-20 h-20 bg-brand-green-lighter rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-brand-green/20"
                  >
                    <CheckCircle size={36} className="text-brand-green" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-app-fg mb-2">Course Ready!</h2>
                  <p className="text-sm text-app-muted mb-6 max-w-xs mx-auto">
                    Your course has been generated successfully and saved to your library.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => navigate(`/course/${courseId}`)}
                      className="btn-brand flex-1 justify-center"
                    >
                      Open Course <ArrowRight size={16} />
                    </button>
                    <button onClick={handleReset} className="btn-outline flex-1 justify-center">
                      <PlusCircle size={16} /> Create Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
