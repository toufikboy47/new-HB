import React, { useState } from 'react';
import { audio } from '../utils/audioSynth';
import { GuestbookWish } from '../types';
import { Heart, Send, Smile, User, ThumbsUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuestbookWishesProps {
  wishes: GuestbookWish[];
  onAddWish: (name: string, message: string, avatar: string) => void;
  onLikeWish: (id: string) => void;
}

export const GuestbookWishes: React.FC<GuestbookWishesProps> = ({
  wishes,
  onAddWish,
  onLikeWish,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop');
  const [success, setSuccess] = useState(false);

  const avatarsList = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop', // Girl 1
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop', // Boy 1
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop', // Girl 2
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop', // Boy 2
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop', // Girl 3
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop', // Boy 3
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    audio.playClick('button');
    onAddWish(name, message, selectedAvatar);
    
    setName('');
    setMessage('');
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playClick('button');
    onLikeWish(id);

    window.dispatchEvent(new CustomEvent('celebrate-burst', {
      detail: { x: e.clientX, y: e.clientY }
    }));
  };

  // Only display wishes that are approved by admin!
  const approvedWishes = wishes.filter(w => w.isApproved);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* LEFT: Wish Submission Form Card */}
      <div className="lg:col-span-1">
        <div className="glass-panel p-6 rounded-2xl border border-white/8 shadow-xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-pink-500 to-amber-400" />
          
          <h3 className="text-lg font-space font-bold text-white mb-1.5 flex items-center gap-2">
            <Send className="h-4 w-4 text-pink-400" />
            <span>Leave a Birthday Wish</span>
          </h3>
          <p className="text-neutral-400 text-xs mb-6 font-sans">
            Write a heartwarming dynamic message to Aria. After moderation, your wish will shine publicly!
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Choose Avatar */}
            <div>
              <label className="text-[11px] font-mono tracking-wide text-neutral-400 uppercase mb-2 block">
                Select Your Guest Avatar
              </label>
              
              <div className="flex gap-2 justify-between">
                {avatarsList.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { audio.playClick('gallery'); setSelectedAvatar(av); }}
                    className={`h-9 w-9 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedAvatar === av ? 'border-amber-400 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="avatar" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-[11px] font-mono tracking-wide text-neutral-400 uppercase mb-1.5 block">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Parker"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors font-sans pl-10"
                />
                <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-neutral-500" />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-[11px] font-mono tracking-wide text-neutral-400 uppercase mb-1.5 block">
                Your Greeting Message
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write your sweet cosmic message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors font-sans resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="mt-2 py-2.5 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-neutral-900 font-bold font-space rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-[0.98] shadow-lg"
            >
              <span>Transmit Wish Portal</span>
              <Send className="h-3.5 w-3.5 fill-current" />
            </button>
          </form>

          {/* Success card feedback */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-[11px] text-center font-sans"
              >
                🎉 Perfect! Your wish has been sent to the moderator successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: Live approved wishes wall board */}
      <div className="lg:col-span-2">
        <h3 className="text-xl font-space font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          <span>The Global Celebration Board ({approvedWishes.length})</span>
        </h3>

        {approvedWishes.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center flex flex-col items-center">
            <p className="text-neutral-400 text-sm font-sans mb-1">Silence in the universe...</p>
            <p className="text-neutral-500 text-xs font-mono">No wishes have been approved yet. Write the very first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {approvedWishes.map((wish) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={wish.id}
                  className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between"
                  onClick={(e) => handleLike(wish.id, e)}
                  title="Click to Send Love"
                >
                  <div className="flex gap-4">
                    {/* Guest Avatar */}
                    <div className="h-11 w-11 rounded-full overflow-hidden border border-white/10 shrink-0 shadow-md">
                      <img src={wish.avatar} alt="avatar" className="h-full w-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white tracking-tight">{wish.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        {new Date(wish.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      
                      <p className="text-neutral-300 text-xs mt-3 leading-relaxed font-sans">{wish.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                    <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest flex items-center gap-1.5">
                      <Heart className="h-3 w-3 text-red-500 fill-current" />
                      <span>LOVE MULTIPLIER</span>
                    </span>
                    
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-xs text-rose-400 font-medium font-mono"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{wish.likes}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
};
