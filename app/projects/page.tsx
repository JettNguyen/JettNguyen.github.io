import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { SectionReveal } from "@/components/section-reveal";
import { ProjectGallery } from "@/components/project-gallery";

export const metadata: Metadata = {
  title: "Projects",
  description: "Project case studies covering problem, approach, implementation, and outcomes."
};

export default function ProjectsPage() {
  return (
    <section id="projects-overview" className="py-16 sm:py-20">
      <div className="container-shell rounded-2xl border border-line/60 bg-black/10 p-4 sm:p-6">
        <SectionReveal>
          <h1 className="section-title">Projects</h1>
          <p className="section-subtitle">Case-study archive of projects, decisions, implementation, and results.</p>
        </SectionReveal>

        <div id="projects-grid" className="mt-8">
          <ProjectGallery items={projects} />
        </div>
      </div>
    </section>
  );
}
