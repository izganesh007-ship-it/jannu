"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Candles() {
  const r = useRouter();
  const [out, setOut] = useState<boolean[]>([false, false, false]);
  const [listening, setListening] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number; char: string }[]>([]);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const x = sessionStorage.getItem("candles");
      if (x) {
        const parsed = JSON.parse(x);
        setOut(parsed);
        if (parsed.every(Boolean)) setWishMade(true);
      }
    } catch {}
  }, []);

  const blow = (i: number) => {
    if (out[i]) return;
    setOut((v) => {
      const n = v.map((x, j) => (j === i ? true : x));
      try {
        sessionStorage.setItem("candles", JSON.stringify(n));
      } catch {}
      if (n.every(Boolean)) {
        setWishMade(true);
        createCelebration();
      }
      return n;
    });
  };

  const createCelebration = () => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: Date.now() + i,
      x: 40 + Math.random() * 20,
      y: 30 + Math.random() * 40,
      delay: Math.random() * 0.8,
      char: ['✨', '💖', '✦', '🌸', '✧', '💫', '❤️'][Math.floor(Math.random() * 7)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 4000);
  };

  const mic = async () => {
    if (listening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = new AudioContext();
      audioRef.current = ac;
      const src = ac.createMediaStreamSource(stream);
      const an = ac.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const data = new Uint8Array(an.fftSize);
      setListening(true);
      let start = 0;
      const loop = () => {
        an.getByteTimeDomainData(data);
        let sum = 0;
        for (const x of data) {
          const q = (x - 128) / 128;
          sum += q * q;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.16) {
          if (!start) start = performance.now();
          if (performance.now() - start > 450) {
            const i = out.findIndex((x) => !x);
            if (i >= 0) blow(i);
            start = 0;
          }
        } else start = 0;
        if (out.some((x) => !x)) requestAnimationFrame(loop);
        else {
          stream.getTracks().forEach((t) => t.stop());
          ac.close();
          setListening(false);
          audioRef.current = null;
        }
      };
      loop();
    } catch {
      setListening(false);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.close();
    };
  }, []);

  const blownCount = out.filter(Boolean).length;

  return (
    <main className="page">
      <div className="shell fade">
        <div className="nav">
          <a onClick={() => r.push("/")}>← Back</a>
          <span className="eyebrow">01 / 04</span>
        </div>
        
        <div className="card">
          <div className="eyebrow">Make a wish, Jannu</div>
          <h2>Close your eyes<br/>and blow ✨</h2>
          
          <div className="cake-container" role="img" aria-label={`Birthday cake with ${3 - blownCount} of 3 candles still lit`}>
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
                {p.char}
              </div>
            ))}
            
            <div className="cake">
              {["c1", "c2", "c3"].map((c, i) => (
                <div
                  key={c}
                  className={`candle ${c} ${out[i] ? "off" : ""}`}
                  onClick={() => blow(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && blow(i)}
                  aria-label={`Candle ${i + 1}, ${out[i] ? 'blown out' : 'still lit'}`}
                >
                  <span className="flame" />
                  <span className="candle-body" />
                  <span className="wick" />
                </div>
              ))}
              <div className="icing" />
              <div className="tier one" />
              <div className="tier two" />
            </div>
            
            <div className="counter">
              {blownCount} of 3 candles {blownCount === 1 ? 'is' : 'are'} out
              {blownCount > 0 && <span className="counter-heart"> ❤️</span>}
            </div>
            
            <div className="row">
              {out.map((x, i) => !x && (
                <button
                  className="btn secondary"
                  key={i}
                  onClick={() => blow(i)}
                  style={{ marginTop: 12 }}
                >
                  Blow candle {i + 1} 🕯️
                </button>
              ))}
            </div>
            
            <button className="btn mic-btn" onClick={mic} style={{ marginTop: 16 }}>
              {listening ? (
                <>
                  <span className="mic-pulse" /> Listening for your breath...
                </>
              ) : (
                '🎙 Blow with microphone'
              )}
            </button>
            <div className="mic">Microphone is optional — tapping works perfectly.</div>
            
            {wishMade && (
              <div className="fade wish-complete" style={{ marginTop: 24 }}>
                <p className="wish-text">Wish made. ❤️</p>
                <p className="wish-subtext">The candles remember your wish forever.</p>
                <button className="btn" onClick={() => r.push("/cake")}>
                  Cut the cake →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}