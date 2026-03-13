import type { Metadata } from "next";
import { presentations } from "@/data/presentations";
import { PresentationGallery } from "@/components/presentation-gallery";
import { SectionReveal } from "@/components/section-reveal";

export const metadata: Metadata = {
  title: "Presentations",
  description: "Gallery of presentations and reports with embedded PDF and YouTube preview."
};

export default function PresentationsPage() {
  return (
    <section id="presentations-overview" className="py-16 sm:py-20">
      <div className="container-shell rounded-2xl border border-line/60 bg-black/10 p-4 sm:p-6">
        <SectionReveal>
          <h1 className="section-title">Presentations</h1>
          <p className="section-subtitle">Slide decks & YouTube embeddings to presentations.</p>
          <p className="section-subtitle" style={{ fontSize: "12px" }}>Note: Presentation Decks will open in Google Slides. Download the .pptx for true viewing experience.</p>
        </SectionReveal>
        <div id="presentations-gallery" className="mt-8">
          <PresentationGallery items={presentations} />
        </div>
      </div>
    </section>
  );
}
