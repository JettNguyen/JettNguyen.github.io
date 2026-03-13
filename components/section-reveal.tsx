"use client";

import { motion, useReducedMotion } from "framer-motion";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "section" | "item";
};

const revealPresets = {
  section: {
    initial: { opacity: 0, y: 18, scale: 0.985, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    duration: 0.46
  },
  item: {
    initial: { opacity: 0, y: 14, scale: 0.995 },
    visible: { opacity: 1, y: 0, scale: 1 },
    duration: 0.38
  }
} as const;

export function SectionReveal({ children, className, delay = 0, variant = "section" }: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const preset = revealPresets[variant];

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={preset.initial}
      whileInView={preset.visible}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: preset.duration, delay, ease: [0.2, 0.9, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
