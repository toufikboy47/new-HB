import React, { useState } from 'react';
import { audio } from '../utils/audioSynth';
import { HelpCircle, Star, Sparkles, Smile, RefreshCw, Trophy, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const EasterEggs: React.FC = () => {
  const [clickCount, setClickCount] = useState(0);
  const [activeSecretIndex, setActiveSecretIndex] = useState<number | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [fortuneMsg, setFortuneMsg] = useState('');

  const secretGifts = [
    {
      title: "The Celestial Sparkler Oracle",
      desc: "Flip to unlock a customizable warm dynamic fortune from the stars.",
      fortunes: [
        "🌌 This orbit brings an abundance of unexpected midnight laughter and major breakthroughs!",
        "🔥 A monumental coffee run is in your direct future, resulting in five new core memories.",
        "🍕 You will eat a slice of pizza so perfectly cheese-pulled that it makes you shed one happy tear.",
        "✨ A massive cosmic shift indicates that your upcoming roadtrip is destined for absolute perfection."
      ]
    },
    {
      title: "The Ultimate Birthday Popper",
      desc: "An absurdly interactive button that triggers recursive double-fireworks bursts upon rapid clicks!"
    },
    {
      title: "Aria's Perfect Companion Quiz",
      desc: "Reveal a secret quiz answering card to see if you are truly Aria's cosmic soul companion!"
    }
  ];

  const handleRevealSecret = (idx: number) => {
    audio.playClick('button');
    setActiveSecretIndex(idx);

    if (idx === 0) {
      const items = secretGifts[0].fortunes || [];
      const chosen = items[Math.floor(Math.random() * items.length)];
      setFortuneMsg(chosen);
    }

    if (!unlockedAchievements.includes(secretGifts[idx].title)) {
      setUnlockedAchievements(prev => [...prev, secretGifts[idx].title]);
    }
  };

  const handlePopperClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('firework');
    setClickCount((p) => p + 1);

    // Dynamic explosive bursts
    window.dispatchEvent(new CustomEvent('celebrate-burst', {
      detail: { x: e.clientX, y: e.clientY }
    }));

    if (clickCount + 1 >= 5 && !unlockedAchievements.includes("Grand Firework Popper Champion")) {
      audio.playClick('admin');
      setUnlockedAchievements((p) => [...p, "Grand Firework Popper Champion"]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {secretGifts.map((secret, idx) => {
        const isUnlocked = unlockedAchievements.includes(secret.title);

        return (
          <div 
            key={idx}
            className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-400/20 shadow-xl transition-all relative overflow-hidden group hover:bg-neutral-900/40"
          >
            {/* Achieved Badge Indicator */}
            {isUnlocked && (
              <div className="absolute top-3 right-3 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1">
                <Trophy className="h-2.5 w-2.5" />
                <span>Unlocked</span>
              </div>
            )}

            <div className="h-10 w-10 bg-amber-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Star className="h-5 w-5 text-amber-400 fill-current" />
            </div>

            <h4 className="text-base font-space font-semibold text-white mb-2">{secret.title}</h4>
            <p className="text-neutral-400 text-xs leading-relaxed mb-6 font-sans">{secret.desc}</p>

            <button
              type="button"
              onClick={() => handleRevealSecret(idx)}
              className="py-1.5 w-full bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-[11px] font-mono tracking-widest uppercase transition-all cursor-pointer border border-white/5"
            >
              Reveal Easter Egg
            </button>
          </div>
        );
      })}

      {/* POPUP CARD DETAILS SECTION */}
      <AnimatePresence>
        {activeSecretIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-sm z-55 flex items-center justify-center p-4"
            onClick={() => { audio.playClick('button'); setActiveSecretIndex(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-panel max-w-sm w-full p-8 rounded-3xl border border-white/10 shadow-2xl relative text-center flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => { audio.playClick('button'); setActiveSecretIndex(null); }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white font-mono text-xs cursor-pointer px-2 py-1"
              >
                ESC X
              </button>

              <div className="h-12 w-12 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-amber-300" />
              </div>

              <h3 className="text-lg font-space font-bold text-white mb-2">
                {secretGifts[activeSecretIndex].title}
              </h3>

              {/* CARD SPECIFIC LOGICS */}
              {activeSecretIndex === 0 && (
                <div className="flex flex-col items-center gap-4 mt-2">
                  <p className="text-amber-300 font-mono text-xs uppercase tracking-widest bg-amber-400/5 px-3 py-1 rounded">
                    Your Star Oracle Prediction
                  </p>
                  
                  <div className="p-4 bg-black/40 rounded-xl text-neutral-300 text-xs text-balance leading-relaxed italic border border-white/5 font-serif">
                    "{fortuneMsg}"
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRevealSecret(0)}
                    className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white font-mono cursor-pointer transition-colors mt-2"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin-slow" />
                    <span>Recast Oracle</span>
                  </button>
                </div>
              )}

              {activeSecretIndex === 1 && (
                <div className="flex flex-col items-center gap-4 mt-2 w-full">
                  <p className="text-neutral-400 text-xs">
                    Rapidly click the bursting target below to unwrap consecutive firework blasts!
                  </p>

                  <button
                    type="button"
                    onClick={handlePopperClick}
                    className="h-20 w-20 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 hover:scale-105 active:scale-95 transition-all text-neutral-950 font-bold font-space flex items-center justify-center border-4 border-neutral-900 shadow-xl cursor-pointer"
                  >
                    BOOM!
                  </button>

                  <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded">
                    💥 CLICKS: {clickCount} 💥
                  </span>
                </div>
              )}

              {activeSecretIndex === 2 && (
                <div className="flex flex-col items-center gap-4 mt-2">
                  <p className="text-neutral-400 text-xs">
                    Answer this correctly in your heart: "What color was the hot chocolate spilled in Summer 2018?"
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => { audio.playClick('button'); alert("Nice try, but it was actually Marshmallow White!"); }}
                      className="p-2.5 bg-neutral-900 border border-white/5 hover:bg-neutral-800 rounded-lg text-xs text-neutral-300 cursor-pointer font-mono"
                    >
                      Dark Brown
                    </button>
                    <button
                      type="button"
                      onClick={() => { audio.playClick('admin'); alert("CORRECT! You true soulmate!"); }}
                      className="p-2.5 bg-neutral-900 border border-white/5 hover:bg-neutral-800 rounded-lg text-xs text-neutral-300 cursor-pointer font-mono"
                    >
                      Marshmallow White
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
