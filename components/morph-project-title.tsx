"use client";

import { motion } from "framer-motion";

type MorphProjectTitleProps = {
  slug: string;
  title: string;
  className?: string;
};

export function MorphProjectTitle({ slug, title, className }: MorphProjectTitleProps) {
  return (
    <motion.h1 className={className}>
      {title}
    </motion.h1>
  );
}
