/**
 * SoraFy Audio Proxy Helpers & Contracts
 * Shared contracts between JavaScript platform layer and Rust Tokio local audio proxy
 */

const http = require('node:http');

const AUDIO_PROXY_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Range, Content-Type, Accept',
  'Accept-Ranges': 'bytes'
};

/**
 * Format a remote audio stream URL to route through the local loopback proxy
 * @param {string} targetUrl - Original remote stream URL
 * @param {number} port - Local proxy listening port
 * @returns {string} Proxied local URL
 */
function buildProxiedAudioUrl(targetUrl, port) {
  if (!targetUrl) return '';
  return `http://127.0.0.1:${port}/stream?url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Extract original target URL from a proxied local URL
 * @param {string} proxyUrl - Proxied local URL
 * @returns {string|null} Extracted target URL or null
 */
function extractTargetStreamUrl(proxyUrl) {
  if (!proxyUrl || typeof proxyUrl !== 'string') return null;
  try {
    const parsed = new URL(proxyUrl);
    if (parsed.pathname !== '/stream') return null;
    return parsed.searchParams.get('url');
  } catch {
    return null;
  }
}

/**
 * Decide whether a /stream target may be fetched upstream.
 * The proxy is reachable by any page that guesses its loopback port, so an
 * unrestricted target would let it reach localhost and link-local services.
 * @param {string} target - Upstream URL taken from the url query parameter
 * @returns {boolean}
 */
function isAllowedStreamTarget(target) {
  if (!target || typeof target !== 'string') return false;
  try {
    const { protocol, hostname, username, password } = new URL(target);
    if (protocol !== 'https:' || username || password) return false;
    return hostname === 'googlevideo.com' || hostname.endsWith('.googlevideo.com');
  } catch {
    return false;
  }
}

// Long enough for a slow or VPN link to answer a HEAD, short enough that a
// firewalled googlevideo host still hands over to yt-dlp and JioSaavn quickly.
const STREAM_PREFLIGHT_TIMEOUT_MS = 2500;

/**
 * Check that a stream URL answers before handing it to the player.
 * YouTube rejects unauthenticated iOS streams on some egress IPs (e.g. Cloudflare WARP) with 403.
 * A timeout counts as a failure on purpose: networks that block YouTube hang here,
 * and the caller relies on that to move to another provider.
 * @param {string} url - Upstream stream URL
 * @param {string} userAgent - Must match the client the URL was issued to
 * @param {typeof fetch} [fetchImpl] - Injected for tests
 * @returns {Promise<boolean>} Whether the stream is playable
 */
async function preflightStream(url, userAgent, fetchImpl = fetch) {
  try {
    const res = await fetchImpl(url, {
      method: 'HEAD',
      headers: { 'User-Agent': userAgent },
      signal: AbortSignal.timeout(STREAM_PREFLIGHT_TIMEOUT_MS)
    });
    if (res.status === 200 || res.status === 206) return true;
    console.warn(`Stream pre-flight returned HTTP ${res.status}`);
    return false;
  } catch (err) {
    console.warn('Stream pre-flight notice:', err?.message || err);
    return false;
  }
}

/**
 * Create a lightweight reference / test HTTP server following audio proxy contracts
 * @returns {http.Server}
 */
function createAudioProxyServer() {
  return http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, AUDIO_PROXY_CORS_HEADERS);
      return res.end();
    }

    if (reqUrl.pathname === '/stream') {
      const target = reqUrl.searchParams.get('url');
      if (!target) {
        res.writeHead(400, {
          'Content-Type': 'text/plain',
          ...AUDIO_PROXY_CORS_HEADERS
        });
        return res.end('Missing target url');
      }

      // Valid stream request
      res.writeHead(200, {
        'Content-Type': 'audio/webm',
        ...AUDIO_PROXY_CORS_HEADERS
      });
      return res.end();
    }

    res.writeHead(404, AUDIO_PROXY_CORS_HEADERS);
    res.end('Not Found');
  });
}

module.exports = {
  AUDIO_PROXY_CORS_HEADERS,
  buildProxiedAudioUrl,
  extractTargetStreamUrl,
  isAllowedStreamTarget,
  STREAM_PREFLIGHT_TIMEOUT_MS,
  preflightStream,
  createAudioProxyServer
};
