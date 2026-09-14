// components/Providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      {children}
      <Toaster
        position="bottom-center"
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(15,15,26,0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#f1f0fa",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </ThemeProvider>
  );
}
