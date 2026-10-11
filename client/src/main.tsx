import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Optional analytics loads only when a complete endpoint and site ID are configured.
const endpoint=import.meta.env.VITE_ANALYTICS_ENDPOINT;
const websiteId=import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
if(endpoint && websiteId && /^https?:\/\//.test(endpoint)) {
  const script=document.createElement("script");
  script.defer=true;script.src=endpoint.replace(/\/$/, "")+"/umami";script.dataset.websiteId=websiteId;document.head.appendChild(script);
}
