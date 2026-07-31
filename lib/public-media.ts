type ItunesSongResult = {
  trackName: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  previewUrl?: string;
  primaryGenreName?: string;
};

type DeezerSearchResponse<T> = {
  data?: T[];
};

type DeezerAlbumResult = {
  title: string;
  link?: string;
  cover_xl?: string;
  cover_big?: string;
  artist?: {
    name?: string;
  };
};

type DeezerTrackResult = {
  title: string;
  link?: string;
  artist?: {
    name?: string;
  };
  album?: {
    title?: string;
    cover_xl?: string;
    cover_big?: string;
  };
};

type ItunesAlbumResult = {
  collectionName: string;
  artistName?: string;
  artworkUrl100?: string;
  collectionViewUrl?: string;
  primaryGenreName?: string;
  releaseDate?: string;
};

type WikipediaSearchResponse = {
  query?: {
    search?: Array<{
      title: string;
    }>;
  };
};

type WikipediaSummaryResponse = {
  title?: string;
  description?: string;
  extract?: string;
  content_urls?: {
    desktop?: {
      page?: string;
    };
  };
  thumbnail?: {
    source?: string;
  };
  originalimage?: {
    source?: string;
  };
};

type ItunesMovieLikeResult = {
  trackName?: string;
  collectionName?: string;
  artistName?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
  collectionViewUrl?: string;
};

type ItunesResponse<T> = {
  resultCount: number;
  results: T[];
};

export type PublicMediaResult = {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  externalUrl?: string;
  sourceLabel: string;
};

