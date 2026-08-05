import { useEffect, useRef, useState } from "react";
import {
  launchApp,
  listApps,
  setTheme,
  setWallpaper,
  THEMES,
  WALLPAPERS,
} from "../os";
import { HOME, getNode, listDir, normalizePath, shortPath } from "../fs";
import "./Terminal.css";

interface Line {
  kind: "in" | "out";
  text: string;
  cwd?: string;
}

const BANNER =
  "PrismaOS Terminal 0.3 — type 'help' to get started. (ctrl + K opens Spotlight)";

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: BANNER }]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(HOME);
  const histRef = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = termRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  function run(raw: string) {
    const tokens = raw.trim().split(/\s+/);
    const cmd = tokens[0] ?? "";
    const arg = tokens[1];
    const out: string[] = [];
    switch (cmd) {
      case "":
        break;
      case "help":
        out.push(
          "help,  about,  projects,  ls,  cd,  pwd,  cat <file>,  open <app|file>,  apps",
        );
        out.push(
          "theme <name>,  wallpaper <name>,  fastfetch,  clear    (ctrl + K Spotlight, ctrl + , Settings)",
        );
        break;
      case "about":
        out.push("reimunyancat — developer Run 'open about' for more.");
        break;
      case "projects":
        out.push("Enigma, DIVE, etc.  PrismaOS — 'open projects'");
        break;
      case "apps":
        out.push(listApps().join("  "));
        break;
      case "pwd":
        out.push(cwd);
        break;
      case "ls": {
        const showHidden = arg === "-a";
        const target = arg && !showHidden ? normalizePath(cwd, arg) : cwd;
        const items = listDir(target, showHidden);
        if (!items) out.push(`ls: no such directory: ${arg}`);
        else if (items.length === 0) out.push("(empty)");
        else
          out.push(
            items
              .map((n) => (n.type === "dir" ? `${n.name}/` : n.name))
              .join("  "),
          );
        break;
      }
      case "cd": {
        const target = arg ? normalizePath(cwd, arg) : HOME;
        const node = getNode(target);
        if (!node || node.type !== "dir")
          out.push(`cd: no such directory: ${arg}`);
        else setCwd(target);
        break;
      }
      case "cat": {
        if (!arg) {
          out.push("usage: cat <file>");
          break;
        }
        const node = getNode(normalizePath(cwd, arg));
        if (!node) out.push(`cat: no such file: ${arg}`);
        else if (node.type === "dir") out.push(`cat: ${arg}: is a directory`);
        else out.push(node.content);
        break;
      }
      case "open": {
        if (!arg) {
          out.push("usage: open <app|file>");
          break;
        }
        if (launchApp(arg)) {
          out.push(`opening ${arg}…`);
          break;
        }
        const node = getNode(normalizePath(cwd, arg));
        if (node && node.type === "file" && node.app && launchApp(node.app)) {
          out.push(`opening ${node.app}…`);
        } else {
          out.push(`open: no such app or file: ${arg}`);
        }
        break;
      }
      case "wallpaper":
        if (arg && setWallpaper(arg)) out.push(`wallpaper → ${arg}`);
        else out.push(`usage: wallpaper <${WALLPAPERS.join(" | ")}>`);
        break;
      case "theme":
        if (arg && setTheme(arg)) out.push(`theme → ${arg}`);
        else out.push(`usage: theme <${THEMES.join(" | ")}>`);
        break;
      case "fastfetch":
        out.push(FASTFETCH);
        break;
      case "clear":
        setLines([]);
        return;
      case "sudo":
        out.push("prism: you already have every permission.");
        break;
      case "secret":
        out.push(
          "[hidden] there are hidden themes — try 'theme midnight' or 'theme aurora'.",
        );
        break;
      default:
        out.push(`command not found: ${cmd}  (see 'help')`);
    }
    setLines((prev) => [
      ...prev,
      { kind: "in", text: raw.trim(), cwd },
      ...out.map((t) => ({ kind: "out" as const, text: t })),
    ]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const value = input;
      run(value);
      if (value.trim()) histRef.current.push(value);
      histIdx.current = -1;
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = histRef.current;
      if (h.length === 0) return;
      histIdx.current =
        histIdx.current === -1
          ? h.length - 1
          : Math.max(0, histIdx.current - 1);
      setInput(h[histIdx.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = histRef.current;
      if (histIdx.current === -1) return;
      histIdx.current += 1;
      if (histIdx.current >= h.length) {
        histIdx.current = -1;
        setInput("");
      } else setInput(h[histIdx.current]);
    }
  }

  return (
    <div
      className="term"
      ref={termRef}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      {lines.map((l, i) => (
        <pre key={i} className={l.kind === "in" ? "term__in" : "term__out"}>
          {l.kind === "in"
            ? `prism ${shortPath(l.cwd ?? HOME)} $ ${l.text}`
            : l.text}
        </pre>
      ))}
      <div className="term__prompt">
        <span>{`prism ${shortPath(cwd)} $`}</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}

const FASTFETCH = [
  "      /\\        prism@prismaos",
  "     /  \\       ---------------",
  "    / /\\ \\      OS: PrismaOS (web)",
  "   /____\\     Shell: prism-sh",
  "  /_/    \\_\\    Theme: Aqua Liquid",
].join("\n");
