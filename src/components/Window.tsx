import { useCallback, useRef, useState } from "react";
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
  children: ReactNode;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onDragEnd: (id: string, w: number, y: number) => void;
  onResizeEnd: (id: string, width: number, height: number) => void;
}

export function Window(props: Props) {
  const { id, title, x, y, width, height, z, active, children } = props;
  const [zoomed, setZoomed] = useState(false);
  const [minimizing, setMinimizing] = useState(false);
  const dim = useRef({ w: width, h: height });
  const { elRef, onPointerDown } = useDraggable({
    x,
    y,
    onDragEnd: (nx, ny) => props.onDragEnd(id, nx, ny),
  });

  const onResizeStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = dim.current.w;
      const startH = dim.current.h;

      const onMove = (ev: PointerEvent) => {
        dim.current = {
          w: Math.max(280, startW + ev.clientX - startX),
          h: Math.max(180, startH + ev.clientY - startY),
        };
        const el = elRef.current;
        if (el) {
          el.style.width = `${dim.current.w}px`;
          el.style.height = `${dim.current.h}px`;
        }
      };
      const onUp = (ev: PointerEvent) => {
        if (handle.hasPointerCapture(ev.pointerId))
          handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
        props.onResizeEnd(id, dim.current.w, dim.current.h);
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

  return (
    <div
      ref={elRef}
      className={`win ${active ? "win--active" : ""} ${zoomed ? "win--zoom" : ""} ${minimizing ? "win--minimizing" : ""}`}
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
