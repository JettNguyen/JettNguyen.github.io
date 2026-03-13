import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPresentation, presentations } from "@/data/presentations";
import { SectionReveal } from "@/components/section-reveal";
import { formatMonthYear } from "@/lib/utils";

type Props = {
  params: { id: string };
};

export function generateStaticParams() {
  return presentations.map((item) => ({ id: item.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const item = getPresentation(params.id);

  if (!item) {
    return { title: "Not Found" };
  }

  return {
    title: item.title,
    description: item.description
  };
}

export default function PresentationDetailPage({ params }: Props) {
  const item = getPresentation(params.id);

  if (!item) {
    notFound();
  }

  return (
    <article id="presentation-detail" className="py-16 sm:py-20">
      <div className="container-shell max-w-5xl">
        <SectionReveal>
        <header className="card">
          <h1 className="text-2xl font-semibold text-text sm:text-3xl">{item.title}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">{item.description}</p>

          {item.date || item.course ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
              {item.date ? <span className="rounded-full border border-line/80 px-2 py-0.5">{formatMonthYear(item.date)}</span> : null}
              {item.course ? (
                item.course.url ? (
                  <a
                    href={item.course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line/80 px-2 py-0.5 transition hover:border-line hover:text-text"
                  >
                    {item.course.name}
                  </a>
                ) : (
                  <span className="rounded-full border border-line/80 px-2 py-0.5">{item.course.name}</span>
                )
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
            <Link
              href="/presentations"
              className="rounded-full border border-line/60 bg-panel/40 px-2.5 py-1 text-muted transition hover:border-line hover:text-text"
            >
              back
            </Link>
            {item.videoUrl ? (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-accent-soft transition hover:border-accent hover:bg-accent/20 hover:text-accent"
              >
                video
              </a>
            ) : null}
            {item.deckUrl ? (
              <a
                href={item.deckUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-accent-soft transition hover:border-accent hover:bg-accent/20 hover:text-accent"
              >
                deck
              </a>
            ) : null}
          </div>
        </header>
        </SectionReveal>

        {item.videoUrl ? (
          <SectionReveal className="mt-6" variant="item" delay={0.04}>
          <section className="card overflow-hidden p-0">
            <iframe
              src={toYouTubeEmbedUrl(item.videoUrl)}
              title={item.title}
              loading="lazy"
              className="h-[50vh] w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </section>
          </SectionReveal>
        ) : null}
      </div>
    </article>
  );
}

function toYouTubeEmbedUrl(url: string) {
  if (url.includes("<iframe")) {
    const match = url.match(/src=["']([^"']+)["']/i);
    if (match?.[1]) {
      return toYouTubeEmbedUrl(match[1]);
    }
  }

  if (url.includes("/embed/")) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.includes("/shorts/")) {
        const id = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
        if (id) {
          return `https://www.youtube.com/embed/${id}`;
        }
      }

      const id = parsed.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }
  } catch {
    return url;
  }

  return url;
}

