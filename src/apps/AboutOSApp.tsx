import type { CSSProperties } from "react";
import { Logo } from "../components/Logo";

const wrap: CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};
const osName: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginTop: 12,
};
const version: CSSProperties = {
  fontSize: 12,
  color: "var(--text-soft)",
  marginTop: 2,
  marginBottom: 16,
};
const specs: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
  fontSize: 12.5,
};
const row: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "92px auto",
  gap: 12,
  textAlign: "left",
};
const specLabel: CSSProperties = {
  color: "var(--text-soft)",
  textAlign: "right",
};
const foot: CSSProperties = {
  marginTop: 18,
  fontSize: 12,
  color: "var(--text-soft)",
};

const SPECS: [string, string][] = [
  ["Engine", "React 18 + TypeScript"],
  ["Windowing", "useWindows (implement from scratch)"],
  ["Shell", "Aqua Liquid Glass"],
  ["Themes", "aqua, graphite, midnight, aurora"],
  ["Build", "Vite"],
];

export function AboutOSApp() {
  return (
    <div style={wrap}>
      <div style={{ color: "var(--text-strong)" }}>
        <Logo size={64} />
      </div>
      <div style={osName}>PrismaOS</div>
      <div style={version}>Version 0.2.0</div>
      <div style={specs}>
        {SPECS.map(([k, v]) => (
          <div key={k} style={row}>
            <span style={specLabel}>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
      <div style={foot}>
        Made by{" "}
        <a
          href="https://github.com/reimunyancat"
          target="_blank"
          rel="noreferrer"
        >
          reimunyancat
        </a>
      </div>
    </div>
  );
}
