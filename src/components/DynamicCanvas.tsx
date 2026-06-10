import React, { useEffect, useRef } from 'react';
import { audio } from '../utils/audioSynth';

interface DynamicCanvasProps {
  enableFireworks: boolean;
  enableConfetti: boolean;
  enableBalloons: boolean;
  enableParticles: boolean;
  particleType: 'stars' | 'hearts' | 'sparkles' | 'particles';
  animationSpeed: 'slow' | 'normal' | 'fast';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation?: number;
  rotSpeed?: number;
}

interface FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  gravity: number;
  resistance: number;
  decay: number;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  sway: number;
  swaySpeed: number;
}

export const DynamicCanvas: React.FC<DynamicCanvasProps> = ({
  enableFireworks,
  enableConfetti,
  enableBalloons,
  enableParticles,
  particleType,
  animationSpeed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References for items
  const particlesRef = useRef<Particle[]>([]);
  const fireworksRef = useRef<FireworkSpark[]>([]);
  const balloonsRef = useRef<Balloon[]>([]);
  const mouseGlowRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  // Speed multiplier
  const speedMult = animationSpeed === 'slow' ? 0.6 : animationSpeed === 'fast' ? 1.5 : 1.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(document.body);

    // MOUSE EVENTS FOR PARTICLES AND PATHS
    const handleMouseMove = (e: MouseEvent) => {
      mouseGlowRef.current.x = e.clientX;
      mouseGlowRef.current.y = e.clientY;
      mouseGlowRef.current.active = true;

      // Mouse particles (sparkling)
      if (enableParticles && Math.random() < 0.15) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY));
      }
    };

    const handleMouseLeave = () => {
      mouseGlowRef.current.active = false;
    };

    const handleDocClick = (e: MouseEvent) => {
      // Create a firework at click location if enabled
      if (enableFireworks && Math.random() < 0.8) {
        triggerFireworkBlast(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleDocClick);

    // CREATOR HELPERS
    const createParticle = (x: number, y: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 1.5) * speedMult;
      const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#ADFF2F', '#FFFFFF'];
      const sizeList = particleType === 'sparkles' ? [3, 4, 5] : [4, 6, 8];

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: (Math.sin(angle) * speed) - 0.2, // Drift up slightly
        size: sizeList[Math.floor(Math.random() * sizeList.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() * 0.05 - 0.025) * speedMult,
      };
    };

    // Trigger dynamic Celebration Mode Blasts
    const handleCelebrationBlast = (e: CustomEvent<{ x?: number; y?: number }>) => {
      const x = e.detail?.x || Math.random() * window.innerWidth;
      const y = e.detail?.y || Math.random() * (window.innerHeight * 0.6);
      triggerFireworkBlast(x, y);

      // Create burst of confetti
      if (enableConfetti) {
        for (let i = 0; i < 40; i++) {
          particlesRef.current.push({
            x,
            y,
            vx: (Math.random() * 10 - 5) * speedMult,
            vy: (Math.random() * 10 - 7) * speedMult,
            size: 6 + Math.random() * 8,
            color: `hsl(${Math.random() * 360}, 90%, 65%)`,
            alpha: 1,
            life: 0,
            maxLife: 100 + Math.random() * 50,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() * 0.1 - 0.05) * speedMult,
          });
        }
      }
    };

    window.addEventListener('celebrate-burst' as any, handleCelebrationBlast);

    const triggerFireworkBlast = (x: number, y: number) => {
      audio.playClick('firework');
      const colors = ['#FFD700', '#FF1493', '#00FFFF', '#39FF14', '#FF4500', '#FF8C00', '#DDA0DD'];
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      const sparkCount = 45 + Math.floor(Math.random() * 25);

      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = (2 + Math.random() * 6) * speedMult;
        fireworksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          color: baseColor,
          alpha: 1,
          size: 2 + Math.random() * 3,
          gravity: 0.05,
          resistance: 0.98,
          decay: 0.012 + Math.random() * 0.012,
        });
      }
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Mouse glow overlay
      if (mouseGlowRef.current.active) {
        const radial = ctx.createRadialGradient(
          mouseGlowRef.current.x,
          mouseGlowRef.current.y,
          0,
          mouseGlowRef.current.x,
          mouseGlowRef.current.y,
          250
        );
        radial.addColorStop(0, 'rgba(255, 215, 0, 0.06)');
        radial.addColorStop(0.5, 'rgba(255, 105, 180, 0.02)');
        radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Manage ongoing Confetti rain & custom particles
      if (enableConfetti && Math.random() < 0.05 && particlesRef.current.length < 150) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() * 2 - 1) * speedMult,
          vy: (0.8 + Math.random() * 1.5) * speedMult,
          size: 5 + Math.random() * 10,
          color: `hsl(${Math.random() * 360}, 90%, 60%)`,
          alpha: 1,
          life: 0,
          maxLife: 300,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() * 0.04 - 0.02) * speedMult,
        });
      }

      // 3. Spawning balloons
      if (enableBalloons && Math.random() < 0.006 && balloonsRef.current.length < 12) {
        const balloonColors = ['#FF69B4', '#FFD700', '#00FFFF', '#9370DB', '#FF4500', '#00FA9A'];
        balloonsRef.current.push({
          id: Date.now() + Math.random(),
          x: Math.random() * canvas.width,
          y: canvas.height + 40,
          vx: (Math.random() * 0.8 - 0.4) * speedMult,
          vy: -(0.5 + Math.random() * 1.2) * speedMult,
          radius: 18 + Math.random() * 16,
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          sway: Math.random() * Math.PI * 2,
          swaySpeed: (0.01 + Math.random() * 0.02) * speedMult,
        });
      }

      // 4. Drawing ongoing fireworks
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const f = fireworksRef.current[i];
        f.vx *= f.resistance;
        f.vy *= f.resistance;
        f.vy += f.gravity;
        f.x += f.vx;
        f.y += f.vy;
        f.alpha -= f.decay;

        if (f.alpha <= 0) {
          fireworksRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = f.color;
        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Drawing balloons
      for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
        const b = balloonsRef.current[i];
        b.sway += b.swaySpeed;
        b.x += b.vx + Math.sin(b.sway) * 0.35;
        b.y += b.vy;

        if (b.y < -50) {
          balloonsRef.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = 0.8;
        ctx.fillStyle = b.color;
        
        // Draw standard balloon shape (elliptical)
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.radius * 0.8, b.radius, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw balloon string
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y + b.radius);
        ctx.bezierCurveTo(b.x - 5, b.y + b.radius + 15, b.x + 5, b.y + b.radius + 25, b.x, b.y + b.radius + 40);
        ctx.stroke();

        // Highlight shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(b.x - b.radius * 0.25, b.y - b.radius * 0.4, b.radius * 0.15, b.radius * 0.3, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Drawing Confetti / Floating custom particles
      ctx.globalAlpha = 1.0;
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        if (p.rotation !== undefined && p.rotSpeed !== undefined) {
          p.rotation += p.rotSpeed;
        }

        const opacity = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.y > canvas.height + 20) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;

        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) ctx.rotate(p.rotation);

        if (particleType === 'stars') {
          // Drawing simple star pattern
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            ctx.lineTo(Math.cos(((18 + k * 72) * Math.PI) / 180) * p.size, Math.sin(((18 + k * 72) * Math.PI) / 180) * p.size);
            ctx.lineTo(Math.cos(((54 + k * 72) * Math.PI) / 180) * (p.size * 0.4), Math.sin(((54 + k * 72) * Math.PI) / 180) * (p.size * 0.4));
          }
          ctx.closePath();
          ctx.fill();
        } else if (particleType === 'hearts') {
          // Drawing heart shape pattern
          ctx.beginPath();
          ctx.moveTo(0, p.size / 4);
          ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
          ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, p.size / 4);
          ctx.closePath();
          ctx.fill();
        } else if (particleType === 'sparkles') {
          // Sparkling dynamic 4-point star lens flare
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(0, 0, p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, p.size);
          ctx.quadraticCurveTo(0, 0, -p.size, 0);
          ctx.quadraticCurveTo(0, 0, 0, -p.size);
          ctx.closePath();
          ctx.fill();
        } else {
          // Standard Confetti square / rectangle particle
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }

        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      animFrame = requestAnimationFrame(render);
    };

    render();

    // Catch clicking balloon on canvas directly to pop!
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      for (let i = balloonsRef.current.length - 1; i >= 0; i--) {
        const b = balloonsRef.current[i];
        const dist = Math.hypot(clickX - b.x, clickY - b.y);
        if (dist <= b.radius) {
          // Pop it!
          audio.playClick('button');
          balloonsRef.current.splice(i, 1);

          // Spawn sparkle burst
          for (let k = 0; k < 12; k++) {
            particlesRef.current.push({
              x: b.x,
              y: b.y,
              vx: (Math.random() * 4 - 2) * speedMult,
              vy: (Math.random() * 4 - 2) * speedMult,
              size: 4 + Math.random() * 4,
              color: b.color,
              alpha: 1,
              life: 0,
              maxLife: 40 + Math.random() * 20,
              rotation: Math.random() * Math.PI,
              rotSpeed: 0.1,
            });
          }
          break;
        }
      }
    };

    canvas.addEventListener('mousedown', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleDocClick);
      window.removeEventListener('celebrate-burst' as any, handleCelebrationBlast);
      if (canvas) {
        canvas.removeEventListener('mousedown', handleCanvasClick);
      }
    };
  }, [enableFireworks, enableConfetti, enableBalloons, enableParticles, particleType, speedMult]);

  return (
    <canvas
      className="fixed inset-0 pointer-events-auto h-full w-full"
      style={{ zIndex: 5, pointerEvents: 'none' }}
      ref={canvasRef}
    />
  );
};
