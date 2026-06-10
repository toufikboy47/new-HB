import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../utils/audioSynth';
import { Mail, MailOpen, AlertCircle, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HandwrittenLetterProps {
  letterText: string;
  friendName: string;
}

export const HandwrittenLetter: React.FC<HandwrittenLetterProps> = ({
  letterText,
  friendName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const typingTimerRef = useRef<any>(null);

  const handleToggleLetter = () => {
    audio.playClick('card');
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      // Trigger confetti/particle burst when letter is opened
      window.dispatchEvent(new CustomEvent('celebrate-burst', {
        detail: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.45 }
      }));
      setCharIndex(0);
      setTypedText('');
    } else {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    }
  };

  // Custom Typing Simulation for high craftsmanship!
  useEffect(() => {
    if (isOpen && charIndex < letterText.length) {
      typingTimerRef.current = setInterval(() => {
        setTypedText((prev) => prev + letterText.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 15); // Fast typing pace
    }

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
    };
  }, [isOpen, charIndex, letterText]);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. Envelope Visual Unit */}
      <div 
        onClick={handleToggleLetter}
        className="max-w-md w-full glass-panel p-6 rounded-3xl border border-white/8 hover:border-pink-500/30 transition-all duration-300 flex flex-col items-center cursor-pointer shadow-2xl relative overflow-hidden group hover:bg-neutral-900/40"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl group-hover:bg-pink-500/10 transition-all" />

        <div className="relative h-20 w-20 flex items-center justify-center bg-pink-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
          {isOpen ? (
            <MailOpen className="h-10 w-10 text-pink-400 animate-bounce" />
          ) : (
            <Mail className="h-10 w-10 text-pink-400 animate-pulse" />
          )}
          <Heart className="h-4 w-4 text-rose-500 absolute center fill-current" style={{ marginTop: '4px' }} />
        </div>

        <h3 className="text-xl font-space font-bold text-white mt-4 tracking-tight">
          {isOpen ? "Aria's Letter Unfolded" : "A Sealed Whispering Letter"}
        </h3>
        
        <p className="text-neutral-400 text-xs text-center mt-2 font-mono leading-relaxed max-w-xs uppercase tracking-wide">
          {isOpen ? "Tap to reseal the envelope" : `Click to break the secret heart wax seal`}
        </p>
      </div>

      {/* 2. Expanded Premium Handwritten Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full mt-8 max-w-2xl overflow-hidden"
          >
            <div className="bg-[#FAF7EE] text-neutral-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-[#FAF7EE] relative group leading-relaxed font-serif animate-float-slow">
              
              {/* Gold decorative border accents inside sheets */}
              <div className="absolute inset-4 border border-rose-950/10 rounded-2xl pointer-events-none" />

              {/* Watermark brand decorative symbol */}
              <div className="absolute bottom-6 right-6 opacity-10 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest font-black">
                <Sparkles className="h-4 w-4" />
                <span>MEMORIAE</span>
              </div>

              {/* Typing handwriting body text field */}
              <div className="handwritten-font min-h-[300px] whitespace-pre-wrap text-base md:text-lg">
                {typedText}
                {charIndex < letterText.length && (
                  <span className="inline-block w-[2px] h-5 bg-pink-600 ml-0.5 animate-pulse" />
                )}
              </div>

              {/* Action row at bottom of letter */}
              <div className="flex justify-between items-center mt-10 pt-4 border-t border-rose-950/10 font-mono text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                <span>Ref: Birthday Orbit 2026</span>
                <span className="text-rose-600">With All My Heart</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
