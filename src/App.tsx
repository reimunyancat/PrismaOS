import { useCallback, useState } from "react";
import { BootScreen } from "./components/BootScreen";
import { MenuBar } from "./components/MenuBar";
import { Dock } from "./components/Dock";
import { Window } from "./components/Window";
import { useWindows } from "./hooks/useWindows";
import {
  AboutIcon,
  MusicIcon,
  ProjectsIcon,
  TerminalIcon,
} from "./components/icons";
import type { AppDef } from "./types";
import "./App.css";

const OS_NAME = "PrismaOS";

const TEMP_APPS: AppDef[] = [
  {
    id: "about",
    title: "About Me",
    icon: <AboutIcon />,
    initial: { x: 110, y: 84, width: 420, height: 330 },
    render: () => <p>About</p>,
  },
  {
    id: "projects",
    title: "Projects",
    icon: <ProjectsIcon />,
    initial: { x: 280, y: 150, width: 500, height: 400 },
    render: () => <p>Terminal</p>,
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <TerminalIcon />,
    initial: { x: 210, y: 230, width: 500, height: 360 },
    render: () => <p>Terminal</p>,
  },
  {
    id: "music",
    title: "Music",
    icon: <MusicIcon />,
    initial: { x: 340, y: 120, width: 300, height: 380 },
    render: () => <p>Music</p>,
  },
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const { windows, open, close, focus, minimize, move, resize } = useWindows();

  const topZ = windows
    .filter((w) => !w.minimized)
    .reduce((m, w) => Math.max(m, w.z), 0);

  const handleBooted = useCallback(() => setBooted(true), []);
  const openAbout = useCallback(() => {
    const about = TEMP_APPS.find((a) => a.id === "about");
    if (about) open(about);
  }, [open]);

  return (
    <div className="desktop">
      <MenuBar osName={OS_NAME} onAbout={openAbout} />

      <div className="desktop__icons">
        {TEMP_APPS.map((app) => (
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

      <Dock
        apps={TEMP_APPS}
        openIds={windows.map((w) => w.id)}
        onLaunch={open}
      />

      {!booted && <BootScreen onDone={handleBooted} />}
    </div>
  );
}
