"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SectionItem = {
  id: string;
  label: string;
};

const routePrefixes = new Set([
  "home",
  "projects",
  "project",
  "coursework",
  "reports",
  "presentations",
  "presentation",
  "resume"
]);

function toLabel(id: string) {
  const rawParts = id.split(/[-_]/).filter(Boolean);
  const parts = [...rawParts];

  while (parts.length && (routePrefixes.has(parts[0].toLowerCase()) || parts[0].toLowerCase() === "detail")) {
    parts.shift();
  }

  if (!parts.length) {
    return rawParts.some((part) => part.toLowerCase() === "detail") ? "Detail" : "Overview";
  }

  return parts
    .map((part) => {
      if (part.toLowerCase() === "repos") return "Repositories";
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

export function SectionIndicator() {
  const pathname = usePathname();
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string>("");

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const nav = document.querySelector("[data-nav]");
    const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : 72;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - navHeight - 8);

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) {
      setSections([]);
      return;
    }

    const discovered = Array.from(main.querySelectorAll<HTMLElement>("section[id], article[id]"))
      .map((node) => {
        const id = node.getAttribute("id")?.trim() ?? "";
        const manualLabel = node.getAttribute("data-section-label")?.trim() ?? "";
        if (!id) return null;
        return {
          id,
          label: manualLabel || toLabel(id)
        };
      })
      .filter((item): item is SectionItem => Boolean(item));

    setSections(discovered.slice(0, 8));
  }, [pathname]);

  useEffect(() => {
    if (sections.length === 0) {
      setActiveSectionId("");
      return;
    }

    const nav = document.querySelector("[data-nav]");
    const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : 72;

    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("id") ?? "";
          if (id) {
            setActiveSectionId(id);
          }
        }
      },
      {
        root: null,
        rootMargin: `-${navHeight + 8}px 0px -45% 0px`,
        threshold: [0.2, 0.35, 0.5, 0.7]
      }
    );

    sectionElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  if (sections.length < 2) {
    return null;
  }

  return (
    <aside className="section-indicator" aria-label="Section progress indicator">
      {sections.map((section) => (
        <a
          key={section.id}
          data-section-dot
          data-active={activeSectionId === section.id ? "true" : "false"}
          data-section-label={section.label}
          href={`#${section.id}`}
          aria-label={section.label}
          aria-current={activeSectionId === section.id ? "location" : undefined}
          title={section.label}
          onClick={(event) => {
            event.preventDefault();
            scrollToSection(section.id);
          }}
        >
          <span data-section-dot-core />
        </a>
      ))}
    </aside>
  );
}
