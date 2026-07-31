"use client";

import { motion } from "framer-motion";

type MorphPageTitleProps = {
  title: string;
  className?: string;
  scrambleText?: string;
};

export function MorphPageTitle({ title, className, scrambleText }: MorphPageTitleProps) {
  return (
    <motion.h1 className={className} data-scramble={scrambleText ?? title}>
      {title}
    </motion.h1>
  );
}
