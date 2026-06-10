import React, { useState, useEffect } from 'react';
import { audio } from './utils/audioSynth';
import { AppConfig, TimelineEvent, GalleryMedia, GuestbookWish, ActivityLog, AppStats } from './types';
import {
  initialConfig, initialTimelineEvents, initialGalleryMedia, initialWishes
} from './data';
import { DynamicCanvas } from './components/DynamicCanvas';
import { AudioPlayerHUD } from './components/AudioPlayerHUD';
import { OpeningCeremony } from './components/OpeningCeremony';
import { ThreeDCake } from './components/ThreeDCake';
import { CelebrationGallery } from './components/CelebrationGallery';
import { MemoryTimeline } from './components/MemoryTimeline';
import { HandwrittenLetter } from './components/HandwrittenLetter';
import { EasterEggs } from './components/EasterEggs';
import { GuestbookWishes } from './components/GuestbookWishes';
import { AdminPanel } from './components/AdminPanel';
import { Settings, Heart, Sparkles, Navigation, ShieldCheck, ArrowUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Database States loading from Local Storage falling back to Presets
  const [dbConfig, setDbConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('celebrate_config');
    return saved ? JSON.parse(saved) : { ...initialConfig };
  });

  const [dbTimeline, setDbTimeline] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('celebrate_timeline');
    return saved ? JSON.parse(saved) : [...initialTimelineEvents];
  });

  const [dbMedia, setDbMedia] = useState<GalleryMedia[]>(() => {
    const saved = localStorage.getItem('celebrate_media');
    return saved ? JSON.parse(saved) : [...initialGalleryMedia];
  });

  const [dbWishes, setDbWishes] = useState<GuestbookWish[]>(() => {
    const saved = localStorage.getItem('celebrate_wishes');
    return saved ? JSON.parse(saved) : [...initialWishes];
  });

  const [dbLogs, setDbLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('celebrate_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'l1', action: "Celebration workspace initialized in sandbox.", timestamp: new Date().toISOString() },
    ];
  });

  const [dbStats, setDbStats] = useState<AppStats>(() => {
    const saved = localStorage.getItem('celebrate_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        visitorCount: parsed.visitorCount + 1 // Always increment visitor views on refresh!
      };
    }
    return { visitorCount: 1, totalLikes: 243, totalWishes: 3 };
  });

  // Flow State
  const [isUnlocked, setIsUnlocked] = useState(() => {
    const session = sessionStorage.getItem('portal_unlocked');
    return session === 'true';
  });
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync state to local storage when changes happen
  const handleSaveConfig = (cfg: AppConfig) => {
    setDbConfig(cfg);
    localStorage.setItem('celebrate_config', JSON.stringify(cfg));
  };

  const handleUpdateTimeline = (timeline: TimelineEvent[]) => {
    setDbTimeline(timeline);
    localStorage.setItem('celebrate_timeline', JSON.stringify(timeline));
  };

  const handleUpdateMedia = (media: GalleryMedia[]) => {
    setDbMedia(media);
    localStorage.setItem('celebrate_media', JSON.stringify(media));
  };

  const handleUpdateWishes = (wishes: GuestbookWish[]) => {
    setDbWishes(wishes);
    localStorage.setItem('celebrate_wishes', JSON.stringify(wishes));
  };

  const handleAddLog = (action: string) => {
    const log: ActivityLog = {
      id: "log_" + Date.now(),
      action,
      timestamp: new Date().toISOString(),
    };
    const updated = [log, ...dbLogs].slice(0, 50); // CAP at latest 50 logs of audits
    setDbLogs(updated);
    localStorage.setItem('celebrate_logs', JSON.stringify(updated));
  };

  const handleResetStats = () => {
    const freshStats = { visitorCount: 1, totalLikes: 0, totalWishes: 0 };
    setDbStats(freshStats);
    localStorage.setItem('celebrate_stats', JSON.stringify(freshStats));

    const defaultLogs = [
      { id: 'l1', action: "Audit and statistics analytics manually cleared.", timestamp: new Date().toISOString() }
    ];
    setDbLogs(defaultLogs);
    localStorage.setItem('celebrate_logs', JSON.stringify(defaultLogs));
  };

  const handleMediaLike = (id: string) => {
    const updatedMedia = dbMedia.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
    handleUpdateMedia(updatedMedia);

    // Increment overall statistics
    const updatedStats = { ...dbStats, totalLikes: dbStats.totalLikes + 1 };
    setDbStats(updatedStats);
    localStorage.setItem('celebrate_stats', JSON.stringify(updatedStats));
  };

  const handleAddWish = (name: string, message: string, avatar: string) => {
    const newWish: GuestbookWish = {
      id: "wish_" + Date.now(),
      name,
      message,
      timestamp: new Date().toISOString(),
      isApproved: false, // Default unapproved for dynamic moderation panels!
      avatar,
      likes: 0
    };
    const updated = [newWish, ...dbWishes];
    handleUpdateWishes(updated);

    // Update statistics
    const updatedStats = { ...dbStats, totalWishes: dbStats.totalWishes + 1 };
    setDbStats(updatedStats);
    localStorage.setItem('celebrate_stats', JSON.stringify(updatedStats));

    handleAddLog(`Guest wish submitted from: ${name}`);
  };

  const handleLikeWish = (id: string) => {
    const updated = dbWishes.map(w => w.id === id ? { ...w, likes: w.likes + 1 } : w);
    handleUpdateWishes(updated);

    // Update statistics
    const updatedStats = { ...dbStats, totalLikes: dbStats.totalLikes + 1 };
    setDbStats(updatedStats);
    localStorage.setItem('celebrate_stats', JSON.stringify(updatedStats));
  };

  const handleUnlockPortal = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('portal_unlocked', 'true');
    handleAddLog(`Friend successfully unwrapped 3D Gift Box.`);
  };

  // Scroll Progress Tracker for Parallax & Indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save stats back when updated helper
  useEffect(() => {
    localStorage.setItem('celebrate_stats', JSON.stringify(dbStats));
  }, [dbStats]);

  // Handle Custom CSS and JavaScript Injection dynamically from Admin Panel!
  useEffect(() => {
    // 1. Inject Custom CSS Styles
    const existingStyle = document.getElementById('custom-admin-css');
    if (existingStyle) existingStyle.remove();
    
    if (dbConfig.general.customCss) {
      const styleNode = document.createElement('style');
      styleNode.id = 'custom-admin-css';
      styleNode.innerHTML = dbConfig.general.customCss;
      document.head.appendChild(styleNode);
    }

    // 2. Execute Custom Javascript Block safely
    if (dbConfig.general.customJs) {
      try {
        const scriptFunc = new Function(dbConfig.general.customJs);
        scriptFunc();
      } catch (err) {
        console.error("Custom injected JavaScript failed evaluation:", err);
      }
    }
  }, [dbConfig.general.customCss, dbConfig.general.customJs]);

  const handleNavigateAnchor = (id: string) => {
    audio.playClick('nav');
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Active theme layout gradient matcher strings
  const getThemeBackgroundGradient = () => {
    switch (dbConfig.styles.theme) {
      case 'immersive': return 'bg-gradient-immersive text-slate-200';
      case 'luxury': return 'bg-gradient-luxury';
      case 'cosmic': return 'bg-gradient-cosmic';
      case 'aurora': return 'bg-gradient-aurora';
      case 'neon': return 'bg-gradient-neon';
      case 'vintage': return 'bg-gradient-vintage';
      case 'light': return 'bg-neutral-50 text-neutral-800';
      default: return 'bg-neutral-950 text-white';
    }
  };

  return (
    <div 
      className={`min-h-screen w-full relative transition-colors duration-1000 ${getThemeBackgroundGradient()} selection:bg-amber-400 selection:text-neutral-950`}
      style={{
        fontFamily: dbConfig.styles.fontFamily === 'Space Grotesk' ? '"Space Grotesk", sans-serif' :
                    dbConfig.styles.fontFamily === 'Playfair Display' ? '"Playfair Display", serif' :
                    dbConfig.styles.fontFamily === 'JetBrains Mono' ? '"JetBrains Mono", monospace' :
                    '"Inter", sans-serif'
      }}
    >
      {/* 1. HIGH-PERFORMANCE CELEBRATION CANVAS */}
      <DynamicCanvas 
        enableFireworks={dbConfig.animations.enableFireworks}
        enableConfetti={dbConfig.animations.enableConfetti}
        enableBalloons={dbConfig.animations.enableBalloons}
        enableParticles={dbConfig.animations.enableParticles}
        particleType={dbConfig.animations.particleType}
        animationSpeed={dbConfig.animations.animationSpeed}
      />

      {/* 2. FLOATING BACKGROUND SYNTH AUDIO CONTROL PANEL */}
      <AudioPlayerHUD 
        currentPack={dbConfig.audio.soundPack}
        onPackChange={(pack) => setDbConfig({
          ...dbConfig,
          audio: { ...dbConfig.audio, soundPack: pack }
        })}
        defaultVolume={dbConfig.audio.defaultVolume}
      />

      {/* 3. SCROLL PROGRESS INDICATOR BAR */}
      {isUnlocked && (
        <div className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-400 via-pink-500 to-amber-400 z-50 transition-all" style={{ width: `${scrollProgress}%` }} />
      )}

      {/* 4. OVERVIEW/ADMIN FLOATING CONTROLS WHEEL */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        <button
          type="button"
          onClick={() => { audio.playClick('admin'); setShowAdminConsole(true); }}
          className="p-3 bg-neutral-900/60 hover:bg-neutral-900 border border-white/10 hover:border-orange-500/40 text-neutral-300 hover:text-orange-400 rounded-full cursor-pointer shadow-xl transition-all duration-300 relative group"
          title="Open Custom Admin Panel"
        >
          <Settings className="h-5 w-5 animate-spin-slow group-hover:rotate-180 transition-transform duration-500" />
          <span className="absolute right-14 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white border border-white/5 font-mono text-[10px] uppercase p-1.5 px-3 rounded shadow-lg whitespace-nowrap">
            ⚙️ Configuration Panel
          </span>
        </button>
      </div>

      {/* 5. GATED OPENING CEREMONY / LANDING PORTAL */}
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="opening"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
          >
            <OpeningCeremony 
              friendName={dbConfig.general.friendName}
              birthdayDate={dbConfig.general.birthdayDate}
              websiteTitle={dbConfig.general.websiteTitle}
              heroSubtitle={dbConfig.general.heroSubtitle}
              heroTitle={dbConfig.general.heroTitle}
              onUnlocked={handleUnlockPortal}
            />
          </motion.div>
        ) : (
          
          /* 6. MAIN CELEBRATION WORLD PORTAL (UNLOCKED!) */
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full pb-32"
          >
            {/* FLOATING HEADER COMPOSITIONS */}
            <header className="w-full py-4 px-8 relative z-30 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center justify-between">
              <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div 
                  className="flex items-center gap-2.5 cursor-pointer font-space"
                  onClick={() => audio.playClick('button')}
                >
                  <Sparkles className="h-4 w-4 text-orange-500 animate-[spin_4s_linear_infinite]" />
                  <span className="text-xs font-bold tracking-widest text-white uppercase font-mono">
                    {dbConfig.general.friendName}'s PORTAL v4.0
                  </span>
                </div>

                {/* Inline structural bookmarks */}
                <nav className="flex flex-wrap items-center gap-2.5">
                  {[
                    { id: 'timeline', label: 'Timeline' },
                    { id: 'gallery', label: 'Gallery' },
                    { id: 'cake', label: 'Blow Cake' },
                    { id: 'guestbook', label: 'Wishes Well' },
                    { id: 'easter', label: 'Secret Eggs' }
                  ].map((bk) => {
                    // Check visibility logic first!
                    let isVisible = true;
                    if (bk.id === 'timeline' && !dbConfig.sections.showTimeline) isVisible = false;
                    if (bk.id === 'gallery' && !dbConfig.sections.showGallery) isVisible = false;
                    if (bk.id === 'cake' && !dbConfig.sections.show3DCake) isVisible = false;
                    if (bk.id === 'guestbook' && !dbConfig.sections.showGuestbook) isVisible = false;
                    if (bk.id === 'easter' && !dbConfig.sections.showEasterEggs) isVisible = false;

                    if (!isVisible) return null;

                    return (
                      <button
                        key={bk.id}
                        type="button"
                        onClick={() => handleNavigateAnchor(bk.id)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white border border-transparent hover:border-white/10 cursor-pointer transition-all"
                      >
                        {bk.label}
                      </button>
                    );
                  })}
                </nav>

                {/* Top OS system indicators */}
                <div className="hidden md:flex gap-4 text-[10px] uppercase tracking-widest font-mono font-bold">
                  <span className="text-orange-500 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    Live Portal Active
                  </span>
                  <span className="text-white/40">Deployment Ready</span>
                </div>
              </div>
            </header>

            {/* HERO INTRODUCTION SECTION */}
            <section className="px-4 py-20 relative text-center flex flex-col items-center">
              <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
              
              <div className="max-w-3xl relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-pink-500/20 border border-amber-400/30 rounded-full px-5 py-1.5 text-[10px] font-mono tracking-widest uppercase font-bold text-amber-300 shadow-md mb-8"
                >
                  <Heart className="h-3 w-3 text-rose-500 fill-current animate-pulse" />
                  <span>Interactive Birthday Memoir Portal</span>
                </motion.div>

                <h1 className="text-5xl md:text-7xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-tight text-balance mb-6">
                  {dbConfig.general.heroTitle}
                </h1>

                <p className="text-neutral-404 text-neutral-400 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto text-balance mb-12">
                  {dbConfig.general.heroWelcomeMessage}
                </p>
              </div>
            </section>

            {/* MESSAGE LETTER BOARD SECTION */}
            {dbConfig.sections.showLetter && (
              <section className="max-w-4xl mx-auto px-4 py-16">
                <HandwrittenLetter 
                  letterText={dbConfig.general.letterText} 
                  friendName={dbConfig.general.friendName}
                />
              </section>
            )}

            {/* TIMELINE MEMORIES */}
            {dbConfig.sections.showTimeline && (
              <section id="timeline" className="max-w-5xl mx-auto px-4 py-20 border-t border-white/5 scroll-mt-24">
                <div className="text-center max-w-xl mx-auto mb-16">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-pink-500 uppercase font-semibold">Journey of Life</span>
                  <h2 className="text-3xl font-space font-bold text-white mt-1">Our Interactive Memory Timeline</h2>
                  <p className="text-neutral-400 text-xs mt-2 font-sans font-light">Take a beautiful walk down memory lane exploring the milestones we've forged side-by-side.</p>
                </div>
                <MemoryTimeline events={dbTimeline} />
              </section>
            )}

            {/* PHOTO/VIDEO GALLERY */}
            {dbConfig.sections.showGallery && (
              <section id="gallery" className="max-w-6xl mx-auto px-4 py-20 border-t border-white/5 scroll-mt-24">
                <div className="text-center max-w-xl mx-auto mb-16">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-amber-500 uppercase font-semibold">Memoirs Wall</span>
                  <h2 className="text-3xl font-space font-bold text-white mt-1">Living Candid Media Archive</h2>
                  <p className="text-neutral-400 text-xs mt-2 font-sans font-light">An elegant portfolio of candid photographs, dynamic sparks, and video celebration memories.</p>
                </div>
                <CelebrationGallery mediaList={dbMedia} onLikeMedia={handleMediaLike} />
              </section>
            )}

            {/* BLOW OUT CAKE GAME AREA */}
            {dbConfig.sections.show3DCake && (
              <section id="cake" className="max-w-3xl mx-auto px-4 py-16 border-t border-white/5 scroll-mt-24">
                <ThreeDCake />
              </section>
            )}

            {/* GUESTBOOK WISH RECEIVERS */}
            {dbConfig.sections.showGuestbook && (
              <section id="guestbook" className="max-w-6xl mx-auto px-4 py-24 border-t border-white/5 scroll-mt-24">
                <GuestbookWishes 
                  wishes={dbWishes} 
                  onAddWish={handleAddWish} 
                  onLikeWish={handleLikeWish}
                />
              </section>
            )}

            {/* SECRET SURPRISE EASTER EGGS */}
            {dbConfig.sections.showEasterEggs && (
              <section id="easter" className="max-w-5xl mx-auto px-4 py-20 border-t border-white/5 scroll-mt-24">
                <div className="text-center max-w-xl mx-auto mb-14">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-amber-400 uppercase font-semibold">Surprises</span>
                  <h2 className="text-3xl font-space font-bold text-white mt-1">Hidden Asterisms & Secrets</h2>
                  <p className="text-neutral-400 text-xs mt-2">Unseal hidden fortune challenges and interactive double spark mini-games.</p>
                </div>
                <EasterEggs />
              </section>
            )}

            {/* LUXURY CELEBRATION FOOTER */}
            <footer className="w-full mt-20 pt-12 border-t border-white/5 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="max-w-md mx-auto flex flex-col items-center gap-4 relative z-10 px-4">
                <div className="h-9 w-9 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/35">
                  <Heart className="h-4 w-4 text-amber-400 fill-current" />
                </div>

                <h3 className="text-base font-space font-bold text-white uppercase tracking-wider">
                  HAPPY ORBIT, SPECTACULAR HUMAN
                </h3>

                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.15em] max-w-xs leading-relaxed">
                  Design crafted with precision space symmetry in honor of Aria.
                </p>

                <div className="text-[9px] font-mono text-neutral-600 mt-6 border-t border-white/5 pt-4 w-full flex items-center justify-between">
                  <span>© 2026 Memory Studio Core</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    <span>Dynamic State Persistent Mode</span>
                  </span>
                </div>
              </div>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. FULL CONSTRUCTIVE ADMIN CONSOLE CONFIGURATION INJECTS */}
      <AnimatePresence>
        {showAdminConsole && (
          <AdminPanel 
            config={dbConfig}
            onSaveConfig={handleSaveConfig}
            timeline={dbTimeline}
            onUpdateTimeline={handleUpdateTimeline}
            mediaList={dbMedia}
            onUpdateMedia={handleUpdateMedia}
            wishes={dbWishes}
            onUpdateWishes={handleUpdateWishes}
            logs={dbLogs}
            onAddLog={handleAddLog}
            stats={dbStats}
            onResetStats={handleResetStats}
            onClose={() => setShowAdminConsole(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
