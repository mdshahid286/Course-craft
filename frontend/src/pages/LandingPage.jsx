import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen, Sparkles, Video, Layers, Zap,
  ArrowRight, CheckCircle, Users, Star,
  FileText, PlayCircle, Brain
} from 'lucide-react';
import { cn } from '../lib/utils';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Course Generation',
    desc: 'Enter any topic and get a fully structured course with modules, lessons, and objectives in under 30 seconds.',
    color: 'bg-brand-green-lighter text-brand-green',
  },
  {
    icon: Video,
    title: 'Manim Animations',
    desc: 'Automatically generate cinematic math visualizations and explainer animations for any concept.',
    color: 'bg-blue-50 text-accent-blue',
  },
  {
    icon: Brain,
    title: 'Smart Quizzes',
    desc: 'AI-generated interactive quizzes with adaptive difficulty to reinforce learning at every step.',
    color: 'bg-purple-50 text-accent-purple',
  },
  {
    icon: Layers,
    title: 'Structured Curriculum',
    desc: 'Pedagogically sound syllabi with clear learning outcomes, organized into modules and lessons.',
    color: 'bg-amber-50 text-accent-amber',
  },
  {
    icon: FileText,
    title: 'YouTube Resources',
    desc: 'Curated video recommendations automatically matched to each lesson topic and difficulty level.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Users,
    title: 'Community Learning',
    desc: 'Share courses, discuss topics, and collaborate with thousands of learners and educators.',
    color: 'bg-green-50 text-brand-green',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'ML Engineer', rating: 5, text: 'CourseCraft generated a complete deep learning curriculum in seconds. The Manim animations are incredibly clear.', avatar: 'SC' },
  { name: 'Prof. David Kim', role: 'Mathematics Professor', rating: 5, text: 'I use it for all my calculus courses now. The AI understands pedagogy — it structures content exactly as I would.', avatar: 'DK' },
  { name: 'Alex Rivera', role: 'Self-taught Developer', rating: 5, text: 'Went from zero to building projects after following a CourseCraft course on system design. Absolutely brilliant.', avatar: 'AR' },
];

