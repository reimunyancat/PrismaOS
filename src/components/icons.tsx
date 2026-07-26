import type { SVGProps } from "react";

interface IconProps {
  size?: number;
}

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

export function AboutIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 19.5c0-3.7 3.1-5.8 7-5.8s7 2.1 7 5.8" />
    </svg>
  );
}

export function ProjectsIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <path d="M12 3 L20.5 7.5 L12 12 L3.5 7.5 Z" />
      <path d="M3.5 12 L12 16.5 L20.5 12" />
      <path d="M3.5 16.5 L12 21 L20.5 16.5" />
    </svg>
  );
}

export function TerminalIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <rect x="3" y="4.5" width="18" height="15" rx="2.4" />
      <path d="M7 10 L10 12.5 L7 15" />
      <path d="M12.5 15 L17 15" />
    </svg>
  );
}

export function MusicIcon({ size = 24 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden="true">
      <path d="M9 18V6l10-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  );
}
