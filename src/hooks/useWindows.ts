import { use, useCallback, useRef, useState } from "react";
import type { AppDef, WindowInstance } from "../types";

type Geom = { x: number; y: number; width: number; height: number };
const LAYOUT_KEY = "prisma-layout";

function loadLayout(): Record<string, Geom> {
  try {
    return JSON.parse(localStorage.getItem(LAYOUT_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveGeom(id: string, geom: Partial<Geom>) {
  const all = loadLayout();
  all[id] = { ...all[id], ...geom } as Geom;
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(all));
}

function clampGeom(g: Geom): Geom {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.max(280, Math.min(g.width, vw));
  const height = Math.max(180, Math.min(g.height, vh - 26));
  const x = Math.max(0, Math.min(g.x, vw - 120));
  const y = Math.max(26, Math.min(g.y, vh - 120));
  return { x, y, width, height };
}

export function useWindows() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const zCounter = useRef(1);

  const open = useCallback((app: AppDef) => {
    setWindows((prev) => {
      zCounter.current += 1;
      const existing = prev.find((w) => w.id === app.id);
      if (existing)
        return prev.map((w) =>
          w.id === app.id ? { ...w, minimized: false, z: zCounter.current } : w,
        );
      const saved = loadLayout()[app.id];
      const init = clampGeom(
        saved ?? app.initial ?? { x: 120, y: 90, width: 460, height: 340 },
      );
      return [
        ...prev,
        {
          id: app.id,
          title: app.title,
          ...init,
          z: zCounter.current,
          minimized: false,
        },
      ];
    });
  }, []);

  const close = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const focus = useCallback((id: string) => {
    setWindows((prev) => {
      const w = prev.find((x) => x.id === id);
      if (!w || w.z === zCounter.current) return prev;
      zCounter.current += 1;
      return prev.map((x) => (x.id === id ? { ...x, z: zCounter.current } : x));
    });
  }, []);

  const minimize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }, []);

  const move = useCallback((id: string, x: number, y: number) => {
    saveGeom(id, { x, y });
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  const resize = useCallback((id: string, width: number, height: number) => {
    saveGeom(id, { width, height });
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w)),
    );
  }, []);

  return { windows, open, close, focus, minimize, move, resize };
}