const STATS = [
  { value: '500k+', label: 'Courses Generated' },
  { value: '12k+', label: 'Active Learners' },
  { value: '4.9 / 5', label: 'Average Rating' },
  { value: '< 30s', label: 'Generation Time' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app-bg font-sans text-app-fg">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-app-surface/80 backdrop-blur-xl border-b border-app-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center shadow-brand">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="text-lg font-display font-bold text-app-fg">CourseCraft</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-app-muted">
            {['Features', 'Solutions', 'Resources', 'Pricing'].map(item => (
              <a key={item} href="#" className="hover:text-app-fg transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-app-fg hover:text-brand-green transition-colors">
              Sign in
            </Link>
            <Link to="/login" className="btn-brand text-sm">
              Get started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 px-6 text-center overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-app-bg pointer-events-none" />

        {/* Floating widgets */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[5%] top-24 hidden xl:block"
        >
          <div className="bg-app-surface border border-app-border rounded-2xl p-4 shadow-modal w-56">
            <p className="text-xs font-semibold text-app-muted mb-2">Today's progress</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-brand-green" />
                <span className="text-app-fg font-medium truncate">Neural Networks</span>
                <span className="ml-auto text-app-muted">60%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill w-3/5" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[5%] top-20 hidden xl:block"
        >
          <div className="bg-app-surface border border-app-border rounded-2xl p-4 shadow-modal w-52">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center">
                <Zap size={12} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-app-fg">Course generated!</span>
            </div>
            <p className="text-xs text-app-muted">Quantum Computing · 5 modules · 28s</p>
          </div>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green-lighter border border-brand-green/20 text-brand-green text-xs font-semibold mb-8"
          >
            <Sparkles size={12} /> AI-Powered Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-app-fg leading-[1.1] tracking-tight mb-6"
          >
            Build courses that<br />
            <span className="text-brand-green">actually teach.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-app-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enter any topic and our AI generates a complete, structured course with lessons, animations, quizzes, and curated resources — in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/login" className="btn-brand text-base px-8 py-3.5 shadow-brand-lg">
              Start building for free <ArrowRight size={17} />
            </Link>
            <button className="btn-outline text-base px-6 py-3.5 gap-2">
              <PlayCircle size={17} className="text-brand-green" /> Watch demo
            </button>
          </motion.div>

          <p className="text-xs text-app-muted mt-5">No credit card required · Free forever plan available</p>
        </div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="relative max-w-5xl mx-auto mt-16"
        >
          <div className="bg-app-surface border border-app-border rounded-2xl shadow-modal overflow-hidden">
            <div className="h-9 bg-app-surface2 border-b border-app-border flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green-light" />
              <div className="ml-4 flex-1 max-w-xs bg-app-border rounded-md h-4 text-[10px] flex items-center px-2 text-app-muted font-mono">
                coursecraft.ai/dashboard
              </div>
            </div>
            <div className="grid grid-cols-4 h-72 text-left">
              <div className="border-r border-app-border p-4 space-y-1 bg-app-surface">
                {['Dashboard', 'My Courses', 'Build Course', 'Analytics'].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${i === 0 ? 'bg-brand-green-lighter text-brand-green' : 'text-app-muted'}`}>
                    <div className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-brand-green' : 'bg-app-border'}`} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="col-span-3 p-5 bg-app-bg">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Total Courses', val: '24', color: 'bg-brand-green text-white' },
                    { label: 'In Progress', val: '12', color: 'bg-app-surface border border-app-border' },
                    { label: 'Completed', val: '10', color: 'bg-app-surface border border-app-border' },
                  ].map(s => (
                    <div key={s.label} className={cn(s.color, 'rounded-xl p-3')}>
                      <p className={cn('text-lg font-bold', s.color.includes('brand-green') ? 'text-white' : 'text-app-fg')}>{s.val}</p>
                      <p className={cn('text-[10px]', s.color.includes('brand-green') ? 'text-white/70' : 'text-app-muted')}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-app-surface border border-app-border rounded-xl p-4">
                  <p className="text-xs font-semibold text-app-fg mb-3">Recent Courses</p>
                  <div className="space-y-2">
                    {['Quantum Computing Basics', 'Neural Networks & Deep Learning', 'Advanced Calculus III'].map((c, i) => (
                      <div key={c} className="flex items-center gap-3">
                        <div className={cn('w-6 h-6 rounded-lg flex-shrink-0', ['bg-brand-green', 'bg-accent-blue', 'bg-accent-purple'][i])} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-app-fg truncate">{c}</div>
                          <div className="progress-track mt-1 max-w-[100px]">
                            <div className="progress-fill" style={{ width: `${[75, 45, 20][i]}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-app-border bg-app-surface py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-display font-bold text-app-fg mb-1">{stat.value}</p>
              <p className="text-sm text-app-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-green text-xs mb-4">Everything you need</span>
            <h2 className="text-4xl font-display font-bold text-app-fg mb-4">
              One platform, complete learning pipeline
            </h2>
            <p className="text-lg text-app-muted max-w-2xl mx-auto">
              From topic to complete course in seconds. CourseCraft handles the entire educational content pipeline automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="card-hover p-6"
                >
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center mb-4', f.color)}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-app-fg mb-2">{f.title}</h3>
                  <p className="text-sm text-app-muted leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-app-surface border-y border-app-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-app-fg mb-4">
              Loved by learners worldwide
            </h2>
            <div className="flex justify-center gap-1 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-app-muted text-sm">4.9 / 5 average from 2,000+ reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-app-muted leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-app-fg">{t.name}</p>
                    <p className="text-xs text-app-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-brand-green rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 dot-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                Start building better courses today
              </h2>
              <p className="text-brand-green-muted text-lg mb-8 max-w-xl mx-auto font-medium">
                Join 12,000+ educators and learners using CourseCraft to create world-class learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login" className="bg-white text-brand-green font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-green-lighter transition-colors flex items-center gap-2 justify-center shadow-modal">
                  Get started free <ArrowRight size={16} />
                </Link>
                <button className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                  See pricing →
                </button>
              </div>
              <div className="flex items-center justify-center gap-5 mt-8 text-sm text-brand-green-muted font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Free forever plan</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> No credit card needed</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-app-border py-10 px-6 bg-app-surface">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="text-base font-display font-bold text-app-fg">CourseCraft</span>
          </div>
          <p className="text-sm text-app-muted">© {new Date().getFullYear()} CourseCraft AI. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-app-muted font-medium">
            {['Privacy', 'Terms', 'Docs', 'Support'].map(l => (
              <a key={l} href="#" className="hover:text-app-fg transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
