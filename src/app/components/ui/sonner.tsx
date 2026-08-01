"use client";

import { useEffect, useState } from "react";
import { Toaster as Sonner, ToasterProps, toast } from "sonner";

export { toast };

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<ToasterProps["theme"]>("light");

  useEffect(() => {
    const updateTheme = () => {
      const htmlTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
      setTheme(htmlTheme);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme}
      position="top-right"
      expand={false}
      visibleToasts={5}
      toastOptions={{
        duration: 4000,
        className: "group pointer-events-auto relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
      }}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
