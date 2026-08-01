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
    name: "Ephemeris",
    tag: "Simulation, TS/Rust",
    desc: "Real-time N-body Solar System Simulator",
    detail:
      "Runs the solar system on real physics from NASA/JPL Horizons initial conditions. Velocity Verlet symplectic integration (energy drift ~1e-11 over a 10-year run), a Barnes-Hut octree at O(N log N) to render thousands of asteroid-belt bodies, and Newton-Raphson convergence for Kepler's equation. Three.js rendering + Tauri 2 (Rust) desktop packaging.",
    links: [
      { label: "GitHub", href: "https://github.com/reimunyancat/Ephemeris" },
    ],
  },
  {
    name: "DIVE",
    tag: "AI Travel Curation",
    desc: "Taste-based AI themed-travel curation.",
    detail:
      "Themed travel curation for pilgrimage and subculture trips. Retrieves themed places with pgvector embeddings and counters AI hallucination with multi-source fact-checking plus confidence scores. Leaflet + OSM route visualization, with self-hosted OSRM/GraphHopper to optimize itineraries by real travel time - no paid APIs.",
    links: [{ label: "GitHub", href: "https://github.com/reimunyancat/DIVE" }],
  },
  {
    name: "AudiLex",
    tag: "Speech AI",
    desc: "Speech transcription, translation, and pronunciation training (Whisper + LLM).",
    detail:
      "YouTube link or file upload -> transcription, translation, pronunciation training. Splits Django (data, API, WS) from a dedicated FastAPI AI node running Whisper/LLM inference on GPU for stability and scalability, and moved polling to WebSockets (Django Channels/Daphne). Tailwind v4 + optimistic UI.",
    links: [
      { label: "GitHub", href: "https://github.com/reimunyancat/AudiLex" },
    ],
  },
  {
    name: "Artifact",
    tag: "LLM Fact-Checking",
    desc: "LLM fact-verification board.",
    detail:
      "Automatically fact-checks each post with an LLM + web search, storing the approve/reject result and the rejection reason. Rejected by default - a conservative flow where a post is shown only after it passes verification. Django + OpenAI + DuckDuckGo.",
    links: [
      { label: "GitHub", href: "https://github.com/reimunyancat/Artifact" },
    ],
  },
  {
    name: "Enigma",
    tag: "Cryptography, C++/WASM",
    desc: "In-browser Enigma cipher machine",
    detail:
      "A single C++ engine shared by the CLI and WASM (Emscripten). Reproduces double-stepping exactly, featuring a Svelte + Three.js 3D rotor visualization and Web Audio key clicks.",
    links: [
      { label: "GitHub", href: "https://github.com/reimunyancat/Enigma" },
    ],
  },
  {
    name: "WaitForSale",
    tag: "ML Service",
    desc: "Predicts Steam discount probability and expected timing.",
    detail:
      "Trains an XGBoost classifier (300 trees, early stopping) on ITAD (IsThereAnyDeal) discount-history features and corrects class imbalance with scale_pos_weight. Three serving tiers - React+Vite / Express+PostgreSQL / FastAPI - with scheduled collection via node-cron.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/reimunyancat/wait-for-sale",
      },
    ],
  },
  {
    name: "PrismaOS",
    tag: "Web",
    desc: "The very site you're looking at right now.",
    detail:
      "A web desktop built from scratch in React + TypeScript. The window manager, Dock, terminal, and theme switching are all hand-built - and this portfolio itself is the result.",
    links: [
      { label: "GitHub", href: "https://github.com/reimunyancat/PrismaOS" },
    ],
  },
];

const grid: CSSProperties = {
  display: "grid",
  gap: 10,
};
const card: CSSProperties = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: 9,
  background: "rgba(127, 127, 127, 0.08)",
  border: "1px solid rgba(127, 127, 127, 0.16)",
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

export function ProjectsApp() {
  const [selected, setSelected] = useState<Project | null>(null);

  if (selected) {
    return (
      <div>
        <button style={back} onClick={() => setSelected(null)}>
          ← Back
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
