import { useCallback, useRef, useState } from "react";
import type { AppDef, WindowInstance } from "../types";

type Geom = { x: number; y: number; width: number; height: number };
export type SnapZone = "left" | "right" | "full";

const LAYOUT_KEY = "prisma-layout-v2";
const MENUBAR_H = 26;
const DOCK_H = 74;

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
      const base = app.initial ?? { x: 120, y: 90, width: 460, height: 340 };
      const init = clampGeom({ ...base, ...saved });
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

  const resetLayout = useCallback(() => {
    localStorage.removeItem(LAYOUT_KEY);
    setWindows((prev) =>
      prev.map((w, i) => {
        const init = clampGeom({
          x: 120 + i * 30,
          y: 90 + i * 30,
          width: 460,
          height: 340,
        });
        return { ...w, ...init };
      }),
    );
  }, []);

  const snap = useCallback((id: string, zone: SnapZone) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const height = vh - MENUBAR_H - DOCK_H;
    const half = Math.round(vw / 2);
    const geom: Geom =
      zone === "left"
        ? { x: 0, y: MENUBAR_H, width: half, height }
        : zone === "right"
          ? { x: half, y: MENUBAR_H, width: vw - half, height }
          : { x: 0, y: MENUBAR_H, width: vw, height };
    saveGeom(id, geom);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...geom } : w)),
    );
  }, []);

  return {
    windows,
    open,
    close,
    focus,
    minimize,
    move,
    resize,
    resetLayout,
    snap,
  };
}

export function snapZone(px: number, py: number): SnapZone | null {
  const EDGE = 12;
  if (py <= MENUBAR_H + EDGE) return "full";
  if (px <= EDGE) return "left";
  if (px >= window.innerWidth - EDGE) return "right";
  return null;
}
