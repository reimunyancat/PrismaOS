import { useCallback, useRef } from "react";

interface Options {
  x: number;
  y: number;
  onDragEnd?: (x: number, y: number, pointer: { x: number; y: number }) => void;
}

export function useDraggable({ x, y, onDragEnd }: Options) {
  const elRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x, y });
  const pointer = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);
      const offsetX = e.clientX - pos.current.x;
      const offsetY = e.clientY - pos.current.y;

      const onMove = (ev: PointerEvent) => {
        pos.current = { x: ev.clientX - offsetX, y: ev.clientY - offsetY };
        pointer.current = { x: ev.clientX, y: ev.clientY };
        const el = elRef.current;
        if (el) {
          el.style.left = `${pos.current.x}px`;
          el.style.top = `${pos.current.y}px`;
        }
      };
      const onUp = (ev: PointerEvent) => {
        if (handle.hasPointerCapture(ev.pointerId)) {
          handle.releasePointerCapture(ev.pointerId);
        }
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        onDragEnd?.(pos.current.x, pos.current.y, pointer.current);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [onDragEnd],
  );

  return { elRef, onPointerDown };
}
