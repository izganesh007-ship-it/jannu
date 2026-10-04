"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Letter() {
  const r = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <main className="page">
      <div className="shell fade">
        <div className="nav">
          <a onClick={() => r.push("/cake")}>← Back</a>
          <span className="eyebrow">03 / 04</span>
        </div>

        <div className="card letter-card">
          {/* Celebration particles */}


          <div className="eyebrow">For you, Jannu</div>
          <h2 style={{ marginTop: 8 }}>A few honest words</h2>
          
          <div className="letter" style={{ marginTop: 24 }}>
            <p className={visible ? 'visible' : ''}>Happy Birthday, Swati.</p>
            <p className={visible ? 'visible' : ''}>
              I know I didn&apos;t always treat you the way you deserved when we were together. 
              There were things I didn&apos;t understand then that I understand much better now. 
              Looking back, I can see moments where I could have been more caring, more patient, and more understanding.
            </p>
            <p className={visible ? 'visible' : ''}>
              I&apos;m genuinely sorry for those moments. I can&apos;t go back and change the past, and I don&apos;t want to make excuses for it. 
              I just wanted to acknowledge it honestly, because you mattered to me and you deserved better from me.
            </p>
            <p className={visible ? 'visible' : ''}>
              Today isn&apos;t about making the past disappear. It&apos;s simply about wishing something good for you &mdash; 
              happiness that feels real, peace in your heart, and people around you who appreciate you for exactly who you are.
            </p>
            <p className={visible ? 'visible' : ''}>
              So, Jannu... have a beautiful birthday. Keep smiling, keep growing, and I hope this next chapter brings you many reasons to be happy.
            </p>
            <div className="signature">Happy Birthday, Jannu. ❤️</div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="btn secondary" onClick={() => r.push("/")}>
            Replay the surprise ↻
          </button>
        </div>
      </div>
    </main>
  );
}