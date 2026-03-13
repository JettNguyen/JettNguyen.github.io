import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProject, projects } from "@/data/projects";
import { SectionReveal } from "@/components/section-reveal";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getProject(params.slug);

  if (!item) {
    return { title: "Not Found" };
  }

  return {
    title: item.title,
    description: item.summary
  };
}

export default function ProjectDetailPage({ params }: Props) {
  const item = getProject(params.slug);

  if (!item) {
    notFound();
  }

  return (
    <article id="project-detail-summary" className="py-16 sm:py-20">
      <div className="container-shell max-w-4xl">
        <SectionReveal>
        <header className="card">
          <div className="mb-4 flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel/60 p-1.5 shadow-sm">
              <Image
                src={item.logoUrl}
                alt={`${item.title} logo`}
                width={112}
                height={112}
                className="h-full w-full rounded-xl object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="mt-2 text-2xl font-semibold text-text sm:text-3xl">{item.title}</h1>
              <span className="ml-[-5px] inline-flex rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">{item.dateLabel}</span>
              <div id="project-detail-links" className="mt-3 flex flex-wrap gap-2">
                {item.githubUrl ? (
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent-soft"
                  >
                    Repo
                  </a>
                ) : null}
                {item.demoUrl ? (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-line px-3 py-1.5 text-sm hover:border-accent hover:text-accent-soft"
                  >
                    Site
                  </a>
                ) : null}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.categories.map((category) => (
              <span key={`${item.slug}-${category}`} className="rounded-full border border-accent/45 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                {category}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.techStack.map((tech) => (
              <span key={tech} className="rounded-full border border-line px-2 py-1 text-xs text-[#c6c7d2]">
                {tech}
              </span>
            ))}
          </div>
        </header>
        </SectionReveal>

        <section id="project-detail-flow" className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail step={1} title="Problem" text={item.problem} label="Context" />
          <Detail step={2} title="Observation" text={item.observation} label="Research" />
          <Detail step={3} title="Hypothesis" text={item.hypothesis} label="Assumption" />
          <Detail step={4} title="Experiment" text={item.experiment} label="Execution" />
          <Detail step={5} title="Outcome" text={item.outcome} label="Results" />
          <Detail step={6} title="Reflection" text={item.reflection} label="Takeaways" isWide />
        </section>

      </div>
    </article>
  );
}

function Detail({ step, title, text, label, isWide = false }: { step: number; title: string; text: string; label: string; isWide?: boolean }) {
  return (
    <SectionReveal variant="item">
    <section className={`card relative overflow-hidden border-line/80 bg-panel/80 ${isWide ? "sm:col-span-2" : ""}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/50 via-accent-soft/50 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-accent/60 bg-accent/10 px-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-soft">
            {step}
          </span>
          <h2 className="text-base font-semibold text-text sm:text-lg">{title}</h2>
        </div>
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
      </div>
      <p className="mt-3 border-t border-line/70 pt-3 text-sm leading-7 text-muted">{text}</p>
    </section>
    </SectionReveal>
  );
}
