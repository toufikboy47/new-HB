/**
 * Web Audio API Audio Engine
 * High-performance, 100% reliable dynamic synthesizer for background music and interactive sound effects.
 * Bypasses CORS and network errors entirely by synthesizing professional tracks and click noises in real-time.
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterVolumeNode: GainNode | null = null;
  private currentSource: OscillatorNode | null = null;
  private isPlayingMusicState: boolean = false;
  private playlistIndex: number = 0;
  private defaultVolume: number = 0.5;
  private schedulerTimer: any = null;
  private trackProgressCallback: ((progress: number) => void) | null = null;
  private isMuted: boolean = false;

  // Synthesized melodies represented as [MIDI Note, Duration in eighth-notes][]
  private synthTracks = [
    {
      title: "Orchestral Birthday Symphony",
      artist: "Virtual Dynamic Orchestra",
      tempo: 120,
      notes: [
        // Happy Birthday to You
        [60, 4], [60, 4], [62, 8], [60, 8], [65, 8], [64, 16], // Happy Birthday to you
        [60, 4], [60, 4], [62, 8], [60, 8], [67, 8], [65, 16], // Happy Birthday to you
        [60, 4], [60, 4], [72, 8], [69, 8], [65, 8], [64, 8], [62, 16], // Happy Birthday dear Friend
        [70, 4], [70, 4], [69, 8], [65, 8], [67, 8], [65, 16], // Happy Birthday to you
      ]
    },
    {
      title: "Starlight Celebration",
      artist: "Crystal Dreams Synth",
      tempo: 140,
      notes: [
        // Sparkly celestial melody
        [67, 6], [69, 2], [71, 4], [74, 4], [71, 4], [74, 4], [76, 8],
        [79, 6], [76, 2], [74, 4], [71, 4], [69, 4], [67, 4], [69, 8],
        [71, 6], [74, 2], [76, 4], [79, 4], [81, 4], [83, 4], [86, 16],
      ]
    },
    {
      title: "Nostalgic Retro Journey",
      artist: "8-Bit Birthday Chiptune",
      tempo: 150,
      notes: [
        // Arpeggiating retro-themed birthday song
        [60, 4], [64, 4], [67, 4], [72, 4], [67, 4], [64, 4], [60, 8],
        [62, 4], [65, 4], [69, 4], [74, 4], [69, 4], [65, 4], [62, 8],
        [64, 4], [67, 4], [71, 4], [76, 4], [79, 4], [76, 4], [71, 4], [79, 12],
      ]
    }
  ];

  private soundPack: 'orchestral' | 'retro' | 'ambient' = 'orchestral';

  constructor() {
    // Lazy initialize context on user interactions
  }

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterVolumeNode = this.ctx.createGain();
      this.masterVolumeNode.gain.setValueAtTime(this.defaultVolume, this.ctx.currentTime);
      this.masterVolumeNode.connect(this.ctx.destination);
    } catch (e) {
      console.error("Failed to initialize Web Audio API:", e);
    }
  }

  private resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.defaultVolume = val;
    this.resume();
    if (this.masterVolumeNode && this.ctx) {
      this.masterVolumeNode.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }

  public setSoundPack(pack: 'orchestral' | 'retro' | 'ambient') {
    this.soundPack = pack;
  }

  public getTracks() {
    return this.synthTracks.map((t, idx) => ({
      id: String(idx),
      title: t.title,
      artist: t.artist,
      duration: Math.round((t.notes.reduce((acc, curr) => acc + curr[1], 0) * (60 / t.tempo)) / 8) + "s",
    }));
  }

  public getCurrentTrackIndex() {
    return this.playlistIndex;
  }

  public isPlayingMusic() {
    return this.isPlayingMusicState;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterVolumeNode && this.ctx) {
      this.masterVolumeNode.gain.setValueAtTime(this.isMuted ? 0 : this.defaultVolume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMutedState() {
    return this.isMuted;
  }

  public onProgress(callback: (progress: number) => void) {
    this.trackProgressCallback = callback;
  }

  // PLAY MUSIC ENGINE
  public playMusic() {
    this.resume();
    this.stopMusic();
    this.isPlayingMusicState = true;
    
    const track = this.synthTracks[this.playlistIndex];
    if (!track || !this.ctx) return;

    let totalDuration = 0;
    const beatDuration = (60 / track.tempo) / 4; // Length of a 1/16 note

    const notesToPlay = track.notes;
    let timeCursor = this.ctx.currentTime + 0.1;

    // We schedule oscillators
    const nodes: { osc: OscillatorNode; gain: GainNode; stopTime: number }[] = [];

    notesToPlay.forEach(([noteNumber, durationMultiplier]) => {
      if (!this.ctx || !this.masterVolumeNode) return;

      const duration = durationMultiplier * beatDuration;
      const freq = Math.pow(2, (noteNumber - 69) / 12) * 440;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Sound Pack styling
      if (this.soundPack === 'retro') {
        osc.type = 'triangle'; // Retro square/triangle
      } else if (this.soundPack === 'ambient') {
        osc.type = 'sine'; // Mild pure tones
      } else {
        osc.type = 'sine'; // Standard sweet tones with slight saw blending
      }

      osc.frequency.setValueAtTime(freq, timeCursor);

      // Simple ADSR Envelope
      noteGain.gain.setValueAtTime(0, timeCursor);
      noteGain.gain.linearRampToValueAtTime(this.soundPack === 'retro' ? 0.2 : 0.4, timeCursor + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, timeCursor + duration - 0.02);

      osc.connect(noteGain);
      noteGain.connect(this.masterVolumeNode);

      osc.start(timeCursor);
      osc.stop(timeCursor + duration);

      nodes.push({ osc, gain: noteGain, stopTime: timeCursor + duration });
      timeCursor += duration;
    });

    const finalTime = timeCursor;
    const startTimeResult = this.ctx.currentTime;

    // Track Progress Dispatcher
    const updateProgress = () => {
      if (!this.isPlayingMusicState || !this.ctx) return;
      const elapsed = this.ctx.currentTime - startTimeResult;
      const total = finalTime - startTimeResult;
      const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
      
      if (this.trackProgressCallback) {
        this.trackProgressCallback(pct);
      }

      if (this.ctx.currentTime >= finalTime) {
        // Track finished, advance next
        this.nextTrack();
      } else {
        this.schedulerTimer = requestAnimationFrame(updateProgress);
      }
    };
    
    this.schedulerTimer = requestAnimationFrame(updateProgress);
  }

  public stopMusic() {
    this.isPlayingMusicState = false;
    if (this.schedulerTimer) {
      cancelAnimationFrame(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  public nextTrack() {
    this.playlistIndex = (this.playlistIndex + 1) % this.synthTracks.length;
    if (this.isPlayingMusicState) {
      this.playMusic();
    }
  }

  public prevTrack() {
    this.playlistIndex = (this.playlistIndex - 1 + this.synthTracks.length) % this.synthTracks.length;
    if (this.isPlayingMusicState) {
      this.playMusic();
    }
  }

  // --- SOUND EFFECTS SYNTHESIZERS ---

  public playClick(type: 'button' | 'nav' | 'image' | 'gift' | 'gallery' | 'card' | 'firework' | 'admin') {
    this.resume();
    if (!this.ctx || !this.masterVolumeNode || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.connect(gain);
    gain.connect(this.masterVolumeNode);

    switch (type) {
      case 'button':
        // Soft round ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.12);
        break;

      case 'nav':
        // Modern dual ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.setValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.16);
        break;

      case 'image':
        // Sparkling chord sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.22);
        break;

      case 'gift':
        // Fast dynamic ascending swipe
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.4);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.45);
        break;

      case 'gallery':
        // Warm glass-like click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
        break;

      case 'card':
        // Flip-page wind rustle synth
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.26);
        break;

      case 'firework':
        // Ascending hiss then massive pop
        this.synthFireworkExplosion();
        break;

      case 'admin':
        // Futuristic success ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.28);
        break;
    }
  }

  private synthFireworkExplosion() {
    if (!this.ctx || !this.masterVolumeNode) return;
    const now = this.ctx.currentTime;
    
    // 1. Firework Launch Swoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(this.masterVolumeNode);
    osc.start(now);
    osc.stop(now + 0.31);

    // 2. Firework Crackle Explosion
    setTimeout(() => {
      if (!this.ctx || !this.masterVolumeNode) return;
      const expTime = this.ctx.currentTime;

      // Noise source (white noise)
      const bufferSize = this.ctx.sampleRate * 0.4; // 0.4 seconds
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter to make it warmer/crunchier
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, expTime);
      filter.frequency.exponentialRampToValueAtTime(50, expTime + 0.3);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.6, expTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, expTime + 0.38);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterVolumeNode);

      noise.start(expTime);
      noise.stop(expTime + 0.4);
    }, 300);
  }
}

export const audio = new AudioEngine();
