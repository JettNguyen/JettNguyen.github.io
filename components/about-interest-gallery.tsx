"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SectionReveal } from "@/components/section-reveal";
import { navigateWithTransition } from "@/lib/page-transition";
import { PersonalInterestGroup } from "@/lib/types";

type AboutInterestGalleryProps = {
  sections: PersonalInterestGroup[];
};

export function AboutInterestGallery({ sections }: AboutInterestGalleryProps) {
  const router = useRouter();
  const [hoveredCardKey, setHoveredCardKey] = useState<string | null>(null);
  const [touchPreviewCardKey, setTouchPreviewCardKey] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(true);
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pausedBySection, setPausedBySection] = useState<Record<string, boolean>>({});
  const [hoverPausedBySection, setHoverPausedBySection] = useState<Record<string, boolean>>({});

  const navigateTo = (href: string, sourceElement?: HTMLElement | null) => {
    navigateWithTransition({
      href,
      router,
      sourceElement,
      sharedKey: href.replace(/^\//, "")
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setCanHover(mediaQuery.matches);

    apply();
    mediaQuery.addEventListener("change", apply);

    return () => {
      mediaQuery.removeEventListener("change", apply);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let frame = 0;

    const initializeTracks = () => {
      sections.forEach((section) => {
        const track = trackRefs.current[section.key];
        if (!track) {
          return;
        }

        const oneSetWidth = track.scrollWidth / 3;
        if (track.scrollLeft < oneSetWidth * 0.25 || track.scrollLeft > oneSetWidth * 1.75) {
          track.scrollLeft = oneSetWidth;
        }
      });
    };

    const tick = () => {
      sections.forEach((section) => {
        const track = trackRefs.current[section.key];
        if (!track) {
          return;
        }

        const manuallyPaused = pausedBySection[section.key] ?? false;
        const hoverPaused = hoverPausedBySection[section.key] ?? false;

        if (manuallyPaused || hoverPaused) {
          return;
        }

        const oneSetWidth = track.scrollWidth / 3;
        track.scrollLeft += 0.35;

        if (track.scrollLeft >= oneSetWidth * 2) {
          track.scrollLeft -= oneSetWidth;
        }
      });

      frame = window.requestAnimationFrame(tick);
    };

    initializeTracks();
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [hoverPausedBySection, pausedBySection, sections]);

  return (
    <div className="space-y-10">
      {sections.map((section, sectionIndex) => (
        <section
          key={section.key}
          id={`about-section-${section.key}`}
          data-section-label={section.title}
          className="relative scroll-mt-28"
        >
          <SectionReveal>
            <div className="mb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-accent-soft">{section.title}</p>
                <button
                  type="button"
                  onClick={() => {
                    setPausedBySection((current) => ({
                      ...current,
                      [section.key]: !(current[section.key] ?? false)
                    }));
                  }}
                  className="rounded-full border border-line/80 bg-panel/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-muted hover:text-accent-soft"
                >
                  {(pausedBySection[section.key] ?? false) ? "Resume Carousel" : "Pause Carousel"}
                </button>
              </div>
              <p className="mt-2 text-sm text-muted">{section.intro}</p>
            </div>
          </SectionReveal>

          <div
            ref={(node) => {
              trackRefs.current[section.key] = node;
            }}
            className="no-scrollbar flex gap-4 overflow-x-auto px-1 pb-2 pt-2"
            onMouseEnter={() => {
              setHoverPausedBySection((current) => ({
                ...current,
                [section.key]: true
              }));
            }}
            onMouseLeave={() => {
              setHoverPausedBySection((current) => ({
                ...current,
                [section.key]: false
              }));
            }}
          >
            {[...section.items, ...section.items, ...section.items].map((item, itemIndex) => {
              const itemKey = `${section.key}-${item.slug}`;
              const renderKey = `${itemKey}-${itemIndex}`;
              const isActive = !canHover || hoveredCardKey === renderKey || touchPreviewCardKey === renderKey;
              const detailHref = `/about/${section.key}/${item.slug}`;
              const destinationHref = item.section === "music" && item.spotifyUrl ? item.spotifyUrl : detailHref;
              const isExternalDestination = destinationHref.startsWith("http");
              const isFilm = item.section === "films";

              const openDestination = (sourceElement?: HTMLElement | null) => {
                if (isExternalDestination) {
                  window.open(destinationHref, "_blank", "noopener,noreferrer");
                  return;
                }

                navigateTo(destinationHref, sourceElement);
              };

              return (
                <div key={renderKey} className="h-full shrink-0 basis-[18.5rem] sm:basis-[20rem]">
                  <motion.article
                    role="link"
                    tabIndex={0}
                    className="card relative flex h-full min-h-[24rem] cursor-pointer flex-col overflow-hidden transition duration-300 hover:border-accent/70 hover:shadow-accent-sm"
                    onMouseEnter={() => {
                      setHoveredCardKey(renderKey);
                      setHoverPausedBySection((current) => ({
                        ...current,
                        [section.key]: true
                      }));
                    }}
                    onMouseLeave={() => {
                      setHoveredCardKey((current) => (current === renderKey ? null : current));
                    }}
                    onFocus={() => setHoveredCardKey(renderKey)}
                    onBlur={() => {
                      setHoveredCardKey((current) => (current === renderKey ? null : current));
                      setHoverPausedBySection((current) => ({
                        ...current,
                        [section.key]: false
                      }));
                    }}
                    onClick={(event) => openDestination(event.currentTarget)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openDestination(event.currentTarget as HTMLElement);
                      }
                    }}
                  >
                    {canHover ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setTouchPreviewCardKey((current) => (current === renderKey ? null : renderKey));
                        }}
                        className="absolute right-3 top-3 z-20 rounded-full border border-line/80 bg-panel/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted hover:text-accent-soft"
                      >
                        Preview
                      </button>
                    ) : null}

                    <div className="flex min-h-0 flex-1 flex-col justify-center px-2 pb-2 pt-8">
                      <motion.div
                        animate={{ y: canHover && isActive ? -18 : 0 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                        className="flex flex-col items-center text-center"
                      >
                        <motion.div
                          animate={{ scale: canHover && isActive ? 1 : 1.14 }}
                          transition={{ duration: 0.24, ease: "easeOut" }}
                          className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel/60 ${
                            isFilm ? "h-40 w-28" : "h-28 w-28"
                          }`}
                          aria-hidden="true"
                        >
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.imageAlt ?? `${item.title} image`}
                              fill
                              sizes={isFilm ? "112px" : "112px"}
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
                              className="text-4xl text-muted"
                            />
                          ) : (
                            <span className="px-2 text-center text-[10px] uppercase tracking-[0.12em] text-muted">Image Pending</span>
                          )}
                        </motion.div>
                        <motion.h3
                          className={`mt-4 text-center font-semibold text-text ${canHover && isActive ? "text-lg" : "text-xl"}`}
                        >
                          {item.title}
                        </motion.h3>
                        <p className={`mt-1 text-center ${canHover && isActive ? "text-xs" : "text-sm"} text-muted`}>
                          {item.subtitle}
                        </p>
                      </motion.div>

                      <AnimatePresence initial={false}>
                        {isActive ? (
                          <motion.div
                            key={`${itemKey}-details`}
                            initial={{ opacity: 0, height: 0, y: 8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 8 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="mt-3 overflow-hidden"
                          >
                            <p className="text-sm text-muted">{item.description}</p>
                            <p className="mt-2 text-sm text-text">{item.details[0]}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.tags.slice(0, 2).map((tag) => (
                                <span key={`${renderKey}-${tag}`} className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
