import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { resumeData } from "@/data/resume";
import { SocialLinks } from "@/components/social-links";
import { SectionReveal } from "@/components/section-reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume timeline, skills, and downloadable PDF."
};

const featuredProjectSlugs = new Set(["nightlink", "splitsy", "nexel", "frequify"]);

export default function ResumePage() {
  const projectsForResume = [
    ...projects.filter((project) => featuredProjectSlugs.has(project.slug)),
    ...projects.filter((project) => !featuredProjectSlugs.has(project.slug))
  ];

  return (
    <section id="resume-overview" className="py-16 sm:py-20">
      <div className="container-shell rounded-2xl border border-line/60 bg-black/10 p-4 sm:p-6">
        <SectionReveal>
        <header className="card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-muted">{resumeData.hero.role}</p>
              <h1 className="mt-2 text-3xl font-semibold text-text sm:text-4xl">{resumeData.hero.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(resumeData.hero.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-soft"
                >
                  {resumeData.hero.location}
                </a>
                <span aria-hidden="true">·</span>
                <a href={`mailto:${resumeData.hero.email}`} className="hover:text-accent-soft">
                  {resumeData.hero.email}
                </a>
              </p>
              <a href={resumeData.pdf} download className="mt-5 inline-flex rounded-md border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent-soft">
                Download Resume PDF
              </a>
            </div>

            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-line/60 bg-transparent sm:ml-4 sm:h-28 sm:w-28">
              <Image src="/assets/jett.png" alt="Jett Nguyen" fill sizes="112px" className="object-cover" priority />
            </div>
          </div>
        </header>
        </SectionReveal>

        <div id="resume-grid" className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <SectionReveal variant="item">
          <section className="card lg:h-full">
            <h2 className="text-lg font-semibold text-text">Experience</h2>
            <div className="mt-4 space-y-4">
              {resumeData.experience.map((item, index) => (
                <SectionReveal key={`${item.company}-${item.role}`} variant="item" delay={index * 0.035}>
                <article className="rounded-lg border border-line/70 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-text">{item.role}</h3>
                    <span className="rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                      {item.date}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.company}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted">
                    {item.highlights.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </article>
                </SectionReveal>
              ))}
            </div>
          </section>
          </SectionReveal>

          <div className="space-y-4 lg:grid lg:h-full lg:grid-rows-2 lg:gap-4 lg:space-y-0">
            <SectionReveal variant="item" delay={0.04}>
            <section className="card lg:h-full">
              <h2 className="text-lg font-semibold text-text">Education</h2>
              <article className="mt-4 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-text">{resumeData.education.institution}</h3>
                  <span className="rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                    {resumeData.education.date}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{resumeData.education.degree}</p>
                <Link
                  href="/coursework"
                  className="mt-4 inline-flex rounded-md border border-line px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-accent-soft"
                >
                  Relevant Coursework
                </Link>
              </article>
            </section>
            </SectionReveal>

            <SectionReveal variant="item" delay={0.08}>
            <section className="card lg:h-full">
              <h2 className="text-lg font-semibold text-text">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-line/80 bg-black/20 px-3 py-1 text-sm text-muted">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
            </SectionReveal>
          </div>
        </div>

        <SectionReveal variant="item">
        <section id="resume-projects" className="mt-6 card">
          <h2 className="text-lg font-semibold text-text">Projects</h2>
          <p className="mt-2 text-sm text-muted">Selected portfolio projects with featured work highlighted.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {projectsForResume.map((project, index) => {
              const isFeatured = featuredProjectSlugs.has(project.slug);

              return (
                <SectionReveal key={project.slug} variant="item" delay={(index % 8) * 0.03}>
                <article
                  className={`rounded-lg border bg-black/20 p-3 ${isFeatured ? "border-accent/60" : "border-line/70"}`}
                >
                  <div className="grid grid-cols-[2.5rem_1fr] grid-rows-[auto_auto] gap-x-3 gap-y-1">
                    <div className="relative row-span-2 overflow-hidden rounded-md border border-line/70 bg-black/30">
                      <div
                        aria-hidden="true"
                        className="absolute inset-[-30%] bg-[radial-gradient(circle,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_45%,transparent_75%)]"
                      />
                      <Image
                        src={project.logoUrl}
                        alt={`${project.title} logo`}
                        fill
                        sizes="40px"
                        className="relative z-10 rounded-[6px] object-contain p-0.5"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/projects/${project.slug}`} className="text-sm font-medium text-text hover:text-accent-soft">
                        {project.title}
                      </Link>
                      {isFeatured ? (
                        <span className="rounded-full border border-accent/60 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted">{project.dateLabel}</p>
                  </div>
                </article>
                </SectionReveal>
              );
            })}
          </div>
        </section>
        </SectionReveal>

        <SectionReveal variant="item" delay={0.04}>
        <section id="resume-links" className="mt-6 card">
          <h2 className="text-lg font-semibold text-text">Links</h2>
          <p className="mt-2 text-sm text-muted">Social and project channels from the original site.</p>
          <div className="mt-4">
            <SocialLinks />
          </div>
        </section>
        </SectionReveal>
      </div>
    </section>
  );
}
