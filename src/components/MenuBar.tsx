import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import "./MenuBar.css";

interface Props {
  osName: string;
  onAbout: () => void;
}

export function MenuBar({ osName, onAbout }: Props) {
  const [clock, setClock] = useState(formatNow);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutside = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("pointerdown", closeOnOutside);
    return () => window.removeEventListener("pointerdown", closeOnOutside);
  }, [menuOpen]);

  return (
    <div className="menubar">
      <div className="menubar__left">
        <div className="menubar__menu" ref={menuRef}>
          <button
            className={`menubar__logo ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Logo size={15} />
            <span>{osName}</span>
          </button>
          {menuOpen && (
            <div className="menubar__dropdown">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onAbout();
                }}
              >
                About {osName}
              </button>
              <div className="menubar__sep" />
              <button onClick={() => window.location.reload()}>
                Restart...
              </button>
            </div>
          )}
        </div>
        <span className="menubar__item">File</span>
        <span className="menubar__item">Edit</span>
        <span className="menubar__item">View</span>
        <span className="menubar__item">Help</span>
      </div>
      <div className="menubar__right">{clock}</div>
    </div>
  );
}

function formatNow(): string {
  const d = new Date();
  const date = d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const time = d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}
