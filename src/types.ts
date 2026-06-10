export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  mediaUrl?: string;
}

export interface GalleryMedia {
  id: string;
  url: string;
  type: 'photo' | 'video';
  category: string;
  title: string;
  description: string;
  likes: number;
}

export interface GuestbookWish {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  isApproved: boolean;
  avatar: string;
  likes: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  type: 'synth' | 'url';
  src: string; // Synth melody key or external audio URL
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
}

export interface AppConfig {
  general: {
    websiteTitle: string;
    friendName: string;
    birthdayDate: string; // ISO string or simple YYYY-MM-DD
    heroTitle: string;
    heroSubtitle: string;
    heroWelcomeMessage: string;
    letterText: string;
    customHtml: string;
    customCss: string;
    customJs: string;
  };
  styles: {
    theme: 'immersive' | 'luxury' | 'cosmic' | 'aurora' | 'neon' | 'vintage' | 'dark' | 'light';
    primaryColor: string;
    accentColor: string;
    fontFamily: 'Inter' | 'Space Grotesk' | 'Playfair Display' | 'JetBrains Mono';
  };
  animations: {
    enableBalloons: boolean;
    enableFireworks: boolean;
    enableConfetti: boolean;
    enableParticles: boolean;
    particleType: 'stars' | 'hearts' | 'sparkles' | 'particles';
    animationSpeed: 'slow' | 'normal' | 'fast';
  };
  sections: {
    showCountdown: boolean;
    showGiftBox: boolean;
    showLetter: boolean;
    showTimeline: boolean;
    showGallery: boolean;
    show3DCake: boolean;
    showGuestbook: boolean;
    showEasterEggs: boolean;
  };
  audio: {
    defaultVolume: number;
    soundPack: 'orchestral' | 'retro' | 'ambient';
  };
}

export interface AppStats {
  visitorCount: number;
  totalLikes: number;
  totalWishes: number;
}
