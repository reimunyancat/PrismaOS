import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { THEMES, setTheme } from "../os";
import "./MenuBar.css";

interface Props {
  osName: string;
  onAbout: () => void;
  onLaunch: (id: string) => void;
  onCloseActive: () => void;
  onMinimizeActive: () => void;
  onResetLayout: () => void;
  hasActiveWindow: boolean;
}

type Item =
  | "sep"
  | {
      label: string;
      run: () => void;
      shortcut?: string;
      disabled?: boolean;
      checked?: boolean;
    };

type Menu = { id: string; label: string; items: Item[] };

export function MenuBar({
  osName,
  onAbout,
  onLaunch,
  onCloseActive,
  onMinimizeActive,
  onResetLayout,
  hasActiveWindow,
}: Props) {
  const [clock, setClock] = useState(formatNow);
  const [openId, setOpenId] = useState<string | null>(null);
  const [theme, setThemeState] = useState(
    () => document.documentElement.dataset.theme || "aqua",
  );
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const closeOnOutside = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("pointerdown", closeOnOutside);
    window.addEventListener("keydown", closeOnEsc);
    return () => {
      window.removeEventListener("pointerdown", closeOnOutside);
      window.removeEventListener("keydown", closeOnEsc);
    };
  }, [openId]);

  const applyTheme = (name: string) => {
    if (setTheme(name)) setThemeState(name);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  const prismaMenu: Menu = {
    id: "prisma",
    label: osName,
    items: [
      { label: `About ${osName}`, run: onAbout },
      "sep",
      { label: "Reset Window Layout", run: onResetLayout },
      { label: "Restart...", run: () => window.location.reload() },
    ],
  };

  const menus: Menu[] = [
    {
      id: "file",
      label: "File",
      items: [
        { label: "New Terminal", run: () => onLaunch("terminal") },
        { label: "Open Projects", run: () => onLaunch("projects") },
        { label: "Open Music", run: () => onLaunch("music") },
        "sep",
        {
          label: "Minimize Window",
          run: onMinimizeActive,
          shortcut: "\u2318M",
          disabled: !hasActiveWindow,
        },
        {
          label: "Close Window",
          run: onCloseActive,
          shortcut: "\u2318W",
          disabled: !hasActiveWindow,
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        {
          label: "Copy Link to This Page",
          run: () => navigator.clipboard?.writeText(location.href),
        },
        {
          label: "Select All",
          run: () => getSelection()?.selectAllChildren(document.body),
        },
        "sep",
        { label: "Reset Window Layout", run: onResetLayout },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        ...THEMES.map((name) => ({
          label: capitalize(name),
          run: () => applyTheme(name),
          checked: theme === name,
        })),
        "sep" as const,
        { label: "Toggle Fullscreen", run: toggleFullscreen, shortcut: "F11" },
      ],
    },
    {
      id: "help",
      label: "Help",
      items: [
        { label: "Terminal Help", run: () => onLaunch("terminal") },
        {
          label: "GitHub Repository",
          run: () =>
            window.open(
              "https://github.com/reimunyancat/PrismaOS",
              "_blank",
              "noopener",
            ),
        },
        "sep",
        { label: `About ${osName}`, run: onAbout },
      ],
    },
  ];

  const hoverSwitch = (id: string) => {
    if (openId) setOpenId(id);
  };

  const renderMenu = (menu: Menu, isLogo = false) => (
    <div className="menubar__menu" key={menu.id}>
      <button
        className={`${isLogo ? "menubar__logo" : "menubar__item"} ${
          openId === menu.id ? "is-open" : ""
        }`}
        onClick={() => setOpenId((v) => (v === menu.id ? null : menu.id))}
        onPointerEnter={() => hoverSwitch(menu.id)}
      >
        {isLogo && <Logo size={15} />}
        <span>{menu.label}</span>
      </button>
      {openId === menu.id && (
        <div className="menubar__dropdown">
          {menu.items.map((item, i) =>
            item === "sep" ? (
              <div className="menubar__sep" key={`sep-${i}`} />
            ) : (
              <button
                key={item.label}
                disabled={item.disabled}
                onClick={() => {
                  setOpenId(null);
                  item.run();
                }}
              >
                <span className="menubar__check">
                  {item.checked ? "\u2713" : ""}
                </span>
                <span className="menubar__label">{item.label}</span>
                {item.shortcut && (
                  <span className="menubar__shortcut">{item.shortcut}</span>
                )}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="menubar" ref={barRef}>
      <div className="menubar__left">
        {renderMenu(prismaMenu, true)}
        {menus.map((m) => renderMenu(m))}
      </div>
      <div className="menubar__right">{clock}</div>
    </div>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatNow(): string {
  const d = new Date();
  const date = d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
  const time = d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} ${time}`;
}
