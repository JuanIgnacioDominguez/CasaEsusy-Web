"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

/** El sitio público siempre en claro; el panel respeta la preferencia (claro / oscuro / sistema). */
export function Proveedores({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const esPanel = pathname.startsWith("/admin");
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={esPanel ? undefined : "light"}
      storageKey="ce-tema-panel"
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30 }}>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster position={esPanel ? "bottom-right" : "top-center"} richColors closeButton />
          </TooltipProvider>
        </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
