import { useEffect, useMemo, useRef, useState } from "react";
import type { AppDef } from "../types";
import { THEMES, WALLPAPERS, setTheme, setWallpaper } from "../os";
import "./Spotlight.css";

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

interface Props {
  apps: AppDef[];
  onLaunch: (app: AppDef) => void;
  onClose: () => void;
}

function fuzzy(text: string, needle: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (const ch of text) {
    if (ch === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return false;
}

export function Spotlight({ apps, onLaunch, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const appCmds = apps.map((a) => ({
      id: `app:${a.id}`,
      label: a.title,
      hint: "Application",
      run: () => onLaunch(a),
    }));
    const themeCmds = THEMES.map((t) => ({
      id: `theme:${t}`,
      label: `Theme - ${t}`,
      hint: "Appearance",
      run: () => {
        setTheme(t);
      },
    }));
    const wallCmds = WALLPAPERS.map((w) => ({
      id: `wallpaper:${w}`,
      label: `Wallpaper - ${w}`,
      hint: "Appearance",
      run: () => {
        setWallpaper(w);
      },
    }));
    return [...appCmds, ...themeCmds, ...wallCmds];
  }, [apps, onLaunch]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return commands.slice(0, 6);
    return commands
      .filter((c) => fuzzy(c.label.toLowerCase(), needle))
      .slice(0, 8);
  }, [commands, query]);

  useEffect(() => setCursor(0), [query]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = results[cursor];
      if (picked) picked.run();
      onClose();
    }
  }

  return (
    <div className="spot__backdrop" onPointerDown={onClose}>
      <div className="spot" onPointerDown={(e) => e.stopPropagation()}>
        <div className="spot__field">
          <span className="spot__glyph">ctrl + K</span>
          <input
            ref={inputRef}
            value={query}
            placeholder="Search apps, themes, wallpapers"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        {results.length > 0 && (
          <ul className="spot__list">
            {results.map((c, i) => (
              <li
                key={c.id}
                className={`spot__row ${i === cursor ? "is-active" : ""}`}
                onPointerEnter={() => setCursor(i)}
                onClick={() => {
                  c.run;
                  onClose();
                }}
              >
                <span>{c.label}</span>
                <span className="spot__hint">{c.hint}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
