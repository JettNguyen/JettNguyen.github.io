"use client";

import Link from "next/link";
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { navigateWithTransition } from "@/lib/page-transition";

type TransitionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  sourceSelector?: string;
  useCurrentTargetAsSource?: boolean;
  sharedKey?: string;
  preferBack?: boolean;
  onBeforeNavigate?: () => void;
  enableTransition?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children" | "onClick">;

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function TransitionLink({
  href,
  className,
  children,
  sourceSelector,
  useCurrentTargetAsSource = false,
  sharedKey,
  preferBack = false,
  onBeforeNavigate,
  enableTransition = false,
  onClick,
  ...restProps
}: TransitionLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={className}
      {...restProps}
      onClick={(event) => {
        onClick?.(event);

        if (!enableTransition) {
          return;
        }

        if (event.defaultPrevented || !isPlainLeftClick(event)) {
          return;
        }

        event.preventDefault();

        const sourceElement = useCurrentTargetAsSource
          ? event.currentTarget
          : sourceSelector
            ? document.querySelector<HTMLElement>(sourceSelector)
            : null;

        navigateWithTransition({
          href,
          router,
          sourceElement,
          sharedKey,
          preferBack,
          beforeNavigate: onBeforeNavigate
        });
      }}
    >
      {children}
    </Link>
  );
}
