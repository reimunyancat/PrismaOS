import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { AppDef } from "../types";
import "./Dock.css";

const MAX_SCALE = 1.32;
const LIFT = 4;
const FALLOFF = 70;

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
    scale = 1 + (MAX_SCALE - 1) * Math.exp(-(d * d) / (2 * FALLOFF * FALLOFF));
  }

  const style = {
    transform: `scale(${scale}) translateY(${(scale - 1) * -LIFT}px)`,
    "--inv": 1 / scale,
  } as CSSProperties;

  return (
    <button
      ref={ref}
      className="dock__item"
      style={style}
      onClick={() => onLaunch(app)}
    >
      <span className="dock__label">{app.title}</span>
      <span className="dock__icon">{app.icon}</span>
      {running && <span className="dock__dot" />}
    </button>
  );
}
