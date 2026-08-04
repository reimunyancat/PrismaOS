import { useCallback, useEffect, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { MenuBar } from "./components/MenuBar";
import { Dock } from "./components/Dock";
import { Window } from "./components/Window";
import { Spotlight } from "./components/Spotlight";
import { useHotkeys } from "./hooks/useHotKeys";
import { useWindows } from "./hooks/useWindows";
import type { WindowInstance } from "./types";
import { APPS } from "./apps";
import { bindOS } from "./os";
import "./App.css";

const OS_NAME = "PrismaOS";
const VISIBLE_APPS = APPS.filter((a) => !a.hidden);

export default function App() {
  const [booted, setBooted] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const { windows, open, close, focus, minimize, move, resize, resetLayout } =
    useWindows();

  const topZ = windows
    .filter((w) => !w.minimized)
    .reduce((m, w) => Math.max(m, w.z), 0);
  const activeId =
    windows.find((w) => !w.minimized && w.z === topZ)?.id ?? null;

  useEffect(() => {
    bindOS(APPS, (id) => {
      const app = APPS.find((a) => a.id === id);
      if (!app) return false;
      open(app);
      return true;
    });
  }, [open]);

  const handleBooted = useCallback(() => setBooted(true), []);
  const launchById = useCallback(
    (id: string) => {
      const app = APPS.find((a) => a.id === id);
      if (app) open(app);
    },
    [open],
  );
  const openAbout = useCallback(() => launchById("about-os"), [launchById]);
  const openById = useCallback(
    (id: string) => {
      const app = APPS.find((a) => a.id === id);
      if (app) open(app);
    },
    [open],
  );
  const front = windows
    .filter((w) => !w.minimized)
    .reduce<WindowInstance | null>(
      (top, w) => (!top || w.z > top.z ? w : top),
      null,
    );
  const closeActive = useCallback(() => {
    if (activeId) close(activeId);
  }, [activeId, close]);
  const minimizeActive = useCallback(() => {
    if (activeId) minimize(activeId);
  }, [activeId, minimize]);

  useHotkeys({
    onSpotlight: () => setSpotlight((v) => !v),
    onClose: () => {
      if (front) close(front.id);
    },
    onMinimize: () => {
      if (front) minimize(front.id);
    },
    onSettings: () => openById("settings"),
    onCycle: () => {
      const visible = windows.filter((w) => !w.minimized);
      if (visible.length < 2) return;
      const sorted = [...visible].sort((a, b) => a.z - b.z);
      focus(sorted[sorted.length - 2].id);
    },
  });

  return (
    <div className="desktop">
      <MenuBar
        osName={OS_NAME}
        onAbout={openAbout}
        onLaunch={launchById}
        onCloseActive={closeActive}
        onMinimizeActive={minimizeActive}
        onResetLayout={resetLayout}
        hasActiveWindow={activeId !== null}
      />
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

      {windows.map((w) => {
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
            active={!w.minimized && w.z === topZ}
            minimized={w.minimized}
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
      {spotlight && (
        <Spotlight
          apps={VISIBLE_APPS}
          onLaunch={open}
          onClose={() => setSpotlight(false)}
        />
      )}
      {!booted && <BootScreen onDone={handleBooted} />}
    </div>
  );
}
