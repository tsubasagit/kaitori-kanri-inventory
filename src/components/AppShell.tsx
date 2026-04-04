"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, Header } from "@/components/layout";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";
import { Spinner } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname.startsWith("/login");

  useEffect(() => {
    if (loading) return;
    if (!user && !isAuthPage && pathname !== "/") {
      router.push(ROUTES.login);
    }
    if (user && isAuthPage) {
      router.push(ROUTES.dashboard);
    }
  }, [user, loading, isAuthPage, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthPage) {
    if (user) return null;
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        {children}
      </div>
    );
  }

  if (pathname === "/") {
    return <>{children}</>;
  }

  if (!user) return null;

  const handleLogout = async () => {
    sessionStorage.removeItem("guest");
    await signOut();
    router.push(ROUTES.login);
  };

  const displayUser = {
    displayName: profile?.displayName ?? user.displayName ?? "スタッフ",
  };

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="transition-[margin] duration-200 ease-in-out lg:ml-64">
        <Header
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          onLogout={handleLogout}
          user={displayUser}
        />
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
