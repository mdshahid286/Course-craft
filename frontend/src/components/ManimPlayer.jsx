import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Code } from 'lucide-react';

export default function ManimPlayer({ animation, onComplete }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const requestRef = useRef();
  const startTimeRef = useRef();

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(requestRef.current);
      return;
    }

    startTimeRef.current = performance.now() - currentTime * 1000;

    const animate = (time) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = (time - startTimeRef.current) / 1000;
      setCurrentTime(progress);

      const totalDuration =
        animation?.steps?.reduce((max, s) => Math.max(max, s.startAt + s.duration), 0) || 0;

      if (progress >= totalDuration + 1) {
        setIsPlaying(false);
        if (onComplete) onComplete();
        return;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    startTimeRef.current = null;
  };

  const renderStep = (step, index) => {
    if (currentTime < step.startAt) return null;
    if (currentTime > step.startAt + step.duration + 2) return null; // Keep visible for a few seconds after

    const { type, content, shapeType, position, style, animation: animType, moveTo, duration } = step;

    const commonProps = {
      initial: animType === "scale-up" ? { scale: 0, opacity: 0 } : { opacity: 0 },
      animate: { 
        opacity: 1, 
        scale: 1,
        x: moveTo ? `${moveTo.x}%` : undefined,
        y: moveTo ? `${moveTo.y}%` : undefined,
      },
      transition: { duration: duration, ease: "easeInOut" },
      style: {
        position: 'absolute',
        top: `${position.y}%`,
        left: `${position.x}%`,
        color: style.color || 'white',
        fontSize: style.size ? `${style.size}px` : '16px',
        fontWeight: 'bold',
        transform: 'translate(-50%, -50%)',
      }
    };

    if (type === 'text' || type === 'formula') {
      return (
        <motion.div key={index} {...commonProps}>
          {type === 'formula' ? `\\(${content}\\)` : content}
        </motion.div>
      );
    }

    if (type === 'shape') {
      const Shape = motion[shapeType === 'circle' ? 'div' : shapeType === 'square' ? 'div' : 'div'];
      return (
        <Shape
          key={index}
          {...commonProps}
          style={{
            ...commonProps.style,
            width: shapeType === 'line' ? '100px' : `${style.size || 50}px`,
            height: shapeType === 'line' ? `${style.strokeWidth || 2}px` : `${style.size || 50}px`,
            backgroundColor: shapeType === 'line' ? style.color : 'transparent',
            border: shapeType !== 'line' ? `${style.strokeWidth || 2}px solid ${style.color}` : 'none',
            borderRadius: shapeType === 'circle' ? '50%' : '4px',
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="relative w-full aspect-video bg-[#1a1a1a] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Animation Canvas */}
      <div className="absolute inset-0 p-8">
        <AnimatePresence>
          {animation?.steps?.map((step, i) => renderStep(step, i))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-brand-blue transition-colors">
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button onClick={reset} className="text-white hover:text-brand-blue transition-colors">
            <RotateCcw size={20} />
          </button>
          
          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-blue transition-all duration-100" 
              style={{ width: `${Math.min(100, (currentTime / (animation?.steps?.reduce((max, s) => Math.max(max, s.startAt + s.duration), 0) || 1)) * 100)}%` }} 
            />
          </div>

          <button onClick={() => setShowCode(!showCode)} className={`p-2 rounded-lg transition-colors ${showCode ? 'bg-brand-blue/20 text-brand-blue' : 'text-white'}`}>
            <Code size={20} />
          </button>
        </div>
      </div>

      {/* Code Overlay */}
      <AnimatePresence>
        {showCode && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 bottom-16 w-80 bg-black/90 backdrop-blur-md rounded-2xl border border-white/20 p-4 font-mono text-xs text-brand-blue overflow-y-auto z-10"
          >
            <div className="flex justify-between items-center mb-3 text-white/50 uppercase tracking-widest font-bold">
              <span>Manim Python Code</span>
            </div>
            <pre className="whitespace-pre-wrap">{animation?.pythonCode}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlaying && currentTime === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
           <button 
             onClick={() => setIsPlaying(true)}
             className="w-16 h-16 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
           >
             <Play size={28} className="ml-1" fill="currentColor" />
           </button>
        </div>
      )}
    </div>
  );
}
