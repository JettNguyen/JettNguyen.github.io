"use client";

import { motion } from "framer-motion";

type MorphInterestTitleProps = {
  section: string;
  slug: string;
  title: string;
  className?: string;
};

export function MorphInterestTitle({ section, slug, title, className }: MorphInterestTitleProps) {
  return (
    <motion.h1 className={className}>
      {title}
    </motion.h1>
  );
}
