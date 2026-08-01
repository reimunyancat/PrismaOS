import { useRef, useState } from "react";
import type { AppDef } from "../types";
import "./Dock.css";

interface Props {
  apps: AppDef[];
  openIds: string[];
  onLaunch: (app: AppDef) => void;
}

export function Dock({ apps, openIds, onLaunch }: Props) {
  const [pointerX, setPointerX] = useState<number | null>(null);

  return (
    <div
      className={`dock ${pointerX !== null ? "dock--hover" : ""}`}
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") setPointerX(e.clientX);
      }}
      onPointerLeave={() => setPointerX(null)}
    >
      {apps.map((app) => (
        <DockItem
          key={app.id}
          app={app}
          running={openIds.includes(app.id)}
          pointerX={pointerX}
          onLaunch={onLaunch}
        />
      ))}
    </div>
  );
}

interface ItemProps {
  app: AppDef;
  running: boolean;
  pointerX: number | null;
  onLaunch: (app: AppDef) => void;
}

function DockItem({ app, running, pointerX, onLaunch }: ItemProps) {
  const ref = useRef<HTMLButtonElement>(null);

  let scale = 1;
  if (pointerX !== null && ref.current) {
    const r = ref.current.getBoundingClientRect();
    const d = Math.abs(pointerX - (r.left + r.width / 2));
    scale = 1 + 0.6 * Math.exp(-(d * d) / (2 * 70 * 70));
  }

  return (
    <button
      ref={ref}
      className="dock__item"
      style={{ transform: `scale(${scale}) translateY(${(scale - 1) * -8}px)` }}
      onClick={() => onLaunch(app)}
    >
      <span className="dock__label">{app.title}</span>
      <span className="dock__icon">{app.icon}</span>
      {running && <span className="dock__dot" />}
    </button>
  );
}
