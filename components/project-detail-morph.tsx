"use client";

import { motion } from "framer-motion";

type ProjectDetailMorphProps = {
  slug: string;
  className?: string;
  children: React.ReactNode;
};

export function ProjectDetailMorph({ slug, className, children }: ProjectDetailMorphProps) {
  return (
    <motion.header
      data-transition-source={`project-card-${slug}`}
      className={className}
      initial={{ borderColor: "rgba(255,255,255,0.1)" }}
      animate={{ borderColor: "rgba(239,68,68,0.35)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.header>
  );
}
