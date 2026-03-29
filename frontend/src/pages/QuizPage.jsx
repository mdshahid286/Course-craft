import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Sparkles, Loader, Trophy, BookOpen } from 'lucide-react';
import { generateQuiz } from '../services/api';
import { cn } from '../lib/utils';

export default function QuizPage() {
  const location = useLocation();
  const { lesson, courseTopic } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  const lessonId = lesson?.id || 'lesson-1';
  const lessonTitle = lesson?.title || courseTopic || 'This Lesson';
  const lessonContent = useMemo(() => lesson?.content || {}, [lesson]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    generateQuiz(lessonId, lessonTitle, lessonContent)
      .then(({ quiz }) => {
        if (cancelled) return;
        if (quiz?.questions?.length > 0) {
          setQuestions(quiz.questions);
          setAnswers(new Array(quiz.questions.length).fill(null));
        } else {
          setError('No questions were returned by the AI. Try again.');
        }
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || 'Failed to generate quiz. Make sure the backend is running.');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lessonId, lessonTitle, lessonContent]);

  const question = questions[currentQ];
  const isCorrect = submitted && selected === question?.correct_index;

  const handleSelect = (i) => { if (!submitted) setSelected(i); };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const updated = [...answers];
    updated[currentQ] = selected;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setQuizDone(true);
    }
  };

  const score = answers.filter((a, i) => a === questions[i]?.correct_index).length;

  if (loading) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-brand-green/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-green animate-spin" />
        <div className="absolute inset-3 rounded-full bg-brand-green-lighter flex items-center justify-center">
          <Sparkles size={24} className="text-brand-green" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-app-fg">Generating Quiz...</h3>
      <p className="text-app-muted font-medium">AI is crafting questions for "{lessonTitle}"</p>
    </div>
  );

  if (error) return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center gap-5 px-6">
      <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
        <XCircle size={40} className="text-rose-500" />
      </div>
      <h3 className="text-2xl font-bold text-app-fg">Quiz Generation Failed</h3>
      <p className="text-app-muted max-w-md">{error}</p>
      <Link to={-1} className="btn-brand">Go Back</Link>
    </div>
  );

  if (quizDone) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center bg-app-bg">
        <div className={cn(
          'w-28 h-28 rounded-3xl flex items-center justify-center text-5xl mb-8 shadow-modal',
          pct >= 70 ? 'bg-brand-green text-white' : 'bg-accent-amber text-white'
        )}>
          {pct >= 70 ? <Trophy size={48} /> : <BookOpen size={48} />}
        </div>
        <h2 className="text-4xl font-display font-bold text-app-fg mb-2">{pct >= 70 ? 'Great work!' : 'Keep Learning!'}</h2>
        <p className="text-lg text-app-muted mb-2">You scored <span className="font-bold text-app-fg">{score}/{questions.length}</span> ({pct}%)</p>
        <p className="text-app-muted mb-10 font-medium italic">"{lessonTitle}"</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => { setCurrentQ(0); setSelected(null); setSubmitted(false); setAnswers(new Array(questions.length).fill(null)); setQuizDone(false); }}
            className="btn-brand px-10 py-4"
          >
            Retry Quiz
          </button>
          <Link to={-1} className="btn-outline px-10 py-4">
            Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-6 md:px-10 py-8 max-w-3xl mx-auto w-full bg-app-bg">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <Link to={-1} className="flex items-center gap-1.5 text-app-muted text-sm font-bold hover:text-app-fg transition-colors">
            <ChevronLeft size={16} /> Back
          </Link>
          <span className="text-xs font-bold text-app-muted uppercase tracking-widest">Question {currentQ + 1} of {questions.length}</span>
        </div>
        <div className="progress-track h-3">
          <div className="progress-fill" style={{ width: `${((currentQ + (submitted ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <div className="flex gap-2 mt-4 justify-center">
          {questions.map((_, i) => (
            <div key={i} className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === currentQ ? 'w-8 bg-brand-green' : answers[i] !== null ? (answers[i] === questions[i].correct_index ? 'w-2 bg-brand-green-light' : 'w-2 bg-accent-rose') : 'w-2 bg-app-border'
            )} />
          ))}
        </div>
      </div>

      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-8 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-green-lighter rounded-xl flex items-center justify-center text-brand-green">
            <Sparkles size={18} />
          </div>
          <span className="text-[10px] font-bold text-app-muted tracking-widest uppercase">{lessonTitle}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-app-fg leading-snug">{question.question}</h2>
      </motion.div>

      <div className="space-y-3 mb-8">
        {question.options.map((opt, i) => {
          let variant = 'default';
          if (submitted) {
            if (i === question.correct_index) variant = 'correct';
            else if (i === selected) variant = 'incorrect';
            else variant = 'muted';
          } else if (selected === i) {
            variant = 'selected';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={cn(
                'w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200',
                variant === 'default' && 'bg-app-surface border-app-border hover:border-brand-green/30 hover:bg-app-surface2',
                variant === 'selected' && 'bg-brand-green-lighter border-brand-green shadow-sm text-brand-green',
                variant === 'correct' && 'bg-green-50 border-green-500 text-green-700',
                variant === 'incorrect' && 'bg-rose-50 border-rose-500 text-rose-700',
                variant === 'muted' && 'bg-app-surface border-app-border opacity-50'
              )}
            >
              <div className={cn(
                'mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 font-bold text-[10px] transition-all',
                variant === 'default' && 'border-app-border text-app-muted',
                variant === 'selected' && 'border-brand-green bg-brand-green text-white',
                variant === 'correct' && 'border-green-500 bg-green-500 text-white',
                variant === 'incorrect' && 'border-rose-500 bg-rose-500 text-white',
                variant === 'muted' && 'border-app-border text-app-muted'
              )}>
                {submitted ? (i === question.correct_index ? '✓' : i === selected ? '✕' : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
              </div>
              <span className="text-sm font-semibold">{opt}</span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex gap-4 p-6 rounded-2xl border mb-8',
            isCorrect ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'
          )}
        >
          {isCorrect ? <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" /> : <XCircle size={20} className="text-rose-500 mt-1 flex-shrink-0" />}
          <div>
            <p className={cn('font-bold mb-2', isCorrect ? 'text-green-700' : 'text-rose-700')}>
              {isCorrect ? 'Correct! Excellent understanding.' : 'Incorrect assessment.'}
            </p>
            <p className="text-sm text-app-fg leading-relaxed">
              <span className="font-bold opacity-70">Explanation:</span> {question.explanation}
            </p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end pt-4 mt-auto">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="btn-brand px-12 py-4 shadow-brand-lg"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-brand px-12 py-4 flex items-center gap-2 group shadow-brand-lg"
          >
            {currentQ < questions.length - 1 ? (
              <>Next Question <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            ) : (
              <>Finish Quiz <Sparkles size={18} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
