import { useState } from "react";
import { HOME, listDir, normalizePath, parentPath, shortPath } from "../fs";
import type { FsFile, FsNode } from "../fs";
import { launchApp } from "../os";
import "./Files.css";

const PLACES: { label: string; path: string }[] = [
  { label: "Home", path: HOME },
  { label: "Projects", path: `${HOME}/Projects` },
  { label: "Notes", path: `${HOME}/Notes` },
  { label: "Applications", path: "/Applications" },
  { label: "System", path: "/System" },
];

export function FilesApp() {
  const [cwd, setCwd] = useState(HOME);
  const [selected, setSelected] = useState<FsFile | null>(null);
  const entries = listDir(cwd) ?? [];

  function enter(node: FsNode) {
    if (node.type === "dir") {
      setCwd(normalizePath(cwd, node.name));
      setSelected(null);
    } else setSelected(node);
  }

  return (
    <div className="files">
      <aside className="files__side">
        {PLACES.map((p) => (
          <button
            key={p.path}
            className={`files__place ${cwd === p.path ? "is-active" : ""}`}
            onClick={() => {
              setCwd(p.path);
              setSelected(null);
            }}
          >
            {p.label}
          </button>
        ))}
      </aside>
      <section className="files__main">
        <header className="files__bar">
          <button
            className="files__up"
            disabled={cwd === "/"}
            onClick={() => {
              setCwd(parentPath(cwd));
              setSelected(null);
            }}
          >
            ↑
          </button>
          <span className="files__path">{shortPath(cwd)}</span>
        </header>
        <div className="files__list">
          {entries.map((node) => (
            <button
              key={node.name}
              className={`files__row ${selected?.name === node.name ? "is-active" : ""}`}
              onClick={() => enter(node)}
            >
              <span className="files__glyph">
                {node.type === "dir" ? "▸" : "·"}
              </span>
              <span className="files__name">{node.name}</span>
            </button>
          ))}
          {entries.length === 0 && <div className="files__empty">Empty</div>}
        </div>
        {selected && (
          <div className="files__preview">
            <div className="files__preview-head">
              <strong>{selected.name}</strong>
              {selected.app && (
                <button
                  className="files__open"
                  onClick={() => launchApp(selected.app!)}
                >
                  Open in app
                </button>
              )}
            </div>
            <pre>{selected.content}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
