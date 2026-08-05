import type { AppDef } from "../types";
import {
  AboutIcon,
  FilesIcon,
  MusicIcon,
  ProjectsIcon,
  TerminalIcon,
} from "../components/icons";
import { AboutApp } from "./AboutApp";
import { AboutOSApp } from "./AboutOSApp";
import { MusicApp } from "./MusicApp";
import { ProjectsApp } from "./ProjectsApp";
import { TerminalApp } from "./TerminalApp";
import { FilesApp } from "./FilesApp";
import { SettingsIcon } from "../components/icons";
import { SettingsApp } from "./SettingsApp";

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
    render: () => <ProjectsApp />,
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: <TerminalIcon />,
    initial: { x: 210, y: 230, width: 580, height: 360 },
    render: () => <TerminalApp />,
  },
  {
    id: "music",
    title: "Music",
    icon: <MusicIcon />,
    initial: { x: 340, y: 120, width: 320, height: 460 },
    render: () => <MusicApp />,
  },
  {
    id: "files",
    title: "Files",
    icon: <FilesIcon />,
    initial: { x: 170, y: 118, width: 620, height: 420 },
    render: () => <FilesApp />,
  },
  {
    id: "settings",
    title: "Settings",
    icon: <SettingsIcon />,
    initial: { x: 240, y: 140, width: 430, height: 470 },
    render: () => <SettingsApp />,
  },
  {
    id: "about-os",
    title: "About PrismaOS",
    icon: <AboutIcon />,
    hidden: true,
    initial: { x: 250, y: 120, width: 320, height: 420 },
    render: () => <AboutOSApp />,
  },
];
