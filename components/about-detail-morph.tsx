"use client";

import { motion } from "framer-motion";

type AboutDetailMorphProps = {
  section: string;
  slug: string;
  className?: string;
  children: React.ReactNode;
};

export function AboutDetailMorph({ section, slug, className, children }: AboutDetailMorphProps) {
  return (
    <motion.header
      data-transition-source={`about-card-${section}-${slug}`}
      className={className}
      initial={{ borderColor: "rgba(255,255,255,0.1)" }}
      animate={{ borderColor: "rgba(239,68,68,0.35)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.header>
  );
}
