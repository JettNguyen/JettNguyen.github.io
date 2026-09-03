#!/usr/bin/env node
// One-time helper that mints the Spotify refresh token sync-spotify.js needs.
// It runs a tiny server on the loopback address, opens the consent page, catches
// the redirect, exchanges the code, and prints the refresh token. Nothing is
// stored. No deps.
//
// Usage: SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... node scripts/spotify-auth.js
//
// The app in the Spotify dashboard must list exactly this redirect URI:
//   http://127.0.0.1:8888/callback
// Spotify no longer accepts "localhost"; it has to be the loopback IP, and
// plain http is only allowed for loopback addresses.

const http = require('http');
const { execFile } = require('child_process');

const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const id = process.env.SPOTIFY_CLIENT_ID?.trim();
const secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
if (!id || !secret) { console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.'); process.exit(1); }

const state = Math.random().toString(36).slice(2);
const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  client_id: id, response_type: 'code', redirect_uri: REDIRECT, scope: SCOPES, state,
});

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== '/callback') { res.writeHead(404); res.end(); return; }
  if (url.searchParams.get('state') !== state) { res.writeHead(400); res.end('state mismatch'); return; }
  const err = url.searchParams.get('error');
  if (err) { res.end(`Spotify said: ${err}`); console.error('Denied:', err); server.close(); return; }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: REDIRECT }),
    });
    const body = await tokenRes.json();
    if (!tokenRes.ok || !body.refresh_token) throw new Error(JSON.stringify(body));
    res.end('Done. You can close this tab and go back to the terminal.');
    console.log('\nSPOTIFY_REFRESH_TOKEN=' + body.refresh_token + '\n');
    console.log('Add it to the repo with:  gh secret set SPOTIFY_REFRESH_TOKEN');
  } catch (e) {
    res.writeHead(500); res.end('Token exchange failed; see terminal.');
    console.error('Token exchange failed:', e.message);
  } finally {
    server.close();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Opening Spotify consent page. If the browser does not open, visit:\n\n' + authUrl + '\n');
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  execFile(opener, [authUrl], () => {});
});
