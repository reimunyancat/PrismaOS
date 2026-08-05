export interface FsFile {
  type: "file";
  name: string;
  content: string;
  app?: string;
}
export interface FsDir {
  type: "dir";
  name: string;
  children: FsNode[];
}
export type FsNode = FsFile | FsDir;

const f = (name: string, content: string, app?: string): FsFile => ({
  type: "file",
  name,
  content,
  app,
});
const d = (name: string, children: FsNode[]): FsDir => ({
  type: "dir",
  name,
  children,
});

export const HOME = "/Users/reimunyancat";
export const ROOT: FsDir = d("", [
  d("Applications", [
    f("About Me.app", "Application bundle - About Me", "about"),
    f("Projects.app", "Application bundle - Projects", "projects"),
    f("Terminal.app", "Application bundle - Terminal", "terminal"),
    f("Music.app", "Application bundle - Music", "music"),
    f("Files.app", "Application bundle - Files", "files"),
    f("Settings.app", "Application bundle - Settings", "settings"),
  ]),
  d("System", [
    f(
      "version",
      [
        "PrismaOS 0.3.0",
        "Engine : React 18 + TypeScript",
        "Shell  : Aqua Liquid Glass",
      ].join("\n"),
    ),
    f("themes", ["aqua", "graphite", "midnight", "aurora"].join("\n")),
    f("wallpapers", ["liquid", "mesh", "grid", "solid"].join("\n")),
    f(
      "shortcuts",
      [
        "ctrl + k  Spotlight",
        "ctrl + w  Close front window",
        "ctrl + m  Minimize front window",
        "ctrl + ,  Settings",
        "ctrl + `  Cycle windows",
      ].join("\n"),
    ),
  ]),
  d("Users", [
    d("reimunyancat", [
      f(
        "about.md",
        ["# reimunyancat", "", "Designer, Developer"].join("\n"),
        "about",
      ),
      f(
        "contact.md",
        ["GitHub : github.com/reimunyancat", "Site  : reimunyancat.com"].join(
          "\n",
        ),
      ),
      d("Projects", [
        f(
          "ephemeris.md",
          "Real-time N-body solar system simulator. Velocity Verlet + Barnes-Hut, Three.js + Tauri 2.",
          "projects",
        ),
        f(
          "enigma.md",
          "In-browser Enigma machine One C++ engine shared by CLI and WASM.",
          "projects",
        ),
        f(
          "prismaos.md",
          "The web desktop you are looking at. Window manager, Dock, terminal, VFS.",
          "projects",
        ),
      ]),
      d("Notes", [
        f(
          "changelog.md",
          [
            "0.3.0  Settings,  Spotlight,  Files(VFS),  window snapping",
            "0.2.0  Terminal,  Music,  liquid glass shell",
            "0.1.0  Boot screen,  window manager",
          ].join("\n"),
        ),
      ]),
      f(
        ".secret",
        "A line only visible to people who know ls -a. Try 'secret' in the terminal too.",
      ),
    ]),
  ]),
]);

export function normalizePath(cwd: string, input: string): string {
  let raw = input;
  if (raw == "~" || raw.startsWith("~/")) raw = HOME + raw.slice(1);
  const segs = raw.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  for (const seg of raw.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") segs.pop();
    else segs.push(seg);
  }
  return "/" + segs.join("/");
}
export function getNode(path: string): FsNode | null {
  let node: FsNode = ROOT;
  for (const seg of path.split("/").filter(Boolean)) {
    if (node.type !== "dir") return null;
    const next: FsNode | undefined = node.children.find((c) => c.name === seg);
    if (!next) return null;
    node = next;
  }
  return node;
}
export function listDir(path: string, showHidden = false): FsNode[] | null {
  const node = getNode(path);
  if (!node || node.type !== "dir") return null;
  return node.children
    .filter((c) => showHidden || !c.name.startsWith("."))
    .slice()
    .sort((a, b) =>
      a.type === b.type
        ? a.name.localeCompare(b.name)
        : a.type === "dir"
          ? -1
          : 1,
    );
}
export function shortPath(path: string): string {
  if (path === HOME) return "~";
  if (path.startsWith(HOME + "/")) return "~" + path.slice(HOME.length);
  return path || "/";
}
export function parentPath(path: string): string {
  const segs = path.split("/").filter(Boolean);
  segs.pop();
  return "/" + segs.join("/");
}
