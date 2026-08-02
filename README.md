# PrismaOS

A web desktop portfolio built from scratch in React and TypeScript. The window manager, dock, terminal, and theme system are hand-built rather than using a UI framework.

## Structure

- `src/os.ts` — a tiny syscall module that decouples apps (like the terminal) from the desktop shell (`launchApp` / `listApps` / `setTheme`).
- `src/hooks/useWindows.ts` — window manager state (drag, resize, focus, persist to `localStorage`).
- `src/components/` — desktop chrome: `BootScreen`, `MenuBar`, `Dock`.
- `src/apps/` — app registry and components (`TerminalApp`, `ProjectsApp`, etc.).

## Running

```sh
npm install
npm run dev
```

## Terminal

The built-in `prism-sh` terminal supports basic commands to control the OS:
- `help`, `about`, `projects`, `ls`
- `open <app>` — launches an app window
- `theme <name>` — switches between `aqua`, `graphite`, `midnight`, `aurora`
- `fastfetch`, `clear`
