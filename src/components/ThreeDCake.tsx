import React, { useState } from 'react';
import { audio } from '../utils/audioSynth';
import { Sparkles, Flame, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThreeDCake: React.FC = () => {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [cakeSpinAngle, setCakeSpinAngle] = useState(0);

  const handleBlowOutSingle = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!candlesLit[idx]) return;
    
    audio.playClick('button');
    const nextLit = [...candlesLit];
    nextLit[idx] = false;
    setCandlesLit(nextLit);

    // If all lights are out, trigger giant celebration shower!
    if (nextLit.every(l => !l)) {
      triggerSuccessBurst();
    }
  };

  const handleBlowAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('gift');
    setCandlesLit([false, false, false, false, false]);
    triggerSuccessBurst();
  };

  const triggerSuccessBurst = () => {
    setHasSucceeded(true);
    // Dispatch celebration events
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('celebrate-burst', {
          detail: { 
            x: window.innerWidth * (0.2 + i * 0.15), 
            y: window.innerHeight * (0.3 + Math.random() * 0.2) 
          }
        }));
      }, i * 200);
    }
  };

  const handleRelight = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('admin');
    setCandlesLit([true, true, true, true, true]);
    setHasSucceeded(false);
  };

  const handleSpinCake = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('gallery');
    setCakeSpinAngle(prev => prev + 72);
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl" />

      <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-[11px] uppercase tracking-[0.25em]">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Interactive 3D Layered Cake</span>
      </div>

      <h3 className="text-2xl font-space font-bold text-white mb-2">Make a Birthday Wish</h3>
      <p className="text-neutral-400 text-xs font-sans max-w-sm mb-10">
        Blow out the flickering magic candles by clicking each flame directly, or use the celebration controls below!
      </p>

      {/* 3D SCENE STAGE */}
      <div 
        className="w-full h-72 relative flex items-center justify-center cursor-pointer perspective-800"
        onClick={handleSpinCake}
        title="Click Stage to Spin Cake"
      >
        <div 
          className="relative preserve-3d transition-transform duration-1000 ease-out flex flex-col items-center"
          style={{ transform: `rotateX(-12deg) rotateY(${cakeSpinAngle}deg)` }}
        >
          
          {/* THE CANDLES LAYER */}
          <div className="flex items-end justify-center gap-4 mb-[-12px] relative z-20">
            {candlesLit.map((isLit, idx) => (
              <div 
                key={idx} 
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={(e) => handleBlowOutSingle(idx, e)}
              >
                
                {/* Candle Flame details */}
                <AnimatePresence>
                  {isLit ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-7 h-5 w-3 bg-amber-400 rounded-full blur-[1px]"
                      style={{
                        background: 'radial-gradient(circle, #ffe66d 0%, #ff6b6b 100%)',
                        boxShadow: '0 0 8px #FFD700',
                        transformOrigin: 'bottom center',
                        animation: `float ${0.25 + idx * 0.05}s ease-in-out infinite alternate`
                      }}
                    >
                      <span className="sr-only">Flame</span>
                    </motion.div>
                  ) : (
                    // Smoke puff detail
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: [0, 0.4, 0], y: [-4, -18, -26] }}
                      className="absolute -top-12 h-3.5 w-3.5 bg-neutral-300 rounded-full blur-[2px]"
                      transition={{ duration: 0.8 }}
                    />
                  )}
                </AnimatePresence>

                {/* Candle Stick */}
                <div 
                  className={`h-9 w-2 rounded-t ${
                    idx % 2 === 0 ? 'bg-gradient-to-t from-pink-500 to-rose-400' : 'bg-gradient-to-t from-cyan-500 to-teal-400'
                  } border-l border-white/20`}
                />
              </div>
            ))}
          </div>

          {/* CAKE LAYERS */}
          {/* Layer 1: Top (Smallest) */}
          <div className="relative h-11 w-32 bg-pink-400 rounded-lg shadow-lg border-b-4 border-pink-500 flex items-center justify-center text-[10px] text-white font-semibold font-mono tracking-widest uppercase relative z-10">
            <div className="absolute inset-x-2 -bottom-1 h-3 bg-white/20 rounded-full" /> {/* Cream drip */}
            🎂 SWEET
          </div>

          {/* Layer 2: Mid (Medium) */}
          <div className="relative h-15 w-44 bg-amber-300 rounded-lg shadow-lg border-b-6 border-amber-400 -mt-1 flex items-center justify-center text-xs text-amber-900 font-bold tracking-widest relative z-5">
            <div className="absolute inset-x-3 -bottom-1 h-4 bg-white/35 rounded-full" />
            ☆ DELICIOUS ☆
          </div>

          {/* Layer 3: Base (Large) */}
          <div className="relative h-20 w-56 bg-purple-600 rounded-lg shadow-2xl border-b-8 border-purple-700 -mt-1.5 flex items-center justify-center text-sm text-purple-100 font-black tracking-widest">
            <div className="absolute inset-x-4 -bottom-1 h-5 bg-pink-400/20 rounded-full" />
            HAPPY BIRTHDAY
          </div>

          {/* Stage Pedestal Plate */}
          <div className="h-6 w-64 bg-zinc-800 rounded-full shadow-2xl border-b-4 border-zinc-950 mt-1 flex items-center justify-center" />
        </div>
      </div>

      {/* Celebration controls */}
      <div className="flex flex-col gap-3.5 mt-4 w-full max-w-xs relative z-30">
        {hasSucceeded ? (
          <div className="text-center">
            <motion.p 
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-amber-400 text-sm font-semibold tracking-wide"
            >
              🎉 Perfect! All candles blown! 🎉
            </motion.p>
            <button
              type="button"
              onClick={handleRelight}
              className="mt-3 text-xs text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer font-medium"
            >
              Magic Relight Candles
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleBlowAll}
              className="flex-1 py-2 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-neutral-900 font-space font-bold rounded-xl text-xs transition-all transform active:scale-95 shadow-lg cursor-pointer"
            >
              🎉 Blow Out All Candles
            </button>
            <button
              type="button"
              onClick={handleSpinCake}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl border border-white/5 transition-colors cursor-pointer"
              title="Spin Cake Stage"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
