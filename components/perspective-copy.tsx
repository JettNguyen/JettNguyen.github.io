"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Perspective } from "@/lib/types";
import { usePerspective } from "@/components/perspective-provider";

type PerspectiveCopyProps = {
  recruiter: string;
  engineer: string;
  nonTechnical: string;
  className?: string;
  as?: "p" | "span" | "div";
};

function pickCopy(
  perspective: Perspective,
  recruiter: string,
  engineer: string,
  nonTechnical: string
) {
  if (perspective === "engineer") {
    return engineer;
  }

  if (perspective === "nonTechnical") {
    return nonTechnical;
  }

  return recruiter;
}

export function PerspectiveCopy({
  recruiter,
  engineer,
  nonTechnical,
  className,
  as = "p"
}: PerspectiveCopyProps) {
  const { perspective } = usePerspective();
  const prefersReducedMotion = useReducedMotion();
  const content = pickCopy(perspective, recruiter, engineer, nonTechnical);

  if (prefersReducedMotion) {
    if (as === "span") return <span className={className}>{content}</span>;
    if (as === "div") return <div className={className}>{content}</div>;
    return <p className={className}>{content}</p>;
  }

  const MotionTag = as === "span" ? motion.span : as === "div" ? motion.div : motion.p;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionTag
        key={`${perspective}-${content}`}
        className={className}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {content}
      </MotionTag>
    </AnimatePresence>
  );
}
