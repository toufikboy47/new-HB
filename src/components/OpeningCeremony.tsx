import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audioSynth';
import { Gift, Calendar, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OpeningCeremonyProps {
  friendName: string;
  birthdayDate: string;
  websiteTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  onUnlocked: () => void;
}

export const OpeningCeremony: React.FC<OpeningCeremonyProps> = ({
  friendName,
  birthdayDate,
  websiteTitle,
  heroTitle,
  heroSubtitle,
  onUnlocked,
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isGiftHovered, setIsGiftHovered] = useState(false);
  const [isUnwrapping, setIsUnwrapping] = useState(false);

  // COUNTDOWN LOGGER
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(birthdayDate) - +new Date();
      let left = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        left = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return left;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [birthdayDate]);

  const handleUnwrap = () => {
    audio.playClick('gift');
    setIsUnwrapping(true);

    // Trigger three consecutive canvas fireworks bursts
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('celebrate-burst', { 
        detail: { x: window.innerWidth * 0.3, y: window.innerHeight * 0.4 } 
      }));
    }, 300);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('celebrate-burst', { 
        detail: { x: window.innerWidth * 0.7, y: window.innerHeight * 0.35 } 
      }));
    }, 700);

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('celebrate-burst', { 
        detail: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 } 
      }));
      // Lock unlock state
      onUnlocked();
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col justify-center items-center px-4 py-12 z-20 bg-[radial-gradient(circle_at_center,_#2a1005_0%,_#0a0502_70%)] text-slate-200 font-sans">
      
      {/* Decorative Star points and Orbs from Immersive UI design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-40 w-2 h-2 bg-white/40 rounded-full blur-[1px]"></div>
        <div className="absolute top-60 right-60 w-3 h-3 bg-orange-500/20 rounded-full blur-[4px]"></div>
        <div className="absolute bottom-40 left-1/4 w-1 h-1 bg-blue-400/30 rounded-full blur-[1px]"></div>
        <div className="absolute top-1/2 right-20 w-4 h-4 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-1/3 w-32 h-32 border border-white/5 rounded-full"></div>
      </div>

      {/* OS System branding at the top-left */}
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
        <h1 className="text-xs font-bold tracking-widest uppercase text-white/50 font-mono">
          {websiteTitle || "Surprise OS v4.0"}
        </h1>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Decorative dynamic crown/stars */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2 mb-4 text-orange-500 font-mono text-xs uppercase tracking-[0.25em]"
        >
          <Sparkles className="h-4 w-4 animate-spin-slow" />
          <span>Interactive Surprise Console</span>
          <Sparkles className="h-4 w-4 animate-spin-slow" />
        </motion.div>

        {/* Immersive typography header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-1 mb-4 text-center"
        >
          <p className="text-orange-500 uppercase tracking-[0.4em] text-xs font-bold font-sans">
            {heroTitle || "To the one and only"}
          </p>
          <h2 className="text-7xl md:text-8xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-none py-2">
            {friendName}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center justify-center gap-4 mb-8 w-full"
        >
          <div className="h-[1px] w-12 bg-white/20"></div>
          <p className="text-xs md:text-sm font-light tracking-widest uppercase text-slate-300 font-sans">
            Happy Birthday
          </p>
          <div className="h-[1px] w-12 bg-white/20"></div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-neutral-400 text-xs md:text-sm font-sans max-w-xl mb-12 text-balance leading-relaxed"
        >
          {heroSubtitle}
        </motion.p>

        {/* Dynamic Glowing Countdown Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-4 gap-3 md:gap-4 max-w-lg mb-12 font-space"
        >
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HOURS", val: timeLeft.hours },
            { label: "MINS", val: timeLeft.minutes },
            { label: "SECS", val: timeLeft.seconds }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-xl border border-white/10 flex flex-col items-center shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
              <span className="text-xl md:text-3xl font-semibold text-white tracking-tight tabular-nums">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] md:text-[10px] text-orange-500 font-medium tracking-widest mt-1 font-mono">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Interactive 3D CSS Gift Box Unwrapping */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center gap-6 cursor-pointer"
          onClick={handleUnwrap}
          onMouseEnter={() => { setIsGiftHovered(true); audio.playClick('gallery'); }}
          onMouseLeave={() => setIsGiftHovered(false)}
        >
          <div className="relative h-44 w-44 flex items-center justify-center">
            
            {/* Pulsing light rings */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-pink-500/20 blur-xl transition-transform duration-500 ${isGiftHovered ? 'scale-125' : 'scale-100'}`} />

            {/* UNWRAPPING ANIMATION TRIGGER */}
            <AnimatePresence>
              {!isUnwrapping ? (
                <motion.div
                  exit={{ scale: 0.8, rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative preserve-3d"
                  animate={isGiftHovered ? {
                    y: [0, -10, 0],
                    rotate: [0, -4, 4, -4, 0]
                  } : {}}
                  style={{ animationDuration: '0.5s' }}
                >
                  {/* CSS 3D Box drawing structure */}
                  <div className="relative h-28 w-28 bg-gradient-to-tr from-rose-600 to-pink-500 rounded-lg shadow-2xl border border-white/10 flex items-center justify-center">
                    
                    {/* Golden Ribbon Strip - Vertical */}
                    <div className="absolute top-0 bottom-0 left-1/2 -ml-2.5 w-5 bg-amber-400 shadow-md" />
                    
                    {/* Golden Ribbon Strip - Horizontal */}
                    <div className="absoluteleft-0 right-0 top-1/2 -mt-2.5 h-5 bg-amber-400 shadow-md" />

                    {/* Ribbon knot ribbon on top */}
                    <div className="absolute -top-4 left-1/2 -ml-6 h-6 w-12 bg-amber-400 rounded-full border border-amber-300 shadow-md flex items-center justify-center">
                      <Heart className="h-3 w-3 text-pink-600 fill-current" />
                    </div>

                    <div className="absolute z-10 flex flex-col items-center text-[10px] text-white font-mono tracking-widest font-semibold uppercase">
                      <Gift className="h-5 w-5 mb-1 animate-pulse" />
                      <span>UNWRAP</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  className="flex flex-col items-center justify-center text-orange-400 font-mono text-sm tracking-widest gap-2"
                >
                  <Sparkles className="h-8 w-8 animate-spin text-orange-300" />
                  <span>UNLEASHING CELEBRATION...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-2">
            <button className="group relative px-12 py-4 bg-transparent border border-white/20 rounded-full text-xs uppercase tracking-widest hover:border-white/40 transition-all font-mono text-white">
              <span className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-orange-500/10 transition-colors"></span>
              Unlock the Surprise
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
