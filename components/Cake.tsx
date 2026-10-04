"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Cake() {
  const r = useRouter();
  const [cut, setCut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const cakeRef = useRef<HTMLDivElement>(null);

  const handleCut = () => {
    if (cut) return;
    setCut(true);
    
    // Create celebration particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 40,
      y: 40 + Math.random() * 20,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);
    
    setTimeout(() => setShowMessage(true), 800);
  };

  // Auto-cleanup particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => setParticles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  return (
    <main className="page">
      <div className="shell fade">
        <div className="nav">
          <a onClick={() => r.push("/candles")}>← Back</a>
          <span className="eyebrow">02 / 04</span>
        </div>
        
        <div className="card">
          <div className="eyebrow">One more little moment</div>
          <h2>Cut the cake</h2>
          <p className="sub" style={{ marginBottom: 24 }}>
            Tap the cake to make the first slice 🎂
          </p>
          
          <div className="cake-container" ref={cakeRef} onClick={handleCut} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleCut()}>
            {/* Celebration particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  animationDelay: `${p.delay}s`,
                  '--color': `hsl(${330 + Math.random() * 30}, 70%, 65%)`,
                } as React.CSSProperties}
              >
                {['✨', '💖', '✦', '🌸', '✧'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
            
            {/* Cake visualization */}
            <div className={`slice ${cut ? "cut" : ""}`}>
              <div className="cake-layers">
                <div className="tier bottom"></div>
                <div className="tier middle"></div>
                <div className="tier top"></div>
                <div className="frosting"></div>
                <div className="cherry" />
              </div>
              
              <div className="knife" />
              
              {/* Cut line indicator when not cut */}
              {!cut && (
                <div className="cut-hint">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l18 18" />
                    <path d="M12 3v18" />
                  </svg>
                  <span>Tap to cut</span>
                </div>
              )}
            </div>
            
            {!cut ? (
              <p className="counter">👆 Tap the cake to make your slice</p>
            ) : (
              <div className="fade" style={{ marginTop: 20 }}>
                <p className="celebration-text">And just like that... cake cut! 🎂✨</p>
                {showMessage && (
                  <button className="btn" onClick={() => r.push("/letter")}>
                    There&apos;s something I want to say →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}