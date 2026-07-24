import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initPerfMode, restoreTheme } from "./os.ts";
import "./styles/aqua.css";

initPerfMode();
restoreTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
