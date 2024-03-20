import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen grid place-items-center">
        <div className="absolute grid w-full justify-end p-4 place-self-start">
          <ModeToggle />
        </div>
        <App />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
