import { AppConfig, TimelineEvent, GalleryMedia, GuestbookWish } from './types';

// Let's create an active target date which is exactly 7 days from the reference time: 2026-06-09
export const DEFAULT_BIRTHDAY_DATE = '2026-06-16T12:00:00';

export const initialConfig: AppConfig = {
  general: {
    websiteTitle: "Aria's Secret Sanctuary",
    friendName: "Aria",
    birthdayDate: DEFAULT_BIRTHDAY_DATE,
    heroTitle: "A Symphony of Memories",
    heroSubtitle: "To the most extraordinary human in our universe. Tap inside to open.",
    heroWelcomeMessage: "Scroll downwards or unfold the gift box to begin the celestial expedition.",
    letterText: "Dearest Aria,\n\nFrom the quiet early-morning coffee runs to that unforgettable midnight roadtrip into the mountains, having you as a friend is like reading my absolute favorite book over and over. You bring an infectious, incandescent light to every single room you step into.\n\nOn this very special orbit around the sun, I wanted to curate a living archive of our laughter, our adventures, and everything that makes you so completely wonderful.\n\nNever forget how deeply loved, valued, and celebrated you are—not just today, but every single millisecond.\n\nHappy Birthday, you spectacular star!\n\nWith all my love,\nYour Best Friend",
    customHtml: "",
    customCss: "",
    customJs: ""
  },
  styles: {
    theme: "immersive",
    primaryColor: "#f97316", // Orange accent color matching the Immersive UI design!
    accentColor: "#f97316",
    fontFamily: "Playfair Display"
  },
  animations: {
    enableBalloons: true,
    enableFireworks: true,
    enableConfetti: true,
    enableParticles: true,
    particleType: "stars",
    animationSpeed: "normal"
  },
  sections: {
    showCountdown: true,
    showGiftBox: true,
    showLetter: true,
    showTimeline: true,
    showGallery: true,
    show3DCake: true,
    showGuestbook: true,
    showEasterEggs: true
  },
  audio: {
    defaultVolume: 0.5,
    soundPack: "orchestral"
  }
};

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: "t1",
    date: "Summer 2018",
    title: "The First Connection",
    description: "Meeting at the local café, spilling hot chocolate on a notebook, and realizing we both knew every single lyric to the exact same obscure indie song.",
    category: "Childhood",
    mediaUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "t2",
    date: "December 2020",
    title: "The Midnight Cabin Escape",
    description: "Driving up into the blizzard with a trunk full of mismatched blankets, only to find the cabin was completely freezing and living off instant marshmallows all weekend.",
    category: "Trips",
    mediaUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "t3",
    date: "March 2023",
    title: "Graduation Victory Lap",
    description: "Tossing caps in the pouring rain, laughing so hard that our mortarboard caps flew straight into the river, and drinking muddy coffee to celebrate.",
    category: "College",
    mediaUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "t4",
    date: "October 2025",
    title: "Starting the Dream Office",
    description: "Co-signing our first workspace lease, eating lukewarm pizza on cardboard boxes, and painting the focal wall five different shades of golden yellow.",
    category: "Milestones",
    mediaUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop"
  }
];

export const initialGalleryMedia: GalleryMedia[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
    type: "photo",
    category: "Celebration",
    title: "Pre-party Confetti Blast",
    description: "Capturing that split-second before the main guests arrived, testing out custom biodegradable gold confetti canons.",
    likes: 42
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    type: "photo",
    category: "Adventures",
    title: "Sunset over the Horizon",
    description: "Staring out at the harbor during our road trip, singing Fleetwood Mac at the top of our lungs.",
    likes: 29
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop",
    type: "photo",
    category: "Laughter",
    title: "Candid Dessert Theft",
    description: "Aria stealing the giant strawberry off my plate when she thought the lens was focused somewhere else.",
    likes: 85
  },
  {
    id: "g4",
    url: "https://assets.mixkit.co/videos/preview/mixkit-celebration-sparklers-in-a-party-40003-large.mp4",
    type: "video",
    category: "Moments",
    title: "Golden Sparklers Dynamic Film",
    description: "A gorgeous premium looping sparkler record from our summer rooftop dinner celebration.",
    likes: 112
  },
  {
    id: "g5",
    url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=800&auto=format&fit=crop",
    type: "photo",
    category: "Aesthetics",
    title: "Under the Fairy Lights",
    description: "Cozy string light patterns suspended over our dynamic memory wall.",
    likes: 19
  }
];

export const initialWishes: GuestbookWish[] = [
  {
    id: "w1",
    name: "Sarah Jenkins",
    message: "Aria major birthday love to you! You make all our college days sparkle! Can't wait for your giant party this weekend! ✨🌸",
    timestamp: "2026-06-09T14:12:00Z",
    isApproved: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    likes: 8
  },
  {
    id: "w2",
    name: "Julian Rivera",
    message: "To the absolute master of baking and best mountain road trip co-pilot ever. Wishing you an interstellar birthday, dude! 🏔️🎂",
    timestamp: "2026-06-09T16:45:00Z",
    isApproved: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    likes: 14
  },
  {
    id: "w3",
    name: "Mia Peterson",
    message: "Happy Birthday Aria! Sending positive cosmic energy, laughter, and an infinite box of cupcakes. Thanks for always being an amazing soul! 💖🚀",
    timestamp: "2026-06-09T18:00:00Z",
    isApproved: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    likes: 21
  }
];
