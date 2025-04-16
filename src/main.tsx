import { RootProviders } from "@/components/app/context/rootProviders.tsx";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <RootProviders>
    <App />
  </RootProviders>
);
