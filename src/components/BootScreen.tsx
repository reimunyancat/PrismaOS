import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import "./BootScreen.css";

const BOOT_MS = 2400;

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setprogress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / BOOT_MS);
      setprogress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        window.setTimeout(onDone, 600);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={`boot ${leaving ? "boot--leaving" : ""}`}>
      <div className="boot__logo">
        <Logo size={76} />
      </div>
      <div className="boot__name">PrismaOS</div>
      <div className="boot__bar">
        <div className="boot__fill" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
