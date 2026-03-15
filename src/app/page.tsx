"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.dashboard);
  }, [router]);

  return null;
}
