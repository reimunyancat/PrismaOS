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

export function getTheme(): string {
  return document.documentElement.dataset.theme || "aqua";
}

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

export function isLiteMode(): boolean {
  return document.documentElement.dataset.perf === "lite";
}

export function setLiteMode(on: boolean) {
  if (on) document.documentElement.dataset.perf = "lite";
  else delete document.documentElement.dataset.perf;
  localStorage.setItem("prisma-perf", on ? "lite" : "full");
}

export function initPerfMode() {
  const pref = localStorage.getItem("prisma-perf");
  if (pref === "lite") {
    document.documentElement.dataset.perf = "lite";
    return;
  }
  if (pref === "full") return;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weakCpu = (nav.hardwareConcurrency || 8) <= 4;
  const lowMem = (nav.deviceMemory ?? 8) <= 4;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (weakCpu || lowMem || reducedMotion)
    document.documentElement.dataset.perf = "lite";
}

export function resetLayout() {
  localStorage.removeItem("prisma-layout");
  localStorage.removeItem("prisma-layout-v2");
}

export const WALLPAPERS = ["liquid", "mesh", "grid", "solid"];

export function getWallpaper(): string {
  return document.documentElement.dataset.wallpaper || "liquid";
}

export function setWallpaper(name: string): boolean {
  if (!WALLPAPERS.includes(name)) return false;
  document.documentElement.dataset.wallpaper = name;
  localStorage.setItem("prisma-wallpaper", name);
  return true;
}

export function restoreWallpaper() {
  const saved = localStorage.getItem("prisma-wallpaper");
  document.documentElement.dataset.wallpaper =
    saved && WALLPAPERS.includes(saved) ? saved : "liquid";
}

export const ACCENTS = ["#6366f1", "#2dd4bf", "#f472b6", "#f59e0b", "#64748b"];

export function getAccent(): string {
  return localStorage.getItem("prisma-accent") || "";
}

export function setAccent(hex: string) {
  if (hex) {
    document.documentElement.style.setProperty("--accent", hex);
    localStorage.setItem("prisma-accent", hex);
  } else {
    document.documentElement.style.removeProperty("--accent");
    localStorage.removeItem("prisma-accent");
  }
}

export function resotreAccent() {
  const saved = localStorage.getItem("prisma-accent");
  if (saved) document.documentElement.style.setProperty("--accent", saved);
}
