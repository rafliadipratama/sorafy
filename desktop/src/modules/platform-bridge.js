/**
 * SoraFy Desktop - Universal Platform Bridge
 * Isomorphic runtime bridge supporting Electron, Tauri v2, and Web
 */

const DEFAULT_APP_SETTINGS = {
  theme: 'dark',
  audioQuality: 'high',
  volumeNormalization: true,
  crossfadeDuration: 4,
  autoCacheAudio: true,
  offlineFirstMode: true,
  discordRpc: true,
  language: 'id',
  canvasBackground: false,
  downloadFormat: 'mp3',
  lyricsSyncOffset: 0
};

function createMemoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear()
  };
}

class PlatformBridge {
  constructor(options = {}) {
    const win = options.window || (typeof window !== 'undefined' ? window : null);
    this._win = win;

    // Direct electronAPI passed or found on window
    const explicitElectron = options.electronAPI || (win && win.electronAPI && !win.electronAPI._isBridge ? win.electronAPI : null);

    // Tauri invoke resolver
    const tauriInvoke = options.tauriInvoke || (win && win.__TAURI__ && (win.__TAURI__.core?.invoke || win.__TAURI__.invoke)) || null;

    // Storage resolver
    this._storage = options.storage || (win && win.localStorage ? win.localStorage : createMemoryStorage());

    // Determine runtime
    if (options.runtime) {
      this.runtime = options.runtime;
    } else if (explicitElectron) {
      this.runtime = 'electron';
    } else if (win && (win.__TAURI__ || win.__TAURI_INTERNALS__)) {
      this.runtime = 'tauri';
    } else {
      this.runtime = 'web';
    }

    this.isElectron = this.runtime === 'electron';
    this.isTauri = this.runtime === 'tauri';
    this.isWeb = this.runtime === 'web';
    this._isBridge = true;

    this._electronAPI = explicitElectron;
    this._tauriInvoke = tauriInvoke;

    this._listeners = {
      downloadPlaylistProgress: new Set(),
      downloadProgress: new Set(),
      jamAction: new Set(),
      appBeforeClose: new Set(),
      mediaAction: new Set()
    };
  }

  async _invoke(cmd, args) {
    if (typeof this._tauriInvoke === 'function') {
      return await this._tauriInvoke(cmd, args);
    }
    const win = this._win || (typeof window !== 'undefined' ? window : null);
    const globalInvoke = win && win.__TAURI__ && (win.__TAURI__.core?.invoke || win.__TAURI__.invoke);
    if (typeof globalInvoke === 'function') {
      return await globalInvoke(cmd, args);
    }
    throw new Error(`Tauri invoke unavailable for command: ${cmd}`);
  }

