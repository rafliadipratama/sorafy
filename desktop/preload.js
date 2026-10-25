const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  resolveFullStream: (data) => ipcRenderer.invoke('resolve-full-stream', data),
  getVideoEmbedUrl: (data) => ipcRenderer.invoke('get-video-embed-url', data),
  resolveDirectVideo: (videoId) => ipcRenderer.invoke('resolve-direct-video', videoId),
  searchYouTubeMusic: (query, filterType) => ipcRenderer.invoke('search-yt-music', query, filterType),
  browseYouTube: (browseId) => ipcRenderer.invoke('browse-yt', browseId),
  resolveArtistProfile: (name) => ipcRenderer.invoke('resolve-artist-profile', name),
  fetchYouTubeLyrics: (videoId) => ipcRenderer.invoke('fetch-yt-lyrics', videoId),
  importExternalPlaylist: (url) => ipcRenderer.invoke('import-external-playlist', url),
  downloadTrack: (track) => ipcRenderer.invoke('download-track', track),
  saveBackupFile: (data) => ipcRenderer.invoke('save-backup-file', data),
  loadBackupFile: () => ipcRenderer.invoke('load-backup-file'),
  onMediaAction: (callback) => {
    ipcRenderer.on('media-action', (_event, action) => {
      if (typeof callback === 'function') callback(action);
    });
  }
});
