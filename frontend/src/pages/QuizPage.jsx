import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Sparkles, Loader } from 'lucide-react';
import { generateQuiz } from '../services/api';

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

  // Fetch quiz from Gemini on mount
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

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-brand-blue/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-blue animate-spin" />
          <div className="absolute inset-3 rounded-full bg-brand-blue/10 flex items-center justify-center">
            <Sparkles size={24} className="text-brand-blue" />
          </div>
        </div>
        <h3 className="text-2xl font-display font-bold text-brand-text">Generating Quiz...</h3>
        <p className="text-brand-muted font-medium">AI is crafting questions for "<span className="font-bold">{lessonTitle}</span>"</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-5 px-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h3 className="text-2xl font-display font-bold text-brand-text">Quiz Generation Failed</h3>
        <p className="text-brand-muted max-w-md">{error}</p>
        <Link to={-1} className="bg-brand-blue text-white font-bold py-3 px-8 rounded-full mt-2">Go Back</Link>
      </div>
    );
  }

  // ── Results Screen ──
  if (quizDone) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-xl mb-8 ${pct >= 70 ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30' : 'bg-gradient-to-br from-brand-orange to-red-400 shadow-brand-orange/30'}`}>
          {pct >= 70 ? '🏆' : '📚'}
        </div>
        <h2 className="text-4xl font-display font-black text-brand-text mb-2">{pct >= 70 ? 'Great work!' : 'Keep Learning!'}</h2>
        <p className="text-brand-muted text-xl mb-2">You scored <span className="font-black text-brand-text">{score}/{questions.length}</span> ({pct}%)</p>
        <p className="text-brand-muted mb-10 font-medium">"{lessonTitle}"</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => { setCurrentQ(0); setSelected(null); setSubmitted(false); setAnswers(new Array(questions.length).fill(null)); setQuizDone(false); }}
            className="bg-brand-blue text-white font-bold py-4 px-10 rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.4)] hover:-translate-y-0.5 transition-transform"
          >
            Retry Quiz
          </button>
          <Link to={-1} className="bg-white border border-border text-brand-muted font-bold py-4 px-10 rounded-full hover:border-brand-blue/30 hover:text-brand-blue transition-all">
            Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  // ── Quiz UI ──
  return (
    <div className="flex-1 flex flex-col px-6 md:px-10 py-8 max-w-3xl mx-auto w-full">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <Link to={-1} className="flex items-center gap-1.5 text-brand-muted text-sm font-bold hover:text-brand-text transition-colors">
            <ChevronLeft size={16} /> Back
          </Link>
          <span className="text-sm font-extrabold text-brand-muted">Q{currentQ + 1} / {questions.length}</span>
        </div>
        <div className="h-2.5 bg-[#F0ECE6] rounded-full overflow-hidden">
          <div className="h-full bg-brand-blue rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + (submitted ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <div className="flex gap-2 mt-3 justify-center">
          {questions.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === currentQ ? 'w-6 bg-brand-blue' : answers[i] !== null ? (answers[i] === questions[i].correct_index ? 'w-2 bg-green-400' : 'w-2 bg-red-400') : 'w-2 bg-[#E0DBD4]'}`} />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-5xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-border mb-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
            <Sparkles size={18} className="text-brand-blue" />
          </div>
          <span className="text-xs font-extrabold text-brand-muted tracking-widest uppercase">{lessonTitle}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-display font-bold text-brand-text leading-snug">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => {
          let style = 'bg-white border-border hover:border-brand-blue/40 hover:bg-[#F7F4EE]';
          if (submitted) {
            if (i === question.correct_index) style = 'bg-green-50 border-green-400';
            else if (i === selected) style = 'bg-red-50 border-red-400';
            else style = 'bg-white border-border opacity-50';
          } else if (selected === i) {
            style = 'bg-brand-blue/5 border-brand-blue shadow-sm';
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full flex items-start gap-4 p-5 rounded-3xl border-2 text-left font-semibold transition-all text-brand-text ${style}`}>
              <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-black text-xs transition-all ${submitted && i === question.correct_index ? 'border-green-400 bg-green-400 text-white' : submitted && i === selected ? 'border-red-400 bg-red-400 text-white' : selected === i ? 'border-brand-blue bg-brand-blue text-white' : 'border-[#D0CBC4] text-brand-muted'}`}>
                {submitted ? (i === question.correct_index ? '✓' : i === selected ? '✗' : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
              </div>
              <span className="leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {submitted && (
        <div className={`flex gap-4 p-5 rounded-3xl mb-6 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {isCorrect ? <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" /> : <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`font-extrabold mb-1.5 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {isCorrect ? 'Correct! Well done.' : 'Not quite.'}
            </p>
            <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-auto">
        {!submitted ? (
          <button onClick={handleSubmit} disabled={selected === null}
            className="bg-brand-blue disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-darkBlue text-white font-bold py-4 px-10 rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.35)] transition-all hover:-translate-y-0.5">
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext}
            className="flex items-center gap-2 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold py-4 px-10 rounded-full shadow-[0_4px_14px_rgba(22,129,208,0.35)] transition-all hover:-translate-y-0.5">
            {currentQ < questions.length - 1 ? <><span>Next Question</span><ChevronRight size={18} /></> : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
