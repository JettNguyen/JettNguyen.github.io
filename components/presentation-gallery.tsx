"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SectionReveal } from "@/components/section-reveal";
import { Presentation } from "@/lib/types";
import { formatMonthYear } from "@/lib/utils";

type Props = {
  items: Presentation[];
};

export function PresentationGallery({ items }: Props) {
  const router = useRouter();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <SectionReveal key={item.id} variant="item" delay={(index % 6) * 0.04}>
          <article
            className="card cursor-pointer"
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/presentations/${item.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/presentations/${item.id}`);
              }
            }}
          >
          {item.videoUrl ? (
            <div className="overflow-hidden rounded-lg border border-line">
              <iframe
                src={toYouTubeEmbedUrl(item.videoUrl)}
                title={item.title}
                loading="lazy"
                className="h-40 w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : item.thumbnailUrl ? (
            <div className="overflow-hidden rounded-lg border border-line">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                width={500}
                height={320}
                className="h-40 w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-line bg-panel/50">
              <p className="text-sm text-muted">Deck Only</p>
            </div>
          )}

          <div className="mt-3">
            <h2 className="mt-3 text-base font-semibold text-text">
              <span className="hover:text-accent-soft">{item.title}</span>
            </h2>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
            {item.date || item.course ? (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                {item.date ? <span className="rounded-full border border-line/80 px-2 py-0.5">{formatMonthYear(item.date)}</span> : null}
                {item.course ? (
                  item.course.url ? (
                    <a
                      href={item.course.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
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
            <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
              {item.videoUrl ? (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-accent-soft transition hover:border-accent hover:bg-accent/20 hover:text-accent"
                >
                  video
                </a>
              ) : (
                <span className="rounded-full border border-line/60 bg-panel/40 px-2.5 py-1 text-muted/60">no video</span>
              )}
              {item.deckUrl ? (
                <a
                  href={item.deckUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-accent-soft transition hover:border-accent hover:bg-accent/20 hover:text-accent"
                >
                  deck
                </a>
              ) : (
                <span className="rounded-full border border-line/60 bg-panel/40 px-2.5 py-1 text-muted/60">no deck</span>
              )}
            </div>
          </div>
          </article>
        </SectionReveal>
      ))}
    </div>
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
