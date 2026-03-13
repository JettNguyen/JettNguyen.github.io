import { selectGithubRepos } from "@/data/github-selection";
import { GithubRepo } from "@/lib/types";

export async function getGithubRepos(username: string): Promise<GithubRepo[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: {
        Accept: "application/vnd.github+json"
      },
      next: { revalidate: 60 * 60 }
    });

    if (!response.ok) {
      throw new Error(`GitHub request failed with ${response.status}`);
    }

    const repos = (await response.json()) as GithubRepo[];
    return selectGithubRepos(repos, 6);
  } catch {
    return [];
  }
}
