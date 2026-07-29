import type { AppDef } from "../types";
import {
  AboutIcon,
  MusicIcon,
  ProjectsIcon,
  TerminalIcon,
} from "../components/icons";
import { AboutApp } from "./AboutApp";
import { ProjectApp } from "./ProjectsApp";

export const APPS: AppDef[] = [
  {
    id: "about",
    title: "About Me",
    icon: <AboutIcon />,
    initial: { x: 110, y: 84, width: 420, height: 330 },
    render: () => <AboutApp />,
  },
  {
    id: "projects",
    title: "Projects",
    icon: <ProjectsIcon />,
    initial: { x: 280, y: 150, width: 560, height: 400 },
    render: () => <ProjectApp />,
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <TerminalIcon />,
    initial: { x: 210, y: 230, width: 580, height: 360 },
    render: () => <p>next</p>,
  },
  {
    id: "music",
    title: "Music",
    icon: <MusicIcon />,
    initial: { x: 340, y: 120, width: 300, height: 380 },
    render: () => <p>next</p>,
  },
];
