import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ShopifyProvider } from "./components/providers/ShopifyProvider";

createRoot(document.getElementById("root")!).render(
  <ShopifyProvider>
    <App />
  </ShopifyProvider>
);
