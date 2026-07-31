"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { setupRouteAnimations } from "@/lib/animations";

export function RouteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      return;
    }

    window.dispatchEvent(new CustomEvent("portfolio:route-change", { detail: { pathname } }));
    return setupRouteAnimations(pathname);
  }, [pathname]);

  return null;
}
