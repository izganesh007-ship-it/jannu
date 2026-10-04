"use client";
import { useEffect, useState } from "react";

export default function Hearts() {
  const [hearts, setHearts] = useState<{ id: number; left: number; bottom: number; delay: number; size: number; type: string }[]>([]);

  useEffect(() => {
    // Initial hearts
    const initialHearts = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: (i * 73) % 100,
      bottom: (i % 5) * 3,
      delay: i * 0.35,
      size: 14 + (i % 5) * 6,
      type: ['♡', '♥', '❤', '💖', '✨'][Math.floor(Math.random() * 5)],
    }));
    setHearts(initialHearts);

    // Continuously add new hearts
    let counter = 18;
    const interval = setInterval(() => {
      setHearts(prev => {
        const newHeart = {
          id: counter++,
          left: Math.random() * 90 + 5,
          bottom: -5,
          delay: 0,
          size: 12 + Math.random() * 14,
          type: ['♡', '♥', '❤', '💖', '✨', '💕', '💗'][Math.floor(Math.random() * 7)],
        };
        return [...prev.slice(-20), newHeart]; // Keep max 20 hearts
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}%`,
            bottom: `${h.bottom}%`,
            animationDelay: `${h.delay}s`,
            fontSize: `${h.size}px`,
          } as React.CSSProperties}
        >
          {h.type}
        </span>
      ))}
      
      {/* Special floating hearts that follow a curved path */}
      {[0, 1, 2].map((i) => (
        <span
          key={`special-${i}`}
          className="heart special-heart"
          style={{
            left: `${15 + i * 30}%`,
            animationDelay: `${i * 1.5}s`,
          } as React.CSSProperties}
        >
          💖
        </span>
      ))}
    </div>
  );
}