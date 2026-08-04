import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  initPerfMode,
  restoreTheme,
  resotreAccent,
  restoreWallpaper,
} from "./os.ts";
import "./styles/aqua.css";

initPerfMode();
restoreTheme();
restoreWallpaper();
resotreAccent();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
