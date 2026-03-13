"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SectionReveal } from "@/components/section-reveal";
import { selectGithubRepos } from "@/data/github-selection";
import { projects } from "@/data/projects";
import { GithubProfileStats, GithubRepo } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Props = {
  initialRepos: GithubRepo[];
  username: string;
};

export function GithubPinnedRepos({ initialRepos, username }: Props) {
  const router = useRouter();
  const [repos, setRepos] = useState<GithubRepo[]>(initialRepos);
  const [stats, setStats] = useState<GithubProfileStats | null>(null);

  useEffect(() => {
    let active = true;

    const repoRequest = fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Client GitHub fetch failed");
        }
        const data = (await response.json()) as GithubRepo[];
        if (active) {
          setRepos(selectGithubRepos(data, 6));
        }
      })
      .catch(() => undefined);

    const statsRequest = fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Client GitHub stats fetch failed");
        }

        const data = (await response.json()) as GithubProfileStats;

        if (active) {
          setStats(data);
        }
      })
      .catch(() => {
        if (active) {
          setStats(null);
        }
      });

    void Promise.allSettled([repoRequest, statsRequest]);

    return () => {
      active = false;
    };
  }, [initialRepos, username]);

  const display = repos;
  const repoProjectMap = useMemo(() => {
    const projectMap = new Map<string, { logoUrl: string; slug: string; title: string; demoUrl?: string }>();

    projects.forEach((project) => {
      if (!project.githubUrl || !project.logoUrl) {
        return;
      }

      const trimmedUrl = project.githubUrl.trim().replace(/\/$/, "");
      const segments = trimmedUrl.split("/");
      const repoName = segments[segments.length - 1]?.toLowerCase();

      if (repoName) {
        projectMap.set(repoName, {
          logoUrl: project.logoUrl,
          slug: project.slug,
          title: project.title,
          demoUrl: project.demoUrl
        });
      }
    });

    return projectMap;
  }, []);

  const totalFeaturedStars = display.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
          Featured Repos <span className="text-accent-soft">{display.length}</span>
        </span>
        <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
          Total Stars <span className="text-accent-soft">{totalFeaturedStars}</span>
        </span>
        {stats ? (
          <>
            <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
              Public Repos <span className="text-accent-soft">{stats.public_repos}</span>
            </span>
            <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
              Followers <span className="text-accent-soft">{stats.followers}</span>
            </span>
          </>
        ) : null}
      </div>

      {display.length === 0 ? (
        <article className="card border-dashed">
          <h3 className="text-base font-semibold text-text">GitHub data unavailable</h3>
          <p className="mt-2 text-sm text-muted">
            This section only renders live repository data. If GitHub rate limits or blocks the request, the grid stays empty.
          </p>
        </article>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((repo, index) => {
          const mappedProject = repoProjectMap.get(repo.name.toLowerCase());
          const logoUrl = mappedProject?.logoUrl ?? "/assets/github.png";
          const caseStudyHref = mappedProject ? `/projects/${mappedProject.slug}` : null;
          const hasDemo = Boolean(mappedProject?.demoUrl);
          const repoMeta = [repo.language, `★ ${repo.stargazers_count}`].filter(Boolean).join(" · ");

          return (
            <SectionReveal key={repo.id} variant="item" delay={(index % 6) * 0.04}>
              <article
                className={`card transition ${caseStudyHref ? "cursor-pointer hover:border-accent/60" : ""}`}
                role={caseStudyHref ? "link" : undefined}
                tabIndex={caseStudyHref ? 0 : undefined}
                onClick={caseStudyHref ? () => router.push(caseStudyHref) : undefined}
                onKeyDown={caseStudyHref ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(caseStudyHref);
                  }
                } : undefined}
              >
              <div className="flex items-start gap-3">
                <div className="relative mt-0.5 h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line/70 bg-black/20">
                  {hasDemo && mappedProject?.demoUrl ? (
                    <a
                      href={mappedProject.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="group block h-full w-full"
                    >
                      <Image src={logoUrl} alt={`${repo.name} logo`} fill sizes="40px" className="rounded-md object-contain p-0.5 transition-all duration-300 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.24)]" />
                    </a>
                  ) : (
                    <Image src={logoUrl} alt={`${repo.name} logo`} fill sizes="40px" className="rounded-md object-contain p-0.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {hasDemo && mappedProject?.demoUrl ? (
                      <a
                        href={mappedProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        className="truncate text-base font-semibold text-text transition hover:text-accent-soft"
                      >
                        {repo.name}
                      </a>
                    ) : (
                      <h3 className="truncate text-base font-semibold text-text">{repo.name}</h3>
                    )}
                    {hasDemo && mappedProject?.demoUrl ? (
                      <a
                        href={mappedProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        className="rounded-full border border-accent/60 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-accent-soft transition hover:border-accent hover:bg-accent/15"
                      >
                        Demo
                      </a>
                    ) : null}
                  </div>
                  {repo.description ? <p className="mt-2 line-clamp-2 text-sm text-muted">{repo.description}</p> : null}
                  <p className="mt-2 text-xs text-muted">{repoMeta}</p>
                  <p className="mt-1 text-xs text-muted">
                    Updated {formatDate(repo.updated_at)}
                  </p>
                </div>
              </div>
              </article>
            </SectionReveal>
          );
        })}
      </div>
      )}
    </div>
  );
}
