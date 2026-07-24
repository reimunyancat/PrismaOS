import { useCallback, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { Window } from "./components/Window";
import { useWindows } from "./hooks/useWindows";
import type { AppDef } from "./types";
import "./App.css";

const TEMP_APPS: AppDef[] = [
  {
    id: "about",
    title: "About Me",
    icon: null,
    initial: { x: 120, y: 90, width: 420, height: 300 },
    render: () => (
      <p>창을 끌고, 우하단 모서리로 크기를 조절하고, 신호등을 눌러보세요.</p>
    ),
  },
  {
    id: "projects",
    title: "Projects",
    icon: null,
    initial: { x: 320, y: 170, width: 480, height: 340 },
    render: () => (
      <p>두 창을 겹쳐 띄워 포커스(맨 앞으로 오기)를 확인해보세요.</p>
    ),
  },
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const { windows, open, close, focus, minimize, move, resize } = useWindows();

  const topZ = windows
    .filter((w) => !w.minimized)
    .reduce((m, w) => Math.max(m, w.z), 0);

  const handleBooted = useCallback(() => setBooted(true), []);

  return (
    <div className="desktop">
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          gap: 8,
          zIndex: 1,
        }}
      >
        {TEMP_APPS.map((app) => (
          <button key={app.id} onClick={() => open(app)}>
            {app.title}
          </button>
        ))}
      </div>

      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          const app = TEMP_APPS.find((a) => a.id === w.id)!;
          return (
            <Window
              key={w.id}
              id={w.id}
              title={w.title}
              x={w.x}
              y={w.y}
              width={w.width}
              height={w.height}
              z={w.z}
              active={w.z === topZ}
              onFocus={focus}
              onClose={close}
              onMinimize={minimize}
              onDragEnd={move}
              onResizeEnd={resize}
            >
              {app.render()}
            </Window>
          );
        })}
      {!booted && <BootScreen onDone={handleBooted} />}
    </div>
  );
}
