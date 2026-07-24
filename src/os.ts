import type { AppDef } from "./types";

let registry: AppDef[] = [];
let launcher: (id: string) => boolean = () => false;

export function bindOS(apps: AppDef[], launch: (id: string) => boolean) {
  registry = apps;
  launcher = launch;
}

export function listApps(): string[] {
  return registry.map((a) => a.id);
}

export function launchApp(id: string): boolean {
  return launcher(id);
}

export const THEMES = ["aqua", "graphite", "midnight", "aurora"];

export function setTheme(name: string): boolean {
  if (!THEMES.includes(name)) return false;
  document.documentElement.dataset.theme = name;
  localStorage.setItem("prisma-theme", name);
  return true;
}

export function restoreTheme() {
  const saved = localStorage.getItem("prisma-theme");
  if (saved && THEMES.includes(saved))
    document.documentElement.dataset.theme = saved;
}

export function initPerfMode() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weakCpu = (nav.hardwareConcurrency || 8) <= 4;
  const lowMem = (nav.deviceMemory ?? 8) <= 4;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (weakCpu || lowMem || reducedMotion)
    document.documentElement.dataset.perf = "lite";
}
