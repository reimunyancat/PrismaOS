import { useState } from "react";
import type { CSSProperties } from "react";

interface Project {
  name: string;
  tag: string;
  desc: string;
  detail: string;
  links: { label: string; href: string }[];
}

const PROJECTS: Project[] = [
  {
    name: "PrismaOS",
    tag: "Web",
    desc: "The Portpolio site you are looking at right now",
    detail: "React + TypeScript",
    links: [
      { label: "GitHub", href: "https://github.com/reimunyancat/PrismaOS" },
    ],
  },
];

const grid: CSSProperties = { display: "grid", gap: 10 };
const card: CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 9,
  background: "rgba(127,127,127,0.08)",
  border: "1px solid rgba(127,127,127,0.16)",
  cursor: "pointer",
  textAlign: "left",
  font: "inherit",
  color: "inherit",
};
const head: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
};
const tagStyle: CSSProperties = {
  fontSize: 11,
  color: "var(--accent)",
  fontWeight: 600,
};
const descStyle: CSSProperties = {
  color: "var(--text-soft)",
  fontSize: 12.5,
  marginTop: 3,
};
const banner: CSSProperties = {
  height: 96,
  borderRadius: 10,
  marginBottom: 12,
  background: "linear-gradient(135deg, #38bdf8, #8b5cf6)",
  display: "grid",
  placeItems: "center",
  color: "#fff",
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: "0.04em",
};
const back: CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--accent)",
  cursor: "pointer",
  padding: 0,
  marginBottom: 10,
  fontSize: 13,
};
const detailText: CSSProperties = {
  marginTop: 8,
  lineHeight: 1.6,
};
const titleStrong: CSSProperties = {
  fontSize: 15,
};
const linkRow: CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 12,
};

export function ProjectApp() {
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div>
        <button style={back} onClick={() => setSelected(null)}>
          목록
        </button>
        <div style={banner}>{selected.name}</div>
        <div style={head}>
          <strong style={titleStrong}>{selected.name}</strong>
          <span style={tagStyle}>{selected.tag}</span>
        </div>
        <p style={detailText}>{selected.detail}</p>
        <div style={linkRow}>
          {selected.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={grid}>
      {PROJECTS.map((p) => (
        <button key={p.name} style={card} onClick={() => setSelected(p)}>
          <div style={head}>
            <strong>{p.name}</strong>
            <span style={tagStyle}>{p.tag}</span>
          </div>
          <div style={descStyle}>{p.desc}</div>
        </button>
      ))}
    </div>
  );
}
