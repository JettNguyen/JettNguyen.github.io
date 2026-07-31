import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AboutDetailMorph } from "@/components/about-detail-morph";
import { MorphInterestTitle } from "@/components/morph-interest-title";
import { SectionReveal } from "@/components/section-reveal";
import { TransitionLink } from "@/components/transition-link";
import {
  getAllPersonalItems,
  getPersonalItem,
  getPersonalItemWithMedia,
  isPersonalSectionKey,
  personalInterestSections
} from "@/data/personal";

type Props = {
  params: { section: string; slug: string };
};

export function generateStaticParams() {
  return getAllPersonalItems().map((item) => ({ section: item.section, slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isPersonalSectionKey(params.section)) {
    return { title: "Not Found" };
  }

  const item = getPersonalItem(params.section, params.slug);

  if (!item) {
    return { title: "Not Found" };
  }

  return {
    title: `${item.title} · About`,
    description: item.description
  };
}

export default async function AboutDetailPage({ params }: Props) {
  if (!isPersonalSectionKey(params.section)) {
    notFound();
  }

  const item = await getPersonalItemWithMedia(params.section, params.slug);

  if (!item) {
    notFound();
  }

  const section = personalInterestSections.find((entry) => entry.key === params.section);
  const isFilm = item.section === "films";

  return (
    <article id="about-detail" data-section-label="Overview" className="relative py-16 sm:py-20 overflow-hidden">
      <span data-section-num aria-hidden="true" className="section-num absolute top-2 right-4 select-none">01</span>
      <div className="container-shell max-w-4xl">
        <div className="mb-4">
          <TransitionLink
            href={`/about#about-section-${item.section}`}
            sourceSelector={`[data-transition-source="about-card-${item.section}-${item.slug}"]`}
            sharedKey={`about/${item.section}/${item.slug}`}
            preferBack
            className="inline-flex items-center rounded-full border border-line/60 bg-panel/40 px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-muted transition hover:border-line hover:text-text"
          >
            ← back
          </TransitionLink>
        </div>
        <SectionReveal>
          <AboutDetailMorph section={item.section} slug={item.slug} className="card">
            <div className="mb-4 flex items-start gap-4">
              <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel/60 ${
                isFilm ? "h-40 w-28" : "h-24 w-24"
              }`}>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt ?? `${item.title} image`}
                    fill
                    sizes={isFilm ? "112px" : "96px"}
                    className={
                      isFilm
                        ? "object-contain p-1"
                        : item.imageFit === "contain"
                          ? "object-contain p-2"
                          : "object-cover"
                    }
                  />
                ) : item.icon ? (
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="text-5xl text-muted"
                  />
                ) : (
                  <span className="px-2 text-center text-[10px] uppercase tracking-[0.12em] text-muted">Image Pending</span>
                )}
              </div>
              <div className="min-w-0">
                <MorphInterestTitle
                  section={item.section}
                  slug={item.slug}
                  title={item.title}
                  className="mt-2 text-2xl font-semibold text-text sm:text-3xl"
                />
                <p className="mt-1 text-sm text-muted">{item.subtitle}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={`${item.slug}-${tag}`} className="rounded-full border border-line px-2 py-1 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em]">
                  {item.section === "music" && item.spotifyUrl ? (
                    <a
                      href={item.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-accent-soft transition hover:border-accent hover:bg-accent/20 hover:text-accent"
                    >
                      spotify
                    </a>
                  ) : null}
                  {item.links?.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-accent-soft transition hover:border-accent hover:bg-accent/20 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>
          </AboutDetailMorph>
        </SectionReveal>

        <section id="about-detail-notes" data-section-label="Notes" className="relative mt-6 overflow-hidden">
          <span data-section-num aria-hidden="true" className="section-num absolute top-2 right-4 select-none">02</span>
          <SectionReveal>
            <article className="card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-text sm:text-lg">Expanded Notes</h2>
                <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                  {section?.title ?? "Interest"}
                </span>
              </div>
              <ul className="mt-3 space-y-2 border-t border-line/70 pt-3 text-sm leading-7 text-muted">
                {item.details.map((detail) => (
                  <li key={`${item.slug}-${detail}`}>{detail}</li>
                ))}
              </ul>
            </article>
          </SectionReveal>
        </section>
      </div>
    </article>
  );
}