  static _unwrap(res) {
    if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
      return res.data;
    }
    return res;
  }

  _unwrap(res) {
    return PlatformBridge._unwrap(res);
  }

  // --- Core Media & Catalog Methods ---

  async resolveFullStream(data) {
    if (this.isElectron && this._electronAPI?.resolveFullStream) {
      return await this._electronAPI.resolveFullStream(data);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('resolve_full_stream', { data });
        return this._unwrap(res);
      } catch (err) {
        console.warn('Tauri resolve_full_stream failed, falling back:', err);
      }
    }
    return null;
  }

  async getVideoEmbedUrl(data) {
    if (this.isElectron && this._electronAPI?.getVideoEmbedUrl) {
      return await this._electronAPI.getVideoEmbedUrl(data);
    }
    return null;
  }

  async resolveDirectVideo(videoId) {
    if (this.isElectron && this._electronAPI?.resolveDirectVideo) {
      return await this._electronAPI.resolveDirectVideo(videoId);
    }
    return null;
  }

  async searchYouTubeMusic(query, filterType = 'song') {
    if (this.isElectron && this._electronAPI?.searchYouTubeMusic) {
      return await this._electronAPI.searchYouTubeMusic(query, filterType);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('search_tracks', { query, filterType });
        const unwrapped = this._unwrap(res);
        return Array.isArray(unwrapped)
          ? unwrapped.map((t) => ({
              ...t,
              thumbnail_url: t.thumbnail_url || t.artwork_url || null,
              artwork_url: t.artwork_url || t.thumbnail_url || null
            }))
          : [];
      } catch (err) {
        console.warn('Tauri search_tracks failed:', err);
      }
    }
    return [];
  }

  async getSearchSuggestions(query) {
    if (this.isElectron && this._electronAPI?.getSearchSuggestions) {
      return await this._electronAPI.getSearchSuggestions(query);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('get_search_suggestions', { query });
        const unwrapped = this._unwrap(res);
        if (Array.isArray(unwrapped)) {
          return unwrapped;
        }
      } catch (err) {
        console.warn('Tauri get_search_suggestions failed:', err);
      }
    }
    return [];
  }

  async browseYouTube(browseId) {
    if (this.isElectron && this._electronAPI?.browseYouTube) {
      return await this._electronAPI.browseYouTube(browseId);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('browse_yt', { browseId });
        const unwrapped = this._unwrap(res);
        if (unwrapped && typeof unwrapped === 'object') {
          return unwrapped;
        }
      } catch (err) {
        console.warn('Tauri browse_yt failed:', err);
      }
    }
    return { success: true, tracks: [] };
  }

  async getYtHomeFeed(lang = 'en') {
    if (this.isElectron && this._electronAPI?.getYtHomeFeed) {
      return await this._electronAPI.getYtHomeFeed(lang);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('get_yt_home_feed', { lang });
        const unwrapped = this._unwrap(res);
        if (unwrapped && typeof unwrapped === 'object') {
          return unwrapped;
        }
      } catch (err) {
        console.warn('Tauri get_yt_home_feed failed:', err);
      }
    }
    return { success: true, quickPicks: [] };
  }

  async resolveArtistProfile(name) {
    if (this.isElectron && this._electronAPI?.resolveArtistProfile) {
      return await this._electronAPI.resolveArtistProfile(name);
    }
    return null;
  }

  async fetchLyrics(request) {
    const payload = typeof request === 'string' ? { videoId: request } : (request || {});
    if (this.isElectron && this._electronAPI?.fetchLyrics) {
      return await this._electronAPI.fetchLyrics(payload);
    }
    if (this.isElectron && this._electronAPI?.fetchYouTubeLyrics) {
      return await this._electronAPI.fetchYouTubeLyrics(payload.videoId || payload.id);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('fetch_lyrics', payload);
        return this._unwrap(res);
      } catch (err) {
        console.warn('Tauri fetch_lyrics failed:', err);
      }
    }
    return null;
  }

  async fetchYouTubeLyrics(videoId, title, artist, duration) {
    if (typeof videoId === 'object' && videoId !== null) {
      return await this.fetchLyrics(videoId);
    }
    if (title !== undefined || artist !== undefined || duration !== undefined) {
      return await this.fetchLyrics({ videoId, title, artist, duration });
    }
    if (this.isElectron && this._electronAPI?.fetchYouTubeLyrics) {
      return await this._electronAPI.fetchYouTubeLyrics(videoId);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('fetch_lyrics', { videoId });
        return this._unwrap(res);
      } catch (err) {
        console.warn('Tauri fetch_lyrics failed:', err);
      }
    }
    return null;
  }

  async fetchYouTubeRadioQueue(videoId, continuationToken) {
    if (this.isElectron && this._electronAPI?.fetchYouTubeRadioQueue) {
      return await this._electronAPI.fetchYouTubeRadioQueue(videoId, continuationToken);
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('fetch_yt_radio_queue', { videoId, continuationToken });
        const unwrapped = this._unwrap(res);
        if (unwrapped && Array.isArray(unwrapped.tracks)) {
          return unwrapped;
        }
      } catch (err) {
        console.warn('Tauri fetch_yt_radio_queue failed:', err);
      }
    }
    return { tracks: [], continuation: null };
  }

  async importExternalPlaylist(url) {
    if (this.isElectron && this._electronAPI?.importExternalPlaylist) {
      return await this._electronAPI.importExternalPlaylist(url);
    }
    return [];
  }

  // --- Settings & Persistence ---

  async getAppSettings() {
    if (this.isElectron && this._electronAPI?.getAppSettings) {
      return await this._electronAPI.getAppSettings();
    }
    if (this.isTauri) {
      try {
        const res = await this._invoke('get_app_settings');
        const unwrapped = this._unwrap(res);
        if (unwrapped && typeof unwrapped === 'object') {
          return { ...DEFAULT_APP_SETTINGS, ...unwrapped };
        }
      } catch (_) {}
    }
    try {
      const raw = this._storage?.getItem('sorafy_app_settings');
      if (raw) return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
    } catch (_) {}
    return { ...DEFAULT_APP_SETTINGS };
  }

  async saveAppSettings(settings) {
    if (this.isElectron && this._electronAPI?.saveAppSettings) {
      return await this._electronAPI.saveAppSettings(settings);
    }
    if (this.isTauri) {
      try {
        await this._invoke('save_app_settings', { settings });
      } catch (_) {}
    }
    try {
      this._storage?.setItem('sorafy_app_settings', JSON.stringify(settings));
    } catch (_) {}
    return settings;
  }

  async loadPlaybackSession() {
    if (this.isElectron && this._electronAPI?.loadPlaybackSession) {
      return await this._electronAPI.loadPlaybackSession();
    }
    try {
      const raw = this._storage?.getItem('sorafy_last_playback_session');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  async savePlaybackSession(session) {
    if (this.isElectron && this._electronAPI?.savePlaybackSession) {
      return await this._electronAPI.savePlaybackSession(session);
    }
    try {
      this._storage?.setItem('sorafy_last_playback_session', JSON.stringify(session));
      return true;
    } catch (_) {
      return false;
    }
  }

  savePlaybackSessionSync(session) {
    if (this.isElectron && this._electronAPI?.savePlaybackSessionSync) {
      return this._electronAPI.savePlaybackSessionSync(session);
    }
    try {
      this._storage?.setItem('sorafy_last_playback_session', JSON.stringify(session));
      return true;
    } catch (_) {
      return false;
    }
  }

  async saveUserPlaylistsDisk(playlists) {
    if (this.isElectron && this._electronAPI?.saveUserPlaylistsDisk) {
      return await this._electronAPI.saveUserPlaylistsDisk(playlists);
    }
    try {
      this._storage?.setItem('sorafy_user_playlists', JSON.stringify(playlists));
      return true;
    } catch (_) {
      return false;
    }
  }

  async loadUserPlaylistsDisk() {
    if (this.isElectron && this._electronAPI?.loadUserPlaylistsDisk) {
      return await this._electronAPI.loadUserPlaylistsDisk();
    }
    try {
      const raw = this._storage?.getItem('sorafy_user_playlists');
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  }

  // --- Offline & Downloads ---

  async checkLocalAudioExists(track) {
    if (this.isElectron && this._electronAPI?.checkLocalAudioExists) {
      return await this._electronAPI.checkLocalAudioExists(track);
    }
    return false;
  }

  async downloadTrack(track) {
    if (this.isElectron && this._electronAPI?.downloadTrack) {
      return await this._electronAPI.downloadTrack(track);
    }
    return { success: false };
  }

  async downloadPlaylistBatch(data) {
    if (this.isElectron && this._electronAPI?.downloadPlaylistBatch) {
      return await this._electronAPI.downloadPlaylistBatch(data);
    }
    return { success: false };
  }

  async getDownloadedTracks() {
    if (this.isElectron && this._electronAPI?.getDownloadedTracks) {
      return await this._electronAPI.getDownloadedTracks();
    }
    return [];
  }

  async deleteDownloadedTrack(filePath) {
    if (this.isElectron && this._electronAPI?.deleteDownloadedTrack) {
      return await this._electronAPI.deleteDownloadedTrack(filePath);
    }
    return { success: true };
  }

  async openDownloadFolder() {
    if (this.isElectron && this._electronAPI?.openDownloadFolder) {
      return await this._electronAPI.openDownloadFolder();
    }
    return false;
  }

  // --- Statistics & Events ---

  async recordListenEvent(eventData) {
    if (this.isElectron && this._electronAPI?.recordListenEvent) {
      return await this._electronAPI.recordListenEvent(eventData);
    }
    return { success: true };
  }

  async getListeningStats() {
    if (this.isElectron && this._electronAPI?.getListeningStats) {
      return await this._electronAPI.getListeningStats();
    }
    return { success: true, events: [] };
  }

  async clearListeningStats() {
    if (this.isElectron && this._electronAPI?.clearListeningStats) {
      return await this._electronAPI.clearListeningStats();
    }
    return { success: true };
  }

  // --- Miscellaneous Stubs & Helpers ---

  async saveBackupFile(data) {
    if (this.isElectron && this._electronAPI?.saveBackupFile) {
      return await this._electronAPI.saveBackupFile(data);
    }
    return { success: false };
  }

  async loadBackupFile() {
    if (this.isElectron && this._electronAPI?.loadBackupFile) {
      return await this._electronAPI.loadBackupFile();
    }
    return null;
  }

  showTrackNotification(track) {
    if (this.isElectron && this._electronAPI?.showTrackNotification) {
      this._electronAPI.showTrackNotification(track);
    }
  }

  updateDiscordPresence(presence) {
    if (this.isElectron && this._electronAPI?.updateDiscordPresence) {
      this._electronAPI.updateDiscordPresence(presence);
    }
  }

  clearDiscordPresence() {
    if (this.isElectron && this._electronAPI?.clearDiscordPresence) {
      this._electronAPI.clearDiscordPresence();
    }
  }

  setThumbarState(state) {
    if (this.isElectron && this._electronAPI?.setThumbarState) {
      this._electronAPI.setThumbarState(state);
    }
  }

  async clearAppCache() {
    if (this.isElectron && this._electronAPI?.clearAppCache) {
      return await this._electronAPI.clearAppCache();
    }
    return { success: true };
  }

  async pruneAudioCache() {
    if (this.isElectron && this._electronAPI?.pruneAudioCache) {
      return await this._electronAPI.pruneAudioCache();
    }
    return { success: true };
  }

  async selectYouTubeCookie() {
    if (this.isElectron && this._electronAPI?.selectYouTubeCookie) {
      return await this._electronAPI.selectYouTubeCookie();
    }
    return { success: false };
  }

  async clearYouTubeCookie() {
    if (this.isElectron && this._electronAPI?.clearYouTubeCookie) {
      return await this._electronAPI.clearYouTubeCookie();
    }
    return { success: true };
  }

  async getYouTubeCookieStatus() {
    if (this.isElectron && this._electronAPI?.getYouTubeCookieStatus) {
      return await this._electronAPI.getYouTubeCookieStatus();
    }
    return { hasCookie: false, valid: false };
  }

  async checkForUpdates() {
    if (this.isElectron && this._electronAPI?.checkForUpdates) {
      return await this._electronAPI.checkForUpdates();
    }
    return { updateAvailable: false };
  }

  async checkYtDlpStatus() {
    if (this.isElectron && this._electronAPI?.checkYtDlpStatus) {
      return await this._electronAPI.checkYtDlpStatus();
    }
    return { available: false };
  }

  async downloadYtDlpBinary() {
    if (this.isElectron && this._electronAPI?.downloadYtDlpBinary) {
      return await this._electronAPI.downloadYtDlpBinary();
    }
    return { success: false };
  }

  async getVerifiedStream(data) {
    if (this.isElectron && this._electronAPI?.getVerifiedStream) {
      return await this._electronAPI.getVerifiedStream(data);
    }
    return null;
  }

  async verifyStreamCandidate(data) {
    if (this.isElectron && this._electronAPI?.verifyStreamCandidate) {
      return await this._electronAPI.verifyStreamCandidate(data);
    }
    return { success: true };
  }

  async unverifyStream(data) {
    if (this.isElectron && this._electronAPI?.unverifyStream) {
      return await this._electronAPI.unverifyStream(data);
    }
    return { success: true };
  }

  async getStreamCandidates(data) {
    if (this.isElectron && this._electronAPI?.getStreamCandidates) {
      return await this._electronAPI.getStreamCandidates(data);
    }
    return [];
  }

  async getJamInfo() {
    if (this.isElectron && this._electronAPI?.getJamInfo) {
      return await this._electronAPI.getJamInfo();
    }
    return null;
  }

  sendJamState(state) {
    if (this.isElectron && this._electronAPI?.sendJamState) {
      this._electronAPI.sendJamState(state);
    }
  }

  async getMcpInfo() {
    if (this.isElectron && this._electronAPI?.getMcpInfo) {
      return await this._electronAPI.getMcpInfo();
    }
    return null;
  }

  async getSystemInfo() {
    if (this.isTauri) {
      try {
        const res = await this._invoke('get_system_info');
        return this._unwrap(res);
      } catch (_) {}
    }
    return { runtime: this.runtime };
  }

  // --- Event Listeners ---

  onDownloadPlaylistProgress(callback) {
    if (this.isElectron && this._electronAPI?.onDownloadPlaylistProgress) {
      return this._electronAPI.onDownloadPlaylistProgress(callback);
    }
    if (typeof callback === 'function') {
      this._listeners.downloadPlaylistProgress.add(callback);
    }
  }

  onDownloadProgress(callback) {
    if (this.isElectron && this._electronAPI?.onDownloadProgress) {
      return this._electronAPI.onDownloadProgress(callback);
    }
    if (typeof callback === 'function') {
      this._listeners.downloadProgress.add(callback);
    }
  }

  onJamAction(callback) {
    if (this.isElectron && this._electronAPI?.onJamAction) {
      return this._electronAPI.onJamAction(callback);
    }
    if (typeof callback === 'function') {
      this._listeners.jamAction.add(callback);
    }
  }

  onAppBeforeClose(callback) {
    if (this.isElectron && this._electronAPI?.onAppBeforeClose) {
      return this._electronAPI.onAppBeforeClose(callback);
    }
    if (typeof callback === 'function') {
      this._listeners.appBeforeClose.add(callback);
    }
  }

  onMediaAction(callback) {
    if (this.isElectron && this._electronAPI?.onMediaAction) {
      return this._electronAPI.onMediaAction(callback);
    }
    if (typeof callback === 'function') {
      this._listeners.mediaAction.add(callback);
    }
  }
}

function createBridge(options = {}) {
  return new PlatformBridge(options);
}

function initGlobalBridge(win = (typeof window !== 'undefined' ? window : null)) {
  if (!win) return null;

  if (!win.sorafyBridge) {
    win.sorafyBridge = createBridge({ window: win });
  }
  win.PlatformBridge = PlatformBridge;

  if (!win.electronAPI) {
    win.electronAPI = win.sorafyBridge;
  }
  return win.sorafyBridge;
}

// Auto-initialize when loaded in a browser/DOM environment
if (typeof window !== 'undefined') {
  initGlobalBridge(window);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PlatformBridge,
    createBridge,
    initGlobalBridge,
    DEFAULT_APP_SETTINGS
  };
}
