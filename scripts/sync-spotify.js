#!/usr/bin/env node
// Rewrites liveSignals.currentlyListening and listeningLabel in data.js with
// what Spotify is playing right now, or the last track played. No deps.
// Usage: SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... SPOTIFY_REFRESH_TOKEN=... node scripts/sync-spotify.js
//
// The refresh token is minted once by hand with the user-read-currently-playing
// and user-read-recently-played scopes; this script only ever exchanges it for
// a short-lived access token, so nothing user-facing holds a credential.

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data.js');
const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

function credentials() {
  const id = process.env.SPOTIFY_CLIENT_ID?.trim();
  const secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN?.trim();
  if (!id || !secret || !refresh) throw new Error('SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN are required');
  return { id, secret, refresh };
}

async function accessToken() {
  const { id, secret, refresh } = credentials();
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!res.ok) throw new Error(`token exchange returned ${res.status}`);
  return (await res.json()).access_token;
}

const format = track => `${track.name} · ${track.artists.map(a => a.name).join(', ')}`;

async function currentTrack(token) {
  const headers = { Authorization: `Bearer ${token}` };

  // 204 means nothing is playing. Anything else with a track is live.
  const now = await fetch(NOW_URL, { headers });
  if (now.status === 200) {
    const body = await now.json();
    if (body.is_playing && body.item?.name) return { label: 'listening', value: format(body.item) };
  } else if (now.status !== 204) {
    throw new Error(`currently-playing returned ${now.status}`);
  }

  const recent = await fetch(RECENT_URL, { headers });
  if (!recent.ok) throw new Error(`recently-played returned ${recent.status}`);
  const item = (await recent.json()).items?.[0]?.track;
  if (!item?.name) return null;
  return { label: 'last played', value: format(item) };
}

function rewrite(field, value) {
  const src = fs.readFileSync(DATA_FILE, 'utf8');
  const pattern = new RegExp(`${field}:\\s*"(?:[^"\\\\]|\\\\.)*"`);
  if (!pattern.test(src)) throw new Error(`${field} not found in data.js`);
  const next = src.replace(pattern, `${field}:${JSON.stringify(value)}`);
  if (next !== src) fs.writeFileSync(DATA_FILE, next);
  return next !== src;
}

async function main() {
  const track = await currentTrack(await accessToken());
  if (!track) { console.log('No track available; data.js unchanged.'); return; }
  const changed = rewrite('currentlyListening', track.value) | rewrite('listeningLabel', track.label);
  console.log(changed ? `Updated: ${track.label}: ${track.value}` : `Unchanged: ${track.value}`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
