const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_CURRENTLY_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyAccessTokenResponse = {
  access_token: string;
};

type SpotifyTrack = {
  name: string;
  artists: Array<{ name: string }>;
};

type SpotifyCurrentlyPlayingResponse = {
  is_playing: boolean;
  item: SpotifyTrack | null;
};

type SpotifyRecentlyPlayedResponse = {
  items: Array<{
    track: SpotifyTrack;
  }>;
};

function getSpotifyCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  return { clientId, clientSecret, refreshToken };
}

async function getSpotifyAccessToken(): Promise<string | null> {
  const credentials = getSpotifyCredentials();

  if (!credentials) {
    return null;
  }

  const authHeader = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64");
  const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: credentials.refreshToken
    }),
    cache: "no-store"
  });

  if (!tokenResponse.ok) {
    return null;
  }

  const tokenData = (await tokenResponse.json()) as SpotifyAccessTokenResponse;
  return tokenData.access_token || null;
}

function formatTrack(track: SpotifyTrack) {
  const artists = track.artists.map((artist) => artist.name).join(", ");
  return `${artists} · ${track.name}`;
}

export async function getSpotifyListeningLabel(fallback: string): Promise<string> {
  try {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) {
      return fallback;
    }

    const currentlyPlayingResponse = await fetch(SPOTIFY_CURRENTLY_PLAYING_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });

    if (currentlyPlayingResponse.ok && currentlyPlayingResponse.status !== 204) {
      const currentlyPlaying = (await currentlyPlayingResponse.json()) as SpotifyCurrentlyPlayingResponse;
      if (currentlyPlaying.item) {
        return currentlyPlaying.is_playing
          ? `${formatTrack(currentlyPlaying.item)} (now playing)`
          : `${formatTrack(currentlyPlaying.item)} (latest)`;
      }
    }

    const recentlyPlayedResponse = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });

    if (!recentlyPlayedResponse.ok) {
      return fallback;
    }

    const recentlyPlayed = (await recentlyPlayedResponse.json()) as SpotifyRecentlyPlayedResponse;
    const latestTrack = recentlyPlayed.items[0]?.track;

    return latestTrack ? `${formatTrack(latestTrack)}` : fallback;
  } catch {
    return fallback;
  }
}