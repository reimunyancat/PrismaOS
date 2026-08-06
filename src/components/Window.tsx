import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { useDraggable } from "../hooks/useDraggable";
import "./Window.css";

interface Props {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  active: boolean;
  minimized: boolean;
  children: ReactNode;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onDragEnd: (
    id: string,
    x: number,
    y: number,
    pointer: { x: number; y: number },
  ) => void;
  onResizeEnd: (id: string, width: number, height: number) => void;
}

export function Window(props: Props) {
  const { id, title, x, y, width, height, z, active, minimized, children } =
    props;
  const [zoomed, setZoomed] = useState(false);
  const [minimizing, setMinimizing] = useState(false);
  const { elRef, onPointerDown } = useDraggable({
    x,
    y,
    onDragEnd: (nx, ny, pointer) => props.onDragEnd(id, nx, ny, pointer),
  });

  const onResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const el = elRef.current;
      if (!el) return;

      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = el.offsetWidth;
      const startH = el.offsetHeight;
      let nextW = startW;
      let nextH = startH;

      const onMove = (ev: PointerEvent) => {
        nextW = Math.max(280, startW + ev.clientX - startX);
        nextH = Math.max(180, startH + ev.clientY - startY);
        el.style.width = `${nextW}px`;
        el.style.height = `${nextH}px`;
      };
      const onUp = (ev: PointerEvent) => {
        if (handle.hasPointerCapture(ev.pointerId))
          handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        props.onResizeEnd(id, nextW, nextH);
      };
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [id, props, elRef],
  );

  const handleMinimize = useCallback(() => setMinimizing(true), []);
  const onGenieEnd = useCallback(() => {
    if (minimizing) {
      setMinimizing(false);
      props.onMinimize(id);
    }
  }, [minimizing, id, props]);

  const winStyle = { left: x, top: y, width, height, zIndex: z };

  const classes = [
    "win",
    active ? "win--active" : "",
    zoomed ? "win--zoom" : "",
    minimizing ? "win--minimizing" : "",
    minimized && !minimizing ? "win--hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={elRef}
      className={classes}
      style={winStyle}
      onPointerDown={() => props.onFocus(id)}
      onAnimationEnd={onGenieEnd}
    >
      <div
        className="win__titlebar"
        onPointerDown={zoomed ? undefined : onPointerDown}
        onDoubleClick={() => setZoomed((v) => !v)}
      >
        <div className="win__lights">
          <button
            className="light light--close"
            aria-label="close"
            onClick={(e) => {
              e.stopPropagation();
              props.onClose(id);
            }}
          />
          <button
            className="light light--min"
            aria-label="minimize"
            onClick={(e) => {
              e.stopPropagation();
              handleMinimize();
            }}
          />
          <button
            className="light light--max"
            aria-label="zoom"
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((v) => !v);
            }}
          />
        </div>
        <span className="win__title">{title}</span>
      </div>
      <div className="win__body">{children}</div>
      {!zoomed && <div className="win__resize" onPointerDown={onResizeStart} />}
    </div>
  );
}
