"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

type HeroTitleProps = {
  text: string;
  className?: string;
};

export function HeroTitle({ text, className }: HeroTitleProps) {
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const chars = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const titleElement = titleRef.current;
    if (!titleElement) {
      return;
    }

    const nodes = charRefs.current.filter((node): node is HTMLSpanElement => Boolean(node));
    if (nodes.length === 0) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        nodes,
        { yPercent: 120, opacity: 0, rotateX: -70 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.035,
          ease: "expo.out"
        }
      );
    }, titleElement);

    return () => {
      context.revert();
    };
  }, []);

  return (
    <h1 ref={titleRef} aria-label={text} className={className}>
      {chars.map((char, index) => (
        <span
          key={`${char}-${index}`}
          ref={(node) => {
            charRefs.current[index] = node;
          }}
          className="inline-block will-change-transform"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}
