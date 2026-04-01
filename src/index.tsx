import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Landing } from "./screens/Landing";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
);
