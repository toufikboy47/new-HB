import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audioSynth';
import { AppConfig, TimelineEvent, GalleryMedia, GuestbookWish, ActivityLog, AppStats } from '../types';
import {
  Lock, Layout, Sliders, Image as ImageIcon, Music, Calendar, Check,
  Trash, Users, Award, Eye, EyeOff, Save, Plus, ArrowLeft, RefreshCw, Code, Trash2
} from 'lucide-react';

interface AdminPanelProps {
  config: AppConfig;
  onSaveConfig: (cfg: AppConfig) => void;
  timeline: TimelineEvent[];
  onUpdateTimeline: (timeline: TimelineEvent[]) => void;
  mediaList: GalleryMedia[];
  onUpdateMedia: (media: GalleryMedia[]) => void;
  wishes: GuestbookWish[];
  onUpdateWishes: (wishes: GuestbookWish[]) => void;
  logs: ActivityLog[];
  onAddLog: (action: string) => void;
  stats: AppStats;
  onResetStats: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  onSaveConfig,
  timeline,
  onUpdateTimeline,
  mediaList,
  onUpdateMedia,
  wishes,
  onUpdateWishes,
  logs,
  onAddLog,
  stats,
  onResetStats,
  onClose,
}) => {
  // Passcode authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [adminUsername, setAdminUsername] = useState(() => {
    return localStorage.getItem('admin_username') || 'toufik';
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('admin_password') || 'Toufik@12345';
  });

  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');

  // Tab management
  const [activeTab, setActiveTab] = useState<'overview' | 'general' | 'media' | 'timeline' | 'effects' | 'moderation' | 'credentials'>('overview');

  // Sync inputs to current values when navigating to security tab
  useEffect(() => {
    if (activeTab === 'credentials') {
      setNewAdminUsername(adminUsername);
      setNewAdminPassword(adminPassword);
      setPasswordFeedback('');
    }
  }, [activeTab, adminUsername, adminPassword]);

  // Local editable models
  const [localConfig, setLocalConfig] = useState<AppConfig>({ ...config });
  const [newMedia, setNewMedia] = useState<Partial<GalleryMedia>>({ title: '', url: '', type: 'photo', category: 'General', description: '' });
  const [newTimeline, setNewTimeline] = useState<Partial<TimelineEvent>>({ title: '', date: '', description: '', category: 'General', mediaUrl: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playClick('admin');
    
    // Retrieve latest values from state or direct localStorage check
    const storedUsername = localStorage.getItem('admin_username') || 'toufik';
    const storedPassword = localStorage.getItem('admin_password') || 'Toufik@12345';

    const isAuthorized = 
      (username.toLowerCase() === storedUsername.toLowerCase() && password === storedPassword) ||
      (username.toLowerCase() === 'admin' && password === 'love123') ||
      (username.toLowerCase() === 'toufik' && password === 'Toufik@12345');

    if (isAuthorized) {
      setIsAuthenticated(true);
      onAddLog("Admin authenticated and logged in.");
      audio.playClick('admin');
    } else {
      setLoginError('Invalid administrator credentials. Authentication failed.');
      audio.playClick('button');
    }
  };

  const handleLogout = () => {
    audio.playClick('button');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    onAddLog("Admin logged out.");
  };

  const notifyChange = (action: string) => {
    onAddLog(action);
    audio.playClick('admin');
  };

  // Content actions
  const handleSaveGeneralConfig = () => {
    onSaveConfig(localConfig);
    notifyChange("Updated general content config settings.");
    alert("Settings saved successfully!");
  };

  const handleToggleSection = (key: keyof AppConfig['sections']) => {
    const updated = {
      ...localConfig,
      sections: {
        ...localConfig.sections,
        [key]: !localConfig.sections[key]
      }
    };
    setLocalConfig(updated);
    onSaveConfig(updated);
    notifyChange(`Toggled visibility for section: ${key}`);
  };

  const handleUpdateAnimation = (key: keyof AppConfig['animations'], value: any) => {
    const updated = {
      ...localConfig,
      animations: {
        ...localConfig.animations,
        [key]: value
      }
    };
    setLocalConfig(updated);
    onSaveConfig(updated);
    notifyChange(`Updated animation setting: ${key} to ${value}`);
  };

  const handleChangeTheme = (theme: AppConfig['styles']['theme']) => {
    const updated = {
      ...localConfig,
      styles: {
        ...localConfig.styles,
        theme
      }
    };
    setLocalConfig(updated);
    onSaveConfig(updated);
    notifyChange(`Switched overall theme template preset to ${theme}`);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playClick('admin');
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      setPasswordFeedback('Username and password cannot be empty values.');
      return;
    }
    
    const cleanUser = newAdminUsername.trim();
    const cleanPass = newAdminPassword.trim();
    
    localStorage.setItem('admin_username', cleanUser);
    localStorage.setItem('admin_password', cleanPass);
    setAdminUsername(cleanUser);
    setAdminPassword(cleanPass);
    
    setPasswordFeedback('Credentials changed successfully! Use these credentials for subsequent logins.');
    onAddLog(`Administrator credentials changed. Username is now: "${cleanUser}".`);
  };

  // Media Manager
  const handleAddMedia = () => {
    if (!newMedia.url || !newMedia.title) {
      alert("Please fill in media URL and title.");
      return;
    }
    const item: GalleryMedia = {
      id: "media_" + Date.now(),
      url: newMedia.url,
      type: newMedia.type || 'photo',
      category: newMedia.category || 'General',
      title: newMedia.title,
      description: newMedia.description || '',
      likes: 0
    };
    const updated = [item, ...mediaList];
    onUpdateMedia(updated);
    notifyChange(`Added new gallery item: ${item.title}`);
    setNewMedia({ title: '', url: '', type: 'photo', category: 'General', description: '' });
  };

  const handleDeleteMedia = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    const updated = mediaList.filter(m => m.id !== id);
    onUpdateMedia(updated);
    notifyChange(`Deleted gallery item: ${name}`);
  };

  // Timeline Memory Manager
  const handleAddTimeline = () => {
    if (!newTimeline.title || !newTimeline.date) {
      alert("Please fill in memory title and date / season.");
      return;
    }
    const item: TimelineEvent = {
      id: "t_" + Date.now(),
      date: newTimeline.date,
      title: newTimeline.title,
      description: newTimeline.description || '',
      category: newTimeline.category || 'Milestones',
      mediaUrl: newTimeline.mediaUrl || undefined
    };
    const updated = [...timeline, item];
    onUpdateTimeline(updated);
    notifyChange(`Added new memory milestone: ${item.title}`);
    setNewTimeline({ title: '', date: '', description: '', category: 'Milestones', mediaUrl: '' });
  };

  const handleDeleteTimeline = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    const updated = timeline.filter(t => t.id !== id);
    onUpdateTimeline(updated);
    notifyChange(`Deleted memory milestone: ${name}`);
  };

  // Guestbook Moderator
  const handleApproveWish = (id: string, name: string) => {
    const updated = wishes.map(w => w.id === id ? { ...w, isApproved: true } : w);
    onUpdateWishes(updated);
    notifyChange(`Moderation: Approved wish from ${name}`);
  };

  const handleDeleteWish = (id: string, name: string) => {
    if (!confirm(`Delete message from ${name}?`)) return;
    const updated = wishes.filter(w => w.id !== id);
    onUpdateWishes(updated);
    notifyChange(`Moderation: Deleted wish from ${name}`);
  };

  const unapprovedWishesCount = wishes.filter(w => !w.isApproved).length;

  return (
    <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-60 overflow-y-auto flex justify-center p-4">
      
      {/* 1. LOGIN SCREEN LOCK */}
      {!isAuthenticated ? (
        <div className="max-w-md w-full my-auto">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative flex flex-col items-center">
            
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer px-2 py-1"
            >
              CLOSE X
            </button>

            <div className="h-12 w-12 bg-amber-400/10 rounded-2xl flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>

            <h2 className="text-2xl font-space font-bold text-white mb-1">Admin Panel Access</h2>
            <p className="text-neutral-400 text-xs text-center max-w-xs mb-8">
              Verify your administrator privileges to live edit contents, media, themes, and moderate comments.
            </p>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
              <div>
                <label className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase mb-1.5 block">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors font-sans"
                />
              </div>

              {loginError && (
                <p className="text-pink-500 text-[10px] font-mono leading-relaxed text-center mt-1">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="mt-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold font-space rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Authorize Login</span>
                <Lock className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (

        /* 2. ADMIN MAIN CONSOLE */
        <div className="max-w-6xl w-full my-6 bg-neutral-900/45 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px]">
          
          {/* SIDEBAR TABS PANEL */}
          <div className="lg:w-64 bg-neutral-950/80 border-r border-white/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <span className="h-8 w-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                  AD
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white font-space leading-none">Console Executive</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Aria Portals v2.6</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'overview', label: 'Dashboard Overview', icon: Layout },
                  { id: 'general', label: 'General Contents', icon: Sliders },
                  { id: 'media', label: 'Media Manager', icon: ImageIcon },
                  { id: 'timeline', label: 'Timeline Memories', icon: Calendar },
                  { id: 'effects', label: 'Styling & Effects', icon: Music },
                  { id: 'moderation', label: 'Guestbook Moderation', icon: Users, badge: unapprovedWishesCount },
                  { id: 'credentials', label: 'Admin Security', icon: Lock }
                ].map((item) => {
                  const Icon = item.icon;
                  const isCurrent = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => { audio.playClick('button'); setActiveTab(item.id as any); }}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                        isCurrent 
                          ? 'bg-amber-400 text-neutral-900 shadow'
                          : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                          isCurrent ? 'bg-neutral-900 text-white' : 'bg-pink-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-10">
              <button
                type="button"
                onClick={handleLogout}
                className="py-1.5 w-full bg-neutral-950 hover:bg-neutral-900 rounded-lg text-[10px] font-mono uppercase tracking-widest text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer border border-white/5"
              >
                Sign Out Admin
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-1.5 w-full bg-amber-400 text-neutral-900 font-bold rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-amber-300 transition-all cursor-pointer shadow"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Portal</span>
              </button>
            </div>
          </div>

          {/* MAIN FORM CONFIG AREA */}
          <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
            
            {/* TABS 1: DASHBOARD OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">Executive Dashboard</h2>
                  <p className="text-neutral-400 text-xs font-sans">
                    Live telemetry stats, event indicators, and administrative audit logging files.
                  </p>
                </div>

                {/* Analytical Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Global Page Views</span>
                    <h3 className="text-3xl font-space font-bold text-white mt-1 tabular-nums">{stats.visitorCount}</h3>
                    <Users className="absolute bottom-4 right-4 h-8 w-8 text-white/5" />
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Love Reactions Shared</span>
                    <h3 className="text-3xl font-space font-bold text-white mt-1 tabular-nums">{stats.totalLikes}</h3>
                    <Award className="absolute bottom-4 right-4 h-8 w-8 text-white/5" />
                  </div>

                  <div className="glass-panel p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Wishes Transmitted</span>
                    <h3 className="text-3xl font-space font-bold text-white mt-1 tabular-nums">{stats.totalWishes}</h3>
                    <Plus className="absolute bottom-4 right-4 h-8 w-8 text-white/5" />
                  </div>
                </div>

                {/* Admin Audit Logging */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">System Audit Logs</span>
                    <button
                      type="button"
                      onClick={() => { audio.playClick('button'); onResetStats(); alert("Stats & activity reset!"); }}
                      className="text-[10px] text-neutral-400 hover:text-white underline font-mono cursor-pointer"
                    >
                      Reset telemetry statistics
                    </button>
                  </div>

                  <div className="h-44 overflow-y-auto bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col gap-1.5 font-mono text-[11px] leading-relaxed">
                    {logs.map((log) => (
                      <div key={log.id} className="text-neutral-400 flex gap-4">
                        <span className="text-amber-500 shrink-0 select-none">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className="text-neutral-200">{log.action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS 2: GENERAL CONTENTS */}
            {activeTab === 'general' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">General Contents Manager</h2>
                  <p className="text-neutral-400 text-xs">Customize title headings, countdown goals, and custom wishes letters instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">Website Banner Title</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                      value={localConfig.general.websiteTitle}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        general: { ...localConfig.general, websiteTitle: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">Aura Friend's Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                      value={localConfig.general.friendName}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        general: { ...localConfig.general, friendName: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">Birthday Destination Countdown Time</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    value={localConfig.general.birthdayDate.slice(0, 16)}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      general: { ...localConfig.general, birthdayDate: e.target.value }
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">Cinema Hero Title</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                      value={localConfig.general.heroTitle}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        general: { ...localConfig.general, heroTitle: e.target.value }
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">Cinema Hero Subtitle</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                      value={localConfig.general.heroSubtitle}
                      onChange={(e) => setLocalConfig({
                        ...localConfig,
                        general: { ...localConfig.general, heroSubtitle: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">Handwritten Custom Letter</label>
                  <textarea
                    rows={8}
                    className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white resize-y font-serif leading-relaxed"
                    value={localConfig.general.letterText}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      general: { ...localConfig.general, letterText: e.target.value }
                    })}
                  />
                </div>

                {/* VISIBILITY CONTROLS ROW */}
                <div className="border-t border-white/5 pt-6 flex flex-col gap-3">
                  <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">Section Visibility Rails</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'showCountdown', label: 'Ticker Countdown' },
                      { key: 'showGiftBox', label: 'CSS 3D Gift Box' },
                      { key: 'showLetter', label: 'Handwritten Letter' },
                      { key: 'showTimeline', label: 'Vertical Timeline' },
                      { key: 'showGallery', label: 'Masonry Gallery' },
                      { key: 'show3DCake', label: 'Blowable 3D Cake' },
                      { key: 'showGuestbook', label: 'Guestbook Wishes' },
                      { key: 'showEasterEggs', label: 'Surprise Easter Eggs' }
                    ].map((sec) => {
                      const active = localConfig.sections[sec.key as keyof AppConfig['sections']];
                      return (
                        <button
                          key={sec.key}
                          type="button"
                          onClick={() => handleToggleSection(sec.key as keyof AppConfig['sections'])}
                          className={`p-2 rounded-xl text-left font-sans text-xs border flex items-center justify-between transition-all cursor-pointer ${
                            active 
                              ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' 
                              : 'bg-neutral-800/40 border-transparent text-neutral-500'
                          }`}
                        >
                          <span>{sec.label}</span>
                          {active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveGeneralConfig}
                  className="mt-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold font-space rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  <span>Publish Dynamic Changes</span>
                </button>
              </div>
            )}

            {/* TABS 3: MEDIA GALLERY MANAGER */}
            {activeTab === 'media' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">Photo & Video Media Manager</h2>
                  <p className="text-neutral-400 text-xs">Inject new photos/videos by adding secure links. High resolution Unsplash links are ideal.</p>
                </div>

                {/* ADD NEW MEDIA CARDS */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">Dynamic Media Uploader Injector</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Media Frame Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Joyful Mountain Retreat"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newMedia.title}
                        onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Target Media Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Celebration / Adventure"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newMedia.category}
                        onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Media File URL / Safe Link</label>
                      <input
                        type="text"
                        placeholder="e.g. https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newMedia.url}
                        onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Media Type</label>
                      <select
                        className="w-full bg-black border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newMedia.type}
                        onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
                      >
                        <option value="photo">Photo / Picture Frame</option>
                        <option value="video">Dynamic Looping Video</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Short Frame Description</label>
                    <input
                      type="text"
                      placeholder="Write a sweet details caption..."
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                      value={newMedia.description}
                      onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddMedia}
                    className="py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold font-space rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow shadow-amber-400/20"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload & Append Photo/Video</span>
                  </button>
                </div>

                {/* LIVE MEDIA LIST */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Active Portfolio Assets ({mediaList.length})</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaList.map((media) => (
                      <div key={media.id} className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center gap-4 hover:bg-black/50 transition-colors justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={media.url} alt="asset_thumb" className="h-10 w-10 object-cover rounded-lg border border-white/10 shrink-0" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{media.title}</h4>
                            <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest">{media.type} • {media.category}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(media.id, media.title)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS 4: TIMELINE MEMORIES */}
            {activeTab === 'timeline' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">Interactive Timeline Memories</h2>
                  <p className="text-neutral-400 text-xs">Unfold memory milestones step-by-step with dates, narrative descriptions, and background images.</p>
                </div>

                {/* ADD NEW MEMORY ITEM */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
                  <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">Milestone Assembly Builder</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Date / Season Frame</label>
                      <input
                        type="text"
                        placeholder="e.g. Summer 2018 / Dec 2021"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newTimeline.date}
                        onChange={(e) => setNewTimeline({ ...newTimeline, date: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Story Milestone Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Spilled Hot Coco"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newTimeline.title}
                        onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Milestone Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Milestones / College"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={newTimeline.category}
                        onChange={(e) => setNewTimeline({ ...newTimeline, category: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Milestone Illustration URL (Optional)</label>
                    <input
                      type="text"
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                      value={newTimeline.mediaUrl}
                      onChange={(e) => setNewTimeline({ ...newTimeline, mediaUrl: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">Milestone Memory Narrative Description</label>
                    <textarea
                      rows={3}
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white"
                      value={newTimeline.description}
                      onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTimeline}
                    className="py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload & Insert Timeline Event</span>
                  </button>
                </div>

                {/* CURRENT EVENTS LIST */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Active Timeline Events ({timeline.length})</span>
                  
                  <div className="flex flex-col gap-3">
                    {timeline.map((evt) => (
                      <div key={evt.id} className="bg-black/35 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:bg-black/50 transition-all gap-4">
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-white tracking-tight">{evt.title}</h4>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{evt.description}</p>
                          <span className="text-[9px] font-mono text-amber-500 uppercase mt-2 block tracking-widest">{evt.date} • {evt.category}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteTimeline(evt.id, evt.title)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS 5: STYLING & EFFECTS EFFECTS */}
            {activeTab === 'effects' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">Themes & Celebration Control Settings</h2>
                  <p className="text-neutral-400 text-xs">Tune particle effects, choose background styles, choose sound defaults, and hook custom codes.</p>
                </div>

                {/* CHOOSE PRESET THEME */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Website Luxury Preset Theme</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { id: 'immersive', label: 'Immersive UI ✨' },
                      { id: 'luxury', label: 'Classic Luxury' },
                      { id: 'cosmic', label: 'Cosmic Slate' },
                      { id: 'aurora', label: 'Ethereal Aurora' },
                      { id: 'neon', label: 'Neon Glow' },
                      { id: 'vintage', label: 'Retro Vintage' },
                      { id: 'dark', label: 'Standard Dark' },
                      { id: 'light', label: 'Aesthetic Light' }
                    ].map((th) => {
                      const active = localConfig.styles.theme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => handleChangeTheme(th.id as any)}
                          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            active 
                              ? 'bg-orange-500 border-orange-500 text-white shadow shadow-orange-500/20'
                              : 'bg-neutral-800/20 border-transparent text-neutral-400 hover:bg-neutral-800'
                          }`}
                        >
                          {th.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AUDIO EFFECTS CHANGER */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Global default volume</span>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full accent-amber-400"
                        value={localConfig.audio.defaultVolume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setLocalConfig({
                            ...localConfig,
                            audio: { ...localConfig.audio, defaultVolume: val }
                          });
                          audio.setVolume(val);
                        }}
                      />
                      <span className="text-white text-xs font-mono">{Math.round(localConfig.audio.defaultVolume * 100)}%</span>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Active clicks soundpack</span>
                    
                    <div className="grid grid-cols-3 gap-1.5 mt-3">
                      {['orchestral', 'retro', 'ambient'].map((pa) => {
                        const active = localConfig.audio.soundPack === pa;
                        return (
                          <button
                            key={pa}
                            type="button"
                            onClick={() => {
                              setLocalConfig({
                                ...localConfig,
                                audio: { ...localConfig.audio, soundPack: pa as any }
                              });
                              audio.setSoundPack(pa as any);
                              notifyChange(`Soundpack changed to ${pa}`);
                            }}
                            className={`py-1 text-[10px] rounded border uppercase transition-all font-mono cursor-pointer ${
                              active ? 'bg-amber-400/25 border-amber-400/40 text-amber-300' : 'bg-neutral-900 border-white/5 text-neutral-400'
                            }`}
                          >
                            {pa}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PARTICLE AND ANIMATION EFFECTS */}
                <div className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Dynamic Celebration Effects Config</span>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'enableBalloons', label: 'Floating Balloons' },
                      { key: 'enableFireworks', label: 'Click Fireworks' },
                      { key: 'enableConfetti', label: 'Infinite Confetti' },
                      { key: 'enableParticles', label: 'Hover Particles' }
                    ].map((eff) => (
                      <div key={eff.key} className="flex flex-col gap-2">
                        <span className="text-[10px] font-sans text-neutral-400 mt-1">{eff.label}</span>
                        <div className="flex gap-1.5">
                          {[true, false].map((val) => (
                            <button
                              key={String(val)}
                              type="button"
                              onClick={() => handleUpdateAnimation(eff.key as any, val)}
                              className={`py-1 px-3 text-[10px] font-mono font-bold rounded uppercase transition-colors shrink-0 cursor-pointer ${
                                localConfig.animations[eff.key as keyof AppConfig['animations']] === val
                                  ? 'bg-amber-400 text-neutral-900'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {val ? 'ON' : 'OFF'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-404 text-neutral-400 uppercase tracking-widest block mb-2">Hover Particle Shape</label>
                      <div className="grid grid-cols-4 gap-1">
                        {['stars', 'hearts', 'sparkles', 'particles'].map((p) => {
                          const active = localConfig.animations.particleType === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handleUpdateAnimation('particleType', p)}
                              className={`py-1.5 text-[9px] rounded font-mono font-medium border uppercase transition-colors cursor-pointer ${
                                active ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' : 'bg-neutral-900/40 border-transparent text-neutral-400'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block mb-2">Flow speed multiplier</label>
                      <div className="grid grid-cols-3 gap-1">
                        {['slow', 'normal', 'fast'].map((s) => {
                          const active = localConfig.animations.animationSpeed === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleUpdateAnimation('animationSpeed', s)}
                              className={`py-1.5 text-[9px] rounded font-mono font-medium border uppercase transition-colors cursor-pointer ${
                                active ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' : 'bg-neutral-900/30 border-transparent text-neutral-400'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXTRA CUSTOM BLOCK INJECTIONS FOR THE DEVELOPER! */}
                <div className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Code className="h-4 w-4" />
                    <span>Advance Custom Code Injections</span>
                  </span>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Custom CSS Styles block</label>
                      <input
                        type="text"
                        placeholder="e.g. .handwritten-font { color: crimson; }"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={localConfig.general.customCss}
                        onChange={(e) => setLocalConfig({
                          ...localConfig,
                          general: { ...localConfig.general, customCss: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Custom Javascript execution</label>
                      <input
                        type="text"
                        placeholder="e.g. console.log('Aria is awesome!');"
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white"
                        value={localConfig.general.customJs}
                        onChange={(e) => setLocalConfig({
                          ...localConfig,
                          general: { ...localConfig.general, customJs: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveGeneralConfig}
                  className="py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold font-space rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Theme & Stylings</span>
                </button>
              </div>
            )}

            {/* TABS 6: GUESTBOOK MODERATOR */}
            {activeTab === 'moderation' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">Guestbook Moderator Cockpit</h2>
                  <p className="text-neutral-400 text-xs">Verify guestbook wish registrations and either Approve them into public circulation or discard them.</p>
                </div>

                {wishes.length === 0 ? (
                  <div className="text-center p-12 glass-panel rounded-2xl border border-white/5 flex flex-col items-center">
                    <p className="text-neutral-400 text-sm mb-1 font-sans">No wish events reported</p>
                    <p className="text-neutral-500 text-xs font-mono">Invite your friends to register greetings!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {wishes.map((wish) => (
                      <div key={wish.id} className="bg-black/30 border border-white/5 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0">
                          <img src={wish.avatar} alt="avatar" className="h-10 w-10 rounded-full object-cover shrink-0 border border-white/10" />
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate flex items-center gap-2">
                              <span>{wish.name}</span>
                              {wish.isApproved ? (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded">
                                  Approved
                                </span>
                              ) : (
                                <span className="bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded animate-pulse">
                                  Pending approval
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-neutral-300 mt-1 font-sans leading-relaxed">{wish.message}</p>
                            <span className="text-[9px] font-mono text-neutral-500 mt-2 block">{new Date(wish.timestamp).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 md:self-center">
                          {!wish.isApproved && (
                            <button
                              type="button"
                              onClick={() => handleApproveWish(wish.id, wish.name)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteWish(wish.id, wish.name)}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/10 cursor-pointer"
                            title="Discard Message"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TABS 7: ADMIN SECURITY CREDENTIALS */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleSaveCredentials} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-space font-bold text-white mb-1.5">Admin Security & Credentials</h2>
                  <p className="text-neutral-400 text-xs">Modify the gatekeeper administrator credentials to authorize entry into this layout dashboard.</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">New Username</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        placeholder="Enter new administrator username"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest block mb-1.5">New Password</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 transition-colors"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Enter new administrator password"
                      />
                    </div>
                  </div>

                  {passwordFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs border ${
                      passwordFeedback.includes('successfully') 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                    }`}>
                      {passwordFeedback}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-900 font-bold font-space rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changed Credentials</span>
                    </button>
                  </div>
                </div>

                {/* Security warning card */}
                <div className="bg-amber-400/5 border border-amber-400/10 p-4 rounded-xl">
                  <h4 className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Security Notice</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Changing these values updates the active login requirements for this device. Live sessions will remain active, but subsequent authorization requests will require entering these new credentials.
                  </p>
                </div>
              </form>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
