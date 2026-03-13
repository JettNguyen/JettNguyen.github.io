import { GithubRepo } from "@/lib/types";
import { projects } from "@/data/projects";

export const featuredGithubRepoNames = [
  "NightLink",
  "Frequify",
  "Nexel",
  "Splitsy",
  "Sideline",
  "ProducerFingerprint"
];

export const omittedGithubRepoNames = [
  "JettNguyen",
  "JettNguyen.github.io",
  "CounterAssignment",
  "esep-webhooks",
  "observability_assignment11",
  "RocketScope",
  "Jett2Fly"
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getRepoNameFromUrl(url: string | undefined) {
  if (!url) {
    return undefined;
  }

  const trimmed = url.trim().replace(/\/$/, "");
  const segments = trimmed.split("/");
  return segments[segments.length - 1]?.toLowerCase();
}

function getFeaturedRepoNames(featuredEntries: string[]) {
  const projectAliasToRepoName = new Map<string, string>();

  projects.forEach((project) => {
    const repoName = getRepoNameFromUrl(project.githubUrl);

    if (!repoName) {
      return;
    }

    projectAliasToRepoName.set(normalize(project.slug), repoName);
    projectAliasToRepoName.set(normalize(project.title), repoName);
    projectAliasToRepoName.set(repoName, repoName);
  });

  return featuredEntries
    .map((entry) => normalize(entry))
    .map((entry) => projectAliasToRepoName.get(entry) ?? entry);
}

export function selectGithubRepos(repos: GithubRepo[], limit = 6) {
  const hidden = new Set(omittedGithubRepoNames.map((name) => name.toLowerCase()));
  const featuredOrder = getFeaturedRepoNames(featuredGithubRepoNames);

  const visibleRepos = repos.filter((repo) => !hidden.has(repo.name.toLowerCase()));

  const featuredRepos = featuredOrder
    .map((repoName) => visibleRepos.find((repo) => repo.name.toLowerCase() === repoName))
    .filter((repo): repo is GithubRepo => Boolean(repo));

  if (featuredRepos.length > 0) {
    return featuredRepos.slice(0, limit);
  }

  return visibleRepos.slice(0, limit);
}

export function isFeaturedRepo(repoName: string) {
  const featuredOrder = new Set(getFeaturedRepoNames(featuredGithubRepoNames));
  return featuredOrder.has(normalize(repoName));
}
