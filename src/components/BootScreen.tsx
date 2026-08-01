import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import "./BootScreen.css";

const BOOT_MS = 2200;
const FADE_MS = 520;
const SESSION_KEY = "prisma-booted";

interface Stage {
  at: number;
  text: string;
}

const STAGES: Stage[] = [
  { at: 0.0, text: "prism kernel 0.2.0 (web) booting" },
  { at: 0.16, text: "mount /dev/display ......... ok" },
  { at: 0.32, text: "load theme tokens (aqua) ... ok" },
  { at: 0.5, text: "start window manager ....... ok" },
  { at: 0.68, text: "register apps .............. ok" },
  { at: 0.84, text: "start prism-sh ............. ok" },
  { at: 0.96, text: "welcome, reimunyancat" },
];

function readSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(1);
    setLeaving(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage blocked (private mode) - boot again next time, no crash
    }
    window.setTimeout(onDone, FADE_MS);
  }, [onDone]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || readSession()) {
      const t = window.setTimeout(finish, 120);
      return () => window.clearTimeout(t);
    }

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / BOOT_MS);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finish]);

  useEffect(() => {
    const skip = () => finish();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [finish]);

  const pct = Math.round(progress * 100);

  return (
    <div
      className={`boot ${leaving ? "boot--leaving" : ""}`}
      role="status"
      aria-label="Booting PrismaOS"
    >
      <div className="boot__stage">
        <div className="boot__glass">
          <div className="boot__beam" aria-hidden="true" />
          <div className="boot__logo">
            <Logo size={64} />
          </div>
        </div>

        <div className="boot__name">
          Prisma<span>OS</span>
        </div>

        <div className="boot__bar">
          <div className="boot__fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="boot__log">
          {STAGES.filter((s) => progress >= s.at).map((s) => (
            <div key={s.text} className="boot__line">
              {s.text}
            </div>
          ))}
        </div>

        <div className="boot__hint">click or press any key to skip</div>
      </div>
    </div>
  );
}
