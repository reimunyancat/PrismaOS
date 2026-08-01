import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { MenuBar } from "./components/MenuBar";
import { Dock } from "./components/Dock";
import { Window } from "./components/Window";
import { useWindows } from "./hooks/useWindows";
import { APPS } from "./apps";
import { bindOS } from "./os";
import "./App.css";

const OS_NAME = "PrismaOS";
const VISIBLE_APPS = APPS.filter((a) => !a.hidden);

export default function App() {
  const [booted, setBooted] = useState(false);
  const { windows, open, close, focus, minimize, move, resize } = useWindows();

  const topZ = windows
    .filter((w) => !w.minimized)
    .reduce((m, w) => Math.max(m, w.z), 0);

  useEffect(() => {
    bindOS(APPS, (id) => {
      const app = APPS.find((a) => a.id === id);
      if (!app) return false;
      open(app);
      return true;
    });
  }, [open]);

  const handleBooted = useCallback(() => setBooted(true), []);
  const openAbout = useCallback(() => {
    const about = APPS.find((a) => a.id === "about-os");
    if (about) open(about);
  }, [open]);

  return (
    <div className="desktop">
      <MenuBar osName={OS_NAME} onAbout={openAbout} />
      <div className="desktop__icons">
        {VISIBLE_APPS.map((app) => (
          <button
            key={app.id}
            className="desktop__icon"
            onDoubleClick={() => open(app)}
          >
            <span className="desktop__icon-glyph">{app.icon}</span>
            <span className="desktop__icon-name">{app.title}</span>
          </button>
        ))}
      </div>

      {windows
        .filter((w) => !w.minimized)
        .map((w) => {
          const app = APPS.find((a) => a.id === w.id)!;
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
      <Dock
        apps={VISIBLE_APPS}
        openIds={windows.map((w) => w.id)}
        onLaunch={open}
      />

      {!booted && <BootScreen onDone={handleBooted} />}
    </div>
  );
}