type MediaLookupHints = {
  expectedTitle?: string;
  expectedArtist?: string;
  wikipediaPageTitle?: string;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAllTokens(haystack: string, needle: string) {
  const haystackNormalized = normalizeText(haystack);
  const tokens = normalizeText(needle).split(" ").filter(Boolean);

  if (tokens.length === 0) {
    return false;
  }

  return tokens.every((token) => haystackNormalized.includes(token));
}

function scoreMatch(candidateTitle: string, candidateArtist: string | undefined, hints: MediaLookupHints, term: string) {
  let score = 0;
  const title = normalizeText(candidateTitle);
  const artist = normalizeText(candidateArtist ?? "");
  const termNormalized = normalizeText(term);

  if (hints.expectedTitle) {
    const expectedTitle = normalizeText(hints.expectedTitle);
    if (title === expectedTitle) {
      score += 8;
    } else if (title.includes(expectedTitle) || expectedTitle.includes(title)) {
      score += 5;
    } else if (includesAllTokens(candidateTitle, hints.expectedTitle)) {
      score += 3;
    }
  }

  if (hints.expectedArtist) {
    const expectedArtist = normalizeText(hints.expectedArtist);
    if (artist === expectedArtist) {
      score += 5;
    } else if (artist.includes(expectedArtist) || expectedArtist.includes(artist)) {
      score += 3;
    }
  }

  if (title.includes(termNormalized) || termNormalized.includes(title)) {
    score += 2;
  }

  if (includesAllTokens(`${candidateTitle} ${candidateArtist ?? ""}`, term)) {
    score += 2;
  }

  return score;
}

function upscaleItunesArtwork(url?: string) {
  if (!url) {
    return undefined;
  }

  return url
    .replace("100x100bb.jpg", "600x600bb.jpg")
    .replace("100x100-75.jpg", "600x600-75.jpg")
    .replace("100x100", "600x600");
}

export async function fetchItunesMedia(
  term: string,
  entity: "song" | "album",
  hints: MediaLookupHints = {}
): Promise<PublicMediaResult | null> {
  try {
    const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=${entity}&limit=25&country=us`;
    const response = await fetch(endpoint, {
      next: { revalidate: 60 * 60 * 24 },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    if (entity === "song") {
      const payload = (await response.json()) as ItunesResponse<ItunesSongResult>;
      const sorted = payload.results
        .map((candidate) => ({
          candidate,
          score: scoreMatch(candidate.trackName, candidate.artistName, hints, term)
        }))
        .sort((left, right) => right.score - left.score);
      const item = sorted[0]?.candidate;
      const topScore = sorted[0]?.score ?? -1;

      if (!item?.trackName || topScore < 2) {
        return null;
      }

      const subtitleParts = [item.artistName, item.collectionName].filter(Boolean);

      return {
        title: item.trackName,
        subtitle: subtitleParts.length > 0 ? subtitleParts.join(" · ") : item.primaryGenreName,
        imageUrl: upscaleItunesArtwork(item.artworkUrl100),
        imageAlt: `${item.trackName} artwork`,
        externalUrl: item.trackViewUrl ?? item.previewUrl,
        sourceLabel: "iTunes"
      };
    }

    const payload = (await response.json()) as ItunesResponse<ItunesAlbumResult>;
    const sorted = payload.results
      .map((candidate) => ({
        candidate,
        score: scoreMatch(candidate.collectionName, candidate.artistName, hints, term)
      }))
      .sort((left, right) => right.score - left.score);
    const item = sorted[0]?.candidate;
    const topScore = sorted[0]?.score ?? -1;

    if (!item?.collectionName || topScore < 2) {
      return null;
    }

    const subtitleParts = [item.artistName, item.primaryGenreName].filter(Boolean);

    return {
      title: item.collectionName,
      subtitle: subtitleParts.length > 0 ? subtitleParts.join(" · ") : undefined,
      imageUrl: upscaleItunesArtwork(item.artworkUrl100),
      imageAlt: `${item.collectionName} artwork`,
      externalUrl: item.collectionViewUrl,
      sourceLabel: "iTunes"
    };
  } catch {
    return null;
  }
}

export async function fetchDeezerMedia(
  term: string,
  entity: "song" | "album",
  hints: MediaLookupHints = {}
): Promise<PublicMediaResult | null> {
  try {
    const endpoint = `https://api.deezer.com/search/${entity}?q=${encodeURIComponent(term)}&limit=25&output=json`;
    const response = await fetch(endpoint, {
      next: { revalidate: 60 * 60 * 24 },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    if (entity === "album") {
      const payload = (await response.json()) as DeezerSearchResponse<DeezerAlbumResult>;
      const sorted = (payload.data ?? [])
        .map((candidate) => ({
          candidate,
          score: scoreMatch(candidate.title, candidate.artist?.name, hints, term)
        }))
        .sort((left, right) => right.score - left.score);

      const item = sorted[0]?.candidate;
      const topScore = sorted[0]?.score ?? -1;

      if (!item?.title || topScore < 2) {
        return null;
      }

      return {
        title: item.title,
        subtitle: [item.artist?.name, "Album"].filter(Boolean).join(" · "),
        imageUrl: item.cover_xl ?? item.cover_big,
        imageAlt: `${item.title} artwork`,
        externalUrl: item.link,
        sourceLabel: "Deezer"
      };
    }

    const payload = (await response.json()) as DeezerSearchResponse<DeezerTrackResult>;
    const sorted = (payload.data ?? [])
      .map((candidate) => ({
        candidate,
        score: scoreMatch(candidate.title, candidate.artist?.name, hints, term)
      }))
      .sort((left, right) => right.score - left.score);

    const item = sorted[0]?.candidate;
    const topScore = sorted[0]?.score ?? -1;

    if (!item?.title || topScore < 2) {
      return null;
    }

    return {
      title: item.title,
      subtitle: [item.artist?.name, item.album?.title].filter(Boolean).join(" · "),
      imageUrl: item.album?.cover_xl ?? item.album?.cover_big,
      imageAlt: `${item.title} artwork`,
      externalUrl: item.link,
      sourceLabel: "Deezer"
    };
  } catch {
    return null;
  }
}

async function fetchItunesMovieFallback(term: string): Promise<PublicMediaResult | null> {
  try {
    const endpoint = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=movie&limit=1&country=us`;
    const response = await fetch(endpoint, {
      next: { revalidate: 60 * 60 * 24 },
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ItunesResponse<ItunesMovieLikeResult>;
    const item = payload.results[0];

    const resolvedTitle = item?.trackName ?? item?.collectionName;
    if (!resolvedTitle) {
      return null;
    }

    const year = item.releaseDate ? new Date(item.releaseDate).getFullYear().toString() : undefined;
    const subtitleParts = [item.primaryGenreName, year].filter(Boolean);

    return {
      title: resolvedTitle,
      subtitle: subtitleParts.length > 0 ? subtitleParts.join(" · ") : undefined,
      imageUrl: upscaleItunesArtwork(item.artworkUrl100),
      imageAlt: `${resolvedTitle} poster`,
      externalUrl: item.trackViewUrl ?? item.collectionViewUrl,
      sourceLabel: "iTunes"
    };
  } catch {
    return null;
  }
}

async function fetchWikipediaSummary(pageTitle: string): Promise<WikipediaSummaryResponse | null> {
  try {
    const summaryEndpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryResponse = await fetch(summaryEndpoint, {
      next: { revalidate: 60 * 60 * 24 },
      headers: {
        Accept: "application/json"
      }
    });

    if (!summaryResponse.ok) {
      return null;
    }

    return (await summaryResponse.json()) as WikipediaSummaryResponse;
  } catch {
    return null;
  }
}

export async function fetchWikipediaMovie(term: string, hints: MediaLookupHints = {}): Promise<PublicMediaResult | null> {
  try {
    if (hints.wikipediaPageTitle) {
      const directSummary = await fetchWikipediaSummary(hints.wikipediaPageTitle);

      if (directSummary?.title) {
        const directImage = directSummary.originalimage?.source ?? directSummary.thumbnail?.source;
        if (directImage) {
          return {
            title: directSummary.title,
            subtitle: directSummary.description,
            imageUrl: directImage,
            imageAlt: `${directSummary.title} poster`,
            externalUrl: directSummary.content_urls?.desktop?.page,
            sourceLabel: "Wikipedia"
          };
        }
      }
    }

    const searchEndpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`;
    const searchResponse = await fetch(searchEndpoint, {
      next: { revalidate: 60 * 60 * 24 },
      headers: {
        Accept: "application/json"
      }
    });

    if (!searchResponse.ok) {
      return fetchItunesMovieFallback(term);
    }

    const searchPayload = (await searchResponse.json()) as WikipediaSearchResponse;
    const candidates = (searchPayload.query?.search ?? [])
      .map((entry) => ({
        title: entry.title,
        score: scoreMatch(entry.title, undefined, hints, term)
      }))
      .sort((left, right) => right.score - left.score);

    const firstResult = candidates[0];

    if (!firstResult?.title || firstResult.score < 2) {
      return fetchItunesMovieFallback(term);
    }

    const summary = await fetchWikipediaSummary(firstResult.title);
    if (!summary?.title) {
      return fetchItunesMovieFallback(term);
    }

    const imageUrl = summary.originalimage?.source ?? summary.thumbnail?.source;

    if (!imageUrl) {
      return fetchItunesMovieFallback(term);
    }

    return {
      title: summary.title ?? firstResult.title,
      subtitle: summary.description,
      imageUrl,
      imageAlt: `${summary.title ?? firstResult.title} poster`,
      externalUrl: summary.content_urls?.desktop?.page,
      sourceLabel: "Wikipedia"
    };
  } catch {
    return fetchItunesMovieFallback(term);
  }
}
