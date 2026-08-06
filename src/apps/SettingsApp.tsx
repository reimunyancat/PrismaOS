import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ACCENTS,
  THEMES,
  WALLPAPERS,
  getAccent,
  getTheme,
  getWallpaper,
  isLiteMode,
  resetLayout,
  setAccent,
  setLiteMode,
  setTheme,
  setWallpaper,
} from "../os";

const section: CSSProperties = { marginBottom: 18 };
const label: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--text-soft)",
  marginBottom: 8,
};
const row: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
};
const toggleRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  fontSize: 13,
};
const ghost: CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid rgba(127, 127, 127, 0.28)",
  background: "none",
  color: "inherit",
  font: "inherit",
  fontSize: 12.5,
  cursor: "pointer",
};
const chip = (on: boolean): CSSProperties => ({
  padding: "6px 12px",
  borderRadius: 8,
  border: on
    ? "1px solid var(--accent)"
    : "1px solid rgba(127, 127, 127, 0.28)",
  background: on ? "var(--accent)" : "rgba(127, 127, 127, 0.08)",
  color: on ? "#fff" : "inherit",
  font: "inherit",
  fontSize: 12.5,
  cursor: "pointer",
});
const swatch = (hex: string, on: boolean): CSSProperties => ({
  width: 26,
  height: 26,
  borderRadius: "50%",
  background: hex,
  border: on ? "2px solid var(--text-strong)" : "2px solid transparent",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4)",
  padding: 0,
  cursor: "pointer",
});

export function SettingsApp() {
  const [theme, setThemeState] = useState(getTheme());
  const [wallpaper, setWallpaperState] = useState(getWallpaper());
  const [accent, setAccentState] = useState(getAccent());
  const [lite, setLiteState] = useState(isLiteMode());

  return (
    <div>
      <div style={section}>
        <div style={label}>Theme</div>
        <div style={row}>
          {THEMES.map((t) => (
            <button
              key={t}
              style={chip(t === theme)}
              onClick={() => {
                setTheme(t);
                setThemeState(t);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div style={section}>
        <div style={label}>Wallpaper</div>
        <div style={row}>
          {WALLPAPERS.map((w) => (
            <button
              key={w}
              style={chip(w === wallpaper)}
              onClick={() => {
                setWallpaper(w);
                setWallpaperState(w);
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
      <div style={section}>
        <div style={label}>Accent</div>
        <div style={row}>
          {ACCENTS.map((hex) => (
            <button
              key={hex}
              aria-label={hex}
              style={swatch(hex, hex === accent)}
              onClick={() => {
                setAccent(hex);
                setAccentState(hex);
              }}
            />
          ))}
          <button
            style={ghost}
            onClick={() => {
              setAccent("");
              setAccentState("");
            }}
          >
            Theme default
          </button>
        </div>
      </div>
      <div style={section}>
        <div style={label}>Performance</div>
        <div style={toggleRow}>
          <span>Lite mode (disable blur and background animation)</span>
          <input
            type="checkbox"
            checked={lite}
            onChange={(e) => {
              setLiteMode(e.target.checked);
              setLiteState(e.target.checked);
            }}
          />
        </div>
      </div>
      <div style={section}>
        <div style={label}>Windows</div>
        <button
          style={ghost}
          onClick={() => {
            resetLayout();
            location.reload();
          }}
        >
          Reset window layout
        </button>
      </div>
    </div>
  );
}
