"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/transition-link";

export type HorizontalPanelItem = {
  title: string;
  description: string;
  href: string;
  meta?: string;
  imageUrl?: string;
  imageFit?: "cover" | "contain";
  ctaLabel?: string;
};

function getStoryIcon(title: string) {
  const key = title.toLowerCase();
  const iconClass = "h-full w-full text-accent-soft";
  const iconProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };

  if (key.includes("project")) {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} {...iconProps}>
        <rect x="4" y="4.8" width="16" height="14.4" rx="2.4" />
        <path d="M7.4 9.4h9.2M7.4 12.4h6.8M7.4 15.4h8.2" />
      </svg>
    );
  }

  if (key.includes("course")) {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} {...iconProps}>
        <path d="M2.8 8.2 12 4l9.2 4.2L12 12.4 2.8 8.2Z" />
        <path d="M6 10.6v4.2c0 1.9 2.7 3.5 6 3.5s6-1.6 6-3.5v-4.2" />
        <path d="M21.2 8.2v5" />
      </svg>
    );
  }

  if (key.includes("report")) {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} {...iconProps}>
        <path d="M7 4.8h6.9L18.6 9.4V19.2H7z" />
        <path d="M13.9 4.8V9.4H18.6" />
        <path d="M9.4 11.4h5.4M9.4 14.2h5.4" />
        <path d="M9.4 17h3.6" />
      </svg>
    );
  }

  if (key.includes("presentation")) {
    return (
      <svg viewBox="0 0 24 24" className={iconClass} {...iconProps}>
        <rect x="4" y="5" width="16" height="10.8" rx="1.8" />
        <path d="M8 9.3h8M8 12.1h5.2" />
        <path d="M12 15.8v4M8.8 19.8h6.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={iconClass} {...iconProps}>
      <rect x="4" y="3.8" width="16" height="16.4" rx="2.1" />
      <path d="M8 8.7h8M8 12h8M8 15.3h5.2" />
    </svg>
  );
}

type HorizontalPanelsProps = {
  id: string;
  title: string;
  subtitle: string;
  items: HorizontalPanelItem[];
  accentLabel?: string;
  sectionNumber?: string;
  sectionLabel?: string;
};

