"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <a
        href="#home-previews"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:flex"
        aria-label="Scroll to section previews"
      >
        Scroll
        <span aria-hidden="true">↓</span>
      </a>
    );
  }

  return (
    <motion.a
      href="#home-previews"
      className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted sm:flex"
      initial={{ opacity: 0.6, y: 0 }}
      animate={{ opacity: 1, y: [0, 6, 0] }}
      transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
      aria-label="Scroll to section previews"
    >
      Scroll
      <span aria-hidden="true">↓</span>
    </motion.a>
  );
}
