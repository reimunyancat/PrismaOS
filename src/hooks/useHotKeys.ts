import { useEffect, useRef } from "react";

export interface HotKeyHandlers {
  onSpotlight: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onSettings: () => void;
  onCycle: () => void;
}

export function useHotkeys(handlers: HotKeyHandlers) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;
      const map: Record<string, (() => void) | undefined> = {
        k: ref.current.onSpotlight,
        w: ref.current.onClose,
        m: ref.current.onMinimize,
        ",": ref.current.onSettings,
        "`": ref.current.onCycle,
      };
      const run = map[e.key.toLowerCase()];
      if (!run) return;
      e.preventDefault();
      run();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
