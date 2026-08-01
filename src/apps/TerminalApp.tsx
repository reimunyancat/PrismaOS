import { useEffect, useRef, useState } from "react";
import { launchApp, listApps, setTheme, THEMES } from "../os";
import "./Terminal.css";

interface Line {
  kind: "in" | "out";
  text: string;
}

const BANNER = "PrismaOS Terminal";

export function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: BANNER }]);
  const [input, setInput] = useState("");
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
          "help, about, projects, ls, open <app>, theme <name>, fastfetch, clear",
        );
        break;
      case "about":
        out.push("reimunyancat - student");
        break;
      case "projects":
        out.push(
          "Ephemeris, DIVE, AudiLex, Artifact, Enigma, WaitForSale, PrismaOS, etc.",
        );
        break;
      case "ls":
        out.push(listApps().join("  "));
        break;
      case "open":
        if (!arg) out.push("usage: open <app>");
        else if (launchApp(arg)) out.push(`opening ${arg}...`);
        else out.push(`open: no such app: ${arg}`);
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
        out.push("prism: You already have full authority.");
        break;
      case "secret":
        out.push(
          "[hidden] There are hidden themes — try entering 'theme midnight' or 'theme aurora'",
        );
        break;
      default:
        out.push(`command not found: ${cmd}  (Refer to 'help')`);
    }
    setLines((prev) => [
      ...prev,
      { kind: "in", text: raw.trim() },
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
          {l.kind === "in" ? `prism $ ${l.text}` : l.text}
        </pre>
      ))}
      <div className="term__prompt">
        <span>prism $</span>
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
