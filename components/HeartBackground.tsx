"use client";
import { useEffect, useRef, useState } from "react";

export default function HeartBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio, 2);
    let time = 0;
    let rafId: number;

    // Heart particles with depth
    interface HeartParticle {
      x: number;
      y: number;
      z: number; // depth: 0 = far, 1 = near
      size: number;
      baseSize: number;
      angle: number;
      speed: number;
      hue: number;
      opacity: number;
      phase: number;
      type: "main" | "trail" | "sparkle";
    }

    const particles: HeartParticle[] = [];
    const TRAIL_PARTICLES = 60;
    const SPARKLE_PARTICLES = 40;
    const MAIN_HEARTS = 3;

    // Mouse interaction
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const resize = () => {
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particles.length = 0;

      // Main floating hearts (larger, slower, more prominent)
      for (let i = 0; i < MAIN_HEARTS; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: 0.3 + Math.random() * 0.4,
          size: 0,
          baseSize: 60 + Math.random() * 80,
          angle: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.012,
          hue: 330 + Math.random() * 30,
          opacity: 0.15 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2,
          type: "main",
        });
      }

      // Trail hearts (medium, follow flow)
      for (let i = 0; i < TRAIL_PARTICLES; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: 0.1 + Math.random() * 0.5,
          size: 0,
          baseSize: 12 + Math.random() * 20,
          angle: Math.random() * Math.PI * 2,
          speed: 0.015 + Math.random() * 0.025,
          hue: 320 + Math.random() * 50,
          opacity: 0.08 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
          type: "trail",
        });
      }

      // Sparkle particles (tiny, fast)
      for (let i = 0; i < SPARKLE_PARTICLES; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random(),
          size: 0,
          baseSize: 3 + Math.random() * 5,
          angle: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.05,
          hue: 40 + Math.random() * 30,
          opacity: 0.3 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
          type: "sparkle",
        });
      }
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hue: number, opacity: number, fill = true) => {
      const s = size / 100;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);
      ctx.beginPath();
      ctx.moveTo(0, -20);
      ctx.bezierCurveTo(-40, -60, -100, 0, 0, 80);
      ctx.bezierCurveTo(100, 0, 40, -60, 0, -20);
      ctx.closePath();

      if (fill) {
        const gradient = ctx.createRadialGradient(0, -10, 0, 0, -10, 100);
        gradient.addColorStop(0, `hsla(${hue}, 85%, 75%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${hue + 10}, 75%, 65%, ${opacity * 0.8})`);
        gradient.addColorStop(1, `hsla(${hue + 20}, 65%, 55%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      } else {
        ctx.strokeStyle = `hsla(${hue}, 85%, 70%, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hue: number, opacity: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
      gradient.addColorStop(0, `hsla(${hue}, 90%, 85%, ${opacity})`);
      gradient.addColorStop(1, `hsla(${hue}, 80%, 70%, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      // 4-pointed star
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * size * 2, Math.sin(a) * size * 2);
      }
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    const animate = (now: number) => {
      if (reduceMotion) return;
      const dt = Math.min((now - time) / 1000, 0.05);
      time = now;

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.02;
      mouseY += (targetMouseY - mouseY) * 0.02;

      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Subtle background glow that follows mouse
      const bgGlow = ctx!.createRadialGradient(
        mouseX * window.innerWidth,
        mouseY * window.innerHeight,
        0,
        mouseX * window.innerWidth,
        mouseY * window.innerHeight,
        Math.max(window.innerWidth, window.innerHeight) * 0.8
      );
      bgGlow.addColorStop(0, "rgba(255, 105, 135, 0.03)");
      bgGlow.addColorStop(0.5, "rgba(159, 83, 107, 0.015)");
      bgGlow.addColorStop(1, "transparent");
      ctx!.fillStyle = bgGlow;
      ctx!.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw particles
      for (const p of particles) {
        // Depth-based parallax
        const depthFactor = 0.3 + p.z * 0.7;
        const parallaxX = (mouseX - 0.5) * 60 * depthFactor;
        const parallaxY = (mouseY - 0.5) * 60 * depthFactor;

        // Organic movement
        p.angle += p.speed * dt * 60;
        const orbitRadius = 30 + p.z * 50;
        const orbitX = Math.cos(p.angle) * orbitRadius;
        const orbitY = Math.sin(p.angle * 0.7) * orbitRadius * 0.6;

        // Breathing animation
        const breathe = Math.sin(time * 0.001 * (1 + p.z) + p.phase) * 0.15 + 1;

        // Calculate screen position
        const screenX = p.x + parallaxX + orbitX;
        const screenY = p.y + parallaxY + orbitY;

        // Wrap around screen
        let drawX = screenX;
        let drawY = screenY;
        if (drawX < -p.baseSize) drawX = window.innerWidth + p.baseSize;
        if (drawX > window.innerWidth + p.baseSize) drawX = -p.baseSize;
        if (drawY < -p.baseSize) drawY = window.innerHeight + p.baseSize;
        if (drawY > window.innerHeight + p.baseSize) drawY = -p.baseSize;

        // Size with depth and breathing
        p.size = p.baseSize * depthFactor * breathe * (0.8 + p.z * 0.4);
        const drawOpacity = p.opacity * depthFactor * (0.5 + p.z * 0.5);

        if (p.type === "main") {
          // Main hearts: draw glow first, then heart
          // Outer glow
          const glowGradient = ctx!.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.size * 1.5);
          glowGradient.addColorStop(0, `hsla(${p.hue}, 85%, 70%, ${drawOpacity * 0.3})`);
          glowGradient.addColorStop(1, `hsla(${p.hue + 15}, 70%, 60%, 0)`);
          ctx!.fillStyle = glowGradient;
          ctx!.beginPath();
          ctx!.arc(drawX, drawY, p.size * 1.5, 0, Math.PI * 2);
          ctx!.fill();

          // Heart shape
          drawHeart(ctx!, drawX, drawY, p.size * 1.2, p.hue, drawOpacity);
          // Inner highlight
          drawHeart(ctx!, drawX - p.size * 0.05, drawY - p.size * 0.08, p.size * 0.3, p.hue - 20, drawOpacity * 0.6);
        } else if (p.type === "trail") {
          drawHeart(ctx!, drawX, drawY, p.size, p.hue, drawOpacity * 0.7, true);
        } else {
          drawSparkle(ctx!, drawX, drawY, p.size, p.hue, drawOpacity, p.angle);
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetMouseX = e.touches[0].clientX / window.innerWidth;
        targetMouseY = e.touches[0].clientY / window.innerHeight;
      }
    };

    resize();
    initParticles();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="heart-bg-static" aria-hidden="true">
        <div className="static-heart" />
        <div className="static-heart" />
        <div className="static-heart" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="heart-canvas"
      aria-hidden="true"
      role="img"
      aria-label="Animated hearts floating in depth, responding to cursor movement"
    />
  );
}