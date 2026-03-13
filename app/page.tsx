import { Metadata } from "next";
import Image from "next/image";
import { PreviewCard } from "@/components/preview-card";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { SectionReveal } from "@/components/section-reveal";
import { GithubPinnedRepos } from "@/components/github-pinned-repos";
import { SocialLinks } from "@/components/social-links";
import { getGithubRepos } from "@/lib/github";
import { resumeData } from "@/data/resume";

export const metadata: Metadata = {
  title: "Home",
  description: "Portfolio home with projects, coursework, reports, presentations, and resume."
};

const previews = [
  { title: "Projects", description: "Project case studies showing what I built, why I built it, and what changed.", href: "/projects" },
  { title: "Coursework", description: "Core CS and PR foundations and how class concepts were applied in real implementations.", href: "/coursework" },
  { title: "Reports", description: "Technical and PR college reports, analyses, and written documentation.", href: "/reports" },
  { title: "Presentations", description: "Slide decks, embedded media, and report presentation materials.", href: "/presentations" },
  { title: "Resume", description: "Experience, skills, education, and downloadable resume file.", href: "/resume" }
];

export default async function HomePage() {
  const repos = await getGithubRepos("JettNguyen");

  return (
    <>
      <section id="home-hero" className="relative border-b border-line/90">
        <div className="container-shell relative grid min-h-[82vh] items-center gap-10 py-20 md:py-24 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute right-6 top-12 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
          </div>
          <SectionReveal>
            <p className="text-xs uppercase tracking-[0.22em] text-accent-soft">Digital Portfolio</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-text sm:text-7xl">Jett Nguyen</h1>
            <p className="mt-5 max-w-2xl text-xl text-[#d4d4da] sm:text-2xl">Designing systems that shape behavior.</p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              I build software where interaction quality is treated as an engineering outcome.
              Understanding user behavior and designing systems that align with human-centered decision-making is at the core of my approach.
            </p>
          </SectionReveal>
          <SectionReveal className="relative mx-auto flex w-full max-w-sm justify-center md:justify-end">
            <div className="relative h-56 w-56 overflow-hidden rounded-full border border-line/80 bg-panel shadow-accent-sm sm:h-64 sm:w-64 md:h-72 md:w-72">
              <Image
                src="/assets/jett.png"
                alt="Jett Nguyen headshot"
                fill
                priority
                sizes="(max-width: 768px) 256px, 288px"
                className="object-cover"
              />
            </div>
          </SectionReveal>
          <ScrollIndicator />
        </div>
      </section>

      <section id="home-background" className="border-t border-line/80 py-20">
        <div className="container-shell">
          <SectionReveal>
            <h2 className="section-title">Education & Experience</h2>
            <p className="section-subtitle">University background and work history from my current resume.</p>
          </SectionReveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <SectionReveal>
              <article className="card">
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent-soft">Education</p>
                <h3 className="mt-2 text-lg font-semibold text-text">{resumeData.education.institution}</h3>
                <p className="mt-1 text-sm text-muted">{resumeData.education.degree}</p>
                <p className="mt-3 inline-flex rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                  {resumeData.education.date}
                </p>
              </article>
            </SectionReveal>

            <SectionReveal>
              <article className="card">
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent-soft">Work Experience</p>
                <div className="mt-4 space-y-4">
                  {resumeData.experience.map((item) => (
                    <section key={`${item.company}-${item.role}`} className="rounded-lg border border-line/70 bg-black/20 p-3">
                      <h3 className="text-base font-semibold text-text">{item.role}</h3>
                      <p className="mt-0.5 text-sm text-muted">{item.company}</p>
                      <p className="mt-2 inline-flex rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                        {item.date}
                      </p>
                    </section>
                  ))}
                </div>
              </article>
            </SectionReveal>
          </div>
        </div>
      </section>

      <section id="home-previews" className="py-20">
        <div className="container-shell">
          <SectionReveal>
            <h2 className="section-title">Site Map</h2>
            <p className="section-subtitle">Quick overview of how my portfolio is organized.</p>
          </SectionReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previews.map((item, index) => (
              <SectionReveal key={item.title} variant="item" delay={index * 0.04}>
                <PreviewCard {...item} />
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="home-repos" className="border-t border-line/80 py-20">
        <div className="container-shell">
          <SectionReveal>
            <h2 className="section-title">Code Repositories</h2>
            <p className="section-subtitle">My featured public GitHub Repos.</p>
          </SectionReveal>
          <SectionReveal className="mt-8" variant="item" delay={0.04}>
            <GithubPinnedRepos initialRepos={repos} username="JettNguyen" />
          </SectionReveal>
        </div>
      </section>

      <section id="home-links" className="border-t border-line/80 py-16">
        <div className="container-shell">
          <SectionReveal>
            <h2 className="section-title">Contact & Links</h2>
            <p className="section-subtitle">Primary social and professional links from coding, school, production, and marketplaces.</p>
          </SectionReveal>
          <SectionReveal className="mt-6" variant="item" delay={0.04}>
            <SocialLinks />
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
