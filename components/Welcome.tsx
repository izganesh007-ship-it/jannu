"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Welcome() {
  const r = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const startJourney = () => {
    try {
      sessionStorage.setItem("started", "1");
    } catch {}
    r.push("/candles");
  };

  return (
    <main className="page">
      <section className="shell center">
        <div className={`hero fade ${visible ? 'visible' : ''}`}>
          <div className="eyebrow">A little surprise for</div>
          <div className="script">Swati</div>
          <h1>My Jannu</h1>
          <p className="sub">
            Some birthdays deserve more than a simple &ldquo;Happy Birthday.&rdquo;
            So I made you a tiny journey instead &mdash;
            one candle, one cake, and a few words
            I really wanted you to hear.
          </p>
          <button className="btn btn-start" onClick={startJourney}>
            <span>Start the surprise</span>
            <span className="btn-arrow">✨</span>
          </button>
          
          <div className="hint" style={{ marginTop: 24, fontSize: 12, color: '#9a6a78' }}>
            🎂 &middot; 🕯️ &middot; 💌
          </div>
        </div>
      </section>
    </main>
  );
}