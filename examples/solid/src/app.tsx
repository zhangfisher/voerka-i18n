import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { VoerkaI18nSolidProvider } from "./languages"

export default function App() {
  return (
    
      <Router
        root={props => (
          <VoerkaI18nSolidProvider>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </VoerkaI18nSolidProvider>
        )}
      >
        <FileRoutes />
      </Router>
  );
}
