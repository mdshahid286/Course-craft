import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Car, Sparkles, Video, BookOpen, Layers, 
  Zap, ArrowRight, PlayCircle, Code, ChevronRight, CheckCircle2 
} from 'lucide-react';

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const mockupRotateX = useTransform(scrollYProgress, [0, 0.4], [15, 0]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.4], [0.95, 1]);
  const mockupTranslateY = useTransform(scrollYProgress, [0, 0.4], [50, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#FAFAFA] font-sans selection:bg-brand-blue selection:text-white overflow-hidden text-slate-900">
      
      {/* Navbar - Light Theme */}
      <nav className="fixed top-0 w-full z-50 bg-[#FAFAFA]/80 backdrop-blur-2xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-md shadow-brand-blue/20">
              <Car size={20} className="text-white" />
            </div>
            <span className="text-xl font-display font-black tracking-tight text-slate-900">
              CourseCraft
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-blue transition-colors">
              Log in
            </Link>
            <Link to="/login" className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] flex items-center gap-2">
              Start Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 overflow-hidden">
        {/* Animated Background Orbs */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] pointer-events-none opacity-[0.15]"
        >
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-blue rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] mix-blend-multiply"></div>
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-400 rounded-full blur-[100px] mix-blend-multiply"></div>
        </motion.div>

        <motion.div style={{ y: heroY }} className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-brand-blue text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-sm"
          >
            <Sparkles size={14} className="text-brand-blue animate-pulse" /> Introducing AI Video Engine
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-black tracking-tight text-slate-900 mb-8 leading-[1.05]"
          >
            Teach the world.<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-indigo-500 to-purple-600">
              Generate the curriculum.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            The first AI-native course builder. Transform any prompt into a fully structured syllabus, deeply educational markdown lessons, and stunning cinematic Manim animations in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-full text-lg shadow-[0_4px_20px_rgba(22,129,208,0.3)] transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5 mt-1">
              Start Building Free 
              <motion.div className="group-hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </motion.div>
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-full text-lg hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm group mt-1 hover:-translate-y-0.5">
              <PlayCircle size={20} className="text-slate-400 group-hover:text-brand-blue transition-colors" /> View Live Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Floating 3D Mockup */}
        <div className="w-full mt-20 perspective-[2000px] px-6">
          <motion.div 
            style={{ 
              rotateX: mockupRotateX, 
              scale: mockupScale,
              y: mockupTranslateY,
              transformStyle: "preserve-3d"
            }}
            className="max-w-6xl mx-auto bg-white backdrop-blur-xl rounded-t-[2.5rem] border border-slate-200 shadow-[0_-20px_80px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {/* Mac Window Controls */}
            <div className="h-14 bg-slate-50 border-b border-slate-100 flex items-center px-6 gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
            </div>
            
            {/* Simulated UI Content */}
            <div className="p-8 md:p-12 h-[300px] md:h-[600px] relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
               {/* UI Graphic */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
                  {/* Prompt Box */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="w-3/4 mx-auto bg-white/80 backdrop-blur-2xl p-6 rounded-2xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mb-8 relative"
                  >
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 blur-xl opacity-50 -z-10"></div>
                    <div className="flex gap-4 items-center relative">
                      <Sparkles className="text-brand-blue" />
                      <div className="flex-1 text-xl font-display text-slate-800">Generate a course on Quantum Computing...</div>
                      <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center shadow-md">
                        <ArrowRight size={18} className="text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Course Loading State */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="w-full bg-white backdrop-blur-2xl p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex gap-8 items-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       >
                         <Layers size={28} className="text-brand-blue" />
                       </motion.div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-bold text-xl text-slate-900">Architecting Syllabus</h4>
                        <span className="text-brand-blue font-bold text-sm">34%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "34%" }}
                          transition={{ delay: 2, duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-brand-blue rounded-full shadow-sm"
                        ></motion.div>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider"><CheckCircle2 size={12} className="text-emerald-500"/> Context Loaded</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider"><motion.div animate={{opacity:[0.5,1,0.5]}} transition={{duration:1, repeat:Infinity}} className="w-2 h-2 rounded-full bg-brand-blue"></motion.div> Generating Models...</div>
                      </div>
                    </div>
                  </motion.div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 relative z-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:w-2/3">
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-slate-900 mb-6">
              A studio for the mind.
            </h2>
            <p className="text-slate-500 text-xl font-medium">
              We eliminated the mechanical parts of course creation. What used to take months now takes seconds, with higher pedagogical quality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Feature 1 - Large spanning */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-[2.5rem] p-10 border border-slate-100 relative overflow-hidden group shadow-sm"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(22,129,208,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex flex-col h-full justify-between relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-blue mb-6 shadow-[0_4px_14px_rgba(0,0,0,0.05)]">
                  <Video size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-display text-slate-900 mb-4">Cinematic Engine</h3>
                  <p className="text-slate-600 font-medium text-lg leading-relaxed max-w-md">
                    We automatically write Python Manim scripts to render beautiful, 60fps educational animations. Complex math and physics visualizers generated on the fly.
                  </p>
                </div>
              </div>
              
              {/* Abstract decorative code graphic */}
              <div className="absolute -right-20 -bottom-20 w-[400px] h-[300px] bg-slate-900 border border-slate-800 rounded-tl-3xl p-6 rotate-12 transform-gpu shadow-2xl">
                 <div className="font-mono text-xs text-blue-300 space-y-2 opacity-80">
                   <p><span className="text-pink-400">class</span> QuantumCircuit(<span className="text-orange-300">Scene</span>):</p>
                   <p className="pl-4"><span className="text-pink-400">def</span> <span className="text-green-300">construct</span>(self):</p>
                   <p className="pl-8">qubit = Circle(radius=<span className="text-purple-300">1.5</span>, color=BLUE)</p>
                   <p className="pl-8">self.play(Create(qubit))</p>
                   <p className="pl-8">self.play(qubit.animate.scale(<span className="text-purple-300">0.5</span>))</p>
                   <p className="pl-8 text-slate-500 italic"># AI Generated Frame...</p>
                 </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-3">Instant Architecture</h3>
                <p className="text-slate-500 font-medium text-sm">
                  Type a concept and get a structured, pedagogical syllabus with targeted learning objectives instantly.
                </p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 mb-3">Rich Markdown</h3>
                <p className="text-slate-500 font-medium text-sm">
                  Detailed, professionally formatted lesson content with semantic headings and key takeaways.
                </p>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
            >
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest mb-4">
                  Developer Interface
                </div>
                <h3 className="text-3xl font-bold font-display text-slate-900 mb-4">Integrate Anywhere</h3>
                <p className="text-slate-500 font-medium text-lg">
                  Every course is exportable as a standardized JSON payload. Integrate our AI generation into your existing LMS, mobile app, or corporate knowledge base.
                </p>
              </div>
              <div className="w-full md:w-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 font-mono text-sm text-slate-300 shadow-xl">
                <p><span className="text-pink-400">const</span> <span className="text-blue-300">course</span> = <span className="text-pink-400">await</span> ai.<span className="text-yellow-200">generate</span>({'{'}</p>
                <p className="pl-4">topic: <span className="text-green-300">"Neural Networks"</span>,</p>
                <p className="pl-4">difficulty: <span className="text-green-300">"Advanced"</span></p>
                <p>{'})'}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden text-center bg-slate-900">
        <div className="absolute inset-0 bg-brand-blue/10 backdrop-blur-3xl z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[150px]"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tight text-white mb-8">
            Start building the future of education.
          </h2>
          <p className="text-xl text-blue-100 font-medium mb-12 max-w-2xl mx-auto">
            Join thousands of creators who are already automating curriculum generation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/login" className="px-10 py-5 bg-white text-slate-900 hover:bg-slate-50 font-black text-xl rounded-full shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:-translate-y-1 transition-all flex items-center gap-3">
              Build Your First Course <ArrowRight strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 px-6 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
              <Car size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-slate-900 text-xl">CourseCraft</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Manifesto</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
