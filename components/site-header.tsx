"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/coursework", label: "Coursework" },
  { href: "/reports", label: "Reports" },
  { href: "/presentations", label: "Presentations" },
  { href: "/resume", label: "Resume" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-ink/85 backdrop-blur">
      <div className="container-shell py-2">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-semibold tracking-tight text-text transition hover:text-accent-soft">
            Jett Nguyen
          </Link>
        </div>
        <nav aria-label="Main navigation" className="mt-2 overflow-x-auto pb-1">
          <ul className="flex min-w-max items-center gap-3 sm:gap-4 md:gap-5">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "text-[11px] transition sm:text-xs md:text-sm",
                      active ? "text-text" : "text-muted hover:text-accent-soft"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
