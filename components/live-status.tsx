"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LiveStatusSnapshot } from "@/lib/types";

type LiveStatusProps = {
  initialStatus: LiveStatusSnapshot;
  username: string;
};

export function LiveStatus({ initialStatus, username }: LiveStatusProps) {
  const [status, setStatus] = useState<LiveStatusSnapshot>(initialStatus);
  const [activeIndex, setActiveIndex] = useState(0);
  const rotateTimerRef = useRef<number | null>(null);
  const rotatePauseRef = useRef<number | null>(null);

  const ROTATE_MS = 5000;
  const MANUAL_PAUSE_MS = 9000;

  const clearRotateTimers = useCallback(() => {
    if (rotateTimerRef.current !== null) {
      window.clearInterval(rotateTimerRef.current);
      rotateTimerRef.current = null;
    }

    if (rotatePauseRef.current !== null) {
      window.clearTimeout(rotatePauseRef.current);
      rotatePauseRef.current = null;
    }
  }, []);

  const restartRotateTimer = useCallback((withManualPause = false) => {
    clearRotateTimers();

    const startInterval = () => {
      rotateTimerRef.current = window.setInterval(() => {
        setActiveIndex((current) => (current + 1) % 6);
      }, ROTATE_MS);
    };

    if (withManualPause) {
      rotatePauseRef.current = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % 6);
        startInterval();
      }, MANUAL_PAUSE_MS);

      return;
    }

    startInterval();
  }, [MANUAL_PAUSE_MS, ROTATE_MS, clearRotateTimers]);

  useEffect(() => {
    restartRotateTimer();
    return () => {
      clearRotateTimers();
    };
  }, [clearRotateTimers, restartRotateTimer]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=1&sort=updated`, {
          headers: {
            Accept: "application/vnd.github+json"
          }
        });

        if (!reposResponse.ok) {
          return;
        }

        const repos = (await reposResponse.json()) as Array<{ name: string; pushed_at: string; language: string | null }>;
        const latestRepo = repos[0];

        if (!latestRepo) {
          return;
        }

        setStatus((current) => ({
          ...current,
          lastCommit: `${latestRepo.name} · ${new Date(latestRepo.pushed_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          })}`,
          recentlyLearned: latestRepo.language ? `Recently focused on ${latestRepo.language}` : current.recentlyLearned,
          lastUpdatedLabel: `Updated ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
        }));
      } catch {
        return;
      }
    };

    const refreshTimer = window.setInterval(refresh, 1000 * 60 * 5);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, [username]);

  const items = useMemo(
    () => [
      { label: "Currently Building", value: status.currentlyBuilding },
      { label: "Last Commit", value: status.lastCommit },
      { label: "Recently Learned", value: status.recentlyLearned },
      { label: "Currently Listening", value: status.currentlyListening },
      { label: "Recently Watched", value: status.recentlyWatched },
      { label: "Currently Into", value: status.currentlyInto }
    ],
    [status]
  );

  return (
    <section className="relative border-t border-line/80 py-14 overflow-hidden" id="home-live-status" data-section-label="Live State">
      <span data-section-num aria-hidden="true" className="section-num absolute top-2 right-4 select-none">04</span>
      <div className="container-shell">
        <h2 className="section-title">Live State</h2>
        <p className="section-subtitle">My current activities and recent updates on GitHub.</p>

        <div className="mt-6 rounded-2xl border border-line/70 bg-panel/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted">
            {items.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  restartRotateTimer(true);
                }}
                className={`rounded-full border px-2.5 py-1 transition ${
                  activeIndex === index ? "border-accent/60 bg-accent/10 text-accent-soft" : "border-line text-muted hover:text-text"
                }`}
              >
                {item.label}
              </button>
            ))}
            <span className="ml-auto rounded-full border border-line px-2.5 py-1 text-muted">{status.lastUpdatedLabel}</span>
          </div>

          <div className="mt-4 min-h-[4.5rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${items[activeIndex].label}-${items[activeIndex].value}`}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="rounded-xl border border-line/70 bg-black/20 p-4"
              >
                <p className="text-[10px] uppercase tracking-[0.12em] text-accent-soft">{items[activeIndex].label}</p>
                <p className="mt-2 text-sm text-text sm:text-base">{items[activeIndex].value}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
