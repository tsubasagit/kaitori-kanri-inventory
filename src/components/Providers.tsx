"use client";

import { ReactNode, Suspense } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ToastProvider } from "@/components/ui";
import { AppShell } from "@/components/AppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <AuthProvider>
        <ToastProvider>
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </AuthProvider>
    </Suspense>
  );
}
