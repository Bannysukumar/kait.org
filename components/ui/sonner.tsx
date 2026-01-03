"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useEffect, useState } from "react";

const Toaster = (props: ToasterProps) => {
  const { theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState<ToasterProps["theme"]>("system");

  useEffect(() => {
    if (currentTheme === "system") {
      setTheme("system");
    } else {
      setTheme(currentTheme === "dark" ? "dark" : "light");
    }
  }, [currentTheme]);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
