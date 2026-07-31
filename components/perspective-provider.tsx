"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Perspective } from "@/lib/types";

const STORAGE_KEY = "portfolio-perspective";

type PerspectiveContextValue = {
  perspective: Perspective;
  setPerspective: (value: Perspective) => void;
};

const PerspectiveContext = createContext<PerspectiveContextValue | null>(null);

export function PerspectiveProvider({ children }: { children: React.ReactNode }) {
  const [perspective, setPerspectiveState] = useState<Perspective>("recruiter");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "recruiter" || stored === "engineer" || stored === "nonTechnical") {
      setPerspectiveState(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, perspective);
  }, [perspective]);

  const value = useMemo(
    () => ({
      perspective,
      setPerspective: (nextPerspective: Perspective) => {
        setPerspectiveState(nextPerspective);
      }
    }),
    [perspective]
  );

  return <PerspectiveContext.Provider value={value}>{children}</PerspectiveContext.Provider>;
}

export function usePerspective() {
  const context = useContext(PerspectiveContext);

  if (!context) {
    throw new Error("usePerspective must be used within PerspectiveProvider");
  }

  return context;
}
