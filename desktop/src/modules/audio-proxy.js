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
  createAudioProxyServer
};
