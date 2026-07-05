
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);

  // Register service worker for Web Push notifications
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Unregister old/cached service workers to force fresh load
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          console.log('[SW] Unregistering old service worker');
          reg.unregister();
        });

        // Register with cache-busting version parameter
        navigator.serviceWorker
          .register('/sw-notifications.js?v=2')
          .then((registration) => {
            console.log('[SW] Service Worker registered:', registration.scope);
          })
          .catch((err) => {
            console.error('[SW] Service Worker registration failed:', err);
          });
      });
    });
  }
