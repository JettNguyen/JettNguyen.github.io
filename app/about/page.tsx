import type { Metadata } from "next";
import { AboutInterestGallery } from "@/components/about-interest-gallery";
import { MorphPageTitle } from "@/components/morph-page-title";
import { SectionReveal } from "@/components/section-reveal";
import { getPersonalSectionsWithMedia } from "@/data/personal";

export const metadata: Metadata = {
  title: "About",
  description: "A showcase of personal interests, including music, films, tech, vintage pieces, and ongoing curiosities that shape my perspective and creativity."
};

export default async function AboutPage() {
  const sections = await getPersonalSectionsWithMedia();

  return (
    <section id="about-overview" data-section-label="Overview" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="container-shell relative rounded-2xl border border-line/60 bg-black/10 p-4 sm:p-6">
        <SectionReveal>
          <MorphPageTitle title="About" className="section-title" scrambleText="About & Interests" />
          <p className="section-subtitle">What Shapes Me: Music, Films, Tech, Vintage Pieces, and Ongoing Curiosities.</p>
          <p className="mt-2 text-xs text-muted">Use hover to preview each interest card, then open details for the full context.</p>
        </SectionReveal>
        <div id="about-interests" className="mt-8">
          <AboutInterestGallery sections={sections} />
        </div>
      </div>
    </section>
  );
}
