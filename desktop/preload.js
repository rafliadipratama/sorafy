const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  resolveFullStream: (data) => ipcRenderer.invoke('resolve-full-stream', data),
  getVideoEmbedUrl: (data) => ipcRenderer.invoke('get-video-embed-url', data),
  resolveDirectVideo: (videoId) => ipcRenderer.invoke('resolve-direct-video', videoId),
  searchYouTubeMusic: (query, filterType) => ipcRenderer.invoke('search-yt-music', query, filterType),
  browseYouTube: (browseId) => ipcRenderer.invoke('browse-yt', browseId),
  getYtHomeFeed: (lang) => ipcRenderer.invoke('get-yt-home-feed', lang),
  resolveArtistProfile: (name) => ipcRenderer.invoke('resolve-artist-profile', name),
  fetchYouTubeLyrics: (videoId) => ipcRenderer.invoke('fetch-yt-lyrics', videoId),
  importExternalPlaylist: (url) => ipcRenderer.invoke('import-external-playlist', url),
  downloadTrack: (track) => ipcRenderer.invoke('download-track', track),
  saveBackupFile: (data) => ipcRenderer.invoke('save-backup-file', data),
  loadBackupFile: () => ipcRenderer.invoke('load-backup-file'),
  showTrackNotification: (track) => ipcRenderer.send('show-track-notification', track),
  updateDiscordPresence: (presence) => ipcRenderer.send('update-discord-presence', presence),
  clearDiscordPresence: () => ipcRenderer.send('clear-discord-presence'),
  getAppSettings: () => ipcRenderer.invoke('get-app-settings'),
  saveAppSettings: (settings) => ipcRenderer.invoke('save-app-settings', settings),
  clearAppCache: () => ipcRenderer.invoke('clear-app-cache'),
  pruneAudioCache: () => ipcRenderer.invoke('prune-audio-cache'),
  saveUserPlaylistsDisk: (playlists) => ipcRenderer.invoke('save-user-playlists-disk', playlists),
  loadUserPlaylistsDisk: () => ipcRenderer.invoke('load-user-playlists-disk'),
  selectYouTubeCookie: () => ipcRenderer.invoke('select-youtube-cookie'),
  clearYouTubeCookie: () => ipcRenderer.invoke('clear-youtube-cookie'),
  getYouTubeCookieStatus: () => ipcRenderer.invoke('get-youtube-cookie-status'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getDownloadedTracks: () => ipcRenderer.invoke('get-downloaded-tracks'),
  deleteDownloadedTrack: (filePath) => ipcRenderer.invoke('delete-downloaded-track', filePath),
  openDownloadFolder: () => ipcRenderer.invoke('open-download-folder'),
  checkYtDlpStatus: () => ipcRenderer.invoke('check-yt-dlp-status'),
  downloadYtDlpBinary: () => ipcRenderer.invoke('download-yt-dlp-binary'),
  savePlaybackSession: (session) => ipcRenderer.invoke('save-playback-session', session),
  loadPlaybackSession: () => ipcRenderer.invoke('load-playback-session'),
  getVerifiedStream: (data) => ipcRenderer.invoke('get-verified-stream', data),
  verifyStreamCandidate: (data) => ipcRenderer.invoke('verify-stream-candidate', data),
  unverifyStream: (data) => ipcRenderer.invoke('unverify-stream', data),
  getStreamCandidates: (data) => ipcRenderer.invoke('get-stream-candidates', data),
  getJamInfo: () => ipcRenderer.invoke('get-jam-info'),
  sendJamState: (state) => ipcRenderer.send('update-jam-state', state),
  onJamAction: (callback) => {
    ipcRenderer.on('jam-action', (_event, action) => {
      if (typeof callback === 'function') callback(action);
    });
  },
  onAppBeforeClose: (callback) => {
    ipcRenderer.on('app-before-close', () => {
      if (typeof callback === 'function') callback();
    });
  },
  onMediaAction: (callback) => {
    ipcRenderer.on('media-action', (_event, action) => {
      if (typeof callback === 'function') callback(action);
    });
  }
});
