import type { ReactNode } from "react";

export interface AppDef {
  id: string;
  title: string;
  icon: ReactNode;
  initial?: { x: number; y: number; width: number; height: number };
  render: () => ReactNode;
}

export interface WindowInstance {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
}
