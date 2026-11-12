/**
 * html-safety.js
 *
 * Escaping helpers for building markup from remote metadata (YouTube Music,
 * iTunes, Deezer, LRCLIB...). Every value that came over the network must pass
 * through one of these before it is interpolated into an innerHTML template.
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Only schemes that cannot execute script. Relative paths resolve to bundled assets.
const SAFE_IMAGE_URL = /^(?:https?:\/\/|data:image\/(?:png|jpe?g|gif|webp|avif|svg\+xml)[;,]|blob:|assets\/)/i;

/**
 * Returns an image URL that is safe to place inside a quoted src/style
 * attribute, or inside the single-quoted string of an inline onerror handler.
 * Anything with an unexpected scheme is replaced by the fallback.
 */
function safeImageUrl(url, fallback) {
  const candidate = typeof url === 'string' ? url.trim() : '';
  const chosen = candidate && SAFE_IMAGE_URL.test(candidate) ? candidate : (fallback || '');
  return escapeHtml(chosen);
}

/**
 * Returns a URL safe to drop inside a CSS `url("...")` value. HTML escaping is
 * wrong here: CSS does not decode entities, so the characters that could close
 * the url() token are percent-encoded instead.
 */
function safeCssUrl(url, fallback) {
  const candidate = typeof url === 'string' ? url.trim() : '';
  const chosen = candidate && SAFE_IMAGE_URL.test(candidate) ? candidate : (fallback || '');
  return chosen.replace(/["'()\\\s]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { escapeHtml, safeImageUrl, safeCssUrl };
}

if (typeof window !== 'undefined') {
  window.HtmlSafety = { escapeHtml, safeImageUrl, safeCssUrl };
}
