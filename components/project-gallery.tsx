"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SectionReveal } from "@/components/section-reveal";
import { Experiment } from "@/lib/types";

type Props = {
  items: Experiment[];
};

export function ProjectGallery({ items }: Props) {
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((project, index) => (
        <SectionReveal key={project.slug} variant="item" delay={(index % 6) * 0.04}>
          <article
            className="card cursor-pointer transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.005] hover:border-accent/70 hover:shadow-accent-sm motion-safe:active:scale-[0.995]"
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/projects/${project.slug}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/projects/${project.slug}`);
              }
            }}
          >
          <div className="mb-3 flex items-start gap-3">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel/60 p-1 shadow-sm ${project.demoUrl ? "transition hover:border-accent/60" : ""}`}>
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  className="group h-full w-full"
                  aria-label={`Open ${project.title} demo`}
                >
                  <Image
                    src={project.logoUrl}
                    alt={`${project.title} logo`}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-xl object-contain transition-all duration-300 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.28)]"
                  />
                </a>
              ) : (
                <Image
                  src={project.logoUrl}
                  alt={`${project.title} logo`}
                  width={96}
                  height={96}
                  className="h-full w-full rounded-xl object-contain"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-text">
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="transition hover:text-accent-soft"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
                </h2>
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="rounded-full border border-accent/60 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft transition hover:border-accent hover:bg-accent/15"
                  >
                    Demo
                  </a>
                ) : null}
              </div>
              <span className="mt-1 ml-[-5px] inline-flex rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">{project.dateLabel}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted">{project.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.categories.map((category) => (
              <span key={`${project.slug}-${category}`} className="rounded-full border border-accent/45 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                {category}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="rounded-full border border-line px-2 py-1 text-xs text-[#c6c7d2]">
                {tech}
              </span>
            ))}
          </div>
          <span className="mt-5 inline-flex text-sm text-accent-soft">Read case study</span>
          </article>
        </SectionReveal>
      ))}
    </div>
  );
}