function useHorizontalCarousel(sectionRef: React.RefObject<HTMLElement>, trackRef: React.RefObject<HTMLDivElement>, itemCount: number) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) {
      return;
    }

    const context = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-horizontal-panel]", track);
      if (panels.length <= 1) {
        return;
      }

      gsap.set(section, { perspective: 1400 });
      gsap.set(track, { transformStyle: "preserve-3d" });
      gsap.set(panels, { transformStyle: "preserve-3d", transformOrigin: "center center" });

      const getDistance = () => Math.max(0, Math.ceil(track.scrollWidth - track.clientWidth + 2));
      const getLead = () => Math.max(28, Math.round(window.innerWidth * 0.06));
      const getTotalTravel = () => getDistance() + getLead() * 2;
      const getStartX = () => getLead();
      const getEndX = () => -(getDistance() + getLead());

      gsap.set(track, { x: getStartX() });

      const updatePanelDepth = () => {
        const lead = getLead();
        const totalTravel = getTotalTravel();
        const currentX = Number(gsap.getProperty(track, "x")) || 0;
        const progress = totalTravel > 0 ? Math.max(0, Math.min(1, (lead - currentX) / totalTravel)) : 0;
        const focusIndex = progress * (panels.length - 1);

        panels.forEach((panel, i) => {
          const delta = i - focusIndex;
          const absDelta = Math.abs(delta);
          gsap.set(panel, {
            rotateY: gsap.utils.clamp(-22, 22, delta * -11),
            scale: gsap.utils.clamp(0.9, 1, 1 - absDelta * 0.05),
            y: gsap.utils.clamp(0, 14, absDelta * 7),
            z: gsap.utils.clamp(0, 180, 180 - absDelta * 120),
            opacity: gsap.utils.clamp(0.82, 1, 1 - absDelta * 0.1)
          });
        });
      };

      updatePanelDepth();

      gsap.to(track, {
        x: getEndX,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top+=72",
          end: () => `+=${getTotalTravel() + window.innerHeight}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: updatePanelDepth,
          onRefresh: updatePanelDepth,
          onRefreshInit: updatePanelDepth,
          onLeave: () => {
            gsap.set(track, { x: getEndX() });
            updatePanelDepth();
          },
          onLeaveBack: () => {
            gsap.set(track, { x: getStartX() });
            updatePanelDepth();
          }
        }
      });

      gsap.fromTo(
        panels,
        { opacity: 0.4, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%"
          }
        }
      );
    }, section);

    return () => {
      context.revert();
    };
  }, [itemCount, sectionRef, trackRef]);
}

function HorizontalPanelSectionShell({ id, title, subtitle, accentLabel = "Scroll Story", sectionNumber, sectionLabel, children }: HorizontalPanelsProps & { children: React.ReactNode }) {
  return (
    <section id={id} data-section-label={sectionLabel} className="relative overflow-hidden border-t border-line/80 py-20">
      {sectionNumber ? (
        <span data-section-num aria-hidden="true" className="section-num absolute top-2 right-4 select-none">{sectionNumber}</span>
      ) : null}
      <div className="container-shell">
        <p className="text-xs uppercase tracking-[0.22em] text-accent-soft">{accentLabel}</p>
        <h2 className="section-title mt-4">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

export function HomeSiteMapPanels({ id, title, subtitle, items, accentLabel = "Scroll Story", sectionNumber, sectionLabel }: HorizontalPanelsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useHorizontalCarousel(sectionRef, trackRef, items.length);

  const teardownOnNavigate = () => {
    // no-op by design; scoped gsap.context cleanup handles teardown safely on unmount
  };

  return (
    <section ref={sectionRef}>
      <HorizontalPanelSectionShell id={id} title={title} subtitle={subtitle} items={items} accentLabel={accentLabel} sectionNumber={sectionNumber} sectionLabel={sectionLabel}>
        <div ref={trackRef} className="mt-8 flex flex-row items-stretch gap-4">
          {items.map((item) => (
            <TransitionLink
              key={`${item.title}-${item.href}`}
              href={item.href}
              useCurrentTargetAsSource
              onBeforeNavigate={teardownOnNavigate}
              data-horizontal-panel
              className="card group relative flex min-h-[23rem] w-[min(76vw,46svh)] shrink-0 items-center overflow-hidden bg-panel/80 p-0 sm:min-h-[24rem] sm:w-[min(66vw,48svh)] lg:min-h-[26rem] lg:w-[min(58vw,31rem)]"
            >
              <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-panel via-black/35 to-accent/20" aria-hidden="true">
                <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute -right-8 bottom-2 h-28 w-28 rounded-full bg-white/8 blur-3xl" />
                <div className="absolute inset-0 flex items-center justify-center p-7 opacity-[0.14]">
                  {getStoryIcon(item.title)}
                </div>
              </div>

              <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-5 text-center sm:p-6">
                {item.meta ? (
                  <span className="inline-flex rounded-full border border-accent/45 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft">
                    {item.meta}
                  </span>
                ) : null}
                <h3 className="text-xl font-semibold tracking-tight text-text">{item.title}</h3>
                <p className="mt-2.5 max-w-xl text-sm leading-6 text-muted">{item.description}</p>
                <span
                  className="mt-4 inline-flex rounded-full border border-accent/55 bg-accent/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-soft group-hover:border-accent group-hover:bg-accent/20"
                >
                  {item.ctaLabel ?? "Explore"}
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </HorizontalPanelSectionShell>
    </section>
  );
}

export function ProjectHighlightPanels({ id, title, subtitle, items, accentLabel = "Scroll Story", sectionNumber, sectionLabel }: HorizontalPanelsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useHorizontalCarousel(sectionRef, trackRef, items.length);

  const teardownOnNavigate = () => {
    // no-op by design; scoped gsap.context cleanup handles teardown safely on unmount
  };

  return (
    <section ref={sectionRef}>
      <HorizontalPanelSectionShell id={id} title={title} subtitle={subtitle} items={items} accentLabel={accentLabel} sectionNumber={sectionNumber} sectionLabel={sectionLabel}>
        <div ref={trackRef} className="mt-8 flex flex-row items-stretch gap-4">
          {items.map((item) => (
            <TransitionLink
              key={`${item.title}-${item.href}`}
              href={item.href}
              useCurrentTargetAsSource
              onBeforeNavigate={teardownOnNavigate}
              data-horizontal-panel
              className="card group block w-[min(76vw,42svh)] shrink-0 overflow-hidden p-0 sm:w-[min(66vw,44svh)] lg:w-[min(58vw,30rem)]"
            >
              <div className="relative z-0 aspect-square w-full overflow-hidden border-b border-line/70 bg-panel/50">
                {item.imageUrl ? (
                  <div className="absolute inset-5 flex items-center justify-center sm:inset-6 lg:inset-7">
                    <Image
                      src={item.imageUrl}
                      alt={`${item.title} visual`}
                      width={900}
                      height={900}
                      sizes="(max-width: 640px) 76vw, (max-width: 1024px) 66vw, 30rem"
                      className="h-full w-full rounded-2xl object-contain object-center"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-5 rounded-2xl bg-gradient-to-br from-panel via-black/30 to-accent/10 sm:inset-6 lg:inset-7" />
                )}

                {item.meta ? (
                  <span className="absolute left-3 top-3 rounded-full border border-accent/55 bg-black/45 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft backdrop-blur-sm">
                    {item.meta}
                  </span>
                ) : null}
              </div>

              <div className="relative z-10 border-t border-line/70 bg-ink/88 p-3.5 backdrop-blur-sm sm:p-4">
                <h3 className="text-xl font-semibold tracking-tight text-text">{item.title}</h3>
                <p className="mt-2.5 max-w-xl text-sm leading-6 text-muted">{item.description}</p>
                <span className="mt-4 inline-flex rounded-full border border-accent/55 bg-accent/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-accent-soft group-hover:border-accent group-hover:bg-accent/20">
                  {item.ctaLabel ?? "Explore"}
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </HorizontalPanelSectionShell>
    </section>
  );
}
