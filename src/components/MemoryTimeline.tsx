import React, { useState } from 'react';
import { audio } from '../utils/audioSynth';
import { TimelineEvent } from '../types';
import { Calendar, Tag, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface MemoryTimelineProps {
  events: TimelineEvent[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ events }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];
  
  const filteredEvents = activeCategory === 'all'
    ? events
    : events.filter(e => e.category === activeCategory);

  // Sort events (either by preset or dynamic date strings safely)
  const sortedEvents = [...filteredEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="w-full relative">
      
      {/* Category selector row */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => { audio.playClick('nav'); setActiveCategory(cat); }}
            className={`px-3 py-1 text-[11px] font-mono font-medium rounded-full border uppercase transition-all tracking-wider cursor-pointer ${
              activeCategory === cat
                ? 'bg-amber-400 border-amber-400 text-neutral-900 shadow-md'
                : 'bg-neutral-900/40 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Track Line */}
      <div className="absolute left-4 md:left-1/2 top-32 bottom-8 w-[2px] bg-gradient-to-b from-amber-400/50 via-pink-500/50 to-transparent -translate-x-1/2 hidden sm:block" />

      {/* Main Events Stack */}
      <div className="flex flex-col gap-12 relative z-10">
        {sortedEvents.map((evt, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={evt.id}
              className={`flex flex-col sm:flex-row items-stretch gap-6 md:gap-12 relative ${
                isEven ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Bullet Jewel */}
              <div className="absolute left-4 sm:left-1/2 h-7 w-7 rounded-full bg-neutral-900 border-2 border-amber-400 -translate-x-1/2 flex items-center justify-center shadow-lg shadow-amber-400/20 z-10 hidden sm:flex">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              </div>

              {/* Event Card Content */}
              <div className="flex-1 pl-8 sm:pl-0">
                <div 
                  onClick={() => audio.playClick('image')}
                  className="glass-panel p-6 rounded-2xl border border-white/8 hover:border-amber-400/30 transition-all duration-300 shadow-xl relative overflow-hidden group hover:bg-neutral-900/50 cursor-pointer"
                >
                  {/* Category banner badge */}
                  <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[10px] uppercase font-bold tracking-widest mb-2.5">
                    <Tag className="h-3 w-3" />
                    <span>{evt.category}</span>
                  </div>

                  <h4 className="text-lg md:text-xl font-space font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {evt.title}
                  </h4>
                  
                  <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                    {evt.description}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-[11px] font-mono font-medium text-neutral-500">
                    <Calendar className="h-3.5 w-3.5 text-pink-500" />
                    <span>{evt.date}</span>
                  </div>
                </div>
              </div>

              {/* Event custom illustration image (if present) */}
              <div className="flex-1 pl-8 sm:pl-0 sm:flex sm:items-center">
                {evt.mediaUrl ? (
                  <div className="h-44 sm:h-48 w-full rounded-2xl overflow-hidden border border-white/5 shadow-lg group relative cursor-pointer">
                    <img
                      src={evt.mediaUrl}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 to-transparent" />
                  </div>
                ) : (
                  <div className="h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent w-full hidden sm:block" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
